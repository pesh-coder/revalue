"""Back up the local review database/media and optionally prove restoration to *_restore.

Secrets are read from ignored .env.local and passed only through the child environment.
This script refuses remote databases and never restores over the source database.
"""
import argparse,datetime,hashlib,json,os,shutil,subprocess
from pathlib import Path
from urllib.parse import urlparse,unquote

root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--verify-restore',action='store_true');args=parser.parse_args()
values=dict(line.split('=',1) for line in (root/'.env.local').read_text().splitlines() if '=' in line and not line.startswith('#'))
uri=urlparse(values['DATABASE_URL'])
if uri.hostname not in ('127.0.0.1','localhost'):raise SystemExit('This helper is restricted to local review databases.')
source=uri.path.lstrip('/');restore=source+'_restore'
env=os.environ.copy();env['PGPASSWORD']=unquote(uri.password or '')
binary=Path(os.environ.get('POSTGRES_BIN','C:/Program Files/PostgreSQL/18/bin'))
connection=['-h',uri.hostname,'-p',str(uri.port or 5432),'-U',unquote(uri.username or '')]
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
backup=root/'.local'/'backups'/stamp;backup.mkdir(parents=True)
def run(program,arguments):
 result=subprocess.run([str(binary/(program+'.exe')),*arguments],env=env,text=True,capture_output=True)
 if result.returncode:raise RuntimeError(f'{program} failed: {result.stderr}')
 return result.stdout
run('pg_dump',[*connection,'-d',source,'-Fc','--no-owner','--no-acl','-f',str(backup/'database.dump')])
manifest={}
for directory in ('media','files'):
 if (root/directory).exists():
  shutil.copytree(root/directory,backup/directory)
  for file in (backup/directory).rglob('*'):
   if file.is_file():manifest[str(file.relative_to(backup))]=hashlib.sha256(file.read_bytes()).hexdigest()
(backup/'media-sha256.json').write_text(json.dumps(manifest,indent=2))
report={'date':stamp,'backup':'ignored local backup','mediaFiles':len(manifest),'restored':False}
if args.verify_restore:
 if not restore.endswith('_restore') or restore==source:raise SystemExit('Invalid restore target.')
 run('pg_restore',[*connection,'-d',restore,'--clean','--if-exists','--no-owner','--no-acl',str(backup/'database.dump')])
 query="SELECT json_build_object('posts',(SELECT count(*) FROM posts),'users',(SELECT count(*) FROM users),'media',(SELECT count(*) FROM media),'enquiries',(SELECT count(*) FROM enquiries),'migrations',(SELECT count(*) FROM payload_migrations));"
 before=json.loads(run('psql',[*connection,'-d',source,'-tA','-c',query]))
 after=json.loads(run('psql',[*connection,'-d',restore,'-tA','-c',query]))
 assert before==after,(before,after)
 restored=root/'.local'/'restore-check'/stamp;restored.mkdir(parents=True)
 for directory in ('media','files'):
  if (backup/directory).exists():shutil.copytree(backup/directory,restored/directory)
 for filename,digest in manifest.items():assert hashlib.sha256((restored/filename).read_bytes()).hexdigest()==digest
 report.update(restored=True,countsMatch=True,mediaHashesMatch=True,counts=after)
(root/'artifacts').mkdir(exist_ok=True)
(root/'artifacts'/'backup-restore-check.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))

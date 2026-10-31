"""Temporarily stop only this workspace's isolated PostgreSQL cluster and test warm pages."""
import json,subprocess,time,urllib.request
from pathlib import Path
from urllib.parse import urlparse
root=Path(__file__).resolve().parents[1]
values=dict(line.split('=',1) for line in (root/'.env.local').read_text().splitlines() if '=' in line and not line.startswith('#'))
uri=urlparse(values['DATABASE_URL']);cluster=(root/'.local/postgres').resolve()
if uri.hostname not in ('localhost','127.0.0.1') or uri.port!=55433 or not cluster.is_relative_to(root):raise SystemExit('Only the isolated workspace cluster on port 55433 may be stopped.')
if (cluster/'postmaster.pid').read_text().splitlines()[3]!='55433':raise SystemExit('Unexpected cluster port.')
ctl='C:/Program Files/PostgreSQL/18/bin/pg_ctl.exe'
paths=['/','/about','/resources/blog/what-is-a-waste-audit']
def fetch(path):
 start=time.monotonic()
 with urllib.request.urlopen('http://localhost:3000'+path,timeout=15) as response:return {'path':path,'status':response.status,'hasContent':b'Revalue' in response.read(),'seconds':round(time.monotonic()-start,2)}
for path in paths:assert fetch(path)['status']==200
checks=[]
try:
 with (root/'.local/outage-control.log').open('a') as log:
  subprocess.run([ctl,'-D',str(cluster),'stop','-m','fast'],check=True,stdout=log,stderr=subprocess.STDOUT,text=True)
 for path in paths:checks.append(fetch(path))
finally:
 with (root/'.local/outage-control.log').open('a') as log:
  subprocess.run([ctl,'-D',str(cluster),'-l',str(root/'.local/postgres.log'),'-o','-h 127.0.0.1 -p 55433','start'],check=True,stdout=log,stderr=subprocess.STDOUT,text=True)
report={'environment':'isolated local PostgreSQL','restarted':True,'checks':checks}
(root/'artifacts/outage-checks.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
assert len(checks)==3 and all(row['status']==200 and row['hasContent'] for row in checks)

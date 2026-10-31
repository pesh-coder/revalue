import urllib.request,urllib.error,json,re,html,sys
from pathlib import Path
root='http://localhost:3000'
paths=['/','/resources','/resources/blog','/resources/blog/what-is-a-waste-audit','/resources/blog?topic=resource-recovery','/resources?q=audit','/resources?q=zzzz-no-result','/resources?format=Guide','/resources/waste-audits','/resources/tools','/resources/tools/waste-audit-toolkit','/resources/guides','/projects','/projects?status=Completed','/projects/smart-segregation-prototype','/solutions','/solutions/waste-discovery-review','/solutions/segregation-systems','/solutions/technology-and-monitoring','/solutions/resource-recovery','/solutions/institutional-waste-management','/about','/partners','/pricing','/contact','/privacy','/terms','/preview']
cms='--cms' in sys.argv
if cms: paths=[p for p in paths if p not in ['/preview','/resources/tools/waste-audit-toolkit']]
results=[]
for path in paths:
 try:
  with urllib.request.urlopen(root+path,timeout=90) as response:
   text=response.read().decode();heads=re.findall(r'<h1\b[^>]*>(.*?)</h1>',text,re.S);head=html.unescape(re.sub('<[^>]+>','',heads[0])) if heads else ''
   result={'path':path,'status':response.status,'h1':head,'h1Count':len(heads)}
   assert response.status==200 and len(heads)==1,result
   if path.endswith('topic=resource-recovery'):assert 'No articles on this topic yet.' in text
   if path.endswith('zzzz-no-result'):assert 'Nothing found for this search.' in text
   if path=='/resources/tools/waste-audit-toolkit':assert 'This file is not available right now.' in text and '>Download the toolkit</a>' not in text
   if path=='/resources/blog/what-is-a-waste-audit':assert 'Reviewed 12 December' not in text and 'You weigh or estimate' in text
   results.append(result);print(json.dumps(result),flush=True)
 except Exception as error:
  result={'path':path,'error':str(error)};results.append(result);print(json.dumps(result),flush=True)
for path in ['/no-such-page','/resources/blog/no-such-article','/projects/no-such-project']:
 try:
  with urllib.request.urlopen(root+path,timeout=90) as response:results.append({'path':path,'unexpectedStatus':response.status})
 except urllib.error.HTTPError as error:
  text=error.read().decode();results.append({'path':path,'status':error.code,'custom404':'We could not find that page.' in text})
if cms:
 try:
  with urllib.request.urlopen(root+'/resources/tools/waste-audit-toolkit',timeout=30) as response:results.append({'cmsCase':'unapproved-tool','pass':False})
 except urllib.error.HTTPError as error:results.append({'cmsCase':'unapproved-tool','status':error.code,'pass':error.code==404})
 with urllib.request.urlopen(root+'/preview?slug=what-is-a-waste-audit',timeout=30) as response:
  content=response.read().decode();results.append({'cmsCase':'anonymous-preview','pass':'/admin/login' in response.url and 'Draft preview. Visible only to the team.' not in content})
valid={'name':'Synthetic Test','organisation':'Example','email':'test@example.com','phone':'','type':'General','message':'Synthetic test.','website':'','submissionId':'283e5cca-63af-446a-8802-5d476118d9d7'}
for label,body,origin,status in [('invalid',{},root,422),('unconnected',valid,root,503),('cross-origin',valid,'https://example.com',403),('honeypot',{**valid,'website':'spam'},root,200)]:
 request=urllib.request.Request(root+'/api/contact',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','Origin':origin},method='POST')
 try:
  with urllib.request.urlopen(request,timeout=45) as response:code=response.status;data=json.loads(response.read())
 except urllib.error.HTTPError as error:code=error.code;data=json.loads(error.read())
 results.append({'apiCase':label,'status':code,'pass':code==status,'response':data});print(json.dumps(results[-1]),flush=True)
Path('artifacts/route-checks.json').write_text(json.dumps(results,indent=2))
failed=[r for r in results if 'error' in r or 'unexpectedStatus' in r or r.get('pass') is False or ('custom404' in r and (r['status']!=404 or not r['custom404']))]
print(json.dumps({'checked':len(results),'failed':len(failed)}),flush=True)
raise SystemExit(1 if failed else 0)

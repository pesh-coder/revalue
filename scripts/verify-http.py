"""Exercise a running local production build using synthetic records and the local Admin.
Writes only redacted pass/fail evidence, and removes its own test records afterward.
"""
import copy,http.cookiejar,json,os,time,urllib.request,urllib.error,uuid,sys
from pathlib import Path
root='http://localhost:3000'
credentials=json.loads(Path(os.environ.get('REVALUE_VERIFY_CREDENTIALS','.local/admin-credentials.json')).read_text())
client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
public=urllib.request.build_opener(urllib.request.HTTPRedirectHandler())
checks=[];tag=uuid.uuid4().hex[:8];post_id=None;media_id=None
def call(path,method='GET',body=None,authenticated=True,headers=None):
 data=None if body is None else json.dumps(body).encode()
 request=urllib.request.Request(root+path,data=data,method=method,headers={'Origin':root,**({'Content-Type':'application/json'} if data is not None else {}),**(headers or {})})
 try:
  with (client if authenticated else public).open(request,timeout=30) as response:return response.status,response.read(),response.headers
 except urllib.error.HTTPError as error:return error.code,error.read(),error.headers
def check(name,ok):
 checks.append({'name':name,'pass':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def wait_text(path,text,present=True):
 start=time.monotonic()
 while time.monotonic()-start<60:
  status,body,_=call(path,authenticated=False)
  if status==200 and (text.encode() in body)==present:return round(time.monotonic()-start,2)
  time.sleep(.25)
 raise AssertionError('Public refresh did not finish within 60 seconds.')
status,body,_=call('/api/users/login','POST',{'email':credentials['email'],'password':credentials['password']})
assert status==200,'Local Admin login failed'
check('Admin authenticates through HTTP',status==200)
known=call('/api/users/forgot-password','POST',{'email':credentials['email']},authenticated=False)
unknown=call('/api/users/forgot-password','POST',{'email':'unknown-'+tag+'@example.test'},authenticated=False)
check('Unconfigured password reset gives identical responses for known and unknown users',known[0]==unknown[0]==503 and known[1]==unknown[1])
_,raw,_=call('/api/globals/site-settings');settings=json.loads(raw)
original_nav=settings['navigation'];new_nav=copy.deepcopy(original_nav);new_nav[0]['label']='Solutions '+tag
try:
 status,_,_=call('/api/globals/site-settings','POST',{'navigation':new_nav,'_status':'published'})
 check('Admin edits navigation through the CMS API',status==200)
 seconds=wait_text('/about','Solutions '+tag)
 check('Published navigation refreshes in under 60 seconds',seconds<60)
 call('/api/globals/site-settings','POST',{'navigation':original_nav,'_status':'published'})
 wait_text('/about','Solutions '+tag,False)
 if '--maintenance-only' in sys.argv: raise SystemExit(0)
 body={'title':'Local publishing check '+tag,'slug':'local-check-'+tag,'excerpt':'Synthetic local verification content.','primaryTopic':'Verification','primaryTopicSlug':'verification','format':'Blog','authorName':'Synthetic check','body':{'root':{'type':'root','version':1,'format':'','direction':'ltr','indent':0,'children':[{'type':'paragraph','version':1,'format':'','direction':'ltr','indent':0,'children':[{'type':'text','version':1,'text':'Synthetic local verification.','format':0,'style':'','mode':'normal','detail':0}]}]}},'_status':'published'}
 status,raw,_=call('/api/posts','POST',body);assert status==201,(status,raw[:200]);post=json.loads(raw)['doc'];post_id=post['id'];path='/resources/blog/'+body['slug']
 check('Admin creates and publishes an article through HTTP',status==201)
 check('Published article reaches the public page within 60 seconds',wait_text(path,body['title'])<60)
 old_time=post['updatedAt']
 status,raw,_=call('/api/posts/'+str(post_id)+'?draft=true','PATCH',{'title':'Private revision '+tag,'_status':'draft','updatedAt':old_time})
 check('A draft revision saves through HTTP',status==200)
 _,raw,_=call('/api/posts/'+str(post_id),authenticated=False);check('The public API retains the published title',json.loads(raw).get('title')==body['title'])
 status,raw,_=call('/api/posts/'+str(post_id)+'?draft=true','PATCH',{'title':'Stale revision '+tag,'updatedAt':old_time,'_status':'draft'})
 check('A stale editor save receives HTTP 409',status==409)
 status,raw,headers=call('/preview?slug='+body['slug']);check('Authenticated preview renders the private revision',status==200 and ('Private revision '+tag).encode() in raw and 'no-store' in headers.get('Cache-Control',''))
 status,raw,_=call('/preview?slug='+body['slug'],authenticated=False);check('Anonymous preview reaches login without private copy',b'Private revision' not in raw and b'Login' in raw)
 status,_,_=call('/api/posts/'+str(post_id),'PATCH',{'_status':'draft'})
 status,raw,_=call(path,authenticated=False);check('An unpublished formerly public article returns HTTP 410',status==410 and b'no longer available' in raw)
 status,raw,_=call('/resources?q='+tag,authenticated=False);check('Unpublished article disappears from application search',body['title'].encode() not in raw)
 status,_,_=call('/api/posts/'+str(post_id),'PATCH',{'title':body['title'],'_status':'published'})
 check('Republishing restores the public page',wait_text(path,body['title'])<60)
 status,_,_=call('/api/posts/'+str(post_id),'DELETE');check('Admin can delete its synthetic test article',status==200)
 status,_,_=call(path,authenticated=False);check('Deleted formerly public article keeps HTTP 410',status==410)
 post_id=None
 # Real multipart image upload; the bucket is local in this verification.
 boundary='----revalue-'+uuid.uuid4().hex;image=Path('public/images/stock-open-water.jpg').read_bytes()
 multipart=(f'--{boundary}\r\nContent-Disposition: form-data; name="_payload"\r\n\r\n'+json.dumps({'alt':'Synthetic private upload','publicApproved':False})+f'\r\n--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="local-upload-{tag}.jpg"\r\nContent-Type: image/jpeg\r\n\r\n').encode()+image+f'\r\n--{boundary}--\r\n'.encode()
 request=urllib.request.Request(root+'/api/media',data=multipart,method='POST',headers={'Origin':root,'Content-Type':'multipart/form-data; boundary='+boundary})
 with client.open(request,timeout=30) as response:media=json.loads(response.read())['doc'];media_id=media['id'];check('Admin uploads an actual image over HTTP',response.status==201)
 media_path='/api/media/file/'+urllib.parse.quote(media['filename'])
 status,_,_=call(media_path,authenticated=False);check('Unapproved image bytes are unavailable anonymously',status in (403,404))
 status,_,private_headers=call(media_path);check('Authenticated private bytes are marked private and no-store',status==200 and 'private' in private_headers.get('Cache-Control','') and 'no-store' in private_headers.get('Cache-Control',''))
 status,_,_=call('/api/media/'+str(media_id),'PATCH',{'publicApproved':True});assert status==200
 status,_,_=call(media_path,authenticated=False);check('Admin approval makes the image available',status==200)
 optimized='/_next/image?url='+urllib.parse.quote(media_path,safe='')+'&w=828&q=75'
 status,raw,headers=call(optimized,authenticated=False);check('Approved CMS images pass the Next image optimizer',status==200 and headers.get('Content-Type','').startswith('image/'))
 call('/api/media/'+str(media_id),'DELETE');media_id=None
 for path in ['/api/enquiries','/api/enquiries/export','/api/globals/site-settings?draft=true','/api/globals/homepage?draft=true']:
  status,_,_=call(path,authenticated=False);check('Anonymous access is denied: '+path,status in (401,403))
 status,_,_=call('/api/maintenance','POST',{},authenticated=False);check('Anonymous maintenance is denied',status in (401,403))
 status,raw,headers=call('/api/enquiries/export');check('Admin enquiry export is a private CSV response',status==200 and 'text/csv' in headers.get('Content-Type','') and 'no-store' in headers.get('Cache-Control',''))
 status,raw,_=call('/api/maintenance','POST',{});check('Admin can process durable refreshes and preview retention',status==200 and 'retention' in json.loads(raw))
finally:
 if post_id:call('/api/posts/'+str(post_id),'DELETE')
 if media_id:call('/api/media/'+str(media_id),'DELETE')
 call('/api/globals/site-settings','POST',{'navigation':original_nav,'_status':'published'})
 Path('artifacts/'+('http-maintenance-checks.json' if '--maintenance-only' in sys.argv else 'http-checks.json')).write_text(json.dumps({'date':time.strftime('%Y-%m-%d'),'environment':'local production server','liveMail':False,'checks':checks},indent=2))
failed=[item for item in checks if not item['pass']]
print(json.dumps({'checked':len(checks),'failed':len(failed)}))
raise SystemExit(bool(failed))

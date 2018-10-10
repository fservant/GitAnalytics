import sys, json, requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


cred = credentials.Certificate('C:/Users/Dom97/Documents/Fall2018/Capstone/continuous-integration-a9f3c-firebase-adminsdk-iabjb-143de454ce.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

token = sys.argv[3]
owner = sys.argv[1]
repo = sys.argv[2]

builds_length = 100
headers = {"Travis-API-Version": "3", "Authorization": "token "+token}

offset = 0
builds=[]

for i in range(50):
    r = requests.get("https://api.travis-ci.org/repo/" + owner + "%2F" + repo + "/builds?limit="+str(builds_length)+"&offset="+str(i *builds_length), headers=headers)

    if r.status_code != 200:
        print("invalid request")
        sys.exit(1)

    pyresponse = r.json()

    builds.append(pyresponse['builds'])

flat = [j for i in builds for j in i]


for i in range(int(len(flat)/200)):
    simple = {b.get('number'):{'number':b.get('number'), "hash":b.get('commit').get('sha')[:8], 'owner':b.get('created_by').get('login'), 'time':b.get('started_at'), 'status':b.get('state')} for b in flat[i*200:(i+1)*200]}
    db.collection(u'history').document(repo).set(simple)
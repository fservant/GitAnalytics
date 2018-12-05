import sys, json, requests
token = sys.argv[4]
owner = sys.argv[1]
repo = sys.argv[2]
builds_length = sys.argv[3]
headers = {"Travis-API-Version": "3", "Authorization": "token "+token}

r = requests.get("https://api.travis-ci.org/repo/" + owner + "%2F" + repo + "/builds?limit="+builds_length, headers=headers)

if r.status_code != 200:
    print("invalid request")
    sys.exit(1)

pyresponse = r.json()

builds = pyresponse['builds']

simple = [{'number':b.get('number'), "hash":b.get('commit').get('sha')[:8], 'owner':b.get('created_by').get('login'), 'time':b.get('started_at'), 'status':b.get('state')} for b in builds]

output = owner + "." + repo + "." + "history.json"
with open(output, 'w') as outfile:
    json.dump(simple, outfile, indent=4)
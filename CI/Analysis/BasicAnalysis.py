import sys, json, requests, pandas
token = sys.argv[5]
owner = sys.argv[1]
repo = sys.argv[2]
builds_length = sys.argv[3]
output = sys.argv[4]
headers = {"Travis-API-Version": "3", "Authorization": "token "+token}
#
r = requests.get("https://api.travis-ci.org/repo/" + owner + "%2F" + repo + "/builds?limit="+builds_length, headers=headers)

if r.status_code != 200:
    print("invalid request")
    sys.exit(1)

pyresponse = r.json()


builds = pyresponse['builds']
pairs = [(build.get('created_by').get('login'),  build.get('state'))for build in builds]

df = pandas.DataFrame(pairs)
df.columns = ['user', 'status']

crosstab = pandas.crosstab(df.user, df.status)
output_dict = crosstab.to_dict(orient='index')

with open(output, 'w') as outfile:
    json.dump(output_dict, outfile, indent=4)
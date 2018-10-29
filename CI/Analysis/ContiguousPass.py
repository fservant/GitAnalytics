import pandas
import json
import numpy
import datetime
import sys, json, requests
import itertools
token = ''
owner = 'rails'
repo = 'rails'
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


together = list(itertools.chain.from_iterable(builds))
clean = [x for x in together if x.get('state') != 'started']
clean = [x for x in clean if x.get('state') != 'canceled']
clean = [x for x in clean if x.get('previous_state') != 'canceled']
clean = [x for x in clean if x.get('previous_state') != 'started']
clean = [x for x in clean if x.get('commit') != None]
clean = [x for x in clean if (x.get('created_by') != None)]
clean = [x for x in clean if x.get('started_at') != None]


passing = []
failing = []
curr_sum = 0
for build in clean:
    previous = build.get('previous_state')  == 'passed'
    current = build.get('state') == 'passed'
    if previous:
        if current:
            curr_sum = curr_sum + 1
        else:
            passing.append(curr_sum)
            curr_sum = 1
    else:
        if current:
            failing.append(curr_sum)
            curr_sum = 1
        else:
            curr_sum = curr_sum + 1
    
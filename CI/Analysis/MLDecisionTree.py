import pandas
import json
import numpy
import datetime
import sys, json, requests
import itertools
from sklearn import tree

token = ''
owner = 'rails'
repo = 'rails'
builds_length = 100
headers = {"Travis-API-Version": "3", "Authorization": "token "+token}

offset = 0
builds=[]

for i in range(100):
    r = requests.get("https://api.travis-ci.org/repo/" + owner + "%2F" + repo + "/builds?limit="+str(builds_length)+"&offset="+str(i *builds_length), headers=headers)

    if r.status_code != 200:
        print("invalid request")
        sys.exit(1)

    pyresponse = r.json()

    builds.append(pyresponse['builds'])

flat = [j for i in builds for j in i]

together = list(itertools.chain.from_iterable(builds))
clean = [x for x in together if x.get('state') != 'started']
clean = [x for x in clean if x.get('state') != 'canceled']
clean = [x for x in clean if x.get('previous_state') != 'canceled']
clean = [x for x in clean if x.get('previous_state') != 'started']
clean = [x for x in clean if x.get('previous_state') != None]
clean = [x for x in clean if x.get('commit') != None]
clean = [x for x in clean if x.get('created_by') != None]
clean = [x for x in clean if x.get('started_at') != None]
clean = [x for x in clean if x.get('event_type') != None]

relevant = [{'owner':b.get('created_by').get('login'), 'status':b.get('state'), 'previous_status':b.get('previous_state'), 'event_type':b.get('event_type'), 'day':datetime.datetime.strptime(b.get('started_at'), '%Y-%m-%dT%H:%M:%SZ').weekday(), 'hour':datetime.datetime.strptime(b.get('started_at'), '%Y-%m-%dT%H:%M:%SZ').hour}for b in clean]

convert = {'passed':1, 'canceled':0, 'errored':-1, 'failed':-2, 'push':0, 'pull_request':1, 'cron':2, 'api':3}
numArray = [[convert.get(b.get('previous_status')), convert.get(b.get('event_type')), b.get('day'), b.get('hour')] for b in relevant]
answerArray = [convert.get(b.get('status'))for b in relevant]

clf = tree.DecisionTreeClassifier()
clf = clf.fit(numArray, answerArray)
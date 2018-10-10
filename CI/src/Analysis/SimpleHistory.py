import json
with open("rails50.json") as tweetfile:
    pyresponse = json.load(tweetfile)
builds = pyresponse['builds']

simple = [{'number':b.get('number'), "hash":b.get('commit').get('sha')[:8], 'owner':b.get('created_by').get('login'), 'time':b.get('started_at'), 'status':b.get('state')} for b in builds]

with open('railsHistory.json', 'w') as outfile:
    json.dump(simple, outfile, indent=4)
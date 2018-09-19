import json, pandas
with open("rails50.json") as tweetfile:
    pyresponse = json.load(tweetfile)
builds = pyresponse['builds']
pairs = [(build.get('created_by').get('login'),  build.get('state'))for build in builds]

df = pandas.DataFrame(pairs)
df.columns = ['user', 'status']

crosstab = pandas.crosstab(df.user, df.status)
crosstab.to_json(orient='index')
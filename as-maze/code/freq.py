import wordfreq as wf

import pandas as pd

df = pd.read_csv('../words.csv')


df['freq']=df.apply(lambda x: wf.zipf_frequency(x['word_fixed'], 'en'), axis=1)

print(df.head)
df.to_csv('wordfreq.csv')


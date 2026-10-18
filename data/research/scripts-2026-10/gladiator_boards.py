import sys,json
t=open(sys.argv[1]).read()
i=t.index('{"boards":[')+len('{"boards":')
d=0;k=i;ins=False;esc=False
while True:
    c=t[k]
    if ins:
        if esc: esc=False
        elif c=='\\': esc=True
        elif c=='"': ins=False
    elif c=='"': ins=True
    elif c in '[{': d+=1
    elif c in ']}':
        d-=1
        if d==0: break
    k+=1
b=json.loads(t[i:k+1]); json.dump(b,open(sys.argv[2],'w'),indent=0)
from collections import Counter
for x in b: print(x['id'],x['name'],x['needLevel'],len(x['nodes']),sum(n['cost'] for n in x['nodes']),Counter((n['type'],n['grade']) for n in x['nodes']))

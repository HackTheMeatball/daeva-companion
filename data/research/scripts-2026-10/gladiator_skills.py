import re,sys,html,json
def text(path):
    t=open(path,errors='ignore').read()
    body=re.sub(r'<script.*?</script>|<style.*?</style>','',t,flags=re.S)
    txt=re.sub(r'<[^>]+>','|',body); txt=html.unescape(re.sub(r'(\|\s*)+','|',txt))
    return [x.strip() for x in txt.split('|')]
def after(tok,label,start=0):
    i=tok.index(label,start); return tok[i+1]
def parse(path,slug):
    tok=text(path); r={'slug':slug}
    i=tok.index('Class'); r['class']=tok[i+1]
    r['type']=after(tok,'Type',i); r['learnLv']=int(after(tok,'Learned at',i).replace('Lv. ',''))
    r['maxLevel']=int(after(tok,'Max level',i)); r['cooldown']=after(tok,'Cooldown',i)
    # name from "What X does"
    w=[x for x in tok if x.startswith('What ') and x.endswith(' does')][0]; r['name']=w[5:-5]
    specs=[]
    for k,x in enumerate(tok):
        m=re.fullmatch(r'Specialization (\d)',x)
        if m and tok[k+2].startswith('requires skill level'):
            specs.append({'n':int(m.group(1)),'skillLv':int(tok[k+2].split()[-1]),'text':tok[k+3]})
    r['specs']=specs
    # level table: header from 'Level' to 'Points'
    j=tok.index('Points', tok.index('Required Level'))
    h=j
    while tok[h]!='Level': h-=1
    hdr=tok[h:j+1]; n=len(hdr); ri=hdr.index('Required Level')
    rows=[]; k=j+1
    while k+n-1<len(tok) and tok[k].isdigit() and tok[k]==str(len(rows)+1):
        rows.append((int(tok[k]),tok[k+ri],tok[k+n-1])); k+=n
    r['levelHeader']=hdr
    r['levels']=rows
    # daevanion
    nodes=[]
    try:
        d=tok.index('Point cost', [i for i,x in enumerate(tok) if x.startswith('Daevanion nodes that boost')][0])
        k=d+1
        while tok[k] in ('Nezekan','Zikel','Vaizel','Triniel','Azphel'):
            nodes.append((tok[k],tok[k+1],tok[k+2],tok[k+3])); k+=4
    except (IndexError,ValueError): pass
    r['nodes']=nodes
    m=[x for x in tok if re.fullmatch(r'\d+ of \d+',x)]; r['pick']=m[0] if m else ''
    b=[x for x in tok if x.startswith('Data read from the AION 2 global client')]; r['build']=re.search(r'build ([\d.]+)',b[0]).group(1) if b else ''
    return r
if __name__=='__main__':
    out=[]
    for line in open(sys.argv[1]):
        p=line.split()
        if len(p)>=2 and p[1].endswith('.html') and '/' not in p[0]:
            out.append(parse(p[1],p[0]))
    json.dump(out,open(sys.argv[2],'w'),indent=1); print(len(out))

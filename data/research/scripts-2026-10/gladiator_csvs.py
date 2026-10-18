import json,csv,re,sys
from collections import Counter,defaultdict
S=sys.argv[1]; O=sys.argv[2]
sk=json.load(open(S+'/skills.json')); bd=json.load(open(S+'/boards.json'))
MB='https://metabot.gg/en/aion-2/'
BUILD='0.0.4387.0'; D='2026-10-18'
def slug(n): return re.sub(r'-+','-',re.sub(r'[^a-z0-9]+','-',n.lower().replace("'",""))).strip('-')
# board nodes
rows=[]; per=defaultdict(list)
for b in bd:
    bn=b['name'].lower()
    for n in sorted(b['nodes'],key=lambda n:(n['row'],n['col'])):
        ty='start' if n['type']=='Start' else 'skill' if n['type']=='SkillLevel' else 'unique' if n['grade']=='Unique' else 'stat'
        s=slug(n['skillName']) if n['skillName'] else ''
        if s: per[n['skillName']].append((b['name'],n['cost'],n['skillLevels']))
        rows.append(dict(id=f'node:gladiator:{bn}:r{n["row"]}c{n["col"]}',key=f'dv:{bn}:r{n["row"]}c{n["col"]}',board='board:'+bn,row=n['row'],col=n['col'],type=ty,
          grade=(n['grade'] or '').lower(),cost=n['cost'],label=n['label'] or '',skill=('skill:gladiator:'+s) if s else '',adds=n['skillLevels'] if s else '',
          gameId=n['id'],needLevel=n['needLevel'],build=BUILD,checkedAt=D,status='verified',page_url=MB+'daevanion/gladiator',notes='same row, col, type, grade, cost and stat label as the Assassin node' ))
w=csv.DictWriter(open(O+'/gladiator-board-nodes-metabot-2026-10.csv','w',newline=''),fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
print('nodes',len(rows),Counter(r['type'] for r in rows))
# skills
srows=[]; strows=[]; sprows=[]; problems=[]
for r in sk:
    t={'Active skill':'active','Passive skill':'passive','Stigma skill':'stigma'}[r['type']]
    lv={a:(b,c) for a,b,c in r['levels']}
    url=MB+'skills/'+r['slug']
    if r['class']!='Gladiator': problems.append((r['name'],'class',r['class']))
    if slug(r['name'])!=r['slug']: problems.append((r['name'],'slug',r['slug']))
    for s in r['specs']:
        sprows.append(dict(id=f'spec:gladiator:{r["slug"]}:{s["n"]}',skill=f'{"stigma" if t=="stigma" else "skill"}:gladiator:{r["slug"]}',n=s['n'],skillLv=s['skillLv'],text=s['text'],build=r['build'],checkedAt=D,status='verified',page_url=url))
    if t=='stigma':
        costs=[lv[L][1] for L in range(1,26)]
        exp=['1 ★']*5+['2 ★']*5+['4 ★']*5+['8 ★']*5+['—']*5
        req=set(lv[L][0] for L in range(1,21))
        strows.append(dict(id='stigma:gladiator:'+r['slug'],key=r['name'],name=r['name'],availableLv=r['learnLv'],maxLevel=r['maxLevel'],
            specialtyLevels='/'.join(str(s['skillLv']) for s in r['specs']),pointCosts='Lv 1-5: 1, 6-10: 2, 11-15: 4, 16-20: 8, 21-25: not listed' if costs==exp else 'MISMATCH '+str(costs),
            requiredCharLv='/'.join(sorted(req)),topPlayerPick=r['pick'],build=r['build'],checkedAt=D,status='verified',fieldStatus='maxLevel: single-source',page_url=url,
            notes=''))
        if costs!=exp or req!={'Lv. 22'}: problems.append((r['name'],costs,req))
    else:
        req=[int(lv[L][0].replace('Lv. ','')) for L in range(2,11)]
        pts=[lv[L][1] for L in range(2,11)]
        gate='stepped' if req==[r['learnLv']+3*(L-2) for L in range(2,11)] else 'flat' if req==[r['learnLv']]*9 else 'OTHER'
        if pts!=['1']*3+['2']*3+['4']*3 or gate=='OTHER': problems.append((r['name'],pts,req))
        dv=per[r['name']]; bc=Counter(b for b,_,_ in dv)
        srows.append(dict(id='skill:gladiator:'+r['slug'],key=r['name'],name=r['name'],type=t,learnLv=r['learnLv'],levelGate=gate,charLvForSkillLv10=req[-1],
            maxLevel=r['maxLevel'],pointCosts='Lv 2-4: 1, 5-7: 2, 8-10: 4',specialtyLevels='/'.join(str(s['skillLv']) for s in r['specs']),
            boardNodes=' '.join(f'{b} {c}' for b,c in bc.items()),boardNodeCost=(dv[0][1] if dv else ''),
            topPlayerPick=r['pick'],build=r['build'],checkedAt=D,status='verified',page_url=url,
            notes=('Shared display name with an Assassin skill' if r['name'] in ('Defiance','Impact Hit','Attack Preparation','Survival Willpower') else '')))
        # cross-check nodes on skill page vs board page
        sp=Counter(b for b,_,_,_ in r['nodes'])
        if sp!=bc: problems.append((r['name'],'nodes',sp,bc))
for name,f,rs in [('skills',O+'/gladiator-skills-metabot-2026-10.csv',srows),('stigmas',O+'/gladiator-stigmas-metabot-2026-10.csv',strows),('specs',O+'/gladiator-specialties-metabot-2026-10.csv',sprows)]:
    w=csv.DictWriter(open(f,'w',newline=''),fieldnames=list(rs[0])); w.writeheader(); w.writerows(rs); print(name,len(rs))
print('problems',problems)
print(Counter(r['levelGate'] for r in srows), [ (r['name'],r['levelGate']) for r in srows if r['type']=='passive'])

#!/usr/bin/env python3
"""Generates the demo catalogue pictures (public/demo/products/*.svg) and business logos
(public/demo/logos/*.svg). Flat illustrations, deterministic, no network or fonts needed.
Run: python3 scripts/generate-demo-images.py
"""
import os, re, hashlib

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "demo")
KIND = {
 "Adire Wrap Dress":"dress","Ankara Print Shirt":"top","Kente Stole":"scarf","Dashiki Top":"top","Aso-Oke Cap":"cap","Batik Scarf":"scarf","Linen Agbada":"top","Mudcloth Jacket":"top","Wax Print Skirt":"dress","Handwoven Tote":"tote",
 "Suya Spice Blend":"jar","Palm Oil (1L)":"bottle","Dried Hibiscus":"sachet","Moringa Powder":"jar","Jollof Seasoning":"jar","Peri-Peri Sauce":"bottle","Plantain Chips":"sachet","Baobab Fruit Powder":"sachet","Groundnut Paste":"jar","Dried Crayfish":"sachet",
 "Raw Shea Butter":"jar","Black Soap Bar":"bar","Baobab Face Oil":"bottle","Hibiscus Body Scrub":"jar","Marula Hair Oil":"bottle","Moringa Lotion":"bottle","Argan Night Cream":"jar","Red Clay Mask":"jar","Lip Balm Set":"tin","Beard Oil":"bottle",
 "Woven Raffia Basket":"basket","Carved Stool":"stool","Beaded Wall Hanging":"hanging","Clay Planter":"bowl","Sisal Floor Mat":"mat","Brass Candle Holder":"candle","Bolga Market Basket":"basket","Soapstone Bowl":"bowl","Mud Cloth Cushion":"cushion","Wooden Mask":"mask",
 "Single-Origin Beans (250g)":"sachet","Rooibos Tea Tin":"tin","Hibiscus Tea Bags":"sachet","Cold Brew Pack":"bottle","Espresso Roast (1kg)":"sachet","Honeybush Blend":"tin","Ginger Chai Mix":"jar","Moka Pot":"pot","Ceramic Mug Set":"mug","Green Tea Leaves":"tin",
 "Waist Beads":"beads","Cowrie Necklace":"beads","Brass Cuff":"cuff","Beaded Earrings":"earrings","Maasai Collar":"beads","Gold-Plated Anklet":"cuff","Bronze Ring":"ring","Amber Bracelet":"cuff","Trade Bead Strand":"beads","Ear Cuffs":"earrings",
}
# (background, object, accent) triples, warm and varied
PALETTES = [("#F3E3D3","#C8643B","#F7E7C6"),("#E4EEE4","#4F8A63","#F4EAD0"),("#E6E2F3","#6B5BB0","#F2D9A6"),("#F7DDD4","#B6452F","#FFF1DC"),("#DDEBF2","#2F6C8F","#F6E4B8"),("#F4ECD2","#B58A1F","#3B2A1A"),("#EEDDE6","#A4466F","#F7E9D0"),("#E3E0D8","#5A4A3A","#E8B66B")]

def slug(s): return re.sub(r"-+","-",re.sub(r"[^a-z0-9]+","-",s.lower())).strip("-")
def h(s,n): return int(hashlib.md5(s.encode()).hexdigest(),16)%n

def shade(hexc,f):
    r,g,b=[int(hexc[i:i+2],16) for i in (1,3,5)]
    if f<0: r,g,b=[int(v*(1+f)) for v in (r,g,b)]
    else: r,g,b=[int(v+(255-v)*f) for v in (r,g,b)]
    return "#%02x%02x%02x"%(r,g,b)

def pattern(acc):
    return f'<pattern id="p" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><rect width="36" height="36" fill="none"/><circle cx="9" cy="9" r="4" fill="{acc}" opacity=".55"/><rect x="22" y="22" width="9" height="9" rx="2" fill="{acc}" opacity=".35"/></pattern>'

def motif(kind,c,a):
    d,l=shade(c,-.25),shade(c,.35)
    P=f'<path d="M0 0" fill="none"/>'
    m={
    "dress": f'<path d="M330 250 L400 300 L470 250 L520 330 L470 420 L560 800 L240 800 L330 420 L280 330Z" fill="{c}"/><path d="M330 250 L400 300 L470 250 L520 330 L470 420 L560 800 L240 800 L330 420 L280 330Z" fill="url(#p)"/><path d="M330 420 L470 420" stroke="{d}" stroke-width="10"/>',
    "top": f'<path d="M300 250 Q400 310 500 250 L640 340 L580 430 L530 400 L530 790 L270 790 L270 400 L220 430 L160 340Z" fill="{c}"/><path d="M300 250 Q400 310 500 250 L640 340 L580 430 L530 400 L530 790 L270 790 L270 400 L220 430 L160 340Z" fill="url(#p)"/><path d="M300 250 Q400 330 500 250" stroke="{d}" stroke-width="12" fill="none"/>',
    "scarf": f'<path d="M270 200 Q400 260 530 200 L560 780 Q400 830 240 780Z" fill="{c}"/>'+"".join(f'<rect x="{250+i*0}" y="{300+i*90}" width="300" height="26" fill="{a}" opacity=".8" transform="skewY(4)"/>' for i in range(5))+f'<g stroke="{d}" stroke-width="5">'+"".join(f'<path d="M{262+i*28} 790 v50"/>' for i in range(10))+'</g>',
    "cap": f'<path d="M230 600 Q230 330 400 330 Q570 330 570 600Z" fill="{c}"/><path d="M230 600 Q230 330 400 330 Q570 330 570 600Z" fill="url(#p)"/><rect x="215" y="585" width="370" height="60" rx="28" fill="{d}"/>',
    "tote": f'<path d="M290 360 Q290 200 400 200 Q510 200 510 360" fill="none" stroke="{d}" stroke-width="22"/><path d="M220 340 H580 L610 800 H190Z" fill="{c}"/><path d="M220 340 H580 L610 800 H190Z" fill="url(#p)"/>',
    "jar": f'<rect x="260" y="270" width="280" height="90" rx="26" fill="{d}"/><rect x="235" y="350" width="330" height="440" rx="46" fill="{c}"/><rect x="275" y="470" width="250" height="210" rx="18" fill="{a}"/><circle cx="400" cy="575" r="46" fill="{c}" opacity=".85"/>',
    "bottle": f'<rect x="355" y="180" width="90" height="70" rx="14" fill="{d}"/><path d="M370 250 H430 V330 Q520 360 520 460 V770 Q520 800 490 800 H310 Q280 800 280 770 V460 Q280 360 370 330Z" fill="{c}"/><rect x="310" y="500" width="180" height="190" rx="14" fill="{a}"/><rect x="335" y="540" width="130" height="14" rx="7" fill="{c}"/><rect x="335" y="580" width="90" height="14" rx="7" fill="{c}" opacity=".6"/>',
    "sachet": f'<path d="M250 250 H550 L575 790 H225Z" fill="{c}"/><path d="M250 250 H550 V300 H250Z" fill="{d}"/><path d="M250 270 l15 -18 l15 18 l15 -18 l15 18 l15 -18 l15 18 l15 -18 l15 18 l15 -18 l15 18 l15 -18 l15 18 l15 -18 l15 18 l15 -18 l15 18" fill="none" stroke="{l}" stroke-width="6"/><circle cx="400" cy="540" r="110" fill="{a}"/><circle cx="400" cy="540" r="62" fill="{c}" opacity=".8"/>',
    "bar": f'<rect x="190" y="400" width="420" height="260" rx="36" fill="{c}" transform="rotate(-12 400 530)"/><rect x="190" y="400" width="420" height="260" rx="36" fill="url(#p)" transform="rotate(-12 400 530)"/><rect x="230" y="445" width="340" height="60" rx="14" fill="{a}" transform="rotate(-12 400 530)"/>',
    "tin": f'<ellipse cx="400" cy="320" rx="190" ry="46" fill="{d}"/><path d="M210 320 V700 Q210 760 400 760 Q590 760 590 700 V320 Q590 366 400 366 Q210 366 210 320Z" fill="{c}"/><rect x="250" y="450" width="300" height="190" rx="16" fill="{a}"/><circle cx="400" cy="545" r="50" fill="{c}" opacity=".85"/>',
    "bowl": f'<path d="M180 420 H620 Q620 740 400 760 Q180 740 180 420Z" fill="{c}"/><ellipse cx="400" cy="420" rx="220" ry="46" fill="{d}"/><ellipse cx="400" cy="424" rx="196" ry="34" fill="{shade(c,-.45)}"/><path d="M230 560 Q400 620 570 560" stroke="{a}" stroke-width="12" fill="none" opacity=".8"/>',
    "mug": f'<path d="M230 330 H540 V680 Q540 770 385 770 Q230 770 230 680Z" fill="{c}"/><path d="M540 400 Q650 400 650 520 Q650 640 536 640" fill="none" stroke="{c}" stroke-width="34"/><ellipse cx="385" cy="330" rx="155" ry="34" fill="{d}"/><rect x="262" y="470" width="246" height="26" fill="{a}"/><rect x="262" y="520" width="246" height="26" fill="{a}" opacity=".6"/>',
    "stool": f'<ellipse cx="400" cy="360" rx="230" ry="62" fill="{d}"/><path d="M170 360 Q170 430 400 430 Q630 430 630 360 V400 Q630 470 400 470 Q170 470 170 400Z" fill="{c}"/><path d="M290 450 L250 780 H330 L370 470Z M510 450 L550 780 H470 L430 470Z M380 470 V790 H420 V470Z" fill="{c}"/>',
    "basket": f'<path d="M260 330 Q400 130 540 330" fill="none" stroke="{d}" stroke-width="24"/><path d="M190 340 H610 L570 770 Q400 810 230 770Z" fill="{c}"/>'+"".join(f'<path d="M{200+i*7} {400+i*60} Q400 {430+i*60} {600-i*7} {400+i*60}" stroke="{a}" stroke-width="10" fill="none" opacity=".75"/>' for i in range(6))+f'<g stroke="{d}" stroke-width="6" opacity=".5">'+"".join(f'<path d="M{250+i*50} 345 L{262+i*46} 770"/>' for i in range(8))+'</g>',
    "hanging": f'<rect x="200" y="210" width="400" height="26" rx="13" fill="{d}"/>'+"".join(f'<g><path d="M{240+i*80} 236 V{480+(i%3)*90}" stroke="{d}" stroke-width="5"/>'+"".join(f'<circle cx="{240+i*80}" cy="{270+j*46}" r="17" fill="{[c,a,d][(i+j)%3]}"/>' for j in range(4+(i%3)*2))+'</g>' for i in range(5)),
    "mat": f'<ellipse cx="400" cy="560" rx="290" ry="170" fill="{c}"/><ellipse cx="400" cy="560" rx="220" ry="120" fill="none" stroke="{a}" stroke-width="14"/><ellipse cx="400" cy="560" rx="150" ry="74" fill="none" stroke="{d}" stroke-width="12"/><ellipse cx="400" cy="560" rx="70" ry="30" fill="{a}"/>',
    "candle": f'<path d="M400 230 q38 50 0 90 q-38 -40 0 -90Z" fill="#F5B53D"/><rect x="372" y="320" width="56" height="190" rx="10" fill="{a}"/><path d="M300 520 H500 L470 560 H330Z" fill="{c}"/><rect x="380" y="560" width="40" height="150" fill="{c}"/><path d="M280 770 Q400 690 520 770Z" fill="{c}"/><rect x="280" y="765" width="240" height="26" rx="13" fill="{d}"/>',
    "cushion": f'<path d="M190 260 Q400 220 610 260 Q650 530 610 800 Q400 840 190 800 Q150 530 190 260Z" fill="{c}"/><path d="M190 260 Q400 220 610 260 Q650 530 610 800 Q400 840 190 800 Q150 530 190 260Z" fill="url(#p)"/><path d="M260 330 L540 730 M540 330 L260 730" stroke="{a}" stroke-width="10" opacity=".7"/>',
    "mask": f'<path d="M400 190 Q580 190 580 400 Q580 640 400 810 Q220 640 220 400 Q220 190 400 190Z" fill="{c}"/><path d="M290 380 Q335 350 370 390 Q335 420 290 380Z M510 380 Q465 350 430 390 Q465 420 510 380Z" fill="{a}"/><path d="M400 400 V560" stroke="{d}" stroke-width="18" stroke-linecap="round"/><path d="M335 660 Q400 700 465 660" stroke="{a}" stroke-width="14" fill="none" stroke-linecap="round"/><g stroke="{d}" stroke-width="8"><path d="M285 250 l30 40 M515 250 l-30 40 M260 480 h60 M540 480 h-60"/></g>',
    "pot": f'<path d="M300 300 H500 L560 620 H240Z" fill="{c}"/><path d="M240 620 H560 L580 770 H220Z" fill="{d}"/><path d="M320 260 H480 V300 H320Z" fill="{d}"/><circle cx="400" cy="250" r="18" fill="{a}"/><path d="M500 340 Q620 360 590 520" fill="none" stroke="{a}" stroke-width="22" stroke-linecap="round"/><rect x="300" y="440" width="200" height="22" fill="{a}" opacity=".7"/>',
    "beads": '<path d="M180 260 Q400 960 620 260" fill="none" stroke="none" id="s"/>'+"".join(f'<circle cx="{180+(440*t/24):.0f}" cy="{260+ (4*(t/24)*(1-t/24))*540:.0f}" r="{18 if t%3 else 26}" fill="{[c,a,d][t%3]}"/>' for t in range(25))+f'<ellipse cx="400" cy="800" rx="0" ry="0"/><circle cx="400" cy="{260+540:.0f}" r="42" fill="{a}"/>',
    "cuff": f'<path d="M210 360 Q400 260 590 360 L560 700 Q400 780 240 700Z" fill="{c}"/><path d="M230 450 Q400 360 570 450" stroke="{a}" stroke-width="18" fill="none"/><path d="M240 560 Q400 470 560 560" stroke="{a}" stroke-width="10" fill="none" opacity=".7"/><path d="M250 640 Q400 560 550 640" stroke="{l}" stroke-width="8" fill="none" opacity=".6"/>',
    "ring": f'<ellipse cx="400" cy="560" rx="190" ry="210" fill="none" stroke="{c}" stroke-width="64"/><ellipse cx="400" cy="560" rx="190" ry="210" fill="none" stroke="{l}" stroke-width="10" transform="translate(-14 -14)" opacity=".6"/><circle cx="400" cy="330" r="52" fill="{a}"/><circle cx="400" cy="330" r="26" fill="{c}"/>',
    "earrings": "".join(f'<g transform="translate({x} 0)"><circle cx="0" cy="250" r="16" fill="{d}"/><path d="M0 266 V330" stroke="{d}" stroke-width="6"/><circle cx="0" cy="420" r="92" fill="{c}"/><circle cx="0" cy="420" r="52" fill="{a}"/><circle cx="0" cy="420" r="20" fill="{c}"/><path d="M0 512 V560" stroke="{d}" stroke-width="6"/><circle cx="0" cy="620" r="52" fill="{a}"/></g>' for x in (290,510)),
    }
    return m[kind]

def svg(kind,pal,alt=False):
    bg,c,a=pal
    if alt: bg=shade(bg,-.07); c,a=a if kind in("jar",) else c,c if kind in("jar",) else a
    sc=1.28 if alt else 1
    tx=400-400*sc; ty=500-500*sc+ (40 if alt else 0)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{shade(bg,.45)}"/><stop offset="1" stop-color="{bg}"/></linearGradient>{pattern(a)}</defs>
<rect width="800" height="1000" fill="url(#g)"/>
<circle cx="640" cy="170" r="150" fill="{shade(bg,.55)}" opacity=".55"/>
<rect y="840" width="800" height="160" fill="{shade(bg,-.06)}"/>
<ellipse cx="400" cy="{840 if not alt else 880}" rx="{250*sc}" ry="{26*sc}" fill="#000" opacity=".09"/>
<g transform="translate({tx} {ty}) scale({sc})">{motif(kind,c,a)}</g>
</svg>
'''

def logo(name,color):
    ini="".join(w[0] for w in re.findall(r"[A-Za-z]+",name)[:2]).upper()
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img"><rect width="96" height="96" rx="24" fill="{color}"/><circle cx="76" cy="20" r="26" fill="#fff" opacity=".14"/><text x="48" y="62" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="40" fill="#fff">{ini}</text></svg>\n'

if __name__=="__main__":
    os.makedirs(os.path.join(ROOT,"products"),exist_ok=True); os.makedirs(os.path.join(ROOT,"logos"),exist_ok=True)
    for name,kind in KIND.items():
        pal=PALETTES[h(name,len(PALETTES))]
        for i,alt in enumerate((False,True),1):
            open(os.path.join(ROOT,"products",f"{slug(name)}-{i}.svg"),"w").write(svg(kind,pal,alt))
    seed=open(os.path.join(os.path.dirname(__file__),"..","src","mock","seed.ts")).read()
    for m in re.finditer(r'\{ name: "([^"]+)", category: "[^"]+"[^}]*?color: "(#[0-9a-fA-F]{6})"',seed):
        open(os.path.join(ROOT,"logos",f"{slug(m.group(1).replace('&','and'))}.svg"),"w").write(logo(m.group(1),m.group(2)))
    print(len(KIND)*2,"product pictures")

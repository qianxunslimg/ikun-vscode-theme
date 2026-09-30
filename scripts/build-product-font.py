"""Optional regeneration: python3 -m pip install fonttools brotli.
The generated font is committed; ordinary npm builds do not require Python.
"""
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import SVGPath
root=Path(__file__).resolve().parent.parent
names=['locker','chick','court'];order=['.notdef']+names
glyphs={'.notdef':TTGlyphPen(None).glyph()}
for name in names:
    pen=TTGlyphPen(None)
    SVGPath(str(root/'assets/product'/f'{name}.svg')).draw(TransformPen(Cu2QuPen(pen,1.0,reverse_direction=True),(40,0,0,-40,32,960)))
    glyphs[name]=pen.glyph()
fb=FontBuilder(1024,isTTF=True);fb.setupGlyphOrder(order);fb.setupCharacterMap({0xE001+i:n for i,n in enumerate(names)})
fb.setupGlyf(glyphs);fb.setupHorizontalMetrics({n:(1024,0) for n in order});fb.setupHorizontalHeader(ascent=1024,descent=0)
fb.setupNameTable({'familyName':'IKUN Locker','styleName':'Regular','uniqueFontIdentifier':'IKUNLocker-0.2','fullName':'IKUN Locker','psName':'IKUNLocker'})
fb.setupOS2(sTypoAscender=1024,sTypoDescender=0,usWinAscent=1024,usWinDescent=0);fb.setupPost();fb.font.flavor='woff';fb.save(root/'icons/ikun.woff')

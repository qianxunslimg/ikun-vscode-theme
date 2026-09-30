import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const write=(name,value)=>fs.writeFileSync(path.join(root,name),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');
const glyphs={A:['010','101','111','101','101'],B:['110','101','110','101','110'],C:['011','100','100','100','011'],D:['110','101','101','101','110'],E:['111','100','110','100','111'],F:['111','100','110','100','100'],G:['011','100','101','101','011'],H:['101','101','111','101','101'],I:['111','010','010','010','111'],J:['001','001','001','101','010'],K:['101','101','110','101','101'],L:['100','100','100','100','111'],M:['101','111','111','101','101'],N:['101','111','111','111','101'],O:['010','101','101','101','010'],P:['110','101','110','100','100'],R:['110','101','110','101','101'],S:['011','100','010','001','110'],T:['111','010','010','010','010'],U:['101','101','101','101','111'],V:['101','101','101','101','010'],W:['101','101','111','111','101'],X:['101','101','010','101','101'],Y:['101','101','010','010','010'],'+':['000','010','111','010','000'],'#':['101','111','101','111','101']};
function label(text,color,y=12){const scale=1.25,w=(text.length*4-1)*scale;let d='';[...text].forEach((c,i)=>(glyphs[c]||glyphs.X).forEach((row,j)=>[...row].forEach((v,k)=>{if(v==='1')d+=`M${i*4+k} ${j}h1v1h-1Z`;})));return `<path transform="translate(${12-w/2} ${y}) scale(${scale})" d="${d}" fill="${color}"/>`;}
const svg=body=>`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${body}</svg>`;
const pathEl=(d,color,width=1.5)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const palettes={dark:{line:'#B8BEC9',white:'#EEEAE2',cloth:'#343943',ink:'#252930',ball:'#EEA064',seam:'#563C2E',chick:'#EACA82',hair:'#CACCD3',blue:'#94B6D6',green:'#A6C4A8',pink:'#C3A5C9',yellow:'#DCC28B'},light:{line:'#697383',white:'#F9F6EF',cloth:'#424956',ink:'#2B3039',ball:'#C97537',seam:'#523C30',chick:'#DEB461',hair:'#78818F',blue:'#487DA7',green:'#4F805C',pink:'#885F92',yellow:'#8F6B23'}};
const variants={};
for(const [variant,p] of Object.entries(palettes)){
 const motifs={};
 const ball=(cx=12,cy=12,r=9)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.ball}"/>${pathEl(`M${cx-r} ${cy}H${cx+r}M${cx} ${cy-r}V${cy+r}M${cx-r*.68} ${cy-r*.72}Q${cx+r*.3} ${cy} ${cx-r*.68} ${cy+r*.72}M${cx+r*.68} ${cy-r*.72}Q${cx-r*.3} ${cy} ${cx+r*.68} ${cy+r*.72}`,p.seam,1.2)}`;
 const hair=`<path d="M4 10C2 3 9 1 12 4C15 1 22 3 20 10C16 10 14 8 12 5C10 8 8 10 4 10Z" fill="${p.hair}"/>`;
 const chick=`<path d="M4 12C4 7 20 7 20 12V16C20 23 4 23 4 16Z" fill="${p.chick}"/>${hair}<circle cx="8.5" cy="12.5" r="1" fill="${p.ink}"/><circle cx="15.5" cy="12.5" r="1" fill="${p.ink}"/><path d="M10 15H14L12 17Z" fill="${p.ball}"/><path d="M6 18H18V21H6Z" fill="${p.cloth}"/><path d="M8 17V21M16 17V21" stroke="${p.white}" stroke-width="1.7"/>`;
 // A broad folder silhouette remains legible at 16px; centered straps carry the motif.
 const pocket=(open=false,mark='')=>`<path d="M2 6Q2 4 4 4H9L11 6H20Q22 6 22 8V18Q22 20 20 20H4Q2 20 2 18Z" fill="${p.ball}"/>${open?`<path d="M2 10H22L20 20H4Z" fill="${p.yellow}"/>`:''}<path d="M8 8V17M16 8V17" stroke="${p.ink}" stroke-width="2.5"/><path d="M6 13H18V18H6Z" fill="${p.ink}"/><circle cx="8" cy="14" r=".8" fill="${p.white}"/><circle cx="16" cy="14" r=".8" fill="${p.white}"/>${mark||''}`;
 const jersey=(text,color)=>`<path d="M8 3L3 5L1 10L5 12L6 10V21H18V10L19 12L23 10L21 5L16 3Q12 7 8 3Z" fill="${p.cloth}" stroke="${p.line}" stroke-width="1.1" stroke-linejoin="round"/><path d="M8 4V10M16 4V10" stroke="${p.white}" stroke-width="2"/>${label(text,color)}`;
 motifs.root=ball();motifs.chicken=chick;motifs.folder=pocket();motifs['folder-open']=pocket(true);
 motifs['folder-src']=pocket(false,pathEl('M10 16L8 17L10 18M14 16L16 17L14 18',p.blue,1.3));
 motifs['folder-src-open']=pocket(true,pathEl('M10 16L8 17L10 18M14 16L16 17L14 18',p.blue,1.3));
 motifs['folder-docs']=pocket(false,pathEl('M9 16H15M9 18H13',p.yellow,1.2));
 motifs['folder-docs-open']=pocket(true,pathEl('M9 16H15M9 18H13',p.yellow,1.2));
 motifs['folder-test']=pocket(false,pathEl('M9 17L11 19L16 15',p.green,1.5));
 motifs['folder-test-open']=pocket(true,pathEl('M9 17L11 19L16 15',p.green,1.5));
 for(const [id,text,c] of [['js','JS','yellow'],['ts','TS','blue'],['jsx','JX','blue'],['tsx','TX','blue'],['python','PY','yellow'],['go','GO','blue'],['rust','RS','ball'],['java','JV','ball'],['c','C','blue'],['cpp','C+','blue'],['csharp','C#','pink'],['vue','V','green'],['svelte','S','ball'],['ruby','RB','pink'],['php','PH','pink'],['swift','SW','ball'],['kotlin','KT','pink'],['dart','D','blue']])motifs[id]=jersey(text,palettes.dark[c]);
 motifs.shirt=jersey('K',p.white);
 const board=(inner,color=p.line)=>`<rect x="4" y="5" width="16" height="16" rx="2" fill="${p.cloth}" stroke="${color}" stroke-width="1.3"/><path d="M8 5V3H16V5" fill="none" stroke="${color}" stroke-width="1.5"/>${inner}`;
 motifs.config=board(pathEl('M8 9L11 12L8 15M13 17H16M16 9L13 12',p.line,1.3));
 motifs.data=board(pathEl('M10 9H8V12L7 13L8 14V17H10M14 9H16V12L17 13L16 14V17H14',p.yellow,1.3));
 motifs.css=board(pathEl('M8 9H16M7 13H15M8 17H16M11 8L9 18M15 8L13 18',p.pink,1.2));
 motifs.html=board(pathEl('M10 10L7 13L10 16M14 10L17 13L14 16',p.ball,1.6));motifs.code=motifs.html;
 motifs.file=`<path d="M6 3H15L19 7V21H6Z" fill="${p.cloth}" stroke="${p.line}" stroke-width="1.3"/><path d="M9 4V10M15 7V10" stroke="${p.white}" stroke-width="1.8"/>${pathEl('M10 14H15M10 17H14',p.line,1.3)}`;
 motifs.markdown=board(label('M',p.blue,11),p.blue);
 motifs.shell=`${ball(10,11,8)}<rect x="8" y="12" width="15" height="10" rx="2" fill="${p.cloth}" stroke="${p.line}" stroke-width="1.2"/>${pathEl('M11 15L13 17L11 19M16 19H19',p.white,1.5)}`;
 motifs.test=`${pathEl('M4 4H20V12M9 7H15V10',p.line,1.5)}<ellipse cx="12" cy="12" rx="7" ry="2" fill="none" stroke="${p.ball}" stroke-width="1.5"/>${pathEl('M6 14L8 21H16L18 14M8 15L15 21M16 15L9 21',p.line,1)}`;
 motifs.image=`<rect x="3" y="3" width="18" height="19" rx="2" fill="${p.white}"/><rect x="5" y="5" width="14" height="13" rx="1" fill="${p.cloth}"/><g transform="translate(5 4) scale(.59)">${chick}</g><path d="M9 20H15" stroke="${p.line}" stroke-width="1"/>`;
 motifs.audio=`<rect x="10" y="3" width="7" height="12" rx="3.5" fill="${p.line}" transform="rotate(30 13 9)"/>${pathEl('M10 14L5 22M15 16C13 18 9 17 8 15M11 6L16 9M10 9L15 12',p.cloth,1.2)}${pathEl('M9 16L6 21',p.ball,2)}`;
 motifs.video=`<rect x="3" y="7" width="18" height="14" rx="2" fill="${p.cloth}" stroke="${p.line}" stroke-width="1.3"/><path d="M3 4H21V8H3Z" fill="${p.line}"/>${pathEl('M7 4L5 8M13 4L11 8M19 4L17 8',p.cloth,2)}<path d="M10 11L16 14L10 18Z" fill="${p.ball}"/>`;
 motifs.lock=`${pathEl('M7 10V7C7 1 17 1 17 7V10',p.line,2)}<rect x="4" y="9" width="16" height="13" rx="3" fill="${p.cloth}" stroke="${p.line}" stroke-width="1.2"/><circle cx="12" cy="15" r="2" fill="${p.ball}"/><path d="M12 16V18" stroke="${p.ball}" stroke-width="2"/>`;
 motifs.package=`<path d="M3 7L12 3L21 7V19L12 23L3 19Z" fill="${p.cloth}" stroke="${p.line}" stroke-width="1.3"/>${pathEl('M3 7L12 11L21 7M12 11V23M7 5L16 9V13',p.line,1.1)}<g transform="translate(12 12) scale(.42)">${ball()}</g>`;
 motifs.git=pathEl('M7 4V17Q7 20 10 20H17M7 10H13Q17 10 17 6',p.line,1.5)+[ [7,4],[17,5],[17,20]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.5" fill="${p.ball}" stroke="${p.seam}" stroke-width="1"/>`).join('');
 motifs.docker=`<path d="M3 14H22Q20 22 11 22Q4 22 3 14Z" fill="${p.blue}"/>${pathEl('M7 10H11V14H7ZM12 10H16V14H12ZM12 5H16V9H12ZM17 10H21V14H17Z',p.blue,1.1)}<circle cx="7" cy="17" r="1" fill="${p.cloth}"/>`;
 motifs.license=board(pathEl('M8 10L11 13L17 8M8 17H16',p.green,1.7));
 motifs.archive=`<rect x="3" y="4" width="18" height="18" rx="2" fill="${p.cloth}" stroke="${p.line}" stroke-width="1.2"/><path d="M8 4V10M16 4V10" stroke="${p.white}" stroke-width="2"/>${pathEl('M11 8H13M11 11H13M11 14H13M11 17H13',p.ball,1.6)}`;
 motifs.database=`<ellipse cx="12" cy="6" rx="8" ry="3" fill="${p.cloth}" stroke="${p.blue}" stroke-width="1.3"/><path d="M4 6V19C4 23 20 23 20 19V6M4 12C4 16 20 16 20 12M4 18C4 22 20 22 20 18" fill="none" stroke="${p.blue}" stroke-width="1.3"/>`;
 const defs={};for(const [name,body]of Object.entries(motifs)){const id=variant==='light'?name+'-light':name;write(`icons/${id}.svg`,svg(body));defs[id]={iconPath:`./${id}.svg`};}variants[variant]={defs,motifs};
}
const lang={javascript:'js',typescript:'ts',javascriptreact:'jsx',typescriptreact:'tsx',python:'python',html:'html',css:'css',scss:'css',less:'css',json:'data',jsonc:'data',yaml:'config',toml:'config',markdown:'markdown',cpp:'cpp',c:'c',csharp:'csharp',rust:'rust',go:'go',java:'java',shellscript:'shell',powershell:'shell',bat:'shell',dockerfile:'docker',xml:'data',vue:'vue',svelte:'svelte',ruby:'ruby',php:'php',swift:'swift',kotlin:'kotlin',dart:'dart',sql:'database',ini:'config',properties:'config',makefile:'config'};
const ext={cmake:'config',sh:'shell',bash:'shell',zsh:'shell',fish:'shell',ps1:'shell',bat:'shell',cmd:'shell',js:'js',mjs:'js',cjs:'js',ts:'ts',tsx:'tsx',jsx:'jsx',py:'python',pyi:'python',go:'go',rs:'rust',java:'java',c:'c',h:'c',cc:'cpp',cpp:'cpp',hpp:'cpp',cs:'csharp',rb:'ruby',php:'php',swift:'swift',kt:'kotlin',vue:'vue',svelte:'svelte',dart:'dart',html:'html',css:'css',scss:'css',json:'data',jsonc:'data',yaml:'config',yml:'config',toml:'config',ini:'config',env:'config',conf:'config',xml:'data',png:'image',jpg:'image',jpeg:'image',webp:'image',gif:'image',svg:'image',ico:'image',mp3:'audio',wav:'audio',ogg:'audio',flac:'audio',mp4:'video',webm:'video',md:'markdown',mdx:'markdown',txt:'markdown',csv:'data',sql:'database',db:'database',sqlite:'database',lock:'lock',zip:'archive',gz:'archive',tar:'archive',vsix:'package','test.js':'test','test.ts':'test','spec.js':'test','spec.ts':'test','test.tsx':'test','spec.tsx':'test'};
const files={'.bashrc':'shell','.zshrc':'shell','.bash_profile':'shell','.profile':'shell','package.json':'package','package-lock.json':'lock','yarn.lock':'lock','pnpm-lock.yaml':'lock','Cargo.toml':'package','Cargo.lock':'lock','pyproject.toml':'package','requirements.txt':'package','.gitignore':'git','.gitattributes':'git','LICENSE':'license','LICENSE.md':'license','Dockerfile':'docker','docker-compose.yml':'docker','compose.yaml':'docker','Makefile':'config','CMakeLists.txt':'config','.env':'config','.env.local':'config','README.md':'chicken','AGENTS.md':'chicken','CLAUDE.md':'chicken'};
const folders={src:'folder-src',lib:'folder-src',app:'folder-src',components:'folder-src',test:'folder-test',tests:'folder-test',__tests__:'folder-test',docs:'folder-docs',scripts:'folder-src',media:'folder',assets:'folder','.git':'folder',node_modules:'folder',build:'folder',dist:'folder'};
const expanded=Object.fromEntries(Object.entries(folders).map(([k,v])=>[k,v+'-open']));
const lightMap=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,v+'-light']));
const theme={iconDefinitions:{...variants.dark.defs,...variants.light.defs},file:'file',folder:'folder',folderExpanded:'folder-open',rootFolder:'folder',rootFolderExpanded:'folder-open',languageIds:lang,fileExtensions:ext,fileNames:files,folderNames:folders,folderNamesExpanded:expanded};
theme.light={file:'file-light',folder:'folder-light',folderExpanded:'folder-open-light',rootFolder:'folder-light',rootFolderExpanded:'folder-open-light',languageIds:lightMap(lang),fileExtensions:lightMap(ext),fileNames:lightMap(files),folderNames:lightMap(folders),folderNamesExpanded:lightMap(expanded)};
write('icons/ikun-icon-theme.json',theme);
// Product icons keep neutral colors, with familiar fallback symbols for unrelated commands.
fs.copyFileSync(path.join(root,'node_modules/@phosphor-icons/web/src/regular/Phosphor.woff'),path.join(root,'icons/phosphor.woff'));
fs.copyFileSync(path.join(root,'node_modules/@phosphor-icons/core/LICENSE'),path.join(root,'icons/PHOSPHOR-LICENSE'));
const css=fs.readFileSync(path.join(root,'node_modules/@phosphor-icons/web/src/regular/style.css'),'utf8');
const product={};
for(const [name,glyph]of Object.entries({files:'t-shirt',search:'magnifying-glass','source-control':'git-branch','debug-alt':'basketball',extensions:'squares-four',settings:'sliders-horizontal',account:'user-circle',bell:'bell',terminal:'terminal-window',play:'play','debug-start':'play','debug-pause':'pause','debug-stop':'stop','color-mode':'palette',heart:'heart','star-full':'star',music:'microphone-stage'})){
 const m=css.match(new RegExp('\\.ph-'+glyph+':{1,2}before\\s*\\{\\s*content:\\s*"(\\\\[a-f0-9]+)"'));if(!m)throw Error(glyph);product[name]={fontCharacter:m[1],fontId:'ikun-phosphor'};
}
for (const [name,glyph] of Object.entries({files:'\\e001',account:'\\e002','debug-alt':'\\e003'})) product[name]={fontCharacter:glyph,fontId:'ikun-original'};
write('icons/ikun-product-icon-theme.json',{fonts:[{id:'ikun-original',src:[{path:'./ikun.woff',format:'woff'}],weight:'normal',style:'normal'},{id:'ikun-phosphor',src:[{path:'./phosphor.woff',format:'woff'}],weight:'normal',style:'normal'}],iconDefinitions:product});
write('media/basketball.svg',fs.readFileSync(path.join(root,'assets/product/chick.svg'),'utf8'));
// Remove legacy outputs to keep the package and validation aligned with the manifest.
const active=new Set(Object.values(theme.iconDefinitions).map(d=>path.basename(d.iconPath)));
for(const file of fs.readdirSync(path.join(root,'icons')))if(file.endsWith('.svg')&&!active.has(file))fs.unlinkSync(path.join(root,'icons',file));
console.log(`Generated ${active.size} original dark/light icon assets; ${Object.keys(ext).length} extension mappings.`);

import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const save = (name, value) => writeFileSync(path.join(root, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
for (const dir of ['themes', 'icons', 'media', 'docs', 'test']) mkdirSync(path.join(root, dir), { recursive: true });

const palettes = [
  { file: 'suspenders', name: 'IKUN · 背带裤黑', bg: '#19191C', panel: '#141416', raised: '#242428', fg: '#E9E6E0', muted: '#9B99A2', border: '#35343B', accent: '#F5AA70', selection: '#44352D', green: '#B6D5A0', blue: '#A9C9E8', pink: '#D5B6E6', red: '#F28F91', yellow: '#E2CA8F', type: 'dark' },
  { file: 'court', name: 'IKUN · 球场白', bg: '#FAF9F6', panel: '#EFEDE7', raised: '#FFFFFF', fg: '#28262B', muted: '#69646B', border: '#D8D3CC', accent: '#A94B18', selection: '#EFDFCD', green: '#38643E', blue: '#275B87', pink: '#794B93', red: '#AD343D', yellow: '#775D14', type: 'light' },
  { file: 'stage', name: 'IKUN · 舞台夜', bg: '#191521', panel: '#110F17', raised: '#262031', fg: '#EFE7F4', muted: '#A79BB8', border: '#3C3249', accent: '#F4AF75', selection: '#473258', green: '#B5DBB1', blue: '#A7CFF4', pink: '#D9B1F2', red: '#F797B2', yellow: '#E9D49A', type: 'dark' }
];
for (const p of palettes) {
  const c = {
    foreground: p.fg, descriptionForeground: p.muted, disabledForeground: p.muted,
    focusBorder: p.accent, errorForeground: p.red, 'widget.border': p.border,
    'selection.background': p.selection, 'textLink.foreground': p.accent, 'textLink.activeForeground': p.fg,
    'textCodeBlock.background': p.panel, 'textBlockQuote.background': p.panel, 'textBlockQuote.border': p.accent,
    'editor.background': p.bg, 'editor.foreground': p.fg, 'editorLineNumber.foreground': p.muted,
    'editorLineNumber.activeForeground': p.accent, 'editorCursor.foreground': p.accent,
    'editor.selectionBackground': p.selection, 'editor.inactiveSelectionBackground': p.selection + '88',
    'editor.selectionHighlightBackground': p.accent + '22', 'editor.wordHighlightBackground': p.accent + '22',
    'editor.wordHighlightStrongBackground': p.accent + '33', 'editor.lineHighlightBackground': p.raised,
    'editor.findMatchBackground': p.accent + '55', 'editor.findMatchBorder': p.accent,
    'editor.findMatchHighlightBackground': p.accent + '22', 'editorWhitespace.foreground': p.border,
    'editorIndentGuide.background1': p.border, 'editorIndentGuide.activeBackground1': p.muted,
    'editorRuler.foreground': p.border, 'editorBracketMatch.background': p.selection,
    'editorBracketMatch.border': p.accent, 'editorError.foreground': p.red,
    'editorWarning.foreground': p.yellow, 'editorInfo.foreground': p.blue,
    'editorGutter.addedBackground': p.green, 'editorGutter.modifiedBackground': p.blue,
    'editorGutter.deletedBackground': p.red, 'editorOverviewRuler.border': p.border,
    'editorGroup.border': p.border, 'editorGroupHeader.tabsBackground': p.panel,
    'editorGroupHeader.noTabsBackground': p.panel, 'tab.activeBackground': p.bg,
    'tab.activeForeground': p.fg, 'tab.activeBorderTop': p.accent, 'tab.inactiveBackground': p.panel,
    'tab.inactiveForeground': p.muted, 'tab.border': p.panel, 'tab.hoverBackground': p.raised,
    'activityBar.background': p.panel, 'activityBar.foreground': p.accent,
    'activityBar.inactiveForeground': p.muted, 'activityBar.border': p.border,
    'activityBar.activeBorder': p.accent, 'activityBarBadge.background': p.accent,
    'activityBarBadge.foreground': p.bg, 'sideBar.background': p.panel, 'sideBar.foreground': p.fg,
    'sideBar.border': p.border, 'sideBarTitle.foreground': p.fg,
    'sideBarSectionHeader.background': p.panel, 'sideBarSectionHeader.foreground': p.muted,
    'sideBarSectionHeader.border': p.border, 'list.activeSelectionBackground': p.selection,
    'list.activeSelectionForeground': p.fg, 'list.inactiveSelectionBackground': p.raised,
    'list.inactiveSelectionForeground': p.fg, 'list.hoverBackground': p.raised,
    'list.focusBackground': p.selection, 'list.focusForeground': p.fg,
    'list.highlightForeground': p.accent, 'list.focusHighlightForeground': p.accent,
    'list.focusOutline': p.accent, 'tree.indentGuidesStroke': p.border,
    'titleBar.activeBackground': p.panel, 'titleBar.activeForeground': p.fg,
    'titleBar.inactiveBackground': p.panel, 'titleBar.inactiveForeground': p.muted,
    'titleBar.border': p.border, 'commandCenter.background': p.raised,
    'commandCenter.foreground': p.muted, 'commandCenter.border': p.border,
    'statusBar.background': p.panel, 'statusBar.foreground': p.muted, 'statusBar.border': p.border,
    'statusBar.noFolderBackground': p.panel, 'statusBar.debuggingBackground': p.selection,
    'statusBar.debuggingForeground': p.fg, 'statusBarItem.remoteBackground': p.accent,
    'statusBarItem.remoteForeground': p.bg, 'statusBarItem.hoverBackground': p.raised,
    'statusBarItem.prominentBackground': p.selection, 'statusBarItem.prominentForeground': p.fg,
    'panel.background': p.panel, 'panel.border': p.border,
    'panelTitle.activeForeground': p.fg, 'panelTitle.activeBorder': p.accent,
    'panelTitle.inactiveForeground': p.muted, 'terminal.background': p.panel,
    'terminal.foreground': p.fg, 'terminalCursor.foreground': p.accent,
    'terminal.selectionBackground': p.selection,
    'button.background': p.accent, 'button.foreground': p.bg, 'button.hoverBackground': p.accent + 'DD',
    'button.secondaryBackground': p.raised, 'button.secondaryForeground': p.fg,
    'button.secondaryHoverBackground': p.selection, 'badge.background': p.accent, 'badge.foreground': p.bg,
    'input.background': p.bg, 'input.foreground': p.fg, 'input.border': p.border,
    'input.placeholderForeground': p.muted, 'inputOption.activeBorder': p.accent,
    'inputOption.activeBackground': p.selection, 'inputOption.activeForeground': p.fg,
    'dropdown.background': p.raised, 'dropdown.foreground': p.fg, 'dropdown.border': p.border,
    'checkbox.background': p.raised, 'checkbox.foreground': p.accent, 'checkbox.border': p.border,
    'quickInput.background': p.raised, 'quickInput.foreground': p.fg,
    'quickInputList.focusBackground': p.selection, 'pickerGroup.foreground': p.accent,
    'pickerGroup.border': p.border, 'editorWidget.background': p.raised,
    'editorWidget.foreground': p.fg, 'editorWidget.border': p.border,
    'editorSuggestWidget.background': p.raised, 'editorSuggestWidget.foreground': p.fg,
    'editorSuggestWidget.border': p.border, 'editorSuggestWidget.selectedBackground': p.selection,
    'editorSuggestWidget.highlightForeground': p.accent, 'editorHoverWidget.background': p.raised,
    'editorHoverWidget.foreground': p.fg, 'editorHoverWidget.border': p.border,
    'notifications.background': p.raised, 'notifications.foreground': p.fg,
    'notifications.border': p.border, 'notificationCenterHeader.background': p.panel,
    'menu.background': p.raised, 'menu.foreground': p.fg, 'menu.selectionBackground': p.selection,
    'menu.selectionForeground': p.fg, 'menu.separatorBackground': p.border,
    'progressBar.background': p.accent, 'scrollbarSlider.background': p.muted + '33',
    'scrollbarSlider.hoverBackground': p.muted + '55', 'scrollbarSlider.activeBackground': p.muted + '77',
    'gitDecoration.modifiedResourceForeground': p.blue, 'gitDecoration.addedResourceForeground': p.green,
    'gitDecoration.deletedResourceForeground': p.red, 'gitDecoration.untrackedResourceForeground': p.green,
    'gitDecoration.ignoredResourceForeground': p.muted, 'gitDecoration.conflictingResourceForeground': p.yellow,
    'diffEditor.insertedTextBackground': p.green + '25', 'diffEditor.removedTextBackground': p.red + '25',
    'diffEditor.insertedLineBackground': p.green + '12', 'diffEditor.removedLineBackground': p.red + '12',
    'merge.currentHeaderBackground': p.green + '44', 'merge.currentContentBackground': p.green + '18',
    'merge.incomingHeaderBackground': p.blue + '44', 'merge.incomingContentBackground': p.blue + '18',
    'breadcrumb.foreground': p.muted, 'breadcrumb.focusForeground': p.accent,
    'settings.headerForeground': p.fg, 'settings.modifiedItemIndicator': p.accent,
    'welcomePage.background': p.bg, 'welcomePage.tileBackground': p.raised,
    'welcomePage.tileHoverBackground': p.selection, 'debugToolBar.background': p.raised,
    'charts.orange': p.accent, 'charts.green': p.green, 'charts.blue': p.blue,
    'charts.purple': p.pink, 'charts.red': p.red, 'charts.yellow': p.yellow,
    'testing.iconPassed': p.green, 'testing.iconFailed': p.red, 'testing.iconQueued': p.yellow,
    'testing.iconUnset': p.muted, 'minimap.selectionHighlight': p.accent + '66',
    'notebook.editorBackground': p.bg, 'notebook.cellBorderColor': p.border,
    'notebook.selectedCellBackground': p.raised, 'peekView.border': p.accent,
    'peekViewEditor.background': p.panel, 'peekViewResult.background': p.raised,
    'peekViewTitle.background': p.raised, 'peekViewTitleLabel.foreground': p.fg,
    'peekViewResult.selectionBackground': p.selection, 'peekViewResult.selectionForeground': p.fg
  };
  const ansi = { Black:p.border, Red:p.red, Green:p.green, Yellow:p.yellow, Blue:p.blue, Magenta:p.pink, Cyan:p.blue, White:p.fg };
  for (const [key, color] of Object.entries(ansi)) { c['terminal.ansi' + key] = color; c['terminal.ansiBright' + key] = color; }
  [p.accent,p.blue,p.pink,p.green,p.yellow,p.fg].forEach((v,i) => c['editorBracketHighlight.foreground' + (i+1)] = v);
  const rule = (name, scope, foreground, fontStyle) => ({ name, scope: scope.split('|'), settings: { foreground, ...(fontStyle ? {fontStyle} : {}) } });
  save(`themes/${p.file}-color-theme.json`, {
    $schema: 'vscode://schemas/color-theme', name:p.name, type:p.type, semanticHighlighting:true, colors:c,
    tokenColors:[
      rule('Comments','comment|punctuation.definition.comment',p.muted,'italic'),
      rule('Strings','string|markup.inline.raw',p.green),
      rule('Keywords','keyword|storage.type|storage.modifier',p.pink),
      rule('Functions','entity.name.function|support.function|meta.function-call',p.accent),
      rule('Types','entity.name.type|entity.name.class|support.type|support.class',p.blue),
      rule('Constants','constant.numeric|constant.language|constant.character|variable.other.constant',p.yellow),
      rule('Parameters','variable.parameter',p.fg),
      rule('Properties','variable.other.property|support.type.property-name|entity.other.attribute-name',p.blue),
      rule('Tags','entity.name.tag',p.accent),
      rule('Punctuation','punctuation|meta.brace',p.muted),
      rule('Operators','keyword.operator',p.fg),
      rule('Headings','markup.heading|entity.name.section',p.accent,'bold'),
      rule('Bold','markup.bold',p.fg,'bold'), rule('Italic','markup.italic',p.fg,'italic'),
      rule('Links','markup.underline.link',p.blue,'underline'),
      rule('Inserted','markup.inserted',p.green), rule('Deleted','markup.deleted',p.red),
      rule('Invalid','invalid',p.red)
    ],
    semanticTokenColors:{ namespace:p.blue, type:p.blue, class:p.blue, enum:p.blue, interface:p.blue,
      typeParameter:p.blue, function:p.accent, method:p.accent, macro:p.accent, keyword:p.pink,
      parameter:p.fg, variable:p.fg, property:p.blue, enumMember:p.yellow,
      'variable.readonly':p.yellow, 'property.readonly':p.yellow, string:p.green, number:p.yellow,
      comment:{foreground:p.muted,italic:true}, decorator:p.pink }
  });
}

// Keep recognizable language glyphs; basketball and jerseys identify the club, not every file.
const definitions = {};
const icons = {
  file:['file','#A5A1AA'], folder:['folder','#F5AA70'], 'folder-open':['folder-open','#F5AA70'],
  root:['basketball','#F5AA70'], code:['code','#A9C9E8'], js:['file-js','#E2CA8F'],
  ts:['file-ts','#A9C9E8'], jsx:['file-jsx','#B6D5A0'], tsx:['file-tsx','#A9C9E8'],
  python:['file-py','#E2CA8F'], shell:['terminal-window','#B6D5A0'], css:['file-css','#D5B6E6'], html:['file-html','#F5AA70'],
  config:['sliders-horizontal','#A5A1AA'], data:['brackets-curly','#E2CA8F'],
  image:['image','#D5B6E6'], audio:['microphone-stage','#F5AA70'], video:['film-strip','#D5B6E6'],
  markdown:['article','#A9C9E8'], test:['check-circle','#B6D5A0'], lock:['lock-key','#A5A1AA'],
  package:['package','#F5AA70'], git:['git-branch','#F5AA70'], shirt:['t-shirt','#E9E6E0'],
  docker:['shipping-container','#A9C9E8'], license:['seal-check','#B6D5A0']
};
for (const [name,[glyph,color]] of Object.entries(icons)) {
  const raw = readFileSync(path.join(root,`node_modules/@phosphor-icons/core/assets/regular/${glyph}.svg`),'utf8');
  save(`icons/${name}.svg`,raw.replace('fill="currentColor"', 'fill="'+color+'"'));
  definitions[name] = { iconPath:`./${name}.svg` };
}
const languageIds = {javascript:'js',typescript:'ts',javascriptreact:'jsx',typescriptreact:'tsx',python:'python',html:'html',css:'css',scss:'css',less:'css',json:'data',jsonc:'data',yaml:'config',toml:'config',markdown:'markdown',cpp:'code',c:'code',rust:'code',go:'code',java:'code',shellscript:'shell',dockerfile:'docker',xml:'code',vue:'jsx',svelte:'jsx'};
save('icons/ikun-icon-theme.json', {iconDefinitions:definitions,file:'file',folder:'folder',folderExpanded:'folder-open',rootFolder:'root',rootFolderExpanded:'root',languageIds,
  fileExtensions:{sh:'shell',bash:'shell',zsh:'shell',fish:'shell',ps1:'shell',bat:'shell',cmd:'shell',js:'js',mjs:'js',cjs:'js',ts:'ts',tsx:'tsx',jsx:'jsx',py:'python',png:'image',jpg:'image',jpeg:'image',webp:'image',gif:'image',svg:'image',mp3:'audio',wav:'audio',ogg:'audio',mp4:'video',webm:'video',md:'markdown',csv:'data',sql:'data',lock:'lock'},
  fileNames:{'.bashrc':'shell','.zshrc':'shell','.bash_profile':'shell','.profile':'shell','package.json':'package','package-lock.json':'lock','.gitignore':'git','LICENSE':'license','Dockerfile':'docker','docker-compose.yml':'docker'},
  folderNames:{src:'shirt',test:'test',tests:'test',media:'image',assets:'image','.git':'git'},
  folderNamesExpanded:{src:'shirt',test:'test',tests:'test',media:'image',assets:'image','.git':'git'},
  light:{file:'file',folder:'folder',folderExpanded:'folder-open'} });
copyFileSync(path.join(root,'node_modules/@phosphor-icons/web/src/regular/Phosphor.woff'),path.join(root,'icons/phosphor.woff'));
copyFileSync(path.join(root,'node_modules/@phosphor-icons/core/LICENSE'),path.join(root,'icons/PHOSPHOR-LICENSE'));
const css = readFileSync(path.join(root,'node_modules/@phosphor-icons/web/src/regular/style.css'),'utf8');
const product = {};
const glyphs = {files:'t-shirt',search:'magnifying-glass','source-control':'git-branch','debug-alt':'basketball',extensions:'squares-four',settings:'sliders-horizontal',account:'user-circle',bell:'bell',terminal:'terminal-window',play:'play', 'debug-start':'play','debug-pause':'pause','debug-stop':'stop','color-mode':'palette','heart':'heart','star-full':'star','music':'microphone-stage'};
for (const [name,glyph] of Object.entries(glyphs)) {
  const match = css.match(new RegExp('\\.ph-'+glyph+':{1,2}before\\s*\\{\\s*content:\\s*"(\\\\[a-f0-9]+)"'));
  if (!match) throw new Error(`Missing icon ${glyph}`);
  product[name]={fontCharacter:match[1],fontId:'ikun-phosphor'};
}
save('icons/ikun-product-icon-theme.json',{fonts:[{id:'ikun-phosphor',src:[{path:'./phosphor.woff',format:'woff'}],weight:'normal',style:'normal'}],iconDefinitions:product});
const basketball = readFileSync(path.join(root,'node_modules/@phosphor-icons/core/assets/regular/basketball.svg'),'utf8');
save('media/basketball.svg', basketball);
console.log('Generated 3 color themes, file icons, and product icons.');

// Original code-native IKUN motifs, drawn on a 32px grid for Explorer readability.
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${body}</svg>`;
const chick = `<path d="M8 15C8 7 24 7 24 15V23C24 29 8 29 8 23Z" fill="#E9C36B" stroke="#7E5A22" stroke-width="1.2"/><path d="M7 14Q8 3 16 6Q24 3 25 14L19 11L16 7L13 11Z" fill="#B7B8C1" stroke="#56545F" stroke-width="1.2"/><circle cx="12" cy="18" r="1.3" fill="#252329"/><circle cx="20" cy="18" r="1.3" fill="#252329"/><path d="M14 20L18 20L16 23Z" fill="#C9682F"/><path d="M10 24L22 24L23 28L9 28Z" fill="#34323A"/><path d="M12 23V28M20 23V28" stroke="#F4EEE5" stroke-width="2"/>`;
const ball = `<circle cx="16" cy="16" r="12" fill="#ECA05D" stroke="#74441F" stroke-width="1.5"/><path d="M4 16H28M16 4V28M8 7Q24 16 8 25M24 7Q8 16 24 25" fill="none" stroke="#74441F" stroke-width="1.4"/>`;
save('icons/chicken.svg',wrap(chick));save('icons/root.svg',wrap(ball));
const iconTheme=JSON.parse(readFileSync(path.join(root,'icons/ikun-icon-theme.json')));
iconTheme.iconDefinitions.chicken={iconPath:'./chicken.svg'};
iconTheme.folderNames={...iconTheme.folderNames,scripts:'shell',build:'root',dist:'root',public:'root'};
iconTheme.folderNamesExpanded={...iconTheme.folderNamesExpanded,scripts:'shell',build:'root',dist:'root',public:'root'};
save('icons/ikun-icon-theme.json',iconTheme);
save('media/chicken.svg',wrap(chick));
// Neutral activity-bar icon; fixed colors belong in the file icon theme.
save('media/basketball.svg',basketball);

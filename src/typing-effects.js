const fs = require('node:fs');
const path = require('node:path');
const STYLES = ['basketball', 'chick', 'spark'];
const FRAMES = 12;
function frameSvg(style, frame, color, intensity = 'subtle') {
  const t = frame / (FRAMES - 1), strong = intensity === 'lively';
  const alpha = Math.pow(1 - t, .65).toFixed(3);
  const x = 9 + t * (strong ? 17 : 11), y = 22 - Math.sin(t * Math.PI) * (strong ? 7 : 4);
  const r = strong ? 5 : 4;
  const particles = Array.from({length:strong ? 5 : 3}, (_, i) => {
    const a = -Math.PI * (.15 + i * .22), distance = 3 + t * (strong ? 16 : 11);
    const px = 8 + Math.cos(a) * distance, py = 23 + Math.sin(a) * distance;
    return `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${(1.1-t*.5).toFixed(2)}" fill="${color}"/>`;
  }).join('');
  let mark = '';
  if (style === 'basketball') mark = `<g transform="translate(${x} ${y}) rotate(${t*210})"><circle r="${r}" fill="${color}"/><path d="M-${r} 0H${r}M0 -${r}V${r}M-2 -3Q2 0 -2 3M2 -3Q-2 0 2 3" fill="none" stroke="#362B28" stroke-width=".65"/></g>`;
  if (style === 'chick') mark = `<g transform="translate(${x-5} ${y-6})"><ellipse cx="5" cy="6" rx="4.5" ry="5" fill="${color}"/><path d="M.5 4C-1 0 3-1 5 1C7-1 11 0 9.5 4Q6 4 5 2Q3 4 .5 4Z" fill="#AEB3C2"/><circle cx="3" cy="5.5" r=".55" fill="#28252A"/><circle cx="7" cy="5.5" r=".55" fill="#28252A"/><path d="M4 7H6L5 8Z" fill="#CC743D"/><path d="M2 9H8V11H2Z" fill="#343943"/><path d="M3 9V11M7 9V11" stroke="#EEEAE2" stroke-width="1"/></g>`;
  if (style === 'spark') mark = `<path d="M${x} ${y-3}V${y+3}M${x-3} ${y}H${x+3}" stroke="${color}" stroke-width="1"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="28" viewBox="0 0 40 28"><g opacity="${alpha}">${particles}${mark}</g></svg>`;
}
// TextDocument changes cannot distinguish short pastes or another extension's small edit.
// Limit to small insertions at the active caret and exclude undo, deletion and bulk changes.
function typingPosition(vscode, event, editor) {
  if (!editor || event.document !== editor.document || event.reason || event.contentChanges.length !== 1) return;
  if (editor.selections.length !== 1) return;
  const change = event.contentChanges[0];
  if (!change.text || [...change.text].length > 8 || /[\r\n]/.test(change.text) || change.rangeLength > 8) return;
  const caret = editor.selection.active;
  const atOldCaret = caret.isEqual(change.range.end);
  const end = new vscode.Position(change.range.start.line, change.range.start.character + change.text.length);
  if (!atOldCaret && !caret.isEqual(end)) return;
  return end;
}
function activateTyping(vscode, context) {
  let timer, currentEditor, activeType, types = [], signature = '', last = 0, disposed = false;
  function clear() {
    clearTimeout(timer); timer = undefined;
    if (currentEditor && activeType) currentEditor.setDecorations(activeType, []);
    currentEditor = activeType = undefined;
  }
  function release() {clear();for (const type of types) type.dispose();types=[];signature='';}
  function settings(editor) {
    const c = vscode.workspace.getConfiguration('ikun.typing');
    const style = c.get('style', 'basketball');
    const color = c.get('color', '#F5AA70');
    const fontSize = Math.max(6, Number(vscode.workspace.getConfiguration('editor',editor?.document.uri).get('fontSize',14)) || 14);
    return {fontSize,enabled:c.get('enabled', true),style:STYLES.includes(style)?style:'basketball',color:/^#[\da-f]{6}$/i.test(color)?color:'#F5AA70',intensity:c.get('intensity','subtle')==='lively'?'lively':'subtle'};
  }
  function prepare(options) {
    const key = JSON.stringify(options);
    if (signature === key) return;
    release();
    const dir = path.join(context.globalStorageUri.fsPath, 'typing');
    fs.mkdirSync(dir, {recursive:true});
    for (const file of fs.readdirSync(dir)) if (/^(basketball|chick|spark)-[a-f0-9]{6}-(subtle|lively)-\d+\.svg$/i.test(file)) fs.unlinkSync(path.join(dir,file));
    for (let i=0; i<FRAMES; i++) {
      const file = path.join(dir, `${options.style}-${options.color.slice(1)}-${options.intensity}-${i}.svg`);
      fs.writeFileSync(file,frameSvg(options.style,i,options.color,options.intensity));
      types.push(vscode.window.createTextEditorDecorationType({
        rangeBehavior:vscode.DecorationRangeBehavior.ClosedClosed,
        // SVG content keeps its intrinsic 28px height inside the inline attachment.
        // Compensate above the baseline; zero net width prevents moving following text.
        after:{contentIconPath:vscode.Uri.file(file),width:'32px',height:'1em',margin:`${Math.min(0,options.fontSize-29)}px -32px 0 0`}
      }));
    }
    signature = key;
  }
  function pulse(editor, position) {
    const options = settings(editor);
    if (disposed || !options.enabled || !vscode.window.state.focused || vscode.workspace.getConfiguration('workbench').get('reduceMotion') === 'on') return;
    if (Date.now()-last < 100) return;
    last = Date.now();prepare(options);clear();currentEditor=editor;
    let frame = 0;
    const draw = () => {
      if (disposed || currentEditor !== vscode.window.activeTextEditor) {clear();return;}
      if (activeType) editor.setDecorations(activeType, []);
      if (frame >= types.length) {clear();return;}
      activeType=types[frame++];editor.setDecorations(activeType,[new vscode.Range(position,position)]);
      timer=setTimeout(draw,45);
    };
    draw();
  }
  const subscriptions = [
    vscode.workspace.onDidChangeTextDocument(event=>{
      const editor=vscode.window.activeTextEditor, position=typingPosition(vscode,event,editor);
      if(position) pulse(editor,position);else if(event.document===currentEditor?.document) clear();
    }),
    vscode.window.onDidChangeActiveTextEditor(clear),
    vscode.window.onDidChangeWindowState(state=>{if(!state.focused)clear();}),
    vscode.workspace.onDidChangeConfiguration(e=>{if(e.affectsConfiguration('ikun.typing')||e.affectsConfiguration('workbench.reduceMotion')||e.affectsConfiguration('editor.fontSize'))release();}),
    vscode.commands.registerCommand('ikun.toggleTyping',async()=>{const c=vscode.workspace.getConfiguration('ikun.typing');await c.update('enabled',!c.get('enabled',true),true);}),
    vscode.commands.registerCommand('ikun.previewTyping',()=>{const e=vscode.window.activeTextEditor;if(e)pulse(e,e.selection.active);else vscode.window.showInformationMessage('先打开一个代码文件，再预览打字特效。');})
  ];
  context.subscriptions.push({dispose(){disposed=true;release();for(const s of subscriptions)s.dispose();}});
}
module.exports = {activateTyping, frameSvg, typingPosition, FRAMES};

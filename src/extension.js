const vscode = require('vscode');
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const {THEMES, FIELDS, colorValues, saveColors, resetColors} = require('./colors');
const KEYS = ['colorTheme', 'iconTheme', 'productIconTheme'];
function activate(context) {
  require('./typing-effects').activateTyping(vscode,context);
  const views = new Set();
  let busy = false;
  let pending = Promise.resolve();
  async function apply(values) {
    const config = vscode.workspace.getConfiguration('workbench');
    const previous = {...context.globalState.get('previous')};
    for (const key of Object.keys(values)) {
      if (!Object.prototype.hasOwnProperty.call(previous, key)) previous[key] = {value:config.inspect(key)?.globalValue};
    }
    await context.globalState.update('previous', previous);
    for (const [key, value] of Object.entries(values)) await config.update(key, value, true);
  }
  const icons = {iconTheme:'ikun-file-icons', productIconTheme:'ikun-product-icons'};
  const update = mode => apply({colorTheme:THEMES[mode][0], ...icons});
  const restore = async (keys = KEYS) => {
    const previous = {...context.globalState.get('previous')};
    const config = vscode.workspace.getConfiguration('workbench');
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(previous, key)) continue;
      const current = config.inspect(key)?.globalValue;
      if (typeof current === 'string' && /^(IKUN ·|ikun-)/.test(current)) await config.update(key, previous[key].value, true);
      delete previous[key];
    }
    await context.globalState.update('previous', Object.keys(previous).length ? previous : undefined);
  };
  function render(webview) {
    webview.options = {enableScripts:true, localResourceRoots:[vscode.Uri.joinPath(context.extensionUri,'media'),vscode.Uri.joinPath(context.extensionUri,'icons')]};
    const nonce = crypto.randomBytes(16).toString('hex');
    const media = name => webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri,'media',name)).toString();
    const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let html = fs.readFileSync(path.join(context.extensionPath,'media/club.html'),'utf8');
    const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
    const light = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Light;
    const icon = name => webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri,'icons',name+(light?'-light':'')+'.svg')).toString();
    const previous = context.globalState.get('previous') || {};
    const canRestore = key => Object.hasOwn(previous,key);
    const colors = colorValues(vscode, context.extensionPath, currentTheme);
    const typing = vscode.workspace.getConfiguration('ikun.typing');
    const values = {TYPING_ENABLED:typing.get('enabled',true)?'关闭打字特效':'开启打字特效', TYPING_STYLE:typing.get('style','basketball'), TYPING_COLOR:typing.get('color','#F5AA70'), TYPING_INTENSITY:typing.get('intensity','subtle'), CSP:webview.cspSource, NONCE:nonce, CSS:media('club.css'), JS:media('club.js'), CHICKEN:icon('chicken'), DAILY:String(currentTheme === THEMES.daily[0]), LIGHT:String(currentTheme === THEMES.light[0]), STAGE:String(currentTheme === THEMES.stage[0]), THEME:currentTheme, RESTORE_ICONS_DISABLED:canRestore('iconTheme')||canRestore('productIconTheme')?'':'disabled', RESTORE_FILE_DISABLED:canRestore('iconTheme')?'':'disabled', RESTORE_PRODUCT_DISABLED:canRestore('productIconTheme')?'':'disabled', COLOR_DISABLED:colors?'':'disabled', COLOR_HINT:colors?'仅应用到当前这套配色。':'先选择上方的一套 IKUN 配色。'};
    const rows = FIELDS.map(([id, label]) => {
      const value = colors?.[id] || '#808080';
      const hex = /^#[\da-f]{6}$/i.test(value) ? value : value.slice(0,7);
      return `<label class="color-row"><span>${label}</span><input type="color" data-color="${id}" value="${escape(hex)}" aria-label="${label}取色器"><input class="hex" data-hex="${id}" value="${escape(hex)}" aria-label="${label} HEX" maxlength="7" pattern="#[0-9A-Fa-f]{6}" spellcheck="false" required></label>`;
    }).join('');
    html = html.replace('{{COLOR_ROWS}}', rows).replace(/\{\{(\w+)\}\}/g, (_,key) => escape(values[key] || ''));
    webview.html = html;
  }
  function handle(message) {
    pending = pending.then(() => processMessage(message));
    return pending;
  }
  async function processMessage(message) {
    if (!message || typeof message.command !== 'string') return;
    busy = true;
    try {
      if (['daily','stage','light'].includes(message.command)) await update(message.command);
      else if (message.command === 'theme' && Object.hasOwn(THEMES,message.mode)) await apply({colorTheme:THEMES[message.mode][0]});
      else if (message.command === 'icons') await apply(icons);
      else if (message.command === 'restoreIcons') await restore(['iconTheme','productIconTheme']);
      else if (message.command === 'restoreFileIcons') await restore(['iconTheme']);
      else if (message.command === 'restoreProductIcons') await restore(['productIconTheme']);
      else if (message.command === 'saveColors') await saveColors(vscode,context,message.theme,message.colors);
      else if (message.command === 'resetColors') {
        if (!Object.values(THEMES).some(([name])=>name===message.theme)) throw Error('请先选择一套 IKUN 配色。');
        await resetColors(vscode,context,message.theme);
      }
      else if (message.command === 'restore') {await resetColors(vscode,context); await restore();}
      else if (message.command === 'toggleTyping') await vscode.commands.executeCommand('ikun.toggleTyping');
      else if (message.command === 'saveTyping') {
        if (!['basketball','chick','spark'].includes(message.style) || !['subtle','lively'].includes(message.intensity) || !/^#[\da-f]{6}$/i.test(message.color)) throw Error('打字特效配置无效。');
        const c=vscode.workspace.getConfiguration('ikun.typing');
        for (const key of ['style','color','intensity']) await c.update(key,message[key],true);
      }
      else if (message.command === 'advancedColors') await vscode.commands.executeCommand('workbench.action.openSettings','workbench.colorCustomizations');
      for (const view of views) render(view.webview);
    } catch (e) { vscode.window.showErrorMessage(`IKUN: ${e.message}`); for (const view of views) view.webview.postMessage({type:'result',ok:false,message:e.message}); }
    finally { busy = false; }
  }
  function attach(view) {
    views.add(view); render(view.webview);
    const listener = view.webview.onDidReceiveMessage(handle);
    view.onDidDispose(() => { views.delete(view); listener.dispose(); });
  }
  let panel;
  const commands = {
    openClub:() => { if (panel) return panel.reveal(); panel = vscode.window.createWebviewPanel('ikun.club','IKUN · 主题衣柜',vscode.ViewColumn.Active,{}); attach(panel); panel.onDidDispose(() => { panel=undefined; }); },
    applyDaily:() => handle({command:'daily'}), applyStage:() => handle({command:'stage'}),
    restore:() => handle({command:'restore'}),
    applyIcons:() => handle({command:'icons'}), restoreIcons:() => handle({command:'restoreIcons'}),
    restoreFileIcons:() => handle({command:'restoreFileIcons'}), restoreProductIcons:() => handle({command:'restoreProductIcons'})
  };
  for (const [key,fn] of Object.entries(commands)) context.subscriptions.push(vscode.commands.registerCommand('ikun.'+key,fn));
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('ikun.practice',{resolveWebviewView:attach}));
  const refresh = () => {if (!busy) for (const view of views) render(view.webview);};
  context.subscriptions.push(vscode.window.onDidChangeActiveColorTheme(refresh));
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {if(e.affectsConfiguration('ikun.typing') || e.affectsConfiguration('workbench') || e.affectsConfiguration('editor.tokenColorCustomizations') || e.affectsConfiguration('editor.semanticTokenColorCustomizations')) refresh();}));
}
module.exports = { activate };

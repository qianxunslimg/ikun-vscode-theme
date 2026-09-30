const vscode = require('vscode');
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const KEYS = ['colorTheme', 'iconTheme', 'productIconTheme'];
function activate(context) {
  const views = new Set();
  let busy = false;
  const update = async (mode) => {
    const config = vscode.workspace.getConfiguration('workbench');
    if (!context.globalState.get('previous')) {
      const previous = Object.fromEntries(KEYS.map(k => [k, { value: config.inspect(k)?.globalValue }]));
      await context.globalState.update('previous', previous);
    }
    await config.update('colorTheme', mode === 'stage' ? 'IKUN · 舞台夜' : mode === 'light' ? 'IKUN · 球场白' : 'IKUN · 背带裤黑', true);
    await config.update('iconTheme', 'ikun-file-icons', true);
    await config.update('productIconTheme', 'ikun-product-icons', true);
    await vscode.workspace.getConfiguration('ikun').update('mode', mode === 'stage' ? 'stage' : 'daily', true);
  };
  const restore = async () => {
    const previous = context.globalState.get('previous');
    if (!previous) return;
    const config = vscode.workspace.getConfiguration('workbench');
    for (const key of KEYS) {
      // Preserve settings the user has independently changed after applying the bundle.
      const current = config.inspect(key)?.globalValue;
      if (typeof current === 'string' && /^(IKUN ·|ikun-)/.test(current)) await config.update(key, previous[key]?.value, true);
    }
    await context.globalState.update('previous', undefined);
  };
  async function importMedia(kind) {
    const chosen = await vscode.window.showOpenDialog({ canSelectMany:false, filters: kind === 'audio' ? { Audio:['mp3','wav','ogg'] } : { Images:['png','jpg','jpeg','webp','gif'] } });
    if (!chosen) return;
    const bytes = await vscode.workspace.fs.readFile(chosen[0]);
    if (bytes.length > 20 * 1024 * 1024) throw new Error('请选择小于 20 MB 的素材。');
    await vscode.workspace.fs.createDirectory(context.globalStorageUri);
    const target = vscode.Uri.joinPath(context.globalStorageUri, kind + path.extname(chosen[0].path).toLowerCase());
    await vscode.workspace.fs.writeFile(target, bytes);
    await context.globalState.update(kind, target.toString());
    for (const view of views) render(view.webview);
  }
  function render(webview) {
    webview.options = { enableScripts:true, localResourceRoots:[vscode.Uri.joinPath(context.extensionUri,'media'),context.globalStorageUri] };
    const nonce = crypto.randomBytes(16).toString('hex');
    const media = name => webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri,'media',name)).toString();
    const custom = kind => context.globalState.get(kind) ? webview.asWebviewUri(vscode.Uri.parse(context.globalState.get(kind))).toString() : '';
    const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const config = vscode.workspace.getConfiguration('ikun');
    let html = fs.readFileSync(path.join(context.extensionPath,'media/club.html'),'utf8');
    const values = { CSP:webview.cspSource, NONCE:nonce, CSS:media('club.css'), JS:media('club.js'), IMAGE:custom('image') || media('sticker.png'), AUDIO:custom('audio'), MODE:config.get('mode','daily'), MOTION:String(config.get('motion',true)), VOLUME:String(config.get('volume',0.25)) };
    html = html.replace(/\{\{(\w+)\}\}/g, (_,key) => escape(values[key] || ''));
    webview.html = html;
  }
  async function handle(message) {
    if (busy || !message || typeof message.command !== 'string') return;
    busy = true;
    try {
      if (['daily','stage','light'].includes(message.command)) await update(message.command);
      else if (message.command === 'restore') await restore();
      else if (message.command === 'audio' || message.command === 'image') await importMedia(message.command);
      else if (message.command === 'resetMedia') {
        await context.globalState.update('image',undefined);
        await context.globalState.update('audio',undefined);
        for (const view of views) render(view.webview);
      }
    } catch (e) { vscode.window.showErrorMessage(`IKUN: ${e.message}`); }
    finally { busy = false; }
  }
  function attach(view) {
    views.add(view); render(view.webview);
    const listener = view.webview.onDidReceiveMessage(handle);
    view.onDidDispose(() => { views.delete(view); listener.dispose(); });
  }
  let panel;
  const commands = {
    openClub:() => { if (panel) return panel.reveal(); panel = vscode.window.createWebviewPanel('ikun.club','IKUN · 练习室',vscode.ViewColumn.Active,{}); attach(panel); panel.onDidDispose(() => { panel=undefined; }); },
    applyDaily:() => handle({command:'daily'}), applyStage:() => handle({command:'stage'}),
    restore:() => handle({command:'restore'}), importAudio:() => handle({command:'audio'}), importImage:() => handle({command:'image'})
  };
  for (const [key,fn] of Object.entries(commands)) context.subscriptions.push(vscode.commands.registerCommand('ikun.'+key,fn));
  context.subscriptions.push(vscode.window.registerWebviewViewProvider('ikun.practice',{resolveWebviewView:attach}));
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => { if(e.affectsConfiguration('ikun')) for(const view of views) render(view.webview); }));
}
module.exports = { activate };

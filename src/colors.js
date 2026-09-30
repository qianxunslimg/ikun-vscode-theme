const fs = require('node:fs');
const path = require('node:path');
const THEMES = { daily: ['IKUN · 背带裤黑', 'suspenders'], light: ['IKUN · 球场白', 'court'], stage: ['IKUN · 舞台夜', 'stage'] };
const FIELDS = [
  ['background', '编辑区背景', 'workbench', ['editor.background', 'tab.activeBackground']],
  ['foreground', '编辑区文字', 'workbench', ['editor.foreground']],
  ['sidebar', '侧栏背景', 'workbench', ['sideBar.background']],
  ['activity', '活动栏背景', 'workbench', ['activityBar.background']],
  ['status', '状态栏背景', 'workbench', ['statusBar.background']],
  ['accent', '强调色', 'workbench', ['focusBorder', 'activityBar.foreground', 'activityBar.activeBorder', 'tab.activeBorderTop', 'textLink.foreground', 'editorCursor.foreground']],
  ['selection', '选中文字背景', 'workbench', ['editor.selectionBackground']],
  ['comments', '注释', 'editor', ['comments']],
  ['keywords', '关键字', 'editor', ['keywords']],
  ['strings', '字符串', 'editor', ['strings']],
  ['numbers', '数字', 'editor', ['numbers']],
  ['functions', '函数', 'editor', ['functions']]
];
const setting = section => section === 'workbench' ? 'colorCustomizations' : 'tokenColorCustomizations';
const SEMANTIC = {comments:'comment',keywords:'keyword',strings:'string',numbers:'number',functions:'function'};
const GROUPS = [
  {id:'workbench',section:'workbench',key:'colorCustomizations'},
  {id:'editor',section:'editor',key:'tokenColorCustomizations'},
  {id:'semantic',section:'editor',key:'semanticTokenColorCustomizations'}
];
const clone = value => JSON.parse(JSON.stringify(value || {}));
const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
function themeData(extensionPath, theme) {
  const entry = Object.values(THEMES).find(([name]) => name === theme);
  return entry && JSON.parse(fs.readFileSync(path.join(extensionPath, 'themes', entry[1] + '-color-theme.json'), 'utf8'));
}
function colorValues(vscode, extensionPath, theme) {
  const data = themeData(extensionPath, theme);
  if (!data) return null;
  const scopes = {comments:'comment', keywords:'keyword', strings:'string', numbers:'constant.numeric', functions:'entity.name.function'};
  return Object.fromEntries(FIELDS.map(([id, , section, keys]) => {
    const custom = vscode.workspace.getConfiguration(section).get(setting(section), {});
    let fallback = data.colors[keys[0]];
    if (section === 'editor') {
      const rule = data.tokenColors.find(rule => (Array.isArray(rule.scope) ? rule.scope : [rule.scope]).some(scope => scope === scopes[id]));
      fallback = rule?.settings.foreground || data.colors['editor.foreground'];
    }
    let value = custom[`[${theme}]`]?.[keys[0]] ?? custom[keys[0]] ?? fallback;
    if (section === 'editor') {
      const semantic = vscode.workspace.getConfiguration('editor').get('semanticTokenColorCustomizations', {});
      value = semantic[`[${theme}]`]?.rules?.[SEMANTIC[id]] ?? semantic.rules?.[SEMANTIC[id]] ?? value;
    }
    return [id, typeof value === 'string' ? value : value?.foreground || fallback];
  }));
}
async function saveColors(vscode, context, theme, values) {
  if (!Object.values(THEMES).some(([name]) => name === theme)) throw Error('请先选择一套 IKUN 配色。');
  if (!values || typeof values !== 'object' || Array.isArray(values)) throw Error('颜色数据无效。');
  for (const [id, color] of Object.entries(values)) {
    if (!FIELDS.some(([key]) => key === id) || typeof color !== 'string' || !/^#[\da-f]{6}$/i.test(color)) throw Error('请输入六位 HEX 颜色，例如 #F5AA70。');
  }
  const scope = `[${theme}]`;
  const history = clone(context.globalState.get('customColors'));
  history[theme] ||= {};
  for (const group of GROUPS) {
    const {section, key} = group;
    const config = vscode.workspace.getConfiguration(section);
    const custom = clone(config.inspect(key)?.globalValue);
    const scoped = group.id === 'semantic' ? {...custom[scope]?.rules} : {...custom[scope]};
    let changed = false;
    for (const [id, , target, fieldKeys] of FIELDS) {
      if (!own(values, id) || (group.id === 'semantic' ? !SEMANTIC[id] : target !== section)) continue;
      const keys = group.id === 'semantic' ? [SEMANTIC[id]] : fieldKeys;
      for (const colorKey of keys) {
        const recordKey = group.id + ':' + colorKey;
        history[theme][recordKey] ||= {previous:scoped[colorKey]};
        const applied = scoped[colorKey] && typeof scoped[colorKey] === 'object' ? {...scoped[colorKey],foreground:values[id]} : values[id];
        history[theme][recordKey].applied = applied;
        scoped[colorKey] = applied; changed = true;
      }
    }
    if (changed) {
      // Persist before the setting write so a failed second write can still be restored.
      await context.globalState.update('customColors', history);
      custom[scope] = group.id === 'semantic' ? {...custom[scope], rules:scoped} : scoped;
      await config.update(key, custom, true);
    }
  }
}
async function resetColors(vscode, context, theme) {
  const history = clone(context.globalState.get('customColors'));
  for (const name of theme ? [theme] : Object.keys(history)) {
    const records = history[name];
    if (!records) continue;
    const scope = `[${name}]`;
    for (const group of GROUPS) {
      const {section, key} = group;
      const config = vscode.workspace.getConfiguration(section);
      const custom = clone(config.inspect(key)?.globalValue);
      const scoped = group.id === 'semantic' ? custom[scope]?.rules : custom[scope];
      let changed = false;
      for (const [recordKey, record] of Object.entries(records)) {
        if (!recordKey.startsWith(group.id + ':')) continue;
        const colorKey = recordKey.slice(group.id.length + 1);
        if (JSON.stringify(scoped?.[colorKey]) !== JSON.stringify(record.applied)) continue;
        if (record.previous === undefined) delete scoped[colorKey];
        else scoped[colorKey] = record.previous;
        changed = true;
      }
      if (changed) {
        if (group.id === 'semantic' && Object.keys(scoped).length === 0) delete custom[scope].rules;
        if (Object.keys(custom[scope]).length === 0) delete custom[scope];
        await config.update(key, Object.keys(custom).length ? custom : undefined, true);
      }
    }
    delete history[name];
    await context.globalState.update('customColors', Object.keys(history).length ? history : undefined);
  }
}
module.exports = {THEMES, FIELDS, colorValues, saveColors, resetColors};

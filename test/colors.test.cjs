const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {saveColors,resetColors,colorValues,THEMES}=require('../src/colors');
const dark=THEMES.daily[0],light=THEMES.light[0];
function fixture(){
 const values={workbench:{colorCustomizations:{'statusBar.foreground':'#abcdef',[`[${dark}]`]:{'editor.background':'#123456','sideBar.foreground':'#eeeeee'}}},editor:{tokenColorCustomizations:{textMateRules:[{scope:'comment',settings:{fontStyle:'italic'}}]}}};
 const data=new Map();const context={globalState:{get:k=>data.get(k),update:async(k,v)=>data.set(k,structuredClone(v))}};
 const vscode={workspace:{getConfiguration:section=>({get:(key,fallback)=>values[section]?.[key]??fallback,inspect:key=>({globalValue:values[section]?.[key]}),update:async(key,value)=>{values[section][key]=structuredClone(value);}})}};
 return {values,context,vscode};
}
test('colors remain theme-scoped, preserve unrelated settings, and reset to previous custom colors',async()=>{
 const {values,context,vscode}=fixture();
 await saveColors(vscode,context,dark,{background:'#202030',keywords:'#aabbcc'});
 await saveColors(vscode,context,dark,{background:'#303040'});
 await saveColors(vscode,context,light,{background:'#fefefe'});
 assert.equal(values.workbench.colorCustomizations[`[${dark}]`]['editor.background'],'#303040');
 assert.equal(values.workbench.colorCustomizations['editor.background'],undefined);
 assert.equal(values.editor.tokenColorCustomizations[`[${dark}]`].keywords,'#aabbcc');
 assert.equal(values.editor.semanticTokenColorCustomizations[`[${dark}]`].rules.keyword,'#aabbcc');
 assert.equal(colorValues(vscode,path.resolve(__dirname,'..'),dark).background,'#303040');
 await resetColors(vscode,context,dark);
 assert.equal(values.workbench.colorCustomizations[`[${dark}]`]['editor.background'],'#123456');
 assert.equal(values.workbench.colorCustomizations[`[${dark}]`]['sideBar.foreground'],'#eeeeee');
 assert.equal(values.workbench.colorCustomizations[`[${light}]`]['editor.background'],'#fefefe');
 assert.equal(values.editor.tokenColorCustomizations.textMateRules[0].settings.fontStyle,'italic');
 assert.equal(values.editor.tokenColorCustomizations[`[${dark}]`],undefined);
 await resetColors(vscode,context);
 assert.equal(values.workbench.colorCustomizations[`[${light}]`],undefined);
 assert.equal(context.globalState.get('customColors'),undefined);
});
test('reset preserves later manual edits; invalid input produces no writes',async()=>{
 const {values,context,vscode}=fixture();
 const before=structuredClone(values);
 await assert.rejects(saveColors(vscode,context,dark,{background:'#112233',strings:'red'}));
 await assert.rejects(saveColors(vscode,context,'Other',{background:'#112233'}));
 await assert.rejects(saveColors(vscode,context,dark,{unknown:'#112233'}));
 assert.deepEqual(values,before);
 await saveColors(vscode,context,dark,{background:'#111111'});
 values.workbench.colorCustomizations[`[${dark}]`]['editor.background']='#999999';
 await resetColors(vscode,context,dark);
 assert.equal(values.workbench.colorCustomizations[`[${dark}]`]['editor.background'],'#999999');
 assert.equal(values.workbench.colorCustomizations[`[${dark}]`]['tab.activeBackground'],undefined);
});
test('changing syntax foreground retains existing font styles and restores them',async()=>{
 const {values,context,vscode}=fixture();
 values.editor.semanticTokenColorCustomizations={[`[${dark}]`]:{enabled:true,rules:{keyword:{foreground:'#123456',bold:true},variable:'#fefefe'}}};
 await saveColors(vscode,context,dark,{keywords:'#aabbcc'});
 assert.deepEqual(values.editor.semanticTokenColorCustomizations[`[${dark}]`].rules.keyword,{foreground:'#aabbcc',bold:true});
 await resetColors(vscode,context,dark);
 assert.deepEqual(values.editor.semanticTokenColorCustomizations[`[${dark}]`],{enabled:true,rules:{keyword:{foreground:'#123456',bold:true},variable:'#fefefe'}});
});

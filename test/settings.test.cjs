const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');
test('bundle preserves original global settings and does not overwrite later user choices',async()=>{
 const values={colorTheme:'Original',iconTheme:'old-icons'},state=new Map(),commands={};
 const config={get:()=>undefined,inspect:k=>({globalValue:values[k]}),update:async(k,v)=>{values[k]=v;}};
 const api={workspace:{onDidChangeTextDocument:()=>({dispose(){}}),getConfiguration:()=>config,onDidChangeConfiguration:()=>({dispose(){}})},window:{onDidChangeActiveTextEditor:()=>({dispose(){}}),onDidChangeWindowState:()=>({dispose(){}}),onDidChangeActiveColorTheme:()=>({dispose(){}}),registerWebviewViewProvider:()=>({dispose(){}}),showErrorMessage:m=>{throw Error(m)}},commands:{registerCommand:(k,fn)=>{commands[k]=fn;return{dispose(){}}}}};
 const original=Module._load;Module._load=function(id,...args){return id==='vscode'?api:original.call(this,id,...args)};
 try{require('../src/extension').activate({subscriptions:[],globalState:{get:k=>state.get(k),update:async(k,v)=>{state.set(k,v)}}});}finally{Module._load=original}
 await commands['ikun.applyDaily']();assert.equal(values.colorTheme,'IKUN · 背带裤黑');
 await commands['ikun.applyStage']();assert.equal(values.colorTheme,'IKUN · 舞台夜');
 await commands['ikun.restoreFileIcons']();
 assert.equal(values.iconTheme,'old-icons');assert.equal(values.colorTheme,'IKUN · 舞台夜');assert.equal(values.productIconTheme,'ikun-product-icons');
 await commands['ikun.restoreProductIcons']();assert.equal(values.productIconTheme,undefined);assert.ok(state.get('previous').colorTheme);
 values.iconTheme='new-icons';await commands['ikun.applyIcons']();await commands['ikun.restoreIcons']();assert.equal(values.iconTheme,'new-icons');assert.equal(values.colorTheme,'IKUN · 舞台夜');
 await Promise.all([commands['ikun.applyDaily'](),commands['ikun.restoreIcons']()]);assert.equal(values.iconTheme,'new-icons');assert.equal(values.colorTheme,'IKUN · 背带裤黑');
 await commands['ikun.applyDaily']();
 values.iconTheme='user-selected';await commands['ikun.restore']();
 assert.equal(values.colorTheme,'Original');assert.equal(values.iconTheme,'user-selected');assert.equal(values.productIconTheme,undefined);assert.equal(state.get('previous'),undefined);
});

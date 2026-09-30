const {test}=require('node:test');const assert=require('node:assert/strict');const Module=require('node:module');
test('bundle preserves original global settings and does not overwrite later user choices',async()=>{
 const values={colorTheme:'Original',iconTheme:'old-icons'},state=new Map(),commands={};
 const config={get:()=>undefined,inspect:k=>({globalValue:values[k]}),update:async(k,v)=>{values[k]=v;}};
 const api={workspace:{getConfiguration:()=>config,onDidChangeConfiguration:()=>({dispose(){}})},window:{onDidChangeActiveColorTheme:()=>({dispose(){}}),registerWebviewViewProvider:()=>({dispose(){}}),showErrorMessage:m=>{throw Error(m)}},commands:{registerCommand:(k,fn)=>{commands[k]=fn;return{dispose(){}}}}};
 const original=Module._load;Module._load=function(id,...args){return id==='vscode'?api:original.call(this,id,...args)};
 try{require('../src/extension').activate({subscriptions:[],globalState:{get:k=>state.get(k),update:async(k,v)=>{state.set(k,v)}}});}finally{Module._load=original}
 await commands['ikun.applyDaily']();assert.equal(values.colorTheme,'IKUN · 背带裤黑');
 await commands['ikun.applyStage']();assert.equal(values.colorTheme,'IKUN · 舞台夜');
 values.iconTheme='user-selected';await commands['ikun.restore']();
 assert.equal(values.colorTheme,'Original');assert.equal(values.iconTheme,'user-selected');assert.equal(values.productIconTheme,undefined);assert.equal(state.get('previous'),undefined);
});

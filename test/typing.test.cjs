const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const os=require('node:os');const path=require('node:path');
const {typingPosition,activateTyping,frameSvg,FRAMES}=require('../src/typing-effects');
class Position{constructor(line,character){Object.assign(this,{line,character});}isEqual(other){return this.line===other.line&&this.character===other.character;}}
function fixture(){const doc={};const pos=new Position(2,4);return{editor:{document:doc,selection:{active:pos},selections:[{}]},event:{document:doc,contentChanges:[{text:'字',rangeLength:0,range:{start:pos,end:pos}}]}};}
test('typing filter supports committed Chinese text and rejects bulk edits, undo and other documents',()=>{
 const {editor,event}=fixture();assert.deepEqual(typingPosition({Position},event,editor),new Position(2,5));
 for(const bad of [{...event,reason:1},{...event,document:{}},{...event,contentChanges:[]},{...event,contentChanges:[...event.contentChanges,...event.contentChanges]}])assert.equal(typingPosition({Position},bad,editor),undefined);
 for(const text of ['', '\n','a long pasted block'])assert.equal(typingPosition({Position},{...event,contentChanges:[{...event.contentChanges[0],text}]},editor),undefined);
 editor.selection.active=new Position(9,0);assert.equal(typingPosition({Position},event,editor),undefined);
});
test('animation cleans up on stop, disable and dispose without editing document',async()=>{
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'ikun-effects-'));const listeners={},commands={},subscriptions=[],draws=[];let disposed=0;
 const {editor,event}=fixture();editor.setDecorations=(type,ranges)=>draws.push({type,ranges});
 const config={enabled:true,style:'spark',color:'#aabbcc',intensity:'subtle'};
 const hook=key=>fn=>{listeners[key]=fn;return{dispose(){}}};
 const api={Position,Range:class{constructor(start,end){Object.assign(this,{start,end});}},Uri:{file:x=>x},DecorationRangeBehavior:{ClosedClosed:1},workspace:{getConfiguration:section=>({get:(key,def)=>section==='ikun.typing'?(config[key]??def):def}),onDidChangeTextDocument:hook('change'),onDidChangeConfiguration:hook('config')},window:{activeTextEditor:editor,state:{focused:true},createTextEditorDecorationType:options=>({options,dispose(){disposed++;}}),onDidChangeActiveTextEditor:hook('editor'),onDidChangeWindowState:hook('window')},commands:{registerCommand:(key,fn)=>{commands[key]=fn;return{dispose(){}}}}};
 try{
 activateTyping(api,{subscriptions,globalStorageUri:{fsPath:folder}});listeners.change(event);assert.equal(draws[0].ranges.length,1);
 assert.equal(fs.readdirSync(path.join(folder,'typing')).length,FRAMES);
 await new Promise(r=>setTimeout(r,650));assert.equal(draws.at(-1).ranges.length,0);
 config.enabled=false;listeners.config({affectsConfiguration:()=>true});assert.equal(disposed,FRAMES);const count=draws.length;listeners.change(event);assert.equal(draws.length,count);
 subscriptions[0].dispose();
 }finally{fs.rmSync(folder,{recursive:true,force:true});}
});
test('frames fade out and use the requested accent',()=>{for(const style of ['basketball','chick','spark']){assert.match(frameSvg(style,0,'#123456'),/#123456/);assert.match(frameSvg(style,FRAMES-1,'#123456'),/opacity="0.000"/);}});

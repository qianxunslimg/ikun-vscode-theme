import fs from 'node:fs';
import assert from 'node:assert/strict';
const pkg=JSON.parse(fs.readFileSync('package.json'));
for(const group of ['themes','iconThemes','productIconThemes'])for(const contribution of pkg.contributes[group]){
 const data=JSON.parse(fs.readFileSync(contribution.path));
 if(data.colors)for(const color of Object.values(data.colors))assert.match(color,/^#[\da-f]{6}([\da-f]{2})?$/i);
 const base=contribution.path.slice(0,contribution.path.lastIndexOf('/')+1);
 for(const def of Object.values(data.iconDefinitions||{}))if(def.iconPath)assert.ok(fs.existsSync(base+def.iconPath));
 for(const font of data.fonts||[])for(const src of font.src)assert.ok(fs.existsSync(base+src.path));
}
for(const name of [pkg.main,pkg.icon,'media/club.html','media/club.css','media/club.js'])assert.ok(fs.existsSync(name),name);
const js=fs.readFileSync('media/club.js','utf8');assert.ok(!/fetch\(|https?:\/\//.test(js));
console.log('PASS: manifests, colors, icon resources, runtime files, offline frontend');

const icons=JSON.parse(fs.readFileSync('icons/ikun-icon-theme.json'));
for(const variant of [icons,icons.light]){
 for(const key of ['file','folder','folderExpanded','rootFolder','rootFolderExpanded'])assert.ok(icons.iconDefinitions[variant[key]],key);
 for(const key of ['languageIds','fileExtensions','fileNames','folderNames','folderNamesExpanded'])for(const id of Object.values(variant[key]||{}))assert.ok(icons.iconDefinitions[id],id);
}
assert.equal(icons.fileExtensions.sh,'shell');assert.equal(icons.light.fileExtensions.sh,'shell-light');
assert.equal(icons.fileExtensions['test.ts'],'test');
assert.ok(!pkg.contributes.commands.some(c=>/import(Audio|Image)/.test(c.command)));
console.log('PASS: dark/light icon mappings and removed import commands');

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
for(const name of [pkg.main,pkg.icon,'media/sticker.png','media/club.html','media/club.css','media/club.js'])assert.ok(fs.existsSync(name),name);
const js=fs.readFileSync('media/club.js','utf8');assert.ok(!/fetch\(|https?:\/\//.test(js));
console.log('PASS: manifests, colors, icon resources, runtime files, offline frontend');

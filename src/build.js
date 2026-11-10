// Inlines the map data into the page. Writes index.html (full document, for GitHub Pages) and artifact.html (body only).
const fs=require("fs"),p=require("path");
const t=fs.readFileSync(p.join(__dirname,"template.html"),"utf8");
const topo=fs.readFileSync(p.join(__dirname,"sgg.topo.json"),"utf8").trim();
const body=t.replace("/*TOPO*/null",topo);

const doc=`<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box}body{margin:0}[hidden]{display:none!important}</style>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
fs.writeFileSync(p.join(__dirname,"..","index.html"),doc);

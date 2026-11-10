// Inlines the map data into the page and writes index.html (the full document GitHub Pages serves).
const fs = require("fs"), p = require("path");
const t = fs.readFileSync(p.join(__dirname, "template.html"), "utf8");
const topo = fs.readFileSync(p.join(__dirname, "sgg.topo.json"), "utf8").trim();

// The template starts with <title>; it moves into <head> so link previews can read it.
const title = t.match(/<title>(.*?)<\/title>/)[1];
const body = t.replace(/<title>.*?<\/title>\n?/, "").replace("/*TOPO*/null", topo);

// Link preview (Open Graph / Twitter). Crawlers need absolute URLs.
const SITE = "https://northster.github.io/EodiGuessr/";
const DESC = "지역 이름을 보고 지도에서 위치를 찍는 하루 5문제 퀴즈. 정답까지의 거리로 0~100점.";
const meta = [
  `<title>${title}</title>`,
  `<meta name="description" content="${DESC}">`,
  `<link rel="icon" href="favicon.svg" type="image/svg+xml">`,
  `<meta property="og:type" content="website">`,
  `<meta property="og:site_name" content="${title}">`,
  `<meta property="og:title" content="${title} · 시군구 위치 맞히기">`,
  `<meta property="og:description" content="${DESC}">`,
  `<meta property="og:url" content="${SITE}">`,
  `<meta property="og:image" content="${SITE}og.png">`,
  `<meta property="og:image:width" content="1200">`,
  `<meta property="og:image:height" content="630">`,
  `<meta property="og:locale" content="ko_KR">`,
  `<meta name="twitter:card" content="summary_large_image">`,
  `<meta name="theme-color" content="#16232b">`,
].join("\n");

const doc = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${meta}
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box}body{margin:0}[hidden]{display:none!important}</style>
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(p.join(__dirname, "..", "index.html"), doc);

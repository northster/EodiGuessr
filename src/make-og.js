// Makes the link-preview images and the score pages.
//   og.png            preview for the game itself
//   r/<0-100>/        one tiny page per score: its preview shows that score, and opening it goes to the game
// Needs playwright, d3, topojson-client and @fontsource/{black-han-sans,ibm-plex-sans-kr,ibm-plex-mono}
// on NODE_PATH. Run: node src/make-og.js
const fs = require("fs"), p = require("path"), { chromium } = require("playwright");
const ROOT = p.join(__dirname, "..");
const SITE = "https://northster.github.io/EodiGuessr/";
const DESC = "지역 이름을 보고 지도에서 위치를 찍는 하루 5문제 퀴즈. 정답까지의 거리로 0~100점.";

// package folders found on NODE_PATH (some packages hide their files from require.resolve)
const pkg = m => { for (const d of (process.env.NODE_PATH || "").split(p.delimiter)) if (d && fs.existsSync(p.join(d, m))) return p.join(d, m); throw new Error("not found: " + m); };
const mod = f => "file://" + p.join(pkg(f.split("/")[0]), f.split("/").slice(1).join("/"));
const font = m => "file://" + pkg(m);
const topo = fs.readFileSync(p.join(__dirname, "sgg.topo.json"), "utf8").trim();

// 80+ green, below that yellow → orange → red as the score drops
function scoreColor(s) {
  if (s >= 80) return "#1d8656";
  const stops = [[0xd7, 0x38, 0x1d], [0xe2, 0x71, 0x1d], [0xd9, 0xa9, 0x0d]];
  const t = s / 79 * 2, i = Math.min(1, Math.floor(t)), f = t - i;
  return "rgb(" + stops[i].map((c, k) => Math.round(c + (stops[i + 1][k] - c) * f)).join(",") + ")";
}

function page(left) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${font("@fontsource/black-han-sans")}/index.css">
<link rel="stylesheet" href="${font("@fontsource/ibm-plex-sans-kr")}/500.css">
<link rel="stylesheet" href="${font("@fontsource/ibm-plex-sans-kr")}/700.css">
<link rel="stylesheet" href="${font("@fontsource/ibm-plex-mono")}/600.css">
<style>
body{margin:0;width:1200px;height:630px;background:#dbe5eb;font-family:"IBM Plex Sans KR";overflow:hidden;position:relative}
svg{position:absolute;right:40px;top:0;width:460px;height:630px}
.txt{position:absolute;left:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:26px;width:620px}
h1{margin:0;font-family:"Black Han Sans";font-weight:400;font-size:92px;line-height:1;color:#16232b;letter-spacing:.01em}
h1.sm{font-size:56px}
h1 b{color:#d7381d;font-weight:400}
p{margin:0;font-size:38px;font-weight:700;color:#16232b;line-height:1.35}
.sub{font-size:28px;font-weight:500;color:#5a6a74}
.chips{display:flex;gap:10px}
.chip{width:44px;height:44px;border-radius:9px}
.score{display:flex;align-items:baseline;gap:18px;font-family:"IBM Plex Mono";font-weight:600}
.score .n{font-size:200px;line-height:.85}
.score .of{font-size:52px;color:#5a6a74}
</style></head><body>
<svg viewBox="0 0 460 630"></svg>
<div class="txt">${left}</div>
<script src="${mod("d3/dist/d3.min.js")}"></script><script src="${mod("topojson-client/dist/topojson-client.min.js")}"></script>
<script>(t=>{
const fs=topojson.feature(t,t.objects.sgg).features;
const proj=d3.geoMercator().fitExtent([[10,30],[450,600]],{type:"FeatureCollection",features:fs}),path=d3.geoPath(proj);
const svg=d3.select("svg");
svg.append("g").selectAll("path").data(fs).join("path").attr("d",path).attr("fill","#fbfcfc").attr("stroke","#c9d4db").attr("stroke-width",.6);
const ex=[["안동시",[127.6,36.1],"#d9a90d"],["순천시",[126.9,35.2],"#e2711d"],["춘천시",[127.75,37.85],"#1d8656"]];
for(const [n,g,c] of ex){const f=fs.find(f=>f.properties.name===n);if(!f)continue;
 svg.append("path").attr("d",path(f)).attr("fill",d3.color(c).copy({opacity:.28})).attr("stroke",c).attr("stroke-width",2.5);
 const a=proj(g),b=path.centroid(f);svg.append("line").attr("x1",a[0]).attr("y1",a[1]).attr("x2",b[0]).attr("y2",b[1]).attr("stroke",c).attr("stroke-width",2.5).attr("stroke-opacity",.7);
 svg.append("circle").attr("cx",a[0]).attr("cy",a[1]).attr("r",9).attr("fill",c).attr("stroke","#fff").attr("stroke-width",3);}
document.body.dataset.ready=1;})(${topo});</script></body></html>`;
}

const intro = `<h1>Eodi<b>Guessr</b></h1>
<p>지도에서 시군구 위치 맞히기</p>
<div class="sub">하루 5문제 · 거리 오차로 0~100점</div>
<div class="chips">${["#1d8656", "#d9a90d", "#e2711d", "#d7381d", "#1d8656"].map(c => `<div class="chip" style="background:${c}"></div>`).join("")}</div>`;
const scored = s => `<h1 class="sm">Eodi<b>Guessr</b></h1>
<div class="score"><span class="n" style="color:${scoreColor(s)}">${s}</span><span class="of">/ 100</span></div>
<p>나도 도전해 보기 →</p>`;

const scorePage = s => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EodiGuessr ${s}점</title>
<meta name="description" content="${DESC}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="EodiGuessr">
<meta property="og:title" content="EodiGuessr ${s}점">
<meta property="og:description" content="${DESC} 나도 도전해 보기">
<meta property="og:url" content="${SITE}r/${s}/">
<meta property="og:image" content="${SITE}r/${s}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url=../../">
<script>location.replace("../../")</script>
</head>
<body><a href="../../">EodiGuessr로 이동</a></body>
</html>
`;

(async () => {
  const tmp = p.join(require("os").tmpdir(), "eodiguessr-og.html");
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
  async function shot(left, out, type) {
    fs.writeFileSync(tmp, page(left));
    await pg.goto("file://" + tmp);
    await pg.waitForSelector("body[data-ready]", { state: "attached" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot(type === "jpeg" ? { path: out, type, quality: 82 } : { path: out });
  }
  await shot(intro, p.join(ROOT, "og.png"));
  for (let s = 0; s <= 100; s++) {
    const dir = p.join(ROOT, "r", String(s));
    fs.mkdirSync(dir, { recursive: true });
    await shot(scored(s), p.join(dir, "og.jpg"), "jpeg");
    fs.writeFileSync(p.join(dir, "index.html"), scorePage(s));
  }
  await b.close();
})();

const fs=require("fs");
const [,,inp,out]=process.argv;
const g=JSON.parse(fs.readFileSync(inp));
const SHORT={"서울특별시":"서울","부산광역시":"부산","대구광역시":"대구","인천광역시":"인천","대전광역시":"대전","울산광역시":"울산","세종특별자치시":"세종","경기도":"경기","충청북도":"충북","충청남도":"충남","경상북도":"경북","경상남도":"경남","제주특별자치도":"제주","강원특별자치도":"강원","전북특별자치도":"전북","전남광주통합특별시":"전남광주"};
const isMetro=s=>/특별시$|광역시$/.test(s)&&s!=="전남광주통합특별시";
for(const f of g.features){const p=f.properties;let n=p.sggnm;
  const m=!isMetro(p.sidonm)&&n.match(/^(.+?시).+구$/); if(m) n=m[1];
  if(!SHORT[p.sidonm]) throw new Error(p.sidonm);
  f.properties={key:p.sido+"_"+n,sido:SHORT[p.sidonm],name:n};}
fs.writeFileSync(out,JSON.stringify(g));

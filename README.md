# 어디게서

지역 이름이 나오면 대한민국 지도에서 그 위치를 찍는 웹게임입니다. 10문제를 풀면 정답 지역 경계까지의 거리로 0~100점을 매깁니다.

- 한 문제 점수: 지역 안을 찍으면 100점, 밖이면 `100 × e^(-거리/45km)`
- 모드: 오늘의 문제(날짜별로 모두 같은 10곳), 전국 무작위, 어려움(시군구 경계선 없음), 수도권
- 서버 없이 `index.html` 하나로 동작합니다.

## 실행

`index.html`을 브라우저로 열면 됩니다.

## 지도 데이터 다시 만들기

`src/template.html`이 화면, `src/sgg.topo.json`이 지도입니다. 수정한 뒤 `node src/build.js`를 실행하면 `index.html`이 새로 만들어집니다.

지도는 [vuski/admdongkor](https://github.com/vuski/admdongkor)의 행정동 경계(ver20261001)를 시군구로 합친 것입니다.

```sh
node src/prep.js HangJeongDong_ver20261001.geojson tagged.json
npx mapshaper tagged.json -dissolve key copy-fields=sido,name name=sgg \
  -simplify 1.5% keep-shapes -filter-islands min-area=2km2 remove-empty \
  -o format=topojson quantization=1e5 src/sgg.topo.json
```

일반구(수원시 장안구 등)는 시 단위로 합쳤습니다. 2km²보다 작은 섬은 뺐습니다.

## 출처

경계 데이터: 통계청 SGIS 행정동 경계(공공누리 제1유형), vuski/admdongkor 가공(CC BY 4.0).

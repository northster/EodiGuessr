# EodiGuessr (어디게서)

지역 이름이 나오면 대한민국 지도에서 그 위치를 찍는 웹게임입니다. 5문제를 풀면 정답 지역 경계까지의 거리로 0~100점을 매깁니다.

- 한 문제 점수: 정답 지역 경계에서 2km 안쪽이면 100점, 그보다 멀면 `100 × e^(-(거리-2km)/K)`. K는 65km. 수도권(서울·인천·경기) 지역은 가까이 빗나갈수록 점수를 더 깎고, 멀리 빗나가면 다른 지역과 비슷해집니다
- 제주 지역 문제는 맞히면 100점, 제주 안에서 틀리면 50점, 제주를 벗어난 곳을 찍으면 0점
- 모드: 오늘의 문제(날짜별로 모두 같은 5곳, 하루 한 번), 전국 무작위, 어려움(시군구 경계선 없음), 수도권
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

## 링크 미리보기

`og.png`(1200×630)가 링크를 공유할 때 뜨는 미리보기 이미지입니다. 미리보기 문구와 주소는 `src/build.js`의 `SITE`, `DESC`에서 바꿉니다.

`og.png`는 `node src/make-og.js`로 다시 만듭니다(playwright, d3, topojson-client, @fontsource 글꼴 필요).

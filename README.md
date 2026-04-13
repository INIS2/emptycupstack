# Empty Cup Stack

컵이 쌓여 있는 형태로 프로젝트 목록을 보여주는 정적 포트폴리오 페이지입니다.

왼쪽에는 컵 스택을 유지하고, 컵 사이의 간격에는 각 프로젝트의 제목과 설명이 들어갑니다. 컵이나 설명 바를 누르면 해당 항목이 펼쳐지고, 페이지와 GitHub로 이동하는 버튼이 나타납니다. 항목이 많아져도 컵 간격을 억지로 줄이지 않고, 스택 영역 안에서 마우스 휠이나 드래그로 위아래를 움직입니다.

## 주요 동작

- 프로젝트 데이터는 `assets/data/projects.json`에서 읽습니다.
- 데이터 항목은 `title`, `desc`, `pages`, `github` 순서로 관리합니다.
- `pages` 또는 `github` 중 하나라도 있으면 목록에 표시하고, 둘 다 비어 있으면 제외합니다.
- 빈 링크가 있는 버튼 그룹은 화면에 표시하지 않습니다.
- 페이지 전체에는 스크롤바가 생기지 않고, 컵 스택 내부만 휠과 드래그로 이동합니다.
- 컵을 호버하면 해당 컵과 위쪽 컵들이 함께 들리고, 클릭하면 잡은 상태처럼 고정됩니다.
- 클릭된 컵이 천장이나 바닥을 뚫지 않도록 스택 이동 범위를 보정합니다.
- 헤더 오른쪽에는 현재 선택 항목과 전체 항목 수가 `현재 / 전체` 형식으로 표시됩니다.
- 화면이 좁아져도 컵은 왼쪽, 설명은 오른쪽 구성을 유지합니다.

## 링크 버튼

각 프로젝트에는 Page와 GitHub 버튼이 있습니다.

- `COFFEE Page`: 커피 추출 전환 애니메이션 후 현재 창에서 Page 링크로 이동합니다.
- `Page 현재창`: 현재 창에서 Page 링크로 이동합니다.
- `Page 새창`: 새 창에서 Page 링크를 엽니다.
- `COFFEE GitHub`: 커피 추출 전환 애니메이션 후 현재 창에서 GitHub 링크로 이동합니다.
- `GitHub 현재창`: 현재 창에서 GitHub 링크로 이동합니다.
- `GitHub 새창`: 새 창에서 GitHub 링크를 엽니다.

버튼은 Page 그룹과 GitHub 그룹으로 나뉘며, 각 그룹 안에서는 세 버튼이 붙어 있는 형태입니다. 작은 화면에서는 버튼이 얇아지고 컵 영역을 과하게 넘지 않도록 반응형으로 줄어듭니다.

## 커피 전환

`COFFEE` 버튼을 누르면 선택한 프로젝트만 남기고 커피 추출 장면으로 전환합니다.

1. 선택한 컵이 화면 위쪽에 놓이고, 컵 홀더가 아래쪽에 나타납니다.
2. 컵의 요약 텍스트가 컵 홀더 위에 새겨진 듯한 색으로 표시됩니다.
3. 컵이 아래로 내려가 홀더에 안착합니다.
4. 커피 머신이 중앙에서 커지며 나타납니다.
5. 토출구에서 커피 기둥이 정속으로 내려옵니다.
6. 커피 기둥은 컵 바닥 아래로 보이지 않도록 마스크 처리됩니다.
7. 머신이 사라지고 컵과 홀더가 커지며 화면을 덮은 뒤, 대상 링크로 이동합니다.

사용하는 이미지 자산은 다음과 같습니다.

- `assets/img/cup.png`
- `assets/img/holder.png`
- `assets/img/shot_machine.png`
- `assets/img/coffee.png`

## 데이터 형식

`assets/data/projects.json`은 배열 형태입니다.

```json
{
  "title": "프로젝트 이름",
  "desc": "프로젝트 설명",
  "pages": "https://inis2.github.io/repository-name/",
  "github": "https://github.com/INIS2/repository-name"
}
```

`pages`는 GitHub Pages 주소를 사용합니다.

```text
https://inis2.github.io/EIP_TEST/
```

`github`는 GitHub 저장소 주소를 사용합니다.

```text
https://github.com/INIS2/EIP_TEST
```

## 파일 구조

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── style.css
│   ├── data
│   │   └── projects.json
│   ├── img
│   │   ├── coffee.png
│   │   ├── cup.png
│   │   ├── holder.png
│   │   └── shot_machine.png
│   └── js
│       └── script.js
└── README.md
```

## 로컬 실행

`projects.json`을 `fetch()`로 읽기 때문에 파일을 직접 여는 것보다 로컬 서버로 확인하는 편이 안정적입니다.

```powershell
cd M:\2_YOUNG\3_DEV\emptycupstack
python -m http.server 8000
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:8000/
```

## 배포

GitHub Pages 기준 URL:

```text
https://inis2.github.io/emptycupstack/
```

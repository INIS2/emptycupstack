# Empty Cup Stack

컵이 쌓인 형태로 프로젝트 목록을 보여주는 정적 포트폴리오 페이지입니다.

화면에는 컵 스택과 각 프로젝트의 가로 인덱스 바가 함께 배치됩니다. 컵이나 인덱스 바를 누르면 해당 컵이 잡힌 것처럼 떠 있고, 인덱스 바가 컵 높이만큼 펼쳐져 프로젝트 링크를 보여줍니다.

## 주요 동작

- 프로젝트 데이터는 `assets/data/projects.json`에서 읽습니다.
- 컵 간격은 항목 수가 많아져도 좁아지지 않고, 스택 영역 안에서 스크롤됩니다.
- 페이지 자체에는 스크롤바가 생기지 않고, 컵 스택만 마우스 휠 또는 드래그로 움직입니다.
- 클릭된 컵과 그 위쪽 컵들이 함께 들리며, 아래 컵과의 간격은 컵 높이의 1/5을 기준으로 계산됩니다.
- 맨 아래 컵은 바닥 기준점이라 클릭해도 들리지 않습니다.
- 맨 위 컵은 들려도 스택 영역의 천장을 넘지 않도록 스크롤 가능 높이를 확보합니다.
- 인덱스 바는 접힌 상태에서 제목과 설명을 두 줄로 보여주고, 펼쳐지면 링크 버튼을 표시합니다.
- 링크 버튼은 `Page`와 `GitHub`를 각각 현재창/새창 버튼으로 제공합니다.
- `pages` 또는 `github` 값이 비어 있으면 해당 버튼 그룹은 표시하지 않습니다.
- 헤더의 카운터는 `현재 항목 / 전체 항목`을 `h1` 오른쪽에 보여줍니다.

## 데이터 형식

`assets/data/projects.json`은 배열 형태이며, 각 항목은 아래 순서를 기준으로 관리합니다.

```json
{
  "title": "프로젝트 이름",
  "desc": "프로젝트 설명",
  "pages": "https://inis2.github.io/repository-name/",
  "github": "https://github.com/INIS2/repository-name"
}
```

`pages` 또는 `github` 중 하나만 있어도 프로젝트는 표시됩니다. 둘 다 비어 있으면 목록에서 제외됩니다.

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
│   │   ├── cup.png
│   │   └── holder.png
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

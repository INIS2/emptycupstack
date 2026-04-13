# Empty Cup Stack

컵이 겹쳐 쌓인 형태로 프로젝트 목록을 보여주는 정적 포트폴리오 페이지입니다.

왼쪽에는 컵 스택이 놓이고, 컵 오른쪽 영역에는 각 프로젝트의 제목과 설명이 들어갑니다. 컵을 클릭하면 해당 프로젝트가 펼쳐지고 Page/GitHub 링크 버튼이 나타납니다. 목록이 많아져도 컵 간격은 줄어들지 않으며, 스택 영역 안에서 마우스 휠이나 드래그로 탐색합니다.

## 개발자 코멘트
주소: inis2.github.io/emptycupstack/
프로젝트를 완수하고 레포에 올릴때마다 개발자의 책상에는 빈 컵이 쌓여가게됩니다.
하나의 프로젝트를 하나의 컵으로 표현하여 겹겹히 쌓인 컵의 모습을 이제까지 만들어온 프로젝트의 탑으로 표현했습니다.
컵을 늘이고 싶다면 assets/data/projects.json만 수정해주면 컵(프로젝트)가 늘어나게됩니다.
그냥 해당 웹페이지나 깃허브로 갈 수도 있지만, 조금의 재미를 위해 COFFEE 버튼을 만들었습니다.
버튼을 누르면 해당 컵으로 커피를 내려드립니다.(이후에 프로젝트로 이동합니다)
BONAPPETIT


## 주요 동작

- 프로젝트 데이터는 `assets/data/projects.json`에서 읽습니다.
- 데이터 항목은 `title`, `desc`, `pages`, `github` 필드로 구성합니다.
- `pages` 또는 `github` 중 하나라도 있으면 목록에 표시하고, 둘 다 비어 있으면 제외합니다.
- 비어 있는 링크 그룹은 화면에 표시하지 않습니다.
- 페이지 전체에는 스크롤바를 만들지 않고, 컵 스택 내부만 휠과 드래그로 이동합니다.
- 컵을 호버하면 해당 컵과 위쪽 컵들이 함께 살짝 올라갑니다.
- 컵을 클릭하면 확장 상태로 고정되고, 다시 클릭하면 접힙니다.
- 화면 오른쪽 상단에는 현재 선택 항목과 전체 항목 수가 `현재 / 전체` 형식으로 표시됩니다.
- 작은 화면에서도 컵은 왼쪽, 설명과 버튼은 오른쪽 구성을 유지합니다.

## 링크 버튼

각 프로젝트에는 Page 링크 그룹과 GitHub 링크 그룹이 있습니다.

- `COFFEE Page`: 커피 전환 애니메이션 후 현재 창에서 Page 링크로 이동합니다.
- `Page 현재창`: 현재 창에서 Page 링크로 이동합니다.
- `Page 새창`: 새 창에서 Page 링크를 엽니다.
- `COFFEE GitHub`: 커피 전환 애니메이션 후 현재 창에서 GitHub 링크로 이동합니다.
- `GitHub 현재창`: 현재 창에서 GitHub 링크로 이동합니다.
- `GitHub 새창`: 새 창에서 GitHub 링크를 엽니다.

## 커피 전환

`COFFEE` 버튼을 누르면 선택한 컵에서 이어지는 커피 추출 장면으로 전환한 뒤, 선택한 링크로 이동합니다.

1. 선택한 컵의 현재 화면 위치를 기준으로 커피 장면의 컵이 출발합니다.
2. 기존 페이지와 배경은 서서히 사라지고, 컵은 화면 상단 1/3 지점의 중앙으로 이동합니다.
3. 홀더가 아래 결합 위치에 먼저 나타납니다.
4. 컵이 아래로 내려가며 홀더와 맞물립니다.
5. 커피 머신이 중앙에 나타납니다.
6. 커피 줄기가 0.5초 간격으로 15번 겹쳐 내려오며, 뒤에 나오는 레이어가 앞 레이어보다 위에 쌓입니다.
7. 추출이 끝나면 머신이 사라지고 커버가 위에서 내려와 컵 위에 안착합니다.
8. 컵 확대 없이 아래쪽에 `Bon Appétit` 텍스트와 컨페티가 나타난 뒤 링크로 이동합니다.

사용하는 이미지 에셋은 다음과 같습니다.

- `assets/img/cup.png`
- `assets/img/holder.png`
- `assets/img/shot_machine.png`
- `assets/img/coffee.png`
- `assets/img/cover.png`

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

`pages`에는 GitHub Pages 주소를 사용합니다.

```text
https://inis2.github.io/EIP_TEST/
```

`github`에는 GitHub 저장소 주소를 사용합니다.

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
│   │   ├── cover.png
│   │   ├── cup.png
│   │   ├── holder.png
│   │   └── shot_machine.png
│   └── js
│       └── script.js
└── README.md
```

## 배포

GitHub Pages 기준 URL:

```text
https://inis2.github.io/emptycupstack/
```

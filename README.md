# 제레미 수익 파이프라인

수입이 들어오는 길을 노드로 보는 관리용 페이지입니다. 금액은 어디에도 적지 않습니다.

화면은 노드와 연결선만 그립니다. 이름, 설명, 갈래는 `data.js` 한 파일에 있습니다.

## 로컬에서 보기

저장소 폴더에서 아래를 실행한 뒤, 브라우저로 <http://localhost:8080> 을 엽니다.

```bash
python3 -m http.server 8080
```

`index.html` 을 파일로 직접 열어도 됩니다.

## 내용 고치기

`data.js` 의 `window.PIPELINE` 만 수정합니다. 저장한 뒤 브라우저를 새로고침하면 반영됩니다.

| 필드 | 하는 일 |
| --- | --- |
| `id` | 영문 짧은 이름. 주소(`?node=edu`)에 쓰이며 서로 겹치면 안 됩니다. |
| `title` | 노드에 크게 보이는 이름 |
| `subtitle` | 노드 아래 한 줄. 없어도 됩니다. |
| `role` | `start` 시작, `main` 본업(파란 강조), `side` 부업, `item` 하위 |
| `icon` | `flow`, `users`, `book`, `home`, `brick`, `play`. 없어도 됩니다. |
| `details` | 노드를 눌렀을 때 열리는 설명. `label` 과 `text` 를 원하는 만큼 둡니다. |
| `children` | 다음에 이어지는 노드 목록 |

노드를 더 넣으려면 기존 노드를 복사해 부모의 `children` 안에 붙입니다. `id` 만 새 이름으로 바꿉니다.

```js
{
  id: "new-id",
  title: "표시 이름",
  subtitle: "한 줄 설명",
  role: "item",
  details: [
    { label: "무엇인지", text: "" },
    { label: "고객", text: "" },
    { label: "유입 경로", text: "" },
    { label: "상태", text: "" }
  ]
}
```

금액, 매출, 구독자 수, 인원 실적, 퍼센트는 적지 않습니다. 지금 문장은 구조를 보여 주는 초안입니다.

`index.html`, `flow.js`, `flow.css` 는 그리는 방식이라, 글을 고칠 때는 열지 않아도 됩니다.

## 파일

- `index.html` — 페이지
- `data.js` — 노드 내용
- `flow.js` — 노드와 베지어 연결선
- `flow.css` — 토스 스타일 모양
- `fonts/` — 프리텐다드 (SIL Open Font License)

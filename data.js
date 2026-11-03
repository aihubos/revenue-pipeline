/* 수익 파이프라인 내용
 *
 * 화면 글은 이 파일만 고치면 됩니다. index.html, flow.js, flow.css 는
 * 노드와 선을 그리는 파일이라 보통 건드리지 않습니다.
 *
 * 금액, 매출, 구독자 수, 인원 실적, 퍼센트는 적지 마세요.
 * 아래 문장은 구조를 보여 주는 초안입니다. 실제에 맞게 문장만 고쳐 적으세요.
 *
 * 노드 필드
 * - id        영문 짧은 이름. 주소(?node=)에 쓰입니다. 서로 겹치면 안 됩니다.
 * - title     노드에 크게 보이는 이름
 * - subtitle  노드에 작게 보이는 한 줄. 없어도 됩니다.
 * - role      start(시작) | main(본업, 파란 강조) | side(부업) | item(하위)
 * - icon      flow, users, book, home, brick, play 중 하나. 없어도 됩니다.
 * - details   노드를 눌렀을 때 열리는 설명. label 과 text 를 원하는 만큼 둡니다.
 * - children  다음에 이어지는 노드 목록. 없으면 빼도 됩니다.
 *
 * 노드를 추가할 때는 아래 모양을 복사해 children 안에 넣습니다.
 *
 * {
 *   id: "new-id",
 *   title: "표시 이름",
 *   subtitle: "한 줄 설명",
 *   role: "item",
 *   details: [
 *     { label: "무엇인지", text: "" },
 *     { label: "고객", text: "" },
 *     { label: "유입 경로", text: "" },
 *     { label: "상태", text: "" }
 *   ]
 * }
 */
window.PIPELINE = {
  id: "root",
  title: "제레미 수익 파이프라인",
  subtitle: "수입이 들어오는 길",
  role: "start",
  icon: "flow",
  hint: "노드를 누르면 무엇인지, 고객, 들어오는 길, 상태가 열려요.",
  note: "금액은 적지 않아요. 문장은 data.js에 있는 초안이라, 실제에 맞게 고쳐 적으면 됩니다.",
  details: [
    { label: "무엇인지", text: "수입이 되는 길을 구조만 모아 둔 시작점이에요." },
    { label: "고객", text: "없어요. 갈래마다 다릅니다." },
    { label: "유입 경로", text: "없어요. 갈래마다 다릅니다." },
    { label: "상태", text: "구조를 정리하는 중" }
  ],
  children: [
    {
      id: "edu",
      title: "교육사업",
      subtitle: "직접 하는 AI 교육",
      role: "main",
      icon: "users",
      details: [
        { label: "무엇인지", text: "AI 교육을 직접 하는 본업 갈래예요." },
        { label: "고객", text: "배우는 사람과, 교육을 맡기는 곳" },
        { label: "유입 경로", text: "예: 소개, 카카오톡" },
        { label: "상태", text: "본업" }
      ],
      children: [
        {
          id: "offline",
          title: "소수정예 오프라인 강의",
          subtitle: "동탄 · 1:1~최대 3명 · 3시간",
          role: "item",
          icon: "users",
          details: [
            { label: "무엇인지", text: "동탄에서 만나는 작은 오프라인 강의예요. 한 번에 1명에서 최대 3명, 3시간입니다." },
            { label: "고객", text: "직접 와서 배우는 사람" },
            { label: "유입 경로", text: "예: 카카오톡, 당근 모임" },
            { label: "상태", text: "설명 초안" }
          ]
        },
        {
          id: "visit",
          title: "기업·기관·학교 출강/위탁 교육",
          subtitle: "찾아가거나 맡아서 하는 교육",
          role: "item",
          icon: "book",
          details: [
            { label: "무엇인지", text: "기업, 기관, 학교로 가서 하거나, 맡겨서 진행하는 교육이에요." },
            { label: "고객", text: "기업, 기관, 학교" },
            { label: "유입 경로", text: "예: 소개, 문의" },
            { label: "상태", text: "설명 초안" }
          ]
        }
      ]
    },
    {
      id: "space",
      title: "공간대여",
      subtitle: "공간을 빌려 주는 일",
      role: "side",
      icon: "home",
      details: [
        { label: "무엇인지", text: "공간을 빌려 주는 부업 갈래예요." },
        { label: "고객", text: "공간이 필요한 사람이나 모임" },
        { label: "유입 경로", text: "예: 당근, 소개" },
        { label: "상태", text: "부업" }
      ]
    },
    {
      id: "lego",
      title: "레고 부강사",
      subtitle: "레고 수업의 보조 강사",
      role: "side",
      icon: "brick",
      details: [
        { label: "무엇인지", text: "레고 수업에 부강사로 들어가는 부업 갈래예요." },
        { label: "고객", text: "수업을 듣는 사람, 수업을 맡기는 곳" },
        { label: "유입 경로", text: "예: 기존 수업 연결" },
        { label: "상태", text: "부업" }
      ]
    },
    {
      id: "media",
      title: "유튜브/블로그",
      subtitle: "글·영상, 콘텐츠와 광고",
      role: "side",
      icon: "play",
      details: [
        { label: "무엇인지", text: "글과 영상을 올리는 부업 갈래예요. 콘텐츠와 광고로 이어집니다." },
        { label: "고객", text: "영상이나 글을 보는 사람" },
        { label: "유입 경로", text: "유튜브, 블로그" },
        { label: "상태", text: "부업" }
      ]
    }
  ]
};

export const dynamic = 'force-dynamic';

// A presentation fallback. Every Gemini-backed feature on the live service can
// stop working mid-demo once the free-tier daily quota is gone, so this page
// reproduces all three of them from fixed, pre-written content and makes zero
// API calls. The articles are real ones from the collection; the AI text is
// written in advance and labelled as such throughout, so nobody can mistake
// this for live output.

const DEMO_ARTICLES = [
  {
    title: '한화오션, 6800억원 규모 LNGC 2척 수주… 이달 수주액 2.9조',
    link: 'https://www.chosun.com/economy/',
    source: '조선일보',
    date: '2026.09.28',
    region: '국내',
    type: '일반 뉴스',
    importance: 2,
    category: 'LNG',
    summary:
      '한화오션이 아프리카 지역 선주로부터 약 6800억원 규모의 LNG 운반선 2척을 수주했다. 이달 누적 수주액은 약 2조8900억원으로, 최근 매출액 대비 유의미한 비중을 차지한다.',
    implications:
      'LNG 운반선 발주가 이어진다는 것은 2028~2030년 인도 시점에 맞춘 신규 액화 프로젝트의 최종투자결정(FID)이 그만큼 확정되고 있다는 뜻입니다. 선박 수주는 액화 프로젝트보다 2~3년 앞서는 선행지표이므로, 당사가 검토 중인 LNG 트레이딩·터미널 사업의 물량 확보 시점을 이 발주 흐름에 맞춰 재점검할 필요가 있습니다. 다만 국내 조선 3사의 슬롯이 채워질수록 신규 용선 확보 단가는 상승 압력을 받습니다.',
    related: ['Hanwha Ocean bags order for LNG carrier duo (LNG Prime)'],
  },
  {
    title: '텍사스 가스발전부터 원전 8기까지…K-에너지, 美 시장 정조준',
    link: 'https://www.electimes.com/',
    source: '전기신문',
    date: '2026.09.28',
    region: '국내',
    type: '정책·규제',
    importance: 2,
    category: '원자력',
    summary:
      '2000억달러 규모의 대미 전략투자가 에너지 인프라를 중심으로 구체화되면서 국내 기업의 미국 전력시장 진출 기회가 확대될 전망이다. 텍사스 가스복합화력을 시작으로 대형 원전과 알래스카 LNG까지 추진될 경우 발전·원전은 물론 전력기기와 설계·시공 분야까지 참여 기회가 열린다.',
    implications:
      '단일 사업이 아니라 **정부 간 투자 패키지에 올라탄 파이프라인**이라는 점이 핵심입니다. 개별 입찰로 접근하면 늦고, 패키지 구성 단계에서 컨소시엄에 포함되는지가 승부처입니다. 당사 관점의 실무 과제는 세 가지입니다. ① 가스복합·원전·LNG 중 당사 역량이 실제로 통하는 구간(EPC·기자재·O&M) 특정, ② 미국 현지 파트너 및 IRA·세액공제 적용 요건 사전 검토, ③ 발주 시점이 정권 교체 리스크에 노출되므로 계약 구조에 정책 변경 조항 반영. 원전 8기는 규모가 커 보이지만 실제 FID까지는 수년이 걸리므로, 단기 매출보다 **사전 자격(prequalification) 확보**를 목표로 삼는 것이 현실적입니다.',
    related: ['Trump Backs Argentina LNG Project (Rigzone)'],
  },
  {
    title: 'ESR to acquire Aquila Clean Energy APAC in Asia-Pacific renewables and energy storage consolidation',
    link: 'https://www.energy-storage.news/',
    source: 'Energy-Storage.News',
    date: '2026.09.27',
    region: '동남아',
    type: '거래·투자',
    importance: 3,
    category: '기타 재생E',
    summary:
      '싱가포르 기반 물류·데이터센터 자산운용사 ESR이 Aquila Clean Energy APAC 지분 100% 인수 계약을 체결했다. 아시아태평양 재생에너지·ESS 플랫폼의 대형 통합 사례다.',
    implications:
      '데이터센터 사업자가 재생에너지 개발 플랫폼을 통째로 사들이는 흐름이 아시아로 넘어왔습니다. 전력 조달이 데이터센터 입지의 핵심 변수가 되면서, 수요기업이 직접 발전자산을 소유하는 방향으로 이동하고 있다는 신호입니다. 당사 관점에서는 **경쟁자가 늘었다**는 위협인 동시에, 개발 파이프라인을 보유한 중소 개발사의 엑싯 밸류에이션이 상승한다는 기회이기도 합니다. 보유 중인 초기 단계 프로젝트의 매각 타이밍을 재검토할 시점입니다.',
    related: [],
  },
  {
    title: '[초점]RPS 시대 막 내리고 ‘장기 계약시장’으로…재생에너지 시장 판 바뀐다',
    link: 'https://www.energydaily.co.kr/',
    source: '에너지데일리',
    date: '2026.09.26',
    region: '국내',
    type: '정책·규제',
    importance: 2,
    category: '기타 재생E',
    summary:
      '국내 재생에너지 보급정책의 중심축이 공급의무화제도(RPS)와 REC 거래에서 장기 고정가격계약 기반의 ‘계약시장’으로 전환된다. 정부가 필요 물량을 직접 설계해 발주하는 방식이다.',
    implications:
      '수익 구조의 근본적 변화입니다. REC 가격 변동에 노출되던 구조에서 **20년 고정가 계약 구조**로 바뀌면 프로젝트 IRR의 변동성은 낮아지지만, 상방 수익도 함께 제한됩니다. 금융 조달 관점에서는 유리하므로 레버리지 비율 재산정이 필요합니다. 더 중요한 것은 입찰 경쟁 구조로 바뀐다는 점으로, 낙찰가 하락 압력에 대응할 원가 경쟁력 확보가 사업 참여의 전제 조건이 됩니다. 제도 시행 시점과 경과조치 대상을 확인해 기존 파이프라인의 적용 여부를 먼저 정리할 것을 권고합니다.',
    related: [],
  },
  {
    title: 'Trump Backs Argentina LNG Project',
    link: 'https://www.rigzone.com/',
    source: 'Rigzone',
    date: '2026.09.26',
    region: '북미',
    type: '거래·투자',
    importance: 3,
    category: 'LNG',
    summary:
      '미국 수출입은행(EXIM)이 아르헨티나의 핵심 가스 프로젝트에 최대 60억 달러 규모의 금융을 제공하겠다고 제안했다.',
    implications:
      '남미 LNG에 미국 공적금융이 대규모로 투입되는 구도로, Vaca Muerta 가스전의 수출 경로가 현실화되는 단계입니다. 아시아 시장 관점에서는 2030년 전후 대서양 물량이 추가로 풀린다는 의미이며, 장기 계약 협상에서 구매자 우위가 강화될 수 있습니다. 당사가 장기 도입계약을 검토 중이라면 **계약 시점을 서두르기보다 공급 과잉 국면을 기다리는 편이 유리할 수 있다**는 점을 협상 전략에 반영해야 합니다.',
    related: [],
  },
];

const DEMO_CHAT = [
  {
    q: '한화오션의 LNG 관련 최신 기사 알려줘',
    a:
      '한화오션의 LNG 운반선 수주 소식이 2건 수집되어 있습니다.\n\n' +
      '• 아프리카 지역 선주로부터 LNG 운반선 2척을 약 6800억원에 수주했습니다. 이달 누적 수주액은 약 2조8900억원입니다. (한화오션, 6800억원 규모 LNGC 2척 수주… 이달 수주액 2.9조)\n\n' +
      '• 같은 건을 해외 매체는 약 5억 달러 규모 2척 계약으로 보도했습니다. 국내외 매체가 동시에 다룬 사안이라 중요도 가점이 반영되었습니다. (Hanwha Ocean bags order for LNG carrier duo)\n\n' +
      '• 발주 배경에는 2028~2030년 인도 일정에 맞춘 신규 액화 프로젝트의 최종투자결정이 있습니다. (Trump Backs Argentina LNG Project)',
  },
  {
    q: '동남아 재생에너지 투자 동향은?',
    a:
      '동남아 지역에서는 플랫폼 단위의 대형 인수 거래가 관찰됩니다.\n\n' +
      '• 싱가포르 기반 ESR이 Aquila Clean Energy APAC의 지분 100%를 인수하기로 했습니다. 아시아태평양 재생에너지·ESS 자산을 한 번에 확보하는 통합 거래입니다. (ESR to acquire Aquila Clean Energy APAC)\n\n' +
      '• 싱가포르에서는 수소 혼소가 가능한 12억 싱가포르달러 규모 복합화력이 착공했습니다. (PacificLight Breaks Ground on S$1.2 Billion Hydrogen-Ready CCGT)',
  },
  {
    q: '국내 재생에너지 정책 변화 요약해줘',
    a:
      '보급정책의 중심축이 의무화에서 계약으로 전환되는 흐름입니다.\n\n' +
      '• RPS와 REC 거래 중심 구조가 장기 고정가격계약 기반의 계약시장으로 바뀝니다. 정부가 필요 물량을 직접 설계해 발주하는 방식입니다. ([초점]RPS 시대 막 내리고 ‘장기 계약시장’으로)\n\n' +
      '• 영농형 태양광은 2만㎡ 미만일 경우 소규모 환경영향평가 대상에서 제외되어 인허가 문턱이 낮아집니다. ([분석]2만㎡ 미만 영농형 태양광, 소규모 환경영향평가 제외)',
  },
  {
    q: '국내 기업의 미국 에너지 시장 진출 기회는?',
    a:
      '대미 전략투자를 축으로 발전·원전·LNG 전반에서 기회가 확대되는 흐름입니다.\n\n' +
      '• 2000억달러 규모 대미 전략투자가 에너지 인프라 중심으로 구체화되면서, 텍사스 가스복합화력을 시작으로 대형 원전 8기와 알래스카 LNG까지 국내 기업 참여 기회가 열릴 전망입니다. (텍사스 가스발전부터 원전 8기까지…K-에너지, 美 시장 정조준)\n\n' +
      '• 미국 수출입은행은 아르헨티나 가스 프로젝트에 최대 60억 달러 금융 제공을 제안했습니다. 공적금융이 역내 프로젝트로 확대되는 사례입니다. (Trump Backs Argentina LNG Project)\n\n' +
      '• 다만 미국 LNG 수출 선적은 33건으로 감소해 단기 물량은 조정 국면입니다. (US LNG exports drop to 33 shipments)',
  },
];

const html = String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>그리드워치 · AI 기능 예시</title>
<meta name="color-scheme" content="light dark">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23125350'/%3E%3Cpath d='M18 5 L9 18 h6 l-2 9 9-13 h-6 z' fill='%23E2A648'/%3E%3C/svg%3E">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" media="print" onload="this.media='all'">
<style>
  :root{
    --bg:#ECEFEC; --surface:#FFFFFF; --surface-2:#F4F6F4;
    --text:#16211F; --text-muted:#56635E; --text-faint:#8B9791;
    --border:#D8DFDA; --border-strong:#C1CBC4;
    --accent:#B5720F; --accent-strong:#8E590C; --accent-soft:#F1E1C4; --accent-2:#125350;
    --shadow:rgba(22,33,31,0.10);
    --font-body:'IBM Plex Sans KR','Noto Sans KR','Malgun Gothic','맑은 고딕','Apple SD Gothic Neo',sans-serif;
    --font-serif:'Gowun Batang','Batang','바탕',serif;
    --font-mono:'IBM Plex Mono','SFMono-Regular',Consolas,monospace;
    --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-8:40px;
    --radius-s:4px; --radius-m:8px;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --bg:#0E1512; --surface:#161F1B; --surface-2:#1B2621;
      --text:#E7EDE8; --text-muted:#9CA8A1; --text-faint:#697A72;
      --border:#28352F; --border-strong:#37473F;
      --accent:#E2A648; --accent-strong:#F2BC6C; --accent-soft:#3A2C15; --accent-2:#4FC2B8;
      --shadow:rgba(0,0,0,0.45);
    }
  }
  *{box-sizing:border-box;}
  [hidden]{display:none !important;}
  body{ margin:0; background:var(--bg); color:var(--text); font-family:var(--font-body); font-size:15px; line-height:1.6; }
  .page{ max-width:980px; margin:0 auto; padding:var(--sp-6) var(--sp-5) var(--sp-8); display:flex; flex-direction:column; gap:var(--sp-5); }

  .topbar{ display:flex; align-items:center; justify-content:space-between; gap:var(--sp-4); flex-wrap:wrap; padding-bottom:var(--sp-4); border-bottom:1px solid var(--border); }
  .brand{ display:flex; align-items:center; gap:10px; }
  .brand-mark{ font-size:1.2rem; }
  .brand-name{ font-weight:700; font-size:1.15rem; }
  .brand-tag{ font-size:0.76rem; color:var(--text-muted); display:block; font-weight:400; }
  .back{ font-family:var(--font-mono); font-size:0.78rem; color:var(--accent-2); text-decoration:none; }

  .demo-banner{ border:1px solid var(--accent); background:var(--accent-soft); color:var(--accent-strong); border-radius:var(--radius-m); padding:var(--sp-4) var(--sp-5); }
  .demo-banner b{ display:block; font-size:0.95rem; margin-bottom:4px; }
  .demo-banner p{ margin:0; font-size:0.84rem; line-height:1.6; }

  .card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); padding:var(--sp-5); box-shadow:0 1px 2px var(--shadow); }
  .card-head{ display:flex; align-items:baseline; justify-content:space-between; gap:var(--sp-3); flex-wrap:wrap; margin-bottom:4px; }
  .eyebrow{ font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent); margin:0 0 6px; }
  .card h2{ margin:0; font-size:1.08rem; font-family:var(--font-serif); }
  .card-note{ margin:4px 0 var(--sp-4); font-size:0.82rem; color:var(--text-faint); line-height:1.6; }
  .usage-badge{ font-family:var(--font-mono); font-size:0.7rem; color:var(--accent-2); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 9px; white-space:nowrap; }

  .type-badge{ font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.04em; color:var(--text-muted); background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-s); padding:2px 7px; }
  .signal{ display:inline-flex; align-items:flex-end; gap:2px; height:11px; }
  .signal i{ display:block; width:3px; background:var(--border-strong); border-radius:1px; }
  .signal i:nth-child(1){height:5px;} .signal i:nth-child(2){height:8px;} .signal i:nth-child(3){height:11px;}
  .signal i.filled{ background:var(--accent); }

  .ai-insight-card{ background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-m); padding:var(--sp-4); display:flex; flex-direction:column; gap:6px; margin-bottom:var(--sp-3); }
  .ai-insight-head{ display:flex; align-items:center; gap:8px; }
  .ai-insight-title{ margin:0; font-size:0.98rem; line-height:1.45; }
  .ai-insight-title a{ color:var(--text); text-decoration:none; }
  .ai-insight-title a:hover{ color:var(--accent-2); }
  .ai-insight-meta{ margin:0; font-size:0.74rem; color:var(--text-faint); font-family:var(--font-mono); }
  .ai-result-label{ font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.05em; text-transform:uppercase; color:var(--accent-2); margin:8px 0 0; }
  .ai-result-text{ font-size:0.87rem; line-height:1.68; margin:0; }
  .ai-implication{ color:var(--accent-2); }
  .ai-related{ margin:6px 0 0; font-size:0.74rem; color:var(--text-faint); }

  .btn{ background:var(--accent-2); color:#fff; border:none; border-radius:var(--radius-s); padding:9px 18px; font-size:0.87rem; font-weight:500; cursor:pointer; font-family:inherit; }
  .btn:hover{ background:var(--accent-strong); }
  .btn:disabled{ opacity:0.55; cursor:default; }
  .btn-ghost{ background:transparent; color:var(--accent-2); border:1px solid var(--border-strong); }
  .btn-ghost:hover{ background:var(--surface-2); color:var(--accent-strong); }

  .ai-generate-prompt{ display:flex; flex-direction:column; align-items:center; gap:var(--sp-3); padding:var(--sp-8) 0; text-align:center; }
  .ai-generate-text{ color:var(--text-faint); font-size:0.88rem; margin:0; max-width:460px; }
  .ai-progress{ background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-s); padding:var(--sp-3) var(--sp-4); display:flex; flex-direction:column; gap:var(--sp-2); margin-bottom:var(--sp-3); }
  .ai-progress-steps{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-family:var(--font-mono); font-size:0.72rem; }
  .ai-progress-step{ color:var(--text-faint); }
  .ai-progress-step.active{ color:var(--accent-strong); font-weight:600; }
  .ai-progress-step.done{ color:var(--accent-2); }
  .ai-progress-arrow{ color:var(--text-faint); }
  .ai-progress-bar{ height:4px; background:var(--border); border-radius:999px; overflow:hidden; }
  .ai-progress-fill{ height:100%; background:var(--accent); transition:width 0.35s ease; }
  .ai-progress-note{ margin:0; font-size:0.76rem; color:var(--text-faint); }

  /* --- section 1: per-article summary --- */
  .sum-row{ display:flex; gap:var(--sp-4); align-items:flex-start; flex-wrap:wrap; border-top:1px solid var(--border); padding-top:var(--sp-4); margin-top:var(--sp-4); }
  .sum-row:first-of-type{ border-top:none; padding-top:0; margin-top:0; }
  .sum-main{ flex:1; min-width:260px; }
  .sum-title{ margin:0 0 4px; font-size:0.95rem; line-height:1.45; }
  .sum-meta{ margin:0; font-size:0.74rem; color:var(--text-faint); font-family:var(--font-mono); }
  .sum-out{ margin-top:var(--sp-3); background:var(--surface-2); border-left:2px solid var(--accent-2); border-radius:0 var(--radius-s) var(--radius-s) 0; padding:var(--sp-3) var(--sp-4); }

  /* --- section 3: chat --- */
  .chat-shell{ display:flex; gap:var(--sp-4); flex-wrap:wrap; align-items:flex-start; }
  .chat-panel{ flex:1; min-width:300px; background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-m); display:flex; flex-direction:column; overflow:hidden; height:480px; }
  .chat-panel-header{ display:flex; align-items:center; justify-content:space-between; padding:var(--sp-3) var(--sp-4); background:var(--accent-2); color:#fff; font-weight:600; font-size:0.88rem; flex:none; }
  .chat-messages{ flex:1; overflow-y:auto; padding:var(--sp-4); display:flex; flex-direction:column; gap:var(--sp-3); }
  .chat-msg{ font-size:0.85rem; line-height:1.7; padding:10px 13px; border-radius:var(--radius-s); max-width:92%; white-space:pre-wrap; }
  .chat-msg-bot{ background:var(--surface); color:var(--text); align-self:flex-start; border:1px solid var(--border); }
  .chat-msg-user{ background:var(--accent-2); color:#fff; align-self:flex-end; }
  .chat-msg-loading{ color:var(--text-faint); font-style:italic; }
  .chat-input-row{ display:flex; gap:6px; padding:var(--sp-3); border-top:1px solid var(--border); background:var(--surface); flex:none; }
  .chat-input-row input{ flex:1; min-width:0; padding:8px 12px; border-radius:var(--radius-s); border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-size:0.85rem; font-family:inherit; }
  .chat-asks{ width:270px; min-width:240px; display:flex; flex-direction:column; gap:6px; }
  .chat-asks h3{ margin:0 0 2px; font-size:0.8rem; font-family:var(--font-mono); letter-spacing:0.04em; text-transform:uppercase; color:var(--text-faint); font-weight:600; }
  .ask{ text-align:left; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-s); padding:9px 12px; font-size:0.83rem; color:var(--text); cursor:pointer; font-family:inherit; line-height:1.45; }
  .ask:hover{ border-color:var(--accent-2); color:var(--accent-2); }
  .ask:disabled{ opacity:0.45; cursor:default; }

  .foot{ font-size:0.78rem; color:var(--text-faint); text-align:center; line-height:1.7; padding-top:var(--sp-4); border-top:1px solid var(--border); }
  @media (max-width:640px){
    .chat-asks{ width:100%; }
    .chat-panel{ height:420px; }
  }
</style>
</head>
<body>
<div class="page">

  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">⚡</span>
      <div>
        <span class="brand-name">그리드워치</span>
        <span class="brand-tag">AI 기능 예시 화면 (Demo)</span>
      </div>
    </div>
    <a class="back" href="/">← 실제 서비스로</a>
  </header>

  <div class="demo-banner">
    <b>이 페이지는 사전 준비된 예시입니다</b>
    <p>
      실시간 AI 응답이 아니라 미리 작성해 둔 고정 내용을 보여줍니다. 따라서 <b>API 사용량을 전혀 소비하지 않으며, 한도가 소진된 상태에서도 항상 동일하게 동작합니다.</b>
      화면 구성과 동작 방식은 실제 서비스와 같고, 아래 기사 5건은 실제로 수집된 기사입니다.
    </p>
  </div>

  <!-- 1. per-article summary -->
  <section class="card">
    <p class="eyebrow">Feature 01</p>
    <div class="card-head">
      <h2>기사 핵심 요약</h2>
      <span class="usage-badge">예시 · 사용량 0</span>
    </div>
    <p class="card-note">개별 기사의 <b>[AI 요약]</b> 버튼을 누르면 본문을 2~3문장으로 압축해 보여줍니다. 아래 버튼을 눌러 동작을 확인하세요.</p>
    <div id="sumList"></div>
  </section>

  <!-- 2. AI insight report -->
  <section class="card">
    <p class="eyebrow">Feature 02</p>
    <div class="card-head">
      <h2>AI 에너지전문가의 시사점</h2>
      <span class="usage-badge">예시 · 사용량 0</span>
    </div>
    <p class="card-note">
      설정한 개인화 필터에 맞는 기사 중 중요도 상위 5건을 골라 <b>요약 + 우리 사업 관점의 시사점</b>을 제시합니다.
      실제 서비스에서는 생성에 15~30초가 걸리며, 진행 단계가 아래와 같이 표시됩니다.
    </p>
    <div id="reportArea">
      <div class="ai-generate-prompt">
        <p class="ai-generate-text">현재 필터 조건(LNG · 원자력 · 기타 재생E / 국내 · 동남아 · 북미 / 투자·개발)에 맞는 핵심 기사 5건이 선별되었습니다.</p>
        <button class="btn" id="genBtn" type="button">AI 시사점 생성하기</button>
      </div>
    </div>
  </section>

  <!-- 3. chatbot -->
  <section class="card">
    <p class="eyebrow">Feature 03</p>
    <div class="card-head">
      <h2>실시간 AI 챗봇</h2>
      <span class="usage-badge">예시 · 사용량 0</span>
    </div>
    <p class="card-note">수집된 기사 전체를 대상으로 자연어 질의에 답합니다. 오른쪽 예시 질문을 누르면 실제와 같은 방식으로 답변이 표시됩니다.</p>
    <div class="chat-shell">
      <div class="chat-panel">
        <div class="chat-panel-header">
          <span>AI에게 물어보기</span>
          <span class="usage-badge" style="background:rgba(255,255,255,0.15); color:#fff; border-color:rgba(255,255,255,0.3)">예시 모드</span>
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <form class="chat-input-row" id="chatForm">
          <input type="text" id="chatInput" placeholder="예시 모드에서는 오른쪽 질문만 동작합니다" aria-label="질문 입력">
          <button class="btn" type="submit">전송</button>
        </form>
      </div>
      <div class="chat-asks" id="chatAsks">
        <h3>예시 질문</h3>
      </div>
    </div>
  </section>

  <p class="foot">
    그리드워치 · AI 기능 예시 화면 &nbsp;|&nbsp; 이 페이지의 AI 응답은 사전에 작성된 예시이며 실시간 생성 결과가 아닙니다.<br>
    실제 데이터는 <a href="/" style="color:var(--accent-2)">서비스 화면</a>에서 확인하세요.
  </p>
</div>

<script>
(function(){
  const ARTICLES = __ARTICLES__;
  const CHAT = __CHAT__;

  const ESC={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>ESC[c]);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  // Emphasis is authored as **...** in the canned text; everything else is escaped.
  const rich=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
  const signal=n=>'<span class="signal">'+[1,2,3].map(i=>'<i class="'+(i<=n?'filled':'')+'"></i>').join('')+'</span>';

  /* ---- Feature 01: per-article summary ---------------------------- */
  document.getElementById('sumList').innerHTML = ARTICLES.slice(0,2).map((a,i)=>
    '<div class="sum-row">'+
      '<div class="sum-main">'+
        '<h3 class="sum-title">'+esc(a.title)+'</h3>'+
        '<p class="sum-meta">'+esc(a.source)+' · '+esc(a.date)+' · '+esc(a.category)+' · '+esc(a.region)+'</p>'+
      '</div>'+
      '<button class="btn btn-ghost" data-sum="'+i+'" type="button">AI 요약</button>'+
      '<div class="sum-out" data-out="'+i+'" hidden></div>'+
    '</div>'
  ).join('');

  document.querySelectorAll('[data-sum]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const i = Number(btn.dataset.sum);
      const out = document.querySelector('[data-out="'+i+'"]');
      btn.disabled = true; btn.textContent = '요약 중…';
      out.hidden = false;
      out.innerHTML = '<p class="ai-progress-note">AI가 본문을 읽고 있습니다…</p>';
      await sleep(1400);
      out.innerHTML = '<p class="ai-result-label">AI 핵심 요약</p><p class="ai-result-text">'+rich(ARTICLES[i].summary)+'</p>';
      btn.textContent = '요약 완료';
    });
  });

  /* ---- Feature 02: insight report --------------------------------- */
  function progressHTML(step, elapsed){
    const steps=['핵심 기사 선별','AI 분석 요청','결과 정리'];
    return '<div class="ai-progress">'+
      '<div class="ai-progress-steps">'+steps.map((s,i)=>
        '<span class="ai-progress-step'+(i<step?' done':i===step?' active':'')+'">'+(i+1)+'. '+esc(s)+'</span>'
      ).join('<span class="ai-progress-arrow">→</span>')+'</div>'+
      '<div class="ai-progress-bar"><div class="ai-progress-fill" style="width:'+Math.round((step/steps.length)*100)+'%"></div></div>'+
      '<p class="ai-progress-note">'+elapsed+'초 경과 · AI 응답을 기다리는 중입니다</p>'+
    '</div>';
  }
  function cardHTML(a){
    return '<div class="ai-insight-card">'+
      '<div class="ai-insight-head"><span class="type-badge">'+esc(a.type)+'</span>'+signal(a.importance)+'</div>'+
      '<h3 class="ai-insight-title"><a href="'+esc(a.link)+'" target="_blank" rel="noopener noreferrer">'+esc(a.title)+'</a></h3>'+
      '<p class="ai-insight-meta">'+esc(a.source)+' · '+esc(a.date)+' · '+esc(a.region)+' · '+esc(a.category)+'</p>'+
      '<p class="ai-result-label">AI 핵심 요약</p><p class="ai-result-text">'+rich(a.summary)+'</p>'+
      '<p class="ai-result-label">시사점</p><p class="ai-result-text ai-implication">'+rich(a.implications)+'</p>'+
      (a.related.length ? '<p class="ai-related">유사 보도 · '+a.related.map(esc).join(' / ')+'</p>' : '')+
    '</div>';
  }
  async function runReport(){
    const area=document.getElementById('reportArea');
    // Replays the real timings so the demo shows what the wait actually feels like.
    for(const [step,secs] of [[0,1],[1,2],[1,4],[2,6]]){
      area.innerHTML = progressHTML(step, secs);
      await sleep(step===1 && secs===2 ? 1600 : 1100);
    }
    area.innerHTML = '<button class="btn btn-ghost" id="againBtn" type="button" style="margin-bottom:12px">↻ 다시 재생</button>'
      + ARTICLES.map(cardHTML).join('');
    document.getElementById('againBtn').addEventListener('click', runReport);
  }
  document.getElementById('genBtn').addEventListener('click', runReport);

  /* ---- Feature 03: chatbot ---------------------------------------- */
  const msgs=document.getElementById('chatMessages');
  function push(role, text, loading){
    const el=document.createElement('div');
    el.className='chat-msg '+(role==='user'?'chat-msg-user':'chat-msg-bot')+(loading?' chat-msg-loading':'');
    el.textContent=text;
    msgs.appendChild(el);
    msgs.scrollTop=msgs.scrollHeight;
    return el;
  }
  push('bot','안녕하세요. 수집된 에너지 기사에 대해 질문해주세요.\n\n예) "OO기업의 수소 관련 최신 기사", "동남아 LNG 투자 동향"');

  let busy=false;
  async function ask(item){
    if(busy) return;
    busy=true;
    document.querySelectorAll('.ask').forEach(b=>b.disabled=true);
    push('user', item.q);
    const loading=push('bot','생각 중…',true);
    await sleep(1500);
    loading.remove();
    push('bot', item.a);
    document.querySelectorAll('.ask').forEach(b=>b.disabled=false);
    busy=false;
  }

  const asks=document.getElementById('chatAsks');
  CHAT.forEach(item=>{
    const b=document.createElement('button');
    b.type='button'; b.className='ask'; b.textContent=item.q;
    b.addEventListener('click', ()=>ask(item));
    asks.appendChild(b);
  });

  document.getElementById('chatForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const input=document.getElementById('chatInput');
    const v=input.value.trim();
    if(!v || busy) return;
    input.value='';
    busy=true;
    push('user', v);
    const loading=push('bot','생각 중…',true);
    await sleep(1200);
    loading.remove();
    push('bot','이 화면은 예시 모드입니다. 준비된 질문만 답변할 수 있습니다.\n\n오른쪽 "예시 질문" 중 하나를 눌러주세요. 실제 서비스에서는 자유롭게 질문하실 수 있습니다.');
    busy=false;
  });
})();
</script>
</body>
</html>`;

export async function GET() {
  // Escaped so a "</script>" ever appearing in the copy cannot close the block.
  const inline = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
  const body = html
    .replace('__ARTICLES__', inline(DEMO_ARTICLES))
    .replace('__CHAT__', inline(DEMO_CHAT));
  return new Response(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Entirely static content - serve it from the edge so it never fails to
      // load during a presentation.
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

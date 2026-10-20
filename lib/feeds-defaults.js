// Code defaults for the collection sources and the classification keywords.
// These are the starting point only: lib/config.js layers the admin's
// additions and removals (stored in the database, edited from /dev) on top,
// and every runtime path reads the merged result via getConfig().
// Kept in their own module so lib/config.js and lib/feeds.js can both import
// them without a cycle.

// Verified working (HTTP 200, valid RSS 2.0) as of Sep 2026.
// Category is decided per-article from keyword matches, not per-feed —
// several of these sources cover more than one category, and a couple
// (FuelCellsWorks) also publish off-topic content that should be dropped
// rather than mis-tagged.
//
// `defaultRegion` is only a fallback when no region keyword matches — it is
// NOT forced onto every article. Korean trade press defaults to 'domestic'
// since that's who they write for; English trade press defaults to 'global'
// since it rarely names a country at all.
export const DEFAULT_FEEDS = [
  { url: 'https://lngprime.com/feed/', source: 'LNG Prime', defaultRegion: 'global' },
  { url: 'https://www.world-nuclear-news.org/rss', source: 'World Nuclear News', defaultRegion: 'global' },
  { url: 'https://www.energy-storage.news/feed/', source: 'Energy-Storage.News', defaultRegion: 'global' },
  { url: 'https://www.utilitydive.com/feeds/news/', source: 'Utility Dive', defaultRegion: 'global' },
  { url: 'https://www.h2-view.com/feed/', source: 'H2 View', defaultRegion: 'global' },
  { url: 'https://fuelcellsworks.com/feed/', source: 'FuelCellsWorks', defaultRegion: 'global' },
  { url: 'https://www.rigzone.com/news/rss/rigzone_latest.aspx', source: 'Rigzone', defaultRegion: 'global' },
  { url: 'https://www.offshorewind.biz/feed/', source: 'offshoreWIND.biz', defaultRegion: 'global' },
  { url: 'https://www.power-technology.com/feed/', source: 'Power Technology', defaultRegion: 'global' },
  // None of the sources above cover bioenergy, which left the 바이오가스
  // category permanently empty.
  { url: 'https://bioenergyinternational.com/feed/', source: 'Bioenergy International', defaultRegion: 'global' },
  { url: 'https://bioenergytimes.com/feed/', source: 'BioEnergy Times', defaultRegion: 'global' },
  { url: 'https://www.bioenergy-news.com/feed/', source: 'Bioenergy Insight', defaultRegion: 'global' },
  // Biomass Magazine has no RSS endpoint any more (the site is a JS app;
  // /feed, /rss, /articles/rss all return HTML) - recheck if they add one.
  // Korean energy trade press
  { url: 'https://www.e2news.com/rss/allArticle.xml', source: '이투뉴스', defaultRegion: 'domestic' },
  { url: 'https://www.energy-news.co.kr/rss/allArticle.xml', source: '에너지신문', defaultRegion: 'domestic' },
  { url: 'https://www.electimes.com/rss/allArticle.xml', source: '전기신문', defaultRegion: 'domestic' },
  { url: 'https://www.gasnews.com/rss/allArticle.xml', source: '가스신문', defaultRegion: 'domestic' },
  { url: 'https://www.energydaily.co.kr/rss/allArticle.xml', source: '에너지데일리', defaultRegion: 'domestic' },
  // Major Korean daily papers ("메이저 언론사") - tier:'major' ranks these
  // above trade press regardless of sort mode. 한국경제 is currently
  // Cloudflare-blocked (403 even with a full browser UA) and was left out;
  // retry it if this list is revisited.
  { url: 'https://www.mk.co.kr/rss/30100041/', source: '매일경제', defaultRegion: 'domestic', tier: 'major' },
  { url: 'https://www.chosun.com/arc/outboundfeeds/rss/category/economy/?outputType=xml', source: '조선일보', defaultRegion: 'domestic', tier: 'major' },
  { url: 'https://rss.donga.com/economy.xml', source: '동아일보', defaultRegion: 'domestic', tier: 'major' },
];

// Key order matters: scoreMatch() keeps the FIRST category with the highest
// hit count, so specific technologies are listed before the generic
// "기타 재생E" bucket - otherwise an article saying both "재생에너지" and
// "태양광" would land in the catch-all instead of solar.
export const DEFAULT_CATEGORY_KEYWORDS = {
  solar: ['solar', 'photovoltaic', ' pv ', 'solar farm', 'solar panel', 'rooftop solar', 'agrivoltaic', 'perovskite',
    '태양광', '태양열', '태양전지', '영농형태양광', '페로브스카이트'],
  wind: ['wind farm', 'wind power', 'offshore wind', 'onshore wind', 'wind turbine', 'floating wind', 'nacelle',
    '풍력', '해상풍력', '육상풍력', '풍력발전', '부유식 해상풍력'],
  // Korean coverage of this sector rarely says "바이오가스" outright - it goes
  // by feedstock (음식물류폐기물·가축분뇨·하수슬러지) or by the legal term
  // 유기성폐자원, so those have to be in here or the category stays empty.
  biogas: ['biogas', 'biomass', 'anaerobic digestion', 'digester', 'landfill gas', 'lfg', 'biomethane',
    'renewable natural gas', 'bioenergy', 'biofuel', 'biodiesel', 'ethanol', 'wood pellet', 'waste-to-energy',
    '바이오가스', '바이오매스', '바이오에너지', '바이오메탄', '바이오중유', '바이오디젤', '혐기성소화',
    '매립가스', '우드펠릿', '목재펠릿', '유기성폐자원', '음식물류폐기물', '가축분뇨', '하수슬러지',
    '폐자원에너지', '폐기물에너지', '고형연료'],
  hydrogen: ['hydrogen', 'ammonia', 'electrolyser', 'electrolyzer', 'fuel cell', 'green hydrogen', 'blue hydrogen',
    '수소', '그린수소', '청정수소', '블루수소', '암모니아', '수전해', '연료전지', '수소충전소'],
  nuclear: ['nuclear', 'reactor', 'smr', 'uranium', 'atomic energy', 'enrichment',
    '원전', '원자력', '원자로', '소형모듈원자로', '한수원', '사용후핵연료', '우라늄'],
  ess: ['battery storage', 'energy storage', 'bess', 'storage system', 'storage project', 'grid-scale battery', 'lithium-ion', 'ldes', 'pumped storage',
    '에너지저장', 'ess', '배터리', '이차전지', '양수발전', '장주기'],
  lng: ['lng', 'liquefied natural gas', 'natural gas', 'gas field', 'gas project', 'gas terminal', 'regasification',
    '액화천연가스', '천연가스', '가스공사', '가스전', '도시가스', '인수기지'],
  renewable: ['renewable', 'hydropower', 'hydroelectric', 'geothermal', 'tidal', 'wave energy', 'clean energy',
    '재생에너지', '신재생', '신재생에너지', '수력', '지열', '조력', '파력', '해양에너지', 're100'],
};

export const JOB_LABELS = {
  invest_dev: '투자/개발',
  tech: '기술',
  sales: '영업/마케팅(시황)',
  external: '대외협력/ESG(정책)',
};

export const CATEGORY_LABELS = {
  solar: '태양광', wind: '풍력', renewable: '기타 재생E', biogas: '바이오가스',
  hydrogen: '수소', nuclear: '원자력', ess: 'ESS', lng: 'LNG',
};

// 직무 축 4종. 에너지 신사업에서 투자와 개발은 한 팀이 보는 영역이라 묶었고,
// 정책·규제는 별도 축이 아니라 대외협력/ESG 업무에 포함시켰다 (정보유형
// 필터에도 "정책·규제"가 있어 축이 중복되던 문제도 함께 해소).
// Bare '기술', '공급', '수급', '공동' used to live in here and were the four
// noisiest keywords in the whole feed - '기술' fired on company names
// (한국전력기술) and job titles (기술이사), '공급' on 공급망/전력공급. Ambiguous
// words are now only kept as the phrase that actually carries the meaning.
export const DEFAULT_JOB_KEYWORDS = {
  invest_dev: ['invest', 'funding', 'fundrais', 'raises', 'stake', 'acquisition', 'acquire', 'merger', 'financing',
    'financial close', 'ppa', 'final investment decision', ' fid ', 'epc', 'awarded contract', 'contract award',
    'construction', 'groundbreaking', 'commercial operation', 'starts operation', 'begins operation',
    'joint venture', 'developer', 'divest', 'sells stake', 'loan', 'ipo', 'equity',
    // 'signs' alone matched "Signs of Iran Progress" - it only means a deal
    // when it takes an object
    'commissions', 'commissioned', 'to build', 'secures', 'signs a', 'signs mou', 'signs agreement',
    'signs deal', 'signs contract', 'signs with', ' deal', 'portfolio', 'expansion', 'repower',
    '투자', '펀딩', '지분', '인수', '매각', '유치', '착공', '준공', '가동', '완공', '상업운전', '수주',
    '최종투자결정', '자금조달', '금융조달', '사업권', '낙찰', '개발사업', '공동개발', '출자', '펀드',
    '계약', '체결', '건설', '건립', '신설', '증설', '조성', '발주', '공사', '진출',
    // 인허가는 한 직무의 전유물이 아니다. 개발자에게는 사업 일정을 좌우하는
    // 마일스톤이라 투자/개발·기술·영업에도 함께 넣는다.
    'permit', 'permitting', 'approval', 'licence', 'license', 'consent',
    '인허가', '허가', '승인', '인증', '면허'],
  tech: ['technology', 'technologies', 'pilot', 'demonstrat', 'prototype', 'patent', 'efficiency', 'breakthrough',
    'r&d', 'research', 'electroly', 'catalyst', 'test facility', 'field trial', 'performance', 'innovation',
    'engineering', 'retrofit', 'first-of-a-kind', 'launch', 'introduc', 'unveil', 'presents',
    'develops', 'materials', 'fuel cell system', 'upgrade', 'produces', 'manufactur',
    '기술개발', '기술력', '신기술', '핵심기술', '원천기술', '기술이전', '기술 확보', '실증', '연구개발', '연구원',
    '파일럿', '특허', '효율', '국산화', '성능', '소재', '촉매', '전해조', '시운전', '설계', '시험', '검증',
    '표준화', '출시', '공개', '시제품', '장비', '고도화',
    // 기술 관점의 인허가: 형식승인·안전인증·설계인가 등
    'type approval', 'certification', 'certified', 'safety approval', 'design approval', 'licence', 'license',
    '인허가', '인증', '형식승인', '안전인증', '설계승인', '기술기준', 'kc인증'],
  sales: ['price', 'pricing', 'tariff', 'spot rate', 'forecast', 'demand', 'outlook', 'margin', 'benchmark',
    'market', 'sales', 'marketing', 'export', 'offtake', 'customer', 'supply deal', 'supply agreement',
    'supply contract', 'revenue', 'profit', 'shipment', 'cargo', 'oversupply', 'shortage', 'cost competitive',
    'growth', 'analyst', 'market share', 'says globaldata', 'wood mackenzie', 'bnef', 'rates', 'cost of',
    '가격', '단가', '수요', '전력수급', '수급 전망', '시황', '전망', '마진', '지수', '입찰가', '영업', '마케팅',
    '판매', '수출', '고객', '오프테이크', '공급계약', '공급망', '시장규모', '점유율', '매출', '수익성', '원가',
    '경쟁력', '시장', '성장세', '판로',
    // 영업 관점의 인허가: 입찰 자격·사업 허가가 곧 수주 조건
    'permit', 'licence', 'license', 'prequalification', 'bid',
    '인허가', '허가', '입찰', '공고', '자격', '등록'],
  external: ['mou', 'memorandum', 'partnership', 'cooperation', 'collaborat', 'alliance', 'esg',
    'carbon neutral', 'net zero', 're100', 'community', 'regulat', 'policy', 'government', 'ministry',
    'parliament', 'subsidy', 'incentive', 'tender', 'auction', 'mandate', 'emissions',
    'sustainab', 'directive', 'tax credit', 'binding', 'ruling', 'court', 'judge',
    'framework', 'roadmap', 'european commission', 'brussels', 'urge', 'federal', 'agreement', 'approve', 'senate', 'congress',
    // 탄소배출권·감축실적 축. 배출권 가격/거래는 대외협력·ESG 담당의 핵심
    // 소재이고, 국제 감축(Article 6)·CBAM·공시까지 같은 축으로 묶는다.
    'carbon credit', 'carbon market', 'carbon price', 'carbon pricing', 'carbon tax', 'carbon border',
    'cbam', 'emissions trading', ' ets', 'eu ets', 'k-ets', 'allowance', 'offset credit', 'article 6',
    'verified emission', 'cdm', 'itmo', 'decarboni', 'scope 3', 'ccus', 'carbon capture',
    'csrd', 'issb', 'tcfd', 'taxonomy', 'green bond', 'carbon neutrality', 'net-zero',
    '협약', '협력', '파트너십', '업무협약', '탄소중립', '넷제로', '지역수용성', '주민수용성', '상생', '공동연구',
    '정책', '규제', '정부', '법안', '보조금', '고시', '제도', '공청회', '환경영향평가', '지자체',
    '국회', '세액공제', '공모', '주민', '로드맵', '기본계획', '국제협력', '반발', '민원', '부처',
    '탄소배출권', '배출권', '배출권거래', '탄소가격', '탄소세', '탄소국경', '탄소국경조정', '온실가스',
    '감축목표', 'ndc', '감축실적', '상쇄배출권', '외부감축', '국제감축', '탄소크레딧', '탄소시장',
    '탄소포집', '자발적탄소시장', '녹색분류체계', '녹색채권', '지속가능경영', '공시', 'esg경영'],
};

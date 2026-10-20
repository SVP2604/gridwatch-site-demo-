export const dynamic = 'force-dynamic';

const html = String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>그리드워치 · 개발자 전용</title>
<style>
  :root{
    --bg:#ECEFEC; --surface:#FFFFFF; --surface-2:#F4F6F4;
    --text:#16211F; --text-muted:#56635E; --text-faint:#8B9791;
    --border:#D8DFDA; --border-strong:#C1CBC4;
    --accent:#B5720F; --accent-strong:#8E590C; --accent-soft:#F1E1C4; --accent-2:#125350;
    --shadow:rgba(22,33,31,0.10);
    --font-body:'IBM Plex Sans KR','Noto Sans KR','Malgun Gothic','맑은 고딕','Apple SD Gothic Neo',sans-serif;
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
  body{ margin:0; background:var(--bg); color:var(--text); font-family:var(--font-body); font-size:15px; line-height:1.55; }
  a{ color:var(--accent-2); }
  .page{ max-width:1180px; margin:0 auto; padding:var(--sp-6) var(--sp-5) var(--sp-8); display:flex; flex-direction:column; gap:var(--sp-5); }
  .topbar{ display:flex; align-items:center; justify-content:space-between; gap:var(--sp-4); flex-wrap:wrap; padding-bottom:var(--sp-4); border-bottom:1px solid var(--border); }
  .brand{ display:flex; flex-direction:column; }
  .brand-name{ font-weight:700; font-size:1.15rem; }
  .brand-tag{ font-size:0.76rem; color:var(--text-muted); }
  .back{ font-family:var(--font-mono); font-size:0.78rem; text-decoration:none; }

  .gate{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); padding:var(--sp-8) var(--sp-6); display:flex; flex-direction:column; align-items:center; gap:var(--sp-4); box-shadow:0 1px 2px var(--shadow); }
  .gate h1{ margin:0; font-size:1.1rem; }
  .gate p{ margin:0; font-size:0.85rem; color:var(--text-faint); }
  .gate-row{ display:flex; gap:var(--sp-2); }
  .gate input{ padding:9px 12px; border-radius:var(--radius-s); border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-size:0.9rem; font-family:inherit; min-width:220px; }
  .gate input:focus-visible{ outline:2px solid var(--accent); outline-offset:1px; }
  .gate button{ background:var(--accent-2); color:var(--surface); border:none; border-radius:var(--radius-s); padding:9px 18px; font-size:0.9rem; font-weight:500; cursor:pointer; font-family:inherit; }
  .gate button:hover{ background:var(--accent-strong); }
  .gate button:disabled{ opacity:0.6; cursor:default; }
  .gate-error{ color:var(--accent-strong); font-size:0.82rem; }

  .meta-row{ display:flex; gap:var(--sp-4); flex-wrap:wrap; font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted); }
  .card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); padding:var(--sp-5); box-shadow:0 1px 2px var(--shadow); }
  .card h2{ margin:0 0 4px; font-size:1rem; }
  .card-note{ margin:0 0 var(--sp-4); font-size:0.8rem; color:var(--text-faint); }
  .table-wrap{ overflow-x:auto; }
  table{ border-collapse:collapse; width:100%; font-size:0.83rem; }
  th,td{ text-align:left; padding:8px 10px; border-bottom:1px solid var(--border); vertical-align:top; }
  th{ font-family:var(--font-mono); font-size:0.72rem; letter-spacing:0.04em; text-transform:uppercase; color:var(--text-faint); font-weight:600; white-space:nowrap; }
  td.num{ font-family:var(--font-mono); text-align:right; white-space:nowrap; }
  tr:last-child td{ border-bottom:none; }
  .cat-label{ font-weight:600; white-space:nowrap; }
  .kw{ display:inline-block; font-family:var(--font-mono); font-size:0.7rem; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:1px 7px; margin:1px 2px 1px 0; color:var(--text-muted); }
  .src{ display:inline-block; font-size:0.78rem; margin-right:8px; white-space:nowrap; }
  .src b{ font-family:var(--font-mono); color:var(--accent-2); }
  .tier{ font-family:var(--font-mono); font-size:0.7rem; padding:1px 7px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); white-space:nowrap; }
  .tier.major{ color:var(--accent-strong); border-color:var(--accent); background:var(--accent-soft); }
  .zero{ color:var(--text-faint); }
  td.bad{ color:var(--accent-strong); font-size:0.76rem; }
  .url{ font-family:var(--font-mono); font-size:0.72rem; color:var(--text-faint); word-break:break-all; }

  /* --- editing ------------------------------------------------------- */
  .kw{ cursor:pointer; }
  .kw:hover{ border-color:var(--accent); color:var(--accent-strong); }
  .kw.custom{ border-color:var(--accent-2); color:var(--accent-2); }
  .kw-add{ display:inline-flex; gap:4px; margin-top:6px; }
  .kw-add input{ width:150px; padding:3px 8px; font-size:0.74rem; border-radius:999px; border:1px dashed var(--border-strong); background:transparent; color:var(--text); font-family:var(--font-mono); }
  .kw-add button{ border:none; background:var(--accent-2); color:#fff; border-radius:999px; padding:3px 10px; font-size:0.72rem; cursor:pointer; }
  .add-row{ display:flex; flex-wrap:wrap; gap:6px; margin:0 0 var(--sp-4); }
  .add-row input, .add-row select{ padding:6px 10px; font-size:0.8rem; border-radius:var(--radius-s); border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-family:inherit; }
  .add-row input[type=url]{ flex:1; min-width:220px; }
  .add-row button{ border:none; background:var(--accent-2); color:#fff; border-radius:var(--radius-s); padding:6px 14px; font-size:0.8rem; cursor:pointer; font-family:inherit; }
  .row-del{ border:1px solid var(--border); background:var(--surface-2); color:var(--text-faint); border-radius:var(--radius-s); padding:2px 8px; font-size:0.74rem; cursor:pointer; white-space:nowrap; }
  .row-del:hover{ color:var(--accent-strong); border-color:var(--accent); }
  .toast{ position:fixed; left:50%; bottom:24px; transform:translateX(-50%); background:var(--accent-2); color:#fff; padding:9px 18px; border-radius:999px; font-size:0.83rem; box-shadow:0 4px 14px var(--shadow); z-index:20; max-width:90vw; }
  .toast.err{ background:var(--accent-strong); }
  .busy{ position:fixed; inset:0; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; gap:10px; color:#fff; font-size:0.9rem; z-index:30; }
  .spin{ width:16px; height:16px; border:2px solid rgba(255,255,255,0.4); border-top-color:#fff; border-radius:50%; animation:sp 0.8s linear infinite; }
  @keyframes sp{ to{ transform:rotate(360deg); } }
  @media (prefers-reduced-motion: reduce){ .spin{ animation:none; } }
</style>
</head>
<body>
<div class="page">
  <header class="topbar">
    <div class="brand">
      <span class="brand-name">그리드워치 · 개발자 전용</span>
      <span class="brand-tag">수집 소스 및 분류 키워드 현황</span>
    </div>
    <span>
      <a class="back" href="/demo" style="margin-right:14px">AI 기능 예시 화면 →</a>
      <a class="back" href="/">← 서비스 화면으로</a>
    </span>
  </header>

  <div class="gate" id="gate">
    <h1>비밀번호를 입력하세요</h1>
    <p>이 페이지는 관리자 전용입니다.</p>
    <form class="gate-row" id="gateForm">
      <input type="password" id="pw" placeholder="비밀번호" autocomplete="current-password">
      <button type="submit" id="pwBtn">확인</button>
    </form>
    <p class="gate-error" id="gateError" hidden></p>
  </div>

  <div id="content" hidden>
    <div class="meta-row" id="metaRow"></div>
    <div class="toast" id="toast" hidden></div>
    <div class="busy" id="busy" hidden><span class="spin"></span><span id="busyText">적용 중…</span></div>

    <div class="card" style="margin-top:16px">
      <h2>카테고리별 수집 현황</h2>
      <p class="card-note">각 카테고리가 어떤 매체에서 몇 건씩 들어오는지, 그리고 어떤 키워드로 분류되는지 보여줍니다. 제목에 키워드가 있으면 3점, 본문 앞 400자에 있으면 1점이며 3점 이상일 때만 분류됩니다.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>카테고리</th><th class="num">기사</th><th>수집 매체 (건수)</th><th>분류 키워드 (클릭하면 삭제·이동)</th></tr></thead>
          <tbody id="catBody"></tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <h2>직무별 분류 키워드</h2>
      <p class="card-note" id="jobNote"></p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>직무</th><th class="num">기사</th><th>분류 키워드 (클릭하면 삭제·이동)</th></tr></thead>
          <tbody id="jobBody"></tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <h2>전체 수집 소스</h2>
      <p class="card-note">모든 매체에서 기사를 받아온 뒤 위 키워드로 카테고리를 판정합니다. 특정 매체가 특정 카테고리에 고정되어 있지는 않습니다.</p>
      <form class="add-row" id="feedAddForm">
        <input type="text" id="feedName" placeholder="매체 이름 (예: 한국에너지신문)" maxlength="40" required>
        <input type="url" id="feedUrl" placeholder="RSS 주소 (https://…/feed/)" required>
        <select id="feedRegion">
          <option value="global">해외</option>
          <option value="domestic">국내</option>
        </select>
        <select id="feedTier">
          <option value="trade">전문지</option>
          <option value="major">메이저 일간지</option>
        </select>
        <button type="submit">＋ 매체 추가</button>
      </form>
      <div class="table-wrap">
        <table>
          <thead><tr><th>매체</th><th>구분</th><th>기본 지역</th><th class="num">보유 기사</th><th>최근 수집</th><th>피드 주소</th><th></th></tr></thead>
          <tbody id="feedBody"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<script>
(function(){
  const ESC={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>ESC[c]);

  // The password is held only in memory for the session; every write re-sends
  // it so the server never has to trust a client-side "already logged in".
  let PW='';
  let DATA=null;

  function toast(msg, isErr){
    const el=document.getElementById('toast');
    el.textContent=msg; el.className='toast'+(isErr?' err':''); el.hidden=false;
    clearTimeout(toast._t); toast._t=setTimeout(()=>{ el.hidden=true; }, isErr?6000:3500);
  }
  function busy(on, text){
    document.getElementById('busyText').textContent=text||'적용 중…';
    document.getElementById('busy').hidden=!on;
  }

  // Every mutation re-tags the stored articles server-side, so once this
  // resolves the public feed already reflects the change.
  async function mutate(payload, busyText){
    busy(true, busyText);
    try{
      const res=await fetch('/api/dev/config',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(Object.assign({password:PW}, payload)),
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'처리에 실패했습니다.');
      await reload();
      if(data.applyError) toast('저장은 됐지만 재분류에 실패했습니다: '+data.applyError, true);
      else if(data.applied && data.applied.collected!=null) toast('적용 완료 · 신규 수집 '+data.applied.collected+'건, 재분류 '+data.applied.rescored+'건');
      else if(data.applied) toast('적용 완료 · 기사 '+data.applied.rescored+'건 재분류'+(data.applied.dropped?', '+data.applied.dropped+'건 제외':''));
      else toast('적용 완료');
    }catch(ex){
      toast(ex.message, true);
    }finally{
      busy(false);
    }
  }

  async function reload(){
    const res=await fetch('/api/dev/sources',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({password:PW}),
    });
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'불러오지 못했습니다.');
    render(data);
  }

  // Clicking a keyword chip offers the two destructive-ish operations in one
  // prompt, so the table itself stays a plain read-only-looking list.
  function onKeywordClick(kind, code, kw){
    const groups=(kind==='category'?DATA.categories:DATA.jobs).filter(g=>g.code!==code);
    const menu=groups.map((g,i)=>(i+1)+'. '+g.label).join('\n');
    const answer=prompt(
      '"'+kw+'" 키워드\n\n'+
      '· 삭제하려면 0 입력\n'+
      '· 다른 항목으로 옮기려면 번호 입력\n\n'+menu,
      '');
    if(answer===null || answer.trim()==='') return;
    const n=Number(answer.trim());
    if(!Number.isInteger(n) || n<0 || n>groups.length){ toast('0 또는 목록의 번호를 입력해주세요.', true); return; }
    if(n===0){
      mutate({action:'remove_keyword', kind, code, keyword:kw}, '"'+kw+'" 삭제 후 재분류 중…');
    }else{
      const to=groups[n-1];
      mutate({action:'move_keyword', kind, fromCode:code, toCode:to.code, keyword:kw}, '"'+kw+'" → '+to.label+' 이동 중…');
    }
  }

  function chipsHTML(kind, code, keywords){
    return keywords.map(k=>
      '<span class="kw'+(k.custom?' custom':'')+'" data-kind="'+kind+'" data-code="'+esc(code)+'" data-kw="'+esc(k.kw)+'"'+
      ' title="'+(k.custom?'직접 추가한 키워드':'기본 키워드')+' · 클릭하면 삭제/이동">'+esc(k.kw)+'</span>'
    ).join('')+
    '<form class="kw-add" data-kind="'+kind+'" data-code="'+esc(code)+'">'+
      '<input type="text" placeholder="키워드 추가" maxlength="40" required>'+
      '<button type="submit">＋</button>'+
    '</form>';
  }

  function render(data){
    DATA=data;
    document.getElementById('metaRow').innerHTML =
      '<span>보유 기사 '+data.totalArticles+'건</span>'+
      '<span>수집 소스 '+data.feeds.length+'곳</span>'+
      '<span>마지막 수집 '+esc(data.lastCollectedAt ? new Date(data.lastCollectedAt).toLocaleString('ko-KR') : '-')+'</span>';

    document.getElementById('catBody').innerHTML = data.categories.map(c=>
      '<tr>'+
        '<td class="cat-label">'+esc(c.label)+'</td>'+
        '<td class="num'+(c.total?'':' zero')+'">'+c.total+'</td>'+
        '<td>'+(c.sources.length
          ? c.sources.map(s=>'<span class="src">'+esc(s.name)+' <b>'+s.n+'</b></span>').join('')
          : '<span class="zero">수집된 기사 없음</span>')+'</td>'+
        '<td>'+chipsHTML('category', c.code, c.keywords)+'</td>'+
      '</tr>'
    ).join('');

    document.getElementById('jobNote').textContent =
      '카테고리와 같은 방식(제목 3점 / 리드 1점, 3점 이상)으로 판정하며, 개수 제한 없이 조건을 넘긴 직무를 모두 붙입니다. '+
      '어떤 키워드에도 안 걸리면 정보 유형으로 되돌려 배정합니다(거래→투자/개발, 정책→대외협력, 리포트→영업). '+
      '현재 직무 미분류 '+data.untaggedJobs+'건. 한 기사에 여러 직무가 붙을 수 있어 합계는 보유 기사 수와 다릅니다.';

    document.getElementById('jobBody').innerHTML = data.jobs.map(j=>
      '<tr>'+
        '<td class="cat-label">'+esc(j.label)+'</td>'+
        '<td class="num'+(j.total?'':' zero')+'">'+j.total+'</td>'+
        '<td>'+chipsHTML('job', j.code, j.keywords)+'</td>'+
      '</tr>'
    ).join('');

    document.getElementById('feedBody').innerHTML = data.feeds.map(f=>
      '<tr>'+
        '<td class="cat-label">'+esc(f.source)+'</td>'+
        '<td><span class="tier'+(f.tier==='메이저 일간지'?' major':'')+'">'+esc(f.tier)+'</span></td>'+
        '<td>'+esc(f.region)+'</td>'+
        '<td class="num'+(f.count?'':' zero')+'">'+f.count+'</td>'+
        '<td class="'+(f.ok===false?'bad':'')+'">'+esc(f.status)+'</td>'+
        '<td class="url">'+esc(f.url)+'</td>'+
        '<td><button type="button" class="row-del" data-url="'+esc(f.url)+'" data-name="'+esc(f.source)+'">삭제</button></td>'+
      '</tr>'
    ).join('');

    // Rebuilt on every render, so bind here rather than once at startup.
    document.querySelectorAll('.kw').forEach(el=>{
      el.addEventListener('click', ()=> onKeywordClick(el.dataset.kind, el.dataset.code, el.dataset.kw));
    });
    document.querySelectorAll('.kw-add').forEach(form=>{
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const input=form.querySelector('input');
        const kw=input.value.trim();
        if(!kw) return;
        mutate({action:'add_keyword', kind:form.dataset.kind, code:form.dataset.code, keyword:kw}, '"'+kw+'" 추가 후 재분류 중…');
      });
    });
    document.querySelectorAll('.row-del').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if(!confirm('"'+btn.dataset.name+'" 매체를 수집 목록에서 제거할까요?\n\n이미 수집된 기사는 남아 있고, 앞으로 새 기사를 받아오지 않습니다.')) return;
        mutate({action:'remove_feed', url:btn.dataset.url}, '매체 제거 중…');
      });
    });

    document.getElementById('gate').hidden = true;
    document.getElementById('content').hidden = false;
  }

  document.getElementById('feedAddForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const feed={
      source: document.getElementById('feedName').value.trim(),
      url: document.getElementById('feedUrl').value.trim(),
      defaultRegion: document.getElementById('feedRegion').value,
      tier: document.getElementById('feedTier').value,
    };
    if(!feed.source || !feed.url) return;
    document.getElementById('feedName').value='';
    document.getElementById('feedUrl').value='';
    mutate({action:'add_feed', feed}, '"'+feed.source+'" 추가 후 수집·재분류 중… (최대 1분)');
  });

  document.getElementById('gateForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const btn=document.getElementById('pwBtn'), err=document.getElementById('gateError');
    const password=document.getElementById('pw').value;
    if(!password) return;
    btn.disabled=true; btn.textContent='확인 중…'; err.hidden=true;
    try{
      const res=await fetch('/api/dev/sources',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({password}),
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'확인에 실패했습니다.');
      PW=password;
      render(data);
    }catch(ex){
      err.textContent=ex.message; err.hidden=false;
      btn.disabled=false; btn.textContent='확인';
    }
  });
})();
</script>
</body>
</html>`;

export async function GET() {
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

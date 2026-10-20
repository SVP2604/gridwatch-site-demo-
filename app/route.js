export const dynamic = 'force-dynamic';

const html = String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>그리드워치</title>
<meta name="description" content="에너지 신사업 담당자를 위한 마켓 인텔리전스">
<meta name="color-scheme" content="light dark">
<!-- Inlined so the browser never fires a separate favicon request; a 404 on
     /favicon.ico is what makes some corporate proxies log the page as failed. -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23125350'/%3E%3Cpath d='M18 5 L9 18 h6 l-2 9 9-13 h-6 z' fill='%23E2A648'/%3E%3C/svg%3E">
<!-- Loaded non-blocking: corporate firewalls often block or stall
     fonts.googleapis.com, and a render-blocking <link> there leaves the whole
     page blank until the request times out. The page paints immediately with
     the local fallback stack below and upgrades if the webfont arrives. -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" media="print" onload="this.media='all'">
<style>
  :root{
    --bg:#ECEFEC;
    --surface:#FFFFFF;
    --surface-2:#F4F6F4;
    --text:#16211F;
    --text-muted:#56635E;
    --text-faint:#8B9791;
    --border:#D8DFDA;
    --border-strong:#C1CBC4;
    --accent:#B5720F;
    --accent-strong:#8E590C;
    --accent-soft:#F1E1C4;
    --accent-2:#125350;
    --shadow:rgba(22,33,31,0.10);

    --cat-solar:#C2861A;
    --cat-wind:#2F7F8C;
    --cat-biogas:#6B7F2E;
    --cat-hydrogen:#1C7C86;
    --cat-nuclear:#6A4A97;
    --cat-ess:#AD650E;
    --cat-lng:#2A548F;
    --cat-renewable:#3C7A34;

    /* Fallbacks include the fonts that ship with Korean Windows/macOS, so the
       page still looks right when the webfont host is unreachable. */
    --font-display:'Gowun Batang','Noto Serif KR','Nanum Myeongjo','Batang','바탕',serif;
    --font-body:'IBM Plex Sans KR','Noto Sans KR','Malgun Gothic','맑은 고딕','Apple SD Gothic Neo',sans-serif;
    --font-mono:'IBM Plex Mono','SFMono-Regular',Consolas,'D2Coding',monospace;

    --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-7:32px; --sp-8:40px;
    --radius-s:4px; --radius-m:8px;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --bg:#0E1512; --surface:#161F1B; --surface-2:#1B2621;
      --text:#E7EDE8; --text-muted:#9CA8A1; --text-faint:#697A72;
      --border:#28352F; --border-strong:#37473F;
      --accent:#E2A648; --accent-strong:#F2BC6C; --accent-soft:#3A2C15; --accent-2:#4FC2B8;
      --shadow:rgba(0,0,0,0.45);
      --cat-solar:#E8B75C; --cat-wind:#5FC4D4; --cat-biogas:#A8C65E;
      --cat-hydrogen:#4FD0DB; --cat-nuclear:#B296E0; --cat-ess:#E8A857;
      --cat-lng:#7BAAEE; --cat-renewable:#6FBF5C;
    }
  }
  :root[data-theme="dark"]{
    --bg:#0E1512; --surface:#161F1B; --surface-2:#1B2621;
    --text:#E7EDE8; --text-muted:#9CA8A1; --text-faint:#697A72;
    --border:#28352F; --border-strong:#37473F;
    --accent:#E2A648; --accent-strong:#F2BC6C; --accent-soft:#3A2C15; --accent-2:#4FC2B8;
    --shadow:rgba(0,0,0,0.45);
    --cat-solar:#E8B75C; --cat-wind:#5FC4D4; --cat-biogas:#A8C65E;
    --cat-hydrogen:#4FD0DB; --cat-nuclear:#B296E0; --cat-ess:#E8A857;
    --cat-lng:#7BAAEE; --cat-renewable:#6FBF5C;
  }
  *{box-sizing:border-box;}
  [hidden]{ display:none !important; }
  body{ margin:0; background:var(--bg); color:var(--text); font-family:var(--font-body); font-size:15px; line-height:1.55; }
  h1,h2,h3{margin:0; text-wrap:balance;}
  button{font-family:inherit;} input{font-family:inherit;}
  a{color:inherit;}
  @media (prefers-reduced-motion: reduce){ *{transition:none !important; animation:none !important;} }

  .page{ max-width:1180px; margin:0 auto; padding:var(--sp-6) var(--sp-5) var(--sp-8); display:flex; flex-direction:column; gap:var(--sp-6); }

  .topbar{ display:flex; align-items:center; justify-content:space-between; gap:var(--sp-4); flex-wrap:wrap; padding-bottom:var(--sp-4); border-bottom:1px solid var(--border); }
  .brand{display:flex; align-items:center; gap:var(--sp-3);}
  .brand-mark{ width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:var(--accent-2); color:var(--surface); border-radius:var(--radius-m); font-size:18px; flex:none; }
  .brand-text{display:flex; flex-direction:column; line-height:1.25;}
  .brand-name{font-family:var(--font-body); font-weight:700; font-size:1.15rem; letter-spacing:0.01em;}
  .brand-tag{font-size:0.74rem; color:var(--text-muted);}
  .topbar-meta{display:flex; align-items:center; gap:var(--sp-4); font-family:var(--font-mono); font-size:0.78rem; color:var(--text-muted);}
  .hard-fail{ margin:0 0 var(--sp-4); padding:12px 16px; border-radius:var(--radius-s); border:1px solid var(--accent); background:var(--accent-soft); color:var(--accent-strong); font-size:0.86rem; line-height:1.5; }
  .hard-fail b{ display:block; margin-bottom:2px; }
  .hard-fail button{ margin-top:8px; background:var(--accent-2); color:#fff; border:none; border-radius:var(--radius-s); padding:6px 14px; font-size:0.82rem; cursor:pointer; font-family:inherit; }
  noscript .hard-fail{ margin:var(--sp-5) auto; max-width:1180px; }
  .dev-link{display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:var(--radius-s); border:1px solid var(--border); background:var(--surface-2); color:var(--text-faint); text-decoration:none;}
  .dev-link:hover{color:var(--accent-2); border-color:var(--border-strong);}
  .dev-link:focus-visible{outline:2px solid var(--accent); outline-offset:1px;}
  .meta-refresh{display:flex; align-items:center; gap:var(--sp-2);}
  .dot{width:6px; height:6px; border-radius:50%; background:var(--accent-2); display:inline-block;}

  .briefing{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); padding:var(--sp-6); box-shadow:0 1px 2px var(--shadow); }
  .briefing-head-row{ display:flex; align-items:center; justify-content:space-between; gap:var(--sp-3); flex-wrap:wrap; }
  .eyebrow{ font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent-2); margin:0 0 var(--sp-1); }
  .page-badge{ font-family:var(--font-mono); font-size:0.66rem; letter-spacing:0.03em; color:var(--accent-2); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 10px; }
  .briefing-date{ font-family:var(--font-display); font-weight:700; font-size:1.4rem; color:var(--text); }
  .briefing-groups{ display:grid; grid-template-columns:repeat(auto-fit, minmax(230px,1fr)); gap:var(--sp-5); margin-top:var(--sp-5); }
  .briefing-group-label{ font-family:var(--font-mono); font-size:0.72rem; letter-spacing:0.06em; color:var(--accent-strong); display:block; margin-bottom:var(--sp-2); }
  .briefing-group-text{ font-family:var(--font-display); font-size:1rem; line-height:1.6; color:var(--text); margin:0; }
  .briefing-group-text a{ color:var(--text); text-decoration:none; border-bottom:1px solid var(--border-strong); }
  .briefing-group-text a:hover{ border-color:var(--accent); color:var(--accent-strong); }
  .briefing-group-meta{ font-family:var(--font-mono); font-size:0.72rem; color:var(--text-faint); margin-top:6px; }
  .briefing-note{ margin-top:var(--sp-5); padding-top:var(--sp-4); border-top:1px dashed var(--border); font-size:0.78rem; color:var(--text-faint); }

  .dashboard{ display:grid; grid-template-columns:250px 1fr; gap:var(--sp-6); align-items:start; }
  @media (max-width:860px){ .dashboard{grid-template-columns:1fr;} }

  .filters{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); padding:var(--sp-5); display:flex; flex-direction:column; gap:var(--sp-5); position:sticky; top:var(--sp-5); }
  @media (max-width:860px){ .filters{position:static;} }
  .filter-title{ font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-faint); margin-bottom:var(--sp-2); font-weight:600; }
  .keyword-input{ width:100%; padding:8px 10px; border-radius:var(--radius-s); border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-size:0.86rem; }
  .keyword-input:focus-visible{outline:2px solid var(--accent); outline-offset:1px;}
  .chip-group{display:flex; flex-wrap:wrap; gap:var(--sp-2);}
  .chip{ display:inline-flex; align-items:center; gap:6px; padding:5px 11px; border-radius:999px; border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text-muted); font-size:0.8rem; cursor:pointer; line-height:1.4; }
  .chip:hover{border-color:var(--accent-2);}
  .chip:focus-visible{outline:2px solid var(--accent); outline-offset:1px;}
  .chip.active{ background:var(--accent-soft); border-color:var(--accent); color:var(--accent-strong); font-weight:500; }
  .chip-dot{width:8px; height:8px; border-radius:50%; flex:none;}
  .filter-note{font-size:0.74rem; color:var(--text-faint); margin:0;}
  .btn-reset{ align-self:flex-start; background:none; border:1px solid var(--border-strong); color:var(--text-muted); border-radius:var(--radius-s); padding:6px 12px; font-size:0.8rem; cursor:pointer; }
  .btn-reset:hover{border-color:var(--accent-2); color:var(--accent-2);}

  .profiles{padding-top:var(--sp-4); border-top:1px solid var(--border);}
  .profile-list{display:flex; flex-direction:column; gap:var(--sp-2); margin-bottom:var(--sp-3);}
  .profile-empty{font-size:0.78rem; color:var(--text-faint);}
  .profile-row{ display:flex; align-items:center; justify-content:space-between; gap:var(--sp-2); background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-s); padding:6px 8px; }
  .profile-name{ font-size:0.82rem; background:none; border:none; color:var(--text); cursor:pointer; text-align:left; flex:1; padding:0; }
  .profile-name:hover{color:var(--accent-2);}
  .profile-del{background:none; border:none; color:var(--text-faint); cursor:pointer; font-size:0.85rem; padding:0 2px;}
  .profile-del:hover{color:var(--accent-strong);}
  .save-row{display:flex; gap:var(--sp-2);}
  .profile-name-input{ flex:1; min-width:0; padding:6px 8px; border-radius:var(--radius-s); border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-size:0.8rem; }
  .btn-save-profile{ background:var(--accent-2); color:var(--surface); border:none; border-radius:var(--radius-s); padding:6px 12px; font-size:0.8rem; cursor:pointer; white-space:nowrap; }
  .btn-save-profile:hover{background:var(--accent-strong);}

  .feed{display:flex; flex-direction:column; gap:var(--sp-4); min-width:0;}
  .view-tabs{ display:flex; gap:var(--sp-5); border-bottom:1px solid var(--border); }
  .view-tab{ background:none; border:none; padding:8px 1px 12px; font-size:0.92rem; font-weight:600; color:var(--text-muted); cursor:pointer; position:relative; display:flex; align-items:center; gap:7px; }
  .view-tab:hover{color:var(--text);}
  .view-tab:focus-visible{outline:2px solid var(--accent); outline-offset:2px;}
  .view-tab.active{color:var(--text);}
  .view-tab.active::after{ content:''; position:absolute; left:0; right:0; bottom:-1px; height:2px; background:var(--accent); border-radius:2px; }
  .view-tab-note{ font-family:var(--font-mono); font-size:0.62rem; letter-spacing:0.04em; text-transform:uppercase; color:var(--accent-2); background:var(--accent-soft); padding:2px 7px; border-radius:999px; }
  .empty-state.hint{color:var(--text-muted);}
  .feed-toolbar{ display:flex; align-items:center; flex-wrap:wrap; gap:var(--sp-4); }
  .result-count{font-family:var(--font-mono); font-size:0.85rem; color:var(--text-muted);}
  .result-count b{color:var(--text); font-weight:600;}
  .toolbar-actions{display:flex; align-items:center; gap:var(--sp-3); flex-wrap:wrap; margin-left:auto;}
  .toggle-btn{ background:var(--surface); border:1px solid var(--border-strong); color:var(--text-muted); border-radius:999px; padding:6px 12px; font-size:0.8rem; cursor:pointer; }
  .toggle-btn[aria-pressed="true"]{ background:var(--accent-soft); border-color:var(--accent); color:var(--accent-strong); }
  .origin-toggle{display:flex; border:1px solid var(--border-strong); border-radius:999px; overflow:hidden; flex:none;}
  .origin-btn{ background:var(--surface); border:none; color:var(--text-muted); padding:6px 14px; font-size:0.82rem; cursor:pointer; }
  .origin-btn + .origin-btn{border-left:1px solid var(--border-strong);}
  .origin-btn.active{background:var(--accent-2); color:var(--surface);}
  .sort-group{display:flex; border:1px solid var(--border-strong); border-radius:999px; overflow:hidden;}
  .sort-btn{ background:var(--surface); border:none; color:var(--text-muted); padding:6px 13px; font-size:0.8rem; cursor:pointer; }
  .sort-btn + .sort-btn{border-left:1px solid var(--border-strong);}
  .sort-btn.active{background:var(--accent-2); color:var(--surface);}

  .card-grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:var(--sp-4); }
  .card{ display:flex; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); overflow:hidden; box-shadow:0 1px 2px var(--shadow); }
  .card:hover{border-color:var(--border-strong);}
  .card-spine{width:5px; flex:none; background:var(--cat-color, var(--accent-2));}
  .card-body{padding:var(--sp-4); display:flex; flex-direction:column; gap:var(--sp-2); min-width:0; flex:1;}
  .card-top{display:flex; align-items:center; gap:var(--sp-2);}
  .type-badge{ font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.04em; color:var(--text-muted); background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-s); padding:2px 7px; }
  .signal{display:inline-flex; align-items:flex-end; gap:2px; height:11px;}
  .signal i{display:block; width:3px; background:var(--border-strong); border-radius:1px;}
  .signal i:nth-child(1){height:5px;} .signal i:nth-child(2){height:8px;} .signal i:nth-child(3){height:11px;}
  .signal i.filled{background:var(--accent);}
  .bookmark-btn{ margin-left:auto; background:none; border:none; color:var(--text-faint); font-size:1.05rem; cursor:pointer; line-height:1; padding:0; }
  .bookmark-btn[aria-pressed="true"]{color:var(--accent);}
  .card-title{font-size:1.02rem; font-weight:600; color:var(--text);}
  .card-summary{font-size:0.87rem; color:var(--text-muted); margin:0;}
  .card-tags{display:flex; flex-wrap:wrap; gap:6px;}
  .tag{font-size:0.74rem; color:var(--accent-2);}
  .card-meta{ display:flex; align-items:center; flex-wrap:wrap; gap:6px; font-size:0.76rem; color:var(--text-faint); margin-top:auto; padding-top:var(--sp-2); border-top:1px solid var(--border); font-family:var(--font-mono); }
  .meta-region{ background:var(--surface-2); border-radius:var(--radius-s); padding:1px 6px; }
  .source-link{ margin-left:auto; background:none; border:none; color:var(--accent-2); font-family:var(--font-mono); font-size:0.76rem; cursor:pointer; padding:0; }
  .source-link:hover{color:var(--accent-strong);}

  .empty-state{ text-align:center; color:var(--text-faint); padding:var(--sp-8) 0; font-size:0.9rem; }
  .ai-insight-list{ display:flex; flex-direction:column; gap:var(--sp-4); }
  .ai-insight-card{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); padding:var(--sp-4); display:flex; flex-direction:column; gap:6px; box-shadow:0 1px 2px var(--shadow); }
  .ai-insight-head{ display:flex; align-items:center; gap:var(--sp-2); }
  .ai-insight-title{ font-size:1.02rem; font-weight:600; color:var(--text); margin:0; }
  .ai-insight-title a{ color:inherit; text-decoration:none; }
  .ai-insight-title a:hover{ color:var(--accent-strong); }
  .ai-insight-meta{ font-family:var(--font-mono); font-size:0.76rem; color:var(--text-faint); margin:0 0 4px; }
  .ai-implication{ color:var(--accent-2); }
  .usage-badge{ font-family:var(--font-mono); font-size:0.7rem; color:var(--accent-2); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 9px; white-space:nowrap; }
  .usage-badge.low{ color:var(--accent-strong); border-color:var(--accent); background:var(--accent-soft); }
  .chat-usage{ margin-left:auto; margin-right:var(--sp-2); background:rgba(255,255,255,0.15); border-color:rgba(255,255,255,0.3); color:var(--surface); }
  .ai-related{ margin:2px 0 0; padding-left:1.1em; display:flex; flex-direction:column; gap:2px; }
  .ai-related li{ font-size:0.8rem; color:var(--text-muted); }
  .ai-related a{ color:var(--accent-2); text-decoration:none; }
  .ai-related a:hover{ color:var(--accent-strong); }
  .ai-progress{ background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-s); padding:var(--sp-3) var(--sp-4); display:flex; flex-direction:column; gap:var(--sp-2); }
  .ai-progress-steps{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; font-family:var(--font-mono); font-size:0.72rem; }
  .ai-progress-step{ color:var(--text-faint); }
  .ai-progress-step.active{ color:var(--accent-strong); font-weight:600; }
  .ai-progress-step.done{ color:var(--accent-2); }
  .ai-progress-arrow{ color:var(--text-faint); }
  .ai-progress-bar{ height:4px; background:var(--border); border-radius:999px; overflow:hidden; }
  .ai-progress-fill{ height:100%; background:var(--accent); transition:width 0.3s ease; }
  .ai-progress-note{ margin:0; font-size:0.76rem; color:var(--text-faint); }
  .ai-generate-prompt{ display:flex; flex-direction:column; align-items:center; gap:var(--sp-3); padding:var(--sp-8) 0; text-align:center; }
  .ai-generate-text{ color:var(--text-faint); font-size:0.9rem; margin:0; max-width:420px; }
  .ai-regenerate-btn{ align-self:flex-start; background:none; border:1px solid var(--border-strong); color:var(--text-muted); border-radius:999px; padding:6px 14px; font-size:0.8rem; cursor:pointer; margin-bottom:var(--sp-2); }
  .ai-regenerate-btn:hover{ border-color:var(--accent-2); color:var(--accent-2); }
  .page-footer{ text-align:center; font-size:0.76rem; color:var(--text-faint); padding-top:var(--sp-3); }

  .toast{ position:fixed; left:50%; bottom:28px; transform:translateX(-50%) translateY(12px); background:var(--text); color:var(--bg); padding:9px 16px; border-radius:999px; font-size:0.82rem; opacity:0; pointer-events:none; transition:opacity 0.2s ease, transform 0.2s ease; z-index:10; }
  .toast.show{opacity:1; transform:translateX(-50%) translateY(0);}

  .modal-overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; padding:var(--sp-5); z-index:20; }
  .modal-overlay[hidden]{display:none;}
  .modal{ position:relative; background:var(--surface); border-radius:var(--radius-m); width:100%; max-width:560px; max-height:85vh; overflow-y:auto; padding:var(--sp-6); box-shadow:0 8px 24px var(--shadow); display:flex; flex-direction:column; gap:var(--sp-3); }
  .modal-close{ position:absolute; top:var(--sp-4); right:var(--sp-4); background:none; border:none; color:var(--text-faint); font-size:1.3rem; line-height:1; cursor:pointer; }
  .modal-close:hover{color:var(--text);}
  .modal-top{display:flex; align-items:center; gap:var(--sp-2); padding-right:var(--sp-6);}
  .modal-meta{font-family:var(--font-mono); font-size:0.78rem; color:var(--text-faint);}
  .modal-bookmark{ margin-left:auto; background:none; border:none; color:var(--text-faint); font-size:1.2rem; cursor:pointer; line-height:1; }
  .modal-bookmark[aria-pressed="true"]{color:var(--accent);}
  .modal-title{font-size:1.2rem; font-weight:600; color:var(--text); padding-right:var(--sp-6);}
  .modal-body{font-size:0.92rem; line-height:1.7; color:var(--text); margin:0;}
  .modal-source-link{ display:inline-flex; align-items:center; gap:6px; align-self:flex-start; background:var(--accent-2); color:var(--surface); text-decoration:none; padding:8px 14px; border-radius:999px; font-size:0.84rem; font-weight:500; }
  .modal-source-link:hover{background:var(--accent-strong);}
  .modal-disclaimer{ font-size:0.74rem; color:var(--text-faint); border-top:1px solid var(--border); padding-top:var(--sp-3); margin:0; }
  .ai-block{ display:flex; flex-direction:column; gap:var(--sp-2); }
  .ai-btn{ align-self:flex-start; background:var(--accent-soft); border:1px solid var(--accent); color:var(--accent-strong); border-radius:999px; padding:7px 14px; font-size:0.82rem; font-weight:500; cursor:pointer; }
  .ai-btn:hover{ background:var(--accent); color:var(--surface); }
  .ai-btn:disabled{ opacity:0.6; cursor:default; }
  .ai-result{ background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius-s); padding:var(--sp-3); display:flex; flex-direction:column; gap:4px; }
  .ai-result-label{ font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.05em; text-transform:uppercase; color:var(--accent-2); margin:0; }
  .ai-result-label:not(:first-child){ margin-top:8px; }
  .ai-result-text{ font-size:0.87rem; line-height:1.6; color:var(--text); margin:0; }

  .chat-widget{ position:fixed; right:var(--sp-5); bottom:var(--sp-5); z-index:15; display:flex; flex-direction:column; align-items:flex-end; gap:var(--sp-3); }
  .chat-fab{ background:var(--accent-2); color:var(--surface); border:none; border-radius:999px; padding:12px 20px; font-size:0.9rem; font-weight:600; cursor:pointer; box-shadow:0 4px 14px var(--shadow); }
  .chat-fab:hover{ background:var(--accent-strong); }
  .chat-panel{ width:340px; max-width:calc(100vw - 40px); height:460px; max-height:70vh; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-m); box-shadow:0 10px 30px var(--shadow); display:flex; flex-direction:column; overflow:hidden; }
  .chat-panel[hidden]{display:none;}
  .chat-panel-header{ display:flex; align-items:center; justify-content:space-between; padding:var(--sp-3) var(--sp-4); background:var(--accent-2); color:var(--surface); font-weight:600; font-size:0.9rem; flex:none; }
  .chat-close{ background:none; border:none; color:var(--surface); font-size:1.2rem; cursor:pointer; line-height:1; }
  .chat-messages{ flex:1; overflow-y:auto; padding:var(--sp-4); display:flex; flex-direction:column; gap:var(--sp-3); }
  .chat-msg{ font-size:0.86rem; line-height:1.7; padding:10px 13px; border-radius:var(--radius-s); max-width:85%; white-space:pre-wrap; }
  .chat-msg-bot{ max-width:95%; }
  .chat-msg-bot{ background:var(--surface-2); color:var(--text); align-self:flex-start; }
  .chat-msg-user{ background:var(--accent-2); color:var(--surface); align-self:flex-end; }
  .chat-msg-loading{ color:var(--text-faint); font-style:italic; }
  .chat-input-row{ display:flex; gap:var(--sp-2); padding:var(--sp-3); border-top:1px solid var(--border); flex:none; }
  .chat-input{ flex:1; min-width:0; padding:8px 10px; border-radius:var(--radius-s); border:1px solid var(--border-strong); background:var(--surface-2); color:var(--text); font-size:0.86rem; }
  .chat-input:focus-visible{ outline:2px solid var(--accent); outline-offset:1px; }
  .chat-send{ background:var(--accent-2); color:var(--surface); border:none; border-radius:var(--radius-s); padding:8px 14px; font-size:0.86rem; font-weight:500; cursor:pointer; flex:none; }
  .chat-send:hover{ background:var(--accent-strong); }
  .chat-send:disabled{ opacity:0.6; cursor:default; }
</style>
</head>
<body>
<noscript>
  <div class="hard-fail">
    <b>이 페이지를 표시하려면 자바스크립트가 필요합니다.</b>
    브라우저 또는 회사 보안정책에서 자바스크립트가 차단되어 있습니다. 관리자에게 이 사이트의 허용을 요청해주세요.
  </div>
</noscript>
<div class="page">

  <!-- Shown when /api/* can't be reached at all. Without it a blocked network
       just renders an empty feed, which reads as "the site is broken". -->
  <div class="hard-fail" id="netError" hidden>
    <b>기사 데이터를 불러오지 못했습니다.</b>
    <span id="netErrorDetail"></span>
    <button type="button" id="netRetry">다시 시도</button>
  </div>

  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">⚡</span>
      <div class="brand-text">
        <span class="brand-name">그리드워치</span>
        <span class="brand-tag">에너지 신사업 담당자를 위한 마켓 인텔리전스</span>
      </div>
    </div>
    <div class="topbar-meta">
      <span id="todayLabel"></span>
      <span class="meta-refresh"><span class="dot"></span><span id="refreshLabel">불러오는 중…</span></span>
      <a class="dev-link" href="/dev" title="개발자 전용 (비밀번호 필요)" aria-label="개발자 전용 페이지">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 17l-5-5 5-5"/><path d="M16 7l5 5-5 5"/></svg>
      </a>
    </div>
  </header>

  <section class="briefing" aria-label="카테고리별 최신 소식">
    <div class="briefing-head-row">
      <p class="eyebrow">Latest by Category</p>
      <span class="page-badge">실시간 RSS 수집</span>
    </div>
    <h1 class="briefing-date">카테고리별 최신 소식</h1>
    <div class="briefing-groups" id="latestByCategory"></div>
    <p class="briefing-note">각 카테고리의 가장 최근 기사를 그대로 보여주는 영역입니다. Gemini 기반 심층 요약·시사점은 아래 "AI 에너지전문가의 시사점" 탭에서 확인하세요.</p>
  </section>

  <div class="dashboard">
    <aside class="filters" aria-label="필터">
      <div class="filter-block">
        <h2 class="filter-title">키워드 검색</h2>
        <input type="search" id="keywordInput" class="keyword-input" placeholder="기술명·기업명·프로젝트명">
      </div>
      <div class="filter-block">
        <h2 class="filter-title">산업·기술</h2>
        <div class="chip-group" id="categoryChips" data-group="category"></div>
      </div>
      <div class="filter-block">
        <h2 class="filter-title">지역</h2>
        <div class="chip-group" id="regionChips" data-group="region"></div>
      </div>
      <div class="filter-block">
        <h2 class="filter-title">직무</h2>
        <div class="chip-group" id="jobChips" data-group="job"></div>
      </div>
      <div class="filter-block">
        <h2 class="filter-title">정보 유형</h2>
        <div class="chip-group" id="typeChips" data-group="type"></div>
      </div>
      <p class="filter-note">같은 항목끼리는 OR · 다른 항목 간에는 AND로 결합됩니다.</p>
      <button class="btn-reset" id="resetFilters" type="button">필터 초기화</button>

      <div class="filter-block profiles">
        <h2 class="filter-title">저장한 필터 프로필</h2>
        <div class="profile-list" id="profileList"></div>
        <div class="save-row">
          <input type="text" id="profileNameInput" class="profile-name-input" placeholder="프로필 이름" maxlength="20">
          <button class="btn-save-profile" id="saveProfile" type="button">저장</button>
        </div>
      </div>
    </aside>

    <main class="feed">
      <div class="view-tabs" role="tablist" aria-label="피드 보기 전환">
        <button type="button" class="view-tab active" id="tabAll" data-tab="all" role="tab" aria-selected="true">전체 피드</button>
        <button type="button" class="view-tab" id="tabPersonalized" data-tab="personalized" role="tab" aria-selected="false">맞춤 피드<span class="view-tab-note">맞춤 필터</span></button>
        <button type="button" class="view-tab" id="tabAiInsight" data-tab="ai" role="tab" aria-selected="false">AI 에너지전문가의 시사점<span class="view-tab-note">Gemini</span></button>
      </div>
      <div class="feed-toolbar">
        <div class="origin-toggle" role="group" aria-label="국내·해외 구분">
          <button type="button" class="origin-btn active" data-origin="all">전체</button>
          <button type="button" class="origin-btn" data-origin="domestic">국내</button>
          <button type="button" class="origin-btn" data-origin="overseas">해외</button>
        </div>
        <div class="result-count" id="resultCount">불러오는 중…</div>
        <div class="toolbar-actions">
          <button class="toggle-btn" id="bookmarkToggle" type="button" aria-pressed="false">★ 북마크만 <span id="bookmarkCount"></span></button>
          <div class="sort-group" role="group" aria-label="정렬 기준">
            <button class="sort-btn active" data-sort="time" type="button">시간순</button>
            <button class="sort-btn" data-sort="importance" type="button">중요도순</button>
          </div>
        </div>
      </div>
      <div class="card-grid" id="cardGrid"></div>
      <p class="empty-state" id="emptyState" hidden>조건에 맞는 정보가 없습니다. 필터를 조정해보세요.</p>
      <p class="empty-state hint" id="personalizedHint" hidden>왼쪽에서 키워드·산업·지역·직무·정보유형을 선택하면 그 기준으로 맞춤 피드가 만들어집니다.</p>
      <div class="ai-insight-list" id="aiInsightList" hidden></div>
      <p class="empty-state hint" id="aiInsightHint" hidden>왼쪽에서 키워드·산업·지역·직무·정보유형을 선택하면, 그 조건에 맞는 핵심 기사를 AI가 요약하고 시사점을 제시합니다.</p>
      <div class="ai-generate-prompt" id="aiGeneratePrompt" hidden>
        <p class="ai-generate-text">현재 필터 조건에 맞는 핵심 기사 상위 5건을 AI가 한 번의 요청으로 분석합니다.</p>
        <button class="ai-btn" id="aiGenerateBtn" type="button">✦ 핵심 기사 분석 생성하기</button>
        <span class="usage-badge">AI 잔여 –</span>
      </div>
    </main>
  </div>

  <footer class="page-footer">
    <p>기사 제목·요약은 각 언론사의 RSS 피드에서 그대로 가져옵니다. 전체 본문은 "원문 보기"에서 확인하세요.</p>
  </footer>
</div>

<div class="toast" id="toast"></div>

<div class="modal-overlay" id="articleModal" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <button class="modal-close" id="modalClose" type="button" aria-label="닫기">×</button>
    <div class="modal-top">
      <span class="type-badge" id="modalType"></span>
      <span class="modal-meta" id="modalMeta"></span>
      <button class="modal-bookmark" id="modalBookmark" type="button" aria-label="북마크 토글">☆</button>
    </div>
    <h2 class="modal-title" id="modalTitle"></h2>
    <p class="modal-body" id="modalBody"></p>
    <div class="ai-block">
      <button class="ai-btn" id="aiSummarizeBtn" type="button">✦ AI 요약·시사점 보기</button>
      <div class="ai-result" id="aiResult" hidden>
        <p class="ai-result-label">AI 핵심 요약</p>
        <p class="ai-result-text" id="aiSummaryText"></p>
        <p class="ai-result-label">시사점</p>
        <p class="ai-result-text" id="aiImplicationsText"></p>
      </div>
    </div>
    <a class="modal-source-link" id="modalLink" href="#" target="_blank" rel="noopener noreferrer">원문에서 전체 보기 ↗</a>
    <p class="modal-disclaimer">위 내용은 발행사 RSS 요약이며, 전체 기사는 원문 링크에서 확인할 수 있습니다.</p>
  </div>
</div>

<div class="chat-widget">
  <button class="chat-fab" id="chatFab" type="button">✦ AI에게 물어보기</button>
  <div class="chat-panel" id="chatPanel" hidden>
    <div class="chat-panel-header">
      <span>그리드워치 AI</span>
      <span class="usage-badge chat-usage">AI 잔여 –</span>
      <button class="chat-close" id="chatClose" type="button" aria-label="닫기">×</button>
    </div>
    <div class="chat-messages" id="chatMessages">
      <div class="chat-msg chat-msg-bot">안녕하세요! 아래와 같은 형식으로 물어보세요.
· "OO기업의 수소 관련 최신 기사"
· "동남아 최근 딜 소식"
· "그리드 분야 최근 동향"</div>
    </div>
    <form class="chat-input-row" id="chatForm">
      <input type="text" id="chatInput" class="chat-input" placeholder="예: OO기업의 수소 관련 기사" autocomplete="off">
      <button type="submit" class="chat-send" id="chatSend">전송</button>
    </form>
  </div>
</div>

<script>
(function(){
  // Flipped to true by scripts/build-static.mjs for the GitHub Pages copy,
  // which has no server: articles come from a committed JSON snapshot and the
  // Gemini-backed features are replaced by a link to the static demo page.
  // Left false here so the live service is unaffected.
  const STATIC_MODE = false;
  const DEMO_URL = 'demo.html';

  const CATEGORIES = [
    {v:'solar', label:'태양광'}, {v:'wind', label:'풍력'}, {v:'renewable', label:'기타 재생E'},
    {v:'biogas', label:'바이오가스'}, {v:'hydrogen', label:'수소'}, {v:'nuclear', label:'원자력'},
    {v:'ess', label:'ESS'}, {v:'lng', label:'LNG'},
  ];
  const REGIONS = [
    {v:'domestic', label:'국내'}, {v:'namerica', label:'북미'}, {v:'europe', label:'유럽'},
    {v:'seasia', label:'동남아'}, {v:'mideast', label:'중동'}, {v:'global', label:'글로벌'},
  ];
  const JOBS = [
    {v:'invest_dev', label:'투자/개발'}, {v:'tech', label:'기술'},
    {v:'sales', label:'영업/마케팅'}, {v:'external', label:'대외협력/ESG'},
  ];
  const TYPES = [
    {v:'news', label:'뉴스'}, {v:'policy', label:'정책·규제'}, {v:'deal', label:'딜·투자'}, {v:'report', label:'리포트'},
  ];

  let ITEMS = [];

  function safeGet(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } }
  function safeSet(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){} }

  const state = { category:new Set(), region:new Set(), job:new Set(), type:new Set(), keyword:'', bookmarkOnly:false, sort:'time', viewTab:'all' };
  let aiInsightGenerated = false;
  let bookmarks = new Set(safeGet('gridwatch_bookmarks', []));
  let profiles = safeGet('gridwatch_profiles', []);

  function labelFor(list, v){ const f = list.find(x=>x.v===v); return f ? f.label : v; }

  const ESCAPE_MAP = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  function esc(str){ return String(str==null?'':str).replace(/[&<>"']/g, ch => ESCAPE_MAP[ch]); }
  function escAttr(str){ return esc(str); }
  function safeUrl(url){
    try {
      const u = new URL(String(url));
      return (u.protocol === 'http:' || u.protocol === 'https:') ? url : '#';
    } catch(e) { return '#'; }
  }

  function renderChips(containerId, list, groupKey){
    const el = document.getElementById(containerId);
    el.innerHTML = list.map(item => {
      const dot = groupKey==='category' ? '<span class="chip-dot" style="background:var(--cat-'+item.v+')"></span>' : '';
      return '<button type="button" class="chip" data-group="'+groupKey+'" data-value="'+item.v+'">'+dot+item.label+'</button>';
    }).join('');
    el.querySelectorAll('.chip').forEach(chip=>{
      chip.addEventListener('click', ()=>{
        const v = chip.dataset.value;
        const set = state[groupKey];
        if(set.has(v)) set.delete(v); else set.add(v);
        chip.classList.toggle('active');
        if(groupKey==='region') syncOriginToggle();
        autoSwitchToPersonalized();
        renderFeed();
      });
    });
  }

  const OVERSEAS_REGIONS = REGIONS.filter(r=>r.v!=='domestic').map(r=>r.v);
  function syncOriginToggle(){
    let mode = 'all';
    if(state.region.size === 1 && state.region.has('domestic')) mode = 'domestic';
    else if(state.region.size === OVERSEAS_REGIONS.length && OVERSEAS_REGIONS.every(v=>state.region.has(v))) mode = 'overseas';
    document.querySelectorAll('.origin-btn').forEach(b=> b.classList.toggle('active', b.dataset.origin===mode));
  }

  function hasActiveFilters(){ return !!(state.category.size || state.region.size || state.job.size || state.type.size || state.keyword.trim()); }

  function setViewTab(tab){
    state.viewTab = tab;
    const tabAll = document.getElementById('tabAll');
    const tabPersonalized = document.getElementById('tabPersonalized');
    const tabAi = document.getElementById('tabAiInsight');
    tabAll.classList.toggle('active', tab==='all');
    tabAll.setAttribute('aria-selected', String(tab==='all'));
    tabPersonalized.classList.toggle('active', tab==='personalized');
    tabPersonalized.setAttribute('aria-selected', String(tab==='personalized'));
    tabAi.classList.toggle('active', tab==='ai');
    tabAi.setAttribute('aria-selected', String(tab==='ai'));
  }
  function autoSwitchToPersonalized(){
    aiInsightGenerated = false; // filters changed - require an explicit re-generate on the AI tab
    if(state.viewTab==='all' && hasActiveFilters()) setViewTab('personalized');
  }

  function signalHTML(n){
    let out='';
    for(let i=1;i<=3;i++){ out += '<i class="'+(i<=n?'filled':'')+'"></i>'; }
    return '<span class="signal" title="중요도 '+n+'/3 (휴리스틱)">'+out+'</span>';
  }

  function matchesKeyword(item, kw){
    if(!kw) return true;
    const hay = (item.title+' '+item.summary).toLowerCase();
    return hay.includes(kw.toLowerCase());
  }

  // Server score (정보유형·규모·확정단계·언론사·중복보도·최신성) plus a
  // client-side personalization bonus for whatever filters are active.
  const PERSONALIZATION_POINTS = 5;
  function totalScore(item){
    let bonus = 0;
    if(state.category.size && state.category.has(item.category)) bonus += PERSONALIZATION_POINTS;
    if(state.region.size && state.region.has(item.region)) bonus += PERSONALIZATION_POINTS;
    if(state.job.size && item.jobs.some(j=>state.job.has(j))) bonus += PERSONALIZATION_POINTS;
    return (item.score ?? 0) + bonus;
  }

  function filteredItems(){
    return ITEMS.filter(item=>{
      if(state.viewTab==='personalized' || state.viewTab==='ai'){
        if(state.category.size && !state.category.has(item.category)) return false;
        if(state.region.size && !state.region.has(item.region)) return false;
        if(state.job.size && !item.jobs.some(j=>state.job.has(j))) return false;
        if(state.type.size && !state.type.has(item.infoType)) return false;
        if(!matchesKeyword(item, state.keyword)) return false;
      }
      if(state.bookmarkOnly && !bookmarks.has(item.id)) return false;
      return true;
    }).sort((a,b)=>{
      // Low-relevance content (기부·시상 등) stays pinned to the bottom under
      // either sort mode; everything else is ordered by score or date.
      const ar = a.rankTier ?? 1, br = b.rankTier ?? 1;
      if(ar !== br) return ar - br;
      if(state.sort==='importance'){
        const diff = totalScore(b) - totalScore(a);
        if(diff !== 0) return diff;
      }
      return b.dateISO.localeCompare(a.dateISO) || String(a.id).localeCompare(String(b.id));
    });
  }

  function cardHTML(item){
    const bookmarked = bookmarks.has(item.id);
    const tags = (item.tags||[]);
    const summaryHTML = item.summary ? '          <p class="card-summary">'+esc(item.summary)+'</p>\n' : '';
    return '\n      <article class="card" data-id="'+esc(item.id)+'">\n        <div class="card-spine" style="--cat-color:var(--cat-'+item.category+')"></div>\n        <div class="card-body">\n          <div class="card-top">\n            <span class="type-badge">'+labelFor(TYPES, item.infoType)+'</span>\n            '+signalHTML(item.importance)+'\n            <button class="bookmark-btn" data-id="'+esc(item.id)+'" aria-pressed="'+bookmarked+'" aria-label="북마크 토글">'+(bookmarked?'★':'☆')+'</button>\n          </div>\n          <h3 class="card-title">'+esc(item.title)+'</h3>\n'+summaryHTML+(tags.length ? '          <div class="card-tags">'+tags.map(t=>'<span class="tag">#'+esc(t)+'</span>').join('')+'</div>\n' : '')+'          <div class="card-meta">\n            <span>'+esc(item.source)+'</span>\n            <span>·</span>\n            <span>'+esc(item.dateLabel)+'</span>\n            <span class="meta-region">'+labelFor(REGIONS, item.region)+'</span>\n            <button class="source-link">미리보기</button>\n          </div>\n        </div>\n      </article>';
  }

  function renderFeed(){
    const grid = document.getElementById('cardGrid');
    const empty = document.getElementById('emptyState');
    const hint = document.getElementById('personalizedHint');
    const aiList = document.getElementById('aiInsightList');
    const aiHint = document.getElementById('aiInsightHint');
    const resultCount = document.getElementById('resultCount');

    if(state.viewTab === 'ai'){
      const genPrompt = document.getElementById('aiGeneratePrompt');
      grid.hidden = true; empty.hidden = true; hint.hidden = true;
      if(!hasActiveFilters()){
        aiList.hidden = true; aiList.innerHTML = '';
        genPrompt.hidden = true;
        aiHint.hidden = false;
        resultCount.textContent = 'AI 시사점 대기 중';
        aiInsightGenerated = false;
        return;
      }
      aiHint.hidden = true;
      if(aiInsightGenerated){
        genPrompt.hidden = true;
        aiList.hidden = false;
        return;
      }
      // Nothing to generate on the static site - the write-ups already exist,
      // so skip the button and render them.
      if(STATIC_MODE){
        genPrompt.hidden = true;
        loadAiInsight();
        return;
      }
      aiList.hidden = true; aiList.innerHTML = '';
      genPrompt.hidden = false;
      resultCount.textContent = '분석 대기 중';
      return;
    }
    aiList.hidden = true; aiHint.hidden = true;
    document.getElementById('aiGeneratePrompt').hidden = true;

    const awaitingPersonalization = state.viewTab==='personalized' && !hasActiveFilters();
    if(awaitingPersonalization){
      grid.innerHTML = ''; grid.hidden = true; empty.hidden = true; hint.hidden = false;
      resultCount.textContent = '맞춤 피드 대기 중';
      return;
    }
    hint.hidden = true; grid.hidden = false;

    const items = filteredItems();
    grid.innerHTML = items.map(cardHTML).join('');
    empty.hidden = items.length !== 0;
    resultCount.innerHTML = '<b>'+items.length+'</b>건 표시 중 (전체 '+ITEMS.length+'건)';
    document.getElementById('bookmarkCount').textContent = bookmarks.size ? '('+bookmarks.size+')' : '';

    grid.querySelectorAll('.bookmark-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> toggleBookmark(btn.dataset.id));
    });
    grid.querySelectorAll('.source-link').forEach(btn=>{
      btn.addEventListener('click', ()=> openArticle(btn.closest('.card').dataset.id));
    });
  }

  function aiInsightSkeletonHTML(item){
    return '<div class="ai-insight-card">'+
      '<div class="ai-insight-head"><span class="type-badge">'+labelFor(TYPES,item.infoType)+'</span>'+signalHTML(item.importance)+'</div>'+
      '<h3 class="ai-insight-title">'+esc(item.title)+'</h3>'+
      '<p class="ai-insight-meta">'+esc(item.source)+' · '+esc(item.dateLabel)+' · '+labelFor(REGIONS,item.region)+'</p>'+
      '<p class="briefing-skeleton">AI가 분석 중…</p>'+
    '</div>';
  }

  function aiInsightCardHTML(item, ai){
    const summary = ai && ai.summary ? esc(ai.summary) : '요약을 생성하지 못했습니다.';
    const implications = ai && ai.implications ? esc(ai.implications) : '';
    return '<div class="ai-insight-card">'+
      '<div class="ai-insight-head"><span class="type-badge">'+labelFor(TYPES,item.infoType)+'</span>'+signalHTML(item.importance)+'</div>'+
      '<h3 class="ai-insight-title"><a href="'+escAttr(safeUrl(item.link))+'" target="_blank" rel="noopener noreferrer">'+esc(item.title)+'</a></h3>'+
      '<p class="ai-insight-meta">'+esc(item.source)+' · '+esc(item.dateLabel)+' · '+labelFor(REGIONS,item.region)+'</p>'+
      '<p class="ai-result-label">AI 핵심 요약</p><p class="ai-result-text">'+summary+'</p>'+
      (implications ? '<p class="ai-result-label">시사점</p><p class="ai-result-text ai-implication">'+implications+'</p>' : '')+
      relatedHTML(item)+
    '</div>';
  }

  // Gemini's API doesn't report remaining quota, so the server counts our own
  // calls against a daily budget and we show what's left of it.
  function setUsage(usage){
    if(!usage) return;
    const text = 'AI 잔여 ' + usage.remaining + '/' + usage.limit + '회';
    document.querySelectorAll('.usage-badge').forEach(el=>{
      el.textContent = text;
      el.classList.toggle('low', usage.remaining <= 10);
    });
  }
  async function refreshUsage(){
    // No server, no per-visitor quota: the write-ups were paid for at build
    // time, so the badge would be meaningless here.
    if(STATIC_MODE){
      document.querySelectorAll('.usage-badge').forEach(el=>{ el.textContent = '사전 생성'; });
      // The admin console needs a server, so reuse its slot for the demo page.
      const dev = document.querySelector('.dev-link');
      if(dev){ dev.title = 'AI 기능 예시 화면 (보고용)'; dev.setAttribute('aria-label', 'AI 기능 예시 화면'); }
      return;
    }
    try{
      const res = await fetch('/api/usage');
      setUsage(await res.json());
    }catch(e){ /* leave the last known value */ }
  }

  function relatedHTML(item){
    const ids = item.relatedIds || [];
    if(!ids.length) return '';
    const links = ids.map(id=>ITEMS.find(x=>x.id===id)).filter(Boolean);
    if(!links.length) return '';
    return '<p class="ai-result-label">유사 기사 (타 매체 동일 사안)</p>'+
      '<ul class="ai-related">'+ links.map(r=>
        '<li><a href="'+escAttr(safeUrl(r.link))+'" target="_blank" rel="noopener noreferrer">'+esc(r.source)+' · '+esc(r.title)+'</a></li>'
      ).join('') +'</ul>';
  }

  function progressHTML(step, elapsed){
    const steps = ['핵심 기사 선별', 'AI 분석 요청', '결과 정리'];
    return '<div class="ai-progress">'+
      '<div class="ai-progress-steps">'+ steps.map((s,i)=>
        '<span class="ai-progress-step'+(i<step?' done':i===step?' active':'')+'">'+(i+1)+'. '+esc(s)+'</span>'
      ).join('<span class="ai-progress-arrow">→</span>') +'</div>'+
      '<div class="ai-progress-bar"><div class="ai-progress-fill" style="width:'+Math.round((step/steps.length)*100)+'%"></div></div>'+
      '<p class="ai-progress-note">'+esc(elapsed)+'초 경과 · AI 응답을 기다리는 중입니다</p>'+
    '</div>';
  }

  async function loadAiInsight(){
    const aiList = document.getElementById('aiInsightList');
    const resultCount = document.getElementById('resultCount');
    const candidates = filteredItems();
    // Pick the report's articles by the same score the feed ranks with.
    const key = candidates.slice().sort((a,b)=>{
      const ar = a.rankTier ?? 1, br = b.rankTier ?? 1;
      if(ar !== br) return ar - br;
      return totalScore(b) - totalScore(a) || b.dateISO.localeCompare(a.dateISO);
    }).slice(0,5);

    if(!key.length){
      aiList.hidden = false;
      aiList.innerHTML = '<p class="empty-state">현재 필터 조건에 맞는 기사가 없습니다.</p>';
      resultCount.textContent = '0건';
      return;
    }

    // On the static site the write-ups were generated during the build, so
    // there is nothing to wait for - render straight from the snapshot.
    if(STATIC_MODE){
      aiList.hidden = false;
      const done = key.filter(i=>i.ai);
      aiList.innerHTML =
        (done.length < key.length
          ? '<p class="empty-state hint" style="margin-bottom:12px">선별된 '+key.length+'건 중 '+done.length+'건에 분석이 준비되어 있습니다. 나머지는 다음 수집 때 생성됩니다.</p>'
          : '')
        + (done.length
            ? done.map(item=> aiInsightCardHTML(item, item.ai)).join('')
            : '<p class="empty-state">이 조건의 기사에는 아직 AI 분석이 생성되지 않았습니다.<br>필터를 넓히거나 다음 자동 수집(매시간) 이후 다시 확인해주세요.</p>');
      resultCount.textContent = done.length ? '핵심 기사 '+done.length+'건' : '분석 없음';
      aiInsightGenerated = true;
      return;
    }

    resultCount.textContent = '핵심 기사 '+key.length+'건 분석 중…';
    aiList.hidden = false;

    let step = 1, seconds = 0;
    const paint = ()=>{ aiList.innerHTML = progressHTML(step, seconds) + key.map(aiInsightSkeletonHTML).join(''); };
    paint();
    const ticker = setInterval(()=>{ seconds += 1; paint(); }, 1000);

    try{
      const res = await fetch('/api/insights', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ids: key.map(i=>i.id)}),
      });
      const data = await res.json();
      step = 2; paint();
      if(!res.ok) throw new Error(data.error||'AI 분석에 실패했습니다.');
      const byId = {};
      (data.items||[]).forEach(x=>{ byId[x.id] = x; });
      clearInterval(ticker);
      aiList.innerHTML = '<button class="ai-regenerate-btn" id="aiRegenerateBtn" type="button">↻ 다시 분석하기</button>'
        + key.map(item=> aiInsightCardHTML(item, byId[item.id])).join('');
      document.getElementById('aiRegenerateBtn').addEventListener('click', loadAiInsight);
      resultCount.textContent = '핵심 기사 '+key.length+'건';
      if(data.usage) setUsage(data.usage);
    }catch(e){
      clearInterval(ticker);
      // When the daily quota is what failed, point at the demo page rather
      // than leaving a dead end - it's the one thing that still works.
      aiList.innerHTML = '<p class="empty-state">'+esc(e.message||'AI 시사점을 불러오지 못했습니다.')
        + '<br><a href="/demo" style="color:var(--accent-2)">→ AI 기능 예시 화면 보기</a></p>';
      resultCount.textContent = '오류';
      refreshUsage();
    }finally{
      clearInterval(ticker);
    }
  }

  function toggleBookmark(id){
    if(bookmarks.has(id)) bookmarks.delete(id); else bookmarks.add(id);
    safeSet('gridwatch_bookmarks', Array.from(bookmarks));
    const modalBtn = document.getElementById('modalBookmark');
    if(modalBtn.dataset.id === id){
      modalBtn.setAttribute('aria-pressed', String(bookmarks.has(id)));
      modalBtn.textContent = bookmarks.has(id) ? '★' : '☆';
    }
    renderFeed();
  }

  function openArticle(id){
    const item = ITEMS.find(i=>i.id===id);
    if(!item) return;
    document.getElementById('modalType').textContent = labelFor(TYPES, item.infoType);
    document.getElementById('modalMeta').textContent = item.source+' · '+item.dateLabel+' · '+labelFor(REGIONS, item.region);
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalBody').textContent = item.summary || '이 기사는 요약을 제공하지 않습니다. 원문에서 전체 내용을 확인해주세요.';
    document.getElementById('modalLink').href = safeUrl(item.link);
    const bm = document.getElementById('modalBookmark');
    bm.dataset.id = item.id;
    bm.setAttribute('aria-pressed', String(bookmarks.has(item.id)));
    bm.textContent = bookmarks.has(item.id) ? '★' : '☆';

    currentModalArticleId = item.id;
    const aiBtn = document.getElementById('aiSummarizeBtn');
    const aiResult = document.getElementById('aiResult');
    aiResult.hidden = true;
    aiBtn.hidden = false;
    aiBtn.disabled = false;
    aiBtn.textContent = '✦ AI 요약·시사점 보기';

    document.getElementById('articleModal').hidden = false;
  }
  function closeArticle(){ document.getElementById('articleModal').hidden = true; }

  let currentModalArticleId = null;
  document.getElementById('aiSummarizeBtn').addEventListener('click', async function(){
    const id = currentModalArticleId;
    if(!id) return;
    this.disabled = true;
    this.textContent = 'AI가 요약 중…';
    try{
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({id}),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'failed');
      document.getElementById('aiSummaryText').textContent = data.summary || '(요약 없음)';
      document.getElementById('aiImplicationsText').textContent = data.implications || '(시사점 없음)';
      document.getElementById('aiResult').hidden = false;
      this.hidden = true;
    }catch(e){
      showToast('AI 요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      this.disabled = false;
      this.textContent = '✦ AI 요약·시사점 보기';
    }
  });

  function renderLatestByCategory(){
    const el = document.getElementById('latestByCategory');
    const groups = CATEGORIES.map(cat=>{
      const latest = ITEMS.find(i=>i.category===cat.v);
      return { cat, latest };
    }).filter(g=>g.latest);
    if(!groups.length){
      el.innerHTML = '<p class="briefing-group-text">아직 수집된 기사가 없습니다.</p>';
      return;
    }
    el.innerHTML = groups.map(g=>
      '<div class="briefing-group">'+
        '<span class="briefing-group-label">'+esc(g.cat.label)+'</span>'+
        '<p class="briefing-group-text"><a href="'+escAttr(safeUrl(g.latest.link))+'" target="_blank" rel="noopener noreferrer">'+esc(g.latest.title)+'</a></p>'+
        '<p class="briefing-group-meta">'+esc(g.latest.source)+' · '+esc(g.latest.dateLabel)+'</p>'+
      '</div>'
    ).join('');
  }

  function renderProfiles(){
    const el = document.getElementById('profileList');
    if(!profiles.length){ el.innerHTML = '<p class="profile-empty">저장된 프로필이 없습니다.</p>'; return; }
    el.innerHTML = profiles.map((p,i)=>
      '<div class="profile-row">'+
        '<button type="button" class="profile-name" data-i="'+i+'">'+p.name+'</button>'+
        '<button type="button" class="profile-del" data-i="'+i+'" aria-label="프로필 삭제">×</button>'+
      '</div>'
    ).join('');
    el.querySelectorAll('.profile-name').forEach(btn=>{ btn.addEventListener('click', ()=> applyProfile(profiles[Number(btn.dataset.i)])); });
    el.querySelectorAll('.profile-del').forEach(btn=>{
      btn.addEventListener('click', ()=>{ profiles.splice(Number(btn.dataset.i),1); safeSet('gridwatch_profiles', profiles); renderProfiles(); });
    });
  }

  function syncChipActive(){
    document.querySelectorAll('.chip').forEach(chip=>{
      const set = state[chip.dataset.group];
      chip.classList.toggle('active', set.has(chip.dataset.value));
    });
  }

  function applyProfile(p){
    aiInsightGenerated = false;
    state.category = new Set(p.category); state.region = new Set(p.region);
    state.job = new Set(p.job); state.type = new Set(p.type); state.keyword = p.keyword || '';
    document.getElementById('keywordInput').value = state.keyword;
    syncChipActive();
    syncOriginToggle();
    setViewTab(hasActiveFilters() ? 'personalized' : 'all');
    renderFeed();
    showToast("'"+p.name+"' 필터를 적용했습니다.");
  }

  let toastTimer;
  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> t.classList.remove('show'), 2200);
  }

  document.getElementById('tabAll').addEventListener('click', ()=>{ setViewTab('all'); renderFeed(); });
  document.getElementById('tabPersonalized').addEventListener('click', ()=>{ setViewTab('personalized'); renderFeed(); });
  document.getElementById('tabAiInsight').addEventListener('click', ()=>{ setViewTab('ai'); renderFeed(); });
  document.getElementById('aiGenerateBtn').addEventListener('click', ()=>{
    aiInsightGenerated = true;
    document.getElementById('aiGeneratePrompt').hidden = true;
    loadAiInsight();
  });
  document.getElementById('keywordInput').addEventListener('input', (e)=>{ state.keyword = e.target.value; autoSwitchToPersonalized(); renderFeed(); });
  document.getElementById('bookmarkToggle').addEventListener('click', function(){
    state.bookmarkOnly = !state.bookmarkOnly;
    this.setAttribute('aria-pressed', String(state.bookmarkOnly));
    renderFeed();
  });
  document.querySelectorAll('.sort-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.sort-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.sort = btn.dataset.sort;
      renderFeed();
    });
  });
  document.getElementById('resetFilters').addEventListener('click', ()=>{
    aiInsightGenerated = false;
    state.category.clear(); state.region.clear(); state.job.clear(); state.type.clear();
    state.keyword=''; state.bookmarkOnly=false;
    document.getElementById('keywordInput').value='';
    document.getElementById('bookmarkToggle').setAttribute('aria-pressed','false');
    syncChipActive();
    syncOriginToggle();
    setViewTab('all');
    renderFeed();
  });
  document.querySelectorAll('.origin-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const origin = btn.dataset.origin;
      state.region.clear();
      if(origin==='domestic') state.region.add('domestic');
      else if(origin==='overseas') OVERSEAS_REGIONS.forEach(v=>state.region.add(v));
      syncChipActive();
      syncOriginToggle();
      autoSwitchToPersonalized();
      renderFeed();
    });
  });
  document.getElementById('saveProfile').addEventListener('click', ()=>{
    const input = document.getElementById('profileNameInput');
    const name = input.value.trim();
    if(!name){ showToast('프로필 이름을 입력해주세요.'); return; }
    profiles.push({ name, category:Array.from(state.category), region:Array.from(state.region), job:Array.from(state.job), type:Array.from(state.type), keyword:state.keyword });
    safeSet('gridwatch_profiles', profiles);
    input.value=''; renderProfiles();
    showToast("'"+name+"' 필터를 저장했습니다.");
  });
  document.getElementById('modalClose').addEventListener('click', closeArticle);
  document.getElementById('articleModal').addEventListener('click', (e)=>{ if(e.target.id === 'articleModal') closeArticle(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeArticle(); });
  document.getElementById('modalBookmark').addEventListener('click', function(){ toggleBookmark(this.dataset.id); });

  function formatRefreshLabel(iso){
    if(!iso) return '수집 대기 중';
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    return '마지막 갱신 '+hh+':'+mm;
  }

  // The static snapshot stores raw rows; the API normally does this shaping
  // server-side. Recency is deliberately scored here rather than baked into
  // the file, because it decays between builds.
  function adaptSnapshot(data){
    const W = (data.weights && data.weights.recency) || {day:15, threeDays:10, week:5, older:0};
    const recency = iso=>{
      const h = (Date.now() - new Date(iso).getTime())/36e5;
      return h<=24 ? W.day : h<=72 ? W.threeDays : h<=168 ? W.week : W.older;
    };
    return (data.items||[])
      .slice()
      .sort((a,b)=> new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 400)
      .map(r=>{
        const iso = new Date(r.pubDate).toISOString();
        const d = new Date(iso);
        return {
          id:r.id, title:r.title, link:r.link, source:r.source, summary:r.summary,
          category:r.category, infoType:r.infoType, region:r.region, jobs:r.jobs||[],
          importance:r.importance, rankTier:r.rankTier,
          score:(r.score||0) + recency(iso),
          relatedIds:r.relatedIds||[],
          ai:r.ai||null,
          dateISO: iso.slice(0,10),
          dateLabel: String(d.getUTCMonth()+1).padStart(2,'0')+'.'+String(d.getUTCDate()).padStart(2,'0'),
        };
      });
  }

  async function loadArticles(){
    const banner = document.getElementById('netError');
    const detail = document.getElementById('netErrorDetail');
    try{
      const res = await fetch(STATIC_MODE ? 'articles.json' : '/api/articles', { cache:'no-store' });
      if(!res.ok) throw new Error('서버가 '+res.status+' 응답을 보냈습니다.');
      const data = await res.json();
      ITEMS = STATIC_MODE ? adaptSnapshot(data) : (data.items || []);
      document.getElementById('refreshLabel').textContent =
        formatRefreshLabel(STATIC_MODE ? data.generatedAt : data.lastCollectedAt);
      banner.hidden = true;
    }catch(e){
      // Distinguish "we reached the server and it errored" from "the request
      // never left the network", which on a managed PC usually means a proxy
      // or firewall is dropping it - the user needs to know which.
      const blocked = e instanceof TypeError;
      detail.textContent = blocked
        ? '네트워크에서 요청이 차단된 것으로 보입니다. 사내망을 사용 중이라면 보안정책 때문일 수 있으니, 휴대폰 데이터 등 다른 네트워크에서도 열리는지 확인해주세요.'
        : (e.message || '알 수 없는 오류입니다.');
      banner.hidden = false;
      document.getElementById('refreshLabel').textContent = '수집 실패';
    }
    renderLatestByCategory();
    renderFeed();
  }
  document.getElementById('netRetry').addEventListener('click', loadArticles);

  // ---- static chatbot -------------------------------------------------
  // Without a server there is no Gemini call, so the bot does the half it can
  // do locally: work out what was asked (category / region / company or topic
  // words) and pull the matching articles out of the snapshot. It reports what
  // it found instead of writing prose about it - that is the honest limit of
  // running with no model, and it still answers "which article covers this".
  const CHAT_STOPWORDS = ['알려줘','알려주세요','관련','최신','기사','소식','뉴스','어때','어떤','무엇','뭐','있어','있나','있니','해줘','보여줘','요약','동향','현황','대해','대한','정리','좀','그리고','의','은','는','이','가','을','를','에','에서','와','과','로','으로'];
  const PARTICLES = ['으로','에서','에게','까지','부터','이라고','라고','이나','처럼','보다','에는','에도','의','은','는','이','가','을','를','과','와','도','로','만'];

  function stripParticle(w){
    for(const p of PARTICLES){
      if(w.length > p.length + 1 && w.endsWith(p)) return w.slice(0, -p.length);
    }
    return w;
  }
  function detectFrom(list, text){
    for(const o of list){ if(text.includes(o.label.toLowerCase())) return o.v; }
    return null;
  }
  function chatKeywords(text){
    return text.split(/[\s,.!?"'()\[\]]+/)
      .map(w=>stripParticle(w.trim().toLowerCase()))
      .filter(w=> w.length >= 2 && !CHAT_STOPWORDS.includes(w));
  }
  function staticChatReply(message){
    const lower = message.toLowerCase();
    const cat = detectFrom(CATEGORIES, lower);
    const reg = detectFrom(REGIONS, lower);
    const words = chatKeywords(lower).filter(w=>{
      if(cat && CATEGORIES.some(c=>c.v===cat && c.label.toLowerCase().includes(w))) return false;
      if(reg && REGIONS.some(r=>r.v===reg && r.label.toLowerCase().includes(w))) return false;
      return true;
    });

    if(!cat && !reg && !words.length){
      return '다음과 같은 형식으로 질문해주세요.\n\n'
        + '· "OO기업의 수소 관련 최신 기사"\n'
        + '· "동남아 LNG 투자 동향"\n'
        + '· "국내 재생에너지 정책"\n\n'
        + '산업분야(태양광·풍력·수소·원자력·ESS·LNG 등), 지역, 기업명·키워드를 넣어주시면 해당 기사를 찾아드립니다.';
    }

    const hay = it => (it.title + ' ' + (it.summary||'') + ' ' + it.source).toLowerCase();
    // Progressively relax: all keywords → any keyword → drop the region.
    const tiers = [
      it => (!cat || it.category===cat) && (!reg || it.region===reg) && words.every(w=>hay(it).includes(w)),
      it => (!cat || it.category===cat) && (!reg || it.region===reg) && (!words.length || words.some(w=>hay(it).includes(w))),
      it => (!cat || it.category===cat) && (!words.length || words.some(w=>hay(it).includes(w))),
    ];
    let hits = [], relaxed = 0;
    for(let i=0;i<tiers.length;i++){
      hits = ITEMS.filter(tiers[i]);
      if(hits.length){ relaxed = i; break; }
    }
    if(!hits.length){
      const asked = [cat && labelFor(CATEGORIES,cat), reg && labelFor(REGIONS,reg), ...words].filter(Boolean).join(' · ');
      return '수집된 기사 중에서 "'+asked+'" 에 해당하는 내용을 찾지 못했습니다.\n\n'
        + '현재 '+ITEMS.length+'건을 보관하고 있습니다. 기업명 대신 산업분야로, 또는 더 일반적인 단어로 다시 물어봐 주세요.';
    }

    hits = hits.slice().sort((a,b)=>{
      const ar=a.rankTier??1, br=b.rankTier??1;
      if(ar!==br) return ar-br;
      return totalScore(b)-totalScore(a) || b.dateISO.localeCompare(a.dateISO);
    }).slice(0,5);

    const asked = [cat && labelFor(CATEGORIES,cat), reg && labelFor(REGIONS,reg), ...words].filter(Boolean).join(' · ');
    let out = '"'+asked+'" 관련 기사 '+hits.length+'건을 찾았습니다.'
      + (relaxed ? '\n(정확히 일치하는 기사가 없어 조건을 넓혀 검색했습니다.)' : '') + '\n\n';
    out += hits.map(h=>{
      const body = h.ai ? h.ai.summary : (h.summary||'').slice(0,120);
      return '• '+body+'\n  ('+h.title+' / '+h.source+' · '+h.dateLabel+')';
    }).join('\n\n');
    const withAi = hits.filter(h=>h.ai && h.ai.implications);
    if(withAi.length){
      out += '\n\n[시사점] '+withAi[0].ai.implications;
    }
    return out;
  }

  let chatInteractionId = null;
  function appendChatMessage(role, text, loading){
    const wrap = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (role==='user' ? 'chat-msg-user' : 'chat-msg-bot') + (loading ? ' chat-msg-loading' : '');
    div.textContent = text;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
    return div;
  }
  document.getElementById('chatFab').addEventListener('click', ()=>{
    document.getElementById('chatPanel').hidden = false;
    document.getElementById('chatFab').hidden = true;
    document.getElementById('chatInput').focus();
  });
  document.getElementById('chatClose').addEventListener('click', ()=>{
    document.getElementById('chatPanel').hidden = true;
    document.getElementById('chatFab').hidden = false;
  });
  document.getElementById('chatForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if(!message) return;
    appendChatMessage('user', message);
    input.value = '';
    const sendBtn = document.getElementById('chatSend');
    sendBtn.disabled = true;
    const loadingEl = appendChatMessage('bot', '생각 중…', true);

    if(STATIC_MODE){
      // Short pause so the answer does not flash in before the question reads.
      await new Promise(r=>setTimeout(r, 350));
      loadingEl.textContent = staticChatReply(message);
      loadingEl.classList.remove('chat-msg-loading');
      sendBtn.disabled = false;
      document.getElementById('chatMessages').scrollTop = 1e6;
      return;
    }

    try{
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({message, previousInteractionId: chatInteractionId}),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'AI 응답 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      loadingEl.textContent = data.reply;
      loadingEl.classList.remove('chat-msg-loading');
      chatInteractionId = data.interactionId || chatInteractionId;
      if(data.usage) setUsage(data.usage);
    }catch(err){
      loadingEl.textContent = err.message || 'AI 응답 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';
      loadingEl.classList.remove('chat-msg-loading');
      refreshUsage();
    }finally{
      sendBtn.disabled = false;
    }
  });

  const today = new Date();
  document.getElementById('todayLabel').textContent = today.getFullYear()+'.'+String(today.getMonth()+1).padStart(2,'0')+'.'+String(today.getDate()).padStart(2,'0');

  renderChips('categoryChips', CATEGORIES, 'category');
  renderChips('regionChips', REGIONS, 'region');
  renderChips('jobChips', JOBS, 'job');
  renderChips('typeChips', TYPES, 'type');
  renderProfiles();
  loadArticles();
  refreshUsage();
})();
</script>
</body>
</html>`;

export async function GET() {
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // The shell holds no data (everything comes from /api/articles), so it
      // can be served straight from the CDN edge. Previously every visit woke
      // a serverless function, which is the slowest path on a proxied network.
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

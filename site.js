/* ============================================================
   site.js — shared behaviour for every page.
   Each block runs only if the relevant element is on the page,
   so one file serves all six.
   ============================================================ */

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const TCOLOR = Object.fromEntries(THEMES.map(t => [t.k, t.c]));

const authorLine = d => d.solo ? "Obaidullah, Md." : d.authors.join(", ");
const citation   = d => authorLine(d) + " (" + d.y + "). \u201C" + d.title + ".\u201D " +
                        [d.venue, d.detail].filter(Boolean).join(", ") + ".";
const kindLabel  = k => (KINDS.find(t => t.k === k)  || {}).label || k;
const themeLabel = k => (THEMES.find(t => t.k === k) || {}).label || k;

/* ---------------- toast + clipboard ---------------- */
let _tt;
function toast(m){
  let el = $("#toast");
  if(!el){ el = document.createElement("div"); el.id = "toast"; el.className = "toast";
           el.setAttribute("role","status"); document.body.appendChild(el); }
  el.textContent = m; el.classList.add("show");
  clearTimeout(_tt); _tt = setTimeout(() => el.classList.remove("show"), 1900);
}
function copyText(text){
  if(navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(text).then(() => toast("Citation copied")).catch(() => fallbackCopy(text));
  else fallbackCopy(text);
}
function fallbackCopy(text){
  const ta = document.createElement("textarea");
  ta.value = text; ta.setAttribute("readonly","");
  ta.style.cssText = "position:absolute;left:-9999px";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); toast("Citation copied"); }
  catch(e){ toast("Select the citation to copy it"); }
  document.body.removeChild(ta);
}

/* ---------------- home: interests ---------------- */
if($("#ilist")){
  $("#ilist").innerHTML = THEMES.map(t => {
    const n = DATA.filter(d => d.th === t.k).length;
    return `<li><i style="background:${t.c}"></i><span>${t.label}
      <small><a href="publications.html?theme=${t.k}">${n} pieces</a></small></span></li>`;
  }).join("");
}

/* ---------------- home: most recent work ---------------- */
if($("#recent")){
  const rows = DATA.map((d,i) => ({d,i}))
                   .sort((a,b) => b.d.y - a.d.y || a.i - b.i)
                   .slice(0,6);
  $("#recent").innerHTML = rows.map(({d}) =>
    `<li><span class="d" style="background:${TCOLOR[d.th]}"></span>
      <span class="y">${d.y}</span>
      <span><span class="t">${d.title}</span>
      <span class="v">${d.venue}${d.detail ? ", " + d.detail : ""} \u2014 ${kindLabel(d.t)}</span></span></li>`
  ).join("");
}

/* ---------------- research: thematic strands ---------------- */
if($("#strands")){
  $("#strands").innerHTML = THEMES.map(t =>
    `<div class="strand"><i style="background:${t.c}"></i>
      <div><h3>${t.label}</h3><p>${t.blurb}</p></div></div>`).join("");
}

/* ---------------- cv: journals refereed for ---------------- */
if($("#reviewpills")){
  $("#reviewpills").innerHTML = REVIEWS.map(([j,n]) => `<span class="pill"><b>${j}</b> ${n}</span>`).join("");
}

/* ---------------- research: the atlas ---------------- */
if($("#atlas")) buildAtlas();

function buildAtlas(){
  const svg = $("#atlas"), W = 1200, H = 520;
  const X = lon => (lon + 95) * (W / 220), Y = lat => (58 - lat) * (H / 58);
  const keys = Object.keys(PLACES), nodeW = {}, linkW = {};
  keys.forEach(k => nodeW[k] = 0);
  DATA.forEach(d => {
    const g = d.geo || [];
    g.forEach(k => nodeW[k]++);
    for(let i=0;i<g.length;i++) for(let j=i+1;j<g.length;j++){
      const key = [g[i],g[j]].sort().join("|");
      linkW[key] = (linkW[key] || 0) + 1;
    }
  });
  const maxL = Math.max(...Object.values(linkW));

  let g = "";
  for(let lon=-90; lon<=125; lon+=15)
    g += `<line class="gl${lon===0?" gl0":""}" x1="${X(lon).toFixed(1)}" y1="0" x2="${X(lon).toFixed(1)}" y2="${H}"/>`;
  for(let lat=0; lat<=58; lat+=10)
    g += `<line class="gl" x1="0" y1="${Y(lat).toFixed(1)}" x2="${W}" y2="${Y(lat).toFixed(1)}"/>`;
  const bx = X(PLACES.BD.lon), by = Y(PLACES.BD.lat);
  [110,220,330,440].forEach(r => g += `<circle class="ring" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${r}"/>`);

  let links = "";
  Object.entries(linkW).forEach(([key,w]) => {
    const [a,b] = key.split("|");
    const x1=X(PLACES[a].lon), y1=Y(PLACES[a].lat), x2=X(PLACES[b].lon), y2=Y(PLACES[b].lat);
    const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1;
    let nx=-dy/len, ny=dx/len; if(ny>0){ nx=-nx; ny=-ny; }
    const off = len * 0.19;
    links += `<path class="arc" data-a="${a}" data-b="${b}" d="M ${x1.toFixed(1)},${y1.toFixed(1)} Q ${(mx+nx*off).toFixed(1)},${(my+ny*off).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" stroke-width="${(1+w/maxL*4.5).toFixed(2)}" opacity="${(0.25+w/maxL*0.45).toFixed(2)}"/>`;
  });

  let nodes = "";
  keys.forEach(k => {
    const p = PLACES[k], px = X(p.lon), py = Y(p.lat), n = nodeW[k], r = 5 + Math.sqrt(n) * 2.2;
    nodes += `<g class="nd" data-k="${k}" role="button" tabindex="0" aria-label="${p.name}, ${n} publications">
      <circle class="nd-halo" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r*2.5).toFixed(1)}"/>
      <circle class="nd-dot"  cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}"/>
      <text class="nd-lab" x="${(px+p.dx).toFixed(1)}" y="${(py+p.dy).toFixed(1)}" text-anchor="${p.la}">${p.name}</text>
      <text class="nd-num" x="${(px+p.dx).toFixed(1)}" y="${(py+p.dy+20).toFixed(1)}" text-anchor="${p.la}">${n}</text>
    </g>`;
  });
  svg.innerHTML = g + links + nodes;

  const arcs = Array.from(svg.querySelectorAll(".arc"));
  const nds  = Array.from(svg.querySelectorAll(".nd"));
  function focus(k){
    if(!k){ arcs.forEach(a => a.classList.remove("hot","dim"));
            nds.forEach(n => n.classList.remove("dim","on")); return; }
    arcs.forEach(a => { const hit = a.dataset.a===k || a.dataset.b===k;
                        a.classList.toggle("hot",hit); a.classList.toggle("dim",!hit); });
    const near = new Set([k]);
    arcs.forEach(a => { if(a.dataset.a===k) near.add(a.dataset.b);
                        if(a.dataset.b===k) near.add(a.dataset.a); });
    nds.forEach(n => { n.classList.toggle("dim", !near.has(n.dataset.k));
                       n.classList.toggle("on", n.dataset.k===k); });
  }
  const go = k => { (window.__goto || (u => location.href = u))("publications.html?region=" + k); };
  nds.forEach(n => {
    n.addEventListener("mouseenter", () => focus(n.dataset.k));
    n.addEventListener("mouseleave", () => focus(null));
    n.addEventListener("click", () => go(n.dataset.k));
    n.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(n.dataset.k); }});
  });

  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  arcs.forEach(a => { const L = a.getTotalLength();
    a.style.strokeDasharray = L; a.style.strokeDashoffset = L;
    a.style.transition = "stroke-dashoffset 1400ms cubic-bezier(.4,0,.2,1)"; });
  nds.forEach(n => { n.style.opacity = 0; n.style.transition = "opacity 420ms ease"; });
  requestAnimationFrame(() => {
    setTimeout(() => arcs.forEach(a => a.style.strokeDashoffset = 0), 180);
    nds.forEach((n,i) => setTimeout(() => n.style.opacity = 1, 220 + i*80));
  });
}

/* ---------------- the index (publications + public writing) ---------------- */
$$("[data-scope]").forEach(initIndex);

function initIndex(root){
  /* every query below is scoped to this index's own page container, so the
     single-file preview can hold several indexes at once */
  const PAGE = root.closest("[data-page]") || document;
  const qs   = s => PAGE.querySelector(s);

  const scope = root.dataset.scope;                       // "scholarly" | "public"
  const POOL  = DATA.map((d,i) => ({d,i}))
                    .filter(o => scope === "public" ? o.d.t === "public" : o.d.t !== "public");
  const YEARS = Array.from(new Set(POOL.map(o => o.d.y))).sort((a,b) => a-b);
  const OUTLETS = Array.from(new Set(POOL.map(o => o.d.venue)))
                       .sort((a,b) => POOL.filter(o=>o.d.venue===b).length - POOL.filter(o=>o.d.venue===a).length);
  const open = new Set();

  /* a link such as publications.html?theme=mig or ?region=BD arrives pre-filtered */
  const P = new URLSearchParams(location.search);
  const state = {
    q: P.get("q") || "",
    kind: P.get("kind") || "all",
    years: new Set(P.get("year") ? [ +P.get("year") ] : []),
    themes: new Set(P.get("theme") ? [ P.get("theme") ] : []),
    outlet: P.get("outlet") || null,
    region: P.get("region") || null,
    sort: "new"
  };
  if(qs("#q")) qs("#q").value = state.q;

  const anyFilter = () => state.q || state.kind !== "all" || state.years.size ||
                          state.themes.size || state.outlet || state.region;

  function matches(d){
    if(state.kind !== "all" && d.t !== state.kind) return false;
    if(state.years.size && !state.years.has(d.y)) return false;
    if(state.themes.size && !state.themes.has(d.th)) return false;
    if(state.outlet && d.venue !== state.outlet) return false;
    if(state.region && !(d.geo || []).includes(state.region)) return false;
    if(state.q){
      const hay = (d.title+" "+d.venue+" "+d.detail+" "+d.authors.join(" ")+" "+d.y).toLowerCase();
      return state.q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w));
    }
    return true;
  }

  /* ---- controls ---- */
  function renderControls(){
    if(qs("#themebars")){
      const tc = {}; THEMES.forEach(t => tc[t.k] = POOL.filter(o => o.d.th === t.k).length);
      const tmax = Math.max(...Object.values(tc), 1);
      qs("#themebars").innerHTML = THEMES.map(t => {
        const on = state.themes.has(t.k);
        return `<button class="tbar${state.themes.size && !on ? " muted" : ""}" type="button" data-theme="${t.k}" aria-pressed="${on}">
          <span class="lab">${t.label}</span>
          <span class="track"><span class="fill" style="width:${(tc[t.k]/tmax*100).toFixed(1)}%;background:${t.c}"></span></span>
          <span class="num">${tc[t.k]}</span></button>`;
      }).join("");
    }
    if(qs("#ybars")){
      const yc = {}; YEARS.forEach(y => yc[y] = POOL.filter(o => o.d.y === y).length);
      const ymax = Math.max(...Object.values(yc), 1);
      qs("#ybars").innerHTML = YEARS.map(y =>
        `<button class="ybar" type="button" data-year="${y}" aria-pressed="${state.years.has(y)}" aria-label="${y}, ${yc[y]} items">
          <span class="stem" style="height:${(yc[y]/ymax*100).toFixed(1)}%"></span></button>`).join("");
      qs("#yfoot").innerHTML = YEARS.map(y => `<div><b>${yc[y]}</b>${y}</div>`).join("");
    }
    if(qs("#typechips")){
      const kinds = KINDS.filter(t => t.k === "all" || POOL.some(o => o.d.t === t.k));
      const kc = { all: POOL.length };
      kinds.slice(1).forEach(t => kc[t.k] = POOL.filter(o => o.d.t === t.k).length);
      qs("#typechips").innerHTML = kinds.map(t =>
        `<button class="chip" type="button" data-kind="${t.k}" aria-pressed="${state.kind === t.k}">${t.label}<span class="n">${kc[t.k]}</span></button>`).join("");
    }
    if(qs("#outletchips")){
      qs("#outletchips").innerHTML =
        `<button class="chip" type="button" data-outlet="" aria-pressed="${!state.outlet}">All outlets<span class="n">${POOL.length}</span></button>` +
        OUTLETS.map(v => `<button class="chip" type="button" data-outlet="${v}" aria-pressed="${state.outlet === v}">${v}<span class="n">${POOL.filter(o=>o.d.venue===v).length}</span></button>`).join("");
    }
  }

  /* ---- list ---- */
  function renderList(){
    let rows = POOL.filter(o => matches(o.d));
    const s = state.sort;
    rows.sort((a,b) => {
      if(s === "new")   return b.d.y - a.d.y || a.i - b.i;
      if(s === "old")   return a.d.y - b.d.y || a.i - b.i;
      if(s === "venue") return a.d.venue.localeCompare(b.d.venue) || b.d.y - a.d.y;
      return a.d.title.localeCompare(b.d.title);
    });

    root.innerHTML = rows.map(o => {
      const d = o.d, id = "e" + o.i, isOpen = open.has(o.i);
      const co  = d.solo ? "Single author" : (d.authors.length - 1) + " coauthor" + (d.authors.length > 2 ? "s" : "");
      const geo = (d.geo || []).map(g => PLACES[g].name).join(", ");
      const read = d.url ? `<a class="readlink" href="${d.url}" target="_blank" rel="noopener">Read the ${d.t === "public" ? "piece" : "article"}</a>` : "";
      return `<li class="entry">
        <button class="entry-btn" type="button" aria-expanded="${isOpen}" aria-controls="${id}" data-idx="${o.i}">
          <span class="tmark" style="background:${TCOLOR[d.th]}" title="${themeLabel(d.th)}"></span>
          <span class="entry-yr">${d.y}</span>
          <span>
            <span class="entry-title">${d.title}${d.flag ? `<span class="badge">${d.flag}</span>` : ""}</span>
            <span class="entry-venue">${d.venue}${d.detail ? ` <em>${d.detail}</em>` : ""} \u2014 ${kindLabel(d.t)}</span>
          </span>
          <span class="caret" aria-hidden="true"></span>
        </button>
        <div class="detail ${isOpen ? "open" : ""}" id="${id}">
          <p class="cite">${citation(d).replace(/\u201C([^\u201D]+)\u201D/, "\u201C<b>$1</b>\u201D")}</p>
          <div class="detail-actions">
            <button class="copybtn" type="button" data-copy="${o.i}">Copy citation</button>
            ${read}
            <span class="meta">${co}</span>
            <span class="meta">${themeLabel(d.th)}</span>
            ${geo ? `<span class="meta">${geo}</span>` : ""}
          </div>
        </div></li>`;
    }).join("");

    const n = rows.length;
    let label = n === POOL.length ? `${n} entries` : `${n} of ${POOL.length} entries`;
    if(state.region) label += ` \u2014 ${PLACES[state.region].name}`;
    qs("#count").textContent = label;
    qs("#empty").hidden  = n !== 0;
    root.hidden = n === 0;
    qs("#clear").hidden = !anyFilter();
    qs("#expandall").hidden = n === 0;
    qs("#expandall").textContent = (n && rows.every(o => open.has(o.i))) ? "Close all citations" : "Open all citations";
  }

  const render = () => { renderControls(); renderList(); };

  /* ---- events ---- */
  const on = (sel, ev, fn) => { const el = $(sel); if(el) el.addEventListener(ev, fn); };

  on("#themebars","click", e => { const b = e.target.closest("[data-theme]"); if(!b) return;
    const k = b.dataset.theme; state.themes.has(k) ? state.themes.delete(k) : state.themes.add(k); render(); });
  on("#ybars","click", e => { const b = e.target.closest("[data-year]"); if(!b) return;
    const y = +b.dataset.year; state.years.has(y) ? state.years.delete(y) : state.years.add(y); render(); });
  on("#typechips","click", e => { const b = e.target.closest("[data-kind]"); if(!b) return;
    state.kind = b.dataset.kind; render(); });
  on("#outletchips","click", e => { const b = e.target.closest("[data-outlet]"); if(!b) return;
    state.outlet = b.dataset.outlet || null; render(); });
  on("#q","input", e => { state.q = e.target.value.trim(); renderList(); });
  on("#sort","change", e => { state.sort = e.target.value; renderList(); });

  root.addEventListener("click", e => {
    const c = e.target.closest("[data-copy]");
    if(c){ copyText(citation(DATA[+c.dataset.copy])); return; }
    if(e.target.closest(".readlink")) return;
    const b = e.target.closest(".entry-btn"); if(!b) return;
    const i = +b.dataset.idx;
    open.has(i) ? open.delete(i) : open.add(i);
    b.setAttribute("aria-expanded", open.has(i));
    b.parentElement.querySelector(".detail").classList.toggle("open", open.has(i));
    qs("#expandall").textContent = "Open all citations";
  });

  on("#expandall","click", () => {
    const vis = POOL.filter(o => matches(o.d)).map(o => o.i);
    const allOpen = vis.every(i => open.has(i));
    vis.forEach(i => allOpen ? open.delete(i) : open.add(i));
    renderList();
  });

  function clearAll(){
    state.q = ""; state.kind = "all"; state.years.clear(); state.themes.clear();
    state.outlet = null; state.region = null;
    if(qs("#q")) qs("#q").value = "";
    render(); if(qs("#q")) qs("#q").focus();
  }
  on("#clear","click", clearAll);
  on("#reset","click", clearAll);

  document.addEventListener("keydown", e => {
    if(e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)){
      const box = qs("#q");
      if(box && box.offsetParent !== null){ e.preventDefault(); box.focus(); }
    }
    if(e.key === "Escape" && document.activeElement === qs("#q")){
      qs("#q").value = ""; state.q = ""; renderList();
    }
  });

  render();
}

"use strict";
// Lists are rendered into HTML. Search is an optional enhancement.
document.querySelectorAll("[data-search-list]").forEach((list) => {
  const search = document.querySelector("#publication-search");
  const type = document.querySelector("#publication-type");
  const count = document.querySelector("#search-count");
  const empty = document.querySelector("#empty-state");
  const entries = [...list.querySelectorAll("[data-publication]")];
  const sections = [...list.querySelectorAll("[data-publication-section]")];
  const noun = list.dataset.searchList;
  const normalize = (s) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[’‘]/g, "'").toLowerCase();
  const filter = () => {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const entry of entries) {
      const matches = terms.every(term => normalize(entry.dataset.search).includes(term)) && (!type || type.value === "all" || type.value === entry.dataset.type);
      entry.hidden = !matches;
      visible += Number(matches);
    }
    for (const section of sections) section.hidden = ![...section.querySelectorAll("[data-publication]")].some(entry => !entry.hidden);
    count.textContent = `${visible} ${noun}${visible === 1 ? "" : "s"}`;
    empty.hidden = visible > 0;
  };
  search.addEventListener("input", filter);
  if (type) type.addEventListener("change", filter);
  document.querySelectorAll(".jump-links a[href^='#']").forEach(link => link.addEventListener("click", () => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target || !list.contains(target) || !target.hidden) return;
    search.value = "";
    if (type) type.value = "all";
    filter();
  }));
  document.querySelectorAll("[data-reset-search]").forEach(button => button.addEventListener("click", () => {
    search.value = "";
    if (type) type.value = "all";
    filter();
    search.focus();
  }));
  const params = new URLSearchParams(location.search);
  if (params.has("q")) search.value = params.get("q");
  filter();
});

 
// Shared, server-backed view totals. Values are rendered as ordinary text, not images.
document.querySelectorAll("[data-post-views]").forEach((box) => {
  const slug = box.dataset.postViews;
  const value = box.querySelector("[data-view-value]");
  const retry = box.querySelector("[data-view-retry]");
  if (!slug || !value) return;
  let attemptedRecord = false;
  let loading = false;
  const loadCount = async () => {
    if (loading) return;
    loading = true;
    box.setAttribute("aria-busy", "true");
    if (retry) retry.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const record = box.dataset.recordView === "true" && !attemptedRecord;
    if (record) attemptedRecord = true;
    try {
      const response = await fetch("https://obaidullah-blog-views.patientfort.chatgpt.site/api/views?post=" + encodeURIComponent(slug), {
        method: record ? "POST" : "GET",
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Count request failed");
      const result = await response.json();
      if (result.post !== slug || !Number.isSafeInteger(result.views) || result.views < 0) {
        throw new Error("Invalid view total");
      }
      value.textContent = result.views.toLocaleString() + (value.dataset.viewSuffix || "");
      value.dataset.state = "ready";
    } catch {
      value.textContent = value.dataset.viewFallback || "Unavailable";
      value.dataset.state = "error";
      if (retry) retry.hidden = false;
    } finally {
      clearTimeout(timeout);
      loading = false;
      box.setAttribute("aria-busy", "false");
    }
  };
  if (retry) retry.addEventListener("click", loadCount);
  loadCount();
});

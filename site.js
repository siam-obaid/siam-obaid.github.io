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

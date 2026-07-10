(function () {
  const D = window.FB_DATA;
  const chart = document.getElementById("chart");
  const caption = document.getElementById("chartCaption");
  const metricToggle = document.getElementById("metricToggle");
  const legend = document.getElementById("legend");

  let view = "models";
  let metric = "tv";

  const CAPTIONS = {
    models:
      "Mean TV per model, averaged over all techniques, domains, and targets. Every model shifts its ranking under reframing. The flagship arms (GPT-5.4 and Claude Sonnet 4.5) run at 35 seeds per cell, the others at 100.",
    domains:
      "Mean TV per domain. Domains with hard numbers, such as personal finance and insurance, resist reframing. Experiential domains, such as food and travel, move the most.",
    tv:
      "Ranking shift (TV) per technique. The unmodified article already disrupts rankings as much as the strongest technique. Combinations of two techniques are shown in amber.",
    nrg:
      "Normalized rank gain per technique. This measures how far the chosen target moves up the ranking. The unmodified article is excluded, since it has no designated target.",
    top1:
      "Share of cases where the technique places the target at rank 1. Narrative framing reaches 74% on this aggregate. The unmodified article is excluded."
  };

  function fmt(value, asPercent) {
    if (value === null || value === undefined) return "—";
    if (asPercent) return Math.round(value * 100) + "%";
    return value.toFixed(2);
  }

  function row(name, sub, value, max, familyClass, asPercent) {
    const el = document.createElement("div");
    el.className = "bar-row" + (familyClass ? " " + familyClass : "");
    const neg = value < 0;
    const pct = Math.max(0, Math.min(100, (Math.abs(value) / max) * 100));
    el.innerHTML =
      `<div class="bar-name">${name}${sub ? `<span class="sub"> ${sub}</span>` : ""}</div>` +
      `<div class="bar-track"><div class="bar-fill${neg ? " neg" : ""}"></div></div>` +
      `<div class="bar-val">${fmt(value, asPercent)}</div>`;
    requestAnimationFrame(() => {
      el.querySelector(".bar-fill").style.width = pct + "%";
    });
    return el;
  }

  function render() {
    if (!chart) return;
    chart.innerHTML = "";
    const showTechnique = view === "techniques";
    if (metricToggle) metricToggle.hidden = !showTechnique;
    if (legend) legend.hidden = !showTechnique;

    if (view === "models") {
      const rows = [...D.models].sort((a, b) => b.tv - a.tv);
      const max = Math.max(...rows.map(r => r.tv));
      rows.forEach(m =>
        chart.appendChild(row(m.label, `${m.provider}`, m.tv, max, "", false))
      );
      caption.textContent = CAPTIONS.models;
    }

    else if (view === "domains") {
      const rows = [...D.domains].sort((a, b) => b.tv - a.tv);
      const max = Math.max(...rows.map(r => r.tv));
      rows.forEach(d => chart.appendChild(row(d.label, "", d.tv, max, "", false)));
      caption.textContent = CAPTIONS.domains;
    }

    else if (view === "techniques") {
      const asPercent = metric === "top1";
      let rows = D.techniques.filter(t => t[metric] !== null && t[metric] !== undefined);
      rows = rows.sort((a, b) => (b[metric] ?? -9) - (a[metric] ?? -9));
      const max = Math.max(0.001, ...rows.map(r => Math.abs(r[metric] ?? 0)));
      rows.forEach(t =>
        chart.appendChild(row(t.label, "", t[metric], max, "f-" + t.family, asPercent))
      );
      caption.textContent = CAPTIONS[metric];
    }
  }

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      view = tab.dataset.view;
      render();
    });
  });

  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      metric = chip.dataset.metric;
      render();
    });
  });

  const copyBtn = document.getElementById("copyBib");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = document.getElementById("bibtex").innerText;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copied ✓";
        copyBtn.classList.add("done");
        setTimeout(() => {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("done");
        }, 1600);
      });
    });
  }

  render();
})();

/* =========================================================
   Document explorer: baseline vs. technique variant.
   Real FramingBench documents (magnesium supplements), all
   19 techniques. Data in explorer_data.js (window.FB_DOCS),
   generated directly from the released benchmark documents.
   Changes are shown with a word-level diff against the
   neutral baseline: green = added, red strike-through = removed.
   ========================================================= */
(function () {
  const D = window.FB_DOCS;
  const dd = document.getElementById("varDD");
  const baselineEl = document.getElementById("baselineDoc");
  const variantEl = document.getElementById("variantDoc");
  const variantHead = document.getElementById("variantHead");
  if (!D || !dd || !baselineEl || !variantEl) return;

  const GROUP_LABEL = { processing: "Processing", relation: "Relation", quantity: "Quantity", manner: "Manner" };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function dot(group) {
    return '<i class="dot" style="background:var(--cat-' + group + ')"></i>';
  }

  // ---- word-level diff (LCS over whitespace-delimited tokens) ----
  function tokenize(s) { return s.split(/(\s+)/); }
  function diffHTML(oldStr, newStr) {
    if (oldStr === newStr) return esc(newStr);
    const a = tokenize(oldStr), b = tokenize(newStr);
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    let i = 0, j = 0, out = "", del = "", ins = "";
    function flush() {
      if (del) out += '<span class="del">' + esc(del) + "</span>";
      if (ins) out += '<span class="ins">' + esc(ins) + "</span>";
      del = ""; ins = "";
    }
    while (i < n && j < m) {
      if (a[i] === b[j]) { flush(); out += esc(b[j]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { del += a[i]; i++; }
      else { ins += b[j]; j++; }
    }
    while (i < n) { del += a[i]; i++; }
    while (j < m) { ins += b[j]; j++; }
    flush();
    return out;
  }

  function productBlock(key, variant) {
    const p = D.products[key];
    const base = p.desc;
    const cur = (variant && variant.bodies && variant.bodies[key] != null) ? variant.bodies[key] : base;
    const isTarget = !!p.target;
    const moved = !!(variant && variant.moved === key);
    let cls = "product-block" + (isTarget ? " target" : "") + (moved ? " moved" : "");
    let badges = isTarget ? ' <span class="target-badge">target</span>' : "";
    if (moved) badges += ' <span class="moved-badge">moved to rank 1</span>';
    const body = variant ? diffHTML(base, cur) : esc(base);
    return '<div class="' + cls + '">' +
      '<div class="product-name' + (isTarget ? " tgt" : "") + '">' + esc(p.name) + badges + "</div>" +
      '<div class="product-desc">' + body + "</div></div>";
  }

  // P3 (Format) rewrites the whole document into a comparison table.
  function rawBlock(raw) {
    const rows = raw.split("\n").map(line => {
      const isTarget = /MegaFood/.test(line);
      return isTarget ? '<span class="ins">' + esc(line) + "</span>" : esc(line);
    }).join("\n");
    return '<div class="doc-reformat">Reformatted into a single comparison table.</div>' +
      '<pre class="doc-raw">' + rows + "</pre>";
  }

  function renderDoc(el, variant) {
    let html = "";
    if (variant && variant.prepend) {
      html += '<div class="added-block"><div class="added-label">Added: reframing paragraph</div>' +
        esc(variant.prepend) + "</div>";
    }
    if (variant && variant.raw) {
      el.innerHTML = html + rawBlock(variant.raw);
      return;
    }
    const order = (variant && variant.order) ? variant.order : D.productOrder;
    order.forEach(key => { html += productBlock(key, variant); });
    el.innerHTML = html;
  }

  function renderVariant(code) {
    const v = D.variants[code];
    if (!v) return;
    variantHead.innerHTML = dot(v.group) + GROUP_LABEL[v.group] + " · " + v.code + " " + v.name;
    renderDoc(variantEl, v);
  }

  // ---- build the dropdown ----
  let current = "M3";
  const btn = document.createElement("button");
  btn.className = "var-dd-btn";
  btn.setAttribute("aria-haspopup", "true");
  btn.setAttribute("aria-expanded", "false");

  const panel = document.createElement("div");
  panel.className = "var-dd-panel";
  panel.hidden = true;

  let panelHTML = "";
  D.groups.forEach(g => {
    panelHTML += '<div class="var-group og-' + g.key + '">' +
      '<div class="var-group-head"><i class="dot"></i>' + g.label + "</div>";
    g.items.forEach(it => {
      panelHTML += '<button class="var-opt" data-v="' + it.code + '" role="option">' +
        '<span class="code">' + it.code + "</span>" + it.name + "</button>";
    });
    panelHTML += "</div>";
  });
  panel.innerHTML = panelHTML;

  dd.appendChild(btn);
  dd.appendChild(panel);

  function setLabel(code) {
    const v = D.variants[code];
    btn.innerHTML = '<span class="var-dd-current">' + dot(v.group) + v.code + " · " + v.name +
      '</span><span class="var-dd-caret">▾</span>';
  }
  function setActiveOption(code) {
    panel.querySelectorAll(".var-opt[data-v]").forEach(o =>
      o.classList.toggle("active", o.dataset.v === code));
  }
  function open() { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); }
  function close() { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); }

  btn.addEventListener("click", e => {
    e.stopPropagation();
    panel.hidden ? open() : close();
  });
  panel.querySelectorAll(".var-opt[data-v]").forEach(o => {
    o.addEventListener("click", () => {
      current = o.dataset.v;
      setLabel(current);
      setActiveOption(current);
      renderVariant(current);
      close();
    });
  });
  document.addEventListener("click", e => { if (!dd.contains(e.target)) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  // ---- initial render ----
  renderDoc(baselineEl, null);
  setLabel(current);
  setActiveOption(current);
  renderVariant(current);
})();

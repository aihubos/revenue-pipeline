/* 노드와 연결선을 그립니다. 글은 data.js 만 고치세요. */
(function () {
  "use strict";

  var root = window.PIPELINE;
  var flowEl = document.getElementById("flow");
  var byId = {};
  var parentOf = {};
  var problems = [];
  var state = { id: null };
  var wasMobile = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function isMobile() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function badgeText(role) {
    if (role === "start") return "시작";
    if (role === "main") return "본업";
    if (role === "side") return "부업";
    return "";
  }

  var ICONS = {
    flow: '<circle cx="6" cy="7" r="2.1"/><circle cx="6" cy="17" r="2.1"/><circle cx="17.5" cy="12" r="2.1"/><path d="M8 7h3.2a4 4 0 0 1 4 4v0M8 17h3.2a4 4 0 0 0 4-4"/>',
    users: '<circle cx="9" cy="9" r="2.7"/><circle cx="16" cy="10" r="2"/><path d="M4.8 18.2c.7-2.3 2.4-3.5 4.2-3.5s3.5 1.2 4.2 3.5"/><path d="M14 14.8c1-.4 2.1-.3 3 .5.9.8 1.4 1.8 1.6 2.9"/>',
    book: '<path d="M5 5.5h5.8A2.2 2.2 0 0 1 13 7.7V19H7.2A2.2 2.2 0 0 0 5 16.8z"/><path d="M19 5.5h-5.8A2.2 2.2 0 0 0 11 7.7V19h5.8A2.2 2.2 0 0 0 19 16.8z"/>',
    home: '<path d="M4 11.2 12 5l8 6.2V20H4z"/><path d="M10 20v-5.5h4V20"/>',
    brick: '<rect x="3" y="11" width="18" height="8" rx="1.6"/><path d="M6.5 11V8h2.6v3M10.7 11V8h2.6v3M14.9 11V8H17.5v3"/>',
    play: '<path d="M9 7.2v9.6l8.2-4.8L9 7.2z"/>',
    shield: '<path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    camera: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r=".6"/>'
  };

  function iconSvg(node) {
    var name = node.icon;
    if (!ICONS[name]) {
      if (node.role === "main") name = "users";
      else if (node.role === "side") name = "play";
      else if (node.role === "start") name = "flow";
      else name = "book";
    }
    return '<svg viewBox="0 0 24 24">' + ICONS[name] + "</svg>";
  }

  function kidsOf(node) {
    var kids = node && Array.isArray(node.children) ? node.children : [];
    return kids.filter(function (kid) { return kid && byId[kid.id]; });
  }

  function indexTree(node, parent) {
    if (!node || typeof node !== "object") {
      problems.push("노드 모양이 잘못되었습니다.");
      return;
    }
    var id = String(node.id || "").trim();
    if (!id) {
      problems.push("id가 없는 노드가 있습니다: " + (node.title || "이름 없음"));
      return;
    }
    if (byId[id]) {
      problems.push("id가 겹칩니다: " + id);
      return;
    }
    byId[id] = node;
    if (parent) parentOf[id] = parent.id;
    var kids = node.children || [];
    if (!Array.isArray(kids)) {
      problems.push(id + "의 children은 목록이어야 합니다.");
      return;
    }
    kids.forEach(function (kid) { indexTree(kid, node); });
  }

  function pathSet(id) {
    var set = {};
    var cur = id;
    var guard = 0;
    while (cur && byId[cur] && guard < 40) {
      set[cur] = true;
      cur = parentOf[cur];
      guard++;
    }
    return set;
  }

  function crumbs(id) {
    var parts = [];
    var cur = id;
    var guard = 0;
    while (cur && byId[cur] && guard < 40) {
      parts.unshift(byId[cur].title || cur);
      cur = parentOf[cur];
      guard++;
    }
    return parts;
  }

  function columnTitle(depth, nodes) {
    if (depth === 0) return "시작";
    if (depth === 1) return "갈래";
    var parents = [];
    nodes.forEach(function (node) {
      var pid = parentOf[node.id];
      if (pid && parents.indexOf(pid) === -1) parents.push(pid);
    });
    if (parents.length === 1 && byId[parents[0]]) return byId[parents[0]].title + " 아래";
    return "이어지는 일";
  }

  function renderNode(node) {
    var kids = kidsOf(node);
    var hasParent = !!parentOf[node.id];
    var selected = state.id === node.id;
    var onPath = !!(state.id && pathSet(state.id)[node.id] && !selected);
    var role = node.role || "item";
    var cls = "node role-" + role;
    if (selected) cls += " is-on";
    else if (onPath) cls += " is-path";
    var badge = badgeText(role);
    var html = '<button type="button" class="' + cls + '" data-id="' + esc(node.id) + '" aria-pressed="' + (selected ? "true" : "false") + '" aria-expanded="' + (selected ? "true" : "false") + '" aria-controls="panel">';
    if (hasParent) html += '<span class="hd in" aria-hidden="true"></span>';
    html += '<span class="ico" aria-hidden="true">' + iconSvg(node) + "</span>";
    html += '<span class="tx">';
    if (badge) html += '<span class="badge">' + esc(badge) + "</span>";
    html += "<strong>" + esc(node.title || node.id) + "</strong>";
    if (node.subtitle) html += "<small>" + esc(node.subtitle) + "</small>";
    html += "</span>";
    if (kids.length) html += '<span class="hd out" aria-hidden="true"></span>';
    html += "</button>";
    return html;
  }

  function collectColumns(node, depth, cols) {
    if (!cols[depth]) cols[depth] = [];
    cols[depth].push(node);
    kidsOf(node).forEach(function (kid) { collectColumns(kid, depth + 1, cols); });
    return cols;
  }

  function renderColumns() {
    var cols = collectColumns(root, 0, []);
    var html = '<svg class="edges" id="edges" aria-hidden="true"></svg>';
    cols.forEach(function (nodes, depth) {
      if (!nodes || !nodes.length) return;
      var title = columnTitle(depth, nodes);
      html += '<section class="col" data-depth="' + depth + '" aria-label="' + esc(title) + '">';
      html += "<h2>" + esc(title) + "</h2>";
      nodes.forEach(function (node) { html += renderNode(node); });
      html += "</section>";
    });
    return html;
  }

  function renderBranch(node) {
    var kids = kidsOf(node);
    var html = '<div class="branch">' + renderNode(node);
    if (kids.length) {
      html += '<div class="kids">';
      kids.forEach(function (kid) { html += renderBranch(kid); });
      html += "</div>";
    }
    html += "</div>";
    return html;
  }

  function renderTree() {
    return '<div class="tree">' + renderBranch(root) + "</div>";
  }

  function anchor(el, side, box) {
    var r = el.getBoundingClientRect();
    return {
      x: (side === "out" ? r.right : r.left) - box.left,
      y: r.top + r.height / 2 - box.top
    };
  }

  function curve(a, b) {
    var dx = Math.max(36, Math.abs(b.x - a.x) / 2);
    return "M" + a.x.toFixed(1) + "," + a.y.toFixed(1)
      + " C" + (a.x + dx).toFixed(1) + "," + a.y.toFixed(1)
      + " " + (b.x - dx).toFixed(1) + "," + b.y.toFixed(1)
      + " " + b.x.toFixed(1) + "," + b.y.toFixed(1);
  }

  function drawEdges() {
    if (isMobile()) return;
    var svg = document.getElementById("edges");
    if (!svg || !flowEl) return;
    var box = flowEl.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) return;
    svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
    var on = state.id ? pathSet(state.id) : {};
    var html = "";
    var nodes = flowEl.querySelectorAll(".node");
    nodes.forEach(function (el) {
      var id = el.getAttribute("data-id");
      var pid = parentOf[id];
      if (!pid) return;
      var parentEl = flowEl.querySelector('.node[data-id="' + CSS.escape(pid) + '"]');
      if (!parentEl) return;
      var active = state.id && on[id] && on[pid];
      html += '<path d="' + curve(anchor(parentEl, "out", box), anchor(el, "in", box)) + '"' + (active ? ' class="on"' : "") + "></path>";
    });
    svg.innerHTML = html;
  }

  function renderPanel() {
    var panel = document.getElementById("panel");
    var scrim = document.getElementById("scrim");
    var clearBtn = document.getElementById("clear");
    var node = state.id ? byId[state.id] : null;
    document.body.classList.toggle("panel-open", !!node);
    if (clearBtn) clearBtn.hidden = !node;
    if (!node) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
      scrim.hidden = true;
      document.getElementById("panel-in").innerHTML = "";
      return;
    }
    var role = node.role || "item";
    var badge = badgeText(role) || "세부";
    var details = Array.isArray(node.details) ? node.details : [];
    var rows = details.map(function (row) {
      var label = row && row.label ? row.label : "항목";
      var text = row && row.text ? row.text : "아직 안 적음";
      return "<div><dt>" + esc(label) + "</dt><dd>" + esc(text) + "</dd></div>";
    }).join("");
    if (!rows) rows = "<div><dt>설명</dt><dd>아직 안 적음</dd></div>";
    var note = root.note || "금액은 적지 않아요. 글은 data.js에서 고칩니다.";
    document.getElementById("panel-in").innerHTML =
      '<div class="p-top"><span class="badge role-' + esc(role) + '">' + esc(badge) + '</span>'
      + '<button type="button" class="x" data-close>닫기</button></div>'
      + '<p class="p-path">' + esc(crumbs(node.id).join("  ›  ")) + "</p>"
      + "<h2>" + esc(node.title || node.id) + "</h2>"
      + (node.subtitle ? '<p class="p-sub">' + esc(node.subtitle) + "</p>" : "")
      + '<dl class="detail">' + rows + "</dl>"
      + '<p class="p-note">' + esc(note) + "</p>";
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    scrim.hidden = !isMobile();
  }

  function render() {
    var mobile = isMobile();
    wasMobile = mobile;
    flowEl.innerHTML = mobile ? renderTree() : renderColumns();
    var crumb = document.getElementById("crumb");
    var hint = document.getElementById("hint");
    if (state.id && byId[state.id]) {
      crumb.textContent = crumbs(state.id).join("  ›  ");
      hint.textContent = "같은 노드를 다시 누르거나 닫기를 누르면 설명이 접힙니다.";
    } else {
      crumb.textContent = "수입 구조";
      hint.textContent = root.hint || "노드를 누르면 설명이 열려요.";
    }
    renderPanel();
    requestAnimationFrame(function () {
      drawEdges();
      if (!state.id) return;
      var el = flowEl.querySelector('.node[data-id="' + CSS.escape(state.id) + '"]');
      if (!el) return;
      el.scrollIntoView({ block: isMobile() ? "start" : "nearest", inline: "nearest" });
    });
  }

  function showProblems() {
    var box = document.getElementById("problems");
    if (!problems.length) {
      box.innerHTML = "";
      return;
    }
    box.innerHTML = '<div class="problems" role="alert">' + problems.map(esc).join("<br>") + "</div>";
  }

  function writeUrl(id) {
    var url = new URL(location.href);
    if (id) url.searchParams.set("node", id);
    else url.searchParams.delete("node");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  function select(id, opts) {
    opts = opts || {};
    if (id && !byId[id]) id = null;
    state.id = id;
    if (opts.url !== false) writeUrl(id);
    render();
    var live = document.getElementById("live");
    if (opts.announce !== false) {
      live.textContent = id && byId[id] ? byId[id].title + " 설명을 열었습니다." : "설명을 닫았습니다.";
    }
    if (opts.focus && id) {
      var el = flowEl.querySelector('.node[data-id="' + CSS.escape(id) + '"]');
      if (el) el.focus();
    }
  }

  if (!root || typeof root !== "object") {
    flowEl.innerHTML = '<p class="problems">data.js의 PIPELINE을 찾지 못했습니다.</p>';
    return;
  }

  indexTree(root, null);
  showProblems();
  if (!byId[root.id]) return;

  var brand = document.getElementById("brand-name");
  if (root.title) {
    brand.textContent = root.title;
    document.title = root.title;
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]") || e.target.id === "scrim" || e.target.id === "clear") {
      select(null, { focus: false });
      return;
    }
    var button = e.target.closest(".node");
    if (!button) return;
    var id = button.getAttribute("data-id");
    select(state.id === id ? null : id, { focus: true });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.id) select(null, { focus: false });
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var mobile = isMobile();
      if (mobile !== wasMobile) render();
      else {
        drawEdges();
        var scrim = document.getElementById("scrim");
        if (scrim) scrim.hidden = !mobile || !state.id;
      }
    }, 80);
  });

  if (window.ResizeObserver) {
    new ResizeObserver(function () { drawEdges(); }).observe(flowEl);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawEdges);
  window.addEventListener("load", drawEdges);

  var initial = null;
  try { initial = new URLSearchParams(location.search).get("node"); } catch (err) { initial = null; }
  select(initial, { focus: false, announce: false });
})();

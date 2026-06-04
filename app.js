const { sampleText, modeLabels, seedCases, analyzeText, encodeCase, decodeCase } = window.SlopCore;
const docketStorageKey = "slopcourt.docket.v1";

const state = {
  result: null,
  lastText: sampleText,
  docket: [],
  staticCases: [],
  docketFilter: "all",
  docketSort: "featured"
};

const caseInput = document.querySelector("#case-input");
const chaosRange = document.querySelector("#chaos-range");
const seriousToggle = document.querySelector("#serious-toggle");
const friendlyToggle = document.querySelector("#friendly-toggle");
const verdictTitle = document.querySelector("#verdict-title");
const verdictStamp = document.querySelector("#verdict-stamp");
const caseId = document.querySelector("#case-id");
const chargesList = document.querySelector("#charges-list");
const fixesList = document.querySelector("#fixes-list");
const signalCanvas = document.querySelector("#signal-canvas");
const shareCanvas = document.querySelector("#share-canvas");
const docketList = document.querySelector("#docket-list");

function selectedMode() {
  const input = document.querySelector('input[name="mode"]:checked');
  return input ? input.value : "pitch";
}

function resultFromCase(caseFile) {
  return analyzeText(caseFile.text, {
    mode: caseFile.mode,
    chaos: caseFile.chaos,
    serious: caseFile.serious,
    friendly: caseFile.friendly
  });
}

function renderResult(result) {
  state.result = result;
  verdictTitle.textContent = result.verdict.title;
  verdictStamp.textContent = result.verdict.stamp;
  verdictStamp.style.color = result.verdict.color;
  caseId.textContent = result.id;

  document.querySelector("#slop-score").textContent = result.scores.slop;
  document.querySelector("#meme-score").textContent = result.scores.meme;
  document.querySelector("#proof-score").textContent = result.scores.proof;
  document.querySelector("#change-score").textContent = result.scores.change;

  renderList(chargesList, result.charges);
  renderList(fixesList, result.fixes);
  drawSignalCanvas(result);
  drawShareCanvas(result);
}

function renderList(node, items) {
  node.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    })
  );
}

function drawSignalCanvas(result) {
  const ctx = signalCanvas.getContext("2d");
  const width = signalCanvas.width;
  const height = signalCanvas.height;
  const scores = [
    ["Slop", result.scores.slop, "#df2f2f"],
    ["Meme", result.scores.meme, "#1769ff"],
    ["Proof", result.scores.proof, "#1d8b5f"],
    ["Change", result.scores.change, "#f2c94c"],
    ["Swagger", result.scores.swagger, "#141414"]
  ];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(20,20,20,0.16)";
  ctx.lineWidth = 2;
  for (let x = 40; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 40; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#141414";
  ctx.font = "900 24px system-ui, sans-serif";
  ctx.fillText("PUBLIC SIGNAL SCAN", 28, 42);
  ctx.font = "800 14px system-ui, sans-serif";
  ctx.fillStyle = "#5f5b52";
  ctx.fillText(`${modeLabels[result.mode]} | ${result.id}`, 28, 66);

  const baseY = 262;
  const barWidth = 92;
  const gap = 36;
  scores.forEach(([label, value, color], index) => {
    const x = 38 + index * (barWidth + gap);
    const barHeight = Math.max(12, value * 1.55);
    ctx.fillStyle = color;
    ctx.fillRect(x, baseY - barHeight, barWidth, barHeight);
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, baseY - barHeight, barWidth, barHeight);
    ctx.fillStyle = "#141414";
    ctx.font = "950 28px system-ui, sans-serif";
    ctx.fillText(String(value), x + 12, baseY - barHeight - 10);
    ctx.font = "900 13px system-ui, sans-serif";
    ctx.fillText(label.toUpperCase(), x, baseY + 26);
  });

  drawCanvasStamp(ctx, result.verdict.stamp, width - 218, 62, result.verdict.color, 0.06);
}

function drawCanvasStamp(ctx, text, x, y, color, rotate) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 174, 62);
  ctx.font = "950 24px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), 87, 32, 150);
  ctx.restore();
}

function drawShareCanvas(result) {
  const ctx = shareCanvas.getContext("2d");
  const width = shareCanvas.width;
  const height = shareCanvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7f3ea";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#141414";
  for (let x = 0; x < width; x += 48) {
    ctx.fillRect(x, 0, 2, height);
  }
  for (let y = 0; y < height; y += 48) {
    ctx.fillRect(0, y, width, 2);
  }

  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(58, 58, width - 116, height - 116);
  ctx.strokeStyle = "#141414";
  ctx.lineWidth = 8;
  ctx.strokeRect(58, 58, width - 116, height - 116);

  ctx.fillStyle = "#df2f2f";
  ctx.fillRect(84, 86, 86, 86);
  ctx.strokeRect(84, 86, 86, 86);
  ctx.fillStyle = "#fffdf7";
  ctx.font = "950 38px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SC", 127, 131);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#141414";
  ctx.font = "950 48px system-ui, sans-serif";
  ctx.fillText("SlopCourt Verdict", 190, 122);
  ctx.font = "850 24px system-ui, sans-serif";
  ctx.fillStyle = "#5f5b52";
  ctx.fillText(`${result.id} | ${modeLabels[result.mode]} | public vibe tribunal`, 190, 160);

  ctx.fillStyle = result.verdict.color;
  ctx.font = "950 76px system-ui, sans-serif";
  wrapCanvasText(ctx, result.verdict.title.toUpperCase(), 86, 268, 680, 78, 2);

  drawCanvasStamp(ctx, result.verdict.stamp, 810, 112, result.verdict.color, -0.09);

  const scoreData = [
    ["SLOP", result.scores.slop, "#df2f2f"],
    ["MEME", result.scores.meme, "#1769ff"],
    ["PROOF", result.scores.proof, "#1d8b5f"],
    ["CHANGE", result.scores.change, "#f2c94c"]
  ];
  scoreData.forEach(([label, value, color], index) => {
    const x = 88 + index * 260;
    const y = 392;
    ctx.fillStyle = "#fffdf7";
    ctx.fillRect(x, y, 210, 108);
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 5;
    ctx.strokeRect(x, y, 210, 108);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 210, 14);
    ctx.fillStyle = "#141414";
    ctx.font = "950 44px system-ui, sans-serif";
    ctx.fillText(String(value), x + 18, y + 68);
    ctx.font = "900 18px system-ui, sans-serif";
    ctx.fillStyle = "#5f5b52";
    ctx.fillText(label, x + 20, y + 94);
  });

  ctx.fillStyle = "#141414";
  ctx.font = "850 22px system-ui, sans-serif";
  const charge = result.charges[0] || "No major offense.";
  wrapCanvasText(ctx, charge, 86, 558, 940, 28, 2);
  ctx.fillStyle = "#df2f2f";
  ctx.fillRect(1018, 536, 96, 32);
  ctx.fillStyle = "#fffdf7";
  ctx.font = "950 16px system-ui, sans-serif";
  ctx.fillText("TRY IT", 1038, 558);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/);
  let line = "";
  let lines = 0;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      line = word;
      lines += 1;
      if (lines >= maxLines) {
        return;
      }
    } else {
      line = test;
    }
  }

  if (line && lines < maxLines) {
    ctx.fillText(line, x, y + lines * lineHeight);
  }
}

function runAnalysis() {
  const text = caseInput.value.trim();
  const input = text || sampleText;
  const result = analyzeText(input, {
    mode: selectedMode(),
    chaos: chaosRange.value,
    serious: seriousToggle.checked,
    friendly: friendlyToggle.checked
  });
  state.lastText = input;
  renderResult(result);
}

function currentCaseFile() {
  return {
    text: caseInput.value.trim() || sampleText,
    mode: selectedMode(),
    chaos: Number(chaosRange.value),
    serious: seriousToggle.checked,
    friendly: friendlyToggle.checked
  };
}

function applyCaseFile(caseFile) {
  caseInput.value = caseFile.text;
  const mode = document.querySelector(`input[name="mode"][value="${caseFile.mode}"]`);
  if (mode) {
    mode.checked = true;
  }
  chaosRange.value = caseFile.chaos;
  seriousToggle.checked = Boolean(caseFile.serious);
  friendlyToggle.checked = Boolean(caseFile.friendly);
  runAnalysis();
}

function caseSummary(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 150) {
    return clean;
  }
  return `${clean.slice(0, 147)}...`;
}

function casePermalink(caseFile) {
  const url = new URL(window.location.href);
  url.hash = `case=${encodeCase(caseFile)}`;
  return url.toString();
}

function readStoredDocket() {
  try {
    const raw = window.localStorage.getItem(docketStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredDocket(items) {
  try {
    window.localStorage.setItem(docketStorageKey, JSON.stringify(items.slice(0, 18)));
  } catch {
    // Some embedded browsers disable storage. Keep the in-memory docket usable.
  }
}

function docketEntries() {
  const localCases = state.docket.map((item) => ({ ...item, source: "Filed" }));
  const publicCases = state.staticCases.length ? state.staticCases : seedCases;
  return [...localCases, ...publicCases];
}

async function loadStaticDocket() {
  try {
    const response = await fetch("docket.json", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    const cases = Array.isArray(data.cases) ? data.cases : [];
    state.staticCases = cases
      .filter((item) => item && item.text && item.mode)
      .map((item) => ({
        text: item.text,
        mode: item.mode,
        chaos: Number(item.chaos || 6),
        serious: item.serious !== false,
        friendly: Boolean(item.friendly),
        source: item.source || "Public",
        url: item.url || "",
        cardUrl: item.cardUrl || "",
        result: item.result || null
      }));
  } catch {
    state.staticCases = [];
  }
}

function renderDocket() {
  const entries = docketEntries()
    .map((caseFile) => ({
      caseFile,
      result: caseFile.result || resultFromCase(caseFile)
    }))
    .filter(({ caseFile }) => state.docketFilter === "all" || caseFile.mode === state.docketFilter)
    .sort((a, b) => {
      if (state.docketSort === "featured") {
        return 0;
      }
      return b.result.scores[state.docketSort] - a.result.scores[state.docketSort];
    });

  if (!entries.length) {
    docketList.replaceChildren(Object.assign(document.createElement("p"), { textContent: "No filed cases match this filter." }));
    return;
  }

  docketList.replaceChildren(
    ...entries.map(({ caseFile, result }, index) => {
      const card = document.createElement("article");
      card.className = "docket-card";

      const header = document.createElement("header");
      const title = document.createElement("h3");
      title.textContent = result.verdict.title;
      const rank = document.createElement("span");
      rank.className = "rank-badge";
      rank.textContent = `#${index + 1}`;
      const badge = document.createElement("span");
      badge.className = "docket-badge";
      badge.style.color = result.verdict.color;
      badge.textContent = result.verdict.stamp;
      const badges = document.createElement("div");
      badges.className = "docket-badges";
      badges.append(rank, badge);
      header.append(title, badges);

      const body = document.createElement("p");
      body.textContent = caseSummary(caseFile.text);

      const scores = document.createElement("div");
      scores.className = "docket-scores";
      [
        ["Slop", result.scores.slop],
        ["Meme", result.scores.meme],
        ["Proof", result.scores.proof],
        ["Change", result.scores.change]
      ].forEach(([label, value]) => {
        const score = document.createElement("span");
        score.innerHTML = `<strong>${value}</strong>${label}`;
        scores.append(score);
      });

      const meta = document.createElement("p");
      meta.textContent = `${result.id} | ${modeLabels[caseFile.mode]} | ${caseFile.source || "Filed"}`;

      const actions = document.createElement("div");
      actions.className = "docket-actions";
      const load = document.createElement("button");
      load.type = "button";
      load.textContent = "Load";
      load.addEventListener("click", () => {
        applyCaseFile(caseFile);
        document.querySelector("#court").scrollIntoView({ behavior: "smooth" });
      });
      const copy = document.createElement("button");
      copy.type = "button";
      copy.textContent = "Copy link";
      copy.addEventListener("click", () => copyText(casePermalink(caseFile), copy, "Copied"));
      actions.append(load, copy);

      if (caseFile.url) {
        const pageLink = document.createElement("a");
        pageLink.className = "case-page-link";
        pageLink.href = caseFile.url;
        pageLink.textContent = "Case page";
        actions.append(pageLink);
      }

      if (caseFile.cardUrl) {
        const cardLink = document.createElement("a");
        cardLink.className = "case-page-link secondary";
        cardLink.href = caseFile.cardUrl;
        cardLink.textContent = "Card";
        actions.append(cardLink);
      }

      card.append(header, body, scores, meta, actions);
      return card;
    })
  );
}

async function copyText(text, button, copiedLabel = "Copied") {
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = copiedLabel;
  } catch {
    window.prompt("Copy", text);
  }
  window.setTimeout(() => {
    button.textContent = original;
  }, 1300);
}

function fileCurrentCase() {
  const caseFile = currentCaseFile();
  const result = resultFromCase(caseFile);
  const filed = {
    ...caseFile,
    filedAt: new Date().toISOString(),
    id: result.id
  };
  state.docket = [filed, ...state.docket.filter((item) => item.id !== result.id)].slice(0, 18);
  writeStoredDocket(state.docket);
  renderDocket();
  document.querySelector("#docket").scrollIntoView({ behavior: "smooth" });
}

function downloadCurrentCase() {
  const caseFile = currentCaseFile();
  const result = resultFromCase(caseFile);
  const payload = {
    id: result.id.toLowerCase().replace(/\s+/g, "-"),
    title: result.verdict.title,
    source: "Community",
    ...caseFile
  };
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.download = `${payload.id}.json`;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}

function loadHashCase() {
  if (!window.location.hash.startsWith("#case=")) {
    return false;
  }

  try {
    const encoded = window.location.hash.slice("#case=".length);
    applyCaseFile(decodeCase(encoded));
    return true;
  } catch {
    return false;
  }
}

function verdictText(result) {
  return [
    `SlopCourt ${result.id}: ${result.verdict.title}`,
    `Slop ${result.scores.slop} | Meme ${result.scores.meme} | Proof ${result.scores.proof} | Change ${result.scores.change}`,
    `Charge: ${result.charges[0]}`,
    `Sentence: ${result.fixes[0]}`
  ].join("\n");
}

document.querySelector("#analyze-btn").addEventListener("click", runAnalysis);

document.querySelector("#file-btn").addEventListener("click", fileCurrentCase);

document.querySelector("#export-case-btn").addEventListener("click", downloadCurrentCase);

document.querySelector("#sample-btn").addEventListener("click", () => {
  caseInput.value = sampleText;
  runAnalysis();
});

document.querySelector("#clear-btn").addEventListener("click", () => {
  caseInput.value = "";
  caseInput.focus();
});

document.querySelector("#download-btn").addEventListener("click", () => {
  if (!state.result) {
    runAnalysis();
  }
  const link = document.createElement("a");
  link.download = `${state.result.id.toLowerCase().replace(/\s+/g, "-")}-slopcourt.png`;
  link.href = shareCanvas.toDataURL("image/png");
  link.click();
});

document.querySelector("#copy-btn").addEventListener("click", async () => {
  if (!state.result) {
    runAnalysis();
  }
  const text = verdictText(state.result);
  await copyText(text, document.querySelector("#copy-btn"));
});

document.querySelector("#permalink-btn").addEventListener("click", async () => {
  await copyText(casePermalink(currentCaseFile()), document.querySelector("#permalink-btn"));
});

document.querySelector("#random-case-btn").addEventListener("click", () => {
  const entries = docketEntries();
  const random = entries[Math.floor(Math.random() * entries.length)];
  applyCaseFile(random);
  document.querySelector("#court").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll('input[name="mode"], #serious-toggle, #friendly-toggle').forEach((input) => {
  input.addEventListener("change", runAnalysis);
});

document.querySelectorAll(".docket-filter").forEach((button) => {
  button.addEventListener("click", () => {
    state.docketFilter = button.dataset.filter;
    document.querySelectorAll(".docket-filter").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderDocket();
  });
});

document.querySelectorAll(".docket-sort").forEach((button) => {
  button.addEventListener("click", () => {
    state.docketSort = button.dataset.sort;
    document.querySelectorAll(".docket-sort").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    renderDocket();
  });
});

chaosRange.addEventListener("input", runAnalysis);

async function boot() {
  state.docket = readStoredDocket();
  await loadStaticDocket();
  if (!loadHashCase()) {
    caseInput.value = sampleText;
    runAnalysis();
  }
  renderDocket();
}

boot();

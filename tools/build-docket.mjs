import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

await import("../slopcore.js");

const caseDir = new URL("../cases/", import.meta.url);
const outputFile = new URL("../docket.json", import.meta.url);
const validModes = new Set(["pitch", "agent", "post", "meme"]);
const { analyzeText, encodeCase, modeLabels } = globalThis.SlopCore;
const siteUrl = (process.env.SLOPCOURT_SITE_URL || "https://evilbotnet.github.io/slopcourt").replace(/\/$/, "");

function assertCase(file, item) {
  const required = ["id", "title", "text", "mode"];
  for (const key of required) {
    if (!item[key] || typeof item[key] !== "string") {
      throw new Error(`${file}: missing string field "${key}"`);
    }
  }

  if (!validModes.has(item.mode)) {
    throw new Error(`${file}: mode must be one of ${[...validModes].join(", ")}`);
  }

  if (typeof item.chaos !== "number" || item.chaos < 1 || item.chaos > 10) {
    throw new Error(`${file}: chaos must be a number from 1 to 10`);
  }

  if (typeof item.serious !== "boolean" || typeof item.friendly !== "boolean") {
    throw new Error(`${file}: serious and friendly must be booleans`);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function caseFileForAnalysis(item) {
  return {
    text: item.text,
    mode: item.mode,
    chaos: item.chaos,
    serious: item.serious,
    friendly: item.friendly
  };
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n");
}

function renderScore(label, value) {
  return `
            <div>
              <span>${escapeHtml(value)}</span>
              <small>${escapeHtml(label)}</small>
            </div>`;
}

function wrapText(value, maxChars, maxLines) {
  const words = String(value).replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length > maxChars && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) {
        break;
      }
    } else {
      line = test;
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  return lines;
}

function renderSvgLines(lines, x, y, lineHeight, className) {
  return lines
    .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" class="${className}">${escapeHtml(line)}</text>`)
    .join("\n");
}

function renderCardSvg(item, result) {
  const titleLines = wrapText(item.title, 24, 2);
  const chargeLines = wrapText(result.charges[0] || "No major offense.", 78, 2);
  const textLines = wrapText(item.text, 92, 2);
  const verdictY = titleLines.length > 1 ? 380 : 322;
  const bodyY = titleLines.length > 1 ? 420 : 368;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeHtml(item.title)} SlopCourt verdict">
  <style>
    .bg { fill: #f7f3ea; }
    .paper { fill: #fffdf7; stroke: #141414; stroke-width: 8; }
    .grid { stroke: #141414; stroke-width: 2; opacity: 0.28; }
    .ink { fill: #141414; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    .muted { fill: #5f5b52; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    .brand { fill: #df2f2f; stroke: #141414; stroke-width: 6; }
    .brand-text { fill: #fffdf7; font: 950 42px Inter, ui-sans-serif, system-ui, sans-serif; }
    .title { fill: #141414; font: 950 64px Inter, ui-sans-serif, system-ui, sans-serif; }
    .meta { fill: #5f5b52; font: 850 24px Inter, ui-sans-serif, system-ui, sans-serif; }
    .verdict { fill: ${escapeHtml(result.verdict.color)}; font: 950 54px Inter, ui-sans-serif, system-ui, sans-serif; }
    .body { fill: #141414; font: 760 23px Inter, ui-sans-serif, system-ui, sans-serif; }
    .charge { fill: #141414; font: 850 22px Inter, ui-sans-serif, system-ui, sans-serif; }
    .score-label { fill: #5f5b52; font: 900 16px Inter, ui-sans-serif, system-ui, sans-serif; }
    .score-value { fill: #141414; font: 950 44px Inter, ui-sans-serif, system-ui, sans-serif; }
    .stamp { fill: none; stroke: ${escapeHtml(result.verdict.color)}; stroke-width: 7; }
    .stamp-text { fill: ${escapeHtml(result.verdict.color)}; font: 950 25px Inter, ui-sans-serif, system-ui, sans-serif; }
  </style>
  <rect class="bg" width="1200" height="630"/>
  <g>
    <path class="grid" d="M0 48H1200M0 96H1200M0 144H1200M0 192H1200M0 240H1200M0 288H1200M0 336H1200M0 384H1200M0 432H1200M0 480H1200M0 528H1200M0 576H1200"/>
    <path class="grid" d="M48 0V630M96 0V630M144 0V630M192 0V630M240 0V630M288 0V630M336 0V630M384 0V630M432 0V630M480 0V630M528 0V630M576 0V630M624 0V630M672 0V630M720 0V630M768 0V630M816 0V630M864 0V630M912 0V630M960 0V630M1008 0V630M1056 0V630M1104 0V630M1152 0V630"/>
  </g>
  <rect x="58" y="58" width="1084" height="514" class="paper"/>
  <rect x="88" y="88" width="88" height="88" class="brand"/>
  <text x="132" y="146" text-anchor="middle" class="brand-text">SC</text>
  <text x="202" y="124" class="ink" style="font: 950 48px Inter, ui-sans-serif, system-ui, sans-serif;">SlopCourt Verdict</text>
  <text x="202" y="162" class="meta">${escapeHtml(result.id)} | ${escapeHtml(modeLabels[item.mode])} | ${escapeHtml(item.source || "Public")}</text>

  <g transform="translate(814 108) rotate(-5)">
    <rect width="226" height="72" class="stamp"/>
    <text x="113" y="45" text-anchor="middle" class="stamp-text">${escapeHtml(result.verdict.stamp.toUpperCase())}</text>
  </g>

${renderSvgLines(titleLines, 88, 250, 70, "title")}
  <text x="88" y="${verdictY}" class="verdict">${escapeHtml(result.verdict.title.toUpperCase())}</text>
${renderSvgLines(textLines, 88, bodyY, 31, "body")}

  <g transform="translate(88 474)">
    ${renderScoreSvg("SLOP", result.scores.slop, 0, "#df2f2f")}
    ${renderScoreSvg("MEME", result.scores.meme, 204, "#1769ff")}
    ${renderScoreSvg("PROOF", result.scores.proof, 408, "#1d8b5f")}
    ${renderScoreSvg("CHANGE", result.scores.change, 612, "#f2c94c")}
  </g>

${renderSvgLines(chargeLines, 88, 596, 25, "charge")}
</svg>
`;
}

function renderScoreSvg(label, value, x, color) {
  return `<g transform="translate(${x} 0)">
      <rect width="168" height="80" fill="#fffdf7" stroke="#141414" stroke-width="4"/>
      <rect width="168" height="12" fill="${color}"/>
      <text x="16" y="53" class="score-value">${escapeHtml(value)}</text>
      <text x="82" y="53" class="score-label">${escapeHtml(label)}</text>
    </g>`;
}

function renderCasePage(item, result, file) {
  const caseFile = caseFileForAnalysis(item);
  const encoded = encodeCase(caseFile);
  const rootCaseLink = `../../#case=${encoded}`;
  const jsonLink = `../../cases/${encodeURIComponent(file)}`;
  const cardLink = "card.svg";
  const cardMetaLink = siteUrl ? `${siteUrl}/case/${item.id}/card.svg` : cardLink;
  const title = `${item.title} | SlopCourt`;
  const description = `${result.verdict.title}: ${result.charges[0]}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="${escapeHtml(cardMetaLink)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${escapeHtml(cardMetaLink)}">
    <link rel="stylesheet" href="../../styles.css">
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="../../" aria-label="SlopCourt home">
        <span class="brand-mark" aria-hidden="true">SC</span>
        <span>
          <strong>SlopCourt</strong>
          <small>public vibe tribunal</small>
        </span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="../../#court">Court</a>
        <a href="../../#docket">Docket</a>
        <a href="${rootCaseLink}">Load Case</a>
      </nav>
      <span class="status-chip">Static Case</span>
    </header>

    <main>
      <article class="case-page panel">
        <div class="case-page-head">
          <div>
            <div class="section-kicker">Case file</div>
            <h1>${escapeHtml(item.title)}</h1>
            <p class="lede">${escapeHtml(modeLabels[item.mode])} | ${escapeHtml(item.source || "Public")} | ${escapeHtml(result.id)}</p>
          </div>
          <span class="verdict-stamp" style="color: ${escapeHtml(result.verdict.color)}">${escapeHtml(result.verdict.stamp)}</span>
        </div>

        <blockquote>${escapeHtml(item.text)}</blockquote>

        <figure class="case-card-preview">
          <img src="${cardLink}" alt="Share card for ${escapeHtml(item.title)}">
        </figure>

        <section class="case-verdict-grid" aria-label="Case verdict">
          <div>
            <div class="section-kicker">Verdict</div>
            <h2>${escapeHtml(result.verdict.title)}</h2>
            <div class="score-grid">
${[
  renderScore("Slop index", result.scores.slop),
  renderScore("Meme velocity", result.scores.meme),
  renderScore("Proof density", result.scores.proof),
  renderScore("Change potential", result.scores.change)
].join("\n")}
            </div>
          </div>
          <div class="result-columns">
            <div>
              <h3>Charges</h3>
              <ul>${renderList(result.charges)}</ul>
            </div>
            <div>
              <h3>Sentence</h3>
              <ul>${renderList(result.fixes)}</ul>
            </div>
          </div>
        </section>

        <div class="case-page-actions">
          <a class="case-page-link" href="${rootCaseLink}">Open in court</a>
          <a class="case-page-link secondary" href="${cardLink}">View card</a>
          <a class="case-page-link secondary" href="${jsonLink}">View JSON</a>
          <a class="case-page-link secondary" href="../../#docket">Back to docket</a>
        </div>
      </article>
    </main>
  </body>
</html>
`;
}

const files = (await readdir(caseDir))
  .filter((file) => file.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b));

const cases = [];
const ids = new Set();

for (const file of files) {
  const raw = await readFile(join(fileURLToPath(caseDir), file), "utf8");
  const item = JSON.parse(raw);
  assertCase(file, item);

  if (ids.has(item.id)) {
    throw new Error(`${file}: duplicate case id "${item.id}"`);
  }

  ids.add(item.id);
  const result = analyzeText(item.text, item);
  const pageUrl = `case/${item.id}/`;
  const cardUrl = `${pageUrl}card.svg`;
  const pageDir = new URL(`../${pageUrl}`, import.meta.url);
  await mkdir(pageDir, { recursive: true });
  await writeFile(new URL("card.svg", pageDir), renderCardSvg(item, result));
  await writeFile(new URL("index.html", pageDir), renderCasePage(item, result, file));

  cases.push({
    id: item.id,
    title: item.title,
    source: item.source || "Public",
    url: pageUrl,
    cardUrl,
    result,
    text: item.text,
    mode: item.mode,
    chaos: item.chaos,
    serious: item.serious,
    friendly: item.friendly
  });
}

const docket = {
  version: 1,
  generatedAt: new Date().toISOString(),
  cases
};

await writeFile(outputFile, `${JSON.stringify(docket, null, 2)}\n`);
console.log(`Built docket.json, ${cases.length} static case pages, and ${cases.length} share cards.`);

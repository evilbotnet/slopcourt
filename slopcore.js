(function attachSlopCore(root) {
  const sampleText = `We are building an agentic AI-native platform that supercharges enterprise teams with autonomous workflows. Our copilot leverages MCP integrations to democratize productivity and unlock 10x output across every department. It is seamless, personalized, and built for the future of work.`;

  const buzzwords = [
    "agentic",
    "autonomous",
    "ai-native",
    "supercharge",
    "unlock",
    "democratize",
    "seamless",
    "personalized",
    "future of",
    "10x",
    "copilot",
    "leverage",
    "workflow",
    "frictionless",
    "paradigm",
    "disrupt",
    "transform",
    "moat",
    "mcp",
    "agi",
    "agent",
    "enterprise-grade",
    "end-to-end",
    "revolutionize",
    "scale"
  ];

  const proofWords = [
    "revenue",
    "paid",
    "users",
    "customers",
    "retention",
    "conversion",
    "latency",
    "benchmark",
    "dataset",
    "case study",
    "pilot",
    "shipped",
    "deployed",
    "integration",
    "security",
    "audit",
    "cost",
    "minutes",
    "hours",
    "before",
    "after"
  ];

  const humanSignals = [
    "we tried",
    "we learned",
    "i built",
    "users said",
    "screenshot",
    "receipt",
    "manual",
    "because",
    "actually",
    "failed",
    "boring",
    "painful",
    "specific"
  ];

  const modeLabels = {
    pitch: "Founder pitch",
    agent: "Agent demo",
    post: "LinkedIn post",
    meme: "Meme drop"
  };

  const seedCases = [
    {
      text: "Our AI-native copilot unlocks agentic productivity for modern revenue teams. It transforms every workflow with seamless intelligence and gives leaders a 10x operating system for growth.",
      mode: "pitch",
      chaos: 7,
      serious: true,
      friendly: false,
      source: "Seed"
    },
    {
      text: "The support agent completed 312 refund triage tasks last week. It resolved 68% without escalation, flagged 19 policy conflicts, and posts every tool call plus failure reason into the audit log.",
      mode: "agent",
      chaos: 5,
      serious: true,
      friendly: true,
      source: "Seed"
    },
    {
      text: "Hot take: if your AI agent cannot show logs, permissions, and failure states, it is not an agent demo. It is theater with a progress bar.",
      mode: "post",
      chaos: 8,
      serious: true,
      friendly: false,
      source: "Seed"
    },
    {
      text: "founder: our agent is autonomous. agent: please paste your password into the shared spreadsheet.",
      mode: "meme",
      chaos: 9,
      serious: false,
      friendly: false,
      source: "Seed"
    }
  ];

  function clamp(value, min = 0, max = 99) {
    return Math.max(min, Math.min(max, Math.round(value)));
  }

  function normalize(text) {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
  }

  function countMatches(text, terms) {
    const lower = normalize(text);
    return terms.reduce((total, term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = term.includes(" ")
        ? new RegExp(escaped, "g")
        : new RegExp(`\\b${escaped}\\b`, "g");
      const matches = lower.match(pattern);
      return total + (matches ? matches.length : 0);
    }, 0);
  }

  function collectHits(text, terms, limit = 6) {
    const lower = normalize(text);
    return terms.filter((term) => lower.includes(term)).slice(0, limit);
  }

  function hashText(text) {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return Math.abs(hash >>> 0);
  }

  function chooseVerdict(slop, meme, proof, change) {
    if (change >= 74 && proof >= 58 && slop < 58) {
      return {
        title: "Dangerously useful",
        stamp: "Vibe acquitted",
        color: "#1d8b5f"
      };
    }

    if (slop >= 78) {
      return {
        title: "Guilty of premium slop",
        stamp: "Guilty",
        color: "#df2f2f"
      };
    }

    if (slop >= 58) {
      return {
        title: "Remanded to human review",
        stamp: "Rewrite",
        color: "#1769ff"
      };
    }

    if (meme >= 72 && proof < 46) {
      return {
        title: "Funny, but unproven",
        stamp: "Post bait",
        color: "#a66a00"
      };
    }

    return {
      title: "Probation: decent vibes",
      stamp: "Passable",
      color: "#1d8b5f"
    };
  }

  function buildCharges(metrics) {
    const charges = [];

    if (metrics.buzzCount > 0) {
      charges.push(`Buzzword possession: ${metrics.hits.join(", ") || "generic AI language"}.`);
    }

    if (metrics.proofCount === 0 && metrics.numberCount === 0) {
      charges.push("No receipts: zero numbers, benchmarks, users, revenue, or shipped proof.");
    } else if (metrics.proofCount < 2 && metrics.numberCount < 2) {
      charges.push("Thin receipts: some signal, but not enough to survive a skeptical group chat.");
    }

    if (metrics.aiCount >= 4) {
      charges.push("AI incantation loop: says AI often without naming the user pain clearly.");
    }

    if (metrics.avgSentence > 28) {
      charges.push("Run-on ambition: long sentences make the claim feel inflated.");
    }

    if (metrics.exclaimCount > 1) {
      charges.push("Launch-post overheat: excitement is doing work the evidence should do.");
    }

    if (metrics.wordCount < 18) {
      charges.push("Under-filed case: too short to judge beyond raw vibes.");
    }

    if (metrics.mode === "agent" && metrics.proofCount < 2) {
      charges.push("Agent demo gap: no tool logs, task completion rate, or failure mode disclosed.");
    }

    if (!charges.length) {
      charges.push("Minor formatting offense: the court found no major slop pattern.");
    }

    return charges.slice(0, 5);
  }

  function buildFixes(input) {
    const fixes = [];

    if (input.hits.length) {
      fixes.push(`Replace "${input.hits[0]}" with a concrete action, user, and before/after result.`);
    }

    if (input.numberCount < 2) {
      fixes.push("Add two numbers: time saved, cost reduced, users served, revenue, or eval score.");
    }

    if (input.proofCount < 2) {
      fixes.push("Attach one receipt: screenshot, benchmark, customer quote, log, or demo recording.");
    }

    if (input.mode === "agent") {
      fixes.push("Show the agent's tools, permissions, success criteria, and what happens when it fails.");
    }

    if (input.mode === "meme") {
      fixes.push("Make the punchline portable: one phrase people can quote without context.");
    }

    if (input.serious) {
      fixes.push("Operator note: split claim, proof, and ask into three short blocks before posting.");
    }

    if (input.friendly) {
      fixes.push("Founder-friendly sentence: the idea may be real, but the public claim needs receipts.");
    }

    if (!fixes.length) {
      fixes.push("Ship it, then rerun the court after the first public replies arrive.");
    }

    return fixes.slice(0, 5);
  }

  function analyzeText(text, options) {
    const clean = text.trim();
    const words = clean.match(/\b[\w'-]+\b/g) || [];
    const wordCount = words.length;
    const numberCount = (clean.match(/\b\d+([.,]\d+)?%?\b/g) || []).length;
    const urlCount = (clean.match(/https?:\/\/|www\./gi) || []).length;
    const aiCount = (clean.match(/\b(ai|llm|model|agent|agents|gpt|claude|gemini)\b/gi) || []).length;
    const buzzCount = countMatches(clean, buzzwords);
    const proofCount = countMatches(clean, proofWords);
    const humanCount = countMatches(clean, humanSignals);
    const uppercaseCount = (clean.match(/[A-Z]{3,}/g) || []).length;
    const exclaimCount = (clean.match(/!/g) || []).length;
    const sentenceCount = Math.max(1, (clean.match(/[.!?]/g) || []).length);
    const avgSentence = wordCount / sentenceCount;
    const chaos = Number(options.chaos);

    const modeBias = {
      pitch: { slop: 4, meme: 2, change: 6 },
      agent: { slop: 8, meme: 4, change: 8 },
      post: { slop: 10, meme: 5, change: 1 },
      meme: { slop: -4, meme: 14, change: -2 }
    }[options.mode] || { slop: 4, meme: 2, change: 6 };

    const proofScore = clamp(
      proofCount * 13 + numberCount * 8 + urlCount * 10 + humanCount * 5 + Math.min(wordCount, 240) / 8
    );

    const slopScore = clamp(
      30 +
        buzzCount * 7 +
        aiCount * 2.5 +
        uppercaseCount * 2 +
        exclaimCount * 4 +
        Math.max(0, avgSentence - 24) * 1.5 +
        chaos * 2 +
        modeBias.slop -
        proofScore * 0.45 -
        humanCount * 4
    );

    const memeScore = clamp(
      22 +
        chaos * 6 +
        Math.min(35, buzzCount * 3) +
        exclaimCount * 5 +
        (wordCount < 90 ? 12 : 0) +
        (normalize(clean).includes("slop") ? 12 : 0) +
        modeBias.meme
    );

    const changeScore = clamp(
      24 +
        proofScore * 0.62 +
        numberCount * 5 +
        urlCount * 5 +
        (wordCount > 45 && wordCount < 180 ? 9 : 0) +
        modeBias.change -
        slopScore * 0.19
    );

    const swaggerScore = clamp(20 + buzzCount * 8 + aiCount * 3 + chaos * 4 + modeBias.slop);
    const hits = collectHits(clean, buzzwords);
    const proofHits = collectHits(clean, proofWords, 5);
    const charges = buildCharges({
      buzzCount,
      hits,
      proofCount,
      proofHits,
      numberCount,
      aiCount,
      avgSentence,
      exclaimCount,
      wordCount,
      slopScore,
      mode: options.mode
    });
    const fixes = buildFixes({
      charges,
      proofCount,
      numberCount,
      mode: options.mode,
      serious: options.serious,
      friendly: options.friendly,
      hits
    });

    const verdict = chooseVerdict(slopScore, memeScore, proofScore, changeScore);
    const id = `CASE ${String(hashText(clean || "empty") % 10000).padStart(4, "0")}`;

    return {
      id,
      verdict,
      mode: options.mode,
      scores: {
        slop: slopScore,
        meme: memeScore,
        proof: proofScore,
        change: changeScore,
        swagger: swaggerScore
      },
      charges,
      fixes,
      hits,
      proofHits,
      wordCount
    };
  }

  function encodeCase(caseFile) {
    const json = JSON.stringify(caseFile);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(json, "utf8").toString("base64url");
    }

    const bytes = new TextEncoder().encode(json);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decodeCase(encoded) {
    if (typeof Buffer !== "undefined") {
      return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    }

    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  root.SlopCore = {
    sampleText,
    modeLabels,
    seedCases,
    analyzeText,
    encodeCase,
    decodeCase,
    hashText
  };
})(globalThis);

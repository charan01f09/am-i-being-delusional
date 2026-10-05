const STORAGE_KEY = "delulu-history-v1";
const MAX_HISTORY = 12;

const AI_ENDPOINT = "/api/analyze";

const situationInput = document.querySelector("#situation");
const characterCount = document.querySelector("#character-count");
const selectedCategoryLabel = document.querySelector("#selected-category");
const analyzeButton = document.querySelector("#analyze-button");
const emptyState = document.querySelector("#empty-state");
const loadingState = document.querySelector("#loading-state");
const resultState = document.querySelector("#result-state");
const loadingMessage = document.querySelector("#loading-message");
const scoreNumber = document.querySelector("#score-number");
const scoreMeter = document.querySelector("#score-meter");
const meterThumb = document.querySelector("#meter-thumb");
const meterBlocks = document.querySelector("#meter-blocks");
const scoreFace = document.querySelector("#score-face");
const overthinkingScore = document.querySelector("#overthinking-score");
const overthinkingMeter = document.querySelector("#overthinking-meter");
const verdictText = document.querySelector("#verdict-text");
const realityText = document.querySelector("#reality-text");
const adviceText = document.querySelector("#advice-text");
const overthinkingNote = document.querySelector("#overthinking-note");
const grassCallout = document.querySelector("#grass-callout");
const grassTitle = document.querySelector("#grass-title");
const grassMessage = document.querySelector("#grass-message");
const toast = document.querySelector("#toast");
const historyList = document.querySelector("#history-list");
const historyEmpty = document.querySelector("#history-empty");

let selectedCategory = "Random";
let currentAnalysis = null;
let loadingInterval = null;
let toastTimeout = null;

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function choose(list, seed = 0) {
  return list[Math.abs(seed) % list.length];
}

function hashText(text) {
  return [...text].reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0);
}

function setMeterBlocks(score) {
  meterBlocks.innerHTML = "";
  for (let index = 0; index < 20; index += 1) {
    const block = document.createElement("span");
    if (index < Math.ceil(score / 5)) block.classList.add("is-on");
    meterBlocks.appendChild(block);
  }
}

function renderAnalysis(a) {
  currentAnalysis = a;
  const num = Number.isNaN(a.delusion) ? "NaN" : a.delusion;
  scoreNumber.textContent = num;
  overthinkingScore.textContent = Number.isNaN(a.overthinking) ? "NaN" : a.overthinking;
  scoreFace.textContent = a.face || Delulu.faceOf(a.delusion);
  verdictText.textContent = a.verdict;
  realityText.textContent = a.reality;
  adviceText.textContent = a.advice;
  overthinkingNote.textContent = a.note || "";
  const d = Number.isNaN(a.delusion) ? 100 : a.delusion, o = Number.isNaN(a.overthinking) ? 100 : a.overthinking;
  scoreMeter.style.width = d + "%"; meterThumb.style.left = d + "%"; overthinkingMeter.style.width = o + "%";
  setMeterBlocks(d);
  const badge = document.querySelector("#result-badge");
  const extra = [a.rare && "RARE OUTCOME: " + a.rare, a.night, a.repeat].filter(Boolean).join(" · ");
  badge.textContent = extra || (a.tag ? "TIER: " + a.tag : "");
  badge.classList.toggle("is-rare", Boolean(a.rare || a.egg === "delulu"));
  resultState.classList.toggle("is-meltdown", d >= 95); resultState.classList.toggle("is-glitch", a.egg === "glitch");
  resultState.classList.remove("is-hidden"); emptyState.classList.add("is-hidden"); loadingState.classList.add("is-hidden");
  resultState.style.animation = "none"; void resultState.offsetWidth; resultState.style.animation = "";
  if (d >= 95) { document.body.classList.add("shake"); setTimeout(() => document.body.classList.remove("shake"), 700); confetti(["🚨", "🧠", "💀", "🫠"]); }
  if (a.egg === "delulu" || a.egg === "right") confetti(["👑", "✨", "🌱"]);
  if (a.egg && Delulu.unlock(a.egg)) { announce("🥚 Secret unlocked: " + Delulu.dex[a.egg]); renderDex(); }
  if (window.innerWidth < 880) resultState.scrollIntoView({ behavior: "smooth", block: "start" });
}

function confetti(list) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span"); s.className = "confetti"; s.textContent = Delulu.R(list);
    s.style.left = Math.random() * 100 + "vw"; s.style.animationDelay = Math.random() * .5 + "s"; s.style.fontSize = 18 + Math.random() * 20 + "px";
    document.body.appendChild(s); setTimeout(() => s.remove(), 2600);
  }
}

function renderDex() {
  const f = Delulu.found(), all = Object.keys(Delulu.dex);
  document.querySelector("#dex-count").textContent = f.length + "/" + all.length;
  document.querySelector("#dex-list").innerHTML = all.map((k) => "<li class='" + (f.includes(k) ? "on" : "") + "'>" + (f.includes(k) ? Delulu.dex[k] : "???") + "</li>").join("");
}

function discover(id, msg) { if (Delulu.unlock(id)) { announce("🥚 Secret unlocked: " + Delulu.dex[id] + (msg ? " — " + msg : "")); renderDex(); } }

function showLoading() {
  emptyState.classList.add("is-hidden"); resultState.classList.add("is-hidden"); loadingState.classList.remove("is-hidden");
  const msgs = [...Delulu.loading].sort(() => Math.random() - .5); let i = 0;
  loadingMessage.textContent = msgs[0];
  loadingInterval = window.setInterval(() => { i = (i + 1) % msgs.length; loadingMessage.textContent = msgs[i]; }, 850);
}

function stopLoading() {
  if (loadingInterval) window.clearInterval(loadingInterval);
  loadingInterval = null;
}

function announce(message) {
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function readHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveHistory(analysis) {
  const entry = { ...analysis, id: Date.now(), date: new Date().toISOString() };
  const nextHistory = [entry, ...readHistory()].slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
  } catch {
    announce("Analysis saved for this session, but browser storage is unavailable.");
  }
  renderHistory();
}

function renderHistory() {
  const history = readHistory();
  historyList.querySelectorAll(".history-item").forEach((item) => item.remove());
  historyEmpty.classList.toggle("is-hidden", history.length > 0);
  history.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "history-item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `Load analysis: ${entry.text}`);
    const meta = document.createElement("div");
    meta.className = "history-meta";
    const score = document.createElement("span");
    score.className = "history-score";
    score.textContent = `${entry.delusion}%`;
    const date = document.createElement("time");
    date.textContent = new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    meta.append(score, date);
    const text = document.createElement("p");
    text.textContent = entry.text;
    const category = document.createElement("span");
    category.className = "history-category";
    category.textContent = entry.category;
    item.append(meta, text, category);
    const loadEntry = () => {
      situationInput.value = entry.text;
      selectedCategory = entry.category;
      updateCategoryUI();
      updateCharacterCount();
      renderAnalysis(entry);
      announce("Archived spiral reopened. The evidence is back on the desk.");
    };
    item.addEventListener("click", loadEntry);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); loadEntry(); }
    });
    historyList.appendChild(item);
  });
}

function updateCharacterCount() {
  characterCount.textContent = `${situationInput.value.length} / 500`;
}

function updateCategoryUI() {
  document.querySelectorAll(".category-chip").forEach((chip) => {
    const isSelected = chip.dataset.category === selectedCategory;
    chip.classList.toggle("is-selected", isSelected);
    chip.setAttribute("aria-pressed", String(isSelected));
  });
  selectedCategoryLabel.textContent = selectedCategory;
}

function resetExperience() {
  stopLoading();
  situationInput.value = "";
  selectedCategory = "Random";
  updateCategoryUI();
  updateCharacterCount();
  resultState.classList.add("is-hidden");
  loadingState.classList.add("is-hidden");
  emptyState.classList.remove("is-hidden");
  grassCallout.classList.add("is-hidden");
  situationInput.focus();
}

function getShareText() {
  if (!currentAnalysis) return "";
  return `AM I BEING DELUSIONAL? 🧠\n\nDelusion score: ${currentAnalysis.delusion}%\nOverthinking: ${currentAnalysis.overthinking}%\nVerdict: ${verdictText.textContent}\nReality check: ${realityText.textContent}\nAdvice: ${adviceText.textContent}`;
}

async function copyResult() {
  const text = getShareText();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    announce("Result copied. Go forth and send the evidence.");
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
    announce("Result copied using the backup plan.");
  }
}

async function shareResult() {
  const text = getShareText();
  if (!text) return;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Am I Being Delusional?", text });
      announce("Evidence shared. May the group chat be kind.");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyResult();
}

let aiOff = sessionStorage.getItem("delulu-ai-off") === "1", lastText = "", repeats = 0, analyzeCount = 0, worseLevel = 0;
const setBtn = (t) => { document.querySelector(".btn-label").textContent = t; };

async function askAI(text, category) {
  if (aiOff) return null;
  try {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 9000);
    const res = await fetch(AI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, category }), signal: ctl.signal });
    clearTimeout(timer);
    if (!res.ok) { if (res.status === 404 || res.status === 405 || res.status === 501) { aiOff = true; sessionStorage.setItem("delulu-ai-off", "1"); } return null; }
    const j = await res.json();
    return j && typeof j.verdict === "string" ? j : null;
  } catch { return null; }
}

async function analyze() {
  if (analyzeButton.disabled) return;
  const text = situationInput.value.trim();
  if (!text) { situationInput.focus(); situationInput.classList.add("nudge"); setTimeout(() => situationInput.classList.remove("nudge"), 500); announce(Delulu.R(["The council needs an actual situation, bestie.", "Empty input. Bold strategy.", "You can't be delusional about nothing. (You'd be surprised.)"])); return; }
  analyzeButton.disabled = true; setBtn("Consulting the council..."); worseLevel = 0;
  document.querySelector("#worse-button").textContent = "Make it worse 💀";
  const key = text.toLowerCase(); repeats = key === lastText ? repeats + 1 : 0; lastText = key; analyzeCount += 1;
  showLoading();
  const [ai] = await Promise.all([askAI(text, selectedCategory), new Promise((r) => setTimeout(r, 1900))]);
  stopLoading();
  let analysis = Delulu.analyze(text, selectedCategory, { last: repeats ? key : "", repeats, count: analyzeCount });
  if (analysis.crisis) {
    resultState.classList.add("is-hidden"); loadingState.classList.add("is-hidden"); emptyState.classList.remove("is-hidden");
    emptyState.querySelector("h2").textContent = "Okay, no jokes for this one.";
    emptyState.querySelector("p").textContent = "That sounds heavy. Please talk to someone you trust, or find a local helpline at findahelpline.com. You matter more than any verdict.";
  } else {
    if (ai && !analysis.egg) analysis = { ...analysis, verdict: ai.verdict, reality: ai.reality || analysis.reality, advice: ai.advice || analysis.advice, note: ai.note || analysis.note, delusion: Delulu.clamp(ai.delusion ?? analysis.delusion), overthinking: Delulu.clamp(ai.overthinking ?? analysis.overthinking), via: "ai" };
    document.querySelector("#mode-note").textContent = analysis.via === "ai" ? "✦ Roasted by AI. Text was sent to be analyzed, not stored." : "⌁ Roasted by the local brain. Nothing left your browser.";
    renderAnalysis(analysis); saveHistory(analysis);
    ["repeat", "night", "short", "melt"].forEach((id) => { if (analysis.egg === id || (id === "repeat" && analysis.repeat)) discover(id); });
  }
  analyzeButton.disabled = false; setBtn("Analyze my delusion");
  announce(Delulu.R(["Verdict delivered. Please remain calm-ish.", "The council has spoken. Loudly.", "Results are in. Sit down first."]));
}

document.querySelectorAll(".category-chip").forEach((chip) => {
  chip.addEventListener("click", () => { selectedCategory = chip.dataset.category; updateCategoryUI(); });
});

document.querySelectorAll(".example-link").forEach((button) => {
  button.addEventListener("click", () => {
    situationInput.value = button.dataset.example;
    selectedCategory = "Crush";
    updateCategoryUI();
    updateCharacterCount();
    situationInput.focus();
    announce("Classic case loaded. The evidence is suspiciously familiar.");
  });
});

situationInput.addEventListener("input", updateCharacterCount);
analyzeButton.addEventListener("click", analyze);
document.querySelector("#worse-button").addEventListener("click", (e) => {
  if (!currentAnalysis) return;
  renderAnalysis(Delulu.makeWorse(currentAnalysis, worseLevel)); worseLevel += 1;
  e.currentTarget.textContent = worseLevel >= 4 ? "Make it better (it won't) 🫠" : "Make it worse again 💀";
  announce(worseLevel >= 5 ? "Made worse 5 times. Impressive. Concerning." : "Interpretation made worse. Huge mistake.");
});
let grassCount = 0;
document.querySelector("#grass-button").addEventListener("click", () => {
  grassCount += 1;
  const [title, message] = grassCount > 4 ? ["Grass touched: " + grassCount + ". Real grass touched: 0.", "Be honest. The button is not grass."] : Delulu.grass[(grassCount - 1) % Delulu.grass.length];
  grassTitle.textContent = title; grassMessage.textContent = message; grassCallout.classList.remove("is-hidden");
  const field = document.querySelector("#grass-field"); if (field.children.length < 40) field.append(Object.assign(document.createElement("span"), { textContent: "🌱" }));
  announce("Grass mode activated. Your nervous system says thanks.");
});
document.querySelector("#random-button").addEventListener("click", () => {
  situationInput.value = Delulu.R(Delulu.random); updateCharacterCount(); announce("Random crime scene loaded. Hit analyze.");
});
document.querySelector("#brand-mark").addEventListener("click", (() => { let n = 0; return () => { n += 1; if (n === 7) { n = 0; confetti(["🧠", "💭", "🫠"]); discover("logo", "stop poking the brain"); } }; })());
(() => { const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; let p = 0;
  addEventListener("keydown", (e) => { p = e.key === code[p] ? p + 1 : 0; if (p === code.length) { p = 0; document.body.classList.add("rainbow"); setTimeout(() => document.body.classList.remove("rainbow"), 8000); announce("DELULU MODE: ON. Delulu is the solulu."); discover("konami"); } }); })();
document.querySelector("#dismiss-grass").addEventListener("click", () => grassCallout.classList.add("is-hidden"));
document.querySelector("#another-button").addEventListener("click", resetExperience);
document.querySelector("#copy-button").addEventListener("click", copyResult);
document.querySelector("#share-button").addEventListener("click", shareResult);
document.querySelector("#clear-history").addEventListener("click", () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    announce("Browser storage would not clear, but the visible history is refreshed.");
  }
  renderHistory();
  if (!toast.classList.contains("is-visible")) announce("History cleared. The evidence has been shredded.");
});
situationInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") analyze();
});

updateCategoryUI();
updateCharacterCount();
renderHistory();
renderDex();
console.log("%cIf you are reading this you are delusional. (Also try the Konami code.)","font:700 14px monospace;color:#b8f264;background:#111;padding:6px");

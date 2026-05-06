const data = window.LESSON_DATA;
const storageKey = "vierte-gewalt-lerneinheit-v1";

const state = {
  activePhaseId: data.phases[0].id,
  studentName: "",
  answers: {},
  reflections: {},
  timeNotes: []
};

const els = {
  film: document.getElementById("film"),
  videoSource: document.getElementById("video-source"),
  videoLink: document.getElementById("video-link"),
  videoFallback: document.getElementById("video-fallback"),
  studentName: document.getElementById("student-name"),
  timeNote: document.getElementById("time-note"),
  saveTimeNote: document.getElementById("save-time-note"),
  resetProgress: document.getElementById("reset-progress"),
  exportNotes: document.getElementById("export-notes"),
  progressLabel: document.getElementById("progress-label"),
  progressPercent: document.getElementById("progress-percent"),
  progressBar: document.getElementById("progress-bar"),
  phaseNav: document.getElementById("phase-nav"),
  phaseFocus: document.getElementById("phase-focus"),
  phaseTitle: document.getElementById("phase-title"),
  questionList: document.getElementById("question-list"),
  reflectionList: document.getElementById("reflection-list")
};

function load() {
  try {
    Object.assign(state, JSON.parse(localStorage.getItem(storageKey)) || {});
  } catch {
    save();
  }
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function allQuestions() {
  return data.phases.flatMap((phase) => phase.questions);
}

function getActivePhase() {
  return data.phases.find((phase) => phase.id === state.activePhaseId) || data.phases[0];
}

function getAnswerQuality(text = "") {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  if (!clean) return { label: "offen", className: "empty", hint: "Noch keine Antwort gespeichert." };
  if (words < 18) return { label: "knapp", className: "low", hint: "Ergänzen Sie mindestens einen konkreten Filmbeleg." };
  if (words < 45) return { label: "solide", className: "mid", hint: "Gut. Eine Deutung oder ein Vergleich würde die Antwort stärken." };
  return { label: "ausgeführt", className: "high", hint: "Ausführlich beantwortet. Prüfen Sie noch, ob Filmbelege und eigenes Urteil klar getrennt sind." };
}

function renderProgress() {
  const total = allQuestions().length;
  const done = allQuestions().filter((question) => (state.answers[question.id] || "").trim()).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  els.progressLabel.textContent = `${done} von ${total} beantwortet`;
  els.progressPercent.textContent = `${percent}%`;
  els.progressBar.style.width = `${percent}%`;
}

function renderPhaseNav() {
  els.phaseNav.innerHTML = data.phases
    .map((phase, index) => {
      const total = phase.questions.length;
      const done = phase.questions.filter((question) => (state.answers[question.id] || "").trim()).length;
      const active = phase.id === state.activePhaseId ? "active" : "";
      return `
        <button class="phase-button ${active}" type="button" data-phase-id="${phase.id}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(phase.title)}</strong>
          <small>${done}/${total}</small>
        </button>
      `;
    })
    .join("");
}

function renderQuestions() {
  const phase = getActivePhase();
  els.phaseFocus.textContent = phase.focus;
  els.phaseTitle.textContent = phase.title;
  els.questionList.innerHTML = phase.questions
    .map((question) => {
      const answer = state.answers[question.id] || "";
      const quality = getAnswerQuality(answer);
      return `
        <article class="question-card">
          <div class="question-meta">
            <span>${escapeHtml(question.type)}</span>
            <span class="quality ${quality.className}">${quality.label}</span>
          </div>
          <label for="${question.id}">${escapeHtml(question.question)}</label>
          <p>${escapeHtml(question.help)}</p>
          <textarea id="${question.id}" data-question-id="${question.id}" rows="6" placeholder="Antwort, Beobachtungen und Filmbelege hier notieren">${escapeHtml(answer)}</textarea>
          <div class="feedback">${escapeHtml(quality.hint)}</div>
        </article>
      `;
    })
    .join("");
}

function renderReflections() {
  els.reflectionList.innerHTML = data.reflectionPrompts
    .map((prompt, index) => {
      const id = `reflection-${index}`;
      return `
        <label class="reflection-item" for="${id}">
          <span>${escapeHtml(prompt)}</span>
          <textarea id="${id}" data-reflection-id="${id}" rows="4">${escapeHtml(state.reflections[id] || "")}</textarea>
        </label>
      `;
    })
    .join("");
}

function render() {
  els.studentName.value = state.studentName || "";
  renderProgress();
  renderPhaseNav();
  renderQuestions();
  renderReflections();
}

function exportText() {
  const lines = [];
  lines.push(data.title);
  lines.push(data.subtitle);
  lines.push("");
  lines.push(`Name: ${state.studentName || "ohne Namen"}`);
  lines.push(`Export: ${new Date().toLocaleString("de-CH")}`);
  lines.push("");

  data.phases.forEach((phase) => {
    lines.push(`# ${phase.title}`);
    phase.questions.forEach((question) => {
      lines.push("");
      lines.push(question.question);
      lines.push(state.answers[question.id]?.trim() || "[offen]");
    });
    lines.push("");
  });

  lines.push("# Gemerkte Zeitmarken");
  if (state.timeNotes.length) {
    state.timeNotes.forEach((note) => lines.push(`- ${note}`));
  } else {
    lines.push("[keine]");
  }

  lines.push("");
  lines.push("# Abschlussreflexion");
  data.reflectionPrompts.forEach((prompt, index) => {
    const id = `reflection-${index}`;
    lines.push("");
    lines.push(prompt);
    lines.push(state.reflections[id]?.trim() || "[offen]");
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "die-vierte-gewalt-notizen.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  els.phaseNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-phase-id]");
    if (!button) return;
    state.activePhaseId = button.dataset.phaseId;
    save();
    render();
  });

  els.questionList.addEventListener("input", (event) => {
    const textarea = event.target.closest("[data-question-id]");
    if (!textarea) return;
    state.answers[textarea.dataset.questionId] = textarea.value;
    save();
    renderProgress();
    renderPhaseNav();
    const card = textarea.closest(".question-card");
    const quality = getAnswerQuality(textarea.value);
    card.querySelector(".quality").className = `quality ${quality.className}`;
    card.querySelector(".quality").textContent = quality.label;
    card.querySelector(".feedback").textContent = quality.hint;
  });

  els.reflectionList.addEventListener("input", (event) => {
    const textarea = event.target.closest("[data-reflection-id]");
    if (!textarea) return;
    state.reflections[textarea.dataset.reflectionId] = textarea.value;
    save();
  });

  els.studentName.addEventListener("input", () => {
    state.studentName = els.studentName.value;
    save();
  });

  els.saveTimeNote.addEventListener("click", () => {
    const value = els.timeNote.value.trim();
    if (!value) return;
    state.timeNotes.push(value);
    els.timeNote.value = "";
    save();
  });

  els.exportNotes.addEventListener("click", exportText);

  els.resetProgress.addEventListener("click", () => {
    if (!confirm("Alle lokalen Antworten dieser Lerneinheit löschen?")) return;
    localStorage.removeItem(storageKey);
    state.activePhaseId = data.phases[0].id;
    state.studentName = "";
    state.answers = {};
    state.reflections = {};
    state.timeNotes = [];
    save();
    render();
  });
}

function initVideo() {
  els.videoSource.src = data.videoUrl;
  els.videoLink.href = data.videoUrl;
  els.videoLink.textContent = "Film in SharePoint öffnen";
  els.film.load();
  els.film.addEventListener("error", () => {
    els.videoFallback.classList.add("visible");
  });
}

load();
initVideo();
bindEvents();
render();

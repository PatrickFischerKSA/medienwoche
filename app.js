const data = window.LESSON_DATA;
const storageKey = "vierte-gewalt-lerneinheit-v1";

const state = {
  activePhaseId: data.phases[0].id,
  activeFilmId: data.films?.[0]?.id || "vierte-gewalt",
  studentName: "",
  answers: {},
  checks: {},
  reflections: {},
  timeNotes: []
};

const els = {
  mediaSwitcher: document.getElementById("media-switcher"),
  introGrid: document.getElementById("intro-grid"),
  resourceList: document.getElementById("resource-list"),
  studentName: document.getElementById("student-name"),
  timeNote: document.getElementById("time-note"),
  saveTimeNote: document.getElementById("save-time-note"),
  resetProgress: document.getElementById("reset-progress"),
  exportNotes: document.getElementById("export-notes"),
  progressLabel: document.getElementById("progress-label"),
  progressPercent: document.getElementById("progress-percent"),
  progressBar: document.getElementById("progress-bar"),
  phaseNav: document.getElementById("phase-nav"),
  activeFilmPanel: document.getElementById("active-film-panel"),
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

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/[„“"']/g, "")
    .replace(/[-–—_/]/g, " ")
    .replace(/[.,;:!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function allQuestions() {
  return data.phases.flatMap((phase) => phase.questions);
}

function getActivePhase() {
  return data.phases.find((phase) => phase.id === state.activePhaseId) || data.phases[0];
}

function getActiveFilm() {
  return (data.films || []).find((film) => film.id === state.activeFilmId) || data.films?.[0] || null;
}

function getAnswerQuality(text = "") {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  if (!clean) return { label: "offen", className: "empty", hint: "Noch keine Antwort gespeichert." };
  if (words < 18) return { label: "knapp", className: "low", hint: "Ergänzen Sie mindestens einen konkreten Filmbeleg." };
  if (words < 45) return { label: "solide", className: "mid", hint: "Gut. Eine Deutung oder ein Vergleich würde die Antwort stärken." };
  return { label: "ausgeführt", className: "high", hint: "Ausführlich beantwortet. Prüfen Sie noch, ob Filmbelege und eigenes Urteil klar getrennt sind." };
}

function evaluateConcepts(answer = "", question = {}) {
  const groups = question.conceptGroups || [];
  const normalizedAnswer = normalizeText(answer);
  if (!groups.length) return { hits: [], missing: [], total: 0, done: 0 };

  const hits = [];
  const missing = [];
  groups.forEach((group) => {
    const matched = (group.variants || []).some((variant) => normalizedAnswer.includes(normalizeText(variant)));
    if (matched) hits.push(group.label);
    else missing.push(group.label);
  });

  return { hits, missing, total: groups.length, done: hits.length };
}

function getKnowledgeQuality(answer = "", question = {}) {
  const concepts = evaluateConcepts(answer, question);
  if (!concepts.total) return getAnswerQuality(answer);
  if (!answer.trim()) {
    return { label: "offen", className: "empty", hint: "Noch keine Antwort gespeichert." };
  }
  if (concepts.done === concepts.total) {
    return { label: "korrekt", className: "high", hint: "Alle erwarteten Wissensanker sind enthalten." };
  }
  if (concepts.done >= Math.ceil(concepts.total * 0.6)) {
    return { label: "teilweise", className: "mid", hint: "Mehrere Wissensanker sind enthalten. Ergänzen Sie die fehlenden Punkte." };
  }
  return { label: "unvollständig", className: "low", hint: "Es fehlen noch zentrale Wissensanker. Nutzen Sie die Hinweise unter dem Antwortfeld." };
}

function getChecklistStatus(question) {
  const items = question.checklist || [];
  if (!items.length) return { done: 0, total: 0 };
  const done = items.filter((_, index) => state.checks?.[`${question.id}-${index}`]).length;
  return { done, total: items.length };
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
  let counter = 0;
  els.phaseNav.innerHTML = (data.films || [])
    .map((film) => {
      const phases = data.phases.filter((phase) => phase.filmId === film.id);
      const total = phases.flatMap((phase) => phase.questions).length;
      const done = phases
        .flatMap((phase) => phase.questions)
        .filter((question) => (state.answers[question.id] || "").trim()).length;
      const phaseButtons = phases
        .map((phase) => {
          counter += 1;
          const phaseTotal = phase.questions.length;
          const phaseDone = phase.questions.filter((question) => (state.answers[question.id] || "").trim()).length;
          const active = phase.id === state.activePhaseId ? "active" : "";
          return `
            <button class="phase-button ${active}" type="button" data-phase-id="${phase.id}">
              <span>${String(counter).padStart(2, "0")}</span>
              <strong>${escapeHtml(phase.title)}</strong>
              <small>${phaseDone}/${phaseTotal}</small>
            </button>
          `;
        })
        .join("");

      return `
        <section class="phase-group ${film.id === state.activeFilmId ? "active" : ""}">
          <button class="phase-group-head" type="button" data-film-id="${film.id}">
            <span>${escapeHtml(film.label)}</span>
            <strong>${escapeHtml(film.title)}</strong>
            <small>${done}/${total}</small>
          </button>
          ${phaseButtons}
        </section>
      `;
    })
    .join("");
}

function renderMediaSwitcher() {
  els.mediaSwitcher.innerHTML = (data.films || [])
    .map((film) => {
      const active = film.id === state.activeFilmId ? "active" : "";
      const phases = data.phases.filter((phase) => phase.filmId === film.id);
      const questionCount = phases.flatMap((phase) => phase.questions).length;
      return `
        <article class="media-card ${active} ${film.id === "videoreportage" ? "project-card" : ""}">
          <button class="media-button" type="button" data-film-id="${film.id}">
            <span>${escapeHtml(film.label)}</span>
            <strong>${escapeHtml(film.title)}</strong>
            <small>${escapeHtml(film.description || "")}</small>
            <small>${film.id === "videoreportage" ? "Eigenständige Praxiseinheit öffnen" : "Fragenblock zu diesem Film auswählen"}</small>
          </button>
          <div class="media-count">${phases.length} Stationen · ${questionCount} Aufgaben</div>
          <a class="media-link" href="${escapeHtml(film.url)}" target="_blank" rel="noreferrer">
            ${escapeHtml(film.linkLabel || "Im Mediaserver öffnen und anmelden")}
          </a>
        </article>
      `;
    })
    .join("");
}

function renderResources() {
  els.introGrid.innerHTML = (data.introVideos || [])
    .map(
      (video) => `
        <article class="intro-card">
          <div class="intro-thumb" style="background-image: url('${escapeHtml(video.thumbnailUrl)}')" aria-hidden="true">
            <span>Video</span>
          </div>
          <a href="${escapeHtml(video.url)}" target="_blank" rel="noreferrer">${escapeHtml(video.title)} auf YouTube öffnen</a>
        </article>
      `
    )
    .join("");

  els.resourceList.innerHTML = (data.resources || [])
    .map(
      (resource) => `
        <a class="resource-link" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">
          <span>${escapeHtml(resource.type)}</span>
          <strong>${escapeHtml(resource.title)}</strong>
          <small>${escapeHtml(resource.description)}</small>
        </a>
      `
    )
    .join("");
}

function renderActiveFilmPanel() {
  const film = getActiveFilm();
  const phase = getActivePhase();
  els.activeFilmPanel.innerHTML = `
    <div>
      <p class="eyebrow">Aktueller Arbeitsblock</p>
      <h2>${escapeHtml(film?.title || "")}</h2>
      <p>${escapeHtml(phase.title)}: ${escapeHtml(phase.focus)}</p>
    </div>
    <a class="text-button strong-link" href="${escapeHtml(film?.url || "#")}" target="_blank" rel="noreferrer">
      ${escapeHtml(film?.linkLabel || "Film im Mediaserver öffnen")}
    </a>
  `;
}

function renderQuestions() {
  const phase = getActivePhase();
  const film = getActiveFilm();
  els.phaseFocus.textContent = phase.focus;
  els.phaseTitle.textContent = `${film?.title || ""}: ${phase.title}`;
  const anchors = (phase.anchors || [])
    .map((anchor) => `<li>${escapeHtml(anchor)}</li>`)
    .join("");
  const anchorPanel = anchors
    ? `
      <section class="knowledge-panel">
        <p class="eyebrow">Wissensanker</p>
        <ul>${anchors}</ul>
      </section>
    `
    : "";
  const reflectionPanel = phase.reflection
    ? `
      <section class="station-panel">
        <p class="eyebrow">Reflexionsstation</p>
        <strong>${escapeHtml(phase.reflection)}</strong>
      </section>
    `
    : "";
  els.questionList.innerHTML = phase.questions
    .map((question) => {
      const answer = state.answers[question.id] || "";
      const quality = getKnowledgeQuality(answer, question);
      const checklistStatus = getChecklistStatus(question);
      const concepts = evaluateConcepts(answer, question);
      const quote = question.quote
        ? `<blockquote class="quote-box">${escapeHtml(question.quote)}</blockquote>`
        : "";
      const checklist = (question.checklist || []).length
        ? `
          <div class="self-check">
            <div class="self-check-head">
              <strong>Feedback-Checkliste</strong>
              <span>${checklistStatus.done}/${checklistStatus.total}</span>
            </div>
            ${(question.checklist || [])
              .map((item, index) => {
                const id = `${question.id}-${index}`;
                return `
                  <label class="check-row">
                    <input type="checkbox" data-check-id="${id}" ${state.checks?.[id] ? "checked" : ""} />
                    <span>${escapeHtml(item)}</span>
                  </label>
                `;
              })
              .join("")}
          </div>
        `
        : "";
      const conceptFeedback = concepts.total
        ? `
          <div class="concept-feedback" data-concept-feedback="${question.id}">
            <div class="concept-head">
              <strong>Sofortkorrektur Wissensanker</strong>
              <span>${concepts.done}/${concepts.total}</span>
            </div>
            <div class="concept-columns">
              <div>
                <span class="concept-label">Erkannt</span>
                <p>${concepts.hits.length ? concepts.hits.map(escapeHtml).join(", ") : "noch keine erwarteten Konzepte erkannt"}</p>
              </div>
              <div>
                <span class="concept-label">Fehlt noch</span>
                <p>${concepts.missing.length ? concepts.missing.map(escapeHtml).join(", ") : "nichts"}</p>
              </div>
            </div>
          </div>
        `
        : "";
      return `
        <article class="question-card">
          <div class="question-meta">
            <span>${escapeHtml(question.type)}</span>
            <span class="quality ${quality.className}">${quality.label}</span>
          </div>
          <label for="${question.id}">${escapeHtml(question.question)}</label>
          ${quote}
          <p>${escapeHtml(question.help)}</p>
          <textarea id="${question.id}" data-question-id="${question.id}" rows="6" placeholder="Antwort, Beobachtungen und Filmbelege hier notieren">${escapeHtml(answer)}</textarea>
          ${conceptFeedback}
          ${checklist}
          <div class="feedback">${escapeHtml(quality.hint)}</div>
        </article>
      `;
    })
    .join("");
  els.questionList.insertAdjacentHTML("afterbegin", `${anchorPanel}${reflectionPanel}`);
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
  renderMediaSwitcher();
  renderResources();
  renderProgress();
  renderPhaseNav();
  renderActiveFilmPanel();
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
      if ((question.checklist || []).length) {
        const status = getChecklistStatus(question);
        lines.push(`Feedback-Checkliste: ${status.done}/${status.total}`);
      }
      if ((question.conceptGroups || []).length) {
        const concepts = evaluateConcepts(state.answers[question.id] || "", question);
        lines.push(`Sofortkorrektur Wissensanker: ${concepts.done}/${concepts.total}`);
        if (concepts.missing.length) lines.push(`Fehlt noch: ${concepts.missing.join(", ")}`);
      }
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
    const filmButton = event.target.closest("[data-film-id]");
    if (filmButton && !event.target.closest("[data-phase-id]")) {
      state.activeFilmId = filmButton.dataset.filmId;
      const firstPhase = data.phases.find((phase) => phase.filmId === state.activeFilmId);
      if (firstPhase) state.activePhaseId = firstPhase.id;
      save();
      render();
      return;
    }

    const button = event.target.closest("[data-phase-id]");
    if (!button) return;
    state.activePhaseId = button.dataset.phaseId;
    const phase = getActivePhase();
    if (phase.filmId && phase.filmId !== state.activeFilmId) {
      state.activeFilmId = phase.filmId;
    }
    save();
    render();
  });

  els.mediaSwitcher.addEventListener("click", (event) => {
    const button = event.target.closest("[data-film-id]");
    if (!button) return;
    state.activeFilmId = button.dataset.filmId;
    const firstPhase = data.phases.find((phase) => phase.filmId === state.activeFilmId);
    if (firstPhase) state.activePhaseId = firstPhase.id;
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
    const question = allQuestions().find((entry) => entry.id === textarea.dataset.questionId) || {};
    const quality = getKnowledgeQuality(textarea.value, question);
    const concepts = evaluateConcepts(textarea.value, question);
    card.querySelector(".quality").className = `quality ${quality.className}`;
    card.querySelector(".quality").textContent = quality.label;
    card.querySelector(".feedback").textContent = quality.hint;
    const conceptBox = card.querySelector("[data-concept-feedback]");
    if (conceptBox && concepts.total) {
      conceptBox.querySelector(".concept-head span").textContent = `${concepts.done}/${concepts.total}`;
      const paragraphs = conceptBox.querySelectorAll(".concept-columns p");
      paragraphs[0].textContent = concepts.hits.length ? concepts.hits.join(", ") : "noch keine erwarteten Konzepte erkannt";
      paragraphs[1].textContent = concepts.missing.length ? concepts.missing.join(", ") : "nichts";
    }
  });

  els.questionList.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-check-id]");
    if (!checkbox) return;
    state.checks ||= {};
    state.checks[checkbox.dataset.checkId] = checkbox.checked;
    save();
    renderQuestions();
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
    state.activeFilmId = data.films?.[0]?.id || "vierte-gewalt";
    state.studentName = "";
    state.answers = {};
    state.checks = {};
    state.reflections = {};
    state.timeNotes = [];
    save();
    render();
  });
}

load();
bindEvents();
render();

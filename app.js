const els = {
  setupPanel: document.getElementById("setupPanel"),
  exam: document.getElementById("exam"),
  testList: document.getElementById("testList"),
  emptyLibrary: document.getElementById("emptyLibrary"),
  libraryCount: document.getElementById("libraryCount"),
  libraryToggle: document.getElementById("libraryToggle"),
  closeImportBtn: document.getElementById("closeImportBtn"),
  historyPanel: document.getElementById("historyPanel"),
  historyList: document.getElementById("historyList"),
  emptyHistory: document.getElementById("emptyHistory"),
  historyCount: document.getElementById("historyCount"),
  historyToggle: document.getElementById("historyToggle"),
  pendingPanel: document.getElementById("pendingPanel"),
  pendingTitle: document.getElementById("pendingTitle"),
  pendingMeta: document.getElementById("pendingMeta"),
  modeHint: document.getElementById("modeHint"),
  subjectPicker: document.getElementById("subjectPicker"),
  subjectPickerLabel: document.getElementById("subjectPickerLabel"),
  singleSubject: document.getElementById("singleSubject"),
  subjectFlow: document.getElementById("subjectFlow"),
  speakingBankPanel: document.getElementById("speakingBankPanel"),
  speakingBankInput: document.getElementById("speakingBankInput"),
  speakingBankAiInput: document.getElementById("speakingBankAiInput"),
  speakingBankStatus: document.getElementById("speakingBankStatus"),
  randomSpeakingBtn: document.getElementById("randomSpeakingBtn"),
  fullMockPanel: document.getElementById("fullMockPanel"),
  fullMockListening: document.getElementById("fullMockListening"),
  fullMockReading: document.getElementById("fullMockReading"),
  fullMockWriting: document.getElementById("fullMockWriting"),
  fullMockSpeaking: document.getElementById("fullMockSpeaking"),
  fullMockListeningCount: document.getElementById("fullMockListeningCount"),
  fullMockReadingCount: document.getElementById("fullMockReadingCount"),
  fullMockWritingCount: document.getElementById("fullMockWritingCount"),
  fullMockSpeakingCount: document.getElementById("fullMockSpeakingCount"),
  fullMockRandomSpeakingBtn: document.getElementById("fullMockRandomSpeakingBtn"),
  startFullMockBtn: document.getElementById("startFullMockBtn"),
  showAiImportBtn: document.getElementById("showAiImportBtn"),
  showManualImportBtn: document.getElementById("showManualImportBtn"),
  importActions: document.getElementById("importActions"),
  importWorkspace: document.getElementById("importWorkspace"),
  importTitle: document.getElementById("importTitle"),
  importHint: document.getElementById("importHint"),
  fullMaterialGuide: document.getElementById("fullMaterialGuide"),
  aiImportPanel: document.getElementById("aiImportPanel"),
  manualImportPanel: document.getElementById("manualImportPanel"),
  openAiSettingsBtn: document.getElementById("openAiSettingsBtn"),
  aiSettingsDialog: document.getElementById("aiSettingsDialog"),
  closeAiSettingsBtn: document.getElementById("closeAiSettingsBtn"),
  aiProviderGrid: document.getElementById("aiProviderGrid"),
  saveAiSettingsBtn: document.getElementById("saveAiSettingsBtn"),
  resetAiSettingsBtn: document.getElementById("resetAiSettingsBtn"),
  clearLocalDataBtn: document.getElementById("clearLocalDataBtn"),
  aiSettingsStatus: document.getElementById("aiSettingsStatus"),
  aiQuestionFileInput: document.getElementById("aiQuestionFileInput"),
  aiAnswerFileInput: document.getElementById("aiAnswerFileInput"),
  aiAudioFileInput: document.getElementById("aiAudioFileInput"),
  aiListeningTranscriptFileInput: document.getElementById("aiListeningTranscriptFileInput"),
  aiExtraFileInput: document.getElementById("aiExtraFileInput"),
  aiQuestionFileName: document.getElementById("aiQuestionFileName"),
  aiAnswerFileName: document.getElementById("aiAnswerFileName"),
  aiAudioFileName: document.getElementById("aiAudioFileName"),
  aiListeningTranscriptFileName: document.getElementById("aiListeningTranscriptFileName"),
  aiExtraFileName: document.getElementById("aiExtraFileName"),
  aiAnswerTextField: document.getElementById("aiAnswerTextField"),
  aiPdfPageImageField: document.getElementById("aiPdfPageImageField"),
  aiPdfPageImageTitle: document.getElementById("aiPdfPageImageTitle"),
  aiPdfPageImageHint: document.getElementById("aiPdfPageImageHint"),
  aiQuestionPdfPageInput: document.getElementById("aiQuestionPdfPageInput"),
  aiQuestionText: document.getElementById("aiQuestionText"),
  aiAnswerText: document.getElementById("aiAnswerText"),
  aiGenerateBtn: document.getElementById("aiGenerateBtn"),
  aiCancelBtn: document.getElementById("aiCancelBtn"),
  aiStatus: document.getElementById("aiStatus"),
  aiProgress: document.getElementById("aiProgress"),
  aiProgressBar: document.getElementById("aiProgressBar"),
  aiProgressLabel: document.getElementById("aiProgressLabel"),
  jsonInput: document.getElementById("jsonInput"),
  assetInput: document.getElementById("assetInput"),
  jsonFileName: document.getElementById("jsonFileName"),
  assetFileName: document.getElementById("assetFileName"),
  confirmAddBtn: document.getElementById("confirmAddBtn"),
  cancelPendingBtn: document.getElementById("cancelPendingBtn"),
  examHomeBtn: document.getElementById("examHomeBtn"),
  submitBtn: document.getElementById("submitBtn"),
  examTypeLabel: document.getElementById("examTypeLabel"),
  examTitle: document.getElementById("examTitle"),
  timer: document.getElementById("timer"),
  partTabs: document.getElementById("partTabs"),
  workbench: document.getElementById("workbench"),
  questionNav: document.getElementById("questionNav"),
  audioPanel: document.getElementById("audioPanel"),
  audioPlayer: document.getElementById("audioPlayer"),
  audioStartBtn: document.getElementById("audioStartBtn"),
  audioClock: document.getElementById("audioClock"),
  audioTitle: document.getElementById("audioTitle"),
  audioRule: document.getElementById("audioRule"),
  highlightBtn: document.getElementById("highlightBtn"),
  resultDialog: document.getElementById("resultDialog"),
  resultTitle: document.getElementById("resultTitle"),
  resultBody: document.getElementById("resultBody"),
  closeResultBtn: document.getElementById("closeResultBtn"),
  toastRegion: document.getElementById("toastRegion"),
};

const OCR_PDF_PAGE_BATCH_SIZE = 5;
const AI_REQUEST_TIMEOUT_MS = 120000;
const AI_PDF_RENDER_MAX_WIDTH = 1500;
const PDFJS_WORKER_SRC = "./node_modules/pdfjs-dist/build/pdf.worker.min.js";
const LIBRARY_STORAGE_KEY = "ielts-mock-library";
const LIBRARY_COLLAPSED_STORAGE_KEY = "ielts-mock-library-collapsed";
const HISTORY_COLLAPSED_STORAGE_KEY = "ielts-mock-history-collapsed";
const ASSET_DB_NAME = "ielts-mock-assets";
const ASSET_DB_VERSION = 1;
const ASSET_STORE_NAME = "assets";
const AI_SETTINGS_STORAGE_KEY = "ielts-mock-ai-settings";
const AI_SETTINGS_SESSION_SECRETS_KEY = "ielts-mock-ai-settings-session-secrets";
const SPEAKING_BANK_STORAGE_KEY = "ielts-speaking-season-bank";
const SPEAKING_BANK_BUNDLED_ID_STORAGE_KEY = "ielts-speaking-season-bank-bundled-id";
const BUNDLED_SPEAKING_BANK_ID = "2026-may-august";
const BUNDLED_SPEAKING_BANK_URL = "./speaking-banks/2026-may-august-ielts-speaking-bank.json";

function safeGetStorage(storage, key, fallback = null) {
  try {
    return storage.getItem(key) ?? fallback;
  } catch (error) {
    console.warn("Storage read failed.", error);
    return fallback;
  }
}

function safeSetStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn("Storage write failed.", error);
    return false;
  }
}

function safeRemoveStorage(storage, key) {
  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn("Storage removal failed.", error);
  }
}

const providerLabels = {
  glm: "模型服务",
  deepseek: "DeepSeek",
  xfyun: "科大讯飞",
  custom: "自定义模型服务",
};

const GLM_CHAT_COMPLETIONS_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const DEEPSEEK_CHAT_COMPLETIONS_URL = "https://api.deepseek.com/chat/completions";
const XFYUN_ISE_WS_URL = "wss://ise-api.xfyun.cn/v2/open-ise";

const defaultAiSettings = {
  features: {
    ocr: {
      providerKey: "glm",
      baseUrl: GLM_CHAT_COMPLETIONS_URL,
      apiKey: "",
      model: "glm-ocr",
    },
    merge: {
      providerKey: "glm",
      baseUrl: GLM_CHAT_COMPLETIONS_URL,
      apiKey: "",
      model: "glm-5.2",
    },
    explain: {
      providerKey: "glm",
      baseUrl: GLM_CHAT_COMPLETIONS_URL,
      apiKey: "",
      model: "glm-5.2",
    },
    writing: {
      providerKey: "glm",
      baseUrl: GLM_CHAT_COMPLETIONS_URL,
      apiKey: "",
      model: "glm-5.2",
    },
    speaking: {
      providerKey: "glm",
      baseUrl: GLM_CHAT_COMPLETIONS_URL,
      apiKey: "",
      model: "glm-5.2",
    },
    speech: {
      providerKey: "glm",
      baseUrl: GLM_CHAT_COMPLETIONS_URL,
      apiKey: "",
      model: "glm-asr-2512",
    },
    fluency: {
      providerKey: "xfyun",
      baseUrl: XFYUN_ISE_WS_URL,
      apiKey: "",
      model: "read_chapter",
    },
  },
};

const state = {
  test: null,
  pendingTest: null,
  pendingSource: "",
  library: [],
  currentLibraryEntryId: "",
  libraryCollapsed: safeGetStorage(localStorage, LIBRARY_COLLAPSED_STORAGE_KEY, "") === "true",
  historyCollapsed: safeGetStorage(localStorage, HISTORY_COLLAPSED_STORAGE_KEY, "") === "true",
  assets: new Map(),
  answers: {},
  review: new Set(),
  currentQuestionId: null,
  currentSectionIndex: 0,
  questionIndex: [],
  mode: "mock",
  remainingSeconds: 0,
  timerId: null,
  startedAt: null,
  submitted: false,
  audioMaxTime: 0,
  audioLocks: new Set(),
  audioEndedKeys: new Set(),
  audioStartConfirmedKeys: new Set(),
  currentAudioKey: "",
  activeAudioSectionIndex: null,
  listeningReviewStarted: false,
  speakingRecorder: null,
  speakingChunks: [],
  speakingRecordings: {},
  speakingRecordingSection: null,
  speakingBank: null,
  fullMock: {
    active: false,
    queue: [],
    index: 0,
    results: [],
  },
  aiSettings: structuredClone(defaultAiSettings),
  aiAbortController: null,
};

class AiGenerationError extends Error {
  constructor(message, code = "GENERATION_ERROR", details = {}) {
    super(message);
    this.name = "AiGenerationError";
    this.code = code;
    this.details = details;
  }
}

const fallbackSamples = {
  reading: {
    testType: "reading",
    title: "Academic Reading Multi-Passage Sample",
    durationMinutes: 60,
    sections: [
      {
        title: "Passage 1",
        passage:
          "Urban gardens are increasingly common in large cities. They provide small areas where residents can grow food, meet neighbours, and learn about local ecosystems. Some city councils support these gardens because they improve unused land and encourage community activity.\n\nHowever, urban gardens are not simple to maintain. Organisers must find water, tools, safe soil, and volunteers. When these problems are managed well, the gardens can become long-term educational spaces rather than short-term projects.",
        groups: [
          {
            title: "Questions 1-3",
            instructions: "Choose the correct letter, A, B or C.",
            questionType: "single_choice",
            questions: [
              {
                id: 1,
                text: "Why do some councils support urban gardens?",
                options: [
                  { value: "A", label: "They reduce the price of vegetables." },
                  { value: "B", label: "They improve unused land." },
                  { value: "C", label: "They replace public parks." },
                ],
                answer: ["B"],
              },
              {
                id: 2,
                text: "What is one difficulty mentioned in the passage?",
                options: [
                  { value: "A", label: "Finding volunteers" },
                  { value: "B", label: "Attracting tourists" },
                  { value: "C", label: "Choosing a city council" },
                ],
                answer: ["A"],
              },
              {
                id: 3,
                text: "Matching-style question simplified: Which description best fits successful gardens?",
                options: [
                  { value: "A", label: "Short-term decoration" },
                  { value: "B", label: "Private business space" },
                  { value: "C", label: "Long-term educational space" },
                ],
                answer: ["C"],
              },
            ],
          },
          {
            title: "Questions 4-5",
            instructions: "Complete the notes below. Write ONE WORD ONLY.",
            questionType: "blank",
            questions: [
              { id: 4, text: "Urban gardens help residents learn about local ____.", answer: ["ecosystems"] },
              { id: 5, text: "Organisers need safe ____ for planting.", answer: ["soil"] },
            ],
          },
        ],
      },
      {
        title: "Passage 2",
        passage:
          "Many museums now use digital guides to help visitors explore exhibitions. These tools can offer audio, images, and short explanations in several languages. Supporters say they make collections easier to understand.\n\nSome curators are cautious. They argue that visitors may spend more time looking at screens than at the objects themselves. The most successful museums therefore use digital guides as optional support rather than as a replacement for direct observation.",
        groups: [
          {
            title: "Questions 6-8",
            instructions: "Choose the correct letter, A, B or C.",
            questionType: "single_choice",
            questions: [
              {
                id: 6,
                text: "What advantage of digital guides is mentioned?",
                options: [
                  { value: "A", label: "They can explain exhibits in several languages." },
                  { value: "B", label: "They reduce the need for museum staff." },
                  { value: "C", label: "They make all exhibitions free." },
                ],
                answer: ["A"],
              },
              {
                id: 7,
                text: "What concern do some curators have?",
                options: [
                  { value: "A", label: "Visitors may ignore the museum shop." },
                  { value: "B", label: "Visitors may focus too much on screens." },
                  { value: "C", label: "Visitors may ask too many questions." },
                ],
                answer: ["B"],
              },
              {
                id: 8,
                text: "How are digital guides best used, according to the passage?",
                options: [
                  { value: "A", label: "As optional support" },
                  { value: "B", label: "As the only source of information" },
                  { value: "C", label: "As a ticketing system" },
                ],
                answer: ["A"],
              },
            ],
          },
        ],
      },
      {
        title: "Passage 3",
        passage:
          "Researchers studying sleep often distinguish between duration and quality. A person may spend eight hours in bed but still wake frequently. In such cases, the total time appears sufficient, while the restorative value of sleep is reduced.\n\nRecent studies suggest that regular routines, low evening light, and reduced late caffeine can improve sleep quality. These changes are simple, but they require consistency over several weeks.",
        groups: [
          {
            title: "Questions 9-10",
            instructions: "Complete the summary. Write ONE WORD ONLY.",
            questionType: "blank",
            questions: [
              { id: 9, text: "Sleep research separates duration from ____.", answer: ["quality"] },
              { id: 10, text: "Improvement requires ____ over several weeks.", answer: ["consistency"] },
            ],
          },
        ],
      },
    ],
  },
  listening: {
    testType: "listening",
    title: "Listening Multi-Part Sample",
    durationMinutes: 30,
    audio: "",
    sections: [
      {
        title: "Part 1",
        audio: "",
        groups: [
          {
            title: "Questions 1-2",
            instructions: "Complete the form. Write NO MORE THAN TWO WORDS.",
            questionType: "blank",
            questions: [
              { id: 1, text: "Name of club: ____ Club", answer: ["tennis"] },
              { id: 2, text: "Meeting place: ____ Road", answer: ["Green"] },
            ],
          },
          {
            title: "Questions 3-4",
            instructions: "Choose TWO letters.",
            questionType: "multi_choice",
            maxChoices: 2,
            questions: [
              {
                id: "3-4",
                text: "Which TWO items should members bring?",
                points: 2,
                options: [
                  { value: "A", label: "A water bottle" },
                  { value: "B", label: "A printed ticket" },
                  { value: "C", label: "Sports shoes" },
                  { value: "D", label: "A notebook" },
                ],
                answer: ["A", "C"],
              },
            ],
          },
        ],
      },
      {
        title: "Part 2",
        audio: "",
        groups: [
          {
            title: "Questions 5-6",
            instructions: "Choose the correct letter, A, B or C.",
            questionType: "single_choice",
            questions: [
              {
                id: 5,
                text: "Where does the tour begin?",
                options: [
                  { value: "A", label: "At the information desk" },
                  { value: "B", label: "At the north gate" },
                  { value: "C", label: "Outside the cafe" },
                ],
                answer: ["B"],
              },
              {
                id: 6,
                text: "Which activity is cancelled today?",
                options: [
                  { value: "A", label: "The garden walk" },
                  { value: "B", label: "The film show" },
                  { value: "C", label: "The children workshop" },
                ],
                answer: ["C"],
              },
            ],
          },
        ],
      },
    ],
  },
  writing: {
    testType: "writing",
    title: "Academic Writing Sample",
    durationMinutes: 60,
    sections: [
      {
        title: "Writing Task 1",
        instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
        prompt: "The chart below shows the percentage of households in one city using different forms of transport in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        minWords: 150,
      },
      {
        title: "Writing Task 2",
        instructions: "You should spend about 40 minutes on this task. Write at least 250 words.",
        prompt: "Some people think that children should begin learning a foreign language at primary school rather than secondary school. Do the advantages of this outweigh the disadvantages?",
        minWords: 250,
      },
    ],
  },
  speaking: {
    testType: "speaking",
    title: "Speaking Practice Sample",
    durationMinutes: 14,
    sections: [
      {
        title: "Part 1",
        prepSeconds: 0,
        answerSeconds: 300,
        questions: [
          "Do you work or study?",
          "What do you usually do after work or classes?",
          "Do you prefer spending time indoors or outdoors?",
        ],
      },
      {
        title: "Part 2",
        prepSeconds: 60,
        answerSeconds: 120,
        cueCard: "Describe a place you visited that you enjoyed.",
        prompts: [
          "where it was",
          "when you went there",
          "what you did there",
          "and explain why you enjoyed it",
        ],
      },
      {
        title: "Part 3",
        prepSeconds: 0,
        answerSeconds: 300,
        questions: [
          "Why do people enjoy travelling to new places?",
          "How has tourism changed in recent years?",
          "Should governments limit the number of tourists in popular places?",
        ],
      },
    ],
  },
};

async function init() {
  await loadAiSettings();
  renderAiSettings();
  els.saveAiSettingsBtn.addEventListener("click", () => saveAiSettingsFromForm());
  els.resetAiSettingsBtn.addEventListener("click", () => resetAiSettings());
  els.clearLocalDataBtn.addEventListener("click", () => clearLocalExamData());
  els.openAiSettingsBtn.addEventListener("click", () => {
    renderAiSettings();
    els.aiSettingsDialog.showModal();
  });
  els.closeAiSettingsBtn.addEventListener("click", () => els.aiSettingsDialog.close());
  els.showAiImportBtn.addEventListener("click", () => showImportPanel("ai"));
  els.showManualImportBtn.addEventListener("click", () => showImportPanel("manual"));
  els.libraryToggle.addEventListener("click", toggleLibraryCollapsed);
  els.historyToggle.addEventListener("click", toggleHistoryCollapsed);
  els.closeImportBtn.addEventListener("click", closeImportPanel);
  els.singleSubject.addEventListener("change", updateLibraryModeHint);
  els.speakingBankInput.addEventListener("change", handleSpeakingBankInput);
  els.speakingBankAiInput.addEventListener("change", handleSpeakingBankAiInput);
  els.randomSpeakingBtn.addEventListener("click", addRandomSpeakingFromBank);
  els.fullMockRandomSpeakingBtn.addEventListener("click", addRandomSpeakingForFullMock);
  els.startFullMockBtn.addEventListener("click", startFullMockFromSelection);
  [els.fullMockListening, els.fullMockReading, els.fullMockWriting, els.fullMockSpeaking].forEach((select) => {
    select.addEventListener("change", renderFullMockPicker);
  });
  document.querySelectorAll("input[name='libraryMode']").forEach((input) => {
    input.addEventListener("change", updateLibraryModeHint);
  });
  [
    [els.aiQuestionFileInput, els.aiQuestionFileName, "题目 PDF / 图片 / 文本"],
    [els.aiAnswerFileInput, els.aiAnswerFileName, "答案 PDF / 图片 / 文本"],
    [els.aiAudioFileInput, els.aiAudioFileName, "Part 1-4 音频"],
    [els.aiListeningTranscriptFileInput, els.aiListeningTranscriptFileName, "可选：PDF / 文本，用于查看解析"],
    [els.aiExtraFileInput, els.aiExtraFileName, "可选：地图、图表、补充图片"],
  ].forEach(([input, label, emptyText]) => {
    input.addEventListener("change", () => handleAiFileInput(input, label, emptyText));
  });
  els.aiGenerateBtn.addEventListener("click", generateExamWithAi);
  els.aiCancelBtn.addEventListener("click", cancelAiGeneration);
  els.jsonInput.addEventListener("change", handleJsonInput);
  els.assetInput.addEventListener("change", (event) => handleAssetInput(event));
  els.confirmAddBtn.addEventListener("click", () => confirmPendingTest());
  els.cancelPendingBtn.addEventListener("click", clearPendingTest);
  els.examHomeBtn.addEventListener("click", () => returnToSetup(false));
  els.submitBtn.addEventListener("click", () => submitTest(false));
  els.closeResultBtn.addEventListener("click", () => els.resultDialog.close());
  document.querySelectorAll("input[name='mode']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.mode = event.target.value;
      updateAudioRule();
    });
  });
  setupKeyboardShortcuts();
  document.addEventListener("selectionchange", updateHighlightButton);
  els.highlightBtn.addEventListener("click", highlightSelection);
  els.workbench.addEventListener("click", handleHighlightClick);
  setupAudioGuards();
  await loadSpeakingBank();
  await loadLibrary();
  renderLibrary();
  renderHistoryList();
  renderPendingTest();
  updateLibraryModeHint();
}

function handleAiFileInput(input, label, emptyText) {
  const files = Array.from(input.files || []);
  label.textContent = files.length ? `${files.length} 个文件已选择` : emptyText;
}

function setupGlobalErrorHandling() {
  window.addEventListener("error", (event) => {
    console.error("Unhandled application error:", event.error || event.message);
    showToast("程序遇到错误。当前数据仍保留，请重试刚才的操作。", "error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    event.preventDefault();
    showToast("操作没有完成。请检查设置或材料后重试。", "error");
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    if (target?.matches?.("input, textarea, select, [contenteditable='true']")) return;
    if (!els.exam.hidden && event.altKey && event.key === "ArrowRight") {
      event.preventDefault();
      switchSection(Math.min(state.test.sections.length - 1, state.currentSectionIndex + 1));
    }
    if (!els.exam.hidden && event.altKey && event.key === "ArrowLeft") {
      event.preventDefault();
      switchSection(Math.max(0, state.currentSectionIndex - 1));
    }
    if (!els.exam.hidden && (event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      submitTest(false);
    }
    if (!els.exam.hidden && event.key.toLowerCase() === "r" && state.currentQuestionId) {
      event.preventDefault();
      if (state.review.has(state.currentQuestionId)) state.review.delete(state.currentQuestionId);
      else state.review.add(state.currentQuestionId);
      updateQuestionClasses();
      renderNav();
    }
  });
}

function showToast(message, type = "info") {
  if (!els.toastRegion) return;
  const toast = document.createElement("div");
  toast.className = `app-toast app-toast-${type}`;
  toast.textContent = String(message || "操作未完成。");
  els.toastRegion.appendChild(toast);
  while (els.toastRegion.children.length > 3) {
    els.toastRegion.firstElementChild?.remove();
  }
  window.setTimeout(() => toast.remove(), 6000);
}

function updateLibraryModeHint() {
  const mode = document.querySelector("input[name='libraryMode']:checked")?.value || "single";
  const subject = els.singleSubject.value;
  els.subjectPicker.hidden = mode === "full";
  els.subjectPickerLabel.textContent = "单科科目";
  els.subjectFlow.hidden = mode === "full";
  els.importActions.hidden = mode === "full";
  if (mode === "full" && !els.importWorkspace.hidden) {
    closeImportPanel();
  }
  const showSpeakingBank = mode === "single" && subject === "speaking";
  els.speakingBankPanel.hidden = !showSpeakingBank;
  els.fullMockPanel.hidden = mode !== "full";
  els.randomSpeakingBtn.textContent = "随机抽一套";
  els.fullMaterialGuide.hidden = mode !== "full" || els.importWorkspace.hidden;
  els.modeHint.textContent = mode === "full"
    ? "仿真模考：从考试库里选择 Listening、Reading、Writing、Speaking 四个考试单元，系统会连续考完四科。"
    : `单科练习：${getSubjectMaterialHint(subject)}`;
  renderSpeakingBankStatus();
  renderFullMockPicker();
  if (!els.importWorkspace.hidden) {
    updateImportCopy();
  }
}

async function handleSpeakingBankInput(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const bank = normalizeSpeakingBank(window.IeltsCore.parseSafeJson(await file.text()));
    // A seasonal speaking bank is a single active source; importing replaces the old one.
    state.speakingBank = bank;
    localStorage.setItem(SPEAKING_BANK_STORAGE_KEY, JSON.stringify(bank));
    renderSpeakingBankStatus();
    alert(`已覆盖导入当季口语题库：${bank.title || bank.season || "Speaking Bank"}`);
  } catch (error) {
    alert(`口语题库无法导入：${error.message}`);
  } finally {
    els.speakingBankInput.value = "";
  }
}

async function handleSpeakingBankAiInput(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const previousStatus = els.speakingBankStatus.textContent;
  els.speakingBankStatus.textContent = "AI 正在整理当季题库，完成后会覆盖当前题库...";
  try {
    const material = await buildAiMaterial(files, "", "");
    const extractedPages = await extractPagesWithOcr(material, (text) => {
      els.speakingBankStatus.textContent = text;
    });
    const bank = await mergeExtractedTextToSpeakingBank(material, extractedPages);
    state.speakingBank = normalizeSpeakingBank(bank);
    localStorage.setItem(SPEAKING_BANK_STORAGE_KEY, JSON.stringify(state.speakingBank));
    downloadJson(state.speakingBank, makeJsonFileName(state.speakingBank.title || "speaking-season-bank"));
    renderSpeakingBankStatus();
    alert(`AI 已覆盖导入当季口语题库：${state.speakingBank.title || state.speakingBank.season || "Speaking Bank"}`);
  } catch (error) {
    els.speakingBankStatus.textContent = previousStatus || "未导入题库";
    alert(`AI 导入口语题库失败：${error.message || error}`);
  } finally {
    els.speakingBankAiInput.value = "";
  }
}

async function mergeExtractedTextToSpeakingBank(material, extractedPages) {
  const messages = [
    {
      role: "system",
      content: `You are an IELTS Speaking question bank formatter.

Return only one valid JSON object. No markdown. No explanations.

The JSON schema must be:
{
  "title": string,
  "season": string,
  "part1": [{"topic": string, "questions": string[]}],
  "part2": [{"topic": string, "cueCard": string, "prompts": string[]}],
  "part3": [{"topic": string, "relatedTo": string, "questions": string[]}]
}

Rules:
- Extract only IELTS Speaking current-season question bank content.
- Preserve topic names when visible.
- Part 2 cue cards should keep the main card text and bullet prompts separately.
- Part 3 should group discussion questions by topic.
- Do not invent questions that are not present.`,
    },
    {
      role: "user",
      content: `Files:
${JSON.stringify(material.fileSummaries, null, 2)}

Readable text snippets:
${material.textSnippets || "(none)"}

Page transcriptions:
${JSON.stringify(extractedPages, null, 2)}`,
    },
  ];
  const content = await requestTextCompletionWithFallback(messages, "speaking");
  return extractJsonObject(content);
}

async function loadSpeakingBank() {
  try {
    const bundledId = localStorage.getItem(SPEAKING_BANK_BUNDLED_ID_STORAGE_KEY);
    if (bundledId !== BUNDLED_SPEAKING_BANK_ID) {
      const bundledSource = await loadBundledSpeakingBank();
      if (bundledSource) {
        const bundledBank = normalizeSpeakingBank(bundledSource);
        state.speakingBank = bundledBank;
        localStorage.setItem(SPEAKING_BANK_STORAGE_KEY, JSON.stringify(bundledBank));
        localStorage.setItem(SPEAKING_BANK_BUNDLED_ID_STORAGE_KEY, BUNDLED_SPEAKING_BANK_ID);
        renderSpeakingBankStatus();
        return;
      }
    }
    const saved = window.IeltsCore.parseSafeJson(localStorage.getItem(SPEAKING_BANK_STORAGE_KEY) || "null");
    state.speakingBank = saved ? normalizeSpeakingBank(saved) : null;
  } catch (error) {
    console.warn("Speaking bank could not be loaded.", error);
    try {
      const saved = window.IeltsCore.parseSafeJson(localStorage.getItem(SPEAKING_BANK_STORAGE_KEY) || "null");
      state.speakingBank = saved ? normalizeSpeakingBank(saved) : null;
    } catch {
      state.speakingBank = null;
    }
  }
  renderSpeakingBankStatus();
}

async function loadBundledSpeakingBank() {
  if (window.BUNDLED_SPEAKING_BANK) {
    return window.BUNDLED_SPEAKING_BANK;
  }
  try {
    const response = await fetch(BUNDLED_SPEAKING_BANK_URL);
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

function renderSpeakingBankStatus() {
  if (!els.speakingBankStatus) return;
  if (!state.speakingBank) {
    els.speakingBankStatus.textContent = "未导入题库";
    return;
  }
  const bank = state.speakingBank;
  els.speakingBankStatus.textContent = `${bank.title || bank.season || "Speaking Bank"} · P1 ${bank.part1.length} · P2 ${bank.part2.length} · P3 ${bank.part3.length}`;
}

function normalizeSpeakingBank(bank) {
  if (!bank || typeof bank !== "object") throw new Error("根内容必须是对象。");
  window.IeltsCore.assertSafeJsonValue(bank);
  const normalized = {
    title: String(bank.title || bank.name || "Current Season Speaking Bank"),
    season: String(bank.season || ""),
    part1: normalizeSpeakingPart1(bank.part1 || bank.partOne || []),
    part2: normalizeSpeakingPart2(bank.part2 || bank.partTwo || []),
    part3: normalizeSpeakingPart3(bank.part3 || bank.partThree || []),
  };
  if (!normalized.part1.length) throw new Error("题库缺少 part1。");
  if (!normalized.part2.length) throw new Error("题库缺少 part2。");
  if (!normalized.part3.length) throw new Error("题库缺少 part3。");
  return normalized;
}

function normalizeSpeakingPart1(items) {
  return ensureArray(items).map((item) => {
    if (typeof item === "string") return { topic: "Part 1", questions: [item] };
    return {
      topic: String(item.topic || item.title || "Part 1"),
      questions: ensureArray(item.questions).map(String).filter(Boolean),
    };
  }).filter((item) => item.questions.length);
}

function normalizeSpeakingPart2(items) {
  return ensureArray(items).map((item) => {
    if (typeof item === "string") return { topic: "", cueCard: item, prompts: [] };
    return {
      topic: String(item.topic || item.title || ""),
      cueCard: String(item.cueCard || item.card || item.question || item.prompt || ""),
      prompts: ensureArray(item.prompts || item.bullets || item.points).map(String).filter(Boolean),
    };
  }).filter((item) => item.cueCard);
}

function normalizeSpeakingPart3(items) {
  return ensureArray(items).map((item) => {
    if (typeof item === "string") return { topic: "Part 3", questions: [item] };
    return {
      topic: String(item.topic || item.title || "Part 3"),
      relatedTo: String(item.relatedTo || item.part2Topic || ""),
      questions: ensureArray(item.questions).map(String).filter(Boolean),
    };
  }).filter((item) => item.questions.length);
}

async function addRandomSpeakingFromBank() {
  if (!state.speakingBank) {
    alert("请先导入当季口语题库 JSON。");
    return;
  }
  const mode = document.querySelector("input[name='libraryMode']:checked")?.value || "single";
  const test = buildRandomSpeakingTest(state.speakingBank);
  const sourcePrefix = mode === "full" ? "仿真模考随机口语" : "随机抽题";
  return addTestToLibrary(test, `${state.speakingBank.title || "Speaking Bank"} ${sourcePrefix}`, true, new Map());
}

async function addRandomSpeakingForFullMock() {
  const entry = await addRandomSpeakingFromBank();
  if (!entry) return;
  els.fullMockSpeaking.value = entry.id;
  renderFullMockPicker();
}

function buildRandomSpeakingTest(bank) {
  const part1Topic = pickRandom(bank.part1);
  const part2 = pickRandom(bank.part2);
  const relatedPart3 = bank.part3.filter((item) => {
    const topic = `${item.topic} ${item.relatedTo}`.toLowerCase();
    return part2.topic && topic.includes(part2.topic.toLowerCase());
  });
  const part3 = pickRandom(relatedPart3.length ? relatedPart3 : bank.part3);
  return {
    testType: "speaking",
    title: `${bank.season || bank.title || "Current Season"} Speaking Random Practice`,
    durationMinutes: 14,
    sections: [
      {
        title: `Part 1 - ${part1Topic.topic}`,
        prepSeconds: 0,
        answerSeconds: 300,
        questions: shuffleArray(part1Topic.questions).slice(0, 4),
      },
      {
        title: part2.topic ? `Part 2 - ${part2.topic}` : "Part 2",
        prepSeconds: 60,
        answerSeconds: 120,
        cueCard: part2.cueCard,
        prompts: part2.prompts,
      },
      {
        title: `Part 3 - ${part3.topic}`,
        prepSeconds: 0,
        answerSeconds: 300,
        questions: shuffleArray(part3.questions).slice(0, 5),
      },
    ],
  };
}

function ensureArray(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function showImportPanel(kind) {
  els.importWorkspace.hidden = false;
  els.aiImportPanel.hidden = kind !== "ai";
  els.manualImportPanel.hidden = kind !== "manual";
  updateImportCopy(kind);
  els.importWorkspace.scrollIntoView({ block: "start", behavior: "smooth" });
}

function closeImportPanel() {
  if (state.aiAbortController) {
    cancelAiGeneration();
  }
  els.importWorkspace.hidden = true;
  els.aiImportPanel.hidden = true;
  els.manualImportPanel.hidden = true;
  els.fullMaterialGuide.hidden = true;
  clearPendingTest();
}

function updateImportCopy(kind = els.aiImportPanel.hidden ? "manual" : "ai") {
  const mode = document.querySelector("input[name='libraryMode']:checked")?.value || "single";
  const subject = els.singleSubject.value;
  const importName = kind === "ai" ? "AI 导入" : "手动导入";
  els.importTitle.textContent = mode === "full"
    ? `${importName}${getTestTypeLabel(subject)}单元`
    : `${importName}题目`;
  els.fullMaterialGuide.hidden = true;
  els.importHint.textContent = mode === "full"
    ? `仿真模考会复用单科考试单元。当前只导入 ${getTestTypeLabel(subject)}，四科分别导入后在“全科模考单元”里选择。`
    : getSubjectMaterialHint(subject);
  updateMaterialBoxes("single", subject);
}

function updateMaterialBoxes(mode, subject) {
  const showAnswers = mode === "full" || ["listening", "reading"].includes(subject);
  const showAudio = mode === "full" || subject === "listening";
  const showTranscript = subject === "listening";
  const showExtra = mode === "full" || ["listening", "reading", "writing"].includes(subject);
  document.querySelector('[data-material-box="answer"]').hidden = !showAnswers;
  document.querySelector('[data-material-box="audio"]').hidden = !showAudio;
  document.querySelector('[data-material-box="transcript"]').hidden = !showTranscript;
  document.querySelector('[data-material-box="extra"]').hidden = !showExtra;
  els.aiAnswerTextField.hidden = !showAnswers;
  els.aiPdfPageImageField.hidden = !["listening", "writing"].includes(subject);
  updatePdfPageImageCopy(subject);
  const titleMap = getMaterialTitles(mode, subject);
  document.querySelector('[data-material-box="question"] .file-title').textContent = titleMap.question;
  document.querySelector('[data-material-box="answer"] .file-title').textContent = titleMap.answer;
  document.querySelector('[data-material-box="audio"] .file-title').textContent = titleMap.audio;
  document.querySelector('[data-material-box="extra"] .file-title').textContent = titleMap.extra;
}

function updatePdfPageImageCopy(subject) {
  if (subject === "listening") {
    els.aiPdfPageImageTitle.textContent = "听力图片：将题目 PDF 第几页截图加入 Part 2（可选）";
    els.aiPdfPageImageHint.textContent = "有地图/平面图等图片题时填写页码，例如 3；系统会把题目材料 PDF 的整页截图加入听力 Part 2 第二个题型。";
    return;
  }
  if (subject === "writing") {
    els.aiPdfPageImageTitle.textContent = "写作 Task 1 图片：将题目 PDF 第几页截图加入题目（可选）";
    els.aiPdfPageImageHint.textContent = "Task 1 有图表/流程图/地图时填写页码；系统会把题目材料 PDF 的整页截图加入 Writing Task 1。";
    return;
  }
  els.aiPdfPageImageTitle.textContent = "将题目 PDF 第几页截图加入题目（可选）";
  els.aiPdfPageImageHint.textContent = "只在你填页码时生效；系统会把题目材料 PDF 的整页截图加入题目，不再自动识别或裁剪。";
}

function getMaterialTitles(mode, subject) {
  if (mode === "full") {
    return {
      question: "全科题目材料",
      answer: "听力 / 阅读答案",
      audio: "听力音频",
      extra: "图片 / 附加材料（可选）",
    };
  }
  return {
    listening: {
      question: "听力题目材料",
      answer: "听力答案材料",
      audio: "听力音频",
      extra: "地图 / 附加图片（可选）",
    },
    reading: {
      question: "阅读题目材料",
      answer: "阅读答案材料",
      audio: "听力音频",
      extra: "阅读图表 / 附加图片（可选）",
    },
    writing: {
      question: "写作题目材料",
      answer: "答案材料",
      audio: "听力音频",
      extra: "Task 1 图表 / 图片（可选）",
    },
    speaking: {
      question: "口语题目材料",
      answer: "答案材料",
      audio: "听力音频",
      extra: "附加材料（可选）",
    },
  }[subject] || {
    question: "题目材料",
    answer: "答案材料",
    audio: "听力音频",
    extra: "图片 / 附加材料（可选）",
  };
}

function getSubjectMaterialHint(subject) {
  return {
    listening: "Listening：上传听力题目 PDF、答案 PDF、Part 1-4 音频；如果地图/平面图需要图片，在“将题目 PDF 第几页截图加入题目”里手动填写页码。",
    reading: "Reading：上传阅读题目 PDF 和答案 PDF；如果有图表/图片也一起上传。",
    writing: "Writing：上传 Task 1、Task 2 题目；Task 1 图表可以是 PDF 或图片。",
    speaking: "Speaking：上传 Part 1 问题、Part 2 cue card、Part 3 问题，可以是文本、PDF 或图片。",
  }[subject] || "请选择要练习的科目并上传对应材料。";
}

async function loadAiSettings() {
  let legacySettings = null;
  try {
    legacySettings = window.IeltsCore.parseSafeJson(safeGetStorage(localStorage, AI_SETTINGS_STORAGE_KEY, "null"));
  } catch {
    safeRemoveStorage(localStorage, AI_SETTINGS_STORAGE_KEY);
  }

  if (window.secureSettings) {
    try {
      const secureSettings = await window.secureSettings.load();
      if (secureSettings) {
        window.IeltsCore.assertSafeJsonValue(secureSettings);
        state.aiSettings = mergeAiSettings(secureSettings);
      } else if (legacySettings) {
        state.aiSettings = mergeAiSettings(legacySettings);
        await window.secureSettings.save(state.aiSettings);
      } else {
        state.aiSettings = structuredClone(defaultAiSettings);
      }
      safeRemoveStorage(localStorage, AI_SETTINGS_STORAGE_KEY);
      safeRemoveStorage(sessionStorage, AI_SETTINGS_SESSION_SECRETS_KEY);
      return;
    } catch (error) {
      console.warn("Secure AI settings could not be loaded.", error);
      showToast("系统安全存储不可用，API Key 将仅保留到当前标签页关闭。", "warning");
    }
  }

  let sessionSecrets = {};
  try {
    sessionSecrets = window.IeltsCore.parseSafeJson(safeGetStorage(sessionStorage, AI_SETTINGS_SESSION_SECRETS_KEY, "{}"));
  } catch {
    safeRemoveStorage(sessionStorage, AI_SETTINGS_SESSION_SECRETS_KEY);
  }
  state.aiSettings = mergeAiSettings(applyAiSecrets(legacySettings || {}, sessionSecrets));

  if (legacySettings) {
    const migratedSecrets = extractAiSecrets(legacySettings);
    if (Object.keys(migratedSecrets).length) {
      safeSetStorage(sessionStorage, AI_SETTINGS_SESSION_SECRETS_KEY, JSON.stringify(migratedSecrets));
    }
    safeSetStorage(localStorage, AI_SETTINGS_STORAGE_KEY, JSON.stringify(withoutAiSecrets(state.aiSettings)));
  }
}

function mergeAiSettings(saved) {
  window.IeltsCore.assertSafeJsonValue(saved);
  const merged = structuredClone(defaultAiSettings);
  const legacyGlm = saved.providers?.glm || {};
  Object.keys(merged.features).forEach((feature) => {
    const current = merged.features[feature];
    const legacyModel = feature === "ocr"
      ? legacyGlm.ocrModel
      : feature === "speech"
          ? legacyGlm.speechModel
          : legacyGlm.textModel;
    const migrated = {
      providerKey: "glm",
      baseUrl: legacyGlm.baseUrl || current.baseUrl,
      apiKey: legacyGlm.apiKey || current.apiKey,
      model: legacyModel || current.model,
    };
    const savedFeature = saved.features?.[feature] || {};
    merged.features[feature] = normalizeFeatureSettings({ ...migrated, ...savedFeature }, current);
  });
  Object.entries(merged.features).forEach(([feature, config]) => {
    if (["glm-4.5-air", "glm-4.5"].includes(config.model)) {
      config.model = "glm-5.2";
    }
  });
  return merged;
}

function extractAiSecrets(settings) {
  return Object.fromEntries(Object.entries(settings?.features || {})
    .filter(([, config]) => String(config?.apiKey || "").trim())
    .map(([feature, config]) => [feature, String(config.apiKey).trim()]));
}

function applyAiSecrets(settings, secrets) {
  const merged = structuredClone(settings || {});
  merged.features = merged.features || {};
  Object.entries(secrets || {}).forEach(([feature, apiKey]) => {
    merged.features[feature] = { ...(merged.features[feature] || {}), apiKey };
  });
  return merged;
}

function withoutAiSecrets(settings) {
  const sanitized = structuredClone(settings);
  Object.values(sanitized.features || {}).forEach((config) => {
    config.apiKey = "";
  });
  return sanitized;
}

function normalizeFeatureSettings(config, fallback) {
  return {
    providerKey: config.providerKey || fallback.providerKey || "glm",
    baseUrl: config.baseUrl || fallback.baseUrl || "",
    apiKey: config.apiKey || fallback.apiKey || "",
    model: config.model || fallback.model || "",
  };
}

const aiFeatureMeta = [
  {
    key: "ocr",
    title: "OCR / 文档解析",
    detail: "PDF、图片、扫描件转文本；GLM 会使用 layout_parsing 和同步解析。",
    placeholder: "glm-ocr",
    endpointHint: GLM_CHAT_COMPLETIONS_URL,
  },
  {
    key: "merge",
    title: "JSON 合并生成",
    detail: "把 OCR 文本合并成考试 JSON。可换 DeepSeek 这类文本模型。",
    placeholder: "glm-5.2 或 deepseek-chat",
    endpointHint: GLM_CHAT_COMPLETIONS_URL,
  },
  {
    key: "explain",
    title: "错题解析",
    detail: "客观题错题解释。",
    placeholder: "glm-5.2 或 deepseek-chat",
    endpointHint: GLM_CHAT_COMPLETIONS_URL,
  },
  {
    key: "writing",
    title: "写作批改",
    detail: "Task 1 / Task 2 反馈和评分。",
    placeholder: "glm-5.2 或 deepseek-chat",
    endpointHint: GLM_CHAT_COMPLETIONS_URL,
  },
  {
    key: "speaking",
    title: "口语批改",
    detail: "基于录音转写或笔记给口语反馈。",
    placeholder: "glm-5.2 或 deepseek-chat",
    endpointHint: GLM_CHAT_COMPLETIONS_URL,
  },
  {
    key: "speech",
    title: "语音转写",
    detail: "口语录音 ASR。默认走 GLM-ASR。",
    placeholder: "glm-asr-2512",
    endpointHint: GLM_CHAT_COMPLETIONS_URL,
  },
  {
    key: "fluency",
    title: "流利度 / 发音评分",
    detail: "科大讯飞 ISE 语音评测。API Key 栏填 APPID|APIKey|APISecret，或 JSON：{\"appId\":\"...\",\"apiKey\":\"...\",\"apiSecret\":\"...\"}。",
    placeholder: "read_chapter",
    endpointHint: XFYUN_ISE_WS_URL,
  }
];

function renderAiSettings() {
  els.aiProviderGrid.innerHTML = aiFeatureMeta.map((meta) => {
    const config = getFeatureSettings(meta.key);
    return `
      <section class="provider-card model-settings-card" data-feature-card="${escapeAttribute(meta.key)}">
        <div class="model-settings-head">
          <h3>${escapeHtml(meta.title)}</h3>
          <p>${escapeHtml(meta.detail)}</p>
        </div>
        <div class="feature-settings-grid">
          <label class="field-stack">
            <span>服务</span>
            <select data-ai-feature="${escapeAttribute(meta.key)}" data-ai-field="providerKey">
              ${renderProviderOption(config.providerKey, "glm", "GLM / 智谱")}
              ${renderProviderOption(config.providerKey, "xfyun", "科大讯飞")}
              ${renderProviderOption(config.providerKey, "deepseek", "DeepSeek")}
              ${renderProviderOption(config.providerKey, "custom", "OpenAI 兼容 / 自定义")}
            </select>
          </label>
          <label class="field-stack feature-endpoint">
            <span>接口地址</span>
            <input data-ai-feature="${escapeAttribute(meta.key)}" data-ai-field="baseUrl" type="text" value="${escapeAttribute(config.baseUrl || "")}" placeholder="${escapeAttribute(meta.endpointHint)}" />
          </label>
          <label class="field-stack">
            <span>API Key</span>
            <input data-ai-feature="${escapeAttribute(meta.key)}" data-ai-field="apiKey" type="password" value="${escapeAttribute(config.apiKey || "")}" autocomplete="off" placeholder="只保存在本机" />
          </label>
          <label class="field-stack">
            <span>模型</span>
            <input data-ai-feature="${escapeAttribute(meta.key)}" data-ai-field="model" type="text" value="${escapeAttribute(config.model || "")}" placeholder="${escapeAttribute(meta.placeholder)}" />
          </label>
        </div>
      </section>
    `;
  }).join("");
  document.querySelectorAll("[data-ai-feature][data-ai-field='providerKey']").forEach((select) => {
    select.addEventListener("change", () => {
      applyProviderPreset(select);
      validateAiSettingsForm();
    });
  });
  document.querySelectorAll("[data-ai-feature]").forEach((input) => {
    input.addEventListener("input", () => validateAiSettingsForm());
  });
  validateAiSettingsForm();
}

function renderProviderOption(current, value, label) {
  return `<option value="${escapeAttribute(value)}" ${current === value ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

function applyProviderPreset(select) {
  const card = select.closest("[data-feature-card]");
  if (!card) return;
  const providerKey = select.value;
  const baseInput = card.querySelector("[data-ai-field='baseUrl']");
  const modelInput = card.querySelector("[data-ai-field='model']");
  if (providerKey === "glm") {
    baseInput.value = GLM_CHAT_COMPLETIONS_URL;
    const meta = aiFeatureMeta.find((item) => item.key === card.dataset.featureCard);
    modelInput.value = defaultAiSettings.features[meta?.key]?.model || modelInput.value;
  }
  if (providerKey === "deepseek") {
    baseInput.value = DEEPSEEK_CHAT_COMPLETIONS_URL;
    if (!["ocr", "speech"].includes(card.dataset.featureCard)) {
      modelInput.value = "deepseek-chat";
    }
  }
  if (providerKey === "xfyun") {
    if (card.dataset.featureCard === "fluency") {
      modelInput.value = "read_chapter";
      baseInput.value = XFYUN_ISE_WS_URL;
      return;
    }
    baseInput.value = "";
  }
}

function collectAiSettingsFromForm() {
  const next = structuredClone(defaultAiSettings);
  document.querySelectorAll("[data-ai-feature]").forEach((input) => {
    const feature = input.dataset.aiFeature;
    const field = input.dataset.aiField;
    if (!next.features[feature]) return;
    next.features[feature][field] = input.value.trim();
  });
  return mergeAiSettings(next);
}

function validateAiSettingsForm(showSummary = false) {
  document.querySelectorAll(".field-error").forEach((node) => node.remove());
  document.querySelectorAll("[data-ai-feature]").forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
  let errorCount = 0;
  document.querySelectorAll("[data-feature-card]").forEach((card) => {
    const config = {};
    card.querySelectorAll("[data-ai-field]").forEach((input) => {
      config[input.dataset.aiField] = input.value.trim();
    });
    const errors = window.IeltsCore.validateFeatureConfig(config);
    Object.entries(errors).forEach(([field, message]) => {
      const input = card.querySelector(`[data-ai-field="${field}"]`);
      if (!input) return;
      input.setAttribute("aria-invalid", "true");
      const error = document.createElement("small");
      error.className = "field-error";
      error.textContent = message;
      input.closest(".field-stack")?.appendChild(error);
      errorCount += 1;
    });
  });
  els.saveAiSettingsBtn.disabled = errorCount > 0;
  if (showSummary && errorCount) {
    els.aiSettingsStatus.textContent = `请先修正 ${errorCount} 处设置。`;
  }
  return errorCount === 0;
}

async function persistAiSettings() {
  if (window.secureSettings) {
    await window.secureSettings.save(state.aiSettings);
    safeRemoveStorage(localStorage, AI_SETTINGS_STORAGE_KEY);
    safeRemoveStorage(sessionStorage, AI_SETTINGS_SESSION_SECRETS_KEY);
    return "已使用系统安全存储加密保存";
  }
  if (!safeSetStorage(localStorage, AI_SETTINGS_STORAGE_KEY, JSON.stringify(withoutAiSecrets(state.aiSettings)))) {
    throw new Error("浏览器本地存储不可用。");
  }
  safeSetStorage(sessionStorage, AI_SETTINGS_SESSION_SECRETS_KEY, JSON.stringify(extractAiSecrets(state.aiSettings)));
  return "配置已保存；API Key 仅保留在当前标签页";
}

async function saveAiSettingsFromForm() {
  if (!validateAiSettingsForm(true)) return;
  state.aiSettings = collectAiSettingsFromForm();
  try {
    els.aiSettingsStatus.textContent = await persistAiSettings();
  } catch (error) {
    console.error("AI settings could not be saved securely.", error);
    els.aiSettingsStatus.textContent = "安全保存失败，API Key 未写入磁盘";
    showToast("模型设置保存失败，请重试。", "error");
  }
}

async function resetAiSettings() {
  state.aiSettings = structuredClone(defaultAiSettings);
  renderAiSettings();
  try {
    els.aiSettingsStatus.textContent = `${await persistAiSettings()}，并已恢复默认`;
  } catch (error) {
    console.error("Default AI settings could not be persisted.", error);
    els.aiSettingsStatus.textContent = "已恢复默认，但安全存储写入失败";
  }
}

async function clearLocalExamData() {
  const confirmed = confirm("确定清除本机保存的考试库、考试记录、当季口语题库和待添加内容吗？模型设置会保留。");
  if (!confirmed) return;
  state.library.forEach((entry) => revokeAssetMap(entry.assets));
  state.library = [];
  state.pendingTest = null;
  state.pendingSource = "";
  state.assets.clear();
  localStorage.removeItem(LIBRARY_STORAGE_KEY);
  localStorage.removeItem("ielts-mock-history");
  localStorage.removeItem(SPEAKING_BANK_STORAGE_KEY);
  localStorage.removeItem(SPEAKING_BANK_BUNDLED_ID_STORAGE_KEY);
  await clearAssetDb();
  state.speakingBank = null;
  els.jsonInput.value = "";
  els.assetInput.value = "";
  els.jsonFileName.textContent = "选择 .json 文件";
  els.assetFileName.textContent = "可多选，按文件名自动匹配 JSON 引用";
  renderPendingTest();
  renderLibrary();
  renderHistoryList();
  renderSpeakingBankStatus();
  els.aiSettingsStatus.textContent = "考试库和记录已清除";
}

async function generateExamWithAi() {
  const files = collectAiImportFiles();
  const questionText = els.aiQuestionText.value.trim();
  const answerText = els.aiAnswerText.value.trim();
  if (!files.length && !questionText && !answerText) {
    alert("请先上传材料，或粘贴题目/答案文本。");
    return;
  }

  setAiGenerating(true);
  const startedAt = performance.now();
  let stage = "准备读取材料";
  state.aiAbortController = new AbortController();
  setAiStatus("正在读取材料...", 4);
  try {
    const questionPdfImagePage = getQuestionPdfImagePageInput();
    stage = "读取并渲染本地材料";
    const material = await buildAiMaterial(files, questionText, answerText, questionPdfImagePage);
    setAiProgress(10, "材料读取完成");
    if (material.warnings.length) {
      setAiStatus(`正在继续生成，但请注意：${material.warnings.join("；")}`);
    }
    stage = "逐页 OCR / 页面转写";
    setAiStatus("正在逐页解析 PDF/图片...", 12);
    const test = await callAiForExam(material, (text, progress) => {
      stage = text;
      setAiStatus(text, progress);
    });
    attachListeningTranscriptContext(test, material);
    stage = "处理手动 PDF 页截图";
    setAiStatus("正在处理手动指定的 PDF 页截图...", 90);
    const generatedAssets = await applyImageCrops(test, material);
    stage = "最终本地校验";
    setAiProgress(95, "正在进行最终校验");
    validateTest(test);
    const generatedFileName = makeJsonFileName(test.title || "ielts-generated-test");
    downloadJson(test, generatedFileName);
    downloadGeneratedAssets(generatedAssets);
    const assets = createAssetMapFromFiles(files);
    mergeAssetMap(assets, generatedAssets);
    mergeAssetMap(state.assets, generatedAssets);
    await addTestToLibrary(test, generatedFileName, true, assets);
    clearAiImportForm(false);
    const warningText = material.warnings.length ? `（提醒：${material.warnings.join("；")}）` : "";
    setAiStatus(`已生成并加入考试库：${test.title || "Untitled Test"}${warningText}`, 100);
    els.aiProgress.dataset.state = "complete";
  } catch (error) {
    console.error(error);
    const elapsedMs = Math.round(performance.now() - startedAt);
    const message = formatGenerationError(error, stage, elapsedMs);
    setAiStatus(message);
    els.aiProgress.dataset.state = "error";
    els.aiProgressLabel.textContent = "未完成";
    showToast(message, "error");
  } finally {
    state.aiAbortController = null;
    setAiGenerating(false);
  }
}

function setAiGenerating(isGenerating) {
  els.aiGenerateBtn.disabled = isGenerating;
  els.aiCancelBtn.hidden = !isGenerating;
  els.aiCancelBtn.disabled = !isGenerating;
  if (isGenerating) {
    els.aiProgress.dataset.state = "active";
    setAiProgress(0, "正在准备");
  }
}

function cancelAiGeneration() {
  if (!state.aiAbortController) return;
  state.aiAbortController.abort(new AiGenerationError("用户已取消生成。", "ABORTED"));
  setAiStatus("正在取消生成...");
  els.aiProgressLabel.textContent = "正在取消";
}

function collectAiImportFiles() {
  const groups = [
    [els.aiQuestionFileInput, "question"],
    [els.aiAnswerFileInput, "answer"],
    [els.aiAudioFileInput, "audio"],
    [els.aiListeningTranscriptFileInput, "listening-transcript"],
    [els.aiExtraFileInput, "extra"],
  ];
  return groups.flatMap(([input, role]) => {
    if (input.closest("[data-material-box]")?.hidden) return [];
    return Array.from(input.files || []).map((file) => {
      file.materialRole = role;
      return file;
    });
  });
}

function getQuestionPdfImagePageInput() {
  const raw = String(els.aiQuestionPdfPageInput.value || "").trim();
  if (!raw) return null;
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("PDF 截图页码必须是大于 0 的整数。");
  }
  return page;
}

function setAiStatus(text, progress) {
  els.aiStatus.textContent = text;
  if (Number.isFinite(progress)) setAiProgress(progress);
}

function setAiProgress(percent, label = "") {
  const value = Math.max(0, Math.min(100, Number(percent) || 0));
  els.aiProgress.hidden = false;
  els.aiProgressBar.value = value;
  els.aiProgressLabel.textContent = label || `${Math.round(value)}%`;
}

async function buildAiMaterial(files, questionText, answerText, questionPdfImagePage = null) {
  const target = getAiImportTarget();
  const useGlmOcr = getAiProviderKey("ocr") === "glm" && getAiProvider("ocr").model;
  const fileSummaries = [];
  const textSnippets = [];
  const imageInputs = [];
  const ocrInputs = [];
  const pdfFiles = [];
  const pdfInputs = [];
  const listeningTranscriptFiles = [];
  const warnings = [];
  for (const file of files) {
    const lower = file.name.toLowerCase();
    const kind = getFileKind(file);
    const summary = {
      name: file.name,
      type: file.type || "unknown",
      size: file.size,
      kind,
      role: file.materialRole || "mixed",
      inferredPart: inferAudioPart(file.name),
    };
    fileSummaries.push(summary);
    if (file.materialRole === "listening-transcript") {
      listeningTranscriptFiles.push(file);
      continue;
    }
    if (kind === "text" || lower.endsWith(".json") || lower.endsWith(".csv") || lower.endsWith(".md")) {
      textSnippets.push(`\n--- FILE: ${file.name} ---\n${await file.text()}`);
    }
    if (kind === "image") {
      const imageInput = {
        name: file.name,
        label: file.name,
        materialRole: file.materialRole || "mixed",
        sourceKind: "upload-image",
        size: file.size,
        file,
        dataUrl: await fileToDataUrl(file),
      };
      imageInputs.push(imageInput);
      ocrInputs.push(imageInput);
    }
    if (kind === "pdf") {
      pdfFiles.push(file);
      pdfInputs.push({
        name: file.name,
        label: file.name,
        sourceName: file.name,
        materialRole: file.materialRole || "mixed",
        kind: "pdf",
        size: file.size,
        file,
      });
    }
  }
  if (useGlmOcr && pdfFiles.length) {
    const longPdfFiles = [];
    for (const file of pdfFiles) {
      const pageCount = await getPdfPageCount(file);
      if (pageCount > OCR_PDF_PAGE_BATCH_SIZE) {
        longPdfFiles.push(file);
        const dataUrl = await fileToDataUrl(file);
        for (let startPage = 1; startPage <= pageCount; startPage += OCR_PDF_PAGE_BATCH_SIZE) {
          const endPage = Math.min(pageCount, startPage + OCR_PDF_PAGE_BATCH_SIZE - 1);
          ocrInputs.push({
            name: file.name,
            label: `${file.name} 第 ${startPage}-${endPage} 页`,
            sourceName: file.name,
            materialRole: file.materialRole || "mixed",
            kind: "pdf-range",
            size: file.size,
            dataUrl,
            pageNumber: startPage,
            pageStart: startPage,
            pageEnd: endPage,
            pageCount,
          });
        }
      } else {
        ocrInputs.push({
          name: file.name,
          label: file.name,
          sourceName: file.name,
          materialRole: file.materialRole || "mixed",
          kind: "pdf",
          size: file.size,
          file,
          dataUrl: await fileToDataUrl(file),
        });
      }
    }
    if (longPdfFiles.length) {
      warnings.push(`超过 ${OCR_PDF_PAGE_BATCH_SIZE} 页的 PDF 已按每 ${OCR_PDF_PAGE_BATCH_SIZE} 页一批调用 GLM-OCR；需要题目截图时会按填写页码临时渲染。`);
    }
    if (pdfFiles.length > longPdfFiles.length) {
      warnings.push(`不超过 ${OCR_PDF_PAGE_BATCH_SIZE} 页的 PDF 仍使用官方文件解析接口。`);
    }
  } else if (!useGlmOcr && (pdfFiles.length || imageInputs.length)) {
    warnings.push("未启用 GLM-OCR，PDF/图片不会自动识别文字；可粘贴题目/答案文本，或填写页码把 PDF 截图加入题目。");
  }
  const textSnippetsRaw = textSnippets.join("\n");
  if (textSnippetsRaw.length > 90000) {
    warnings.push("上传文本内容过长，已只保留前 90000 个字符给 AI");
  }

  return {
    target,
    questionText,
    answerText,
    fileSummaries,
    imageInputs,
    ocrInputs,
    pdfInputs,
    textSnippets: textSnippetsRaw.slice(0, 90000),
    listeningTranscriptFileRefs: listeningTranscriptFiles.map((file) => file.name),
    questionPdfImagePage,
    warnings,
  };
}

function getAiImportTarget() {
  const mode = document.querySelector("input[name='libraryMode']:checked")?.value || "single";
  const subject = els.singleSubject.value || "listening";
  return {
    mode: "single",
    libraryMode: mode,
    subject,
    allowedTestTypes: [subject],
  };
}

function isAnswerFileName(name) {
  return /答案|answer|key|解析|solution/i.test(String(name || ""));
}

function isAnswerMaterial(file) {
  return file?.materialRole === "answer" || isAnswerFileName(file?.name);
}

async function renderPdfFileToImages(file, maxPages, role = "PDF", startPage = 1) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js 未加载，无法读取扫描版 PDF。请确认应用文件完整，或把 PDF 页面导出成图片上传。");
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  try {
    const pageCount = Math.min(pdf.numPages, startPage + maxPages - 1);
    const pages = [];
    for (let pageNumber = startPage; pageNumber <= pageCount; pageNumber += 1) {
      throwIfAiAborted();
      setAiStatus(`正在把 ${file.name} 第 ${pageNumber}/${pdf.numPages} 页转成图片...`);
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(1.5, AI_PDF_RENDER_MAX_WIDTH / baseViewport.width);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvasContext: context, viewport }).promise;
      const textContent = await page.getTextContent().catch(() => null);
      const pageText = textContent ? textContent.items.map((item) => item.str || "").join(" ") : "";
      const width = canvas.width;
      const height = canvas.height;
      const dataUrl = canvasToDataUrlAndRelease(canvas, "image/jpeg", 0.76);
      page.cleanup();
      pages.push({
        name: file.name,
        label: `${role}: ${file.name} page ${pageNumber}`,
        sourceName: file.name,
        pageNumber,
        text: pageText,
        sourceKind: "pdf-render",
        materialRole: file.materialRole || (isAnswerFileName(file.name) ? "answer" : "question"),
        width,
        height,
        dataUrl,
      });
    }
    return pages;
  } finally {
    await pdf.destroy();
  }
}

async function getPdfPageCount(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js 未加载，无法读取 PDF 页数。请确认应用文件完整。");
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  try {
    return pdf.numPages;
  } finally {
    await pdf.destroy();
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`无法读取文件：${file.name}`));
    reader.readAsDataURL(file);
  });
}

function normalizeOcrFilePayload(input) {
  const dataUrl = String(input?.dataUrl || "").trim();
  if (/^https?:\/\//i.test(dataUrl)) return dataUrl;
  const match = dataUrl.match(/^data:([^;,]*)(;[^,]*)?;base64,(.+)$/i);
  if (!match) throw new Error(`${input?.name || "文件"} 无法转换为 OCR 可识别的 base64 文件。`);
  const mime = normalizeOcrMime(match[1], input?.name);
  return `data:${mime};base64,${match[3]}`;
}

function normalizeOcrMime(mime, name = "") {
  const normalized = String(mime || "").toLowerCase();
  if (["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(normalized)) {
    return normalized === "image/jpg" ? "image/jpeg" : normalized;
  }
  if (/\.pdf$/i.test(name)) return "application/pdf";
  if (/\.png$/i.test(name)) return "image/png";
  if (/\.jpe?g$/i.test(name)) return "image/jpeg";
  return normalized || "application/octet-stream";
}

function validateOcrInput(input) {
  const name = input?.name || "文件";
  const mime = normalizeOcrMime(String(input?.dataUrl || "").match(/^data:([^;,]*)/i)?.[1], name);
  const isPdf = mime === "application/pdf" || /\.pdf$/i.test(name);
  const isImage = ["image/png", "image/jpeg"].includes(mime) || /\.(png|jpe?g)$/i.test(name);
  if (!isPdf && !isImage) {
    throw new Error(`${name} 不是 OCR 支持的格式。当前只支持 PDF、JPG、JPEG、PNG。`);
  }
  const size = Number(input?.size || 0);
  if (input?.file) {
    if (isPdf && size > 100 * 1024 * 1024) {
      throw new Error(`${name} 超过官方同步文件解析 PDF 100MB 限制。`);
    }
    if (isImage && size > 20 * 1024 * 1024) {
      throw new Error(`${name} 超过官方同步文件解析图片 20MB 限制。`);
    }
    return;
  }
  if (isPdf && size > 50 * 1024 * 1024) {
    throw new Error(`${name} 超过 OCR PDF 50MB 限制。`);
  }
  if (isImage && size > 10 * 1024 * 1024) {
    throw new Error(`${name} 超过 OCR 图片 10MB 限制。`);
  }
}

function getFileKind(file) {
  const type = file.type || "";
  const name = file.name.toLowerCase();
  if (type.startsWith("audio/")) return "audio";
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(name)) return "text";
  return "other";
}

function inferAudioPart(name) {
  const lower = name.toLowerCase();
  const match = lower.match(/(?:part|section|sec|p)\s*[_-]?\s*([1-4])/i) || lower.match(/\b([1-4])\b/);
  return match ? `Part ${match[1]}` : "";
}

function createAssetMapFromFiles(files) {
  const assets = new Map();
  files.forEach((file) => {
    const kind = getFileKind(file);
    if (!["audio", "image"].includes(kind) && file.materialRole !== "listening-transcript") return;
    const url = URL.createObjectURL(file);
    addAssetAliases(assets, file.name, { file, url });
  });
  return assets;
}

function mergeAssetMap(target, source) {
  (source || new Map()).forEach((asset, key) => target.set(key, asset));
}

function addAssetAliases(assets, name, asset) {
  getAssetLookupKeys(name).forEach((key) => assets.set(key, asset));
}

function attachListeningTranscriptContext(test, material) {
  const transcriptFiles = ensureArray(material?.listeningTranscriptFileRefs).map(String).filter(Boolean);
  if (test?.testType !== "listening" || !transcriptFiles.length) return;
  test.analysisContext = {
    ...(test.analysisContext || {}),
    listeningTranscriptFiles: transcriptFiles,
  };
}

function getAssetLookupKeys(name) {
  const raw = String(name || "").trim();
  if (!raw) return [];
  const normalized = raw.replace(/\\/g, "/");
  const baseName = normalized.split("/").filter(Boolean).pop() || normalized;
  const keys = [
    normalized,
    normalized.toLowerCase(),
    baseName,
    baseName.toLowerCase(),
    `images/${baseName}`,
    `images/${baseName}`.toLowerCase(),
    `assets/${baseName}`,
    `assets/${baseName}`.toLowerCase(),
  ];
  return Array.from(new Set(keys.filter(Boolean)));
}

function findAssetForRef(assets, ref) {
  if (!assets || !ref) return null;
  for (const key of getAssetLookupKeys(ref)) {
    const asset = assets.get(key);
    if (asset) return asset;
  }
  return null;
}

async function applyImageCrops(test, material) {
  const assets = new Map();
  const cropTargets = [];
  if (["listening", "writing"].includes(test?.testType)) {
    removeGeneratedImageCrops(test);
  } else {
    (test.sections || []).forEach((section, sectionIndex) => {
      if (section.imageCrop) {
        cropTargets.push({ target: section, sectionIndex, groupIndex: null });
      }
      (section.groups || []).forEach((group, groupIndex) => {
        if (group.imageCrop) cropTargets.push({ target: group, sectionIndex, groupIndex });
      });
    });
  }
  for (const item of cropTargets) {
    const { target, sectionIndex, groupIndex } = item;
    let source = findCropSource(material.imageInputs, target.imageCrop);
    if (!source) {
      source = await renderPdfPageForCrop(material, target.imageCrop);
    }
    if (!source) {
      console.warn("No source image found for crop", target.imageCrop);
      continue;
    }
    try {
      const cropName = makeCropFileName(test, sectionIndex, groupIndex);
      const dataUrl = await cropImageDataUrl(source, target.imageCrop, { fromYToBottom: true });
      const asset = { url: dataUrl, dataUrl, generated: true, file: null };
      addAssetAliases(assets, cropName, asset);
      target.image = dataUrl;
      target.imageName = cropName;
      delete target.imageCrop;
    } catch (error) {
      console.warn("Image crop failed", error);
    }
  }
  await applyManualPdfPageImage(test, material, assets);
  return assets;
}

function removeGeneratedImageCrops(test) {
  (test.sections || []).forEach((section) => {
    delete section.imageCrop;
    (section.groups || []).forEach((group) => {
      delete group.imageCrop;
    });
  });
}

function hasResolvableImageRef(target, assets) {
  const refs = [target?.image, target?.imageAsset, target?.imageName].filter(Boolean).map(String);
  return refs.some((ref) => {
    if (isPdfAssetRef(ref)) return false;
    if (/^data:image\//i.test(ref) || /^blob:/i.test(ref)) return true;
    const asset = findAssetForRef(assets, ref);
    return asset ? isImageAsset(asset, ref) : isLikelyImageRef(ref);
  });
}

async function applyManualPdfPageImage(test, material, assets) {
  const pageNumber = Number(material?.questionPdfImagePage || 0);
  if (!pageNumber || !["listening", "writing"].includes(test?.testType)) return;
  const target = getManualPdfPageImageTarget(test);
  if (!target) {
    throw new Error("已填写 PDF 截图页码，但当前考试没有找到可插入图片的题目位置。");
  }
  const source = findRenderedQuestionPdfPage(material, pageNumber) || await renderQuestionPdfPage(material, pageNumber);
  if (!source) {
    throw new Error(`无法从题目 PDF 读取第 ${pageNumber} 页截图。请确认题目材料里有 PDF，且页码正确。`);
  }
  const { target: imageTarget, sectionIndex, groupIndex } = target;
  await attachCroppedImage({
    test,
    assets,
    target: imageTarget,
    sectionIndex,
    groupIndex,
    source,
    crop: makeFullPageFallbackCrop(source),
  });
  if (!hasResolvableImageRef(imageTarget, assets)) {
    throw new Error("PDF 页截图已读取，但没有成功写入题目。");
  }
}

function getManualPdfPageImageTarget(test) {
  if (test?.testType === "writing") {
    const section = (test.sections || [])[0];
    return section ? { target: section, sectionIndex: 0, groupIndex: null } : null;
  }
  if (test?.testType === "listening") {
    const sectionIndex = Math.min(1, Math.max(0, (test.sections || []).length - 1));
    const section = (test.sections || [])[sectionIndex];
    if (!section) return null;
    const groupIndex = section.groups?.[1] ? 1 : 0;
    const group = section.groups?.[groupIndex];
    return group
      ? { target: group, sectionIndex, groupIndex }
      : { target: section, sectionIndex, groupIndex: null };
  }
  return null;
}

function findRenderedQuestionPdfPage(material, pageNumber) {
  return (material?.imageInputs || []).find((item) => {
    const role = String(item?.materialRole || "").toLowerCase();
    if (role === "answer" || isUploadedImageSource(item) || !item?.dataUrl) return false;
    return Number(item?.pageNumber || 0) === Number(pageNumber);
  }) || null;
}

async function renderQuestionPdfPage(material, pageNumber) {
  for (const input of getQuestionPdfInputs(material)) {
    const pages = await renderPdfCandidatePages(input, pageNumber, 1);
    if (pages[0]) return pages[0];
  }
  return null;
}

function getQuestionPdfInputs(material) {
  const inputs = material?.pdfInputs?.length ? material.pdfInputs : material?.ocrInputs || [];
  return inputs.filter((input) => {
    const role = String(input.materialRole || "").toLowerCase();
    return input?.file && getFileKind(input.file) === "pdf" && role !== "answer";
  });
}

async function attachCroppedImage({ test, assets, target, sectionIndex, groupIndex, source, crop }) {
  const imageName = makeCropFileName(test, sectionIndex, groupIndex);
  const dataUrl = await cropImageDataUrl(source, crop, { fromYToBottom: true });
  const asset = { url: dataUrl, dataUrl, generated: true, file: null };
  addAssetAliases(assets, imageName, asset);
  target.image = dataUrl;
  target.imageName = imageName;
}

function makeFullPageFallbackCrop(source) {
  return {
    source: source?.sourceName || source?.name,
    page: source?.pageNumber || 1,
    questionEndY: 0,
  };
}

function isUploadedImageSource(item) {
  return item?.sourceKind === "upload-image" || (item?.file && getFileKind(item.file) === "image");
}

async function renderPdfCandidatePages(input, startPage = 1, maxPages = 6) {
  if (!input?.file || !window.pdfjsLib) return [];
  const rendered = await renderPdfFileToImages(input.file, maxPages, "question paper", startPage);
  return rendered.map((page) => ({
    ...page,
    materialRole: input.materialRole || page.materialRole || "question",
    sourceName: input.sourceName || input.name || page.sourceName,
  }));
}

function findCropSource(imageInputs, crop) {
  if (!crop) return null;
  const sourceText = String(crop.source || crop.sourcePdf || crop.file || "").toLowerCase();
  const page = Number(crop.page || crop.pageNumber || 0);
  return (imageInputs || []).find((image) => {
    const names = [image.label, image.name, image.sourceName].filter(Boolean).map((value) => String(value).toLowerCase());
    const nameMatches = !sourceText || names.some((name) => name.includes(sourceText) || sourceText.includes(name));
    const pageMatches = !page || Number(image.pageNumber || 0) === page || String(image.label || "").toLowerCase().includes(`page ${page}`);
    return nameMatches && pageMatches;
  }) || (imageInputs || []).find((image) => {
    if (!page) return false;
    return Number(image.pageNumber || 0) === page || String(image.label || "").toLowerCase().includes(`page ${page}`);
  });
}

async function renderPdfPageForCrop(material, crop) {
  if (!crop || !window.pdfjsLib) return null;
  const sourceText = String(crop.source || crop.sourcePdf || crop.file || "").toLowerCase();
  const page = Number(crop.page || crop.pageNumber || 1);
  const pdfInput = (material.ocrInputs || []).find((input) => {
    if (!input?.file) return false;
    const names = [input.name, input.label, input.sourceName].filter(Boolean).map((value) => String(value).toLowerCase());
    return !sourceText || names.some((name) => name.includes(sourceText) || sourceText.includes(name));
  });
  if (!pdfInput?.file) return null;
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
  const buffer = await pdfInput.file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  try {
    const pageNumber = Math.min(Math.max(1, page), pdf.numPages);
    const pdfPage = await pdf.getPage(pageNumber);
    const baseViewport = pdfPage.getViewport({ scale: 1 });
    const scale = Math.min(1.5, AI_PDF_RENDER_MAX_WIDTH / baseViewport.width);
    const viewport = pdfPage.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await pdfPage.render({ canvasContext: context, viewport }).promise;
    const width = canvas.width;
    const height = canvas.height;
    const dataUrl = canvasToDataUrlAndRelease(canvas, "image/jpeg", 0.85);
    pdfPage.cleanup();
    return {
      dataUrl,
      width,
      height,
      name: pdfInput.name,
      label: pdfInput.label,
      sourceName: pdfInput.sourceName,
      pageNumber,
    };
  } finally {
    await pdf.destroy();
  }
}

async function cropImageDataUrl(source, crop, options = {}) {
  const image = await loadImage(source.dataUrl);
  try {
    const bounds = normalizeCropBounds(crop, image.naturalWidth || image.width, image.naturalHeight || image.height, options);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bounds.width));
    canvas.height = Math.max(1, Math.round(bounds.height));
    const context = canvas.getContext("2d");
    context.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, canvas.width, canvas.height);
    return canvasToDataUrlAndRelease(canvas, "image/png");
  } finally {
    image.onload = null;
    image.onerror = null;
    image.src = "";
  }
}

function canvasToDataUrlAndRelease(canvas, type, quality) {
  const dataUrl = canvas.toDataURL(type, quality);
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
  return dataUrl;
}

function normalizeCropBounds(crop, imageWidth, imageHeight, options = {}) {
  const raw = {
    x: Number(crop.x ?? crop.left ?? 0),
    y: Number(crop.y ?? crop.top ?? 0),
    width: Number(crop.width ?? crop.w ?? 0),
    height: Number(crop.height ?? crop.h ?? 0),
  };
  const fractional = raw.x <= 1 && raw.y <= 1 && raw.width <= 1 && raw.height <= 1;
  const scaleX = fractional ? imageWidth : 1;
  const scaleY = fractional ? imageHeight : 1;
  if (options.fromYToBottom) {
    const yRaw = Number(crop.questionEndY ?? crop.textEndY ?? crop.visualStartY ?? crop.y ?? crop.top ?? 0);
    const yFractional = Number.isFinite(yRaw) && yRaw <= 1;
    const padding = Math.max(8, imageHeight * 0.012);
    const y = Math.max(0, Math.min(imageHeight - 1, (yRaw * (yFractional ? imageHeight : 1)) - padding));
    return {
      x: 0,
      y,
      width: imageWidth,
      height: Math.max(1, imageHeight - y),
    };
  }
  let x = raw.x * scaleX;
  let y = raw.y * scaleY;
  let width = raw.width * scaleX;
  let height = raw.height * scaleY;
  const padding = Math.max(12, Math.min(imageWidth, imageHeight) * 0.03);
  x -= padding;
  y -= padding;
  width += padding * 2;
  height += padding * 2;
  x = Math.max(0, Math.min(imageWidth - 1, x));
  y = Math.max(0, Math.min(imageHeight - 1, y));
  width = Math.max(1, Math.min(imageWidth - x, width));
  height = Math.max(1, Math.min(imageHeight - y, height));
  return { x, y, width, height };
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      image.onload = null;
      image.onerror = null;
      resolve(image);
    };
    image.onerror = () => {
      image.onload = null;
      image.onerror = null;
      image.src = "";
      reject(new Error("无法加载待裁剪图片。"));
    };
    image.src = dataUrl;
  });
}

function makeCropFileName(test, sectionIndex, groupIndex) {
  const base = makeJsonFileName(test.title || "ielts-generated-test").replace(/\.json$/i, "");
  const suffix = groupIndex === null ? `s${sectionIndex + 1}` : `s${sectionIndex + 1}-g${groupIndex + 1}`;
  return `${base}-page-image-${suffix}.png`;
}

async function callAiForExam(material, onStatus = () => {}) {
  const extractedPages = await extractPagesWithOcr(material, onStatus);
  material.extractedPages = extractedPages;
  return mergeExtractedTextToExam(material, extractedPages, onStatus);
}

async function extractPagesWithOcr(material, onStatus = () => {}) {
  if (getAiProviderKey("ocr") === "glm" && getAiProvider("ocr").model) {
    const inputs = material.ocrInputs || [];
    if (!inputs.length) return [];
    return transcribePagesWithGlmOcr(inputs, material, onStatus);
  }
  onStatus("未启用 GLM-OCR，跳过 PDF/图片 OCR。", 70);
  return [];
}

async function transcribePagesWithGlmOcr(inputs, material, onStatus = () => {}) {
  const pages = new Array(inputs.length);
  for (let index = 0; index < inputs.length; index += 1) {
    throwIfAiAborted();
    const input = inputs[index];
    const progress = 12 + Math.round((index / inputs.length) * 58);
    onStatus(`OCR：正在解析第 ${index + 1}/${inputs.length} 个文件：${input.label || input.name}...`, progress);
    try {
      const page = await requestGlmOcrPage(input);
      pages[index] = {
        label: input.label || input.name,
        sourceName: input.sourceName || input.name,
        pageNumber: input.pageNumber || null,
        width: input.width || null,
        height: input.height || null,
        pageType: inferOcrPageType(input),
        testTitle: "",
        sectionTitle: "",
        questionRanges: extractQuestionRangesFromText(page.fullText),
        groups: [],
        answers: [],
        ...page,
      };
    } catch (error) {
      throw new Error(`OCR 第 ${index + 1}/${inputs.length} 个文件解析失败：${error.message || error}`);
    }
  }
  onStatus(`OCR：已返回 ${pages.filter(Boolean).length}/${inputs.length} 个文件`, 70);
  return pages;
}

async function requestGlmOcrPage(input) {
  const provider = getAiProvider("ocr");
  if (!provider.apiKey) throw new Error("模型服务缺少 API Key。请先保存模型设置。");
  validateOcrInput(input);
  if (input.file) {
    try {
      return await requestOfficialFileParser(input, provider);
    } catch (error) {
      if (getFileKind(input.file) !== "pdf") throw error;
      console.warn("Official PDF parser failed; falling back to rendered page OCR.", error);
      return requestRenderedPdfOcr(input, provider);
    }
  }
  return requestGlmLayoutParsing(input, provider);
}

async function requestRenderedPdfOcr(input, provider) {
  const maxPages = Math.min(Number(input.pageEnd || 0) || 5, 5);
  const startPage = Math.max(1, Number(input.pageStart || input.pageNumber || 1));
  const pages = await renderPdfFileToImages(input.file, maxPages, inferOcrPageType(input) === "answer_key" ? "answer key" : "question paper", startPage);
  if (!pages.length) throw new Error("PDF 降级图片 OCR 失败：无法渲染页面。");
  const results = [];
  for (const page of pages) {
    const ocrInput = {
      ...page,
      materialRole: input.materialRole,
      sourceName: input.sourceName || input.name,
      size: 0,
      file: null,
    };
    const parsed = await requestGlmLayoutParsing(ocrInput, provider);
    results.push({
      page,
      parsed,
    });
  }
  const fullText = results.map(({ page, parsed }) => `--- ${page.label || page.name} ---\n${parsed.fullText}`).join("\n");
  if (!fullText.trim()) throw new Error("PDF 降级图片 OCR 没有返回可用文本。");
  return {
    fullText,
    layoutDetails: results.flatMap(({ parsed }) => parsed.layoutDetails || []),
    fallback: "rendered-pdf-ocr",
  };
}

async function requestOfficialFileParser(input, provider) {
  const form = new FormData();
  form.append("file", input.file, input.name || input.file.name || "material");
  form.append("tool_type", "prime-sync");
  form.append("file_type", getOfficialParserFileType(input));
  const response = await fetchWithTimeout(getGlmApiUrl(provider, "files/parser/sync"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: form,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`文件解析 API ${response.status}: ${errorText.slice(0, 300)}`);
  }
  const data = await response.json();
  const fullText = String(data.content || "").trim();
  if (!fullText) {
    const message = data?.message ? `；接口消息：${data.message}` : "";
    throw new Error(`文件解析没有返回可用文本${message}`);
  }
  return {
    fullText,
    layoutDetails: [],
    taskId: data.task_id || "",
    parsingResultUrl: data.parsing_result_url || "",
  };
}

async function requestGlmLayoutParsing(input, provider) {
  const model = provider.model || "glm-ocr";
  const filePayload = normalizeOcrFilePayload(input);
  const body = {
    model,
    file: filePayload,
    return_crop_images: false,
    need_layout_visualization: false,
  };
  if (input.pageStart && input.pageEnd) {
    body.start_page_id = Number(input.pageStart);
    body.end_page_id = Number(input.pageEnd);
  }
  const response = await fetchWithTimeout(getGlmApiUrl(provider, "layout_parsing"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OCR API ${response.status}: ${errorText.slice(0, 300)}`);
  }
  const data = await response.json();
  const fullText = extractGlmOcrText(data);
  if (!fullText) {
    const apiError = data?.error ? `；接口错误：${JSON.stringify(data.error).slice(0, 180)}` : "";
    throw new Error(`OCR 没有返回可用文本${apiError}`);
  }
  return {
    fullText,
    layoutDetails: data.layout_details || [],
  };
}

function getOfficialParserFileType(input) {
  const name = String(input?.name || input?.file?.name || "").toUpperCase();
  const mime = normalizeOcrMime(input?.file?.type || String(input?.dataUrl || "").match(/^data:([^;,]*)/i)?.[1], name);
  if (mime === "application/pdf" || name.endsWith(".PDF")) return "PDF";
  if (mime === "image/png" || name.endsWith(".PNG")) return "PNG";
  if (mime === "image/jpeg" || name.endsWith(".JPG") || name.endsWith(".JPEG")) {
    return name.endsWith(".JPEG") ? "JPEG" : "JPG";
  }
  const ext = name.match(/\.([A-Z0-9]+)$/)?.[1];
  return ext || "PDF";
}

function getGlmApiUrl(provider, endpoint) {
  const base = String(provider.baseUrl || GLM_CHAT_COMPLETIONS_URL);
  const root = getGlmApiRoot(base);
  return `${root}/paas/v4/${endpoint.replace(/^\//, "")}`;
}

function getGlmApiRoot(baseUrl) {
  const fallback = "https://open.bigmodel.cn/api";
  const raw = String(baseUrl || "").trim();
  if (!raw) return fallback;
  try {
    const url = new URL(raw);
    const pathname = url.pathname.replace(/\/+$/, "");
    let rootPath = pathname;
    const lowerPath = rootPath.toLowerCase();
    const apiIndex = lowerPath.indexOf("/api");
    if (apiIndex >= 0) {
      rootPath = rootPath.slice(0, apiIndex + 4);
    } else {
      const paasIndex = lowerPath.indexOf("/paas/v4");
      if (paasIndex >= 0) {
        rootPath = rootPath.slice(0, paasIndex) || "/";
      } else if (lowerPath.endsWith("/v4")) {
        rootPath = rootPath.slice(0, -3) || "/";
      } else {
        rootPath = rootPath.replace(/\/chat\/completions$/i, "") || "/";
      }
    }
    if (rootPath.toLowerCase().endsWith("/v4")) rootPath = rootPath.slice(0, -3) || "/";
    if (/open\.bigmodel\.cn$/i.test(url.hostname) && !rootPath.toLowerCase().includes("/api")) {
      rootPath = "/api";
    }
    url.pathname = rootPath;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    return fallback;
  }
}

function extractGlmOcrText(data) {
  if (typeof data?.md_results === "string" && data.md_results.trim()) return data.md_results.trim();
  const details = Array.isArray(data?.layout_details) ? data.layout_details.flat(Infinity) : [];
  return details
    .map((item) => item && typeof item === "object" ? item.content : "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function inferOcrPageType(image) {
  const role = String(image?.materialRole || "").toLowerCase();
  if (role === "answer") return "answer_key";
  if (role === "question") return "question";
  return "other";
}

function extractQuestionRangesFromText(text) {
  const ranges = [];
  const pattern = /questions?\s+\d+\s*[-–]\s*\d+/gi;
  let match;
  while ((match = pattern.exec(String(text || ""))) !== null) {
    ranges.push(match[0].replace(/\s+/g, " ").trim());
  }
  return Array.from(new Set(ranges));
}

async function transcribeSpeakingResult(result, box) {
  if (result.testType !== "speaking") return result;
  const provider = getAiProvider("speech");
  if (!provider.model || !provider.apiKey) return result;
  const parts = [];
  for (const part of result.parts || []) {
    if (String(part.transcript || "").trim()) {
      parts.push(part);
      continue;
    }
    const recordingKey = part.recording?.key;
    const recording = recordingKey !== undefined ? state.speakingRecordings?.[recordingKey] : null;
    if (!recording?.blob) {
      parts.push(part);
      continue;
    }
    if (box) box.textContent = `正在转写 ${part.title || `Part ${part.id}`} 的录音...`;
    const transcript = await transcribeSpeakingBlob(recording.blob, part.title || `Part ${part.id}`);
    parts.push({ ...part, transcript });
  }
  return { ...result, parts };
}

async function scoreSpeakingFluency(result, box) {
  if (result.testType !== "speaking") return null;
  const provider = getAiProvider("fluency");
  const providerKey = getAiProviderKey("fluency");
  if (!provider.apiKey) return null;
  if (providerKey !== "xfyun" && !provider.baseUrl) return null;
  const assessments = [];
  for (const part of result.parts || []) {
    const recordingKey = part.recording?.key;
    const recording = recordingKey !== undefined ? state.speakingRecordings?.[recordingKey] : null;
    if (!recording?.blob) continue;
    if (box) box.textContent = `正在进行 ${part.title || `Part ${part.id}`} 的流利度 / 发音评分...`;
    assessments.push({
      partId: part.id,
      title: part.title,
      result: await requestFluencyAssessment(recording.blob, part),
    });
  }
  return assessments.length ? assessments : null;
}

async function requestFluencyAssessment(blob, part) {
  const provider = getAiProvider("fluency");
  if (getAiProviderKey("fluency") === "xfyun") {
    return requestXfyunIseAssessment(blob, part, provider);
  }
  const form = new FormData();
  form.append("model", provider.model || "ise");
  form.append("partId", part.id || "");
  form.append("partTitle", part.title || "");
  form.append("prompt", [
    part.cueCard || "",
    ...(part.questions || []),
    ...(part.prompts || []),
  ].filter(Boolean).join("\n"));
  form.append("file", blob, `speaking-part-${part.id || "recording"}.webm`);
  const response = await fetchWithTimeout(provider.baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: form,
  }, { timeoutMs: AI_REQUEST_TIMEOUT_MS });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`流利度评分 API ${response.status}: ${errorText.slice(0, 300)}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.trim() };
  }
}

async function requestXfyunIseAssessment(blob, part, provider) {
  const credentials = parseXfyunCredentials(provider.apiKey);
  const endpoint = provider.baseUrl || XFYUN_ISE_WS_URL;
  const category = normalizeXfyunIseCategory(provider.model);
  const text = buildXfyunIseText(part);
  const pcm = await audioBlobToPcm16Bytes(blob);
  const url = await buildXfyunWsAuthUrl(endpoint, credentials);
  const xml = await sendXfyunIseAudio(url, {
    appId: credentials.appId,
    category,
    text,
    pcm,
  });
  return parseXfyunIseResult(xml, category);
}

function parseXfyunCredentials(raw) {
  const value = String(raw || "").trim();
  if (!value) throw new Error("科大讯飞语音评测缺少 APPID / APIKey / APISecret。");
  let parsed = null;
  if (value.startsWith("{")) {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = null;
    }
  }
  if (!parsed) {
    const labeled = {
      appId: value.match(/(?:appid|app_id)\s*[:=：]\s*([^\s,;|]+)/i)?.[1],
      apiKey: value.match(/(?:apikey|api_key)\s*[:=：]\s*([^\s,;|]+)/i)?.[1],
      apiSecret: value.match(/(?:apisecret|api_secret)\s*[:=：]\s*([^\s,;|]+)/i)?.[1],
    };
    if (labeled.appId || labeled.apiKey || labeled.apiSecret) parsed = labeled;
  }
  if (!parsed) {
    const parts = value.split(/[|,\n\t]+/).map((part) => part.trim()).filter(Boolean);
    parsed = {
      appId: parts[0],
      apiKey: parts[1],
      apiSecret: parts[2],
    };
  }
  const appId = parsed.appId || parsed.appid || parsed.APPID || parsed.app_id;
  const apiKey = parsed.apiKey || parsed.apikey || parsed.APIKey || parsed.APIKEY || parsed.api_key;
  const apiSecret = parsed.apiSecret || parsed.apisecret || parsed.APISecret || parsed.APISECRET || parsed.api_secret;
  if (!appId || !apiKey || !apiSecret) {
    throw new Error("科大讯飞语音评测需要三项：APPID、APIKey、APISecret。请在流利度 / 发音评分的 API Key 栏填写 APPID|APIKey|APISecret，或 JSON。");
  }
  return { appId, apiKey, apiSecret };
}

function normalizeXfyunIseCategory(model) {
  const value = String(model || "").trim();
  return /^(read_sentence|read_chapter|topic)$/i.test(value) ? value : "read_chapter";
}

function buildXfyunIseText(part) {
  const text = [
    part?.transcript,
    part?.answer,
    part?.cueCard,
    ...(part?.questions || []),
    ...(part?.prompts || []),
  ].map((item) => String(item || "").trim()).find(Boolean);
  if (!text) throw new Error("科大讯飞语音评测需要一段参考文本；当前 Part 没有转写文本或题目文本。");
  return `\uFEFF[content]\n${text.slice(0, 6000)}`;
}

async function audioBlobToPcm16Bytes(blob) {
  const audioContext = new AudioContext();
  try {
    const buffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
    const sampleRate = 16000;
    const pcm = mixAudioBufferToMono(buffer, sampleRate);
    const bytes = new Uint8Array(pcm.length * 2);
    const view = new DataView(bytes.buffer);
    pcm.forEach((sample, index) => {
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(index * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    });
    return bytes;
  } finally {
    audioContext.close?.();
  }
}

async function buildXfyunWsAuthUrl(endpoint, credentials) {
  if (!crypto?.subtle) throw new Error("当前浏览器不支持 WebCrypto，无法生成科大讯飞 WebSocket 签名。");
  const url = new URL(endpoint || XFYUN_ISE_WS_URL);
  const host = url.host;
  const date = new Date().toUTCString();
  const requestLine = `GET ${url.pathname} HTTP/1.1`;
  const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;
  const signature = await hmacSha256Base64(credentials.apiSecret, signatureOrigin);
  const authorizationOrigin = `api_key="${credentials.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  url.searchParams.set("authorization", btoa(authorizationOrigin));
  url.searchParams.set("date", date);
  url.searchParams.set("host", host);
  return url.toString();
}

async function hmacSha256Base64(secret, text) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  return arrayBufferToBase64(signature);
}

function sendXfyunIseAudio(url, payload) {
  const chunkSize = 1280 * 8;
  const chunks = [];
  for (let offset = 0; offset < payload.pcm.length; offset += chunkSize) {
    chunks.push(payload.pcm.slice(offset, offset + chunkSize));
  }
  if (!chunks.length) throw new Error("录音为空，无法进行科大讯飞语音评测。");
  return new Promise((resolve, reject) => {
    let settled = false;
    let lastXml = "";
    const timeoutId = setTimeout(() => finish(new Error("科大讯飞语音评测超时。")), AI_REQUEST_TIMEOUT_MS);
    const signal = state.aiAbortController?.signal;
    const socket = new WebSocket(url);
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      signal?.removeEventListener?.("abort", handleAbort);
      try {
        socket.close();
      } catch {}
      if (error) reject(error);
      else resolve(value);
    };
    const handleAbort = () => finish(new AiGenerationError("用户已取消生成。", "ABORTED"));
    signal?.addEventListener?.("abort", handleAbort, { once: true });
    socket.onerror = () => finish(new Error("科大讯飞语音评测 WebSocket 连接失败。"));
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.code !== 0) {
          finish(new Error(`科大讯飞语音评测失败：${message.message || message.desc || message.code}`));
          return;
        }
        const encoded = message.data?.data || "";
        if (encoded) lastXml = base64ToUtf8(encoded);
        if (Number(message.data?.status) === 2) {
          if (!lastXml) finish(new Error("科大讯飞语音评测没有返回 XML 结果。"));
          else finish(null, lastXml);
        }
      } catch (error) {
        finish(error);
      }
    };
    socket.onopen = async () => {
      try {
        socket.send(JSON.stringify({
          common: { app_id: payload.appId },
          business: {
            category: payload.category,
            sub: "ise",
            ent: "en_vip",
            cmd: "ssb",
            auf: "audio/L16;rate=16000",
            aue: "raw",
            text: payload.text,
            tte: "utf-8",
            ttp_skip: true,
          },
          data: { status: 0, data: "" },
        }));
        await delay(40);
        for (let index = 0; index < chunks.length; index += 1) {
          if (settled) return;
          throwIfAiAborted();
          const last = index === chunks.length - 1;
          socket.send(JSON.stringify({
            business: {
              cmd: "auw",
              aus: last ? 4 : 2,
            },
            data: {
              status: last ? 2 : 1,
              data: bytesToBase64(chunks[index]),
            },
          }));
          await delay(40);
        }
      } catch (error) {
        finish(error);
      }
    };
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseXfyunIseResult(xml, category) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return {
      provider: "xfyun-ise",
      category,
      note: "讯飞返回 XML 解析失败，本次不提供声学参考。",
    };
  }
  const node = Array.from(doc.querySelectorAll("*")).find((item) => {
    return ["fluency_score", "standard_score", "phone_score"].some((name) => item.hasAttribute(name));
  });
  const attrs = node ? Object.fromEntries(Array.from(node.attributes).map((attr) => [attr.name, attr.value])) : {};
  const fluencyScore = parseNullableScore(attrs.fluency_score);
  const pronunciationScore = parseNullableScore(attrs.standard_score ?? attrs.phone_score);
  return {
    provider: "xfyun-ise",
    category,
    note: "仅参考流利度和发音声学分；最终口语分数由文本模型按 IELTS Speaking 四项标准综合判断。",
    fluencyScore,
    pronunciationScore,
  };
}

function parseNullableScore(value) {
  if (value === undefined || value === null || value === "") return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function arrayBufferToBase64(buffer) {
  return bytesToBase64(new Uint8Array(buffer));
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function base64ToUtf8(value) {
  const binary = atob(String(value || ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

async function transcribeSpeakingBlob(blob, label) {
  const wavChunks = await splitAudioBlobToWavChunks(blob, 30);
  const texts = [];
  for (let index = 0; index < wavChunks.length; index += 1) {
    throwIfAiAborted();
    texts.push(await requestGlmSpeechTranscription(wavChunks[index], `${label || "speaking"}-${index + 1}.wav`));
  }
  return texts.join(" ").replace(/\s+/g, " ").trim();
}

async function requestGlmSpeechTranscription(blob, fileName) {
  const provider = getAiProvider("speech");
  if (!provider.apiKey) throw new Error("模型服务缺少 API Key。请先保存模型设置。");
  const form = new FormData();
  form.append("model", provider.model || "glm-asr-2512");
  form.append("stream", "false");
  form.append("file", blob, fileName || "speaking.wav");
  const response = await fetchWithTimeout(getGlmApiUrl(provider, "audio/transcriptions"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: form,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`语音转写 API ${response.status}: ${errorText.slice(0, 300)}`);
  }
  const data = await response.json();
  const text = String(data.text || "").trim();
  if (!text) throw new Error("语音模型没有返回转写文本。");
  return text;
}

async function splitAudioBlobToWavChunks(blob, maxSeconds = 30) {
  const audioContext = new AudioContext();
  try {
    const buffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
    const sampleRate = 16000;
    const pcm = mixAudioBufferToMono(buffer, sampleRate);
    const samplesPerChunk = Math.max(1, sampleRate * maxSeconds);
    const chunks = [];
    for (let start = 0; start < pcm.length; start += samplesPerChunk) {
      chunks.push(encodePcmToWav(pcm.subarray(start, Math.min(pcm.length, start + samplesPerChunk)), sampleRate));
    }
    return chunks;
  } finally {
    audioContext.close?.();
  }
}

function mixAudioBufferToMono(buffer, targetSampleRate) {
  const length = Math.ceil(buffer.duration * targetSampleRate);
  const output = new Float32Array(length);
  const channelData = Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index));
  for (let i = 0; i < length; i += 1) {
    const sourceIndex = Math.min(buffer.length - 1, Math.floor(i * buffer.sampleRate / targetSampleRate));
    const sum = channelData.reduce((total, channel) => total + (channel[sourceIndex] || 0), 0);
    output[i] = sum / Math.max(1, channelData.length);
  }
  return output;
}

function encodePcmToWav(samples, sampleRate) {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);
  let offset = 44;
  samples.forEach((sample) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  });
  return new Blob([buffer], { type: "audio/wav" });
}

function writeAscii(view, offset, text) {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

function normalizeOcrPage(page) {
  if (!page || typeof page !== "object") return page;
  page.questionRanges = normalizeQuestionRanges(page.questionRanges);
  if (Array.isArray(page.answers)) {
    page.answers = page.answers.map(normalizeOcrAnswer).filter((answer) => answer.id && answer.answer.length);
  }
  return page;
}

function normalizeQuestionRanges(ranges) {
  return ensureArray(ranges).map((range) => {
    if (typeof range === "string") return range;
    if (range && typeof range === "object") {
      const start = range.start ?? range.from ?? range.first;
      const end = range.end ?? range.to ?? range.last;
      if (start && end) return `Questions ${start}-${end}`;
    }
    return String(range || "").trim();
  }).filter(Boolean);
}

function normalizeOcrAnswer(answer) {
  const rawId = String(answer?.id || "").trim();
  const id = rawId.replace(/^\s*questions?\s*/i, "").replace(/\s*(?:&|and)\s*/i, "-");
  const values = ensureArray(answer?.answer)
    .flatMap((value) => splitAnswerAlternatives(value))
    .map((value) => String(value).trim())
    .filter(Boolean);
  return {
    ...answer,
    id,
    answer: Array.from(new Set(values)),
    note: String(answer?.note || ""),
  };
}

function splitAnswerAlternatives(value) {
  const text = String(value ?? "").trim();
  if (!text) return [];
  if (/^[A-J](?:\s*[,/&]\s*[A-J])?$/i.test(text)) return [text];
  if (/\s+\/\s+/.test(text)) return text.split(/\s+\/\s+/);
  return [text];
}

async function mergeExtractedTextToExam(material, extractedPages, onStatus = () => {}) {
  const messages = [
    {
      role: "system",
      content: buildGlmSystemPrompt(),
    },
    {
      role: "user",
      content: buildTextMergePrompt(material, extractedPages),
    },
  ];
  let lastError = "";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    onStatus(
      attempt === 1 ? "正在用纯文本上下文合并完整 JSON..." : "正在让 AI 根据校验错误修正 JSON...",
      attempt === 1 ? 76 : 82,
    );
    const content = await requestTextCompletionWithFallback(messages, "merge");
    onStatus("AI 已返回内容，正在解析和校验完整性...", 88);
    try {
      const test = extractJsonObject(content);
      normalizeGeneratedTest(test);
      validateGeneratedExamShape(test);
      validateTest(test);
      return test;
    } catch (error) {
      lastError = error.message;
      if (attempt === 2) break;
      messages.push({ role: "assistant", content });
      messages.push({
        role: "user",
        content: `The JSON failed validation with this error: ${error.message}\nReturn a corrected complete JSON object only. Do not explain.`,
      });
    }
  }
  throw new Error(`AI 生成的 JSON 校验失败：${lastError}`);
}

async function requestTextCompletionWithFallback(messages, feature = "merge") {
  const providerKey = getAiProviderKey(feature);
  const provider = getAiProvider(feature);
  const fallbackModels = providerKey === "glm"
    ? Array.from(new Set([provider.model || "glm-5.2", "glm-5.2"].filter(Boolean)))
    : [provider.model].filter(Boolean);
  let lastError = null;
  for (const model of fallbackModels) {
    try {
      return await requestAiCompletion(feature, messages, { model, maxTokens: 16384 });
    } catch (error) {
      lastError = error;
      if (!/model|模型|not found|不存在|unsupported|不支持|API 400/i.test(String(error.message || ""))) {
        throw error;
      }
    }
  }
  throw lastError;
}

function formatGenerationError(error, stage = "未知阶段", elapsedMs = 0) {
  const raw = String(error?.message || error || "");
  const timing = `\n\n失败阶段：${stage}\n耗时：${formatElapsed(elapsedMs)}`;
  if (error?.code === "ABORTED" || /AbortError|用户已取消/.test(raw)) {
    return `已取消生成。${timing}`;
  }
  if (error?.code === "TIMEOUT" || /超时/.test(raw)) {
    return `生成超时：${raw}${timing}\n\n建议：减少单次上传页数，或换一个响应更快的 OCR/文本模型后重试。`;
  }
  if (/没有返回内容|API|Failed to fetch|NetworkError|Load failed/i.test(raw)) {
    return `生成失败：AI 接口没有成功返回可用内容。${timing}\n\n原因：${raw}\n\n这通常是 API、网络、额度、浏览器跨域拦截或模型返回空内容的问题，不是题目校验。`;
  }
  if (/页面转写|OCR|transcribe/i.test(stage)) {
    return `生成失败：逐页 OCR / 页面转写阶段失败。${timing}\n\n原因：${raw}\n\n这通常和单页图片文字识别、PDF 页面质量或接口有关。`;
  }
  if (/校验失败|生成不完整|生成缺少题号|缺少题干|template|总分/.test(raw)) {
    return `生成失败：AI 已经识别并返回了 JSON，但结果不完整，已被系统拦截。${timing}\n\n原因：${raw}\n\n请重新生成，或上传更清晰/更完整的题目 PDF 和答案 PDF。`;
  }
  return `生成失败：${raw}${timing}\n\n请重新生成，或补充更清晰的题目/答案 PDF。`;
}

function formatElapsed(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "未知";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} 秒`;
}

function throwIfAiAborted() {
  const signal = state.aiAbortController?.signal;
  if (!signal?.aborted) return;
  const reason = signal.reason;
  if (reason instanceof Error) throw reason;
  throw new AiGenerationError("用户已取消生成。", "ABORTED");
}

async function fetchWithTimeout(url, init = {}, options = {}) {
  throwIfAiAborted();
  const timeoutMs = Number(options.timeoutMs || AI_REQUEST_TIMEOUT_MS);
  const timeoutController = new AbortController();
  const signals = [timeoutController.signal, state.aiAbortController?.signal, options.signal].filter(Boolean);
  const signal = window.IeltsCore.combineAbortSignals(signals);
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new AiGenerationError(`AI 请求超过 ${Math.round(timeoutMs / 1000)} 秒未返回。`, "TIMEOUT"));
  }, timeoutMs);
  try {
    return await fetch(url, { ...init, signal });
  } catch (error) {
    if (state.aiAbortController?.signal?.aborted) {
      const reason = state.aiAbortController.signal.reason;
      if (reason instanceof Error) throw reason;
      throw new AiGenerationError("用户已取消生成。", "ABORTED");
    }
    if (timeoutController.signal.aborted) {
      const reason = timeoutController.signal.reason;
      if (reason instanceof Error) throw reason;
      throw new AiGenerationError(`AI 请求超过 ${Math.round(timeoutMs / 1000)} 秒未返回。`, "TIMEOUT");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function requestAiCompletion(feature, messages, options = {}) {
  const providerKey = getAiProviderKey(feature);
  const provider = getAiProvider(feature);
  if (!provider.baseUrl) throw new Error(`${providerLabels[providerKey]} 缺少接口地址。请先保存模型设置。`);
  if (!provider.apiKey) throw new Error(`${providerLabels[providerKey]} 缺少 API Key。请先保存模型设置。`);
  const model = options.model || provider.model;
  if (!model) throw new Error(`${providerLabels[providerKey]} 缺少模型名。请先保存模型设置。`);
  const maxTokens = options.maxTokens || 16384;
  const body = {
    model,
    temperature: 0,
    max_tokens: maxTokens,
    messages,
  };
  body.response_format = { type: "json_object" };
  const response = await fetchWithTimeout(getChatCompletionsUrl(provider), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify(body),
  }, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${providerLabels[providerKey]} API ${response.status}: ${errorText.slice(0, 300)}`);
  }
  const data = await response.json();
  const choice = data?.choices?.[0] || {};
  const message = choice.message || {};
  const content = extractMessageContent(message.content);
  if (!content) {
    const finishReason = choice.finish_reason || "unknown";
    const messageKeys = Object.keys(message).join(", ") || "none";
    const apiError = data?.error ? `；接口错误：${JSON.stringify(data.error).slice(0, 180)}` : "";
    const advice = finishReason === "length" ? "；输出被截断，系统会尝试提高输出上限或压缩重复文本。" : "";
    throw new Error(`${providerLabels[providerKey]} 没有返回内容。finish_reason=${finishReason}，message 字段=${messageKeys}${apiError}${advice}`);
  }
  return content;
}

function getAiProviderKey(feature) {
  return getFeatureSettings(feature).providerKey || "glm";
}

function getAiProvider(feature) {
  return getFeatureSettings(feature);
}

function getFeatureSettings(feature) {
  const fallback = defaultAiSettings.features[feature] || defaultAiSettings.features.merge;
  return normalizeFeatureSettings(state.aiSettings.features?.[feature] || {}, fallback);
}

function getChatCompletionsUrl(provider) {
  if ((provider.providerKey || "glm") === "glm") {
    return getGlmApiUrl(provider, "chat/completions");
  }
  return String(provider.baseUrl || "").trim();
}

function buildTextMergePrompt(material, extractedPages) {
  const target = material.target || { mode: "single", subject: "listening", allowedTestTypes: ["listening"] };
  const targetHint = target.mode === "full"
    ? "Target mode: full mock. The uploaded material may contain Listening, Reading, Writing, and/or Speaking. If it only contains one subject, generate that subject only. Do not invent missing subjects."
    : `Target mode: single-subject practice. Generate this testType unless the material clearly belongs to a different IELTS skill: ${target.subject}.`;
  const completenessHint = ["listening", "reading"].includes(target.subject) || target.mode === "full"
    ? "- If the uploaded Listening or Reading material is a complete test, preserve all visible question numbers and groups. If the material is partial, generate only the questions actually present.\n- Do not omit any printed question stem, shared block, table line, option bank, heading list, or instruction."
    : "- Writing and Speaking do not use numbered answer keys like Listening/Reading. Preserve every visible prompt, cue card, bullet, and question.";
  return `
Convert the following OCR/transcription JSON into one complete IELTS Mock Lab exam JSON.

${targetHint}
Allowed testType values for this import: ${target.allowedTestTypes.join(", ")}

Files:
${JSON.stringify(material.fileSummaries, null, 2)}

Material roles:
- role=question: exam question paper or prompt material.
- role=answer: answer key material. Use it only for correct answers.
- role=audio: listening audio files. Match them to Listening Parts by filename.
- role=extra: supporting images, charts, maps, or supplementary pages.

Uploaded free text from user:
Question text:
${material.questionText || "(not provided)"}

Answer text:
${material.answerText || "(not provided)"}

Readable uploaded text snippets:
${material.textSnippets || "(none)"}

Page transcriptions:
${JSON.stringify(extractedPages, null, 2)}

Important:
- Use the page transcriptions as the source of truth for question wording and layout.
- Use answer_key pages and answer text for answers.
- Produce the final app schema from the system instructions.
${completenessHint}
- For completion groups, build group.template from the OCR visibleText and replace blanks with {{id}} placeholders.
- If a blank/completion group has a group.template, that template MUST include every question id in the group as a {{id}} placeholder. Never put question ids only in questions[] while omitting their placeholders from the template.
- Never output HTML/XML markup in group.template, question.text, instructions, prompt, option labels, or passages. Convert tables into plain text lines with labels and {{id}} placeholders; do not include tags like <table>, <tr>, <td>, <p>, <br>, or escaped variants.
- For choose TWO / THREE groups, create one multi_choice question with id range, maxChoices, and points.
- For matching/comment-box groups, use blank letter-entry questions with optionBank.
- Do not create imageCrop for Listening or Writing. Images for those subjects are added only when the user manually enters a source PDF page number in the import UI.
- Never invent image filenames. Use exact uploaded image filenames only when a separate image file was uploaded.
- Use exact audio filenames from uploaded files.`;
}

function extractMessageContent(content) {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part.text === "string") return part.text;
      if (part && typeof part.content === "string") return part.content;
      return "";
    })
    .join("")
    .trim();
}

function buildGlmSystemPrompt() {
  return `You are a deterministic IELTS exam-to-JSON converter.

You MUST return only one valid JSON object. No markdown. No code fences. No explanations. No comments.

The JSON must be directly parseable by JSON.parse and must strictly follow one of these schemas.

Listening or Reading schema:
{
  "testType": "listening" | "reading",
  "title": string,
  "durationMinutes": number,
  "sections": [
    {
      "title": string,
      "audio": optional string,
      "passage": optional string,
      "groups": [
        {
          "title": string,
          "instructions": string,
          "questionType": "blank" | "single_choice" | "multi_choice",
          "template": optional string,
          "image": optional string,
          "optionBank": optional array of {"value": string, "label": string},
          "maxChoices": optional number,
          "questions": [
            {
              "id": number or string,
              "points": optional number,
              "text": string,
              "options": optional array of {"value": string, "label": string},
              "answer": array of strings
            }
          ]
        }
      ]
    }
  ]
}

Writing schema:
{
  "testType": "writing",
  "title": string,
  "durationMinutes": 60,
  "sections": [
    {
      "title": "Writing Task 1" | "Writing Task 2" | string,
      "instructions": string,
      "prompt": string,
      "image": optional string,
      "minWords": number
    }
  ]
}

Speaking schema:
{
  "testType": "speaking",
  "title": string,
  "durationMinutes": 14,
  "sections": [
    {
      "title": "Part 1" | "Part 2" | "Part 3" | string,
      "prepSeconds": number,
      "answerSeconds": number,
      "questions": optional array of strings,
      "cueCard": optional string,
      "prompts": optional array of strings
    }
  ]
}

Hard rules:
1. Never invent missing questions, passages, or answers.
2. If the material is insufficient, return {"error":"INSUFFICIENT_MATERIAL","message":"..."}.
3. answer must always be an array, even for one answer.
4. Every question must have a unique id.
5. Every question must have a non-empty answer array.
5a. Cover every question number that is actually visible or supplied in the uploaded material. Do not invent missing question numbers just to make a full test.
5b. Every question.text must contain the full visible question stem for that exact question, unless a blank/completion group uses group.template for the shared task block. Never output only answer options.
6. For blank questions, do not include options.
6a. For note/form/table/flow-chart/summary/sentence completion groups, preserve the complete visible prompt block in group.template. Include titles, subtitles, labels, bullet points, and sentences that do not contain answers. Put answer boxes exactly where blanks appear using placeholders like {{1}}, {{2}}, {{21}}.
7. For single_choice and multi_choice questions, include options when they are visible or can be directly inferred from a standard printed option set such as TRUE/FALSE/NOT GIVEN or YES/NO/NOT GIVEN.
8. In Reading tests, matching questions and word-bank gap-fill questions whose answers are letters must be simplified into blank questions. The student will type the answer letter. Do not create radio buttons for these groups.
9. TRUE/FALSE/NOT GIVEN and YES/NO/NOT GIVEN questions must be single_choice.
10. Choose TWO / Choose THREE questions must be one multi_choice question, not split into separate questions. Use id like "21-22", maxChoices: 2, points: 2.
11. Listening should normally have sections titled Part 1, Part 2, Part 3, Part 4 when enough material exists.
12. Reading should normally have sections titled Reading Passage 1, Reading Passage 2, Reading Passage 3 when enough material exists.
13. Listening durationMinutes should be 30. Reading durationMinutes should be 60.
14. Audio filenames must be copied exactly from the uploaded file list.
15. Map/image filenames must be copied exactly from the uploaded file list when a separate image file was uploaded.
16. Do not put audio or image data in JSON. Use filenames only when a separate audio or image file was uploaded. Do not create imageCrop.
17. Map-label Listening questions using letters must include all printed letter options. Do not add imageCrop for Listening; if a picture is needed the user will add a PDF page screenshot manually.
18. Reading opinion/paragraph/heading/statement matching questions should be blank letter-entry groups, with the original option list kept only if text labels are visible in the material.
19. For Writing, include only real Task 1/Task 2 prompts visible in the material. Task 1 minWords is normally 150; Task 2 minWords is normally 250. Do not add imageCrop for Writing; if Task 1 needs a visual, the user will add a PDF page screenshot manually.
20. For Speaking, preserve Part 1 questions, Part 2 cue card and bullet prompts, and Part 3 questions. Use prepSeconds 60 and answerSeconds 120 for Part 2; use prepSeconds 0 and answerSeconds 300 for Part 1/3 unless the material says otherwise.
21. Output complete JSON only.`;
}

function validateGeneratedExamShape(test) {
  if (test.error) throw new Error(`${test.error}: ${test.message || "材料不足"}`);
  if (test.testType === "listening" && Number(test.durationMinutes) !== 30) {
    throw new Error("听力 durationMinutes 必须是 30。");
  }
  if (test.testType === "reading" && Number(test.durationMinutes) !== 60) {
    throw new Error("阅读 durationMinutes 必须是 60。");
  }
  if (["listening", "reading"].includes(test.testType)) {
    const total = countPoints(test);
    if (total <= 0) throw new Error("客观题总分必须大于 0。");
    if (total > 40) throw new Error(`${getExamTypeLabel(test.testType)} 题目分值异常：当前 ${total} 分，超过常规 IELTS 40 分。`);
  }
  assertGeneratedQuestionText(test);
}

function assertGeneratedQuestionText(test) {
  (test.sections || []).forEach((section) => {
    (section.groups || []).forEach((group) => {
      const hasTemplate = typeof group.template === "string" && group.template.trim();
      (group.questions || []).forEach((question) => {
        const text = String(question.text || "").trim();
        if (group.questionType !== "blank" && !text) {
          throw new Error(`第 ${question.id} 题缺少题干。选择题必须把 question stem 放在 question.text，不能只给选项。`);
        }
        if (group.questionType === "blank" && !hasTemplate && !text) {
          throw new Error(`第 ${question.id} 题缺少题干。填空题必须有 question.text 或 group.template。`);
        }
      });
    });
  });
}

function normalizeGeneratedTest(test) {
  if (!test || !Array.isArray(test.sections)) return;
  normalizeLetterEntryGroups(test);
  normalizeGeneratedTemplates(test);
  normalizeGeneratedImageRefs(test);
  normalizeBlankGroupTemplates(test);
  test.sections.forEach((section) => {
    (section.groups || []).forEach((group) => {
      (group.questions || []).forEach((question) => {
        if (group.questionType !== "blank" && !Array.isArray(question.options)) {
          const letters = inferChoiceLetters(group, question);
          if (letters.length) {
            question.options = letters.map((letter) => ({ value: letter, label: letter }));
          }
        }
      });
    });
  });
}

function normalizeGeneratedImageRefs(test) {
  (test.sections || []).forEach((section) => {
    removeNonImageRefs(section);
    (section.groups || []).forEach((group) => removeNonImageRefs(group));
  });
}

function removeNonImageRefs(target) {
  if (!target || typeof target !== "object") return;
  ["image", "imageAsset", "imageName"].forEach((field) => {
    const ref = String(target[field] || "").trim();
    if (ref && isPdfAssetRef(ref)) delete target[field];
  });
}

function normalizeBlankGroupTemplates(test) {
  (test.sections || []).forEach((section) => {
    (section.groups || []).forEach((group) => {
      if (group.questionType !== "blank") return;
      if (!Array.isArray(group.questions) || !group.questions.length) return;
      const template = String(group.template || "").trim();
      if (!template) return;
      const placeholders = extractTemplatePlaceholderIds(template);
      const missingQuestions = group.questions.filter((question) => !placeholders.has(String(question.id)));
      if (!missingQuestions.length) return;
      const repairedLines = missingQuestions.map((question) => buildMissingTemplatePlaceholderLine(question));
      group.template = [template, ...repairedLines].filter(Boolean).join("\n");
    });
  });
}

function buildMissingTemplatePlaceholderLine(question) {
  const id = String(question?.id ?? "").trim();
  const rawText = cleanGeneratedTemplate(question?.text || "");
  const textWithoutLeadingId = rawText
    .replace(new RegExp(`^\\s*${escapeRegExp(id)}\\s*[.)、:-]?\\s*`), "")
    .trim();
  const label = textWithoutLeadingId || "Answer";
  return `${id}. ${label} {{${id}}}`;
}

function normalizeGeneratedTemplates(test) {
  (test.sections || []).forEach((section) => {
    ["title", "instructions", "passage", "prompt"].forEach((field) => {
      if (typeof section[field] === "string") section[field] = cleanGeneratedTemplate(section[field]);
    });
    (section.groups || []).forEach((group) => {
      ["title", "instructions", "template"].forEach((field) => {
        if (typeof group[field] === "string") group[field] = cleanGeneratedTemplate(group[field]);
      });
      if (Array.isArray(group.optionBank)) {
        group.optionBank = group.optionBank.map((option) => cleanOptionTextFields(option));
      }
      (group.questions || []).forEach((question) => {
        if (typeof question.text === "string") question.text = cleanGeneratedTemplate(question.text);
        if (Array.isArray(question.options)) {
          question.options = question.options.map((option) => cleanOptionTextFields(option));
        }
      });
    });
  });
}

function cleanOptionTextFields(option) {
  if (typeof option === "string") return cleanGeneratedTemplate(option);
  if (!option || typeof option !== "object") return option;
  return {
    ...option,
    value: typeof option.value === "string" ? cleanGeneratedTemplate(option.value) : option.value,
    label: typeof option.label === "string" ? cleanGeneratedTemplate(option.label) : option.label,
  };
}

function cleanGeneratedTemplate(value) {
  const text = String(value || "");
  if (!looksLikeHtmlMarkup(text)) return text;
  return decodeHtmlEntities(text)
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/\s*(p|div|tr|table|ul|ol)\s*>/gi, "\n")
    .replace(/<\s*\/\s*(td|th|li)\s*>/gi, " ")
    .replace(/<\s*(p|div|table|tbody|thead|tr|td|th|ul|ol|li|span|strong|em|b|i)\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function looksLikeHtmlMarkup(text) {
  return /<\s*\/?\s*(table|tr|td|th|p|div|br|ul|ol|li)\b/i.test(String(text || ""));
}

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(text || "");
  return textarea.value;
}

function normalizeLetterEntryGroups(test) {
  if (!test || test.testType !== "reading" || !Array.isArray(test.sections)) return;
  test.sections.forEach((section) => {
    (section.groups || []).forEach((group) => {
      if (!shouldUseLetterEntry(group)) return;
      group.optionBank = collectOptionBank(group);
      group.questionType = "blank";
      group.answerMode = "letter";
      (group.questions || []).forEach((question) => {
        delete question.options;
      });
    });
  });
}

function shouldUseLetterEntry(group) {
  if (!group || !["single_choice", "multi_choice"].includes(group.questionType)) return false;
  const source = `${group.title || ""} ${group.instructions || ""}`.toLowerCase();
  if (/true|false|not given|yes|no/.test(source)) return false;
  if (/choose\s+the\s+correct\s+letter\s*,?\s*a\s*,?\s*b\s*,?\s*c/i.test(source) && !/match|matching|paragraph|heading|box|list|people|statement|information|ending|opinion|researcher/.test(source)) {
    return false;
  }
  if (/match|matching|which paragraph|paragraph contains|list of|from the box|using the box|box below|headings|sentence endings|statements|information|people|opinions|researchers|classification|classified|选词|匹配/.test(source)) {
    return hasLetterAnswers(group);
  }
  const bank = collectOptionBank(group);
  return bank.length >= 5 && hasLetterAnswers(group);
}

function hasLetterAnswers(group) {
  return (group.questions || []).some((question) => {
    return (question.answer || []).some((answer) => /^[A-J]$/i.test(String(answer).trim()));
  });
}

function collectOptionBank(group) {
  const seen = new Set();
  const bank = [];
  (group.optionBank || []).forEach((option) => {
    const value = String(typeof option === "string" ? option : option.value || "").trim();
    if (!/^[A-J]$/i.test(value) || seen.has(value.toUpperCase())) return;
    seen.add(value.toUpperCase());
    bank.push({
      value: value.toUpperCase(),
      label: cleanOptionLabel(value, typeof option === "string" ? option : option.label),
    });
  });
  (group.questions || []).forEach((question) => {
    (question.options || []).forEach((option) => {
      const value = String(typeof option === "string" ? option : option.value || "").trim();
      if (!/^[A-J]$/i.test(value) || seen.has(value.toUpperCase())) return;
      seen.add(value.toUpperCase());
      bank.push({
        value: value.toUpperCase(),
        label: cleanOptionLabel(value, typeof option === "string" ? option : option.label),
      });
    });
  });
  return bank.sort((a, b) => a.value.localeCompare(b.value));
}

function cleanOptionLabel(value, label) {
  const optionValue = String(value || "").trim().toUpperCase();
  const text = String(label || optionValue).trim();
  return text.replace(new RegExp(`^${optionValue}\\s*[.)-]?\\s*`, "i"), "").trim() || optionValue;
}

function inferChoiceLetters(group, question) {
  const source = `${group.instructions || ""} ${group.title || ""} ${question.text || ""}`.toUpperCase();
  const rangeMatch = source.match(/\bA\s*[-–]\s*([JIHGFEDCB])\b/);
  if (rangeMatch) return makeLetterRange(rangeMatch[1]);
  const answerLetters = (question.answer || [])
    .map((answer) => String(answer).trim().toUpperCase())
    .filter((answer) => /^[A-J]$/.test(answer));
  if (answerLetters.length) {
    const max = answerLetters.sort().at(-1);
    if (max >= "F") return makeLetterRange("H");
    if (max >= "D") return makeLetterRange("E");
    return makeLetterRange("C");
  }
  if (/TRUE|FALSE|NOT GIVEN/.test(source)) return ["TRUE", "FALSE", "NOT GIVEN"];
  if (/YES|NO|NOT GIVEN/.test(source)) return ["YES", "NO", "NOT GIVEN"];
  return [];
}

function makeLetterRange(endLetter) {
  const end = endLetter.charCodeAt(0);
  const letters = [];
  for (let code = 65; code <= end; code += 1) letters.push(String.fromCharCode(code));
  return letters;
}

function extractJsonObject(content) {
  const trimmed = content.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  try {
    return window.IeltsCore.parseSafeJson(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error("AI 返回内容中没有可解析的 JSON。");
    return window.IeltsCore.parseSafeJson(trimmed.slice(start, end + 1));
  }
}

function makeJsonFileName(title) {
  return `${String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ielts-generated-test"}.json`;
}

function downloadJson(test, filename) {
  const blob = new Blob([JSON.stringify(test, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadGeneratedAssets(assets) {
  const seen = new Set();
  (assets || new Map()).forEach((asset, name) => {
    if (!asset?.generated || !asset.dataUrl || seen.has(asset.dataUrl)) return;
    seen.add(asset.dataUrl);
    downloadDataUrl(asset.dataUrl, name);
  });
}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function clearAiImportForm(clearKey) {
  els.aiQuestionFileInput.value = "";
  els.aiAnswerFileInput.value = "";
  els.aiAudioFileInput.value = "";
  els.aiExtraFileInput.value = "";
  els.aiListeningTranscriptFileInput.value = "";
  els.aiQuestionFileName.textContent = "题目 PDF / 图片 / 文本";
  els.aiAnswerFileName.textContent = "答案 PDF / 图片 / 文本";
  els.aiAudioFileName.textContent = "Part 1-4 音频";
  els.aiListeningTranscriptFileName.textContent = "可选：PDF / 文本，用于查看解析";
  els.aiExtraFileName.textContent = "可选：地图、图表、补充图片";
  els.aiQuestionText.value = "";
  els.aiAnswerText.value = "";
  els.aiQuestionPdfPageInput.value = "";
  if (clearKey) {
    resetAiSettings();
  }
}

async function handleJsonInput(event) {
  const file = event.target.files[0];
  if (!file) return;
  els.jsonFileName.textContent = file.name;
  try {
    state.pendingTest = parseImportedTests(window.IeltsCore.parseSafeJson(await file.text()));
    state.pendingTest.forEach(validateTest);
    state.pendingSource = file.name;
    renderPendingTest();
  } catch (error) {
    state.pendingTest = null;
    state.pendingSource = "";
    renderPendingTest();
    alert(`JSON 无法读取：${error.message}`);
  }
}

function parseImportedTests(payload) {
  const tests = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.tests)
      ? payload.tests
      : Array.isArray(payload?.exams)
        ? payload.exams
        : [payload];
  const normalized = tests.filter(Boolean);
  if (!normalized.length) throw new Error("JSON 中没有考试单元。");
  return normalized;
}

async function handleAssetInput(event) {
  state.assets.clear();
  const files = Array.from(event.target.files || []);
  const selectedAssets = new Map();
  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    const asset = { file, url };
    addAssetAliases(state.assets, file.name, asset);
    addAssetAliases(selectedAssets, file.name, asset);
  });
  els.assetFileName.textContent = files.length ? `${files.length} 个资源已选择，将自动匹配 JSON 引用` : "可多选，按文件名自动匹配 JSON 引用";
  if (!state.pendingTest && files.length) {
    const matched = await attachAssetsToLibraryEntries(selectedAssets);
    if (matched > 0) {
      els.assetFileName.textContent = `${files.length} 个资源已选择，已匹配 ${matched} 套考试`;
      renderLibrary();
    }
  }
}

async function attachAssetsToLibraryEntries(assets) {
  let matched = 0;
  const updated = [];
  state.library.forEach((entry) => {
    const refs = collectAssetRefs(entry.test);
    const hasMatch = refs.some((ref) => findAssetForRef(assets, ref));
    if (!hasMatch) return;
    entry.assets = cloneAssetMap(entry.assets || new Map());
    refs.forEach((ref) => {
      const asset = findAssetForRef(assets, ref);
      if (!asset) return;
      addAssetAliases(entry.assets, ref, asset);
    });
    matched += 1;
    updated.push(entry);
  });
  for (const entry of updated) {
    await persistEntryAssets(entry);
  }
  if (matched > 0) saveLibrary();
  return matched;
}

function cloneAssetMap(assets) {
  return new Map(assets || []);
}

function resetAssetPicker(revokeUrls) {
  if (revokeUrls) {
    revokeAssetMap(state.assets);
  }
  state.assets.clear();
  els.assetInput.value = "";
  els.assetFileName.textContent = "可多选，按文件名自动匹配 JSON 引用";
}

function revokeAssetMap(assets) {
  const urls = new Set(Array.from(assets?.values?.() || []).map((asset) => asset.url).filter(Boolean));
  urls.forEach((url) => URL.revokeObjectURL(url));
}

async function confirmPendingTest() {
  const tests = Array.isArray(state.pendingTest) ? state.pendingTest : [];
  if (!tests.length) {
    alert("请先导入题目 JSON。");
    return;
  }
  try {
    tests.forEach(validateTest);
    for (const test of tests) {
      await addTestToLibrary(structuredClone(test), state.pendingSource || "手动添加", false, cloneAssetMap(state.assets));
    }
    els.jsonFileName.textContent = tests.length === 1
      ? `${tests[0].title || "Untitled Test"} 已加入考试库`
      : `${tests.length} 个考试单元已加入考试库`;
    clearPendingTest(false);
    resetAssetPicker(false);
  } catch (error) {
    alert(`题目格式有问题：${error.message}`);
  }
}

function clearPendingTest(resetFileName = true) {
  state.pendingTest = null;
  state.pendingSource = "";
  els.jsonInput.value = "";
  if (resetFileName) els.jsonFileName.textContent = "选择 .json 文件";
  if (resetFileName) resetAssetPicker(true);
  renderPendingTest();
}

function renderPendingTest() {
  const tests = Array.isArray(state.pendingTest) ? state.pendingTest : [];
  const test = tests[0];
  els.pendingPanel.hidden = !tests.length;
  els.confirmAddBtn.disabled = !tests.length;
  els.cancelPendingBtn.disabled = !tests.length;
  if (!tests.length) {
    els.pendingTitle.textContent = "Untitled Test";
    els.pendingMeta.textContent = "-";
    return;
  }
  if (tests.length > 1) {
    const counts = ["listening", "reading", "writing", "speaking"]
      .map((type) => `${getTestTypeLabel(type)} ${tests.filter((item) => item.testType === type).length}`)
      .join(" · ");
    els.pendingTitle.textContent = `${tests.length} 个考试单元`;
    els.pendingMeta.textContent = counts;
    return;
  }
  const total = countPoints(test);
  const sectionLabel = getSectionLabel(test.testType);
  const scoreMeta = total ? ` · ${total} 分` : "";
  els.pendingTitle.textContent = test.title || "Untitled Test";
  els.pendingMeta.textContent = `${getTestTypeLabel(test.testType)} · ${test.sections.length} ${sectionLabel}${test.sections.length > 1 ? "s" : ""}${scoreMeta} · ${Number(test.durationMinutes || getDefaultDuration(test.testType))} 分钟`;
}

function toggleLibraryCollapsed() {
  state.libraryCollapsed = !state.libraryCollapsed;
  localStorage.setItem(LIBRARY_COLLAPSED_STORAGE_KEY, String(state.libraryCollapsed));
  renderLibrary();
}

function toggleHistoryCollapsed() {
  state.historyCollapsed = !state.historyCollapsed;
  localStorage.setItem(HISTORY_COLLAPSED_STORAGE_KEY, String(state.historyCollapsed));
  renderHistoryList();
}

async function addTestToLibrary(test, source, announce = true, assets = new Map()) {
  normalizeGeneratedTest(test);
  await inlineMatchedImageAssets(test, assets);
  validateTest(test);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    test,
    assets,
    source,
    importedAt: new Date().toISOString(),
  };
  externalizeInlineImages(entry);
  state.library.unshift(entry);
  await persistEntryAssets(entry);
  saveLibrary();
  renderLibrary();
  if (announce) {
    els.jsonFileName.textContent = `${test.title || "Untitled Test"} 已加入考试库`;
  }
  return entry;
}

function externalizeInlineImages(entry) {
  let imageIndex = 0;
  forEachImageTarget(entry?.test, (target) => {
    const dataUrl = [target.image, target.imageAsset].find((value) => /^data:image\//i.test(String(value || "")));
    if (!dataUrl) return;
    const imageName = String(target.imageName || "").trim()
      || `${makeJsonFileName(entry.test.title || "ielts-test").replace(/\.json$/i, "")}-inline-image-${++imageIndex}.png`;
    target.imageName = imageName;
    addAssetAliases(entry.assets, imageName, {
      url: dataUrl,
      dataUrl,
      generated: true,
      file: null,
    });
  });
}

function forEachImageTarget(test, callback) {
  (test?.sections || []).forEach((section) => {
    callback(section);
    (section.groups || []).forEach((group) => callback(group));
  });
}

function serializeTestForStorage(test) {
  const cloned = structuredClone(test);
  forEachImageTarget(cloned, (target) => {
    ["image", "imageAsset"].forEach((field) => {
      if (/^data:image\//i.test(String(target[field] || ""))) {
        delete target[field];
      }
    });
  });
  return cloned;
}

async function inlineMatchedImageAssets(test, assets = new Map()) {
  const sections = Array.isArray(test?.sections) ? test.sections : [];
  for (const section of sections) {
    await inlineImageRef(section, ["image", "imageName"], assets);
    for (const group of (section.groups || [])) {
      await inlineImageRef(group, ["image", "imageAsset", "imageName"], assets);
    }
  }
}

async function inlineImageRef(target, fields, assets) {
  if (!target || typeof target !== "object") return;
  const refs = fields.map((field) => String(target[field] || "").trim()).filter(Boolean);
  if (!refs.length) return;
  if (refs.some((ref) => /^data:image\//i.test(ref))) return;
  const matched = refs.map((ref) => ({ ref, asset: findAssetForRef(assets, ref) })).find((item) => item.asset && isImageAsset(item.asset, item.ref));
  if (!matched) return;
  const dataUrl = await getAssetDataUrl(matched.asset);
  if (!dataUrl) return;
  const originalRef = refs.find((ref) => !isExternalAsset(ref)) || matched.ref;
  if (!target.imageName && originalRef && !/^data:/i.test(originalRef)) target.imageName = originalRef;
  target.image = dataUrl;
  matched.asset.dataUrl = dataUrl;
  matched.asset.url = matched.asset.url || dataUrl;
  refs.forEach((ref) => addAssetAliases(assets, ref, matched.asset));
  if (originalRef) addAssetAliases(assets, originalRef, matched.asset);
}

function isImageAsset(asset, ref = "") {
  const type = String(asset?.file?.type || asset?.blob?.type || "").toLowerCase();
  if (type.startsWith("image/")) return true;
  if (/^data:image\//i.test(asset?.dataUrl || "")) return true;
  return /\.(png|jpe?g|webp|gif)$/i.test(String(ref || asset?.file?.name || ""));
}

async function getAssetDataUrl(asset) {
  if (!asset) return "";
  if (asset.dataUrl) return asset.dataUrl;
  if (asset.file) return fileToDataUrl(asset.file);
  if (asset.blob) return blobToDataUrl(asset.blob);
  return "";
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("无法读取图片资源。"));
    reader.readAsDataURL(blob);
  });
}

function renderLibrary() {
  els.libraryCount.textContent = `${state.library.length} 套`;
  renderFullMockPicker();
  els.libraryToggle.setAttribute("aria-expanded", String(!state.libraryCollapsed));
  els.libraryToggle.classList.toggle("is-collapsed", state.libraryCollapsed);
  els.testList.hidden = state.libraryCollapsed;
  els.emptyLibrary.hidden = state.libraryCollapsed || state.library.length > 0;
  if (state.libraryCollapsed) {
    els.testList.innerHTML = "";
    return;
  }
  els.testList.innerHTML = state.library.map((entry) => {
    const test = entry.test;
    const total = countPoints(test);
    const sectionLabel = getSectionLabel(test.testType);
    const scoreMeta = total ? ` · ${total} 分` : "";
    const missingAssets = getMissingAssetRefs(entry);
    return `
      <article class="test-card">
        <div class="test-card-main">
          <span class="test-type ${test.testType}">${getTestTypeLabel(test.testType)}</span>
          <h3>${escapeHtml(test.title || "Untitled Test")}</h3>
          <p>${test.sections.length} ${sectionLabel}${test.sections.length > 1 ? "s" : ""}${scoreMeta} · ${Number(test.durationMinutes || getDefaultDuration(test.testType))} 分钟</p>
          <span class="test-source">${escapeHtml(entry.source || "Imported")}</span>
          ${missingAssets.length ? `<span class="asset-warning">需重新绑定资源：${escapeHtml(missingAssets.slice(0, 3).join(", "))}${missingAssets.length > 3 ? "..." : ""}</span>` : ""}
        </div>
        <div class="test-card-actions">
          <button class="primary-button" type="button" data-start-test="${escapeAttribute(entry.id)}">开始考试</button>
          <button class="secondary-button" type="button" data-rename-test="${escapeAttribute(entry.id)}">重命名</button>
          ${missingAssets.length ? `<button class="secondary-button" type="button" data-bind-assets="${escapeAttribute(entry.id)}">绑定资源</button>` : ""}
          <button class="secondary-button" type="button" data-remove-test="${escapeAttribute(entry.id)}">移除</button>
        </div>
      </article>
    `;
  }).join("");
  document.querySelectorAll("[data-start-test]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = state.library.find((item) => item.id === button.dataset.startTest);
      if (entry) {
        const missingAssets = getMissingAssetRefs(entry);
        if (missingAssets.length) {
          alert(`这套题缺少音频/图片资源：${missingAssets.slice(0, 5).join(", ")}。请重新选择对应资源后再开始。`);
          return;
        }
        state.currentLibraryEntryId = entry.id;
        state.assets = cloneAssetMap(entry.assets || new Map());
        startTest(structuredClone(entry.test));
      }
    });
  });
  document.querySelectorAll("[data-rename-test]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = state.library.find((item) => item.id === button.dataset.renameTest);
      if (!entry) return;
      const currentTitle = entry.test.title || "Untitled Test";
      const nextTitle = prompt("给这套题取个名字：", currentTitle);
      if (nextTitle === null) return;
      const trimmed = nextTitle.trim();
      if (!trimmed) {
        alert("名字不能为空。");
        return;
      }
      entry.test.title = trimmed;
      saveLibrary();
      renderLibrary();
    });
  });
  document.querySelectorAll("[data-bind-assets]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = state.library.find((item) => item.id === button.dataset.bindAssets);
      const missingAssets = entry ? getMissingAssetRefs(entry) : [];
      showImportPanel("manual");
      els.assetInput.click();
      if (missingAssets.length) {
        els.assetFileName.textContent = `请选择资源：${missingAssets.slice(0, 4).join(", ")}${missingAssets.length > 4 ? "..." : ""}`;
      }
    });
  });
  document.querySelectorAll("[data-remove-test]").forEach((button) => {
    button.addEventListener("click", async () => {
      const removed = state.library.find((item) => item.id === button.dataset.removeTest);
      if (removed) revokeAssetMap(removed.assets);
      state.library = state.library.filter((item) => item.id !== button.dataset.removeTest);
      if (removed) await deleteEntryAssets(removed.id);
      saveLibrary();
      renderLibrary();
    });
  });
}

function renderFullMockPicker() {
  if (!els.fullMockPanel) return;
  const mode = document.querySelector("input[name='libraryMode']:checked")?.value || "single";
  const selects = {
    listening: els.fullMockListening,
    reading: els.fullMockReading,
    writing: els.fullMockWriting,
    speaking: els.fullMockSpeaking,
  };
  const countLabels = {
    listening: els.fullMockListeningCount,
    reading: els.fullMockReadingCount,
    writing: els.fullMockWritingCount,
    speaking: els.fullMockSpeakingCount,
  };
  Object.entries(selects).forEach(([testType, select]) => {
    const current = select.value;
    const entries = state.library.filter((entry) => entry.test?.testType === testType);
    countLabels[testType].textContent = `${entries.length} 套`;
    select.innerHTML = [
      `<option value="">选择 ${getTestTypeLabel(testType)}</option>`,
      ...entries.map((entry) => `<option value="${escapeAttribute(entry.id)}">${escapeHtml(entry.test.title || "Untitled Test")}</option>`),
    ].join("");
    if (entries.some((entry) => entry.id === current)) {
      select.value = current;
    }
  });
  els.startFullMockBtn.disabled = mode !== "full" || !Object.values(selects).every((select) => select.value);
}

function getFullMockSelection() {
  return ["listening", "reading", "writing", "speaking"].map((testType) => {
    const select = {
      listening: els.fullMockListening,
      reading: els.fullMockReading,
      writing: els.fullMockWriting,
      speaking: els.fullMockSpeaking,
    }[testType];
    const entry = state.library.find((item) => item.id === select.value);
    return { testType, entry };
  });
}

function startFullMockFromSelection() {
  const selected = getFullMockSelection();
  const missingType = selected.find((item) => !item.entry)?.testType;
  if (missingType) {
    alert(`请选择 ${getTestTypeLabel(missingType)} 考试单元。`);
    return;
  }
  const missingAssetsEntry = selected.find((item) => getMissingAssetRefs(item.entry).length);
  if (missingAssetsEntry) {
    const missingAssets = getMissingAssetRefs(missingAssetsEntry.entry);
    alert(`${getTestTypeLabel(missingAssetsEntry.testType)} 缺少音频/图片资源：${missingAssets.slice(0, 5).join(", ")}。请先绑定资源。`);
    return;
  }
  state.mode = "mock";
  const mockRadio = document.querySelector("input[name='mode'][value='mock']");
  if (mockRadio) mockRadio.checked = true;
  state.fullMock = {
    active: true,
    queue: selected.map((item) => item.entry.id),
    index: 0,
    results: [],
  };
  startFullMockCurrentUnit();
}

function startFullMockCurrentUnit() {
  const entryId = state.fullMock.queue[state.fullMock.index];
  const entry = state.library.find((item) => item.id === entryId);
  if (!entry) {
    alert("全科模考单元不存在，请重新选择。");
    resetFullMockState();
    returnToSetup(true);
    return;
  }
  state.assets = cloneAssetMap(entry.assets || new Map());
  state.currentLibraryEntryId = entry.id;
  startTest(structuredClone(entry.test));
}

function resetFullMockState() {
  state.fullMock = {
    active: false,
    queue: [],
    index: 0,
    results: [],
  };
}

function saveLibrary() {
  const serializable = state.library.map((entry) => ({
    id: entry.id,
    test: serializeTestForStorage(entry.test),
    source: entry.source,
    importedAt: entry.importedAt,
    generatedAssets: serializeGeneratedAssets(entry.assets),
  }));
  try {
    setLocalStorageWithQuota(LIBRARY_STORAGE_KEY, JSON.stringify(serializable.slice(0, 50)));
  } catch (error) {
    console.warn("Library could not be fully saved.", error);
    const withoutGeneratedAssets = serializable.map((entry) => ({ ...entry, generatedAssets: [] }));
    try {
      setLocalStorageWithQuota(LIBRARY_STORAGE_KEY, JSON.stringify(withoutGeneratedAssets.slice(0, 50)));
    } catch (fallbackError) {
      console.warn("Library could not be saved.", fallbackError);
      showToast("考试已加入当前页面，但本地考试库保存失败。请清理浏览器站点数据后重试。", "error");
    }
  }
}

function setLocalStorageWithQuota(key, value) {
  const text = String(value);
  if (text.length > 4_500_000) {
    throw new Error("单项本地存储超过 4.5MB 配额。");
  }
  localStorage.setItem(key, text);
}

async function loadLibrary() {
  try {
    const saved = window.IeltsCore.parseSafeJson(localStorage.getItem(LIBRARY_STORAGE_KEY) || "[]");
    const loaded = [];
    for (const entry of (Array.isArray(saved) ? saved : [])) {
      if (!entry?.test) continue;
      const normalized = {
        id: entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        test: entry.test,
        source: entry.source || "Saved",
        importedAt: entry.importedAt || new Date().toISOString(),
        assets: deserializeGeneratedAssets(entry.generatedAssets),
      };
      mergeAssetMap(normalized.assets, await loadEntryAssets(normalized.id));
      try {
        normalizeGeneratedTest(normalized.test);
        validateTest(normalized.test);
        loaded.push(normalized);
      } catch (error) {
        console.warn("Saved library entry was skipped.", error, normalized);
      }
    }
    state.library = loaded;
  } catch (error) {
    console.warn("Saved library could not be loaded.", error);
    state.library = [];
  }
}

function serializeGeneratedAssets(assets) {
  const seen = new Set();
  const serialized = [];
  let totalBytes = 0;
  (assets || new Map()).forEach((asset, key) => {
    if (!asset?.generated || !asset.dataUrl) return;
    const name = String(key);
    const canonical = name.toLowerCase();
    if (seen.has(canonical)) return;
    seen.add(canonical);
    const dataUrl = String(asset.dataUrl);
    const bytes = dataUrl.length * 0.75;
    if (totalBytes + bytes > 500_000) return;
    totalBytes += bytes;
    serialized.push({ name, dataUrl });
  });
  return serialized;
}

function deserializeGeneratedAssets(items) {
  const assets = new Map();
  (items || []).forEach((item) => {
    if (!item?.name || !item.dataUrl) return;
    const asset = { url: item.dataUrl, dataUrl: item.dataUrl, generated: true, file: null };
    addAssetAliases(assets, item.name, asset);
  });
  return assets;
}

function openAssetDb() {
  if (!window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = indexedDB.open(ASSET_DB_NAME, ASSET_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        const store = db.createObjectStore(ASSET_STORE_NAME, { keyPath: "key" });
        store.createIndex("entryId", "entryId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn("Asset database could not be opened.", request.error);
      resolve(null);
    };
  });
}

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function persistEntryAssets(entry) {
  const db = await openAssetDb();
  if (!db) return;
  try {
    const records = [];
    const seen = new Set();
    for (const ref of collectAssetRefs(entry.test)) {
      if (isExternalAsset(ref)) continue;
      const asset = findAssetForRef(entry.assets, ref);
      if (!asset || seen.has(ref.toLowerCase())) continue;
      const blob = await getAssetBlob(asset);
      if (!blob) continue;
      seen.add(ref.toLowerCase());
      records.push({
        key: makePersistedAssetKey(entry.id, ref),
        entryId: entry.id,
        name: ref,
        canonicalName: ref.toLowerCase(),
        blob,
        generated: Boolean(asset.generated),
      });
    }
    if (!records.length) return;
    const transaction = db.transaction(ASSET_STORE_NAME, "readwrite");
    const store = transaction.objectStore(ASSET_STORE_NAME);
    records.forEach((record) => store.put(record));
    await transactionComplete(transaction);
  } catch (error) {
    console.warn("Assets could not be persisted.", error);
  } finally {
    db.close();
  }
}

async function loadEntryAssets(entryId) {
  const assets = new Map();
  const db = await openAssetDb();
  if (!db) return assets;
  try {
    const transaction = db.transaction(ASSET_STORE_NAME, "readonly");
    const store = transaction.objectStore(ASSET_STORE_NAME);
    const index = store.index("entryId");
    const records = await promisifyRequest(index.getAll(entryId));
    (records || []).forEach((record) => {
      if (!record?.name || !record.blob) return;
      const asset = {
        url: URL.createObjectURL(record.blob),
        blob: record.blob,
        generated: Boolean(record.generated),
        file: null,
      };
      addAssetAliases(assets, record.name, asset);
    });
  } catch (error) {
    console.warn("Persisted assets could not be loaded.", error);
  } finally {
    db.close();
  }
  return assets;
}

async function deleteEntryAssets(entryId) {
  const db = await openAssetDb();
  if (!db) return;
  try {
    const readTransaction = db.transaction(ASSET_STORE_NAME, "readonly");
    const index = readTransaction.objectStore(ASSET_STORE_NAME).index("entryId");
    const records = await promisifyRequest(index.getAllKeys(entryId));
    await transactionComplete(readTransaction);
    if (!records.length) return;
    const writeTransaction = db.transaction(ASSET_STORE_NAME, "readwrite");
    const store = writeTransaction.objectStore(ASSET_STORE_NAME);
    records.forEach((key) => store.delete(key));
    await transactionComplete(writeTransaction);
  } catch (error) {
    console.warn("Persisted assets could not be deleted.", error);
  } finally {
    db.close();
  }
}

async function clearAssetDb() {
  const db = await openAssetDb();
  if (!db) return;
  try {
    const transaction = db.transaction(ASSET_STORE_NAME, "readwrite");
    transaction.objectStore(ASSET_STORE_NAME).clear();
    await transactionComplete(transaction);
  } catch (error) {
    console.warn("Persisted assets could not be cleared.", error);
  } finally {
    db.close();
  }
}

function transactionComplete(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

async function getAssetBlob(asset) {
  if (asset.file) return asset.file;
  if (asset.blob) return asset.blob;
  if (asset.dataUrl) return dataUrlToBlob(asset.dataUrl);
  return null;
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function makePersistedAssetKey(entryId, name) {
  return `${entryId}:${String(name).toLowerCase()}`;
}

function getMissingAssetRefs(entry) {
  const refs = collectMissingRelevantAssetRefs(entry.test, entry.assets || new Map());
  const assets = entry.assets || new Map();
  return refs.filter((ref) => !findAssetForRef(assets, ref) && !isExternalAsset(ref) && !isRelativePathAsset(ref));
}

function collectMissingRelevantAssetRefs(test, assets) {
  const refs = new Set();
  if (!test) return [];
  if (test.audio) refs.add(String(test.audio));
  (test.sections || []).forEach((section) => {
    if (section.audio) refs.add(String(section.audio));
    collectImageAssetRef(section, refs, assets);
    (section.groups || []).forEach((group) => collectImageAssetRef(group, refs, assets));
  });
  return Array.from(refs).filter(Boolean);
}

function collectImageAssetRef(target, refs, assets) {
  const refsToCheck = [target.imageName, target.imageAsset, target.image].filter(Boolean).map(String).filter((ref) => !isPdfAssetRef(ref));
  if (!refsToCheck.length) return;
  if (refsToCheck.some((ref) => hasResolvableImageRef({ image: ref }, assets))) return;
  refs.add(refsToCheck[0]);
}

function collectAssetRefs(test) {
  const refs = new Set();
  if (!test) return [];
  if (test.audio) refs.add(String(test.audio));
  ensureArray(test.analysisContext?.listeningTranscriptFiles || test.listeningTranscriptFiles)
    .filter(Boolean)
    .forEach((ref) => refs.add(String(ref)));
  (test.sections || []).forEach((section) => {
    if (section.audio) refs.add(String(section.audio));
    if (section.image) refs.add(String(section.image));
    if (section.imageName) refs.add(String(section.imageName));
    (section.groups || []).forEach((group) => {
      [group.image, group.imageAsset, group.imageName].filter(Boolean).forEach((imageRef) => refs.add(String(imageRef)));
    });
  });
  return Array.from(refs).filter(Boolean);
}

function isExternalAsset(ref) {
  return /^(https?:|data:|blob:)/i.test(String(ref || ""));
}

function isPdfAssetRef(ref) {
  return /\.pdf(?:$|[?#])/i.test(String(ref || "").trim()) || /^data:application\/pdf/i.test(String(ref || ""));
}

function isLikelyImageRef(ref) {
  return /\.(png|jpe?g|webp|gif)(?:$|[?#])/i.test(String(ref || "").trim());
}

function isRelativePathAsset(ref) {
  const value = String(ref || "").trim();
  if (!value || isExternalAsset(value)) return false;
  if (value.startsWith("/") || /^[a-z]:[\\/]/i.test(value)) return false;
  return value.includes("/");
}

function getTestTypeLabel(testType) {
  return {
    reading: "Reading",
    listening: "Listening",
    writing: "Writing",
    speaking: "Speaking",
  }[testType] || "Test";
}

function getExamTypeLabel(testType) {
  return {
    reading: "Academic Reading",
    listening: "Listening",
    writing: "Academic Writing",
    speaking: "Speaking",
  }[testType] || "IELTS";
}

function getSectionLabel(testType) {
  return {
    reading: "Passage",
    listening: "Part",
    writing: "Task",
    speaking: "Part",
  }[testType] || "Section";
}

function getDefaultDuration(testType) {
  return {
    reading: 60,
    listening: 30,
    writing: 60,
    speaking: 14,
  }[testType] || 60;
}

function countPoints(test) {
  if (!test || ["writing", "speaking"].includes(test.testType)) return 0;
  return test.sections.reduce((total, section) => total + section.groups.reduce((sectionTotal, group) => {
    return sectionTotal + group.questions.reduce((groupTotal, question) => {
      return groupTotal + getQuestionPointsFromGroup(question, group);
    }, 0);
  }, 0), 0);
}

function validateTest(test) {
  window.IeltsCore.assertSafeJsonValue(test);
  const probe = structuredClone(test);
  normalizeGeneratedTest(probe);
  validateNormalizedTest(probe);
}

function validateNormalizedTest(test) {
  if (!test || typeof test !== "object") throw new Error("根内容必须是对象。");
  if (!["listening", "reading", "writing", "speaking"].includes(test.testType)) throw new Error("testType 必须是 listening、reading、writing 或 speaking。");
  if (!Array.isArray(test.sections) || test.sections.length === 0) throw new Error("sections 至少需要一个部分。");
  if (test.testType === "writing") {
    validateWritingTest(test);
    return;
  }
  if (test.testType === "speaking") {
    validateSpeakingTest(test);
    return;
  }
  const ids = new Set();
  test.sections.forEach((section, sectionIndex) => {
    if (!Array.isArray(section.groups) || section.groups.length === 0) {
      throw new Error(`第 ${sectionIndex + 1} 部分缺少 groups。`);
    }
    section.groups.forEach((group) => {
      const type = group.questionType;
      if (!["blank", "single_choice", "multi_choice"].includes(type)) {
        throw new Error(`不支持的题型：${type}`);
      }
      if (!Array.isArray(group.questions) || group.questions.length === 0) {
        throw new Error(`${group.title || "题组"} 缺少 questions。`);
      }
      validateTemplatePlaceholders(group);
      group.questions.forEach((question) => {
        if (question.id === undefined || question.id === null) throw new Error("每题都需要 id。");
        const key = String(question.id);
        if (ids.has(key)) throw new Error(`题号重复：${key}`);
        ids.add(key);
        if (!Array.isArray(question.answer) || question.answer.length === 0) {
          throw new Error(`第 ${key} 题缺少 answer 数组。`);
        }
        if (type !== "blank" && !Array.isArray(question.options)) {
          throw new Error(`第 ${key} 题选择题缺少 options。`);
        }
        if (type !== "blank" && !String(question.text || "").trim()) {
          throw new Error(`第 ${key} 题选择题缺少题干。`);
        }
        if (type === "blank" && !String(question.text || "").trim() && !String(group.template || "").trim()) {
          throw new Error(`第 ${key} 题填空题缺少题干或模板。`);
        }
      });
    });
  });
}

function validateWritingTest(test) {
  test.sections.forEach((section, index) => {
    if (!String(section.title || "").trim()) throw new Error(`Writing 第 ${index + 1} 部分缺少 title。`);
    if (!String(section.prompt || "").trim()) throw new Error(`${section.title || `Writing Task ${index + 1}`} 缺少 prompt。`);
  });
}

function validateSpeakingTest(test) {
  test.sections.forEach((section, index) => {
    const hasQuestions = Array.isArray(section.questions) && section.questions.some((item) => String(item || "").trim());
    const hasCueCard = String(section.cueCard || "").trim();
    if (!String(section.title || "").trim()) throw new Error(`Speaking 第 ${index + 1} 部分缺少 title。`);
    if (!hasQuestions && !hasCueCard) throw new Error(`${section.title || `Speaking Part ${index + 1}`} 缺少 questions 或 cueCard。`);
  });
}

function validateTemplatePlaceholders(group) {
  if (!String(group.template || "").trim()) return;
  const placeholders = extractTemplatePlaceholderIds(group.template);
  const questionIds = new Set(group.questions.map((question) => String(question.id)));
  const missingQuestions = group.questions
    .filter((question) => !placeholders.has(String(question.id)))
    .map((question) => question.id);
  if (group.questionType === "blank" && missingQuestions.length) {
    throw new Error(`${group.title || "题组"} 的 template 缺少题号占位符：${missingQuestions.join(", ")}。`);
  }
  const unknownPlaceholders = Array.from(placeholders).filter((id) => !questionIds.has(id));
  if (unknownPlaceholders.length) {
    throw new Error(`${group.title || "题组"} 的 template 包含不存在的题号：${unknownPlaceholders.join(", ")}。`);
  }
}

function extractTemplatePlaceholderIds(template) {
  const ids = new Set();
  const pattern = /(?:\{\{\s*([^}]+?)\s*\}\}|\[\[\s*([^\]]+?)\s*\]\])/g;
  let match;
  while ((match = pattern.exec(String(template || ""))) !== null) {
    ids.add(String(match[1] || match[2] || "").trim());
  }
  return ids;
}

function getQuestionPointsFromGroup(question, group) {
  const explicit = Number(question.points);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const rangePoints = expandQuestionIdRange(question.id).length;
  if (rangePoints > 1) return rangePoints;
  const maxChoices = Number(question.maxChoices || group.maxChoices);
  if (group.questionType === "multi_choice" && group.questions.length === 1 && Number.isFinite(maxChoices) && maxChoices > 1) {
    return maxChoices;
  }
  return 1;
}

function expandQuestionIdRange(id) {
  const text = String(id ?? "").trim();
  const range = text.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (!range) return /^\d+$/.test(text) ? [text] : [];
  const start = Number(range[1]);
  const end = Number(range[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || end < start || end - start > 10) return [];
  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index));
}

function startTest(test) {
  clearInterval(state.timerId);
  normalizeLetterEntryGroups(test);
  state.test = test;
  state.answers = {};
  state.review = new Set();
  state.currentSectionIndex = 0;
  state.currentQuestionId = null;
  state.questionIndex = buildQuestionIndex(test);
  state.remainingSeconds = Number(test.durationMinutes || (test.testType === "reading" ? 60 : 30)) * 60;
  state.startedAt = new Date();
  state.submitted = false;
  state.audioMaxTime = 0;
  state.audioLocks = new Set();
  state.audioEndedKeys = new Set();
  state.audioStartConfirmedKeys = new Set();
  state.currentAudioKey = "";
  state.activeAudioSectionIndex = null;
  state.listeningReviewStarted = false;
  stopSpeakingRecording(false);
  revokeSpeakingRecordings();
  state.speakingRecordings = {};
  state.speakingRecordingSection = null;

  const modeRadio = document.querySelector(`input[name='mode'][value='${state.mode}']`);
  if (modeRadio) modeRadio.checked = true;

  els.setupPanel.hidden = true;
  els.exam.hidden = false;
  els.examTypeLabel.textContent = getExamTypeLabel(test.testType);
  const fullMockPrefix = state.fullMock.active ? `全科模考 ${state.fullMock.index + 1}/4 · ` : "";
  els.examTitle.textContent = `${fullMockPrefix}${test.title || "Untitled Test"}`;
  els.examHomeBtn.hidden = state.fullMock.active;
  state.currentQuestionId = state.questionIndex[0]?.id || null;

  renderExam();
  renderNav();
  updateTimer();
  state.timerId = setInterval(tick, 1000);
}

function buildQuestionIndex(test) {
  const list = [];
  if (test.testType === "writing" || test.testType === "speaking") {
    test.sections.forEach((section, sectionIndex) => {
      list.push({
        id: String(sectionIndex + 1),
        sectionIndex,
        type: test.testType,
        section,
      });
    });
    return list;
  }
  test.sections.forEach((section, sectionIndex) => {
    section.groups.forEach((group, groupIndex) => {
      group.questions.forEach((question) => {
        list.push({
          id: String(question.id),
          sectionIndex,
          groupIndex,
          type: group.questionType,
          maxChoices: group.maxChoices,
          group,
          question,
        });
      });
    });
  });
  return list.sort((a, b) => naturalQuestionSort(a.id, b.id));
}

function naturalQuestionSort(a, b) {
  const numA = Number(a);
  const numB = Number(b);
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
  return a.localeCompare(b, undefined, { numeric: true });
}

function renderExam() {
  renderPartTabs();
  if (state.test.testType === "reading") renderReading();
  if (state.test.testType === "listening") renderListening();
  if (state.test.testType === "writing") renderWriting();
  if (state.test.testType === "speaking") renderSpeaking();
  setupAudioForCurrentSection();
}

function renderPartTabs() {
  const labelPrefix = getSectionLabel(state.test.testType);
  els.partTabs.innerHTML = state.test.sections.map((section, index) => {
    const questions = state.questionIndex.filter((item) => item.sectionIndex === index);
    const answered = questions.reduce((sum, item) => sum + countAnsweredPoints(item), 0);
    const total = questions.reduce((sum, item) => sum + getQuestionPoints(item), 0);
    const progress = state.test.testType === "writing"
      ? `${countWords(state.answers[String(index + 1)] || "")}/${Number(section.minWords || 0) || "-"} words`
      : state.test.testType === "speaking"
        ? (state.speakingRecordings[String(index)] ? "已录音" : "未录音")
        : `${answered}/${total}`;
    return `
      <button class="part-tab ${index === state.currentSectionIndex ? "active" : ""}" data-section="${index}" type="button" aria-current="${index === state.currentSectionIndex ? "page" : "false"}">
        <span>${escapeHtml(section.title || `${labelPrefix} ${index + 1}`)}</span>
        <small>${escapeHtml(progress)}</small>
      </button>
    `;
  }).join("");
  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => switchSection(Number(button.dataset.section)));
  });
}

function switchSection(index) {
  if (!canSwitchToSection(index)) return;
  state.currentSectionIndex = index;
  const first = state.questionIndex.find((item) => item.sectionIndex === state.currentSectionIndex);
  state.currentQuestionId = first?.id || state.currentQuestionId;
  renderExam();
  renderNav();
}

function canSwitchToSection(index) {
  if (index === state.currentSectionIndex) return true;
  if (state.test?.testType !== "listening" || state.mode !== "mock") return true;
  const audioActive = !els.audioPlayer.paused && !els.audioPlayer.ended;
  if (audioActive && state.activeAudioSectionIndex !== null && index !== state.activeAudioSectionIndex) {
    alert("模考模式下听力音频播放期间不能切换 Part。请等当前音频播放结束后再切换。");
    return false;
  }
  return true;
}

function renderReading() {
  els.audioPanel.hidden = true;
  const section = state.test.sections[state.currentSectionIndex];
  els.workbench.innerHTML = `
    <div class="reading-layout">
      <article class="passage-pane highlightable">
        <h2 class="passage-title">${escapeHtml(section.title || "Passage")}</h2>
        <div class="passage-text">${formatText(section.passage || "")}</div>
      </article>
      <section class="question-pane">
        ${renderSectionQuestions(section)}
      </section>
    </div>
  `;
  bindQuestionEvents();
  scrollCurrentIntoView();
}

function renderListening() {
  const section = state.test.sections[state.currentSectionIndex];
  els.audioPanel.hidden = false;
  els.workbench.innerHTML = `
    <div class="listening-layout">
      <section class="question-pane">
        <h2 class="section-title">${escapeHtml(section.title || `Part ${state.currentSectionIndex + 1}`)}</h2>
        ${renderSectionQuestions(section)}
      </section>
    </div>
  `;
  bindQuestionEvents();
  scrollCurrentIntoView();
}

function renderWriting() {
  els.audioPanel.hidden = true;
  const section = state.test.sections[state.currentSectionIndex];
  const id = String(state.currentSectionIndex + 1);
  const value = state.answers[id] || "";
  const imageRef = getRenderableImageRef(section);
  const image = imageRef ? renderImage(imageRef) : "";
  els.workbench.innerHTML = `
    <div class="writing-layout">
      <section class="writing-prompt-pane highlightable">
        <div class="task-kicker">Academic Writing</div>
        <h2 class="section-title">${escapeHtml(section.title || `Writing Task ${id}`)}</h2>
        <p class="instructions">${escapeHtml(section.instructions || "")}</p>
        ${image}
        <div class="writing-prompt">${formatText(section.prompt || "")}</div>
      </section>
      <section class="writing-editor-pane" data-question-id="${escapeAttribute(id)}">
        <div class="writing-toolbar">
          <strong>${escapeHtml(section.title || `Task ${id}`)}</strong>
          <span id="wordCount">${countWords(value)} words${section.minWords ? ` / min ${Number(section.minWords)}` : ""}</span>
        </div>
        <textarea class="writing-editor" data-writing-answer="${escapeAttribute(id)}" placeholder="Type your answer here...">${escapeHtml(value)}</textarea>
      </section>
    </div>
  `;
  bindWritingEvents();
}

function bindWritingEvents() {
  document.querySelectorAll("[data-writing-answer]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      const id = event.target.dataset.writingAnswer;
      state.answers[id] = event.target.value;
      const section = state.test.sections[Number(id) - 1] || {};
      const wordCount = document.getElementById("wordCount");
      if (wordCount) {
        wordCount.textContent = `${countWords(event.target.value)} words${section.minWords ? ` / min ${Number(section.minWords)}` : ""}`;
      }
      renderPartTabs();
      renderNav();
    });
  });
}

function renderSpeaking() {
  els.audioPanel.hidden = true;
  const section = state.test.sections[state.currentSectionIndex];
  const key = String(state.currentSectionIndex);
  const transcriptId = String(state.currentSectionIndex + 1);
  const transcript = state.answers[transcriptId] || "";
  const recording = state.speakingRecordings[key];
  const isRecording = state.speakingRecordingSection === key;
  els.workbench.innerHTML = `
    <div class="speaking-layout">
      <section class="speaking-card" data-question-id="${escapeAttribute(transcriptId)}">
        <div class="task-kicker">IELTS Speaking</div>
        <h2 class="section-title">${escapeHtml(section.title || `Part ${state.currentSectionIndex + 1}`)}</h2>
        ${renderSpeakingPrompt(section)}
        <div class="speaking-meta">
          <span>Preparation: ${formatClock(Number(section.prepSeconds || 0))}</span>
          <span>Answer: ${formatClock(Number(section.answerSeconds || 0))}</span>
        </div>
        <div class="speaking-actions">
          <button class="primary-button" type="button" data-speaking-record="${escapeAttribute(key)}">${isRecording ? "停止录音" : "开始录音"}</button>
          ${recording ? `<audio controls src="${escapeAttribute(recording.url)}"></audio>` : `<span class="muted-note">还没有录音</span>`}
        </div>
        <label class="field-stack speaking-notes">
          <span>可选：输入转写/笔记，AI 反馈会一起参考</span>
          <textarea data-speaking-notes="${escapeAttribute(transcriptId)}" rows="7" placeholder="Optional transcript or notes...">${escapeHtml(transcript)}</textarea>
        </label>
      </section>
    </div>
  `;
  bindSpeakingEvents();
}

function renderSpeakingPrompt(section) {
  const questions = Array.isArray(section.questions) ? section.questions.filter(Boolean) : [];
  const prompts = Array.isArray(section.prompts) ? section.prompts.filter(Boolean) : [];
  if (section.cueCard) {
    return `
      <div class="cue-card highlightable">
        <h3>${escapeHtml(section.cueCard)}</h3>
        ${prompts.length ? `<ul>${prompts.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
      </div>
    `;
  }
  return `
    <ol class="speaking-questions highlightable">
      ${questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
    </ol>
  `;
}

function bindSpeakingEvents() {
  document.querySelectorAll("[data-speaking-record]").forEach((button) => {
    button.addEventListener("click", () => toggleSpeakingRecording(button.dataset.speakingRecord));
  });
  document.querySelectorAll("[data-speaking-notes]").forEach((textarea) => {
    textarea.addEventListener("input", (event) => {
      state.answers[event.target.dataset.speakingNotes] = event.target.value;
      renderPartTabs();
      renderNav();
    });
  });
}

function renderSectionQuestions(section) {
  return section.groups.map((group) => {
    const imageRef = getRenderableImageRef(group) || getRenderableImageRef(section);
    const image = imageRef ? renderImage(imageRef) : "";
    const optionBank = renderOptionBank(group.optionBank, Boolean(image));
    const questions = shouldRenderInlineBlankGroup(group)
      ? renderInlineBlankGroup(group)
      : group.questions.map((question) => renderQuestion(question, group)).join("");
    return `
      <div class="group">
        <h3 class="highlightable">${escapeHtml(group.title || "Questions")}</h3>
        <div class="instructions highlightable">${escapeHtml(group.instructions || "")}</div>
        ${optionBank}
        ${image}
        ${questions}
      </div>
    `;
  }).join("");
}

function renderOptionBank(options, imageVisible = false) {
  if (!Array.isArray(options) || options.length === 0) return "";
  if (imageVisible && options.every((option) => {
    const value = String(typeof option === "string" ? option : option.value || "").trim();
    const label = String(typeof option === "string" ? option : option.label || "").trim();
    return !label || label.toUpperCase() === value.toUpperCase();
  })) {
    return "";
  }
  return `
    <div class="option-bank">
      ${options.map((option) => {
        const label = String(option.label || "").trim();
        const hasDistinctLabel = label && label.toUpperCase() !== String(option.value).toUpperCase();
        return `
          <div class="bank-option">
            <span class="bank-letter">${escapeHtml(option.value)}</span>
            ${hasDistinctLabel ? `<span>${escapeHtml(label)}</span>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function shouldRenderInlineBlankGroup(group) {
  if (group.questionType !== "blank") return false;
  if (typeof group.template === "string" && group.template.trim()) return true;
  const source = `${group.title || ""} ${group.instructions || ""}`.toLowerCase();
  return group.questions.length > 1 && /complete|notes|form|table|summary|flow|chart|diagram|label|sentence|填空|表格|摘要|笔记/.test(source);
}

function renderInlineBlankGroup(group) {
  if (typeof group.template === "string" && group.template.trim()) {
    return `<div class="inline-template highlightable">${renderTemplateWithInputs(group.template, group)}</div>`;
  }
  return `
    <div class="inline-template highlightable">
      ${group.questions.map((question) => `<div class="inline-line">${renderQuestionTextWithInlineInput(question, group)}</div>`).join("")}
    </div>
  `;
}

function renderTemplateWithInputs(template, group) {
  template = cleanGeneratedTemplate(template);
  const questionById = new Map(group.questions.map((question) => [String(question.id), question]));
  const parts = [];
  const pattern = /(\{\{\s*([^}]+?)\s*\}\}|\[\[\s*([^\]]+?)\s*\]\])/g;
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(template)) !== null) {
    parts.push(formatTemplateText(template.slice(lastIndex, match.index)));
    const id = String(match[2] || match[3] || "").trim();
    const question = questionById.get(id);
    parts.push(question ? renderInlineInput(question, group) : escapeHtml(match[0]));
    lastIndex = pattern.lastIndex;
  }
  parts.push(formatTemplateText(template.slice(lastIndex)));
  return parts.join("");
}

function renderQuestionTextWithInlineInput(question, group) {
  const text = String(question.text || "");
  const input = renderInlineInput(question, group);
  const blankPattern = /_{3,}|\.{3,}|…+/;
  const numberedBlankPattern = new RegExp(`\\b${escapeRegExp(String(question.id))}\\s*(?:_{3,}|\\.{3,}|…+)`);
  if (numberedBlankPattern.test(text)) {
    return formatTemplateText(text.replace(numberedBlankPattern, `{{INLINE_${question.id}}}`)).replace(`{{INLINE_${question.id}}}`, input);
  }
  if (blankPattern.test(text)) {
    return formatTemplateText(text.replace(blankPattern, `{{INLINE_${question.id}}}`)).replace(`{{INLINE_${question.id}}}`, input);
  }
  return `${escapeHtml(question.id)}. ${formatTemplateText(text)} ${input}`;
}

function renderInlineInput(question, group) {
  const id = String(question.id);
  const value = state.answers[id] || "";
  const review = state.review.has(id);
  return `
    <span class="inline-answer ${state.currentQuestionId === id ? "current" : ""} ${isAnswered(id) ? "answered" : ""} ${review ? "review" : ""}" data-question-id="${escapeAttribute(id)}">
      <span class="inline-number">${escapeHtml(id)}</span>
      <input class="answer-input inline-input" data-answer="${escapeAttribute(id)}" type="text" value="${escapeAttribute(value)}" autocomplete="off" aria-label="Question ${escapeAttribute(id)}" />
      <button class="review-toggle inline-review ${review ? "active" : ""}" type="button" title="标记复查" aria-label="${review ? "取消复查标记" : "标记复查"}：第 ${escapeAttribute(id)} 题" data-review="${escapeAttribute(id)}">!</button>
    </span>
  `;
}

function formatTemplateText(text) {
  return escapeHtml(text).replace(/\n/g, "<br />");
}

function getRenderableImageRef(target) {
  if (!target) return "";
  return [target.image, target.imageAsset, target.imageName].find((ref) => {
    if (!ref || isPdfAssetRef(ref)) return false;
    return /^data:image\//i.test(String(ref)) || resolveAssetUrl(ref) || isLikelyImageRef(ref);
  }) || "";
}

function renderImage(ref) {
  if (!ref || isPdfAssetRef(ref)) return "";
  const src = resolveAssetUrl(ref) || (isLikelyImageRef(ref) || /^data:image\//i.test(String(ref)) ? ref : "");
  if (!src) return "";
  return `<img class="map-image" src="${escapeAttribute(src)}" alt="题目图片" />`;
}

function renderQuestion(question, group) {
  const id = String(question.id);
  const value = state.answers[id];
  const answered = isAnswered(id);
  const review = state.review.has(id);
  const questionText = String(question.text || "").trim() || "题干缺失，请重新生成或修正 JSON。";
  return `
    <div class="question ${state.currentQuestionId === id ? "current" : ""} ${answered ? "answered" : ""} ${review ? "review" : ""}" data-question-id="${escapeAttribute(id)}">
      <button class="review-toggle ${review ? "active" : ""}" type="button" title="标记复查" aria-label="${review ? "取消复查标记" : "标记复查"}：第 ${escapeAttribute(id)} 题" data-review="${escapeAttribute(id)}">!</button>
      <div class="question-row">
        <span class="question-number">${escapeHtml(id)}</span>
        <div class="question-content">
          <div class="highlightable ${question.text ? "" : "missing-question-text"}">${escapeHtml(questionText)}</div>
          ${renderAnswerControl(question, group, value)}
        </div>
      </div>
    </div>
  `;
}

function renderAnswerControl(question, group, value) {
  const id = String(question.id);
  if (group.questionType === "blank") {
    return `<input class="answer-input" data-answer="${escapeAttribute(id)}" type="text" value="${escapeAttribute(value || "")}" autocomplete="off" aria-label="第 ${escapeAttribute(id)} 题答案" />`;
  }
  const inputType = group.questionType === "multi_choice" ? "checkbox" : "radio";
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  return `
    <div class="option-list" role="group" aria-label="第 ${escapeAttribute(id)} 题选项" data-choice-group="${escapeAttribute(id)}" data-max="${Number(group.maxChoices || question.maxChoices || 99)}">
      ${(question.options || []).map((option) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const label = formatChoiceLabel(option);
        const checked = selected.includes(String(optionValue)) ? "checked" : "";
        return `
          <label class="option">
            <input type="${inputType}" name="q_${escapeAttribute(id)}" data-answer="${escapeAttribute(id)}" value="${escapeAttribute(optionValue)}" ${checked} aria-label="第 ${escapeAttribute(id)} 题，${escapeAttribute(label)}" />
            <span>${escapeHtml(label)}</span>
          </label>
        `;
      }).join("")}
    </div>
  `;
}

function formatChoiceLabel(option) {
  if (typeof option === "string") return option;
  const value = String(option.value || "").trim();
  const label = cleanOptionLabel(value, option.label);
  if (!value) return label;
  return label.toUpperCase() === value.toUpperCase() ? value : `${value}. ${label}`;
}

function bindQuestionEvents() {
  document.querySelectorAll("[data-question-id]").forEach((node) => {
    node.addEventListener("click", () => {
      state.currentQuestionId = node.dataset.questionId;
      const target = state.questionIndex.find((item) => item.id === state.currentQuestionId);
      if (target && target.sectionIndex !== state.currentSectionIndex) state.currentSectionIndex = target.sectionIndex;
      updateQuestionClasses();
      renderNav();
    });
  });
  document.querySelectorAll("input[data-answer]").forEach((input) => {
    input.addEventListener("input", handleAnswerInput);
  });
  document.querySelectorAll("[data-review]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = button.dataset.review;
      if (state.review.has(id)) state.review.delete(id);
      else state.review.add(id);
      updateQuestionClasses();
      renderNav();
    });
  });
}

function handleAnswerInput(event) {
  const input = event.target;
  const id = input.dataset.answer;
  const indexed = state.questionIndex.find((item) => item.id === id);
  if (!indexed) return;
  state.currentQuestionId = id;
  if (input.type === "checkbox") {
    const group = document.querySelector(`[data-choice-group="${selectorValue(id)}"]`);
    const max = Number(group?.dataset.max || indexed.maxChoices || 99);
    const checked = Array.from(document.querySelectorAll(`input[name="q_${selectorValue(id)}"]:checked`));
    if (checked.length > max) {
      input.checked = false;
      alert(`这道题最多选择 ${max} 项。`);
    }
    state.answers[id] = Array.from(document.querySelectorAll(`input[name="q_${selectorValue(id)}"]:checked`)).map((item) => item.value);
  } else if (input.type === "radio") {
    state.answers[id] = input.value;
  } else {
    state.answers[id] = input.value;
  }
  updateQuestionClasses();
  renderPartTabs();
  renderNav();
}

function updateQuestionClasses() {
  document.querySelectorAll("[data-question-id]").forEach((node) => {
    const id = node.dataset.questionId;
    node.classList.toggle("current", state.currentQuestionId === id);
    node.classList.toggle("answered", isAnswered(id));
    node.classList.toggle("review", state.review.has(id));
    const reviewButton = node.querySelector(".review-toggle");
    if (reviewButton) reviewButton.classList.toggle("active", state.review.has(id));
  });
}

function renderNav() {
  els.questionNav.innerHTML = state.questionIndex.flatMap((item) => {
    return expandQuestionLabels(item).map((label) => `
      <button class="nav-number ${state.currentQuestionId === item.id ? "current" : ""} ${isAnswered(item.id) ? "answered" : ""} ${state.review.has(item.id) ? "review" : ""}"
        data-nav="${escapeAttribute(item.id)}" type="button" aria-label="跳转到第 ${escapeAttribute(label)} 题">${escapeHtml(label)}</button>
    `);
  }).join("");
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.nav;
      const target = state.questionIndex.find((item) => item.id === id);
      if (!target) return;
      state.currentQuestionId = id;
      if (target.sectionIndex !== state.currentSectionIndex) {
        state.currentSectionIndex = target.sectionIndex;
        renderExam();
      } else {
        updateQuestionClasses();
        scrollCurrentIntoView();
      }
      renderNav();
    });
  });
}

function scrollCurrentIntoView() {
  const node = document.querySelector(`[data-question-id="${selectorValue(state.currentQuestionId || "")}"]`);
  if (node) node.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function isAnswered(id) {
  if (state.test?.testType === "speaking") {
    const index = Number(id) - 1;
    return Boolean(state.speakingRecordings[String(index)] || String(state.answers[String(id)] || "").trim());
  }
  const value = state.answers[String(id)];
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && String(value).trim() !== "";
}

function countAnsweredPoints(item) {
  return isAnswered(item.id) ? getQuestionPoints(item) : 0;
}

function getQuestionPoints(item) {
  return getQuestionPointsFromGroup(item.question || {}, item.group || {});
}

function expandQuestionLabels(item) {
  const id = String(item.id);
  const range = id.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (!range) return [id];
  const start = Number(range[1]);
  const end = Number(range[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || end < start || end - start > 5) return [id];
  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index));
}

function tick() {
  if (state.submitted) return;
  if (state.test?.testType === "listening" && getListeningAudioKeys().length > 0 && !state.listeningReviewStarted && state.remainingSeconds <= 0) {
    maybeStartListeningReviewCountdown(true);
    return;
  }
  state.remainingSeconds -= 1;
  updateTimer();
  if (state.remainingSeconds <= 0) submitTest(true);
}

function updateTimer() {
  const seconds = Math.max(0, state.remainingSeconds);
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  els.timer.textContent = `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
  els.timer.classList.toggle("warning", seconds <= 300);
}

function setupAudioForCurrentSection() {
  if (state.test?.testType !== "listening") {
    els.audioPanel.hidden = true;
    els.audioPlayer.pause();
    return;
  }
  const section = state.test.sections[state.currentSectionIndex] || {};
  const audioRef = section.audio || state.test.audio || "";
  const audioUrl = resolveAssetUrl(audioRef) || audioRef;
  state.currentAudioKey = getListeningAudioKey(state.currentSectionIndex);
  els.audioTitle.textContent = section.title ? `${section.title} Audio` : "Audio";
  els.audioStartBtn.disabled = !audioUrl || state.audioLocks.has(state.currentAudioKey);
  if (els.audioPlayer.dataset.audioKey !== state.currentAudioKey) {
    els.audioPlayer.src = audioUrl || "";
    els.audioPlayer.dataset.audioKey = state.currentAudioKey;
    els.audioMaxTime = 0;
  }
  els.audioPlayer.controls = state.mode === "practice";
  updateAudioRule();
  updateAudioClock();
}

function setupAudioGuards() {
  els.audioStartBtn.addEventListener("click", async () => {
    if (!els.audioPlayer.src) {
      showToast("当前听力没有找到音频。请导入 JSON 中引用的音频文件。", "error");
      return;
    }
    if (state.mode === "mock" && !state.audioStartConfirmedKeys.has(state.currentAudioKey)) {
      const confirmed = confirm("模考模式下，本段音频开始后不能暂停、快进或重播。确定现在开始吗？");
      if (!confirmed) return;
      state.audioStartConfirmedKeys.add(state.currentAudioKey);
    }
    try {
      await els.audioPlayer.play();
      state.activeAudioSectionIndex = state.currentSectionIndex;
    } catch {
      showToast("浏览器阻止了播放，请再点击一次播放。", "error");
    }
  });
  els.audioPlayer.addEventListener("timeupdate", () => {
    state.audioMaxTime = Math.max(state.audioMaxTime, els.audioPlayer.currentTime || 0);
    updateAudioClock();
  });
  els.audioPlayer.addEventListener("seeking", () => {
    if (state.mode === "mock" && els.audioPlayer.currentTime > state.audioMaxTime + 1) {
      els.audioPlayer.currentTime = state.audioMaxTime;
    }
  });
  els.audioPlayer.addEventListener("pause", () => {
    if (state.mode === "mock" && !state.submitted && !els.audioPlayer.ended && els.audioPlayer.currentTime > 0) {
      setTimeout(() => els.audioPlayer.play().catch(() => {}), 150);
    }
  });
  els.audioPlayer.addEventListener("ended", () => {
    if (state.mode === "mock") {
      state.audioLocks.add(state.currentAudioKey);
      state.audioEndedKeys.add(state.currentAudioKey);
      state.activeAudioSectionIndex = null;
      els.audioStartBtn.disabled = true;
      maybeStartListeningReviewCountdown();
    }
  });
  els.audioPlayer.addEventListener("error", () => {
    if (state.test?.testType !== "listening" || state.submitted) return;
    state.activeAudioSectionIndex = null;
    alert("音频加载失败。请回到主页面重新绑定对应音频文件。");
  });
  els.audioPlayer.addEventListener("loadedmetadata", updateAudioClock);
}

function maybeStartListeningReviewCountdown(force = false) {
  if (state.submitted || state.test?.testType !== "listening" || state.listeningReviewStarted) return;
  const audioKeys = getListeningAudioKeys();
  const allEnded = audioKeys.length > 0 && audioKeys.every((key) => state.audioEndedKeys.has(key));
  if (!force && !allEnded) return;
  state.listeningReviewStarted = true;
  state.remainingSeconds = 180;
  updateTimer();
  alert(allEnded
    ? "听力音频已播放结束。你还有 3 分钟检查答案，时间到后将自动交卷。"
    : "考试时间已到。你还有 3 分钟检查答案，时间到后将自动交卷。");
}

function getListeningAudioKeys() {
  if (!state.test || state.test.testType !== "listening") return [];
  return state.test.sections
    .map((section, index) => {
      const audioRef = section.audio || state.test.audio || "";
      return audioRef ? getListeningAudioKey(index) : "";
    })
    .filter(Boolean);
}

function getListeningAudioKey(index) {
  const section = state.test?.sections[index] || {};
  const audioRef = section.audio || state.test?.audio || "";
  return `${index}:${audioRef || "no-audio"}`;
}

function updateAudioRule() {
  if (!els.audioRule) return;
  els.audioRule.textContent = state.mode === "mock"
    ? "模考模式：音频只播放一次。全部音频结束后有 3 分钟检查时间，然后自动交卷。"
    : "练习模式：可以暂停、拖动和反复播放。";
  els.audioStartBtn.textContent = state.mode === "mock" ? "开始播放" : "播放";
  els.audioPlayer.controls = state.mode === "practice";
}

function updateAudioClock() {
  const current = formatClock(els.audioPlayer.currentTime || 0);
  const duration = Number.isFinite(els.audioPlayer.duration) ? formatClock(els.audioPlayer.duration) : "00:00";
  els.audioClock.textContent = `${current} / ${duration}`;
}

async function toggleSpeakingRecording(sectionKey) {
  if (state.speakingRecordingSection === sectionKey) {
    stopSpeakingRecording(true);
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    alert("当前浏览器不支持录音。可以先在文本框里输入转写/笔记。");
    return;
  }
  stopSpeakingRecording(true);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.speakingChunks = [];
    state.speakingRecorder = new MediaRecorder(stream);
    state.speakingRecordingSection = sectionKey;
    state.speakingRecorder.addEventListener("dataavailable", (event) => {
      if (event.data && event.data.size) state.speakingChunks.push(event.data);
    });
    state.speakingRecorder.addEventListener("stop", () => {
      const blob = new Blob(state.speakingChunks, { type: state.speakingRecorder?.mimeType || "audio/webm" });
      const previous = state.speakingRecordings[sectionKey];
      if (previous?.url) URL.revokeObjectURL(previous.url);
      state.speakingRecordings[sectionKey] = {
        url: URL.createObjectURL(blob),
        blob,
        mimeType: blob.type || state.speakingRecorder?.mimeType || "audio/webm",
        size: blob.size,
        createdAt: new Date().toISOString(),
      };
      stream.getTracks().forEach((track) => track.stop());
      state.speakingRecorder = null;
      state.speakingChunks = [];
      state.speakingRecordingSection = null;
      renderExam();
      renderNav();
    });
    state.speakingRecorder.start();
    renderExam();
  } catch (error) {
    alert(`无法开始录音：${error.message || error}`);
  }
}

function stopSpeakingRecording(saveRecording = true) {
  if (state.speakingRecorder && state.speakingRecorder.state !== "inactive") {
    if (saveRecording) state.speakingRecorder.stop();
    else {
      state.speakingRecorder.stream?.getTracks?.().forEach((track) => track.stop());
      state.speakingRecorder = null;
      state.speakingChunks = [];
      state.speakingRecordingSection = null;
    }
  }
}

function revokeSpeakingRecordings() {
  Object.values(state.speakingRecordings || {}).forEach((recording) => {
    if (recording?.url) URL.revokeObjectURL(recording.url);
  });
}

async function submitTest(auto) {
  if (!state.test || state.submitted) return;
  if (state.test.testType === "speaking" && state.speakingRecordingSection !== null) {
    alert("请先停止当前口语录音，再交卷。");
    return;
  }
  if (!auto && state.mode === "mock") {
    const unanswered = ["writing", "speaking"].includes(state.test.testType) ? 0 : state.questionIndex.filter((item) => !isAnswered(item.id)).length;
    const confirmed = confirm(unanswered ? `还有 ${unanswered} 题未作答，确定交卷吗？` : "确定交卷吗？");
    if (!confirmed) return;
  }
  state.submitted = true;
  clearInterval(state.timerId);
  els.audioPlayer.pause();
  stopSpeakingRecording(true);
  let result = gradeTest();
  result.libraryEntryId = state.currentLibraryEntryId || "";
  if (result.testType === "speaking") {
    try {
      result = await transcribeSpeakingResult(result);
    } catch (error) {
      console.warn("Speaking transcript could not be generated before saving.", error);
    }
  }
  saveHistory(result);
  if (state.fullMock.active) {
    continueFullMock(result);
    return;
  }
  showResult(result, auto);
}

function continueFullMock(result) {
  state.fullMock.results.push(result);
  const nextIndex = state.fullMock.index + 1;
  if (nextIndex < state.fullMock.queue.length) {
    state.fullMock.index = nextIndex;
    const nextEntry = state.library.find((item) => item.id === state.fullMock.queue[nextIndex]);
    alert(`${getTestTypeLabel(result.testType)} 已完成。接下来进入 ${getTestTypeLabel(nextEntry?.test?.testType)}。`);
    startFullMockCurrentUnit();
    return;
  }
  const results = [...state.fullMock.results];
  resetFullMockState();
  showFullMockResult(results);
}

function gradeTest() {
  if (state.test.testType === "writing") return buildWritingResult();
  if (state.test.testType === "speaking") return buildSpeakingResult();
  const rows = state.questionIndex.map((item) => {
    const section = state.test.sections[item.sectionIndex] || {};
    const expected = item.question.answer;
    const actual = state.answers[item.id];
    const points = getQuestionPoints(item);
    const useMulti = item.type === "multi_choice" || points > 1;
    const awarded = useMulti
      ? gradeMulti(actual, expected, points)
      : (gradeSingle(actual, expected) ? points : 0);
    return {
      id: item.id,
      sectionTitle: section.title || `Section ${item.sectionIndex + 1}`,
      sectionIndex: item.sectionIndex,
      groupIndex: item.groupIndex,
      correct: awarded === points,
      awarded,
      points,
      userAnswer: displayAnswer(actual),
      correctAnswer: expected.map(displayAnswer).join(" / "),
      questionText: item.question.text || item.group.template || "",
      instructions: item.group.instructions || "",
      groupTitle: item.group.title || "",
      groupTemplate: item.group.template || "",
      groupOptionBank: item.group.optionBank || [],
      groupQuestions: (item.group.questions || []).map((question) => ({
        id: question.id,
        text: question.text || "",
        options: question.options || [],
      })),
      readingPassage: state.test.testType === "reading" ? section.passage || "" : "",
      listeningAudioRef: state.test.testType === "listening" ? section.audio || state.test.audio || "" : "",
      sectionInstructions: section.instructions || "",
    };
  });
  const score = rows.reduce((sum, row) => sum + row.awarded, 0);
  const total = rows.reduce((sum, row) => sum + row.points, 0);
  return {
    title: state.test.title || "Untitled Test",
    testType: state.test.testType,
    mode: state.mode,
    score,
    total,
    percent: total ? Math.round((score / total) * 100) : 0,
    rows,
    listeningTranscriptText: state.test.testType === "listening" ? getListeningTranscriptTextFromTest(state.test) : "",
    listeningTranscriptFiles: state.test.testType === "listening" ? getListeningTranscriptFileRefs(null, state.test) : [],
    completedAt: new Date().toISOString(),
  };
}

function getListeningTranscriptTextFromTest(test) {
  return String(test?.listeningTranscriptText || test?.analysisContext?.listeningTranscriptText || "").trim();
}

function buildWritingResult() {
  const tasks = state.test.sections.map((section, index) => {
    const id = String(index + 1);
    const answer = state.answers[id] || "";
    return {
      id,
      title: section.title || `Writing Task ${id}`,
      instructions: section.instructions || "",
      prompt: section.prompt || "",
      minWords: Number(section.minWords || 0),
      answer,
      words: countWords(answer),
    };
  });
  const words = tasks.reduce((sum, task) => sum + task.words, 0);
  return {
    title: state.test.title || "Untitled Writing Test",
    testType: "writing",
    mode: state.mode,
    score: "-",
    total: "-",
    percent: "-",
    tasks,
    words,
    completedAt: new Date().toISOString(),
  };
}

function buildSpeakingResult() {
  const parts = state.test.sections.map((section, index) => {
    const id = String(index + 1);
    const key = String(index);
    return {
      id,
      title: section.title || `Speaking Part ${id}`,
      questions: section.questions || [],
      cueCard: section.cueCard || "",
      prompts: section.prompts || [],
      transcript: state.answers[id] || "",
      recording: state.speakingRecordings[key] ? {
        key,
        size: state.speakingRecordings[key].size,
        createdAt: state.speakingRecordings[key].createdAt,
      } : null,
    };
  });
  const recorded = parts.filter((part) => part.recording).length;
  return {
    title: state.test.title || "Untitled Speaking Test",
    testType: "speaking",
    mode: state.mode,
    score: "-",
    total: "-",
    percent: "-",
    parts,
    recorded,
    completedAt: new Date().toISOString(),
  };
}

function gradeSingle(actual, expectedList) {
  const normalizedActual = normalizeAnswer(actual);
  return expectedList.some((answer) => normalizeAnswer(answer) === normalizedActual);
}

function gradeMulti(actual, expectedList, points) {
  const actualSet = normalizeMulti(actual);
  const expectedSet = normalizeMulti(expectedList);
  const uniqueActual = Array.from(new Set(actualSet));
  if (uniqueActual.length > expectedSet.length) return 0;
  if (points > 1) {
    return uniqueActual.filter((answer) => expectedSet.includes(answer)).length;
  }
  return uniqueActual.length === expectedSet.length && expectedSet.every((answer) => uniqueActual.includes(answer)) ? 1 : 0;
}

function normalizeMulti(value) {
  const list = Array.isArray(value) ? value : String(value || "").split(/[;,|/、\s]+/);
  return list.map(normalizeAnswer).filter(Boolean).sort();
}

function normalizeAnswer(value) {
  if (Array.isArray(value)) return value.map(normalizeAnswer).join(",");
  const text = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/&/g, " and ");
  const numeric = normalizeNumericAnswer(text);
  if (numeric) return numeric;
  return text
    .replace(/[-‐‑‒–—]/g, "")
    .replace(/[.,;:!?()[\]{}"']/g, "")
    .replace(/\s+/g, " ");
}

function normalizeNumericAnswer(text) {
  const compact = String(text || "")
    .replace(/[£$€¥]/g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, "");
  if (!/^[-+]?\d+(?:\.\d+)?$/.test(compact)) return "";
  const [integer, decimal = ""] = compact.split(".");
  const normalizedInteger = String(Number(integer));
  const normalizedDecimal = decimal.replace(/0+$/, "");
  return normalizedDecimal ? `${normalizedInteger}.${normalizedDecimal}` : normalizedInteger;
}

function displayAnswer(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value === undefined || value === "" ? "-" : String(value);
}

function countWords(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word))
    .length;
}

function showResult(result, auto) {
  els.resultTitle.textContent = auto ? "时间到，已自动交卷" : (["writing", "speaking"].includes(result.testType) ? "已保存" : "成绩");
  const scoreSummary = result.testType === "writing"
    ? `
      <div class="score-item"><div class="score-label">总字数</div><div class="score-value">${result.words}</div></div>
      <div class="score-item"><div class="score-label">任务数</div><div class="score-value">${result.tasks.length}</div></div>
      <div class="score-item"><div class="score-label">模式</div><div class="score-value">${result.mode === "mock" ? "模考" : "练习"}</div></div>
    `
    : result.testType === "speaking"
      ? `
        <div class="score-item"><div class="score-label">已录音</div><div class="score-value">${result.recorded} / ${result.parts.length}</div></div>
        <div class="score-item"><div class="score-label">Part</div><div class="score-value">${result.parts.length}</div></div>
        <div class="score-item"><div class="score-label">模式</div><div class="score-value">${result.mode === "mock" ? "模考" : "练习"}</div></div>
      `
      : `
        <div class="score-item"><div class="score-label">得分</div><div class="score-value">${result.score} / ${result.total}</div></div>
        <div class="score-item"><div class="score-label">正确率</div><div class="score-value">${result.percent}%</div></div>
        <div class="score-item"><div class="score-label">模式</div><div class="score-value">${result.mode === "mock" ? "模考" : "练习"}</div></div>
      `;
  const aiButton = ["writing", "speaking"].includes(result.testType)
    ? `<button class="secondary-button" id="aiScoreBtn" type="button">${result.aiFeedback ? "查看AI评分" : "AI评分"}</button>`
    : "";
  els.resultBody.innerHTML = `
    <div class="score-card">
      ${scoreSummary}
    </div>
    <p class="result-note">详细答题记录已保存到主页面的“考试记录”，点击记录里的“查看详情”可以打开。</p>
    <div id="aiFeedbackBox" class="ai-feedback" hidden></div>
    <div class="result-actions">
      ${aiButton}
      <button class="primary-button" id="resultHomeBtn" type="button">返回主页面</button>
    </div>
  `;
  openResultDialog();
  document.getElementById("resultHomeBtn").addEventListener("click", () => returnToSetup(true));
  document.getElementById("aiScoreBtn")?.addEventListener("click", (event) => generateProductiveFeedback(result, document.getElementById("aiFeedbackBox"), event.currentTarget));
}

function showFullMockResult(results) {
  els.resultTitle.textContent = "全科模考完成";
  const rows = results.map((result) => {
    const metric = ["listening", "reading"].includes(result.testType)
      ? `${result.score} / ${result.total} · ${result.percent}%`
      : result.testType === "writing"
        ? `${result.words || 0} words`
        : `${result.recorded || 0} / ${(result.parts || []).length} recordings`;
    return `
      <div class="score-item">
        <div class="score-label">${getTestTypeLabel(result.testType)}</div>
        <div class="score-value">${escapeHtml(metric)}</div>
      </div>
    `;
  }).join("");
  els.resultBody.innerHTML = `
    <div class="score-card">
      ${rows}
    </div>
    <p class="result-note">四科记录已分别保存到“考试记录”。Writing 和 Speaking 可在记录详情里继续使用 AI 评分。</p>
    <div class="result-actions">
      <button class="primary-button" id="resultHomeBtn" type="button">返回主页面</button>
    </div>
  `;
  openResultDialog();
  document.getElementById("resultHomeBtn").addEventListener("click", () => returnToSetup(true));
}

function saveHistory(result) {
  const key = "ielts-mock-history";
  try {
    const history = safeLoadHistory();
    const historyId = result.historyId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    result.historyId = historyId;
    history.unshift({
      id: historyId,
      title: result.title,
      testType: result.testType,
      mode: result.mode,
      score: result.score,
      total: result.total,
      percent: result.percent,
      completedAt: result.completedAt,
      rows: result.rows,
      tasks: result.tasks,
      words: result.words,
      parts: result.parts,
      recorded: result.recorded,
      libraryEntryId: result.libraryEntryId,
      aiFeedback: result.aiFeedback,
      fluencyAssessment: result.fluencyAssessment,
      listeningTranscriptText: result.listeningTranscriptText,
      listeningTranscriptFiles: result.listeningTranscriptFiles,
    });
    setLocalStorageWithQuota(key, JSON.stringify(history.slice(0, 30)));
  } catch (error) {
    console.warn("History could not be saved.", error);
    showToast("本次结果已生成，但历史记录保存失败。请清理浏览器站点数据后重试。", "error");
  }
  renderHistoryList();
}

function updateSavedHistoryItem(result) {
  const historyId = result?.historyId || result?.id;
  if (!historyId) return;
  const history = safeLoadHistory();
  const index = history.findIndex((item) => item.id === historyId);
  if (index < 0) return;
  history[index] = {
    ...history[index],
    rows: result.rows ?? history[index].rows,
    tasks: result.tasks ?? history[index].tasks,
    parts: result.parts ?? history[index].parts,
    aiFeedback: result.aiFeedback ?? history[index].aiFeedback,
    fluencyAssessment: result.fluencyAssessment ?? history[index].fluencyAssessment,
    listeningTranscriptText: result.listeningTranscriptText ?? history[index].listeningTranscriptText,
    listeningTranscriptFiles: result.listeningTranscriptFiles ?? history[index].listeningTranscriptFiles,
    libraryEntryId: result.libraryEntryId ?? history[index].libraryEntryId,
  };
  try {
    setLocalStorageWithQuota("ielts-mock-history", JSON.stringify(history));
  } catch (error) {
    console.warn("History could not be updated.", error);
  }
  renderHistoryList();
}

function renderHistoryList() {
  const history = safeLoadHistory();
  els.historyCount.textContent = `${history.length} 条`;
  els.historyToggle.setAttribute("aria-expanded", String(!state.historyCollapsed));
  els.historyToggle.classList.toggle("is-collapsed", state.historyCollapsed);
  els.historyList.hidden = state.historyCollapsed;
  els.emptyHistory.hidden = state.historyCollapsed || history.length > 0;
  if (state.historyCollapsed) {
    els.historyList.innerHTML = "";
    return;
  }
  els.historyList.innerHTML = history.map((item, index) => `
    <article class="history-card">
      <div>
        <span class="test-type ${escapeAttribute(item.testType)}">${getTestTypeLabel(item.testType)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(new Date(item.completedAt).toLocaleString())} · ${item.mode === "mock" ? "模考" : "练习"}</p>
      </div>
      <strong>${formatHistoryScore(item)}</strong>
      <span>${formatHistoryMetric(item)}</span>
      <button class="secondary-button" type="button" data-history-detail="${index}">查看详情</button>
      <button class="secondary-button danger-button" type="button" data-history-remove="${index}">移除</button>
    </article>
  `).join("");
  document.querySelectorAll("[data-history-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      const freshHistory = safeLoadHistory();
      const item = freshHistory[Number(button.dataset.historyDetail)];
      if (item) showHistoryDetail(item);
    });
  });
  document.querySelectorAll("[data-history-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const history = safeLoadHistory();
      const index = Number(button.dataset.historyRemove);
      history.splice(index, 1);
      try {
        setLocalStorageWithQuota("ielts-mock-history", JSON.stringify(history));
      } catch (error) {
        console.warn("History could not be updated.", error);
      }
      renderHistoryList();
    });
  });
}

function safeLoadHistory() {
  try {
    const history = window.IeltsCore.parseSafeJson(localStorage.getItem("ielts-mock-history") || "[]");
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.warn("History could not be loaded.", error);
    return [];
  }
}

function showHistoryDetail(item) {
  els.resultTitle.textContent = "答题详情";
  if (item.testType === "writing") {
    showWritingHistoryDetail(item);
    return;
  }
  if (item.testType === "speaking") {
    showSpeakingHistoryDetail(item);
    return;
  }
  els.resultBody.innerHTML = `
    <div class="score-card">
      <div class="score-item"><div class="score-label">得分</div><div class="score-value">${item.score} / ${item.total}</div></div>
      <div class="score-item"><div class="score-label">正确率</div><div class="score-value">${item.percent}%</div></div>
      <div class="score-item"><div class="score-label">考试</div><div class="score-value">${getTestTypeLabel(item.testType)}</div></div>
    </div>
    <table class="review-table">
      <thead><tr><th>题号</th><th>结果</th><th>你的答案</th><th>正确答案</th><th>AI</th></tr></thead>
      <tbody>
        ${(item.rows || []).map((row, index) => `
          <tr>
            <td>${escapeHtml(row.id)}</td>
            <td class="${row.correct ? "correct" : "wrong"}">${row.correct ? "正确" : `${row.awarded}/${row.points}`}</td>
            <td>${escapeHtml(row.userAnswer)}</td>
            <td>${escapeHtml(row.correctAnswer)}</td>
            <td>${row.correct ? "" : `<button class="secondary-button compact-button" type="button" data-ai-explain="${index}">${row.aiExplanation ? "查看解析" : "AI解析"}</button>`}</td>
          </tr>
          ${row.correct ? "" : `<tr id="aiExplainRow${index}" class="ai-explain-row" hidden><td colspan="5"><div class="ai-feedback">${row.aiExplanation ? renderSavedAnswerExplanation(row.aiExplanation) : ""}</div></td></tr>`}
        `).join("")}
      </tbody>
    </table>
  `;
  openResultDialog();
  document.querySelectorAll("[data-ai-explain]").forEach((button) => {
    button.addEventListener("click", () => generateAnswerExplanation(item, Number(button.dataset.aiExplain), button));
  });
}

function showWritingHistoryDetail(item) {
  els.resultBody.innerHTML = `
    <div class="score-card">
      <div class="score-item"><div class="score-label">总字数</div><div class="score-value">${item.words || 0}</div></div>
      <div class="score-item"><div class="score-label">任务数</div><div class="score-value">${(item.tasks || []).length}</div></div>
      <div class="score-item"><div class="score-label">考试</div><div class="score-value">Writing</div></div>
    </div>
    ${(item.tasks || []).map((task) => `
      <article class="productive-review">
        <h3>${escapeHtml(task.title)}</h3>
        <p class="instructions">${escapeHtml(task.instructions || "")}</p>
        <div class="writing-prompt">${formatText(task.prompt || "")}</div>
        <div class="word-badge">${Number(task.words || 0)} words${task.minWords ? ` / min ${Number(task.minWords)}` : ""}</div>
        <pre>${escapeHtml(task.answer || "")}</pre>
      </article>
    `).join("")}
    <div id="aiFeedbackBox" class="ai-feedback" hidden>${item.aiFeedback ? renderAiFeedback(item.aiFeedback) : ""}</div>
    <div class="result-actions"><button class="secondary-button" id="aiScoreBtn" type="button">${item.aiFeedback ? "查看AI评分" : "AI评分"}</button></div>
  `;
  openResultDialog();
  document.getElementById("aiScoreBtn")?.addEventListener("click", (event) => generateProductiveFeedback(item, document.getElementById("aiFeedbackBox"), event.currentTarget));
}

function showSpeakingHistoryDetail(item) {
  els.resultBody.innerHTML = `
    <div class="score-card">
      <div class="score-item"><div class="score-label">已录音</div><div class="score-value">${item.recorded || 0} / ${(item.parts || []).length}</div></div>
      <div class="score-item"><div class="score-label">Part</div><div class="score-value">${(item.parts || []).length}</div></div>
      <div class="score-item"><div class="score-label">考试</div><div class="score-value">Speaking</div></div>
    </div>
    ${(item.parts || []).map((part) => `
      <article class="productive-review">
        <h3>${escapeHtml(part.title)}</h3>
        ${part.cueCard ? `<div class="writing-prompt">${escapeHtml(part.cueCard)}</div>` : ""}
        ${(part.questions || []).length ? `<ol>${part.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ol>` : ""}
        ${(part.prompts || []).length ? `<ul>${part.prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}</ul>` : ""}
        <p class="instructions">${part.recording ? "本次记录包含录音；浏览器安全限制下，刷新后录音文件本身不会写入 localStorage。" : "未录音"}</p>
        <strong>录音转文字</strong>
        <pre>${escapeHtml(part.transcript || "暂无转写文本。")}</pre>
      </article>
    `).join("")}
    <div id="aiFeedbackBox" class="ai-feedback" ${item.aiFeedback ? "" : "hidden"}>${item.aiFeedback ? renderAiFeedback(item.aiFeedback) : ""}</div>
    <div class="result-actions"><button class="secondary-button" id="aiScoreBtn" type="button">${item.aiFeedback ? "隐藏AI反馈" : "AI反馈"}</button></div>
  `;
  openResultDialog();
  document.getElementById("aiScoreBtn")?.addEventListener("click", (event) => generateProductiveFeedback(item, document.getElementById("aiFeedbackBox"), event.currentTarget));
}

function formatHistoryScore(item) {
  if (item.testType === "writing") return `${item.words || 0} words`;
  if (item.testType === "speaking") return `${item.recorded || 0} recordings`;
  return `${item.score} / ${item.total}`;
}

function formatHistoryMetric(item) {
  if (item.testType === "writing") return `${(item.tasks || []).length} tasks`;
  if (item.testType === "speaking") return `${(item.parts || []).length} parts`;
  return `${item.percent}%`;
}

async function generateAnswerExplanation(item, rowIndex, button) {
  const row = item.rows?.[rowIndex];
  const containerRow = document.getElementById(`aiExplainRow${rowIndex}`);
  const box = containerRow?.querySelector(".ai-feedback");
  if (!row || !box) return;
  if (row.aiExplanation && containerRow.hidden === false) {
    containerRow.hidden = true;
    if (button) button.textContent = "查看解析";
    return;
  }
  containerRow.hidden = false;
  box.hidden = false;
  if (row.aiExplanation) {
    box.innerHTML = renderSavedAnswerExplanation(row.aiExplanation);
    if (button) button.textContent = "隐藏解析";
    return;
  }
  box.textContent = item.testType === "listening" ? "正在准备听力原文和题目上下文..." : "正在准备文章、题目和错误上下文...";
  try {
    const payload = await buildAnswerExplanationPayload(item, row, box);
    box.textContent = "正在基于上下文生成解析...";
    const content = await requestTextCompletionWithFallback([
      {
        role: "system",
        content: "You are an IELTS tutor. Explain only from the supplied passage/listening transcript, question context, user answer, and correct answer. Never invent missing listening audio content or reading passage details. If transcript or passage is unavailable, say the explanation is limited. Be useful and specific: identify the exact clue, the trap, why the user's answer fails, and give concrete next-step advice. If language use is relevant, include grammar/vocabulary/logical-reasoning suggestions with exact replacements. Return only JSON with keys: evidence, explanation, whyUserWasWrong, howToAvoid, detailedSuggestions. detailedSuggestions should be an array of concrete items, each with issue, fix, example.",
      },
      {
        role: "user",
        content: JSON.stringify(payload, null, 2),
      },
    ], "explain");
    const parsed = extractJsonObject(content);
    row.aiExplanation = parsed;
    updateSavedHistoryItem(item);
    box.innerHTML = renderSavedAnswerExplanation(parsed);
    if (button) button.textContent = "隐藏解析";
  } catch (error) {
    box.textContent = `解析失败：${error.message || error}`;
  }
}

async function buildAnswerExplanationPayload(item, row, box) {
  const payload = {
    testType: item.testType,
    sectionTitle: row.sectionTitle,
    questionId: row.id,
    instructions: row.instructions,
    groupTitle: row.groupTitle || "",
    groupTemplate: row.groupTemplate || "",
    groupOptionBank: row.groupOptionBank || [],
    groupQuestions: row.groupQuestions || [],
    questionText: row.questionText,
    userAnswer: row.userAnswer,
    correctAnswer: row.correctAnswer,
    answerResult: {
      awarded: row.awarded,
      points: row.points,
    },
  };
  if (item.testType === "reading") {
    payload.readingPassage = row.readingPassage || "";
    payload.rule = "Use the readingPassage as evidence. Quote or paraphrase the exact relevant sentence/phrase when possible.";
  }
  if (item.testType === "listening") {
    payload.listeningPartTranscript = await getListeningTranscriptForExplanation(item, row, box);
    if (!payload.listeningPartTranscript) {
      throw new Error("听力解析已停止：没有可用的听力原文/转写文本。为避免瞎解析，请在导入时填写“听力原文 / 转写文本”。");
    }
    payload.rule = "Use the listeningPartTranscript as the required evidence. Do not invent audio content.";
  }
  return payload;
}

async function getListeningTranscriptForExplanation(item, row, box) {
  const importedTranscript = await getListeningTranscriptTextForHistory(item, box);
  if (isUsableListeningTranscript(importedTranscript)) return importedTranscript;
  return "";
}

async function getListeningTranscriptTextForHistory(item, box) {
  const saved = String(item?.listeningTranscriptText || "").trim();
  if (saved) return saved;
  const entry = findLibraryEntryForHistory(item);
  const embeddedText = getListeningTranscriptTextFromTest(entry?.test);
  if (isUsableListeningTranscript(embeddedText)) return embeddedText;
  const fileText = await loadListeningTranscriptFilesText(item, entry, box);
  if (isUsableListeningTranscript(fileText)) {
    item.listeningTranscriptText = fileText;
    updateSavedHistoryItem(item);
    return fileText;
  }
  return "";
}

async function loadListeningTranscriptFilesText(item, entry, box) {
  const refs = getListeningTranscriptFileRefs(item, entry?.test);
  if (!refs.length || !entry) return "";
  if (box) box.textContent = "正在读取已保存的听力原文文件...";
  const texts = [];
  for (const ref of refs) {
    const asset = findAssetForRef(entry.assets, ref);
    const blob = asset ? await getAssetBlob(asset) : null;
    if (!blob) continue;
    const text = await extractListeningTranscriptTextFromBlob(blob, ref, box);
    if (String(text || "").trim()) {
      texts.push(`--- LISTENING TRANSCRIPT FILE: ${ref} ---\n${text}`);
    }
  }
  return texts.join("\n\n").trim();
}

async function extractListeningTranscriptTextFromBlob(blob, ref, box) {
  const name = String(ref || blob?.name || "listening-transcript");
  const kind = getFileKind({ name, type: blob?.type || "" });
  if (kind === "pdf" || /\.pdf$/i.test(name)) {
    if (box) box.textContent = `第一次读取听力原文 PDF：正在提取 ${name} 的文本...`;
    const localText = await extractTextFromPdfBlob(blob, name).catch(() => "");
    if (String(localText || "").trim()) return localText;
    const provider = getAiProvider("ocr");
    if (getAiProviderKey("ocr") === "glm" && provider?.apiKey) {
      if (box) box.textContent = `本地 PDF 文本为空，正在用 GLM 解析听力原文：${name}...`;
      const file = blob instanceof File ? blob : new File([blob], name, { type: blob.type || "application/pdf" });
      const parsed = await requestOfficialFileParser({
        name,
        file,
        materialRole: "listening-transcript",
        kind: "pdf",
      }, provider);
      return parsed.fullText || "";
    }
    throw new Error(`听力原文 PDF 没有可提取文本：${name}。请换成可复制文字的 PDF，或上传 txt/md/srt/vtt 原文。`);
  }
  if (box) box.textContent = `正在读取听力原文文本：${name}...`;
  return blob.text();
}

async function extractTextFromPdfBlob(blob, name = "PDF") {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js 未加载，无法读取听力原文 PDF。");
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
  const buffer = await blob.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    throwIfAiAborted();
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str || "").join(" ").replace(/\s+/g, " ").trim();
    if (text) pages.push(`--- ${name} page ${pageNumber} ---\n${text}`);
  }
  return pages.join("\n\n").trim();
}

function getListeningTranscriptFileRefs(item, test) {
  return Array.from(new Set([
    ...ensureArray(item?.listeningTranscriptFiles),
    ...ensureArray(item?.analysisContext?.listeningTranscriptFiles),
    ...ensureArray(test?.listeningTranscriptFiles),
    ...ensureArray(test?.analysisContext?.listeningTranscriptFiles),
  ].map(String).filter(Boolean)));
}

function isUsableListeningTranscript(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  return !/(不能转写|转写为空|没有返回转写文本|未提供|没有找到|失败)/.test(text);
}

function findLibraryEntryForHistory(item) {
  if (!item) return null;
  if (item.libraryEntryId) {
    const entry = state.library.find((candidate) => candidate.id === item.libraryEntryId);
    if (entry) return entry;
  }
  return null;
}

function renderSavedAnswerExplanation(parsed) {
  return `
    ${parsed.evidence ? `<strong>依据</strong><p>${escapeHtml(parsed.evidence || "")}</p>` : ""}
    <strong>解析</strong>
    <p>${escapeHtml(parsed.explanation || "")}</p>
    <strong>为什么错</strong>
    <p>${escapeHtml(parsed.whyUserWasWrong || "")}</p>
    <strong>下次怎么避免</strong>
    <p>${escapeHtml(parsed.howToAvoid || "")}</p>
    ${Array.isArray(parsed.detailedSuggestions) && parsed.detailedSuggestions.length ? `
      <strong>具体修改建议</strong>
      <ul>${parsed.detailedSuggestions.map((item) => `
        <li>
          ${item.issue ? `<strong>${escapeHtml(item.issue)}</strong>` : ""}
          ${item.fix ? `<div>${escapeHtml(item.fix)}</div>` : ""}
          ${item.example ? `<div>${escapeHtml(item.example)}</div>` : ""}
        </li>
      `).join("")}</ul>
    ` : ""}
  `;
}

async function generateProductiveFeedback(result, box, button) {
  if (!box) return;
  if (button?.disabled) return;
  if (result.aiFeedback && box.hidden === false) {
    box.hidden = true;
    if (button) button.textContent = result.testType === "speaking" ? "查看AI反馈" : "查看AI评分";
    return;
  }
  box.hidden = false;
  if (result.aiFeedback) {
    box.innerHTML = renderAiFeedback(result.aiFeedback);
    if (button) button.textContent = result.testType === "speaking" ? "隐藏AI反馈" : "隐藏AI评分";
    return;
  }
  box.textContent = "正在生成 AI 反馈...";
  if (button) button.disabled = true;
  try {
    const isWriting = result.testType === "writing";
    const scoringResult = isWriting ? result : await transcribeSpeakingResult(result, box);
    const fluencyAssessment = isWriting ? null : await safeScoreSpeakingFluency(scoringResult, box);
    if (!isWriting) box.textContent = "正在生成 AI 反馈...";
    const content = await requestTextCompletionWithFallback([
      {
        role: "system",
        content: isWriting
          ? "You are a strict IELTS Writing examiner and revision coach. Respond in Chinese, but keep corrected English sentences in English. Score conservatively and make the feedback genuinely useful. Do not output markdown or prose outside JSON. Return only JSON with these exact keys: estimatedBand, taskAchievement, coherenceCohesion, lexicalResource, grammarRangeAccuracy, grammarCorrections, vocabularyReplacements, logicImprovements, rewrittenExamples, priorities. Each scoring criterion should be one short Chinese paragraph with concrete references to the student's answer. grammarCorrections must be an array of 3-6 objects with keys original, issue, corrected, explanation. vocabularyReplacements must be an array of 3-6 objects with keys original, replacement, reason. logicImprovements must be an array of 2-4 objects with keys issue, fix, example. rewrittenExamples must be an array of 2-4 objects with keys before, after, whyBetter. priorities must be an array of 3-5 concrete Chinese action items. Avoid vague comments like 'could be better'; name the exact sentence/word/logic problem."
          : "You are a strict IELTS Speaking examiner and coach. Score according to IELTS Speaking band descriptors: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation. The xfyun assessment is only acoustic reference data. Use only its fluencyScore as a reference for Fluency and Coherence, and pronunciationScore as a reference for Pronunciation. Ignore any other xfyun fields if present; do not display xfyun data directly and do not treat raw xfyun scores as IELTS bands. Return only JSON with keys: estimatedBand, fluencyCoherence, lexicalResource, grammarRangeAccuracy, pronunciation, grammarCorrections, vocabularyReplacements, logicImprovements, pronunciationNotes, priorities. Give concrete corrections and better expressions based on the transcript, the student's IELTS speaking task context, and those two acoustic references when useful.",
      },
      {
        role: "user",
        content: JSON.stringify(isWriting ? {
          testType: "writing",
          tasks: scoringResult.tasks || [],
        } : {
          testType: "speaking",
          parts: scoringResult.parts || [],
          fluencyAssessment,
          note: "Only fluencyScore and pronunciationScore from xfyun may be used as acoustic references. Ignore completeness, total, accuracy, integrity, or any other xfyun score. If no transcript is provided, explain that scoring is limited and evaluate only the available notes/transcript.",
        }, null, 2),
      },
    ], isWriting ? "writing" : "speaking");
    const parsed = extractJsonObject(content);
    const savedFeedback = parsed;
    result.aiFeedback = savedFeedback;
    result.fluencyAssessment = fluencyAssessment;
    if (!isWriting) result.parts = scoringResult.parts || result.parts;
    updateSavedHistoryItem(result);
    box.innerHTML = renderAiFeedback(savedFeedback);
    if (button) button.textContent = isWriting ? "隐藏AI评分" : "隐藏AI反馈";
  } catch (error) {
    box.textContent = `AI 反馈失败：${error.message || error}`;
  } finally {
    if (button) button.disabled = false;
  }
}

async function safeScoreSpeakingFluency(result, box) {
  try {
    return await scoreSpeakingFluency(result, box);
  } catch (error) {
    return [{
      error: true,
      message: `流利度 / 发音评分失败：${error.message || error}`,
    }];
  }
}

function renderAiFeedback(data) {
  const entries = Object.entries(data || {});
  if (!entries.length) return "<p>没有返回可显示的反馈。</p>";
  return entries.map(([key, value]) => {
    const body = formatFeedbackValue(value);
    return `<section><strong>${escapeHtml(formatFeedbackKey(key))}</strong>${body}</section>`;
  }).join("");
}

function formatFeedbackValue(value) {
  if (Array.isArray(value)) {
    return `<ul>${value.map((item) => `<li>${formatFeedbackInlineValue(item)}</li>`).join("")}</ul>`;
  }
  if (value && typeof value === "object") {
    return formatFeedbackObject(value);
  }
  return `<p>${escapeHtml(value)}</p>`;
}

function formatFeedbackInlineValue(value) {
  if (value && typeof value === "object") return formatFeedbackObject(value, true);
  return escapeHtml(value);
}

function formatFeedbackObject(value, inline = false) {
  const entries = Object.entries(value || {}).filter(([, itemValue]) => itemValue !== undefined && itemValue !== null && itemValue !== "");
  if (!entries.length) return "";
  const body = entries.map(([key, itemValue]) => {
    const label = formatFeedbackKey(key);
    const content = Array.isArray(itemValue)
      ? `<ul>${itemValue.map((child) => `<li>${formatFeedbackInlineValue(child)}</li>`).join("")}</ul>`
      : itemValue && typeof itemValue === "object"
        ? formatFeedbackObject(itemValue, true)
        : `<span>${escapeHtml(itemValue)}</span>`;
    return `<div class="feedback-field"><strong>${escapeHtml(label)}</strong>${content}</div>`;
  }).join("");
  return inline ? `<div class="feedback-object">${body}</div>` : `<div class="feedback-object">${body}</div>`;
}

function formatFeedbackKey(key) {
  const labels = {
    estimatedBand: "预估分数",
    taskAchievement: "任务完成",
    coherenceCohesion: "连贯与衔接",
    lexicalResource: "词汇",
    grammarRangeAccuracy: "语法",
    fluencyCoherence: "流利与连贯",
    pronunciation: "发音",
    grammarCorrections: "语法修改",
    vocabularyReplacements: "词汇替换",
    logicImprovements: "逻辑修改",
    rewrittenExamples: "改写示例",
    pronunciationNotes: "发音建议",
    priorities: "优先修改",
    original: "原文",
    wrong: "原文",
    before: "原文",
    issue: "问题",
    explanation: "原因",
    corrected: "修改后",
    replacement: "替换为",
    reason: "理由",
    fix: "怎么改",
    example: "示例",
    after: "修改后",
    whyBetter: "为什么更好",
    fluencyAssessment: "流利度 / 发音评分",
    provider: "服务",
    category: "评测类型",
    fluencyScore: "流利度分",
    pronunciationScore: "发音分",
  };
  if (labels[key]) return labels[key];
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function openResultDialog() {
  if (els.resultDialog.open) els.resultDialog.close();
  els.resultDialog.showModal();
}

function returnToSetup(skipConfirm = false) {
  if (state.fullMock.active && !skipConfirm) {
    alert("全科模考进行中，需要完成四个考试单元后才能退出。");
    return;
  }
  if (!els.exam.hidden && !state.submitted) {
    const confirmed = skipConfirm || confirm("当前考试还没有交卷，确定返回导入页吗？");
    if (!confirmed) return;
  }
  resetFullMockState();
  if (els.resultDialog.open) els.resultDialog.close();
  clearInterval(state.timerId);
  state.submitted = true;
  stopSpeakingRecording(false);
  revokeSpeakingRecordings();
  state.speakingRecordings = {};
  els.audioPlayer.pause();
  els.audioPlayer.removeAttribute("src");
  els.audioPlayer.dataset.audioKey = "";
  els.audioPanel.hidden = true;
  els.examHomeBtn.hidden = false;
  els.exam.hidden = true;
  els.setupPanel.hidden = false;
  renderLibrary();
  renderHistoryList();
}

function updateHighlightButton() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) {
    els.highlightBtn.hidden = true;
    return;
  }
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
    ? range.commonAncestorContainer.parentElement
    : range.commonAncestorContainer;
  if (!container || !container.closest(".highlightable")) {
    els.highlightBtn.hidden = true;
    return;
  }
  const rect = range.getBoundingClientRect();
  els.highlightBtn.textContent = getSelectedHighlight(range) ? "Remove" : "Highlight";
  els.highlightBtn.style.left = `${Math.min(window.innerWidth - 70, Math.max(8, rect.left))}px`;
  els.highlightBtn.style.top = `${Math.max(8, rect.top - 42)}px`;
  els.highlightBtn.hidden = false;
}

function highlightSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const selectedHighlight = getSelectedHighlight(range);
  if (selectedHighlight) {
    unwrapHighlight(selectedHighlight);
    selection.removeAllRanges();
    els.highlightBtn.hidden = true;
    return;
  }
  const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
    ? range.commonAncestorContainer.parentElement
    : range.commonAncestorContainer;
  if (!container || !container.closest(".highlightable")) return;
  const mark = document.createElement("mark");
  mark.className = "user-highlight";
  try {
    range.surroundContents(mark);
  } catch {
    mark.appendChild(range.extractContents());
    range.insertNode(mark);
  }
  selection.removeAllRanges();
  els.highlightBtn.hidden = true;
}

function handleHighlightClick(event) {
  const mark = event.target.closest?.("mark.user-highlight");
  if (!mark) return;
  unwrapHighlight(mark);
  els.highlightBtn.hidden = true;
}

function getSelectedHighlight(range) {
  const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
    ? range.commonAncestorContainer.parentElement
    : range.commonAncestorContainer;
  if (!container) return null;
  const closest = container.closest?.("mark.user-highlight");
  if (closest) return closest;
  const highlights = document.querySelectorAll("mark.user-highlight");
  return Array.from(highlights).find((mark) => range.intersectsNode(mark)) || null;
}

function unwrapHighlight(mark) {
  const parent = mark.parentNode;
  if (!parent) return;
  while (mark.firstChild) {
    parent.insertBefore(mark.firstChild, mark);
  }
  mark.remove();
  parent.normalize();
}

function resolveAssetUrl(ref) {
  if (!ref) return "";
  const key = String(ref);
  if (/^data:image\//i.test(key)) return key;
  const currentAsset = findAssetForRef(state.assets, key);
  if (currentAsset?.url) return currentAsset.url;
  if (currentAsset?.dataUrl) return currentAsset.dataUrl;
  const entry = findCurrentLibraryEntry();
  const entryAsset = entry ? findAssetForRef(entry.assets, key) : null;
  return entryAsset?.url || entryAsset?.dataUrl || "";
}

function findCurrentLibraryEntry() {
  if (!state.currentLibraryEntryId) return null;
  return state.library.find((entry) => entry.id === state.currentLibraryEntryId) || null;
}

function formatText(text) {
  return escapeHtml(text).replace(/\n{2,}/g, "</p><p>").replace(/^/, "<p>").replace(/$/, "</p>");
}

function formatClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function selectorValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

setupGlobalErrorHandling();
init().catch((error) => {
  console.error("Application initialization failed:", error);
  showToast("应用初始化失败，请刷新页面后重试。", "error");
});

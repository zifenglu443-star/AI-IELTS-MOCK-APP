const fs = require("fs");
const path = require("path");

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node tools/validate-exams.js <exam.json> [...]");
  process.exit(1);
}

let failed = false;
for (const file of files) {
  try {
    const test = JSON.parse(fs.readFileSync(file, "utf8"));
    const report = validateExam(test);
    const detail = report.ids.length ? `${report.points} points, ${report.ids.length} ids` : `${report.sections} sections`;
    console.log(`${file}: OK (${report.type || test.testType}, ${detail})`);
  } catch (error) {
    failed = true;
    console.error(`${file}: FAIL`);
    console.error(`  ${error.message}`);
  }
}

if (failed) process.exit(1);

function validateExam(test) {
  if (!test || typeof test !== "object") throw new Error("root must be an object");
  if (!test.testType && (test.part1 || test.part2 || test.part3)) return validateSpeakingBank(test);
  if (!["listening", "reading", "writing", "speaking"].includes(test.testType)) throw new Error("testType must be listening, reading, writing, or speaking");
  if (!Array.isArray(test.sections) || !test.sections.length) throw new Error("sections are required");
  if (test.testType === "writing") return validateWriting(test);
  if (test.testType === "speaking") return validateSpeaking(test);

  const ids = [];
  let points = 0;
  const seen = new Set();

  test.sections.forEach((section, sectionIndex) => {
    if (!Array.isArray(section.groups) || !section.groups.length) {
      throw new Error(`section ${sectionIndex + 1} has no groups`);
    }
    section.groups.forEach((group, groupIndex) => {
      if (!["blank", "single_choice", "multi_choice"].includes(group.questionType)) {
        throw new Error(`unsupported questionType in section ${sectionIndex + 1}, group ${groupIndex + 1}`);
      }
      if (!Array.isArray(group.questions) || !group.questions.length) {
        throw new Error(`section ${sectionIndex + 1}, group ${groupIndex + 1} has no questions`);
      }
      validateTemplate(group, sectionIndex, groupIndex);
      group.questions.forEach((question) => {
        const id = String(question.id ?? "").trim();
        if (!id) throw new Error(`section ${sectionIndex + 1}, group ${groupIndex + 1} has a question without id`);
        if (seen.has(id)) throw new Error(`duplicate id ${id}`);
        seen.add(id);
        ids.push(...expandId(id));
        points += questionPoints(question, group);
        if (!Array.isArray(question.answer) || !question.answer.length) throw new Error(`question ${id} has no answer`);
        if (group.questionType !== "blank" && !Array.isArray(question.options)) throw new Error(`choice question ${id} has no options`);
        const hasText = String(question.text || "").trim();
        const hasTemplate = String(group.template || "").trim();
        if (group.questionType !== "blank" && !hasText) throw new Error(`choice question ${id} has no stem`);
        if (group.questionType === "blank" && !hasText && !hasTemplate) throw new Error(`blank question ${id} has no text or template`);
      });
    });
  });

  if (points > 40) {
    throw new Error(`total points ${points} exceed the IELTS maximum of 40`);
  }

  if (points === 40) {
    const covered = new Set(ids);
    const missing = [];
    for (let id = 1; id <= 40; id += 1) {
      if (!covered.has(String(id))) missing.push(id);
    }
    if (missing.length) throw new Error(`missing question numbers: ${missing.join(", ")}`);
  }

  return { points, ids };
}

function validateWriting(test) {
  test.sections.forEach((section, index) => {
    if (!String(section.title || "").trim()) throw new Error(`writing section ${index + 1} has no title`);
    if (!String(section.prompt || "").trim()) throw new Error(`writing section ${index + 1} has no prompt`);
  });
  return { points: 0, ids: [], sections: test.sections.length };
}

function validateSpeaking(test) {
  test.sections.forEach((section, index) => {
    const hasQuestions = Array.isArray(section.questions) && section.questions.some((item) => String(item || "").trim());
    const hasCueCard = String(section.cueCard || "").trim();
    if (!String(section.title || "").trim()) throw new Error(`speaking section ${index + 1} has no title`);
    if (!hasQuestions && !hasCueCard) throw new Error(`speaking section ${index + 1} has no questions or cueCard`);
  });
  return { points: 0, ids: [], sections: test.sections.length };
}

function validateSpeakingBank(bank) {
  const part1 = Array.isArray(bank.part1) ? bank.part1 : [];
  const part2 = Array.isArray(bank.part2) ? bank.part2 : [];
  const part3 = Array.isArray(bank.part3) ? bank.part3 : [];
  if (!part1.length) throw new Error("speaking bank has no part1");
  if (!part2.length) throw new Error("speaking bank has no part2");
  if (!part3.length) throw new Error("speaking bank has no part3");
  return { type: "speaking-bank", points: 0, ids: [], sections: part1.length + part2.length + part3.length };
}

function validateTemplate(group, sectionIndex, groupIndex) {
  if (!String(group.template || "").trim()) return;
  const placeholders = extractPlaceholders(group.template);
  const questionIds = new Set(group.questions.map((question) => String(question.id)));
  const missing = group.questions
    .filter((question) => !placeholders.has(String(question.id)))
    .map((question) => question.id);
  if (group.questionType === "blank" && missing.length) {
    throw new Error(`section ${sectionIndex + 1}, group ${groupIndex + 1} template missing placeholders: ${missing.join(", ")}`);
  }
  const unknown = Array.from(placeholders).filter((id) => !questionIds.has(id));
  if (unknown.length) {
    throw new Error(`section ${sectionIndex + 1}, group ${groupIndex + 1} template has unknown placeholders: ${unknown.join(", ")}`);
  }
}

function extractPlaceholders(template) {
  const ids = new Set();
  const pattern = /(?:\{\{\s*([^}]+?)\s*\}\}|\[\[\s*([^\]]+?)\s*\]\])/g;
  let match;
  while ((match = pattern.exec(String(template || ""))) !== null) ids.add(String(match[1] || match[2] || "").trim());
  return ids;
}

function questionPoints(question, group) {
  const explicit = Number(question.points);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const range = expandId(question.id).length;
  if (range > 1) return range;
  const maxChoices = Number(question.maxChoices || group.maxChoices);
  if (group.questionType === "multi_choice" && group.questions.length === 1 && Number.isFinite(maxChoices) && maxChoices > 1) return maxChoices;
  return 1;
}

function expandId(id) {
  const text = String(id ?? "").trim();
  const range = text.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (!range) return /^\d+$/.test(text) ? [text] : [];
  const start = Number(range[1]);
  const end = Number(range[2]);
  if (!Number.isInteger(start) || !Number.isInteger(end) || end < start || end - start > 10) return [];
  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index));
}

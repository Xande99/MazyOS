#!/usr/bin/env node
// PostToolUse hook (Write|Edit): mantém saidas/outros/arsenal-skills.html em dia
// toda vez que um .claude/skills/*/SKILL.md for criado ou editado.
// Não chama LLM nem API — só parsing de texto do frontmatter YAML.

'use strict';
const fs = require('fs');
const path = require('path');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return '';
  }
}

function stripQuotes(s) {
  return s.replace(/^["']|["']$/g, '');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ensureNovasSection(html) {
  if (html.includes('id="s-novas"')) return html;
  const section = [
    '',
    '<section class="sector" id="s-novas">',
    '  <div class="sector-head"><h2>Novas skills (não classificadas)</h2><span class="sector-count">0 skills</span></div>',
    '  <div class="skills"></div>',
    '</section>',
    ''
  ].join('\n');
  return html.replace('</main>', section + '</main>');
}

function isAlreadyClassified(html, name) {
  const withoutNovas = html.replace(/<section class="sector" id="s-novas">[\s\S]*?<\/section>/, '');
  const re = new RegExp('<div class="skill-name">' + escapeRegex(escapeHtml(name)) + '<\\/div>');
  return re.test(withoutNovas);
}

function upsertSkillRow(html, name, description) {
  const rowHtml =
    '<div class="skill-row" data-skill="' + escapeHtml(name) + '"><div class="skill-name">' +
    escapeHtml(name) + '</div><div class="skill-desc">' + escapeHtml(description) + '</div></div>';

  const sectionRegex = /(<section class="sector" id="s-novas">[\s\S]*?<div class="skills">)([\s\S]*?)(<\/div>\s*<\/section>)/;
  const sectionMatch = html.match(sectionRegex);
  if (!sectionMatch) return html;

  const rowRegex = new RegExp(
    '<div class="skill-row" data-skill="' + escapeRegex(escapeHtml(name)) + '">[\\s\\S]*?<\\/div>\\s*<\\/div>',
    'i'
  );

  let inner = sectionMatch[2];
  if (rowRegex.test(inner)) {
    inner = inner.replace(rowRegex, rowHtml);
  } else {
    inner = inner + '\n    ' + rowHtml;
  }

  return html.replace(sectionMatch[0], sectionMatch[1] + inner + sectionMatch[3]);
}

function updateCounts(html) {
  const totalRows = (html.match(/class="skill-row"/g) || []).length;

  const novasMatch = html.match(/<section class="sector" id="s-novas">[\s\S]*?<\/section>/);
  const novasCount = novasMatch ? (novasMatch[0].match(/class="skill-row"/g) || []).length : 0;
  const novasLabel = novasCount === 1 ? 'skill' : 'skills';

  html = html.replace(
    /(<section class="sector" id="s-novas">\s*<div class="sector-head"><h2>Novas skills \(não classificadas\)<\/h2><span class="sector-count">)\d+\s*skills?(<\/span>)/,
    '$1' + novasCount + ' ' + novasLabel + '$2'
  );

  html = html.replace(
    /(<b id="visibleCount">)\d+(<\/b>\s*\/\s*)\d+(\s*exibidas)/,
    '$1' + totalRows + '$2' + totalRows + '$3'
  );

  html = html.replace(
    /(<p class="subtitle">)\d+( skills em)/,
    '$1' + totalRows + '$2'
  );

  return html;
}

function main() {
  const raw = readStdin();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    process.exit(0);
  }

  const filePath =
    (payload.tool_input && payload.tool_input.file_path) ||
    (payload.tool_response && payload.tool_response.filePath);
  if (!filePath) process.exit(0);

  const normalized = filePath.replace(/\\/g, '/');
  const skillMatch = normalized.match(/\.claude\/skills\/([^/]+)\/SKILL\.md$/i);
  if (!skillMatch) process.exit(0);

  const folderSlug = skillMatch[1];

  let skillMd;
  try {
    skillMd = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    process.exit(0);
  }

  const fmMatch = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let name = folderSlug;
  let description = '';
  if (fmMatch) {
    const fm = fmMatch[1];
    const nameMatch = fm.match(/^name:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    if (nameMatch) name = stripQuotes(nameMatch[1].trim());
    if (descMatch) description = stripQuotes(descMatch[1].trim());
  }
  if (!description) {
    description = '(sem descrição no frontmatter — classifique manualmente)';
  }

  // projeto = dois níveis acima deste script (<root>/.claude/hooks/atualizar-arsenal.js)
  const projectRoot = path.resolve(__dirname, '..', '..');
  const arsenalPath = path.join(projectRoot, 'saidas', 'outros', 'arsenal-skills.html');
  if (!fs.existsSync(arsenalPath)) process.exit(0);

  let html = fs.readFileSync(arsenalPath, 'utf8');

  if (isAlreadyClassified(html, name)) {
    // já está classificada em algum setor — não mexe pra não sobrescrever a curadoria manual.
    process.exit(0);
  }

  html = ensureNovasSection(html);
  html = upsertSkillRow(html, name, description);
  html = updateCounts(html);

  fs.writeFileSync(arsenalPath, html, 'utf8');
  console.log(JSON.stringify({ suppressOutput: true }));
}

main();

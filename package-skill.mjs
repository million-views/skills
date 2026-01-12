#!/usr/bin/env node

/**
 * Package Claude Skills for Web Upload
 * Usage: ./package-skill.mjs <skill-name>
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message, color = 'reset') {
  const colors = { reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m' };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const skillName = process.argv[2];

if (!skillName) {
  log('Usage: ./package-skill.mjs <skill-name>', 'yellow');
  log('\nExample: ./package-skill.mjs reactive-md', 'blue');

  // Show available skills
  try {
    const marketplace = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'));
    log('\nAvailable skills:', 'green');
    marketplace.plugins?.forEach(p => log(`  ${p.name}`, 'blue'));
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  process.exit(1);
}

// Read marketplace
let marketplace;
try {
  marketplace = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'));
} catch (e) {
  log(`Error: ${e.message}`, 'red');
  process.exit(1);
}

// Find skill
const skill = marketplace.plugins?.find(p => p.name === skillName);
if (!skill) {
  log(`Skill "${skillName}" not found`, 'red');
  log('\nAvailable skills:', 'yellow');
  marketplace.plugins?.forEach(p => log(`  ${p.name}`, 'blue'));
  process.exit(1);
}

// Get skill path
const skillPath = typeof skill.source === 'string' ? skill.source : null;
if (!skillPath) {
  log('Remote skills must be cloned locally first', 'red');
  process.exit(1);
}

// Verify skill exists
if (!fs.existsSync(skillPath) || !fs.existsSync(`${skillPath}/SKILL.md`)) {
  log(`Skill directory or SKILL.md not found: ${skillPath}`, 'red');
  process.exit(1);
}

// Create dist directory
fs.mkdirSync('dist', { recursive: true });

// Package skill
log(`Packaging ${skillName}...`, 'green');
try {
  execSync(`cd "${path.dirname(skillPath)}" && zip -r "${path.resolve('dist', skillName)}.zip" "${path.basename(skillPath)}" -q`);
  log(`✓ Created dist/${skillName}.zip`, 'green');
  log('\nUpload at: claude.ai → Settings → Skills → Upload skill', 'blue');
} catch (e) {
  log(`Packaging failed: ${e.message}`, 'red');
  process.exit(1);
}

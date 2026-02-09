#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

/*
Usage:
  node scripts/convert-webp.cjs <input1> [input2 ...] [--out <dir>] [--quality <0-100>]

Notes:
  - If --out is omitted, outputs alongside each input with .webp extension.
  - Accepts multiple input files.
  - Creates output directories as needed.
*/

async function convertOne(inputPath, outDir, quality) {
  const absIn = path.resolve(inputPath);
  if (!fs.existsSync(absIn)) {
    console.error('Source file not found:', absIn);
    return false;
  }
  const base = path.basename(absIn, path.extname(absIn));
  const targetDir = outDir ? path.resolve(outDir) : path.dirname(absIn);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const outWebp = path.join(targetDir, `${base}.webp`);
  try {
    await sharp(absIn).webp({ quality }).toFile(outWebp);
    console.log('Converted:', absIn, '→', outWebp);
    return true;
  } catch (err) {
    console.error('Conversion failed for', absIn, err);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(
      'Usage: node scripts/convert-webp.cjs <input1> [input2 ...] [--out <dir>] [--quality <0-100>]'
    );
    process.exit(1);
  }

  let outDir = null;
  let quality = 82;
  const inputs = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--out') {
      outDir = args[++i];
    } else if (a === '--quality') {
      quality = parseInt(args[++i], 10) || quality;
    } else {
      inputs.push(a);
    }
  }

  if (inputs.length === 0) {
    console.error('No input files provided.');
    process.exit(1);
  }

  let okCount = 0;
  for (const input of inputs) {
    // Allow comma-separated inputs
    const list = input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const item of list) {
      // Skip non-image files
      const ext = path.extname(item).toLowerCase();
      if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
        console.warn('Skipping non-image:', item);
        continue;
      }
      const ok = await convertOne(item, outDir, quality);
      if (ok) okCount++;
    }
  }

  if (okCount === 0) process.exit(1);
}

main();

#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, '../src/assets/png/home/astronaut.png');
const outputDirectory = path.resolve(__dirname, '../src/assets/webp/home');

const variants = [
  {
    name: 'astronaut-mobile.webp',
    width: 500,
    height: 346,
    quality: 78
  },
  {
    name: 'astronaut-tablet.webp',
    width: 1100,
    height: 762,
    quality: 80
  },
  {
    name: 'astronaut-desktop.webp',
    width: 1600,
    height: 1108,
    quality: 82
  }
];

function ensureDependencies() {
  if (!fs.existsSync(source)) {
    console.error(`Missing source image: ${source}`);
    process.exit(1);
  }

  const probe = spawnSync('cwebp', ['-version'], { stdio: 'ignore' });
  if (probe.status !== 0) {
    console.error('cwebp is not available in PATH.');
    process.exit(1);
  }

  fs.mkdirSync(outputDirectory, { recursive: true });
}

function convertVariant({ name, width, height, quality }) {
  const output = path.join(outputDirectory, name);
  const result = spawnSync(
    'cwebp',
    [
      '-q',
      String(quality),
      '-resize',
      String(width),
      String(height),
      source,
      '-o',
      output
    ],
    { stdio: 'inherit' }
  );

  if (result.status !== 0) {
    console.error(`Failed converting ${name}.`);
    process.exit(result.status || 1);
  }
}

function main() {
  ensureDependencies();
  for (const variant of variants) {
    convertVariant(variant);
  }
}

main();

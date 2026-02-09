#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function convert(srcPath, outPath) {
  await sharp(srcPath).webp({ quality: 82 }).toFile(outPath);
  console.log('Converted:', outPath);
}

async function main() {
  const pairs = [
    {
      src: path.resolve(
        __dirname,
        '../src/assets/png/home/astronaut-rocks-small.png'
      ),
      out: path.resolve(
        __dirname,
        '../src/assets/webp/home/astronaut-rocks-small.webp'
      )
    },
    {
      src: path.resolve(
        __dirname,
        '../src/assets/png/home/astronaut-rocks-large.png'
      ),
      out: path.resolve(
        __dirname,
        '../src/assets/webp/home/astronaut-rocks-large.webp'
      )
    }
  ];

  for (const { src, out } of pairs) {
    if (!fs.existsSync(src)) {
      console.error('Missing source:', src);
      process.exit(1);
    }
    const dir = path.dirname(out);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    try {
      await convert(src, out);
    } catch (e) {
      console.error('Failed converting', src, e);
      process.exit(1);
    }
  }
}

main();

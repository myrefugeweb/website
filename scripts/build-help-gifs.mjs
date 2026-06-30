import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { PNG } from 'pngjs';
import gifenc from 'gifenc';

const { GIFEncoder, quantize, applyPalette } = gifenc;

/**
 * Builds animated GIFs for Help Center topics from sequences of PNG frames.
 *
 * Frames live in:  scripts/gif-frames/<topic-id>/*.png  (sorted by filename)
 * Output goes to:  public/help/screenshots/<topic-id>.gif
 *
 * Frames may differ slightly in size; each is centered on a white canvas
 * sized to the largest frame so the GIF stays stable and crisp.
 */

const framesRoot = path.resolve('scripts/gif-frames');
const outputDir = path.resolve('public/help/screenshots');

// Per-topic timing (ms). Default applies when a topic is not listed.
const DEFAULT_DELAY = 1400;
const LAST_FRAME_DELAY = 2200;
const perTopicDelay = {
  'edit-text': 1500,
  'change-layout': 1600,
  'staging-mode': 1500,
  'edit-mode-toggle': 1300,
};

// Optional per-topic crop (in source-frame pixels) applied before normalization.
// Lets us capture consistent full-viewport frames but focus the final GIF.
const perTopicCrop = {
  'edit-mode-toggle': { x: 96, y: 196, width: 1568, height: 150 },
  'edit-text': { x: 0, y: 300, width: 1778, height: 760 },
  'change-layout': { x: 0, y: 56, width: 1762, height: 1012 },
};

const onlyTopic = process.argv[2];

await fs.mkdir(outputDir, { recursive: true });

let topicDirs;
try {
  topicDirs = (await fs.readdir(framesRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
} catch {
  console.error(`No frames directory found at ${framesRoot}.`);
  console.error('Create scripts/gif-frames/<topic-id>/ and add numbered PNG frames.');
  process.exit(1);
}

if (onlyTopic) {
  topicDirs = topicDirs.filter((name) => name === onlyTopic);
}

if (topicDirs.length === 0) {
  console.log('No topic frame folders to process.');
  process.exit(0);
}

for (const topicId of topicDirs) {
  await buildGif(topicId);
}

async function buildGif(topicId) {
  const dir = path.join(framesRoot, topicId);
  const files = (await fs.readdir(dir))
    .filter((name) => name.toLowerCase().endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.log(`- ${topicId}: no PNG frames, skipped`);
    return;
  }

  const crop = perTopicCrop[topicId];
  const frames = [];
  for (const file of files) {
    const buffer = await fs.readFile(path.join(dir, file));
    const png = PNG.sync.read(buffer);
    frames.push(crop ? cropFrame(png, crop) : png);
  }

  const maxW = Math.max(...frames.map((f) => f.width));
  const maxH = Math.max(...frames.map((f) => f.height));

  const gif = GIFEncoder();
  const delay = perTopicDelay[topicId] || DEFAULT_DELAY;

  frames.forEach((frame, index) => {
    const rgba = centerOnCanvas(frame, maxW, maxH);
    const palette = quantize(rgba, 256);
    const indexed = applyPalette(rgba, palette);
    const frameDelay = index === frames.length - 1 ? LAST_FRAME_DELAY : delay;
    gif.writeFrame(indexed, maxW, maxH, { palette, delay: frameDelay });
  });

  gif.finish();

  const outPath = path.join(outputDir, `${topicId}.gif`);
  await fs.writeFile(outPath, Buffer.from(gif.bytes()));
  const kb = ((await fs.stat(outPath)).size / 1024).toFixed(0);
  console.log(`✓ ${topicId}: ${frames.length} frames -> ${maxW}x${maxH}, ${kb} KB`);
}

/** Returns a new PNG cropped to the given rect, clamped to source bounds. */
function cropFrame(png, rect) {
  const x = Math.max(0, Math.min(rect.x, png.width - 1));
  const y = Math.max(0, Math.min(rect.y, png.height - 1));
  const width = Math.min(rect.width, png.width - x);
  const height = Math.min(rect.height, png.height - y);
  const out = new PNG({ width, height });

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const src = ((y + row) * png.width + (x + col)) * 4;
      const dst = (row * width + col) * 4;
      out.data[dst] = png.data[src];
      out.data[dst + 1] = png.data[src + 1];
      out.data[dst + 2] = png.data[src + 2];
      out.data[dst + 3] = png.data[src + 3];
    }
  }

  return out;
}

/** Returns a Uint8Array (RGBA) of size w*h with the frame centered on white. */
function centerOnCanvas(frame, w, h) {
  const out = new Uint8Array(w * h * 4).fill(255);
  const offsetX = Math.floor((w - frame.width) / 2);
  const offsetY = Math.floor((h - frame.height) / 2);

  for (let y = 0; y < frame.height; y++) {
    for (let x = 0; x < frame.width; x++) {
      const src = (y * frame.width + x) * 4;
      const dx = x + offsetX;
      const dy = y + offsetY;
      const dst = (dy * w + dx) * 4;

      const alpha = frame.data[src + 3] / 255;
      // Composite over white so transparent PNG areas stay clean.
      out[dst] = Math.round(frame.data[src] * alpha + 255 * (1 - alpha));
      out[dst + 1] = Math.round(frame.data[src + 1] * alpha + 255 * (1 - alpha));
      out[dst + 2] = Math.round(frame.data[src + 2] * alpha + 255 * (1 - alpha));
      out[dst + 3] = 255;
    }
  }

  return out;
}

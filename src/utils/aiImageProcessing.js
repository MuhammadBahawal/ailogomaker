const jpeg = require('jpeg-js');
const UPNG = require('upng-js');
const {fromByteArray, toByteArray} = require('base64-js');

const MIME_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
};

const MAX_INPUT_SIZE = 1024;
const MAX_SEGMENTATION_SIZE = 416;
const TRANSPARENT_ALPHA = 16;
const COLOR_BUCKET_SIZE = 20;

const clamp = (value, min = 0, max = 255) => {
  return Math.min(max, Math.max(min, value));
};

const clampNumber = (value, min, max) => {
  return Math.min(max, Math.max(min, value));
};

const nextFrame = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
};

const normalizeMimeType = (type, fileName) => {
  const normalizedType = (type ?? '').toLowerCase();
  const normalizedName = (fileName ?? '').toLowerCase();

  if (normalizedType.includes('png') || normalizedName.endsWith('.png')) {
    return MIME_TYPES.png;
  }

  return MIME_TYPES.jpeg;
};

const getArrayBuffer = typedArray => {
  return typedArray.buffer.slice(
    typedArray.byteOffset,
    typedArray.byteOffset + typedArray.byteLength,
  );
};

const getPixelIndex = (x, y, width) => {
  return y * width + x;
};

const getOffset = pixelIndex => {
  return pixelIndex * 4;
};

const getColorDistanceScore = (red, green, blue, reference) => {
  const redDelta = red - reference.red;
  const greenDelta = green - reference.green;
  const blueDelta = blue - reference.blue;

  return (
    redDelta * redDelta * 0.3 +
    greenDelta * greenDelta * 0.59 +
    blueDelta * blueDelta * 0.11
  );
};

const getPaletteDistanceScore = (pixels, offset, palette) => {
  let bestScore = Number.POSITIVE_INFINITY;
  let bestColor = palette[0];

  for (let index = 0; index < palette.length; index += 1) {
    const candidate = palette[index];
    const score = getColorDistanceScore(
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2],
      candidate,
    );

    if (score < bestScore) {
      bestScore = score;
      bestColor = candidate;
    }
  }

  return {
    color: bestColor,
    score: bestScore,
  };
};

const getPixelDistanceScore = (pixels, leftOffset, rightOffset) => {
  const redDelta = pixels[leftOffset] - pixels[rightOffset];
  const greenDelta = pixels[leftOffset + 1] - pixels[rightOffset + 1];
  const blueDelta = pixels[leftOffset + 2] - pixels[rightOffset + 2];

  return (
    redDelta * redDelta * 0.3 +
    greenDelta * greenDelta * 0.59 +
    blueDelta * blueDelta * 0.11
  );
};

const getLuma = (pixels, offset) => {
  return (
    pixels[offset] * 0.299 +
    pixels[offset + 1] * 0.587 +
    pixels[offset + 2] * 0.114
  );
};

const decodeImageAsset = asset => {
  if (!asset?.base64) {
    throw new Error('Image base64 data was not provided by the picker.');
  }

  const mimeType = normalizeMimeType(asset.type, asset.fileName);
  const bytes = toByteArray(asset.base64);

  if (mimeType === MIME_TYPES.png) {
    const decodedPng = UPNG.decode(getArrayBuffer(bytes));
    const rgbaFrame = UPNG.toRGBA8(decodedPng)[0];

    return {
      width: decodedPng.width,
      height: decodedPng.height,
      pixels: new Uint8ClampedArray(rgbaFrame),
    };
  }

  const decodedJpeg = jpeg.decode(bytes, {
    tolerantDecoding: true,
    useTArray: true,
  });

  return {
    width: decodedJpeg.width,
    height: decodedJpeg.height,
    pixels: new Uint8ClampedArray(decodedJpeg.data),
  };
};

const encodePngDataUri = (pixels, width, height) => {
  const pngBuffer = UPNG.encode([getArrayBuffer(pixels)], width, height, 0);
  const base64 = fromByteArray(new Uint8Array(pngBuffer));

  return `data:image/png;base64,${base64}`;
};

const resizeRgbaImage = (pixels, width, height, maxDimension) => {
  if (Math.max(width, height) <= maxDimension) {
    return {
      pixels: new Uint8ClampedArray(pixels),
      width,
      height,
    };
  }

  const scale = maxDimension / Math.max(width, height);
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  const output = new Uint8ClampedArray(targetWidth * targetHeight * 4);
  const xRatio = width / targetWidth;
  const yRatio = height / targetHeight;

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = clampNumber((y + 0.5) * yRatio - 0.5, 0, height - 1);
    const topY = Math.floor(sourceY);
    const bottomY = Math.min(height - 1, topY + 1);
    const yWeight = sourceY - topY;

    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = clampNumber((x + 0.5) * xRatio - 0.5, 0, width - 1);
      const leftX = Math.floor(sourceX);
      const rightX = Math.min(width - 1, leftX + 1);
      const xWeight = sourceX - leftX;
      const topLeftOffset = getOffset(getPixelIndex(leftX, topY, width));
      const topRightOffset = getOffset(getPixelIndex(rightX, topY, width));
      const bottomLeftOffset = getOffset(getPixelIndex(leftX, bottomY, width));
      const bottomRightOffset = getOffset(getPixelIndex(rightX, bottomY, width));
      const outputOffset = getOffset(getPixelIndex(x, y, targetWidth));

      for (let channel = 0; channel < 4; channel += 1) {
        const topValue =
          pixels[topLeftOffset + channel] * (1 - xWeight) +
          pixels[topRightOffset + channel] * xWeight;
        const bottomValue =
          pixels[bottomLeftOffset + channel] * (1 - xWeight) +
          pixels[bottomRightOffset + channel] * xWeight;

        output[outputOffset + channel] = Math.round(
          topValue * (1 - yWeight) + bottomValue * yWeight,
        );
      }
    }
  }

  return {
    pixels: output,
    width: targetWidth,
    height: targetHeight,
  };
};

const resizeAlphaMask = (alphaMask, width, height, targetWidth, targetHeight) => {
  if (width === targetWidth && height === targetHeight) {
    return new Uint8ClampedArray(alphaMask);
  }

  const output = new Uint8ClampedArray(targetWidth * targetHeight);
  const xRatio = width / targetWidth;
  const yRatio = height / targetHeight;

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = clampNumber((y + 0.5) * yRatio - 0.5, 0, height - 1);
    const topY = Math.floor(sourceY);
    const bottomY = Math.min(height - 1, topY + 1);
    const yWeight = sourceY - topY;

    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = clampNumber((x + 0.5) * xRatio - 0.5, 0, width - 1);
      const leftX = Math.floor(sourceX);
      const rightX = Math.min(width - 1, leftX + 1);
      const xWeight = sourceX - leftX;
      const topLeft = alphaMask[getPixelIndex(leftX, topY, width)];
      const topRight = alphaMask[getPixelIndex(rightX, topY, width)];
      const bottomLeft = alphaMask[getPixelIndex(leftX, bottomY, width)];
      const bottomRight = alphaMask[getPixelIndex(rightX, bottomY, width)];
      const topValue = topLeft * (1 - xWeight) + topRight * xWeight;
      const bottomValue = bottomLeft * (1 - xWeight) + bottomRight * xWeight;

      output[getPixelIndex(x, y, targetWidth)] = Math.round(
        topValue * (1 - yWeight) + bottomValue * yWeight,
      );
    }
  }

  return output;
};

const collectEdgeSamples = (pixels, width, height) => {
  const sampleDepth = clampNumber(Math.round(Math.min(width, height) * 0.035), 2, 12);
  const stride = clampNumber(Math.round(Math.min(width, height) / 140), 1, 4);
  const samples = [];
  const addSample = (x, y) => {
    const offset = getOffset(getPixelIndex(x, y, width));

    if (pixels[offset + 3] <= TRANSPARENT_ALPHA) {
      return;
    }

    samples.push([
      pixels[offset],
      pixels[offset + 1],
      pixels[offset + 2],
    ]);
  };

  for (let x = 0; x < width; x += stride) {
    for (let y = 0; y < sampleDepth; y += stride) {
      addSample(x, y);
      addSample(x, height - 1 - y);
    }
  }

  for (let y = sampleDepth; y < height - sampleDepth; y += stride) {
    for (let x = 0; x < sampleDepth; x += stride) {
      addSample(x, y);
      addSample(width - 1 - x, y);
    }
  }

  return samples;
};

const estimateBackgroundPalette = (pixels, width, height) => {
  const samples = collectEdgeSamples(pixels, width, height);

  if (samples.length === 0) {
    return {
      deviation: 18,
      palette: [
        {
          red: 255,
          green: 255,
          blue: 255,
        },
      ],
    };
  }

  const buckets = new Map();

  for (let index = 0; index < samples.length; index += 1) {
    const [red, green, blue] = samples[index];
    const key = [
      Math.round(red / COLOR_BUCKET_SIZE),
      Math.round(green / COLOR_BUCKET_SIZE),
      Math.round(blue / COLOR_BUCKET_SIZE),
    ].join(':');
    const bucket = buckets.get(key);

    if (bucket) {
      bucket.count += 1;
      bucket.red += red;
      bucket.green += green;
      bucket.blue += blue;
      continue;
    }

    buckets.set(key, {
      count: 1,
      red,
      green,
      blue,
    });
  }

  const sortedBuckets = [...buckets.values()]
    .sort((left, right) => right.count - left.count)
    .slice(0, 6);
  const palette = [];

  for (let index = 0; index < sortedBuckets.length; index += 1) {
    const bucket = sortedBuckets[index];
    const candidate = {
      red: Math.round(bucket.red / bucket.count),
      green: Math.round(bucket.green / bucket.count),
      blue: Math.round(bucket.blue / bucket.count),
    };
    const isDuplicate = palette.some(color => {
      return getColorDistanceScore(candidate.red, candidate.green, candidate.blue, color) <= 18 * 18;
    });

    if (!isDuplicate) {
      palette.push(candidate);
    }

    if (palette.length === 3) {
      break;
    }
  }

  if (palette.length === 0) {
    const [red, green, blue] = samples[0];

    palette.push({red, green, blue});
  }

  const totalDeviation =
    samples.reduce((sum, sample) => {
      let bestScore = Number.POSITIVE_INFINITY;

      for (let index = 0; index < palette.length; index += 1) {
        const color = palette[index];
        const score = getColorDistanceScore(sample[0], sample[1], sample[2], color);

        if (score < bestScore) {
          bestScore = score;
        }
      }

      return sum + Math.sqrt(bestScore);
    }, 0) / samples.length;

  return {
    deviation: totalDeviation,
    palette,
  };
};

const getForegroundFocusArea = (width, height) => {
  return {
    left: Math.floor(width * 0.2),
    top: Math.floor(height * 0.16),
    right: Math.ceil(width * 0.8),
    bottom: Math.ceil(height * 0.84),
  };
};

const getLocalContrastScore = (pixels, x, y, width, height) => {
  const centerOffset = getOffset(getPixelIndex(x, y, width));
  const centerLuma = getLuma(pixels, centerOffset);
  let contrast = 0;
  let samples = 0;

  if (x > 0) {
    const leftOffset = getOffset(getPixelIndex(x - 1, y, width));
    contrast += Math.abs(centerLuma - getLuma(pixels, leftOffset));
    samples += 1;
  }

  if (x < width - 1) {
    const rightOffset = getOffset(getPixelIndex(x + 1, y, width));
    contrast += Math.abs(centerLuma - getLuma(pixels, rightOffset));
    samples += 1;
  }

  if (y > 0) {
    const topOffset = getOffset(getPixelIndex(x, y - 1, width));
    contrast += Math.abs(centerLuma - getLuma(pixels, topOffset));
    samples += 1;
  }

  if (y < height - 1) {
    const bottomOffset = getOffset(getPixelIndex(x, y + 1, width));
    contrast += Math.abs(centerLuma - getLuma(pixels, bottomOffset));
    samples += 1;
  }

  if (samples === 0) {
    return 0;
  }

  return (contrast / samples) * (contrast / samples);
};

const shouldExpandBackground = (
  pixels,
  width,
  height,
  pixelIndex,
  currentOffset,
  palette,
  seedThreshold,
  expandThreshold,
  bridgeThreshold,
  contrastThreshold,
) => {
  const offset = getOffset(pixelIndex);

  if (pixels[offset + 3] <= TRANSPARENT_ALPHA) {
    return true;
  }

  const match = getPaletteDistanceScore(pixels, offset, palette);

  if (match.score <= seedThreshold) {
    return true;
  }

  if (match.score > expandThreshold) {
    return false;
  }

  const pixelDistance = getPixelDistanceScore(pixels, offset, currentOffset);

  if (pixelDistance > bridgeThreshold) {
    return false;
  }

  const x = pixelIndex % width;
  const y = Math.floor(pixelIndex / width);
  const contrast = getLocalContrastScore(pixels, x, y, width, height);

  return contrast <= contrastThreshold;
};

const buildBackgroundMask = (pixels, width, height, palette, deviation) => {
  const totalPixels = width * height;
  const queued = new Uint8Array(totalPixels);
  const mask = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  const seedDistance = clampNumber(18 + deviation * 1.15, 16, 50);
  const expandDistance = clampNumber(seedDistance + 16, 28, 72);
  const bridgeDistance = clampNumber(10 + deviation * 0.55, 10, 28);
  const contrastDistance = clampNumber(22 + deviation * 0.75, 22, 60);
  const seedThreshold = seedDistance * seedDistance;
  const expandThreshold = expandDistance * expandDistance;
  const bridgeThreshold = bridgeDistance * bridgeDistance;
  const contrastThreshold = contrastDistance * contrastDistance;
  let head = 0;
  let tail = 0;

  const tryQueue = pixelIndex => {
    if (queued[pixelIndex]) {
      return;
    }

    const offset = getOffset(pixelIndex);
    const alpha = pixels[offset + 3];
    const match = getPaletteDistanceScore(pixels, offset, palette);

    if (alpha <= TRANSPARENT_ALPHA || match.score <= expandThreshold) {
      queued[pixelIndex] = 1;
      queue[tail] = pixelIndex;
      tail += 1;
    }
  };

  for (let x = 0; x < width; x += 1) {
    tryQueue(getPixelIndex(x, 0, width));
    tryQueue(getPixelIndex(x, height - 1, width));
  }

  for (let y = 1; y < height - 1; y += 1) {
    tryQueue(getPixelIndex(0, y, width));
    tryQueue(getPixelIndex(width - 1, y, width));
  }

  while (head < tail) {
    const pixelIndex = queue[head];
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const currentOffset = getOffset(pixelIndex);
    head += 1;
    mask[pixelIndex] = 1;

    if (x > 0) {
      const leftPixel = pixelIndex - 1;

      if (
        !queued[leftPixel] &&
        shouldExpandBackground(
          pixels,
          width,
          height,
          leftPixel,
          currentOffset,
          palette,
          seedThreshold,
          expandThreshold,
          bridgeThreshold,
          contrastThreshold,
        )
      ) {
        queued[leftPixel] = 1;
        queue[tail] = leftPixel;
        tail += 1;
      }
    }

    if (x < width - 1) {
      const rightPixel = pixelIndex + 1;

      if (
        !queued[rightPixel] &&
        shouldExpandBackground(
          pixels,
          width,
          height,
          rightPixel,
          currentOffset,
          palette,
          seedThreshold,
          expandThreshold,
          bridgeThreshold,
          contrastThreshold,
        )
      ) {
        queued[rightPixel] = 1;
        queue[tail] = rightPixel;
        tail += 1;
      }
    }

    if (y > 0) {
      const topPixel = pixelIndex - width;

      if (
        !queued[topPixel] &&
        shouldExpandBackground(
          pixels,
          width,
          height,
          topPixel,
          currentOffset,
          palette,
          seedThreshold,
          expandThreshold,
          bridgeThreshold,
          contrastThreshold,
        )
      ) {
        queued[topPixel] = 1;
        queue[tail] = topPixel;
        tail += 1;
      }
    }

    if (y < height - 1) {
      const bottomPixel = pixelIndex + width;

      if (
        !queued[bottomPixel] &&
        shouldExpandBackground(
          pixels,
          width,
          height,
          bottomPixel,
          currentOffset,
          palette,
          seedThreshold,
          expandThreshold,
          bridgeThreshold,
          contrastThreshold,
        )
      ) {
        queued[bottomPixel] = 1;
        queue[tail] = bottomPixel;
        tail += 1;
      }
    }
  }

  return mask;
};

const keepBestForegroundComponent = (foregroundMask, width, height) => {
  const totalPixels = width * height;
  const labels = new Int32Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  const focus = getForegroundFocusArea(width, height);
  const componentStats = [];
  let componentId = 0;

  for (let pixelIndex = 0; pixelIndex < totalPixels; pixelIndex += 1) {
    if (!foregroundMask[pixelIndex] || labels[pixelIndex]) {
      continue;
    }

    componentId += 1;
    let head = 0;
    let tail = 0;
    queue[tail] = pixelIndex;
    tail += 1;
    labels[pixelIndex] = componentId;

    const stats = {
      area: 0,
      borderPixels: 0,
      focusPixels: 0,
    };

    while (head < tail) {
      const currentPixel = queue[head];
      const x = currentPixel % width;
      const y = Math.floor(currentPixel / width);
      head += 1;
      stats.area += 1;

      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        stats.borderPixels += 1;
      }

      if (
        x >= focus.left &&
        x <= focus.right &&
        y >= focus.top &&
        y <= focus.bottom
      ) {
        stats.focusPixels += 1;
      }

      if (x > 0) {
        const leftPixel = currentPixel - 1;

        if (foregroundMask[leftPixel] && !labels[leftPixel]) {
          labels[leftPixel] = componentId;
          queue[tail] = leftPixel;
          tail += 1;
        }
      }

      if (x < width - 1) {
        const rightPixel = currentPixel + 1;

        if (foregroundMask[rightPixel] && !labels[rightPixel]) {
          labels[rightPixel] = componentId;
          queue[tail] = rightPixel;
          tail += 1;
        }
      }

      if (y > 0) {
        const topPixel = currentPixel - width;

        if (foregroundMask[topPixel] && !labels[topPixel]) {
          labels[topPixel] = componentId;
          queue[tail] = topPixel;
          tail += 1;
        }
      }

      if (y < height - 1) {
        const bottomPixel = currentPixel + width;

        if (foregroundMask[bottomPixel] && !labels[bottomPixel]) {
          labels[bottomPixel] = componentId;
          queue[tail] = bottomPixel;
          tail += 1;
        }
      }
    }

    componentStats[componentId] = stats;
  }

  if (componentId === 0) {
    return foregroundMask;
  }

  let bestComponentId = 1;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let index = 1; index <= componentId; index += 1) {
    const stats = componentStats[index];
    const score = stats.area + stats.focusPixels * 7 - stats.borderPixels * 4;

    if (score > bestScore) {
      bestScore = score;
      bestComponentId = index;
    }
  }

  const output = new Uint8Array(totalPixels);

  for (let pixelIndex = 0; pixelIndex < totalPixels; pixelIndex += 1) {
    if (labels[pixelIndex] === bestComponentId) {
      output[pixelIndex] = 1;
    }
  }

  return output;
};

const dilateBinaryMask = (mask, width, height, iterations = 1) => {
  let input = new Uint8Array(mask);

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const output = new Uint8Array(mask.length);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let hasForeground = false;

        for (let offsetY = -1; offsetY <= 1 && !hasForeground; offsetY += 1) {
          const sampleY = y + offsetY;

          if (sampleY < 0 || sampleY >= height) {
            continue;
          }

          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const sampleX = x + offsetX;

            if (sampleX < 0 || sampleX >= width) {
              continue;
            }

            if (input[getPixelIndex(sampleX, sampleY, width)]) {
              hasForeground = true;
              break;
            }
          }
        }

        if (hasForeground) {
          output[getPixelIndex(x, y, width)] = 1;
        }
      }
    }

    input = output;
  }

  return input;
};

const erodeBinaryMask = (mask, width, height, iterations = 1) => {
  let input = new Uint8Array(mask);

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const output = new Uint8Array(mask.length);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let hasFullForeground = true;

        for (let offsetY = -1; offsetY <= 1 && hasFullForeground; offsetY += 1) {
          const sampleY = y + offsetY;

          if (sampleY < 0 || sampleY >= height) {
            hasFullForeground = false;
            continue;
          }

          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const sampleX = x + offsetX;

            if (sampleX < 0 || sampleX >= width) {
              hasFullForeground = false;
              break;
            }

            if (!input[getPixelIndex(sampleX, sampleY, width)]) {
              hasFullForeground = false;
              break;
            }
          }
        }

        if (hasFullForeground) {
          output[getPixelIndex(x, y, width)] = 1;
        }
      }
    }

    input = output;
  }

  return input;
};

const smoothBinaryMask = (mask, width, height) => {
  const output = new Uint8Array(mask.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let neighbors = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        const sampleY = y + offsetY;

        if (sampleY < 0 || sampleY >= height) {
          continue;
        }

        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const sampleX = x + offsetX;

          if (sampleX < 0 || sampleX >= width) {
            continue;
          }

          neighbors += mask[getPixelIndex(sampleX, sampleY, width)];
        }
      }

      if (neighbors >= 5) {
        output[getPixelIndex(x, y, width)] = 1;
      }
    }
  }

  return output;
};

const blurAlphaMask = (alphaMask, width, height, passes = 1) => {
  let input = new Uint8ClampedArray(alphaMask);

  for (let pass = 0; pass < passes; pass += 1) {
    const output = new Uint8ClampedArray(alphaMask.length);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let sum = 0;
        let samples = 0;

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          const sampleY = y + offsetY;

          if (sampleY < 0 || sampleY >= height) {
            continue;
          }

          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            const sampleX = x + offsetX;

            if (sampleX < 0 || sampleX >= width) {
              continue;
            }

            sum += input[getPixelIndex(sampleX, sampleY, width)];
            samples += 1;
          }
        }

        output[getPixelIndex(x, y, width)] = Math.round(sum / samples);
      }
    }

    input = output;
  }

  return input;
};

const buildForegroundAlphaMask = (pixels, width, height, palette, deviation) => {
  const backgroundMask = buildBackgroundMask(pixels, width, height, palette, deviation);
  const foregroundMask = new Uint8Array(backgroundMask.length);

  for (let pixelIndex = 0; pixelIndex < backgroundMask.length; pixelIndex += 1) {
    foregroundMask[pixelIndex] = backgroundMask[pixelIndex] ? 0 : 1;
  }

  const mainSubject = keepBestForegroundComponent(foregroundMask, width, height);
  const closedMask = erodeBinaryMask(
    dilateBinaryMask(mainSubject, width, height, 1),
    width,
    height,
    1,
  );
  const smoothedMask = smoothBinaryMask(closedMask, width, height);
  const alphaMask = new Uint8ClampedArray(smoothedMask.length);

  for (let pixelIndex = 0; pixelIndex < smoothedMask.length; pixelIndex += 1) {
    alphaMask[pixelIndex] = smoothedMask[pixelIndex] ? 255 : 0;
  }

  const blurredMask = blurAlphaMask(alphaMask, width, height, 2);

  for (let pixelIndex = 0; pixelIndex < smoothedMask.length; pixelIndex += 1) {
    if (smoothedMask[pixelIndex]) {
      blurredMask[pixelIndex] = Math.max(blurredMask[pixelIndex], 214);
    }
  }

  return blurredMask;
};

const applyBackgroundRemovalMask = (pixels, width, height, alphaMask, palette) => {
  const output = new Uint8ClampedArray(pixels);

  for (let pixelIndex = 0; pixelIndex < width * height; pixelIndex += 1) {
    const offset = getOffset(pixelIndex);
    const nextAlpha = Math.round((pixels[offset + 3] * alphaMask[pixelIndex]) / 255);

    if (nextAlpha <= 6) {
      output[offset] = 0;
      output[offset + 1] = 0;
      output[offset + 2] = 0;
      output[offset + 3] = 0;
      continue;
    }

    if (nextAlpha >= 250) {
      output[offset + 3] = 255;
      continue;
    }

    output[offset + 3] = nextAlpha;
    const alphaRatio = nextAlpha / 255;
    const match = getPaletteDistanceScore(output, offset, palette);

    output[offset] = clamp(
      (output[offset] - match.color.red * (1 - alphaRatio)) / alphaRatio,
    );
    output[offset + 1] = clamp(
      (output[offset + 1] - match.color.green * (1 - alphaRatio)) / alphaRatio,
    );
    output[offset + 2] = clamp(
      (output[offset + 2] - match.color.blue * (1 - alphaRatio)) / alphaRatio,
    );
  }

  return output;
};

const buildBlurredPixels = (pixels, width, height) => {
  const output = new Uint8ClampedArray(pixels.length);
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;
      let weightSum = 0;
      let kernelIndex = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        const sampleY = clamp(y + offsetY, 0, height - 1);

        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          const sampleX = clamp(x + offsetX, 0, width - 1);
          const weight = kernel[kernelIndex];
          const sampleOffset = getOffset(getPixelIndex(sampleX, sampleY, width));

          red += pixels[sampleOffset] * weight;
          green += pixels[sampleOffset + 1] * weight;
          blue += pixels[sampleOffset + 2] * weight;
          alpha += pixels[sampleOffset + 3] * weight;
          weightSum += weight;
          kernelIndex += 1;
        }
      }

      const pixelOffset = getOffset(getPixelIndex(x, y, width));

      output[pixelOffset] = Math.round(red / weightSum);
      output[pixelOffset + 1] = Math.round(green / weightSum);
      output[pixelOffset + 2] = Math.round(blue / weightSum);
      output[pixelOffset + 3] = Math.round(alpha / weightSum);
    }
  }

  return output;
};

const saturatePixel = (red, green, blue, amount) => {
  const luma = red * 0.299 + green * 0.587 + blue * 0.114;

  return {
    red: clamp(luma + (red - luma) * amount),
    green: clamp(luma + (green - luma) * amount),
    blue: clamp(luma + (blue - luma) * amount),
  };
};

const adjustContrast = (value, amount) => {
  return clamp((value - 128) * amount + 128);
};

const enhancePixels = (pixels, width, height) => {
  const blurredPixels = buildBlurredPixels(pixels, width, height);
  const output = new Uint8ClampedArray(pixels.length);

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3];
    const sharpenAmount = 1.15;
    const sharpenedRed = clamp(
      pixels[index] + (pixels[index] - blurredPixels[index]) * sharpenAmount + 4,
    );
    const sharpenedGreen = clamp(
      pixels[index + 1] +
        (pixels[index + 1] - blurredPixels[index + 1]) * sharpenAmount +
        4,
    );
    const sharpenedBlue = clamp(
      pixels[index + 2] +
        (pixels[index + 2] - blurredPixels[index + 2]) * sharpenAmount +
        4,
    );
    const saturatedPixel = saturatePixel(
      sharpenedRed,
      sharpenedGreen,
      sharpenedBlue,
      1.12,
    );

    output[index] = adjustContrast(saturatedPixel.red, 1.08);
    output[index + 1] = adjustContrast(saturatedPixel.green, 1.08);
    output[index + 2] = adjustContrast(saturatedPixel.blue, 1.08);
    output[index + 3] = alpha;
  }

  return output;
};

const removeBackgroundPixels = (pixels, width, height) => {
  const segmentationImage = resizeRgbaImage(
    pixels,
    width,
    height,
    MAX_SEGMENTATION_SIZE,
  );
  const {palette, deviation} = estimateBackgroundPalette(
    segmentationImage.pixels,
    segmentationImage.width,
    segmentationImage.height,
  );
  const smallAlphaMask = buildForegroundAlphaMask(
    segmentationImage.pixels,
    segmentationImage.width,
    segmentationImage.height,
    palette,
    deviation,
  );
  const alphaMask = resizeAlphaMask(
    smallAlphaMask,
    segmentationImage.width,
    segmentationImage.height,
    width,
    height,
  );

  return applyBackgroundRemovalMask(pixels, width, height, alphaMask, palette);
};

export const pickerImageOptions = {
  assetRepresentationMode: 'compatible',
  includeBase64: true,
  maxHeight: MAX_INPUT_SIZE,
  maxWidth: MAX_INPUT_SIZE,
  mediaType: 'photo',
  quality: 0.92,
  selectionLimit: 1,
};

export const enhancePickedImage = async asset => {
  await nextFrame();
  const decodedImage = decodeImageAsset(asset);

  await nextFrame();
  const enhancedPixels = enhancePixels(
    decodedImage.pixels,
    decodedImage.width,
    decodedImage.height,
  );

  return {
    uri: encodePngDataUri(enhancedPixels, decodedImage.width, decodedImage.height),
    width: decodedImage.width,
    height: decodedImage.height,
  };
};

export const removePickedImageBackground = async asset => {
  await nextFrame();
  const decodedImage = decodeImageAsset(asset);

  await nextFrame();
  const resultPixels = removeBackgroundPixels(
    decodedImage.pixels,
    decodedImage.width,
    decodedImage.height,
  );

  return {
    uri: encodePngDataUri(resultPixels, decodedImage.width, decodedImage.height),
    width: decodedImage.width,
    height: decodedImage.height,
  };
};

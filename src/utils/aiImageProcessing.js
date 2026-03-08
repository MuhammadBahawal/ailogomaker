const jpeg = require('jpeg-js');
const UPNG = require('upng-js');
const {fromByteArray, toByteArray} = require('base64-js');

const MIME_TYPES = {
  jpeg: 'image/jpeg',
  png: 'image/png',
};

const MAX_INPUT_SIZE = 1024;
const TRANSPARENT_ALPHA = 16;

const clamp = (value, min = 0, max = 255) => {
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

const getColorDistance = (pixels, offset, reference) => {
  const redDelta = pixels[offset] - reference.red;
  const greenDelta = pixels[offset + 1] - reference.green;
  const blueDelta = pixels[offset + 2] - reference.blue;

  return Math.sqrt(
    redDelta * redDelta * 0.3 +
      greenDelta * greenDelta * 0.59 +
      blueDelta * blueDelta * 0.11,
  );
};

const getPixelDistance = (pixels, leftOffset, rightOffset) => {
  const redDelta = pixels[leftOffset] - pixels[rightOffset];
  const greenDelta = pixels[leftOffset + 1] - pixels[rightOffset + 1];
  const blueDelta = pixels[leftOffset + 2] - pixels[rightOffset + 2];

  return Math.sqrt(
    redDelta * redDelta * 0.3 +
      greenDelta * greenDelta * 0.59 +
      blueDelta * blueDelta * 0.11,
  );
};

const getLuma = (pixels, offset) => {
  return (
    pixels[offset] * 0.299 +
    pixels[offset + 1] * 0.587 +
    pixels[offset + 2] * 0.114
  );
};

const collectCornerSamples = (pixels, width, height) => {
  const sampleSpan = Math.max(6, Math.floor(Math.min(width, height) * 0.08));
  const maxX = width - sampleSpan;
  const maxY = height - sampleSpan;
  const corners = [
    {x: 0, y: 0},
    {x: maxX, y: 0},
    {x: 0, y: maxY},
    {x: maxX, y: maxY},
  ];
  const samples = [];

  corners.forEach(corner => {
    for (let y = corner.y; y < corner.y + sampleSpan; y += 2) {
      for (let x = corner.x; x < corner.x + sampleSpan; x += 2) {
        const offset = getOffset(getPixelIndex(x, y, width));

        if (pixels[offset + 3] <= TRANSPARENT_ALPHA) {
          continue;
        }

        samples.push([
          pixels[offset],
          pixels[offset + 1],
          pixels[offset + 2],
        ]);
      }
    }
  });

  return samples;
};

const getMedianChannel = values => {
  const sorted = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middleIndex - 1] + sorted[middleIndex]) / 2);
  }

  return sorted[middleIndex];
};

const estimateBackgroundColor = (pixels, width, height) => {
  const samples = collectCornerSamples(pixels, width, height);

  if (samples.length === 0) {
    return {
      red: 255,
      green: 255,
      blue: 255,
      variance: 18,
    };
  }

  const redValues = samples.map(sample => sample[0]);
  const greenValues = samples.map(sample => sample[1]);
  const blueValues = samples.map(sample => sample[2]);
  const reference = {
    red: getMedianChannel(redValues),
    green: getMedianChannel(greenValues),
    blue: getMedianChannel(blueValues),
    variance: 0,
  };

  const distances = samples.map(sample => {
    const redDelta = sample[0] - reference.red;
    const greenDelta = sample[1] - reference.green;
    const blueDelta = sample[2] - reference.blue;

    return Math.sqrt(
      redDelta * redDelta * 0.3 +
        greenDelta * greenDelta * 0.59 +
        blueDelta * blueDelta * 0.11,
    );
  });

  reference.variance =
    distances.reduce((sum, distance) => sum + distance, 0) / distances.length;

  return reference;
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

const shouldExpandBackground = (
  pixels,
  offset,
  currentOffset,
  backgroundColor,
  threshold,
  bridgeThreshold,
) => {
  if (pixels[offset + 3] <= TRANSPARENT_ALPHA) {
    return true;
  }

  const backgroundDistance = getColorDistance(pixels, offset, backgroundColor);

  if (backgroundDistance <= threshold) {
    return true;
  }

  if (backgroundDistance > threshold + 22) {
    return false;
  }

  const pixelDistance = getPixelDistance(pixels, offset, currentOffset);
  const lumaDistance = Math.abs(getLuma(pixels, offset) - getLuma(pixels, currentOffset));

  return pixelDistance <= bridgeThreshold && lumaDistance <= bridgeThreshold;
};

const buildBackgroundMask = (pixels, width, height, backgroundColor) => {
  const totalPixels = width * height;
  const queued = new Uint8Array(totalPixels);
  const mask = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  const seedThreshold = clamp(26 + backgroundColor.variance * 1.1, 20, 72);
  const bridgeThreshold = clamp(12 + backgroundColor.variance * 0.65, 12, 30);
  let head = 0;
  let tail = 0;

  const tryQueue = pixelIndex => {
    if (queued[pixelIndex]) {
      return;
    }

    const offset = getOffset(pixelIndex);
    const alpha = pixels[offset + 3];
    const backgroundDistance = getColorDistance(pixels, offset, backgroundColor);

    if (alpha <= TRANSPARENT_ALPHA || backgroundDistance <= seedThreshold + 8) {
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
          getOffset(leftPixel),
          currentOffset,
          backgroundColor,
          seedThreshold,
          bridgeThreshold,
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
          getOffset(rightPixel),
          currentOffset,
          backgroundColor,
          seedThreshold,
          bridgeThreshold,
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
          getOffset(topPixel),
          currentOffset,
          backgroundColor,
          seedThreshold,
          bridgeThreshold,
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
          getOffset(bottomPixel),
          currentOffset,
          backgroundColor,
          seedThreshold,
          bridgeThreshold,
        )
      ) {
        queued[bottomPixel] = 1;
        queue[tail] = bottomPixel;
        tail += 1;
      }
    }
  }

  return {
    mask,
    threshold: seedThreshold,
  };
};

const removeBackgroundPixels = (pixels, width, height) => {
  const backgroundColor = estimateBackgroundColor(pixels, width, height);
  const {mask, threshold} = buildBackgroundMask(
    pixels,
    width,
    height,
    backgroundColor,
  );
  const featherThreshold = threshold + 26;
  const output = new Uint8ClampedArray(pixels);

  for (let pixelIndex = 0; pixelIndex < mask.length; pixelIndex += 1) {
    const offset = getOffset(pixelIndex);

    if (mask[pixelIndex]) {
      output[offset + 3] = 0;
      continue;
    }

    const backgroundDistance = getColorDistance(output, offset, backgroundColor);

    if (backgroundDistance >= featherThreshold) {
      continue;
    }

    const alphaProgress = (backgroundDistance - threshold) / (featherThreshold - threshold);
    const nextAlpha = Math.round(clamp(alphaProgress, 0, 1) * output[offset + 3]);

    output[offset + 3] = nextAlpha;

    if (nextAlpha <= 0 || nextAlpha >= 255) {
      continue;
    }

    const alphaRatio = nextAlpha / 255;

    output[offset] = clamp(
      (output[offset] - backgroundColor.red * (1 - alphaRatio)) / alphaRatio,
    );
    output[offset + 1] = clamp(
      (output[offset + 1] - backgroundColor.green * (1 - alphaRatio)) /
        alphaRatio,
    );
    output[offset + 2] = clamp(
      (output[offset + 2] - backgroundColor.blue * (1 - alphaRatio)) / alphaRatio,
    );
  }

  return output;
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

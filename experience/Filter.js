class Filter {
  constructor(image) {
    this.image = image;
  }
  getPixels() {
    const c = this.getCanvas(this.image.width, this.image.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(this.image, 0, 0);
    return ctx.getImageData(0, 0, c.width, c.height);
  }
  getCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  toCanvas(pixels) {
    const canvas = this.getCanvas(pixels.width, pixels.height);
    canvas.getContext('2d').putImageData(pixels, 0, 0);
    return canvas;
  }
  filterImage(filter, varArgs) {
    varArgs = varArgs || [];

    if (typeof(filter) === 'string') {
      filter = this[filter];
    }

    const args = [this.getPixels(this.image)];
    for (let i = 2; i < varArgs.length; i++) {
      args.push(varArgs[i]);
    }
    return filter.apply(this, args);
  }

  original(pixels) {
    return pixels;
  }
  grayscale(pixels) {
    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    return pixels;
  }
  brightness(pixels, adjustment) {
    adjustment = adjustment || 128;

    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = this._truncatePixelValue(adjustment + d[i]);
      d[i + 1] = this._truncatePixelValue(adjustment + d[i + 1]);
      d[i + 2] = this._truncatePixelValue(adjustment + d[i + 2]);
    }
    return pixels;
  }
  contrast(pixels, adjustment) {
    adjustment = adjustment || 30;
    const adjFactor = (259 * (adjustment + 255)) / (255 * (259 - adjustment));

    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = this._truncatePixelValue(adjFactor * d[i]);
      d[i + 1] = this._truncatePixelValue(adjFactor * d[i + 1]);
      d[i + 2] = this._truncatePixelValue(adjFactor * d[i + 2]);
      if (i < 200) { console.log(d[i + 3]); }
    }
    return pixels;
  }
  overlayColor(pixels, hex, alpha) {
    const fg = this._colorHexToRgb(hex) || this._colorHexToRgb('#ffcc00');
    fg[3] = alpha || 0.2;

    const r = pixels.data;
    for (let i = 0; i < r.length; i += 4) {
      const bg = [r[i], r[i + 1], r[i + 2], r[i + 3] / 255];
      const aF = bg[3] + fg[3] - bg[3] * fg[3];

      r[i] = ((fg[0] * fg[3]) + (bg[0] * bg[3]) * (1 - fg[3])) / aF;
      r[i + 1] = ((fg[1] * fg[3]) + (bg[1] * bg[3]) * (1 - fg[3])) / aF;
      r[i + 2] = ((fg[2] * fg[3]) + (bg[2] * bg[3]) * (1 - fg[3])) / aF;
      r[i + 3] = (aF * 255);
    }
    return pixels;
  }
  convolute(pixels, weights, opaque) {
    weights = weights || [0, -1, 0,
                          -1, 5, -1,
                          0, -1, 0];

    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const src = pixels.data;
    const sw = pixels.width;
    const sh = pixels.height;
    // pad output by the convolution matrix
    const w = sw;
    const h = sh;
    const output = this._createImageData(w, h);
    const dst = output.data;
    // go through the destination image pixels
    const alphaFac = opaque ? 1 : 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sy = y;
        const sx = x;
        const dstOff = (y * w + x) * 4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = sy + cy - halfSide;
            const scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              const srcOff = (scy * sw + scx) * 4;
              const wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        dst[dstOff + 3] = a + alphaFac * (255 - a);
      }
    }
    return output;
  }
  levels(pixels, color, adjustment) {
    color = color || 'r';

    const colorOffsetMap = {
      r: 0,
      g: 1,
      b: 2,
    };
    const offset = colorOffsetMap[color];
    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i + offset] = this._truncatePixelValue(adjustment + d[i + offset]);
    }
    return pixels;
  }
  vignette(pixels, level) {
    level = level || 8;
    level = 1 / level;

    const mid = [pixels.width / 2, pixels.height / 2];
    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const pixelNum = i / 4;
      // Get the position relative to the center
      const pos = [-(mid[0] - pixelNum % pixels.width), mid[1] - parseInt(pixelNum / pixels.width, 10)];

      // Calculate the distance using the pythagorean theorem
      // Also offset it by w/h to make it eliptical
      const dist = Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1] * (pixels.width / pixels.height), 2));

      // By only adjusting when the distance is equal to height/2
      // It will only affect the corners
      if (dist > mid[1]) {
        const adjustment = level * Math.pow((dist - mid[1]) * level, 2);

        d[i] = d[i] - adjustment;
        d[i + 1] = d[i + 1] - adjustment;
        d[i + 2] = d[i + 2] - adjustment;
        d[i + 3] = d[i + 3];
      }

      // Unused calculations for the intercept distance
      // The original intention was to use this to calculate the
      // Percentage distance from the edge
      // const slope = (pos[1]) / (pos[0]);
      //
      // const xBoundry = (pixels.width / 2) * (pos[0] / Math.abs(pos[0]));
      // const yBoundry = (pixels.height / 2) * (pos[1] / Math.abs(pos[1]));
      //
      // const yIntercept = slope * xBoundry;
      // const xIntercept = yBoundry / slope;
      //
      // const intercept = [
      //   xBoundry > 0 ? Math.min(xBoundry, xIntercept) : Math.max(xBoundry, xIntercept),
      //   yBoundry > 0 ? Math.min(yBoundry, yIntercept) : Math.max(yBoundry, yIntercept),
      // ];
      //
      // const interceptDist = Math.sqrt(Math.pow(intercept[0], 2) + Math.pow(intercept[1], 2));
    }
    return pixels;
  }

  One(pixels) {
    // pixels = this.brightness(pixels, 10);
    pixels = this.overlayColor(pixels, '#ffcc00', 0.2);
    pixels = this.levels(pixels, 'b', 30);
    return pixels;
  }
  Two(pixels) {
    pixels = this.brightness(pixels, -20);
    pixels = this.overlayColor(pixels, '#ffcc00', 0.2);
    pixels = this.levels(pixels, 'b', 30);
    return pixels;
  }
  Three(pixels) {
    pixels = this.brightness(pixels, -20);
    pixels = this.overlayColor(pixels, '#ffcc00', 0.2);
    pixels = this.levels(pixels, 'b', 30);
    return pixels;
  }
  Four(pixels) {
    pixels = this.brightness(pixels, -20);
    pixels = this.overlayColor(pixels, '#ffcc00', 0.2);
    pixels = this.levels(pixels, 'b', 30);
    pixels = this.vignette(pixels);
    return pixels;
  }

  _createImageData(w, h) {
    this.tmpCanvas = document.createElement('canvas');
    this.tmpCtx = this.tmpCanvas.getContext('2d');
    return this.tmpCtx.createImageData(w, h);
  }
  _truncatePixelValue(value) {
    if (value > 255) return 255;
    if (value < 0) return 0;
    return value;
  }
  _colorHexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16), // r
      parseInt(result[2], 16), // g
      parseInt(result[3], 16), // b
    ] : null;
  }
}

export default Filter;

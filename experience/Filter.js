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
    const rgb = this._colorHexToRgb(hex) || this._colorHexToRgb('#fef7d9');
    const bg = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, alpha || 0.2];
    console.log('blah hey', rgb);
    console.log('blah hey', bg);
    // fg[3] = alpha || 200;

    const r = pixels.data;
    console.log('blah r', r[48]);
    for (let i = 0; i < r.length; i += 4) {
      // const fg = [r[i], r[i + 1], r[i + 2], r[i + 3]];
      const rA = (1 - r[i + 3]) * (1 - bg[3]);

      r[i] = r[i] * r[i + 3] / rA + bg[0] * bg[3] * (1 - r[i + 3]) / rA;
      r[i + 1] = r[i + 1] * r[i + 3] / rA + bg[1] * bg[3] * (1 - r[i + 3]) / rA;
      r[i + 2] = r[i + 2] * r[i + 3] / rA + bg[2] * bg[3] * (1 - r[i + 3]) / rA;
      r[i + 3] = rA;

      if (i < 50) {
        console.log('blah 1', i, r[i + 3], rA);
        console.log('blah 2', [r[i], r[i + 1], r[i + 1], r[i + 3]]);
      }
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

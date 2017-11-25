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
    // adjustment -100..100
    adjustment = adjustment || 10;
    adjustment = (adjustment / 100) * 255;

    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = this._truncatePixelValue(adjustment + d[i]);
      d[i + 1] = this._truncatePixelValue(adjustment + d[i + 1]);
      d[i + 2] = this._truncatePixelValue(adjustment + d[i + 2]);
    }
    return pixels;
  }
  contrast(pixels, adjustment) {
    // adjustment -100..100
    adjustment = adjustment || 10;
    adjustment = (adjustment / 100) * 255;

    const adjFactor = (259 * (adjustment + 255)) / (255 * (259 - adjustment));

    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = this._truncatePixelValue(adjFactor * (d[i] - 128) + 128);
      d[i + 1] = this._truncatePixelValue(adjFactor * (d[i + 1] - 128) + 128);
      d[i + 2] = this._truncatePixelValue(adjFactor * (d[i + 2] - 128) + 128);
    }
    return pixels;
  }
  overlayColor(pixels, hex, level) {
    // level 0..100
    level = level || 10;
    level = level / 100;
    const fg = this._colorHexToRgb(hex) || this._colorHexToRgb('#ffcc00');
    fg[3] = level;

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
    // adjustment -100..100
    adjustment = adjustment || 10;
    adjustment = (adjustment / 100) * 255;
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
  vignette(pixels, radius, spread) {
    // spread 1..10
    // radius 1..10
    spread = spread || 5;
    spread = (spread / 10) * 20;
    spread = 1 / spread;

    const mid = [pixels.width / 2, pixels.height / 2];
    radius = radius || 5;
    radius = ((mid[1] / 2) + ((mid[1] / 10) * radius));

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
      if (dist > radius) {
        const adjustment = spread * Math.pow((dist - radius) * spread, 2);

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
  saturation(pixels, adjustment) {
    // adjustment -100..100
    adjustment = adjustment || 20;
    adjustment = 1 + ((adjustment / 100) * 4);

    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const hsv = this._rgbToHsv([d[i], d[i + 1], d[i + 2]]);
      if (adjustment > 0) {
        hsv[1] = hsv[1] * adjustment;
      } else {
        hsv[1] = hsv[1] / Math.abs(adjustment);
      }
      const rgb = this._hsvToRgb(hsv);
      d[i] = rgb[0];
      d[i + 1] = rgb[1];
      d[i + 2] = rgb[2];
    }
    return pixels;
  }
  hue(pixels, adjustment) {
    // adjustment -100..100
    adjustment = adjustment || 20;
    adjustment = 1 + ((adjustment / 100) * 4);

    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const hsv = this._rgbToHsv([d[i], d[i + 1], d[i + 2]]);
      if (adjustment > 0) {
        hsv[0] = hsv[0] * adjustment;
      } else {
        hsv[0] = hsv[0] / Math.abs(adjustment);
      }
      const rgb = this._hsvToRgb(hsv);
      d[i] = rgb[0];
      d[i + 1] = rgb[1];
      d[i + 2] = rgb[2];
    }
    return pixels;
  }
  Filter1(pixels) {
    pixels = this.levels(pixels, 'b', 23);
    pixels = this.overlayColor(pixels, '#ffcc00', 20);
    pixels = this.brightness(pixels, -10);
    pixels = this.vignette(pixels, 5, 5);
    return pixels;
  }
  Filter2(pixels) {
    pixels = this.brightness(pixels, -10);
    pixels = this.contrast(pixels, 5);
    pixels = this.overlayColor(pixels, '#eddd9e', 10);
    pixels = this.saturation(pixels, -8);
    pixels = this.vignette(pixels, 3, 6);
    return pixels;
  }

  One(pixels) {
    pixels = this.levels(pixels, 'r', 5);
    return pixels;
  }
  Two(pixels) {
    pixels = this.levels(pixels, 'r', 5);
    pixels = this.brightness(pixels, -10);
    pixels = this.contrast(pixels, 10);
    return pixels;
  }
  Three(pixels) {
    return pixels;
  }
  Four(pixels) {
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
  _rgbToHsv(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = max;
    let s = max;
    const v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) { // eslint-disable-line default-case
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return [h, s, v];
  }
  _hsvToRgb(hsv) {
    const h = hsv[0];
    const s = hsv[1];
    const v = hsv[2];
    let r;
    let g;
    let b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) { // eslint-disable-line default-case
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return [r * 255, g * 255, b * 255];
  }
}

export default Filter;

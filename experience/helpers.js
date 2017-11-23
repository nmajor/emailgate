const pica = require('pica')();

export function getImageUrl(image) {
  image = image || {};

  if (image.url) return image.url;

  if (image.content) {
    return `data:${image.contentType};base64,${image.content}`;
  }

  return getRandomImageUrl();
}

export function getRandomImageUrl() {
  // return 'http://i.imgur.com/147o0SAl.jpg';

  const rangeMin = 1;
  const rangeMax = 400;
  const randomImageId = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
  return `https://source.unsplash.com/collection/140375/${randomImageId}`;
}

export function cropImage(url, crop) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.origin = 'Anonymous';

    image.src = url;
    image.onload = () => {
      canvas.width = crop.w;
      canvas.height = crop.h;

      ctx.drawImage(
        image,
        crop.x, // sourceX
        crop.y, // sourceY
        crop.w, // sourceWidth
        crop.h, // sourceHeight
        0, // destX
        0, // destY
        canvas.width, // destWidth
        canvas.height, // destHeight
      );

      // console.log(canvas.toDataURL());

      resolve(canvas.toDataURL());
    };
  });
}

export function rotateImage(url, crop) {
  return new Promise((resolve) => {
    if (crop.angle === 0) return resolve(url);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.origin = 'Anonymous';

    image.src = url;
    image.onload = () => {
      if (crop.angle === 90 || crop.angle === 270) {
        canvas.width = image.height;
        canvas.height = image.width;
      } else {
        canvas.width = image.width;
        canvas.height = image.height;
      }

      if (crop.angle === 90 || crop.angle === 270) {
        ctx.translate(image.height / 2, image.width / 2);
      } else {
        ctx.translate(image.width / 2, image.height / 2);
      }

      ctx.rotate((crop.angle * Math.PI / 180));

      ctx.drawImage(
        image,
        -image.width / 2, // destX
        -image.height / 2, // destY
        image.width, // destWidth
        image.height, // destHeight
      );

      resolve(canvas.toDataURL());
    };
  });
}

export function resizeImage(url, scale) {
  return imageCanvas(url)
  .then((from) => {
    const to = document.createElement('canvas');
    to.width = from.width * scale;
    to.height = from.height * scale;

    return pica.resize(from, to, {
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2,
    });
  }).then((result) => {
    return Promise.resolve(result.toDataURL());
  });
}

export function resizeToWidth(url, width) {
  return imageCanvas(url)
  .then((from) => {
    const to = document.createElement('canvas');
    to.width = width;
    to.height = (width / from.width) * from.height;

    return pica.resize(from, to, {
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2,
    });
  }).then((result) => {
    return Promise.resolve(result.toDataURL());
  });
}

function imageCanvas(url) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.origin = 'Anonymous';

    image.src = url;
    image.onload = () => {
      ctx.imageSmoothingQuality = 'high';
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(
        image,
        0, // destX
        0, // destY
        canvas.width, // destWidth
        canvas.height, // destHeight
      );

      resolve(canvas);
    };
  });
}

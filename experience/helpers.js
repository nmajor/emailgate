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
      canvas.height = crop.h;
      canvas.width = crop.w;

      ctx.drawImage(
        image,
        crop.x * (1 / crop.scale), // sourceX
        crop.y * (1 / crop.scale), // sourceY
        crop.w * (1 / crop.scale), // sourceWidth
        crop.h * (1 / crop.scale), // sourceHeight
        0, // destX
        0, // destY
        canvas.width, // destWidth
        canvas.height, // destHeight
      );

      console.log(canvas);

      resolve(canvas.toDataURL());
    };
  });
}

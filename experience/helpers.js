export function getImageUrl(image) {
  image = image || {};

  if (image.url) return image.url;

  if (image.content) {
    return `data:${image.contentType};base64,${image.content}`;
  }

  return this.randomImageUrl;
}

export function getRandomImageUrl() {
  return '/img/Apollo17_full.jpg';
  // return 'https://source.unsplash.com/collection/140375/214';

  // const rangeMin = 1;
  // const rangeMax = 400;
  // const randomImageId = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
  // return `https://source.unsplash.com/collection/140375/${randomImageId}`;
}

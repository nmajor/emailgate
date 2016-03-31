export function pageMeta(page) {
  const metaMap = {
    cover: {
      desc: 'Cover',
      editable: true,
      position: -4,
    },
    'title-page': {
      desc: 'Title Page',
      editable: true,
      position: -3,
    },
    'message-page': {
      desc: 'Custom Message Page',
      editable: true,
      position: -2,
    },
    'table-of-contents': {
      desc: 'Table of Contents',
      editable: false,
      position: -1,
    },
  };

  return metaMap[page.type];
}

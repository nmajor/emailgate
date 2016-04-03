// import fs from 'fs';
import manta from 'manta';
import stream from 'stream';
require('dotenv').config();

const client = manta.createClient({
  sign: manta.privateKeySigner({
    key: process.env.MANTA_APP_KEY.replace(/\\n/g, '\n'),
    keyId: process.env.MANTA_APP_KEY_ID,
    user: process.env.MANTA_APP_USER,
  }),
  user: process.env.MANTA_APP_USER,
  url: process.env.MANTA_APP_URL,
  connectTimeout: 25000,
});
console.log('manta ready: %s', client.toString());

// client.get(mantaConfig.publicPath+'/', function (err, stream) {
//   if (err) { console.log(err); }

//   stream.setEncoding('utf8');
//   stream.on('data', function (chunk) {
//       console.log(chunk);
//   });
// });

export function uploadStream(path, cb) {
  const fullPath = `${process.env.MANTA_APP_PUBLIC_PATH}/${path}`;
  const fileStream = stream.PassThrough(); // eslint-disable-line new-cap

  client.put(fullPath, fileStream, { mkdirs: true }, (err) => {
    if (err) { console.log(`Error when uploading file: ${err.message}`); return; }

    client.info(fullPath, (infoErr, results) => {
      if (infoErr) { console.log(`Error when getting file info: ${err.message}`); return; }

      const updatedAt = Date.now();
      const fileUrl = `${process.env.MANTA_APP_URL}/${fullPath}`;

      cb({
        url: fileUrl,
        updatedAt,
        path: fullPath,
        extension: results.extension,
        type: results.type,
        etag: results.etag,
        md5: results.md5,
        size: results.size,
      });
    });
  });

  return fileStream;
}

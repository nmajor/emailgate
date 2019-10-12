import aws from 'aws-sdk';
import md5 from 'md5';

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

// import { bufferToStream } from './helpers';

export function getBucket() {
  return 'emailgate-user-files';
}

export function getKey(path, filename) {
  return `${process.env.NODE_ENV}/${path}/${filename}`;
}

export function upload(path, filename, options = {}, buffer) {
  const bucket = getBucket();
  const key = getKey(path, filename);
  const fullPath = key;
  const fileMd5 = md5(buffer);
  const size = buffer.byteLength;

  const params = {
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ACL: 'public-read',
  };

  return new Promise((resolve) => {
    s3.upload(params, options, (err, data) => {
      if (err) console.error(err);
      const uploadedAt = Date.now();

      resolve({
        ...data,
        url: data.Location,
        bucket,
        key,
        fullPath,
        uploadedAt,
        size,
        md5: fileMd5,
      });
    });
  });
}


export function uploadImage(image, path) {
  const buffer = new Buffer(image.content, 'base64');
  let filename = image.fileName;
  if (image._id) filename = `${image._id}-${filename}`;

  return upload(path, filename, null, buffer)
  .then((results) => {
    image.content = undefined;
    image.uploading = undefined;

    return { ...results, ...image };
  });
}

export function removeDir(path) {
  return new Promise((resolve) => {
    const listParams = {
      Bucket: getBucket(),
      Prefix: path,
    };

    s3.listObjects(listParams, (err, list) => {
      if (err) return console.error(err);

      if (list.Contents.length === 0) resolve(null);

      const deleteParams = { Bucket: getBucket() };
      deleteParams.Delete = { Objects: [] };

      list.Contents.forEach((content) => {
        deleteParams.Delete.Objects.push({ Key: content.Key });
      });

      s3.deleteObjects(deleteParams, (_err, data) => {
        if (_err) return console.error(_err);

        if (data.Contents.length === 1000) return resolve(removeDir(path));
        return resolve(true);
      });
    });
  });
}

export function removeFile(path) {
  return new Promise((resolve) => {
    const params = {
      Bucket: getBucket(),
      Key: path,
    };
    s3.deleteObject(params, (err) => {
      if (err) return console.error(err);

      return resolve(true);
    });
  });
}

  // return new Promise((resolve) => {
  //   s3.deleteObjects(params, (err, data) => {
  //     if (err) console.log(err, err.stack); // an error occurred
  //     else console.log(data);           // successful response
  //   });
  // });
  //
  //
  //
  // return new Promise((resolve, reject) => {
  //   client.rmr(path, (err, results) => {
  //     if (err) { return reject({ message: err.message, err, path }); }
  //
  //     resolve(results);
  //   });
  // })
  // .catch((err) => { console.log('Error happened when removing dir', err); });


// export function uploadImage(image, path) {
//   return new Promise((resolve, reject) => {
//     let filename = image.fileName;
//
//     if (image._id) {
//       filename = `${image._id}-${filename}`;
//     }
//
//     const fullPath = `${process.env.MANTA_APP_PUBLIC_PATH}/${path}/${filename}`;
//     const buffer = new Buffer(image.content, 'base64');
//
//     const options = {
//       mkdirs: true,
//       headers: {
//         'Access-Control-Allow-Headers': 'Range',
//         'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
//         'Access-Control-Allow-Origin': '*',
//       },
//     };
//
//     client.put(fullPath, bufferToStream(buffer), options, (err) => {
//       if (err) { return reject(err); }
//
//       const uploadedAt = Date.now();
//
//       client.info(fullPath, (newErr, results) => {
//         if (newErr) { return reject({ message: newErr.message, newErr, fullPath }); }
//
//         const url = `${process.env.MANTA_APP_URL}/${fullPath}?${uploadedAt}`;
//         image.content = undefined;
//         image.uploading = undefined;
//
//         resolve({
//           ...image,
//
//           url,
//           uploadedAt,
//           path: fullPath,
//
//           extension: results.extension,
//           lastModified: results.headers['last-modified'],
//           type: results.type,
//           etag: results.etag,
//           md5: results.md5,
//           size: results.size,
//           fileResults: results,
//         });
//       });
//     });
//   });
// }

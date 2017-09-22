// import _ from 'lodash';
import feedFinder from 'feed-finder';
// import feedRead from 'feed-read';

export function findFeedPath(account) {
  return new Promise((resolve, reject) => {
    feedFinder(account.email, (err, feedUrls) => {
      if (err) return reject(err);

      console.log('found feed', feedUrls);
      resolve(feedUrls);
    });
  });
}

export function requestFeed(feedUrl) {
  const url = require('url'); // eslint-disable-line
  const urlObj = url.parse(feedUrl);

  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const https = require('https'); // eslint-disable-line
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      this.sentAt = new Date();

      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      req.on('error', (e) => {
        reject(`problem with response: ${e.message}`);
      });

      res.on('end', () => {
        const response = {
          status,
          body,
        };
        resolve(response);
      });
    });
  });
}

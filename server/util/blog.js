import _ from 'lodash';
import feedFinder from 'feed-finder';
import request from 'request';
import { parseString } from 'xml2js';
import { sanitizeEmailBodyPreview } from './helpers';
import { serializeQuery, youtubeUrlToThumbnailUrl } from '../../shared/helpers';

// https://developers.google.com/blogger/docs/2.0/json/reference/
// FEED - https://developers.google.com/blogger/docs/2.0/developers_guide_protocol
// https://www.npmjs.com/package/xml2js

export function findFeedPath(account) {
  return new Promise((resolve, reject) => {
    feedFinder(account.email, (err, feedUrls) => {
      if (err) return reject(err);

      resolve(feedUrls);
    });
  });
}

export function findBloggerId(account) {
  const feedUrl = account.props.feedUrls[0];
  return readFeed(feedUrl)
  .then((result) => {
    return new Promise((resolve) => {
      const { feed } = result;
      const id = extractBlogId(feed.id[0]);
      resolve(id);
    });
  });
}

export function getBloggerFeedUrl(account) {
  return `https://www.blogger.com/feeds/${account.props.bloggerId}/posts/default`;
}

export function requestFeed(account, options) {
  let feedUrl = getBloggerFeedUrl(account) || account.props.feedUrls[0];
  const queryParams = {};

  if (options.pageToken) { queryParams['start-index'] = options.pageToken; }

  if (!_.isEmpty(queryParams)) {
    feedUrl = `${feedUrl}?${serializeQuery(queryParams)}`;
  }

  return readFeed(feedUrl)
  .then((result) => {
    return new Promise((resolve) => {
      const { feed } = result;
      const { entry } = feed;
      const totalResults = parseInt(result.feed['openSearch:totalResults'][0], 10);
      const resultsPerPage = parseInt(result.feed['openSearch:itemsPerPage'][0], 10);
      const startIndex = parseInt(result.feed['openSearch:startIndex'], 10);
      const nextPageStartIndex = parseInt(startIndex + resultsPerPage, 10);
      const nextPageToken = nextPageStartIndex >= totalResults ? undefined : nextPageStartIndex;

      const processedEmails = entry.map(processEmailFromBloggerEntry);

      resolve({
        nextPageToken,
        messages: processedEmails,
        totalResults,
        moreThanTotalResults: false,
        resultsPerPage,
        resultsCount: processedEmails.length,
      });
    });
  });
}

export function getPostById(account, id) {
  // https://www.blogger.com/feeds/1712183131217232861/posts/default/2155444353128737187
  const bloggerFeedUrl = getBloggerFeedUrl(account);
  const postUrl = `${bloggerFeedUrl}/${id}`;

  return readFeed(postUrl)
  .then((result) => {
    return Promise.resolve(processEmailFromBloggerEntry(result.entry));
  });
}

export function getPostsById(account, ids) {
  return Promise.all(ids.map((id) => {
    return getPostById(account, id);
  }))
  .catch((err) => { console.log('Error getting messages by id', err); });
}

function extractBlogId(str) {
  const reg = /blog-(\d*)/;
  return str.match(reg)[1];
}

function extractPostId(str) {
  const reg = /post-(\d*)/;
  return str.match(reg)[1];
}

function processEmailFromBloggerEntry(entry) {
  const id = extractPostId(entry.id[0]);

  return {
    source: 'blogger',
    date: new Date(entry.published[0]),
    id,
    remote_id: id,
    mid: entry.id[0],
    // headers: email.headers,
    to: [],
    from: [],
    subject: entry.title[0]._ || '',
    // messageId: email.messageId,
    // text: email.text,
    body: processBlogBody(entry.content[0]._ || ''),
    bodyPreview: sanitizeEmailBodyPreview(entry.content[0]._ || ''),
    attachments: [],
  };
}

function processBlogBody(body) {
  // return body;
  const reg = new RegExp('(<a[^>]*>)?<iframe[^>]*src=".*?youtu.*?".*?>(</a>)?');
  return body.replace(reg, (match) => {
    const thumbnailSrcReg = /<iframe.*? data-thumbnail-src="(.*?)"/;
    const thumbSrcMatch = thumbnailSrcReg.exec(match);
    const thumbSrcUrl = thumbSrcMatch ? thumbSrcMatch[1] : undefined;

    if (thumbSrcUrl) {
      return `<img style="max-width: 480px;" src="${thumbSrcUrl}">`;
    }

    const urlReg = /<iframe.*? src="(.*?)"/;
    const urlMatch = urlReg.exec(match);
    const url = urlMatch ? urlMatch[1] : undefined;

    if (url) {
      const youtubeUrl = youtubeUrlToThumbnailUrl(url);
      if (youtubeUrl !== url) {
        return `<img style="width: 100%;" src="${youtubeUrl}">`;
      }
    }

    return '';
  });
}

function readFeed(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) reject(err);

      parseString(body, {}, (er, result) => {
        if (er) reject(er);
        resolve(result);
      });
    });
  });
}

require('dotenv').config();
import google from 'googleapis';
import GoogleAuth from 'google-auth-library';
import { MailParser } from 'mailparser';
import base64 from 'base64url';
import { googlifyFilter, processEmail, processEmailFromMetadata } from './helpers';
import stream from 'stream';
import config from '../config';
// import _ from 'lodash';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

function getAuthUrl(client) {
  return new Promise((resolve) => {
    const options = {
      access_type: 'online',
      approval_prompt: 'auto',
      scope: SCOPES,
    };

    const authUrl = client.generateAuthUrl(options);

    resolve(authUrl);
  });
}

function getAuthToken(client, code) {
  return new Promise((resolve) => {
    client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }

      client.credentials = token; // eslint-disable-line no-param-reassign
      resolve(token);
    });
  });
}

export function getClient(token) {
  const credentials = JSON.parse(process.env.GOOGLE_API_CREDENTIALS);
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];
  const auth = new GoogleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  if (token) {
    oauth2Client.credentials = token;
  }

  return oauth2Client;
}

export function getGoogleProfile(token) {
  return new Promise((resolve) => {
    const client = getClient(token);
    const gmail = google.gmail('v1');

    gmail.users.getProfile({
      auth: client,
      userId: 'me',
    }, (err, response) => {
      resolve(response);
    });
  });
}

export function getGoogleAuthUrl() {
  const client = getClient();
  return getAuthUrl(client);
}

export function getGoogleAuthToken(code) {
  const client = getClient();
  return getAuthToken(client, code);
}

export function getMessageById(client, id, options = {}) {
  const gmail = google.gmail('v1');

  return new Promise((resolve, reject) => {
    gmail.users.messages.get({
      id,
      auth: client,
      userId: 'me',
      format: options.format || 'raw',
    }, (messageErr, messageResponse) => {
      if (messageErr) {
        return reject({ base: [`There was a problem getting the gmail message - ${messageErr}`] });
      }

      if (options.format === 'metadata') {
        return processEmailFromMetadata(messageResponse)
        .then((email) => {
          resolve(email);
        });
      }

      const mailparser = new MailParser();
      mailparser.on('end', (msgObj) => {
        msgObj.id = id; // eslint-disable-line no-param-reassign
        return processEmail(msgObj, { includeAttachments: options.includeAttachments, resizeAttachments: options.resizeAttachments })
        .then((email) => {
          resolve(email);
        });
      });

      mailparser.write(base64.decode(messageResponse.raw));
      mailparser.end();
    });
  });
}

export function getMessagesById(client, messageIds, options = {}) {
  return Promise.all(messageIds.map((id) => {
    return getMessageById(client, id, options);
  }));
}

function queryResults(client, q) {
  return new Promise((resolve, reject) => {
    const gmail = google.gmail('v1');
    gmail.users.messages.list({
      auth: client,
      q,
      userId: 'me',
      maxResults: 1000,
    }, (err, response) => {
      if (err) {
        return reject({ base: [`There was a problem searching for gmail messages ${err}`] });
      }

      if (!response.messages) {
        return resolve({ totalResults: 0, totalResultsIds: [] });
      }

      const totalResultsIds = response.messages.map((message) => { return message.id; });
      return resolve({ totalResults: response.resultSizeEstimate, totalResultsIds, moreResults: !!(response.nextPageToken) });
    });
  });
}

export function searchMessages(account, searchOptions) {
  return new Promise((resolve, reject) => {
    const client = getClient(account.authProps.token);
    const gmail = google.gmail('v1');
    const q = googlifyFilter(searchOptions);

    queryResults(client, q)
    .then((results) => {
      gmail.users.messages.list({
        auth: client,
        q,
        userId: 'me',
        pageToken: searchOptions.pageToken,
        maxResults: config.emailsPerPage,
      }, (err, response) => {
        if (err) {
          return reject({ base: [`There was a problem searching for gmail messages ${err}`] });
        }

        if (!response.messages) {
          return resolve({
            messages: [],
            totalResults: 0,
            totalResultsIds: [],
            resultsPerPage: config.emailsPerPage,
          });
        }

        getMessagesById(client, response.messages.map((m) => { return m.id; }), { format: 'metadata' })
        .then((messages) => {
          resolve({
            nextPageToken: response.nextPageToken,
            messages,
            totalResults: results.totalResults,
            moreThanTotalResults: results.moreResults,
            resultsPerPage: config.emailsPerPage,
            resultsCount: response.messages.length,
          });
        });
      });
    });
  });
}

export function searchMessagesStream(account, searchOptions, countCb, errCb) {
  const messageStream = stream.PassThrough(); // eslint-disable-line new-cap
  const client = getClient(account.authProps.token);
  const gmail = google.gmail('v1');
  const q = googlifyFilter(searchOptions);

  gmail.users.messages.list({
    auth: client,
    q,
    userId: 'me',
    maxResults: config.maxFilteredEmails,
    singleEvents: true,
  }, (err, response) => {
    if (err) {
      errCb({ base: [`There was a problem searching for gmail messages ${err}`] });
      messageStream.end();
      return;
    }

    if (!response.messages || response.messages.length < 1) {
      const count = response.messages ? response.messages.length : 0;
      countCb(count);
      messageStream.end();
      return;
    }

    countCb(response.resultSizeEstimate);
    if (response.resultSizeEstimate > config.maxFilteredEmails) {
      errCb({ base: [`${response.resultSizeEstimate} results. Please narrow your search parameters.`] });
      messageStream.end();
      return;
    }

    const messagePromise = Promise.all(response.messages.map((message) => {
      return new Promise((resolve) => {
        gmail.users.messages.get({
          id: message.id,
          auth: client,
          userId: 'me',
          format: 'raw',
        }, (messageErr, messageResponse) => {
          if (messageErr) {
            errCb({ base: [`There was a problem getting the gmail thread - ${messageErr}`] });
            messageStream.end();
            return;
          }

          const mailparser = new MailParser();
          mailparser.on('end', (msgObj) => {
            try {
              messageStream.write(new Buffer(JSON.stringify(msgObj)));
            } catch (err) { console.log('error', err); } // eslint-disable-line no-shadow
            resolve();
          });

          mailparser.write(base64.decode(messageResponse.raw));
          mailparser.end();
        });
      });
    }))
    .then(() => {
      messageStream.end();
    });

    messageStream.on('finished', () => {
      messagePromise.resolve();
    });
  });

  return messageStream;
}

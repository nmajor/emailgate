require('dotenv').config();
import google from 'googleapis';
import GoogleAuth from 'google-auth-library';
import { MailParser } from 'mailparser';
import base64 from 'base64url';
import { googlifyFilter } from './helpers';
import stream from 'stream';
// import _ from 'lodash';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

function getAuthUrl(client) {
  return new Promise((resolve) => {
    const options = {
      access_type: 'offline',
      approval_prompt: 'force',
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

function getClient(token) {
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

export function getGoogleProfile(account) {
  return new Promise((resolve) => {
    const client = getClient(account.authProps.token);
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

export function searchMessages(account, searchOptions) {
  const messageStream = stream.PassThrough(); // eslint-disable-line new-cap
  const client = getClient(account.authProps.token);
  const gmail = google.gmail('v1');
  const q = googlifyFilter(searchOptions);

  gmail.users.messages.list({
    auth: client,
    q,
    userId: 'me',
  }, (err, response) => {
    if (err) {
      console.log(`There was a problem searching for gmail messages ${err}`);
      return;
    }

    Promise.all(response.messages.map((message) => {
      return new Promise((resolve) => {
        gmail.users.messages.get({
          id: message.id,
          auth: client,
          userId: 'me',
          format: 'raw',
        }, (messageErr, messageResponse) => {
          if (messageErr) {
            console.log(`There was a problem getting the gmail thread ${err}`);
            return;
          }

          const mailparser = new MailParser();
          mailparser.on('end', (msgObj) => {
            messageStream.write(new Buffer(JSON.stringify(msgObj)));
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
  });

  return messageStream;
}

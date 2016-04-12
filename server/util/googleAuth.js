require('dotenv').config();
// import google from 'googleapis';
import GoogleAuth from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

function getAuthUrl(client) {
  return new Promise((resolve) => {
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

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
      resolve(token, client);
    });
  });
}

function getClient() {
  return new Promise((resolve) => {
    const credentials = JSON.parse(process.env.GOOGLE_API_CREDENTIALS);
    const clientSecret = credentials.web.client_secret;
    const clientId = credentials.web.client_id;
    const redirectUrl = credentials.web.redirect_uris[0];
    const auth = new GoogleAuth();
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    resolve(oauth2Client);
  });
}

export function getGoogleAuthUrl() {
  return getClient()
  .then(getAuthUrl);
}

export function getGoogleAuthToken(code) {
  return getClient()
  .then((client) => {
    return getAuthToken(client, code);
  });
}

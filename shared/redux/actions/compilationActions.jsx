import * as ActionTypes from '../constants';
// import socket from '../../../client/socket';
// import fetch from 'isomorphic-fetch';

// import baseURL from '../../baseURL';

export function setCompilationEmails(emails) {
  return {
    type: ActionTypes.SET_COMPILATION_EMAILS,
    emails,
  };
}

// export function addEmailsToCompilation(compilationId, emails) {
//   return (dispatch) => {
//     dispatch(setSavingFor(true));
//     socket.emit('GET_FILTERED_ACCOUNT_EMAILS', { account, filter });
//   };
// }

// export function addEmailsToCompilation(compilationId, emails) {
//   return (dispatch) => {
//     return fetch(`${baseURL}/api/compilations/${compilationId}/add-emails`, {
//       credentials: 'include',
//       method: 'post',
//       body: JSON.stringify({ emails }),
//       headers: new Headers({ 'Content-Type': 'application/json' }),
//     })
//     .then((res) => {
//       if (res.status >= 400) {
//         throw new Error(`Bad response from server ${res.status} ${res.statusText}`);
//       }
//
//       return res.json();
//     })
//     .then((res) => {
//       if (res.error) {
//         throw new Error(res.error.message);
//       }
//       dispatch(setCompilationEmails(res));
//     })
//     .catch((err) => {
//       console.log(err.message);
//       // dispatch(setUserErrors({ base: [err.message] }));
//     });
//   };
// }

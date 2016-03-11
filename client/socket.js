import io from 'socket.io-client';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';
let socket;

if (typeof window !== 'undefined') {
  socket = io(baseURL);

  socket.on('UPDATE_ACCOUNT_IN_ACCOUNTS', (data) => {
    console.log('Recieved UPDATE_ACCOUNT_IN_ACCOUNTS');
    console.log(data);
  });
}

export default socket;

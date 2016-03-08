import io from 'socket.io-client';

const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';
let socket;

if (typeof window !== 'undefined') {
  socket = io(baseURL);

  socket.on('REGISTER_USER_RESULTS', (data) => {
    console.log('Recieved REGISTER_USER_RESULTS');
    console.log(data);
  });

  socket.on('LOGIN_USER_RESULTS', (data) => {
    console.log('Recieved LOGIN_USER_RESULTS');
    console.log(data);
  });

  socket.on('SET_USER', (data) => {
    console.log('Recieved SET_USER');
    console.log(data);
  });
}

export default socket;

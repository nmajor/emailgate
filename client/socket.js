import io from 'socket.io-client';
const baseURL = typeof window === 'undefined' ? process.env.BASE_URL || (`http://localhost:${(process.env.PORT || 8000)}`) : '';
const socket = io(baseURL);

socket.on('emails', () => {
  // console.log('superman');
});

export default socket;

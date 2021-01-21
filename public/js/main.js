const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users name
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Message received from server
socket.on('message', (msg) => {
  outputMessage(msg);

  // Scroll down to the newer message
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // play the new message notification sound
  // if the message is sent by other user
  if (msg.username !== username) {
    const sound = new Audio('../sound/message-sound.ogg');
    sound.loop = false;
    sound.play();
  }
});

// Message submitted by user
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get text message
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // empty the form, and set the focus on it
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// show the message to the DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;

  document.querySelector('.chat-messages').appendChild(div);
}

// Show the name of the room
function outputRoomName(room) {
  roomName.innerText = room;
}

// Show the users inside the room
function outputRoomUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join('')}`;
}

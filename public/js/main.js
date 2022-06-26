const socket = io();
const $form = document.getElementById('chat-form');
const $chatInput = document.getElementById('msg');
const $leaveChatBtn = document.getElementById('leave-btn');
const $roomName = document.getElementById('room-name');
const $users = document.getElementById('users');
const $messageContainer = document.querySelector('.chat-messages');
const searchParams = new URLSearchParams(window.location.search);
const username = searchParams.get('username');
const room = searchParams.get('room');

socket.emit('joinRoom', { username, room });

socket.on('message', ({ username, time, text }) => {
  const $chatBubble = document.createElement('div');
  $chatBubble.classList.add('message');
  $chatBubble.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
  <p class="text">${text}</p>`;

  $messageContainer.appendChild($chatBubble);
  $messageContainer.scrollTop = $messageContainer.scrollHeight;
});

socket.on('roomUsers', ({ users, room }) => {
  $roomName.innerText = room;
  $users.innerHTML = `${users.map(({username}) => `<li>${username}</li>`).join('')}`;
});

$form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = $chatInput.value;

  socket.emit('chatMessage', message);
  $chatInput.value = '';
  $chatInput.focus();
});

$leaveChatBtn.addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location.href = '/';
  }
});



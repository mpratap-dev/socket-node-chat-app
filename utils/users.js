const users = {};

const joinUser = ({ id, username, room }) => {
  users[id] = { username, room };
  return { id, username, room };
};

const getCurrentUser = (id) => users[id];

const userLeaves = (id) => {
  const userLeaving = users[id];
  delete users[id];
  return userLeaving || {};
}

const getRoomUsers = (room) => {
  return Object.values(users).filter((user) => user.room === room);
}

module.exports = {
  joinUser, getCurrentUser, userLeaves, getRoomUsers
};

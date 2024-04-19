let gameActive = true;
const defaultState = ["", "", "", "", "", "", "", "", ""];
let gameState = defaultState;
let currentPlayer = "X";

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

var socket;
var player_id;
var room_id = "game_1";

$(function () {
  initSocket();
});

function initSocket() {
  socket = io("http://localhost:8000");

  socket.on("connect", function () {
    console.log("Connected to server");
  });

  socket.on("success_connection", function (data) {
    player_id = data.user_id;
    console.log("Player ID: " + player_id);

    initGameServer();
  });
}

function initGameServer() {
  // - room joining
  var roomData = {
    rooms: [room_id],
  };
  socket.emit("join_room", roomData);
}

$(document).on("click", ".tic-box", function () {
  var index = $(this).data("index");

  if (!gameActive || gameState[index] !== "") {
    return;
  }

  gameState[index] = currentPlayer;
  $(this).text(currentPlayer);

  if (checkWin() || checkDraw()) {
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
});

function checkWin() {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];

    if (
      gameState[a] !== "" &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      setTimeout(() => {
        alert(`${gameState[a]} wins!`);
        $(".restart-btn").click();
      }, 100);
      return true;
    }
  }
  return false;
}

function checkDraw() {
  if (!gameState.includes("")) {
    setTimeout(() => {
      alert("It's a draw!");
      $(".restart-btn").click();
    }, 100);
    return true;
  }
  return false;
}

$(document).on("click", ".restart-btn", function () {
  gameActive = true;
  currentPlayer = "X";
  gameState = defaultState;
  $(".tic-box").text("");
});

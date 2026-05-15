const FINISH = 48;

let players = [];
let currentTurn = 0;
let waitingQuestion = false;
let gameFinished = false;

const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];

/*
  POSISI KOTAK 1-48
  Sudah disesuaikan dengan papan.
*/

const cellPositions = {
  // BARIS BAWAH
  1:{x:16,y:91},
  2:{x:30,y:91},
  3:{x:44,y:91},
  4:{x:58,y:91},
  5:{x:72,y:91},
  6:{x:86,y:91},

  // BARIS 2
  7:{x:86,y:78},
  8:{x:72,y:78},
  9:{x:58,y:78},
  10:{x:44,y:78},
  11:{x:30,y:78},
  12:{x:16,y:78},

  // BARIS 3
  13:{x:16,y:66},
  14:{x:30,y:66},
  15:{x:44,y:66},
  16:{x:58,y:66},
  17:{x:72,y:66},
  18:{x:86,y:66},

  // BARIS 4
  19:{x:86,y:54},
  20:{x:72,y:54},
  21:{x:58,y:54},
  22:{x:44,y:54},
  23:{x:30,y:54},
  24:{x:16,y:54},

  // BARIS 5
  25:{x:16,y:43},
  26:{x:30,y:43},
  27:{x:44,y:43},
  28:{x:58,y:43},
  29:{x:72,y:43},
  30:{x:86,y:43},

  // BARIS 6
  31:{x:86,y:31},
  32:{x:72,y:31},
  33:{x:58,y:31},
  34:{x:44,y:31},
  35:{x:30,y:31},
  36:{x:16,y:31},

  // BARIS 7
  37:{x:16,y:20},
  38:{x:30,y:20},
  39:{x:44,y:20},
  40:{x:58,y:20},
  41:{x:72,y:20},
  42:{x:86,y:20},

  // BARIS ATAS
  43:{x:86,y:8},
  44:{x:72,y:8},
  45:{x:58,y:8},
  46:{x:44,y:8},
  47:{x:30,y:8},
  48:{x:16,y:8}
};

/*
  KOTAK KHUSUS
*/

const boomCells = [
  2,7,11,14,21,26,29,32,39,43,46
];

const challengeCells = [
  3,5,8,13,16,19,24,27,31,35,37,40,44,47
];

const factCells = [
  9,15,18,22,33,42,48
];

/*
  MERIAM
*/

const cannonMove = {
  6:17,
  17:30
};

/*
  PEROSOTAN
*/

const slideMove = {
  10:4,
  25:20,
  45:34
};

/*
  SOAL
*/

const boomCards = [

  {
    q:"Apa yang dimaksud gerak parabola?",
    a:"Gerak benda dengan lintasan berbentuk parabola."
  },

  {
    q:"Mengapa lintasan gerak proyektil melengkung?",
    a:"Karena dipengaruhi gravitasi."
  },

  {
    q:"Apa yang terjadi pada kecepatan vertikal di titik tertinggi?",
    a:"Bernilai nol."
  }

];

const challengeCards = [

  {
    q:"Rumus kecepatan horizontal?",
    a:"vx = v0 cos θ"
  },

  {
    q:"Rumus kecepatan vertikal?",
    a:"vy = v0 sin θ"
  },

  {
    q:"Sudut yang menghasilkan jangkauan maksimum?",
    a:"45°"
  }

];

const factCards = [

  "Gerak parabola adalah gabungan GLB dan GLBB.",

  "Kecepatan horizontal bernilai tetap.",

  "Percepatan gravitasi selalu ke bawah.",

  "Di titik tertinggi kecepatan vertikal sesaat nol."

];

const quickQuestions = [

  {
    q:"Jika vx = 5 m/s selama 4 sekon, berapa jaraknya?",
    a:"20 meter"
  },

  {
    q:"Jika vy = 20 m/s dan g = 10 m/s², waktu ke titik tertinggi?",
    a:"2 sekon"
  }

];

/*
  MULAI GAME
*/

function startGame(){

  players = [

    {
      name:document.getElementById("p1").value || "Pemain 1",
      position:1,
      pawnClass:"pawn1"
    },

    {
      name:document.getElementById("p2").value || "Pemain 2",
      position:1,
      pawnClass:"pawn2"
    },

    {
      name:document.getElementById("p3").value || "Pemain 3",
      position:1,
      pawnClass:"pawn3"
    },

    {
      name:document.getElementById("p4").value || "Pemain 4",
      position:1,
      pawnClass:"pawn4"
    }

  ];

  currentTurn = 0;
  waitingQuestion = false;
  gameFinished = false;

  document
    .getElementById("setup")
    .classList
    .add("hidden");

  document
    .getElementById("game")
    .classList
    .remove("hidden");

  addLog("Permainan dimulai dari START.");

  render();
}

/*
  RENDER
*/

function render(){

  document.getElementById("turnName")
    .textContent = players[currentTurn].name;

  renderPawns();

  renderStatus();
}

function renderPawns(){

  const layer =
    document.getElementById("pawnLayer");

  layer.innerHTML = "";

  players.forEach((player,index)=>{

    const pos =
      cellPositions[player.position];

    const pawn =
      document.createElement("div");

    pawn.className =
      `pawn ${player.pawnClass}`;

    pawn.textContent = index + 1;

    pawn.style.left =
      `calc(${pos.x}% + ${index*8-12}px)`;

    pawn.style.top =
      `calc(${pos.y}% + ${index*8-12}px)`;

    layer.appendChild(pawn);

  });

}

function renderStatus(){

  const box =
    document.getElementById("playerStatus");

  box.innerHTML = "";

  players.forEach((player,index)=>{

    box.innerHTML += `
      <div class="player-card">
        <b>${index+1}. ${player.name}</b><br>
        Posisi: ${player.position}
      </div>
    `;

  });

}

/*
  DADU
*/

function rollDice(){

  if(waitingQuestion || gameFinished)
    return;

  const dice =
    document.getElementById("dice");

  const btn =
    document.getElementById("rollBtn");

  btn.disabled = true;

  dice.classList.add("rolling");

  let count = 0;

  const interval = setInterval(()=>{

    const temp =
      Math.floor(Math.random()*6);

    dice.textContent =
      diceFaces[temp];

    count++;

    if(count >= 12){

      clearInterval(interval);

      dice.classList.remove("rolling");

      const result =
        Math.floor(Math.random()*6)+1;

      dice.textContent =
        diceFaces[result-1];

      document
        .getElementById("diceResult")
        .textContent = result;

      movePlayer(result);

      btn.disabled = false;

    }

  },80);

}

/*
  GERAK PEMAIN
*/

function movePlayer(dice){

  const player =
    players[currentTurn];

  player.position += dice;

  if(player.position >= FINISH){

    player.position = FINISH;

    render();

    winGame(player);

    return;
  }

  addLog(
    `${player.name} melempar dadu ${dice} dan maju ke ${player.position}`
  );

  render();

  setTimeout(()=>{

    checkSpecialCell();

  },400);

}

/*
  CEK KOTAK KHUSUS
*/

function checkSpecialCell(){

  const player =
    players[currentTurn];

  // MERIAM
  if(cannonMove[player.position]){

    const old =
      player.position;

    player.position =
      cannonMove[player.position];

    addLog(
      `${player.name} naik meriam dari ${old} ke ${player.position}`
    );

    render();

    showFactCard();

    return;
  }

  // PEROSOTAN
  if(slideMove[player.position]){

    const old =
      player.position;

    player.position =
      slideMove[player.position];

    addLog(
      `${player.name} turun perosotan dari ${old} ke ${player.position}`
    );

    render();

    showQuickQuestion();

    return;
  }

  // BOOM
  if(boomCells.includes(player.position)){

    showBoomCard();

    return;
  }

  // TANTANGAN
  if(challengeCells.includes(player.position)){

    showChallengeCard();

    return;
  }

  // FAKTA
  if(factCells.includes(player.position)){

    showFactCard();

    return;
  }

  nextTurn();

}

/*
  BOOM
*/

function showBoomCard(){

  waitingQuestion = true;

  const card =
    randomItem(boomCards);

  const box =
    document.getElementById("questionBox");

  box.className =
    "question-box boom";

  box.classList.remove("hidden");

  box.innerHTML = `
    <h3>Kartu BOOM</h3>

    <p><b>Soal:</b> ${card.q}</p>

    <details>
      <summary>Lihat Jawaban</summary>
      <p>${card.a}</p>
    </details>

    <button onclick="answerBoom(true)">
      Benar
    </button>

    <button onclick="answerBoom(false)">
      Salah
    </button>
  `;
}

function answerBoom(correct){

  const player =
    players[currentTurn];

  if(correct){

    player.position += 2;

    addLog(
      `${player.name} menjawab benar dan maju 2 langkah`
    );

  }else{

    player.position -= 1;

    addLog(
      `${player.name} menjawab salah dan mundur 1 langkah`
    );

  }

  fixPosition(player);

  closeQuestion();

  render();

  nextTurn();

}

/*
  TANTANGAN
*/

function showChallengeCard(){

  waitingQuestion = true;

  const card =
    randomItem(challengeCards);

  let options = "";

  players.forEach((player,index)=>{

    if(index !== currentTurn){

      options += `
        <option value="${index}">
          ${player.name}
        </option>
      `;

    }

  });

  const box =
    document.getElementById("questionBox");

  box.className =
    "question-box challenge";

  box.classList.remove("hidden");

  box.innerHTML = `
    <h3>Kartu Tantangan</h3>

    <p><b>Soal:</b> ${card.q}</p>

    <details>
      <summary>Lihat Jawaban</summary>
      <p>${card.a}</p>
    </details>

    <h4>Jawab Sendiri</h4>

    <button onclick="answerChallengeSelf(true)">
      Benar
    </button>

    <button onclick="answerChallengeSelf(false)">
      Salah
    </button>

    <h4>Lempar ke Lawan</h4>

    <select id="targetPlayer">
      ${options}
    </select>

    <button onclick="throwChallenge(true)">
      Lawan Benar
    </button>

    <button onclick="throwChallenge(false)">
      Lawan Salah
    </button>
  `;
}

function answerChallengeSelf(correct){

  const player =
    players[currentTurn];

  if(correct){

    player.position += 2;

    addLog(
      `${player.name} menjawab tantangan benar`
    );

  }else{

    player.position -= 1;

    addLog(
      `${player.name} menjawab tantangan salah`
    );

  }

  fixPosition(player);

  closeQuestion();

  render();

  nextTurn();

}

function throwChallenge(targetCorrect){

  const player =
    players[currentTurn];

  const targetIndex =
    Number(
      document.getElementById("targetPlayer").value
    );

  const target =
    players[targetIndex];

  if(targetCorrect){

    target.position += 2;

    player.position -= 1;

  }else{

    player.position += 2;

    target.position -= 1;

  }

  fixPosition(player);

  fixPosition(target);

  closeQuestion();

  render();

  nextTurn();

}

/*
  FAKTA
*/

function showFactCard(){

  waitingQuestion = true;

  const fact =
    randomItem(factCards);

  const box =
    document.getElementById("questionBox");

  box.className =
    "question-box fact";

  box.classList.remove("hidden");

  box.innerHTML = `
    <h3>Kartu Fakta</h3>

    <p>${fact}</p>

    <button onclick="finishFact()">
      Sudah Dibaca
    </button>
  `;
}

function finishFact(){

  closeQuestion();

  nextTurn();

}

/*
  HITUNG CEPAT
*/

function showQuickQuestion(){

  waitingQuestion = true;

  const card =
    randomItem(quickQuestions);

  const box =
    document.getElementById("questionBox");

  box.className =
    "question-box quick";

  box.classList.remove("hidden");

  box.innerHTML = `
    <h3>Soal Hitung Cepat</h3>

    <p><b>Soal:</b> ${card.q}</p>

    <details>
      <summary>Lihat Jawaban</summary>
      <p>${card.a}</p>
    </details>

    <button onclick="finishQuickQuestion()">
      Selesai
    </button>
  `;
}

function finishQuickQuestion(){

  closeQuestion();

  nextTurn();

}

/*
  UTIL
*/

function closeQuestion(){

  waitingQuestion = false;

  const box =
    document.getElementById("questionBox");

  box.classList.add("hidden");

  box.innerHTML = "";

}

function nextTurn(){

  if(gameFinished) return;

  currentTurn++;

  if(currentTurn >= players.length){

    currentTurn = 0;

  }

  render();

}

function fixPosition(player){

  if(player.position < 1){

    player.position = 1;

  }

  if(player.position > FINISH){

    player.position = FINISH;

  }

}

function winGame(player){

  gameFinished = true;

  render();

  addLog(
    `${player.name} mencapai FINISH dan menang!`
  );

  alert(`${player.name} MENANG!`);

  document
    .getElementById("rollBtn")
    .disabled = true;

}

function randomItem(array){

  return array[
    Math.floor(Math.random()*array.length)
  ];

}

function addLog(text){

  const box =
    document.getElementById("logBox");

  box.innerHTML =
    `<p>${text}</p>` + box.innerHTML;

}
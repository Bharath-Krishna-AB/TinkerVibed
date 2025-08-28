const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score1 = 0;
let score2 = 0;
let playercount = 0;
let playerturn = true;
let cardsfound = 0


document.querySelector(".score1").textContent = score1;
document.querySelector(".score2").textContent = score2;


fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back" onClick="playMyAudio()"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  playercount = playercount + 1;
  if ((playercount % 2) == 0){
    changePlayer();
  }

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch){
    cardsfound = cardsfound + 1;
  }
  if(isMatch){
    if (playerturn){
        score1++;
        document.querySelector(".score1").textContent = score1;
    }else{
        score2++;
        document.querySelector(".score2").textContent = score2;
    }

    if (cardsfound == 6){
        console.log("game over");
        const winnerContainer = document.querySelector(".winner-container");
        const winnerText = document.querySelector(".winner");
        const gridContainer = document.querySelector(".grid-container");
        gridContainer.style.display = "none";
        winnerContainer.style.display = "flex";
        if (score1 > score2){
            winnerText.textContent = "Player 1 Wins!";
        
        }else{
            winnerText.textContent = "Player 2 Wins!";
        }
    }
  }

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score1 = 0;
  score2 = 0;
  cardsfound = 0;
  playercount = 0;
  playerturn = true;
  const winnerContainer = document.querySelector(".winner-container");
  const winnerText = document.querySelector(".winner");
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.style.display = "grid";
  winnerContainer.style.display = "none";
  document.querySelector(".score1").textContent = score1;
  document.querySelector(".score2").textContent = score2;
  gridContainer.innerHTML = "";
  generateCards();
}

function changePlayer() {
  if (playerturn === true) {
    playerturn = false;
  }else {
    playerturn = true;
  }
}


function playMyAudio(){
       document.getElementById("myAudio").play();
}
var cards = document.querySelectorAll('.memory-card');
const hardCards = ['java', 'python', 'react', 'bootstrap', 'aws', 'angular'];
var totalClicks = 0;
var timeStart;
var hardMode = false;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// <== Main Game Methods ==>
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    addClickCount();
    return;
  }

  secondCard = this;
  addClickCount();
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  //Unflip the cards so when board reset it's ready to go again
  firstCard.classList.remove('flip');
  secondCard.classList.remove('flip');
  
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  
  //Hide correct cards from view
  firstCard.style.visibility="hidden";
  secondCard.style.visibility="hidden";
  resetBoard();
}

function unflipCards(timeout = 1500) {
  lockBoard = true;

  setTimeout(() => {
    try {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
    } catch (e) {
      console.error(e);
      console.log("NOTE: Possible Cause is Game Reset Already In Progress - Flip Class Removal Error");
    } finally {
      resetBoard();
    }
  }, timeout);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  checkWin();
}

function shuffleCards(){
  //Refresh card array because level may have changed
  cards = document.querySelectorAll('.memory-card');

  //Make sure all cards are set to face down
  if (firstCard != null || secondCard != null) {
    unflipCards(0);
  }

  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
    card.style.visibility = "visible";
    card.addEventListener('click', flipCard);
  });

  resetCounter();
  timeStart = new Date(); //Current time to compare with finish time
}
// <== END Main Game Methods ==>

// <== Difficulty Change Methods ==>
function changeDifficulty() {
  let difficultyButton = document.getElementById('change-difficulty');
  let modeText = "Difficulty: ";

  if (hardMode) { //Hard => Normal
    difficultyButton.innerHTML = modeText + "Normal";
    difficultyButton.classList.remove('hardButton');
    hardMode = false;
    modifyGameBoardWidth('normal');
    addRemoveHardCards('remove');
    adjustCardWidth("calc(25% - 10px)");
    shuffleCards();
  } else if (!hardMode) { //Normal => Hard
    difficultyButton.innerHTML = modeText + "Hard";
    difficultyButton.classList.add('hardButton');
    hardMode = true;
    modifyGameBoardWidth('hard');
    addRemoveHardCards('add');
    adjustCardWidth('calc(12% - 10px)');
    shuffleCards();
  }
} 

function addMemoryCard(cardName) {
  var gameBoardDiv = document.getElementById('gameBoard');

  //Inject 2 New Divs for Matching Cards
  for (let i = 0; i < 2; i++) {
    var div = document.createElement('div');
    div.className = 'memory-card';
    div.dataset.framework = cardName;
    gameBoardDiv.appendChild(div);
    }

  //Grab both new Divs
  var newMemoryCard = document.querySelectorAll('[data-framework=' + cardName + ']');

  for (let i = 0; i < newMemoryCard.length; i++) {
    //Create images for card front and back
    var newCardFront = document.createElement('img');
    newCardFront.className = 'front-face';
    newCardFront.src = 'images/' + cardName +'.png';
    newCardFront.alt = cardName;

    var newCardBack = document.createElement('img');
    newCardBack.className = 'back-face';
    newCardBack.src = 'images/SSD.png';
    newCardBack.alt = 'SSD';
    
    //Inject Images into each Div
    newMemoryCard[i].appendChild(newCardFront);
    newMemoryCard[i].appendChild(newCardBack);
  }
}

function addRemoveHardCards(operation){
  if(operation == 'add') {
    hardCards.forEach(hardCard => {
      addMemoryCard(hardCard);
    });
  } else if (operation == 'remove') {
    hardCards.forEach(hardCard => {
      var cardToRemove = document.querySelectorAll('[data-framework=' + hardCard + ']');
      for (let i = 0; i < cardToRemove.length; i++){
        cardToRemove[i].remove();
      }
    });
  }
}
// <== END Difficulty Change Methods ==>

// <== Document Styling Methods ==>
function modifyGameBoardWidth(difficulty) {
  let gameBoard = document.getElementById('gameBoard').style;  
  if (difficulty == 'hard') {
    gameBoard.width = "1200px";
  } else if (difficulty == 'normal') {
    gameBoard.width = "640px";
  }
}

function adjustCardWidth(newWidth){
  let cardToAdjust = document.getElementsByClassName('memory-card');
  for (i = 0; i < cardToAdjust.length; i++) {
    cardToAdjust[i].style.width = newWidth;
  }
}
// <== End Document Styling Methods ==>

// <=== Display Methods ==>
function checkWin() {

  //Check How Many Matched Cards 
  //Bypass if Total Clicks < # of Cards because
  //No possible way they have won
  if (totalClicks >= cards.length) {
    var totalMatched = 0;

    cards.forEach(card => {
      if (card.style.visibility == "hidden"){
        totalMatched += 1;
      }
    })

    if (totalMatched == cards.length){
      var timeTaken = new Date();
      var timeDifference = timeTaken - timeStart;

      alert("CONGRATULATIONS!\n" +
            "You needed " + totalClicks + " clicks and took " + msToTime(timeDifference) + " to finish the game\n\n" +
            "Want To Play Again? Press The 'Restart Game' Button Play Again");
    }
  }
}

function displayCounter(){
  document.getElementById("click-counter").innerHTML= "# of Clicks: " + totalClicks;
}

function addClickCount() {
  totalClicks += 1;
  displayCounter();
}

function resetCounter(){
  totalClicks = 0;
  displayCounter();
}

function msToTime(duration) {
  // var milliseconds = parseInt((duration%1000)/100);
   var seconds = parseInt((duration/1000)%60);
   var minutes = parseInt((duration/(1000*60))%60);
   var hours = parseInt((duration/(1000*60*60))%24);
 
   hours = (hours < 10) ? "0" + hours : hours;
   minutes = (minutes < 10) ? "0" + minutes : minutes;
   seconds = (seconds < 10) ? "0" + seconds : seconds;
 
   return hours + ":" + minutes + ":" + seconds;
 }
 // <=== END Display Methods ==>

//Auto-Launch Game
(function startGame() {
  shuffleCards();
})();
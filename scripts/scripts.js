const cards = document.querySelectorAll('.memory-card');
var totalClicks = 0;
var timeStart;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

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

function checkWin() {
  var totalMatched = 0;
  
  //Check How Many Matched Cards
  cards.forEach(card => {
    if (card.style.visibility == "hidden"){
      totalMatched += 1;
    }
  })

  if (totalMatched == cards.length){
    var timeTaken = new Date();
    var timeDifference = timeTaken - timeStart;

    alert("CONGRATULATIONS!\n" +
          "You took: " + msToTime(timeDifference) + " to finish the game\n\n" +
          "Want To Play Again? Press The 'Restart Game' Button Play Again");
  }
}

function displayCounter(){
  document.getElementById("click-counter").innerHTML= "# of Clicks: " + totalClicks;
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

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
  checkWin();
}

function shuffleCards(){
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
    card.style.visibility = "visible";
  });

  cards.forEach(card => card.addEventListener('click', flipCard));
  resetCounter();
  timeStart = new Date();
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
 
(function startGame() {
  shuffleCards();
})();
const BOARD_SIZE = 16;
const color = ['red', 'blue', 'purple', 'yellow', 'green', 'pink', 'white', 'black'];
let card = [];
let cardColor = [];
let score = 0;
let flipTime = 0;
let completeMinute = 0;
let completeSecond = 0;
let completeTime = '';
let timer = null;
let firstCardIndex = -1;
let secondCardIndex = -1;
let selectedFirstCard = false;
let selectedSecondCard = false;

function initGame() {
    // Add color to array
    for (let i = 0; i < BOARD_SIZE / 2; i++) {
        cardColor.push(color[i]);
        cardColor.push(color[i]);
    }
    // Shuffle the array
    cardColor.sort(() => Math.random() - 0.5);
    //Create cards 
    for (let i = 0; i < BOARD_SIZE; i++) {
        let cardElement = document.createElement('button');
        cardElement.classList.add('card-' + i);
        cardElement.onclick = function () { flipCard(i); }
        cardElement.setAttribute('data-color', cardColor[i]);
        cardElement.setAttribute('matched', false);
        cardElement.style.backgroundColor = '#fbecc1';
        document.querySelector('.game-pattern').appendChild(cardElement);
    }
    //Disabled the button after clicked to prevent create multiple cards
    document.querySelector('.start-btn').disabled = true;
    console.log('Hi');
    //Start timer and give it a way to stop it
    timer = setInterval(function () {
        completeSecond++;
        if (completeSecond == 60) {
            completeSecond = 0;
            completeMinute++;
        }
        completeTime = completeMinute.toString().padStart(2, '0') + ':' + completeSecond.toString().padStart(2, '0');
        document.getElementById('timer').innerHTML = completeTime;
    }, 1000);

}


function flipCard(cardIndex) {

    //Disable the card after clicked
    let cardSelected = document.querySelector('.card-' + cardIndex);
    cardSelected.style.backgroundColor = cardSelected.getAttribute('data-color');
    cardSelected.style.cursor = 'not-allowed';
    cardSelected.setAttribute('disabled', true);
    let audio = new Audio('audio/click.mp3');
    audio.play();
    if (!selectedFirstCard) {
        firstCardIndex = cardIndex;
        selectedFirstCard = true;
    } else {
        secondCardIndex = cardIndex;
        selectedSecondCard = true;
    }
    //Compare color of 2 cards
    if (selectedFirstCard && selectedSecondCard) {
        //Increase the flip time
        flipTime++;
        document.getElementById('flip-time').innerHTML = flipTime;
        if (cardColor[firstCardIndex] == cardColor[secondCardIndex]) {
            score++;
            if (score == 8) {
                document.querySelector('.win-annoucement').textContent = `You win! Your time: ${completeTime}. You flipped ${flipTime} pairs.`;
                clearInterval(timer);
                let audio = new Audio('audio/win.mp3');
                audio.volume = 0.75;
                audio.play();
                //End the game
                return;
            }
            //Mark the cards as matched
            document.getElementsByClassName('card-' + firstCardIndex)[0].setAttribute('matched', true);
            document.getElementsByClassName('card-' + secondCardIndex)[0].setAttribute('matched', true);
            //Play the audio
            let audio = new Audio('audio/correct.mp3');
            audio.volume = 0.5;
            audio.play();
        } 
        else {
            //Disable all cards in 1 second
            document.querySelectorAll('.game-pattern button').forEach((item) => {
                item.setAttribute('disabled', true);
                item.style.cursor = 'not-allowed';
            });
            //Change the color of the cards back to default
            setTimeout(function () {
                document.querySelector('.card-' + firstCardIndex).style.backgroundColor = '#fbecc1';
                document.querySelector('.card-' + secondCardIndex).style.backgroundColor = '#fbecc1';
                //Enable all cards which are not matched
                document.querySelectorAll('.game-pattern button').forEach((item) => {
                    if (item.getAttribute('matched') == 'false') {
                        item.removeAttribute('disabled');
                        item.style.cursor = 'pointer';
                    }
                });
            }, 800);
            //Play the audio
            let audio = new Audio('audio/wrong.mp3');
            audio.volume = 0.5;
            audio.play();
        }
        selectedFirstCard = false;
        selectedSecondCard = false;
    }
}

function resetGame() {
    document.querySelector('.game-pattern').innerHTML = '';
    document.querySelector('.start-btn').disabled = false;
    document.getElementById('timer').innerHTML = '00:00';
    document.querySelector('.win-annoucement').textContent = '';
    card = [];
    cardColor = [];
    score = 0;
    flipTime = 0;
    document.getElementById('flip-time').innerHTML = flipTime;
    completeMinute = 0;
    completeSecond = 0;
    clearInterval(timer);
}
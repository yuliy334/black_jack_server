import express, { Request, Response } from 'express';
import { GameState, CardValue,Suit,Card } from './types/types';

const app = express();
const PORT = 9000;



const gameState: GameState = {
  gameCards: [],
  playerCards: [],
  playerPoints: 0,
  dilerCards: [],
  dilerPoints: 0,
  gameResult: ""
};


app.get('/games', (req: Request, res: Response) => {
    createGameCards();
    newGame();
    Check();
    res.send({
        dilerCards: gameState.dilerCards,
        dilerPoints: gameState.dilerPoints,

        playerCards: gameState.playerCards,
        playerPoints: gameState.playerPoints,

        gameResult: gameState.gameResult

    });
});
app.get('/games/hit', (req: Request, res: Response) => {

    addCard();
    Check();
    res.send({
        dilerCards: gameState.dilerCards,
        dilerPoints: gameState.dilerPoints,

        playerCards: gameState.playerCards,
        playerPoints: gameState.playerPoints,

        gameResult: gameState.gameResult
    });
});
app.get('/games/stand', (req: Request, res: Response) => {
    while (gameState.dilerPoints < 17) {
        dilerAddCard();
    }
    CheckAfterStand();
    res.send({
        dilerCards: gameState.dilerCards,
        dilerPoints: gameState.dilerPoints,

        playerCards: gameState.playerCards,
        playerPoints: gameState.playerPoints,

        gameResult: gameState.gameResult
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});




function createGameCards() {
    const suits = Object.values(Suit) as Suit[];
    console.log(suits);
    const ranks = Object.values(CardValue) as CardValue[];
    const cards: Card[] = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            cards.push({rank, suit});
        }
    }

    gameState.gameCards = cards;
}

function newGame() {
    gameState.dilerCards = [];
    gameState.playerCards = [];
    gameState.playerPoints = 0;
    gameState.dilerPoints = 0;
    gameState.gameResult = "";
    addCard();
    addCard();
    dilerAddCard();
    dilerAddCard();
}

function addCard() {
    let newCard: string = gameState.gameCards[Math.floor(Math.random() * (gameState.gameCards.length))];
    gameState.playerCards.push(newCard);
    gameState.gameCards = gameState.gameCards.filter((card) => card != newCard);

    let newCardValue: string = newCard.slice(0, -1);
    let newCardNumValue: number = Number(newCardValue);

    if (!isNaN(newCardNumValue)) {
        gameState.playerPoints += newCardNumValue;
    }
    else {
        if (newCardValue == "A") {
            if (gameState.playerPoints <= 10) {
                gameState.playerPoints += 11;
            }
            else {
                gameState.playerPoints += 1;
            }

        }
        else {
            gameState.playerPoints += 10;
        }
    }

}
function dilerAddCard() {
    let newCard: string = gameState.gameCards[Math.floor(Math.random() * (gameState.gameCards.length))];
    gameState.dilerCards.push(newCard);
    gameState.gameCards = gameState.gameCards.filter((card) => card != newCard);

    let newCardValue: string = newCard.slice(0, -1);
    let newCardNumValue: number = Number(newCardValue);

    if (!isNaN(newCardNumValue)) {
        gameState.dilerPoints += newCardNumValue;
    }
    else {
        if (newCardValue == "A") {
            if (gameState.dilerPoints <= 10) {
                gameState.dilerPoints += 11;
            }
            else {
                gameState.dilerPoints += 1;
            }

        }
        else {
            gameState.dilerPoints += 10;
        }
    }
}
function Check() {
    if (gameState.playerPoints > 22) {
        gameState.gameResult = "loose";
    }
}
function CheckAfterStand() {
    if (gameState.playerPoints < 22) {
        if (gameState.dilerPoints > 21) {
            gameState.gameResult = "win";
        }
        else {
            if (gameState.playerPoints > gameState.dilerPoints) {
                gameState.gameResult = "win";
            }
            else if (gameState.playerPoints < gameState.dilerPoints) {
                gameState.gameResult = "loose";

            }
            else {
                gameState.gameResult = "push";
            }
        }
    }
    else {
        gameState.gameResult = "loose";
    }
}
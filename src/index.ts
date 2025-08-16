import express, { Request, Response } from 'express';
import { GameState, CardValue, Suit, Card } from './types/types';
import cors from 'cors';

const app = express();
const PORT = 9000;

app.use(cors({
    origin: 'http://localhost:5173'
}));


const gameState: GameState = {
    gameCards: [],
    playerCards: [],
    playerPoints: { value: 0 },
    dilerCards: [],
    dilerPoints: { value: 0 },
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

    addCard(gameState.playerCards, gameState.playerPoints);
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
    while (gameState.dilerPoints.value < 17) {
        addCard(gameState.dilerCards, gameState.dilerPoints);
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
    // const suits = Object.values(Suit).filter((s) => typeof (s) === "number") as Suit[];
    // console.log(suits.values);
    // const ranks = Object.values(CardValue).filter((r) => typeof (r) === "number") as CardValue[];
    const suits: Suit[] = [Suit['♠'], Suit['♥'], Suit['♦'], Suit['♣']];
    const ranks: CardValue[] = [
        CardValue.two, CardValue.three, CardValue.four, CardValue.five, CardValue.six,
        CardValue.seven, CardValue.eight, CardValue.nine, CardValue.ten,
        CardValue.jack, CardValue.queen, CardValue.king, CardValue.ace
    ];

    const cards: Card[] = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            cards.push({ rank, suit });
        }
    }

    gameState.gameCards = cards;
}

function newGame() {
    gameState.dilerCards = [];
    gameState.playerCards = [];
    gameState.playerPoints = { value: 0 };
    gameState.dilerPoints = { value: 0 };
    gameState.gameResult = "";
    addCard(gameState.playerCards, gameState.playerPoints);
    addCard(gameState.playerCards, gameState.playerPoints);
    addCard(gameState.dilerCards, gameState.dilerPoints);
    addCard(gameState.dilerCards, gameState.dilerPoints);
}

function addCard(someoneCards: Card[], someonePoints: { value: number }) {
    let newCard: Card = gameState.gameCards[Math.floor(Math.random() * (gameState.gameCards.length))]
    someoneCards.push(newCard);
    gameState.gameCards = gameState.gameCards.filter((card) => card != newCard);
    countCards(someoneCards, someonePoints);

}

function countCards(someoneCards: Card[], someonePoints: { value: number }) {

    let aceCount: number = 0;
    let points: number = 0;
    for (const card of someoneCards) {
        if (card.rank == CardValue.ace) {
            aceCount++;
            points += 11;
        }
        else if (card.rank == CardValue.jack || card.rank == CardValue.queen || card.rank == CardValue.king) {
            points += 10;
        }
        else {
            points += parseInt(card.rank);

        }
    }
    if (points > 21 && aceCount != 0) {
        while (points > 21 && aceCount > 0) {
            points -= 10;
            aceCount--;
        }
    }
    someonePoints.value = points;
}

function Check() {
    if (gameState.playerPoints.value > 21) {
        gameState.gameResult = "loose";
    }
    else if (gameState.playerPoints.value == 21) {
        if (gameState.dilerPoints.value == 21) {
            gameState.gameResult = "push";
        }
        else {
            gameState.gameResult = "win";
        }
    }

}
function CheckAfterStand() {
    if (gameState.playerPoints.value < 22) {
        if (gameState.dilerPoints.value > 21) {
            gameState.gameResult = "win";
        }
        else {
            if (gameState.playerPoints.value > gameState.dilerPoints.value) {
                gameState.gameResult = "win";
            }
            else if (gameState.playerPoints.value < gameState.dilerPoints.value) {
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
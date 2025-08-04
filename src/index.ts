import express, { Request, Response } from 'express';

const app = express();
const PORT = 9000;




const gameState: { gameCards: string[]; playerCards: string[]; playerPoints: number; dilerCards: string[], dilerPoints: number; isWin: boolean; isLoose: boolean, isPush: boolean } = {
    gameCards: [],
    playerCards: [],
    playerPoints: 0,
    dilerCards: [],
    dilerPoints: 0,
    isWin: false,
    isLoose: false,
    isPush: false
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

        isWin: gameState.isWin,
        isLoose: gameState.isLoose,
        isPush: gameState.isPush

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

        isWin: gameState.isWin,
        isLoose: gameState.isLoose,
        isPush: gameState.isPush
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

        isWin: gameState.isWin,
        isLoose: gameState.isLoose,
        isPush: gameState.isPush
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});




function createGameCards() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const cards: string[] = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            cards.push(`${rank}${suit}`);
        }
    }

    gameState.gameCards = cards;
}

function newGame() {
    gameState.dilerCards = [];
    gameState.playerCards = [];
    gameState.playerPoints = 0;
    gameState.dilerPoints = 0;
    gameState.isWin = false;
    gameState.isLoose = false;
    gameState.isPush = false;
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
function Check(){
    if (gameState.playerPoints > 22) {
        gameState.isLoose = true;
    }
}
function CheckAfterStand() {
    if (gameState.playerPoints < 22) {
        if (gameState.dilerPoints > 21) {
            gameState.isWin = true;
        }
        else {
            if (gameState.playerPoints > gameState.dilerPoints) {
                gameState.isWin = true;
            }
            else if (gameState.playerPoints < gameState.dilerPoints) {
                gameState.isLoose = true;
            }
            else {
                gameState.isPush = true;
            }
        }
    }
    else {
        gameState.isLoose = true;
    }
}
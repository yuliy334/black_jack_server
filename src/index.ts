import express, { Request, Response } from 'express';

const app = express();
const PORT = 9000;




const gameState: { gameCards: string[]; playerCards: string[]; playerPoints: number; dilerCards: string[] } = {
    gameCards: [],
    playerCards: [],
    playerPoints: 0,
    dilerCards: []
};

app.get('/games', (_req: Request, res: Response) => {
    createGameCards();
    newGame();
    res.send({
        dilerCards: gameState.dilerCards,
        gameCards: gameState.playerPoints,
        playerCards: gameState.playerCards

    });
});
app.get('/games/hit', (_req: Request, res: Response) => {

    addCard();
    res.send({
        dilerCards: gameState.dilerCards,
        playerCards: gameState.playerCards,
        playerPoints: gameState.playerPoints
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
        console.log(gameState.playerPoints);
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
}
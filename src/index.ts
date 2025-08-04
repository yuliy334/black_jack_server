import express, { Request, Response } from 'express';

const app = express();
const PORT = 9000;




const gameState: { gameCards: string[]; playerCards: string[]; dilerCards: string[] } = {
    gameCards: [],
    playerCards: [],
    dilerCards: []
};

app.get('/games', (_req: Request, res: Response) => {
    createGameCards();
    addCard();
    addCard();
    dilerAddCard();
    dilerAddCard();
    res.send({
        gameCards: gameState.gameCards,
        playerCards: gameState.playerCards,
        dilerCards: gameState.dilerCards
    });
});
app.get('/games/hit', (_req: Request, res: Response) => {

    addCard();
    res.send({
        gameCards: gameState.gameCards,
        playerCards: gameState.playerCards
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

function addCard() {
    let newCard: string = gameState.gameCards[Math.floor(Math.random() * (gameState.gameCards.length))];
    gameState.playerCards.push(newCard);
    gameState.gameCards = gameState.gameCards.filter((card) => card != newCard);
}
function dilerAddCard() {
    let newCard: string = gameState.gameCards[Math.floor(Math.random() * (gameState.gameCards.length))];
    gameState.dilerCards.push(newCard);
    gameState.gameCards = gameState.gameCards.filter((card) => card != newCard);
}
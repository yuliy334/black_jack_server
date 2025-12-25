import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GameState, CardValue, Suit, Card } from './types/types';
import cors from 'cors';
import { registerUser, loginUser } from './auth';
import { initializeDatabase } from './initDb';

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: '*', // можно ограничить до своего фронта
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());


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
    firstCheck();
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

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        
        const result = await registerUser(username, password);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        
        const result = await loginUser(username, password);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize database:', error);
        console.error('Please make sure MySQL is running and the database/user are created correctly.');
        process.exit(1);
    });




function createGameCards() {
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
            if (gameState.dilerPoints.value < 17) {
                addCard(gameState.dilerCards, gameState.dilerPoints);
                Check();
            }
            else {
                gameState.gameResult = "win";
            }

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
function firstCheck() {
    if (gameState.playerPoints.value == 21) {
        if (gameState.dilerPoints.value == 21) {
            gameState.gameResult = "push";
        }
        else {
            gameState.gameResult = "win";
        }
    }
}
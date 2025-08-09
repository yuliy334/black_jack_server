enum CardValue {

    two = 2,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    jack,
    quin,
    king,
    ace
}

enum Suit {
    '♠',
    '♥',
    '♦',
    '♣'
}

interface Card {
    rank: CardValue,
    suit: Suit
}

interface GameState {
    gameCards: Card[];
    playerCards: Card[];
    playerPoints: {value: number};
    dilerCards: Card[];
    dilerPoints: {value: number};
    gameResult: string;
}

export { GameState, CardValue,Suit,Card };
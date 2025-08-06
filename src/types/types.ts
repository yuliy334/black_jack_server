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
    jack = 10,
    quin = 10,
    king = 10,
    ace = 11
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
    playerPoints: number;
    dilerCards: Card[];
    dilerPoints: number;
    gameResult: string;
}

export { GameState, CardValue,Suit,Card };
enum CardValue {

    two = "2",
    three ="3",
    four ="4",
    five = "5",
    six = "6",
    seven = "7",
    eight = "8",
    nine = "9",
    ten = "10",
    jack="jack",
    quin="quin",
    king="king",
    ace="ace"
}

enum Suit {
    '♠'='♠',
    '♥'='♥',
    '♦'='♦',
    '♣'='♣'
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
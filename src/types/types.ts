enum CardValue{
    
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

interface GameState {
  gameCards: string[];
  playerCards: string[];
  playerPoints: number;
  dilerCards: string[];
  dilerPoints: number;
  gameResult: string;
}

export {GameState,CardValue};
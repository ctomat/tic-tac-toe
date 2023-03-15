type difficultyType = 'Easy' | 'Medium' | 'Hard' | 'Impossible' | 'VS Player'
type playerSymbolType = 'X' | 'O'
interface playerReturnType {
  getScore: () => number
  playerSymbol: playerSymbolType
  incrementPlayerScore: () => void
  changePlayerSymbol: () => void
}

export type { difficultyType, playerSymbolType, playerReturnType }

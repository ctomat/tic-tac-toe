type difficultyType = 'Easy' | 'Medium' | 'Hard' | 'Impossible'
type playerSymbolType = 'X' | 'O'
interface playerReturnType {
  playerScore: number
  playerSymbol: playerSymbolType
  incrementPlayerScore: () => number
}

export type { difficultyType, playerSymbolType, playerReturnType }

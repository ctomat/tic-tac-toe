type difficultyType = 'Easy' | 'Medium' | 'Hard' | 'Impossible'
type playerSymbolType = 'X' | 'O'
interface playerReturnType {
  playerScore: number
  playerSymbol: playerSymbolType
  incrementPlayerScore: () => void
}

export type { difficultyType, playerSymbolType, playerReturnType }

type difficultyType = 'Easy' | 'Medium' | 'Hard' | 'Impossible' | 'VS Player'
type playerSymbolType = 'X' | 'O'
interface playerReturnType {
  playerScore: number
  playerSymbol: playerSymbolType
  incrementPlayerScore: () => void
}

export type { difficultyType, playerSymbolType, playerReturnType }

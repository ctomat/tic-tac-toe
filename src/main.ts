import type {
  difficultyType,
  playerSymbolType,
  playerReturnType,
} from './types/types.js'
import './main.css'

/* PLAYER FACTORY FUNCTION */

const PlayerFactory = (symbol: playerSymbolType): playerReturnType => {
  const counter = document.querySelector(
    `#${symbol.toLowerCase()}-counter-number`
  ) as HTMLElement
  const playerSymbol = symbol
  let playerScore = 0

  const updateScore = (): void => {
    counter.textContent = playerScore.toString()
  }
  const incrementPlayerScore = (): void => {
    playerScore++
    updateScore()
  }

  return { playerScore, playerSymbol, incrementPlayerScore }
}

/* MODULE FOR GAME RULES */
const gameModule = (() => {
  const playerOne = PlayerFactory('X')
  const counterX = document.querySelector('#x-counter')
  const counterO = document.querySelector('#o-counter')
  const difficultyLevels = ['VS Player', 'Easy', 'Medium', 'Hard', 'Impossible']
  let difficultySelected: difficultyType = 'VS Player'
  let playerTurn: playerSymbolType = 'X'

  const changeDifficultyLevel = (difficulty: difficultyType): void => {
    difficultySelected = difficulty
  }

  const updateTurnIndicator = (): void => {
    setTimeout(() => {
      counterX?.classList.toggle('border-pink')
      counterO?.classList.toggle('border-pink')
    }, 400)
  }

  const playTurn = (): string => {
    const turn = playerTurn
    if (playerTurn === 'X') {
      playerTurn = 'O'
    } else {
      playerTurn = 'X'
    }
    updateTurnIndicator()
    return turn
  }

  const getTurn = (): playerSymbolType => {
    return playerTurn
  }

  return {
    playerOne,
    difficultyLevels,
    difficultySelected,
    changeDifficultyLevel,
    getTurn,
    playTurn,
  }
})()

/* ------------------- */

/* SELECT LOGIC */
const prettySelectModule = (() => {
  /* STANDARD SELECT QUERY SELECTOR */
  const selectElement: HTMLSelectElement = document.querySelector(
    '#difficulty-select'
  ) as HTMLSelectElement
  /* ------------------- */

  /* POPULATE STANDARD SELECT WITH THE GIVEN DIFFICULTIES */
  gameModule.difficultyLevels.map((option) => {
    const optionElement = document.createElement('option')
    optionElement.setAttribute('value', option)
    optionElement.textContent = option
    selectElement?.appendChild(optionElement)
    return ''
  })
  /* ------------------- */

  /* PRETTY SELECT QUERY SELECTOR */
  const selectContainer: HTMLElement = document.querySelector(
    '.select-container'
  ) as HTMLDivElement
  const prettySelect: HTMLButtonElement = document.querySelector(
    '#pretty-select'
  ) as HTMLButtonElement
  const dropDownArrow: HTMLImageElement = document.querySelector(
    '#drop-down-arrow'
  ) as HTMLImageElement
  const textElement: HTMLElement = document.querySelector(
    '.select-text'
  ) as HTMLElement
  textElement.textContent = selectElement.value
  const optionsContainer: HTMLDivElement = document.querySelector(
    '#options-container'
  ) as HTMLDivElement
  /* ------------------- */

  /* PRETTY SELECT FUNCTIONS */
  function changeArrowDirection(): void {
    dropDownArrow.classList.toggle('rotate-down')
    dropDownArrow.classList.toggle('rotate-up')
  }
  function showOptions(): void {
    const optionsSelect = document.querySelectorAll('.select-option')

    if (!optionsSelect[0].classList.contains('transition-eio-fast')) {
      optionsSelect.forEach((option) => {
        option.classList.add('transition-eio-fast')
      })
    }
    if (optionsSelect[0].classList.contains('v-hidden')) {
      optionsSelect.forEach((option, index) => {
        setTimeout(() => {
          option.classList.toggle('v-hidden')
          option.classList.toggle('v-show')
        }, 100 * index)
      })
    } else {
      optionsSelect.forEach((option, index) => {
        setTimeout(() => {
          option.classList.toggle('v-show')
          option.classList.toggle('v-hidden')
        }, 100 * (optionsSelect.length - index))
      })
    }
  }
  /* ------------------- */

  /* CREATE PRETTY SELECTOR OPTIONS */
  const createPrettySelector = (): void => {
    gameModule.difficultyLevels.map((difficulty, index) => {
      const buttonContainer = document.createElement('div')
      buttonContainer.classList.add(
        'select-option',
        'v-hidden',
        'd-flex',
        'w-130',
        'bg-darker-blue',
        'border-r-5'
      )

      const button = document.createElement('button')
      button.classList.add(
        'd-flex',
        'align-center',
        'justify-between',
        'cursor-pointer',
        'p-20',
        'text-white'
      )
      button.innerText = difficulty

      buttonContainer.appendChild(button)
      buttonContainer.addEventListener('click', (event) => {
        event.stopPropagation()
        gameModule.changeDifficultyLevel(difficulty as difficultyType)
        textElement.innerText = difficulty
        showOptions()
        changeArrowDirection()
      })
      if (index === gameModule.difficultyLevels.length - 1) {
        /* 
        Because of the setTimeout, if the click event was on the first button, the user could click repeatedly 
        to cancel the hide animation. 
        */
        document.addEventListener('click', () => {
          if (buttonContainer.classList.contains('v-show')) {
            showOptions()
            changeArrowDirection()
          }
        })
      }

      optionsContainer.appendChild(buttonContainer)

      return buttonContainer
    })

    selectContainer.appendChild(optionsContainer)
  }
  /* ------------------- */

  /* EVENTS */
  prettySelect.addEventListener('click', (event) => {
    event.stopPropagation()
    changeArrowDirection()
    showOptions()
  })
  /* ------------------- */

  return { createPrettySelector }
})()

const gameBoardModule = (() => {
  const board = document.querySelector('#game-board')
  const boardArray = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]

  const checkWin = (
    playerTurn: playerSymbolType
  ): { player: playerSymbolType; win: boolean } => {
    // Horizontal Win Checker
    let horizontalWin = false
    boardArray.forEach((row) => {
      if (row.every((square) => square === playerTurn)) {
        horizontalWin = true
      }
    })
    // -------------------

    // Vertical Win Checker
    let verticalWin = false
    for (let index = 0; index < boardArray.length; index++) {
      if (boardArray.every((row) => row[index] === playerTurn)) {
        verticalWin = true
      }
    }
    // -------------------

    // Transversal Win Checker
    let transversalWin = false
    if (boardArray.every((row, index) => row[index] === playerTurn)) {
      transversalWin = true
    }
    if (
      boardArray.every(
        (row, index) => row[boardArray.length - (1 + index)] === playerTurn
      )
    ) {
      transversalWin = true
    }
    // -------------------

    if (horizontalWin || verticalWin || transversalWin) {
      return { player: playerTurn, win: true }
    }

    return { player: playerTurn, win: false }
  }

  const createGameBoard = (): void => {
    boardArray.forEach((row) => {
      row.forEach((square, index) => {
        const flipCard = document.createElement('div')
        const flipCardInner = document.createElement('div')
        const flipCardFront = document.createElement('div')
        const flipCardBack = document.createElement('div')
        const button: HTMLButtonElement = document.createElement('button')

        flipCard.classList.add('flip-card')

        flipCardInner.classList.add('w-100p', 'h-100p', 'flip-card-inner')

        flipCardFront.classList.add(
          'flip-card-front',
          'box-shadow-1',
          'bg-pink',
          'border-r-5',
          'w-100p',
          'h-100p'
        )
        flipCardBack.classList.add(
          'flip-card-back',
          'box-shadow-1',
          'bg-pink',
          'border-r-5',
          'w-100p',
          'h-100p',
          'font-s-symbols',
          'bold',
          'd-flex',
          'justify-center',
          'align-center'
        )

        button.classList.add('cursor-pointer')
        button.innerText = square
        button.addEventListener('click', () => {
          if (flipCardBack.innerText !== '') {
            return
          }
          const prevTurn = gameModule.getTurn()
          flipCardBack.innerText = gameModule.playTurn()
          row.splice(index, 1, flipCard.innerText)
          flipCard.classList.add('flip-card-click')
          if (checkWin(prevTurn).win && checkWin(prevTurn).player === 'X') {
            gameModule.playerOne.incrementPlayerScore()
          }
        })

        flipCardFront.appendChild(button)
        flipCardInner.appendChild(flipCardFront)
        flipCardInner.appendChild(flipCardBack)
        flipCard.appendChild(flipCardInner)

        board?.appendChild(flipCard)
      })
    })
  }

  return { createGameBoard }
})()

prettySelectModule.createPrettySelector()
gameBoardModule.createGameBoard()

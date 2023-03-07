import type {
  difficultyType,
  playerSymbolType,
  playerReturnType,
} from './types/types.js'
import './main.css'

/* PLAYER FACTORY FUNCTION */

const PlayerFactory = (symbol: playerSymbolType): playerReturnType => {
  const counter = document.querySelector(
    `#${symbol.toLowerCase()}-counter`
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

const firstPlayer = PlayerFactory('X')

/* MODULE FOR GAME RULES */

const gameRulesModule = (() => {
  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Impossible', 'VS Player']
  let difficultySelected: difficultyType = 'Easy'
  let playerTurn: playerSymbolType = 'X'

  const changeDifficultyLevel = (difficulty: difficultyType): void => {
    difficultySelected = difficulty
  }

  const playTurn = (): string => {
    const turn = playerTurn
    if (playerTurn === 'X') {
      playerTurn = 'O'
    } else {
      playerTurn = 'X'
    }
    return turn
  }

  return {
    difficultyLevels,
    difficultySelected,
    changeDifficultyLevel,
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
  gameRulesModule.difficultyLevels.map((option) => {
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
    gameRulesModule.difficultyLevels.map((difficulty, index) => {
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
        gameRulesModule.changeDifficultyLevel(difficulty as difficultyType)
        textElement.innerText = difficulty
        showOptions()
        changeArrowDirection()
      })
      if (index === gameRulesModule.difficultyLevels.length - 1) {
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
  const boardArray = ['', '', '', '', '', '', '', '', '']

  const createGameBoard = (): void => {
    boardArray.forEach((square, index) => {
      const button: HTMLButtonElement = document.createElement('button')
      button.classList.add(
        'box-shadow-1',
        'bg-pink',
        'border-r-5',
        'cursor-pointer',
        'font-s-symbols',
        'bold'
      )
      button.innerText = square
      button.addEventListener('click', () => {
        if (button.innerText !== square) {
          return
        }
        button.innerText = gameRulesModule.playTurn()
        boardArray.splice(index, 1, firstPlayer.playerSymbol)
      })

      board?.appendChild(button)
    })
  }

  return { createGameBoard }
})()

prettySelectModule.createPrettySelector()
gameBoardModule.createGameBoard()

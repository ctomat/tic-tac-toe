import type { difficultyType } from './types/types.js'
import './main.css'

/* MODULE FOR GAME RULES */

const gameRulesModule = (() => {
  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Impossible']
  let difficultySelected: difficultyType = 'Easy'

  const changeDifficultyLevel = (difficulty: difficultyType): void => {
    difficultySelected = difficulty
  }

  return {
    difficultyLevels,
    difficultySelected,
    changeDifficultyLevel,
  }
})()

/* ------------------- */

/* SELECT LOGIC */
;(() => {
  /* STANDARD SELECT QUERY SELECTOR */
  const selectElement: HTMLSelectElement = document.querySelector(
    '#difficulty-select'
  ) as HTMLSelectElement
  /* ------------------- */

  /* POPULATE STANDARD SELECT WITH THE GIVEN DIFFICULTIES */
  ;(function () {
    gameRulesModule.difficultyLevels.map((option) => {
      const optionElement = document.createElement('option')
      optionElement.setAttribute('value', option)
      optionElement.textContent = option
      selectElement?.appendChild(optionElement)
      return ''
    })
  })()
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
  ;(() => {
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
  })()
  /* ------------------- */

  /* EVENTS */
  prettySelect.addEventListener('click', (event) => {
    event.stopPropagation()
    changeArrowDirection()
    showOptions()
  })
  /* ------------------- */
})()

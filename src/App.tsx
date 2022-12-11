// Globals
import { useState, useEffect, useCallback } from 'react'
import './styles/main.scss'

// Functions
import newWord from './utils/newWord';
import checkWord from './utils/checkWord';

// Components
import Keyboard from './components/Keyboard';
import Cell from './components/Cell';
import MsgModal from './components/MsgModal';

// App Config
const trys = 6;
const chars = 5; // will need to update dictionary to match char count

const App = () => {

  const [attempts, setAttempts] = useState<string[]>([""])
  const [attemptCount, setAttemptCount] = useState(0)
  const [answer, setAnswer] = useState("")
  const [win, setWin] = useState(false)
  const [err, setErr] = useState("")
  const guess = attempts[attemptCount]

  useEffect(() => {
    if (!answer) {
      newWord().then(word => setAnswer(word))
    }

    window.addEventListener('keyup', handleKeypress)
    return () => window.removeEventListener('keyup', handleKeypress)
  }, [attempts, attemptCount, err, answer])

  const handleKeypress = useCallback((event: KeyboardEvent) => {
    const key = event.key
    if(!win && attemptCount !== trys) {
      keyInput(key)
    }
  },[attempts, attemptCount, err, answer])

  const keyInput = (key: string) => {
    key = key.toLowerCase();
    if(key == 'enter') {
      submitAnswer()
      if(guess === answer) {
        setWin(true)
      }
    } else if (key == 'backspace') {
      prepareGuess(guess.substring(0,guess.length-1))
    } else if (RegExp(/^[a-zA-Z]{1}$/).test(key)){
      if (guess.length < chars) {
        prepareGuess(guess + key)
      }
    } 
  }

  const prepareGuess = (key: string) => {
    const clone = attempts.map((c,i) => i === attemptCount ? key : c)
    setAttempts(clone)
  }

  const cells = (word: String,index: number) => [...new Array(chars)].map((e,i) => {
    let letter = word.substring(i,i+1);
    return <Cell 
            key={i}
            char={letter} 
            isSeen={letter ? answer.indexOf(letter) !== -1 : false} 
            isMatch={answer.substring(i,i+1) === letter}
            validate={attemptCount > index}
          />
  })

  // generate grid
  const grid = [...new Array(trys)].map((e,i) => (
    <div className='row' key={i}>
      {attempts[i] ? cells(attempts[i],i) : cells("",i)}
    </div>
  ))

  const submitAnswer = () => {
    if(guess.length === chars) {
        checkWord(guess).then(isValid => {
          if(isValid) {
            setAttemptCount(curr => curr + 1)
            setAttempts(curr => [...curr, ""])
          } else {
            showErr("Word not in wordlist")
          }
        })
    } else {
      showErr("Guess Not Long Enough")
    }
  }

  const showErr = (err: string) => {
    setErr(err)
    // clear error after 1.5s
    setTimeout(() => setErr(""), 1500)
  }

  const restart = () => {
    // clear states and request new word
    setAttempts([""])
    setAttemptCount(0)
    setWin(false)
    newWord().then(word => setAnswer(word))
  }

  return (
    <div className="App">
      <div className="grid">
        {grid}
      </div>
  
      <Keyboard handleClick={keyInput} attempts={attempts} attemptCount={attemptCount} answer={answer}/>

      {/* Win/End Message */}
      {win ? (
        <MsgModal message="🎉 Congratulations!! 🎉" restart={restart}/>
      ): attemptCount === trys ? (
        <MsgModal message="Better luck next time!" restart={restart}/>
      ) : null}

      {/* Error Message */}
      {err ? (
        <div className="err-modal">
          <p>{err}</p>
        </div>
      ): null}

      <a href="">Design By Matt</a>
    </div>
  )
}

export default App

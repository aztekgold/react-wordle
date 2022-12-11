import { useState, useEffect, useCallback } from 'react'
import './styles/main.scss'

import newWord from './utils/newWord';
import checkWord from './utils/checkWord';

const trys = 6;
const chars = 5;

type cellProps = {
  isSeen: boolean,
  isMatch: boolean,
  char: string,
  validate: boolean
}

const Cell: React.FC<cellProps> = ({isSeen, isMatch, char, validate}) => {
  let classList = ["cell"];

  if (validate) {
    isSeen && classList.push("seen");
    isMatch && classList.push("match");
    char !== "" && classList.push("animate");
  }

  return <div className={classList.join(" ")}>{char}</div>
}

const App = () => {

  const [attempts, setAttempts] = useState<string[]>([""])
  const [attemptCount, setAttemptCount] = useState(0)
  const [answer, setAnswer] = useState("")
  const [win, setWin] = useState(false)
  const [err, setErr] = useState("")

  const guess = attempts[attemptCount]

  useEffect(() => {
    if (answer.length !== chars) {
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
    if(key == 'Enter') {
      submitAnswer()
      if(guess === answer) {
        setWin(true)
      }
    } else if (key == 'Backspace') {
      prepareGuess(guess.substring(0,guess.length-1))
    } else if (RegExp(/^[a-zA-Z]{1}$/).test(key)){
      if (guess.length < chars) {
        prepareGuess(guess + key.toLowerCase())
      }
    } 
  }

  //
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
      {[
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l'],
        ['Enter','z','x','c','v','b','n','m','Backspace']].map((row,i) => (
        <div className="row" key={i}>
          {row.map(key => (
            <div 
              key={key}
              onClick={() => keyInput(key)} 
              className={`key ${attempts.slice(0,attemptCount).join().indexOf(key) !== -1 ? answer.indexOf(key) !== -1 ? 'match' : 'found' : null}`}
            >{key}</div>))}
        </div>
      ))}
      {win ? (
        <div className="msg-modal">
          <h2>🎉 Congratulations!! 🎉</h2>
          <a className="btn" href="" onClick={e => {e.preventDefault(); restart()}}>Restart</a>
        </div>
      ): attemptCount === trys ? (
        <div className="msg-modal">
          <h2>Better luck next time!</h2>
          <a className="btn" href="" onClick={e => {e.preventDefault(); restart()}}>Restart</a>
        </div>
      ) : null}
      {err ? (
        <div className="err-modal">
          <p>{err}</p>
        </div>
      ): null}
    </div>
  )
}

export default App

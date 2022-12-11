
import React from 'react'
import IconBackspace from '../assets/icons/IconBackspace'
import IconEnter from '../assets/icons/IconEnter'

const keyArray = [
  [
    {name: 'q', key: 'q'},
    {name: 'w', key: 'w'},
    {name: 'e', key: 'e'},
    {name: 'r', key: 'r'},
    {name: 't', key: 't'},
    {name: 'y', key: 'y'},
    {name: 'u', key: 'u'},
    {name: 'i', key: 'i'},
    {name: 'o', key: 'o'},
    {name: 'p', key: 'p'},
  ],
  [
    {name: 'a', key: 'a'},
    {name: 's', key: 's'},
    {name: 'd', key: 'd'},
    {name: 'f', key: 'f'},
    {name: 'g', key: 'g'},
    {name: 'h', key: 'h'},
    {name: 'j', key: 'j'},
    {name: 'k', key: 'k'},
    {name: 'l', key: 'l'},
  ],
  [
    {name: <IconBackspace/>, key: 'Enter'},
    {name: 'z', key: 'z'},
    {name: 'x', key: 'x'},
    {name: 'c', key: 'c'},
    {name: 'v', key: 'v'},
    {name: 'b', key: 'b'},
    {name: 'n', key: 'n'},
    {name: 'm', key: 'm'},
    {name: <IconEnter/>, key: 'Backspace'},
  ]
]

type keyboardProps = {
  handleClick: Function,
  attempts: string[],
  attemptCount: number,
  answer: string
}

const Keyboard:React.FC<keyboardProps> = ({handleClick, attempts, attemptCount, answer}) => {
  return (
    <div className="keyboard">
    {keyArray.map((row,i) => (
      <div className="row" key={i}>
        {row.map(key => (
          <div 
            key={key.key}
            onClick={() => handleClick(key.key)} 
            className={`key ${attempts.slice(0,attemptCount).join().indexOf(key.key) !== -1 ? answer.indexOf(key.key) !== -1 ? 'match' : 'found' : null} ${key.key === key.name ? 'standard' : ''}`}
          >{key.name}</div>))}
      </div>
    ))}
    </div>
  )
}

export default Keyboard





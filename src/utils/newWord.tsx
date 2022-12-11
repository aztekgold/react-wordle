import textFile from '../assets/answers.txt'

// difficuly 1,2,3
const newWord = async (diff: number = 1) => {

    const wordSring = await fetch(textFile).then((r) => r.text())

    const wordArray = wordSring.split('\n')

    const range = Math.floor((wordArray.length / 3))

    const randomInt = Math.floor(Math.random() * (range * diff - range * (diff - 1)) + range * (diff - 1));

    return wordArray[randomInt];
}

export default newWord
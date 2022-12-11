import textFile from '../assets/wordlist.txt'

const checkWord =  async (word: string) => {
    const wordSring = await fetch(textFile).then((r) => r.text())
    const wordArray = wordSring.split('\n')
    return wordArray.indexOf(word) !== -1
}

export default checkWord
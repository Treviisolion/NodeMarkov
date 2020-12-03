/** Textual markov chain generator */

const END_PUNCTUATION = ['.', '?', '!']


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    let prevWord = null;
    this.chains = {}
    for (let word of this.words) {
      if (prevWord) {
        if (END_PUNCTUATION.includes(prevWord.charAt(prevWord.length - 1))) {
          if (prevWord in this.chains)
            this.chains[prevWord].push(null);
          else
            this.chains[prevWord] = [null];
          prevWord = word;
        } else {
          if (prevWord in this.chains)
            this.chains[prevWord].push(word);
          else
            this.chains[prevWord] = [word];
          prevWord = word;
        }
      } else
        prevWord = word;
    }
    if (prevWord in this.chains)
      this.chains[prevWord].push(null);
    else
      this.chains[prevWord] = [null];

    this.makeStartChains()
  }

  /** Creates a map of Sentence-starting words */
  makeStartChains() {
    this.startChains = {}
    for (let key of Object.keys(this.chains))
      if (key.charAt(0) === key.charAt(0).toUpperCase())
        this.startChains[key] = this.chains[key]
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    const startWordIndex = Math.floor(Math.random() * Object.keys(this.startChains).length);
    let prevWord = Object.keys(this.startChains)[startWordIndex];
    let randomText = prevWord;

    for (let i = 1; i < numWords; i++) {
      const nextRandom = Math.floor(Math.random() * this.chains[prevWord].length);
      const nextWord = this.chains[prevWord][nextRandom];
      randomText += ' ';
      if (nextWord) {
        randomText += nextWord.toLowerCase();
        prevWord = nextWord;
      } else {
        randomText += this.makeText(numWords - i);
        break;
      }
    }
    if (prevWord.charAt(prevWord.length - 1) === ',') {
      randomText = randomText.slice(0, randomText.length - 1)
    }
    if (!END_PUNCTUATION.includes(prevWord.charAt(prevWord.length - 1))) {
      randomText += '.'
    }
    return randomText.trim()
  }
}

module.exports = {
  MarkovMachine,
  END_PUNCTUATION
}
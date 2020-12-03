const {MarkovMachine, END_PUNCTUATION} = require('./markov.js')

describe("Does MarkovMachine work", () => {
    const text = "I am Daniel\
    \
    I am Sam\
    Sam I am\
    \
    That Sam-I-am\
    That Sam-I-am!\
    I do not like\
    That Sam-I-am\
    \
    Do you like\
    Green eggs and ham\
    \
    I do not like them,\
    Sam-I-am.\
    I do not like\
    Green eggs and ham.\
    \
    Would you like them\
    Here or there?\
    \
    I would not like them\
    Here or there.\
    I would not like them\
    Anywhere.\
    I do not like\
    Green eggs and ham.\
    I do not like them,\
    Sam-I-am\
    \
    Would you like them\
    In a house?\
    Would you like them\
    With a mouse?";
    const numWords = text.split(/[ \r\n]+/).filter(c => c !== "").length;
    const chains = {
        'I': ['am', 'am', 'am', 'do', 'do', 'do', 'would', 'would', 'do', 'do'],
        'am': ['Daniel', 'Sam', 'That'],
        'Daniel': ['I'],
        'Sam': ['Sam', 'I'],
        'That': ['Sam-I-am', 'Sam-I-am!', 'Sam-I-am'],
        'Sam-I-am': ['That', 'Do', 'Would'],
        'Sam-I-am!': [null],
        'do': ['not', 'not', 'not', 'not', 'not'],
        'not': ['like', 'like', 'like', 'like', 'like', 'like', 'like'],
        'like': ['That', 'Green', 'them,', 'Green', 'them', 'them', 'them', 'Green', 'them,', 'them', 'them'],
        'Do': ['you'],
        'you': ['like', 'like', 'like', 'like'],
        'Green': ['eggs', 'eggs', 'eggs'],
        'eggs': ['and', 'and', 'and'],
        'and': ['ham', 'ham.', 'ham.'],
        'ham': ['I'],
        'them,': ['Sam-I-am.', 'Sam-I-am'],
        'Sam-I-am.': [null],
        'ham.': [null, null],
        'Would': ['you', 'you', 'you'],
        'them': ['Here', 'Here', 'Anywhere.', 'In', 'With'],
        'Here': ['or', 'or'],
        'or': ['there?', 'there.'],
        'there?': [null],
        'would': ['not', 'not'],
        'there.': [null],
        'Anywhere.': [null],
        'In': ['a'],
        'a': ['house?', 'mouse?'],
        'house?': [null],
        'With': ['a'],
        'mouse?': [null]
    }
    const startChains = {
        'I': ['am', 'am', 'am', 'do', 'do', 'do', 'would', 'would', 'do', 'do'],
        'Daniel': ['I'],
        'Sam': ['Sam', 'I'],
        'That': ['Sam-I-am', 'Sam-I-am!', 'Sam-I-am'],
        'Sam-I-am': ['That', 'Do', 'Would'],
        'Sam-I-am!': [null],
        'Do': ['you'],
        'Green': ['eggs', 'eggs', 'eggs'],
        'Sam-I-am.': [null],
        'Would': ['you', 'you', 'you'],
        'Here': ['or', 'or'],
        'Anywhere.': [null],
        'In': ['a'],
        'With': ['a']
    }
    let testMachine

    beforeAll(() => {
        testMachine = new MarkovMachine(text)
    });
    test("Has right amount of words", () => {
        expect(testMachine.words.length).toEqual(numWords)
    });
    test("Has right map of words", () => {
        expect(testMachine.chains).toEqual(chains)
    });
    test("Has right map of sentence starting words", () => {
        expect(testMachine.startChains).toEqual(startChains)
    });
    test("Produces right number of words", () => {
        expect(testMachine.makeText(100).split(' ').length).toEqual(100)
    });
    test("No weird formatting", () => {
        const results = testMachine.makeText(100).split(' ')
        const startWords = testMachine.startChains
        const words = testMachine.words.map(v => {
            if (END_PUNCTUATION.includes(v.charAt(v.length - 1))) {
                v = v.slice(0, v.length - 1)
            }
            v = v.toLowerCase()
            return v
        })
        let prevWord = null
        for (result of results) {
            expect(result.charAt(0)).not.toEqual(' ')
            expect(result.charAt(0)).not.toEqual(',')
            expect(END_PUNCTUATION).not.toContain(result.charAt(0))
            if (result.charAt(result.length - 1) === ',' || END_PUNCTUATION.includes(result.charAt(result.length - 1))) {
                expect(result.charAt(result.length - 2)).not.toEqual(' ')
                expect(result.charAt(result.length - 2)).not.toEqual(',')
                expect(END_PUNCTUATION).not.toContain(result.charAt(result.length - 2))
                expect(words).toContain(result.toLowerCase().slice(0, result.length - 1))
            } else {
                expect(words).toContain(result.toLowerCase())
            }

            if (!prevWord || END_PUNCTUATION.includes(prevWord.charAt(prevWord.length - 1)))
                expect(result.charAt(0)).toEqual(result.charAt(0).toUpperCase())
            else
                expect(result.charAt(0)).toEqual(result.charAt(0).toLowerCase())

            if (result.charAt(0) === result.charAt(0).toUpperCase()) {
                expect()
            }
            
            prevWord = result
        }
        expect(END_PUNCTUATION.includes(prevWord.charAt(prevWord.length - 1))).toEqual(true)
    });
});
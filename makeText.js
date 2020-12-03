/** Command-line tool to generate Markov text. */

const fs = require('fs');
const axios = require('axios');
const {
    MarkovMachine
} = require('./markov.js')

const cat = (file, callback) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            // handle possible error
            console.error(err);
            // kill the process and tell the shell it errored
            process.exit(1);
        }
        // otherwise success
        callback(data)
    });
};

const webCat = (website, callback) => {
    return axios.get(website)
        .then(data => {
            callback(data.data);
        })
        .catch(e => console.log(e))
}

const determineFileorUrl = (argument, callback) => {
    if (argument.slice(0, 4) === 'http') {
        webCat(argument, callback);
    } else {
        cat(argument, callback);
    }
};

const argv = process.argv;
determineFileorUrl(argv[2], data => {
    m = new MarkovMachine(data)
    if (argv[3])
        console.log(m.makeText(argv[3]))
    else
        console.log(m.makeText(100))
})
const chalk = require('chalk');
header='SOCKET INVOKED';
var Logger = ( ...msg ) => {
    console.log(chalk.black.bgWhite('************************* '+header+' *************************'));
    console.log('');
    msg.forEach((c,indx) => {
        console.log(chalk.black.bgYellow('Message '+ (indx+1) +': '));
        console.log(chalk.cyan(JSON.stringify(c, undefined, 4)));
    })    
    console.log('');
    console.log(chalk.black.bgWhite('************************* '+header+' *************************'));
}

module.exports = Logger
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());


app.get('/encryption/', async (req, res) => {
    let originalPassword: string = req.body.password;
    let encrypted: any = originalPassword.split('').map(a => a.charCodeAt(0));
    const chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const delimiters = ["!", "@", "#", "$", "%", "^", "&", "*"];

    // get values of array to binary
    for (let i = 0; i < encrypted.length; i++) {
        // convert each char to binary
        encrypted[i] = encrypted[i].toString(2);
        console.log(`# encrypted[${i}]: ${encrypted[i]}`);

        encrypted[i] = encrypted[i].split('');  // convert to array of chars
        // console.log(encrypted);

        // console.log('encrypted[i].length: ' + encrypted[i].length);
        // replace 1's with alphabetic characters, 0's with numeric characters
        for (let j = 0; j < encrypted[i].length; j++) {
            if (encrypted[i][j] === '1') {
                // replace with an alphabetic character.
                const index = Math.floor(Math.random() * 26);
                encrypted[i][j] = chars[index];
            } else {
                // replace with numeric character.
                encrypted[i][j] = Math.floor(Math.random() * 10);
            }

            if (j === encrypted[i].length - 1) {
                const index = Math.floor(Math.random() * 8);
                encrypted[i][j] += (delimiters[index]);
            }
        }
        encrypted[i] = encrypted[i].join('');
    }
    encrypted = encrypted.join(''); // fully encrypted string at this point.
    console.log('encrypted: ' + encrypted);

    res.status(200).send('encrypted: ' + encrypted);
});


app.get('/decryption/', async (req, res) => {
    let encryptedPassword: string = req.body.password;
    const delimiters: string[] = ['!', '@', '#', '$', '%', '^', '&', '*'];

    let encryptedPasswordArray: any[] = encryptedPassword.split('');

    for (let i = 0; i < encryptedPasswordArray.length; i++) {
        if ((encryptedPasswordArray[i] == '!') || (encryptedPasswordArray[i] == '@') ||
            (encryptedPasswordArray[i] == '#') || (encryptedPasswordArray[i] == '$') ||
            (encryptedPasswordArray[i] == '%') || (encryptedPasswordArray[i] == '^') ||
            (encryptedPasswordArray[i] == '&') || (encryptedPasswordArray[i] == '*')) {
                // replace delimiters by ' '
                encryptedPasswordArray[i] = ' ';
            }
    }

    
    // console.log('encryptedPassword: ' + encryptedPassword);
    // console.log('encryptedPassword.length: ' + encryptedPassword.length);
    
    // console.log('encryptedPasswordArray: ' + encryptedPasswordArray);
    // console.log('encryptedPasswordArray.length: ' + encryptedPasswordArray.length);

    encryptedPassword = encryptedPasswordArray.join('');

    // console.log('encryptedPassword: ~ ' + encryptedPassword);
    // console.log('encryptedPassword.length: ' + encryptedPassword.length);

    // console.log('encryptedPassword: ' + encryptedPassword);

    // split encryptedPassword into an array of strings
    let tempArray: any[] = encryptedPassword.split(' ');
    tempArray.pop();    // remove the last element

    console.log('tempArray: ' + tempArray);
    // tempArray.forEach((element, i) => { console.log(`tempArray[${i}]: ${element}`) });
    console.log('tempArray.length: ' + tempArray.length);

    let decrypted: any = '';
    for (let element of tempArray) {
        let tempString: any = '';
        for (let eachChar of element) {
            if ((eachChar >= 'a') && (eachChar <= 'z')) {
                // if eachChar is [a-z]
                tempString += '1';
            } else if ((Number(eachChar) >= 0) && (Number(eachChar) <= 9)) {
                // if eachChar is[0-9]
                tempString += '0';
            } else {
                // do nothing
            }
        }

        // console.log('tempString: ' + tempString);
        tempString = Number(tempString);        // convert from string to number
        tempString = parseInt(tempString, 2);   // convert from binary to decimal
        tempString = String.fromCharCode(tempString);   // convert from decimal to char
        console.log('tempString: ' + tempString);
        decrypted += tempString;
        // console.log('decrypted: ' + decrypted);
    }

    console.log(decrypted);
    console.log(decrypted.length);

    res.status(201).send('decrypted: ' + decrypted);
});



const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log('Hash Password server started on port: ' + PORT));
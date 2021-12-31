import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());


app.get('/encryption/', async (req, res) => {
    let originalPassword: string = req.body.password;
    let encrypted: any = originalPassword.split('').map(a => a.charCodeAt(0));  // convert each character to a decimal number
    // console.log(encrypted);

    const chars: string[] = [];
    for (let i = 97; i <= 122; i++) {
        // chars: ['a', ..., 'z']
        chars.push(String.fromCharCode(i));
    }
    console.log(chars);
    const delimiters = ["!", "@", "#", "$", "%", "^", "&", "*"];

    // convert encrypted to an array of binary strings
    for (let i = 0; i < encrypted.length; i++) {
        // convert each char of element to binary
        encrypted[i] = encrypted[i].toString(2);    // convert each character to a binary string
        console.log(`# encrypted[${i}]: ${encrypted[i]}`);

        encrypted[i] = encrypted[i].split('');      // convert the binary string to array of 0's and 1's
        console.log('encrypted .: ' + encrypted);

        // console.log('encrypted[i].length: ' + encrypted[i].length);
        // replace 1's with alphabetical characters, 0's with numeric characters
        for (let j = 0; j < encrypted[i].length; j++) {
            if (encrypted[i][j] === '1') {
                // replace with an alphabetical character.
                const index = (Math.floor(Math.random() * 1000)) % 26;
                encrypted[i][j] = chars[index];
            } else {
                // replace with numeric character.
                encrypted[i][j] = (Math.floor(Math.random() * 1000)) % 10;
            }

            if (j === encrypted[i].length - 1) {
                const index = (Math.floor(Math.random() * 1000)) % 8;
                encrypted[i][j] += delimiters[index];
            }
        }
        encrypted[i] = encrypted[i].join('');
    }
    encrypted = encrypted.join('');     // encrypted is fully converted

    console.log('encrypted: ' + encrypted);

    res.status(200).send('encrypted: ' + encrypted);
});


app.get('/decryption/', async (req, res) => {
    let encryptedPassword: string = req.body.password;

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
                // if eachChar is [0-9]
                tempString += '0';
            }
        }

        // console.log('tempString: ' + tempString);
        tempString = Number(tempString);                // convert from string to number
        tempString = parseInt(tempString, 2);           // convert from binary to decimal
        tempString = String.fromCharCode(tempString);   // convert from decimal to char
        console.log('tempString: ' + tempString);
        decrypted += tempString;
        // console.log('decrypted: ' + decrypted);
    }

    console.log(decrypted);
    console.log(decrypted.length);

    res.status(201).send('decrypted: ' + decrypted);
});


app.get('/encryption8/', async (req, res) => {
    // 'a' => 97 (10) => 141 (8) => 141 (10) => 10001101 => xm3057s#
    // 'b' => 98 (10) => 142 (8) => 142 (10) => 10001110 => oj614t5%
    // 'ab' => ... => 'xm3057s#oj614t5%'

    let originalPassword: string = req.body.password;
    // convert each char of encrypted to ascii, ex.: 'a' => 97 (10)
    let encrypted: any = originalPassword.split('').map(eachChar => eachChar.charCodeAt(0));
    console.log('encrypted:');
    console.log(encrypted);

    const chars: string[] = [];
    for (let i = 97; i <= 122; i++) {
        // chars: ['a', ..., 'z']
        chars.push(String.fromCharCode(i));
    }
    console.log(chars);
    const delimiters = ["!", "@", "#", "$", "%", "^", "&", "*"];

    // convert encrypted to an array of octal strings
    for (let i = 0; i < encrypted.length; ++i) {
        // convert each element of encrypted to octal
        // ex.: 97 (10) --> '141' (8)
        console.log(`# encrypted[${i}] : ${encrypted[i]}`);

        encrypted[i] = encrypted[i].toString(8);
        console.log(`# encrypted[${i}] .: ${encrypted[i]}`);

        // convert each element again to decimal, ex.: '141' (8) --> '141' (10)
        let temp: any = Number(encrypted[i]);
        console.log('temp: ' + temp);
        temp = temp.toString(2);
        console.log('temp .: ' + temp);

        encrypted[i] = temp.split('');
        console.log(`# encrypted[${i}] ...: ${encrypted[i]}`);

        for (let j = 0; j < encrypted[i].length; ++j) {
            if (encrypted[i][j] === '1') {
                // replace with an alphabetical character.
                const index = (Math.floor(Math.random() * 1000)) % 26;
                encrypted[i][j] = chars[index];
            } else {
                // replace with numerical character.
                encrypted[i][j] = (Math.floor(Math.random() * 1000)) % 10;
            }
            // add a special character as a delimiter at the end of each element
            if (j === encrypted[i].length - 1) {
                const index = (Math.floor(Math.random() * 1000)) % 8;
                encrypted[i][j] += delimiters[index];
            }

            if (j === encrypted[i].length - 1) {
                const index = (Math.floor(Math.random() * 1000)) % 8;
                encrypted[i][j] += delimiters[index];
            }
        }
        encrypted[i] = encrypted[i].join('');
    }
    encrypted = encrypted.join('');     // encrypted is fully converted

    console.log('encrypted: ' + encrypted);

    res.status(201).send('encrypted: ' + encrypted);
});


app.get('/decryption8/', async (req, res) => {
    let encryptedPassword: string = req.body.password;  // '7h4$2iq*'

    let encryptedPasswordArray: any[] = encryptedPassword.split(''); // ['7', 'h', '4', '$', '2', 'i', 'q', '*']

    for (let i = 0; i < encryptedPasswordArray.length; ++i) {   // ['7', 'h', '4', ' ', '2', 'i', 'q', ' ']
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

    encryptedPassword = encryptedPasswordArray.join('');    // '7h4 2iq '

    // console.log('encryptedPassword: ~ ' + encryptedPassword);
    // console.log('encryptedPassword.length: ' + encryptedPassword.length);

    // console.log('encryptedPassword: ' + encryptedPassword);

    // split encryptedPassword into an array of strings

    encryptedPasswordArray = encryptedPassword.split(' ');
    encryptedPasswordArray.pop();   // remove the last element

    console.log(encryptedPasswordArray);

    let decrypted: any = '';

    for (let element of encryptedPasswordArray) {
        let tempString: any = '';

        for (let eachChar of element) {
            if ((eachChar >= 'a') && (eachChar <= 'z')) {
                // it is a alphabetical character, [a-z]

            } else if ((eachChar >= '0') && (eachChar <= '9')) {
                // it is a numerical character, [0-9]

            }
        }

        console.log(tempString);
        tempString = Number(tempString);
        tempString = parseInt(tempString, 8);
        console.log(tempString);
        tempString = parseInt(tempString, 8);
        console.log(tempString);
    }
});




const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log('Hash Password server started on port: ' + PORT));
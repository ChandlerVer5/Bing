const fs = require('fs');


const statInfo = fs.lstatSync('preload.js');

console.log(statInfo);

'use strict';
const ImageJS = require("imagejs");
const request = require('request-promise-native');

// Default Arguments
let file = process.argv[2] ? process.argv[2] : 'image.png';
let height = 128;
let width = 128;

// Error if Height is set but not Width
if (process.argv[3] && !process.argv[4]) {
    console.error("Width must be set if Height is set");
    process.exit(1);    
}

// Read Height and Width From Arguments
if (process.argv[3] && process.argv[4]) {
    try {
        height = parseInt(process.argv[3]);
        width = parseInt(process.argv[4])
    } catch (err) {
        console.error("Height and Width Arguments Must be a Number");
        process.exit(1);
    }
}

//Creates a Random Image of Height and Width specified and saves it to path.
let createRandomImage = async function (height, width, path) {
    var bitmap = new ImageJS.Bitmap({height, width});
    let pixelsLeft = height * width;
    let randomNumArr = [];

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            if (randomNumArr.length == 0) {
                console.log(`Requesting Random Numbers from Random.org, ${pixelsLeft} pixels left to create`);
                randomNumArr = await getRandomColors(pixelsLeft)
            }

            let color = randomNumArr.pop();
            bitmap.setPixel(x,y, color); 

            pixelsLeft--;
        }
    }
    
    await bitmap.writeFile(path)
}

// Returns the amount of colors requested or 3333 due to API limitations.
let getRandomColors = async function (num) {

    // Fetches Random Numbers from Random.org's API
    let getRandomNumbers = async function (min, max, num) {
        return await request(`https://www.random.org/integers/?num=${num}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`)
        .then(function(numbers) {
            return numbers.split('\n');
        }).catch(function (err) {
            // Shortens Errors related to Random.org's API
            if (err.message) {
                throw err.message;                
            } else {
                throw err;
            }
        });
    }

    let numCount = num * 3;
    numCount = Math.min(numCount, 9999);

    let numArr = await getRandomNumbers(0, 255, numCount);
    let colorArr = [];

    while (numArr.length > 3) {
        colorArr.push({ r: numArr.shift(), g: numArr.shift(), b: numArr.shift()});
    }

    return colorArr;
}

createRandomImage(height, width, file).then(function () {
    console.log("Successfully Created the Random Image");
}).catch(function (err) {
    console.error(err);
});
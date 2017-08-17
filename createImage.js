'use strict';
const ImageJS = require("imagejs");
const request = require('request-promise-native');

let createImage = async function () {
    var bitmap = new ImageJS.Bitmap({width: 128, height: 128});
    let pixelsLeft = 128 * 128;
    let randomNumArr = [];

    for(let x = 0; x < 128; x++) {
        for(let y = 0; y < 128; y++) {
            if (randomNumArr.length == 0) {
                randomNumArr = await getRandomColors(pixelsLeft)
            }

            let color = randomNumArr.pop();
            console.log(color);
            bitmap.setPixel(x,y, color); 

            pixelsLeft--;
            console.log(pixelsLeft);            
        }
    }
    
    bitmap.writeFile("image.png")
    .then(function() {
        console.log("wrote image");
    });
}


let getRandomColors = async function (num) {
    let numCount = num * 3;
    numCount = Math.min(numCount, 9999)

    let numArr = await getRandomNumbers(0, 255, numCount);
    let colorArr = [];

    while (numArr.length > 3) {
        colorArr.push({ r: numArr.shift(), g: numArr.shift(), b: numArr.shift()})
    }

    return colorArr;
}

let getRandomNumbers = async function (min, max, num) {
    return await request(`https://www.random.org/integers/?num=${num}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`)
    .then(function(numbers) {
        let numArr = numbers.split('\n');

        return numArr;
    });
}

let test = async function () {
    console.log(await createImage());
}

test();
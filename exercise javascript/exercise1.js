'use strict';

let inputString = '';
let currentLine = 0;


// Complete the calculateArea function below.
// It returns a Promise which on success, returns area of the shape, and on failure returns [-1].
let calculateArea = (shape, values) => {
    return new Promise((resolve,reject) => {
        let pi = 3.14;
        switch (shape){
            case 'square' :
                resolve(eval((values[0]*values[0]).toFixed(2)));
                break;
            case 'rectangle':
                resolve(eval((values[0]*values[1]).toFixed(2)));
                break;
            case 'circle':
                resolve(eval((pi*values[0]*values[0]).toFixed(2)));
                break;
            case 'triangle':
                resolve(eval((0.5*values[0]*values[1]).toFixed(2)));
                break;
            default:
                reject([-1]);
        }
    });
}

// Complete the generateArea function below.
// It returns a Promise which on success, returns an array of areas of all the shapes and on failure, returns [-1].
let getAreas = (shapes, values_arr) => {
    let promises = [];
    for (const i in shapes) {
        promises.push(calculateArea(shapes[i],values_arr[i]));
    } 
    return Promise.all(promises);
}

let callCalculateArea = async (shapes, values) => await calculateArea(shapes[0], values[0]).catch(error => error) instanceof Promise;

let callGetAreas = (shapes, values) => getAreas(shapes, values).catch(error => error);

function main() {
    const n = 2

    let shapes = ['square','rectangle','circle','triangle'];
    let values = [];
    
    values.push(JSON.parse('[2]'));
    values.push(JSON.parse('[3,4]'));
    values.push(JSON.parse('[5]'));
    values.push(JSON.parse('[2,4]'));
    
    if (callCalculateArea(shapes, values)) {
        callGetAreas(shapes, values).then((res) => {
            console.log(res.join('\n') + '\n');
        }).catch((res) => {
            console.log(res.join('\n') + '\n');
        });
    } else {
        console.error('calculateArea does not return a Promise.');
    }

}

main();
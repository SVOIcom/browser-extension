let window = self;


import {} from './modules/thirdparty/eventemitter3.min.js';
import {} from './modules/thirdparty/bignumber.min.js';
import {} from './modules/thirdparty/crypto-js.min.js';
import {} from './ever-sdk-js/main.js';

//End creating virtual environment
console.log('BACKGROUND V3');

let windowId = null;


function openBackgroundWindow() {
    return new Promise((resolve, reject) => {
        chrome.windows.create({
                focused: false,
                width: 1,// 300,
                height: 1,// 150,
                type: 'popup',
                url: 'background.html',
                top: 0,
                left: 0
            },
            (window) => {
                resolve(window.id);
            })
    });
}

async function isWindowExists() {
    try {
        await chrome.windows.get(windowId);
        return true;
    } catch (e) {
       return false;
    }
}

/*
(async () => {
    windowId = await openBackgroundWindow();
    setInterval(async () => {
        if(!await isWindowExists()) {
            windowId = await openBackgroundWindow();
        }
    }, 3000);
})()*/

import {} from './background.js';


setInterval(async () => {
    console.log('ALIVE');
}, 3000);


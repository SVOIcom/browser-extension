console.log('I AM INJECTED');
window.injected = true;


console.log('Loading FreeTON provider');

window.addEventListener('load', async () => {
    try {
        console.log(window.TONClient);
        //Trying setup TON WASM client
        window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});

        let freeton = await TONClient.create({
            servers: ['net.ton.dev']
        });

        //Check is ton already provided
        if(!window.ton) {
            window.ton = freeton;
        }
        window.tonFallback = freeton;

        console.log('FreeTON provider ready');


    } catch (e) {
        console.log('FREETON PROVIDER INITIALIZATION ERROR', e);
    }
});


window._exfetch = fetch;

function fetchLocal(url) {
    return (new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest
        xhr.onload = function () {
            let headers = new Headers();

            if(url.includes('.wasm')) {
                headers.append('Content-Type', 'application/wasm');
            }

            resolve(new Response(xhr.response, {status: xhr.status, headers}))
        }
        xhr.onerror = function () {
            reject(new TypeError('Local request failed'))
        }
        xhr.open('GET', url)
        xhr.responseType = "arraybuffer";
        xhr.send(null)
    }))
}

window.fetch = (url, ...args) => {
    if(url.includes('.wasm')) {
        return fetchLocal(url, ...args);
    }

    return window._exfetch(url, ...args);
};
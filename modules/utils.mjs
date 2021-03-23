const Utils = {
    /**
     * Simple promised timeout
     * @param timeout
     * @returns {Promise<unknown>}
     */
    wait: (timeout = 500) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout)
        })
    },
    appBack:()=>{
        app.views.main.router.back();
    }
};

export default Utils;
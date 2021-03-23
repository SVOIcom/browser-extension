import Utils from "../utils.mjs";

const $ = Dom7;

class Popups {

    /**
     * Open accept transaction popup
     * @returns {Promise<*>}
     */
    acceptTransaction() {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/accept");

            app.once('pageInit', () => {
                console.log('PAGE ');
                $('#testTitle').textContent = '432'
                $('#testTitle').text('123');

                $('#txCancelButton').once('click',() => {
                    Utils.appBack();
                    reject('Cancelled by user');
                });

                $('#txAcceptButton').once('click',() => {
                    Utils.appBack();
                    resolve(true);
                });

                // resolve();
            });

        })

    }
}

export default new Popups();
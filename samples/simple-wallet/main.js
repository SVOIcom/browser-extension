window.addEventListener('load', async () => {

    //Set script start to end of events queue
    setTimeout(async () => {
        if(window.getTONWeb) {

            //Get TON client isntance
            const client = await getTONWeb();
            window.client = client;

            /**
             * Update wallet info method
             * @returns {Promise<void>}
             */
            async function updateWalletInfo() {

                //Get wallet info with address
                let walletInfo = await client.accounts.getWalletInfo();

                //Fetch wallet balance
                let walletBalance = await client.accounts.getWalletBalance(walletInfo.address);

                //Setup balance field
                $('#balance').text(client.utils.unsignedNumberToSigned(walletBalance));

                //Setup wallet address field
                $('#walletAddress').text(walletInfo.address);

            }

            /**
             * Send TONs button handler
             * @returns {Promise<void>}
             */
            async function sendButton() {

                let toAddress = prompt('TON recipient address');

                if(!client.utils.validateTONAddress(toAddress)) {
                    return alert('Invalid TON address')
                }

                let tonsToSend = prompt('How much TONs sending?');

                //Convert to unsigned number
                tonsToSend = client.utils.numberToUnsignedNumber(tonsToSend);

                if(!tonsToSend) {
                    return alert('Invalid TON amount');
                }


                //Get wallet info with address
                let walletInfo = await client.accounts.getWalletInfo();

                //Get current user account
                let account = await client.accounts.getAccount();

                //Send TON
                try {
                    await client.accounts.walletTransfer(account.public, walletInfo.address, toAddress, tonsToSend);
                    alert('TON transferred successfully!')
                } catch (e) {
                    alert('TON sending error: ' + e.message);
                }

            }

            $('#sendButton').click(sendButton);


            //Update wallet info timer
            await updateWalletInfo();
            setInterval(updateWalletInfo, 5000);

            //Update wallet info on network and account changing
            client.on(client.EVENTS.ACCOUNT_CHANGED, updateWalletInfo);
            client.on(client.EVENTS.NETWORK_CHANGED, updateWalletInfo);

        } else {
            alert('No TONWallet extension detected.')
        }
    }, 0);
});

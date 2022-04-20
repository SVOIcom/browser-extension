/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

 const $ = Dom7;


 class SeedCheckUtils {

    constructor(seedPhrase, password, messenger) {

        this.seedPhrase = seedPhrase;
        this.correctCounter = 0;

        this.password = password;

        this.messenger = messenger;

        this.dataForCheckUses = 3;
        this.dataForCheck = {};
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    quizeProgressSet(){
        let self = this;

        let progressList = [0,33,66,100]

        app.progressbar.set('#quizProgressbar', progressList[self.correctCounter]);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    
    
    getRoundQuizWordsObj(word, donorWordsList) {

        let self = this;

        let filteredDonorWordsList = donorWordsList.filter((value, index, arr) => {
            return value !== word;
        });
    
        self.shuffle(filteredDonorWordsList);
    
        let roundQuizWordsObj = [{
                "name": word,
                "real": true
            },
            {
                "name": filteredDonorWordsList[0],
                "real": false
            },
            {
                "name": filteredDonorWordsList[1],
                "real": false
            },
            {
                "name": filteredDonorWordsList[2],
                "real": false
            }
        ];
    
        self.shuffle(roundQuizWordsObj);
    
        return roundQuizWordsObj;
    }
    
    getTrueAnswerNumber(buttonTextObj){
        for (let [index, data] of buttonTextObj.entries()) {
            if (data.real){
                return index;
            }
        }
    }
    
    async formNewRound(){


        let self = this;

        if (self.dataForCheckUses == 3) {
            self.dataForCheck = await self.getDataForCheck();
            self.dataForCheckUses = 0
            // console.log(self.dataForCheck, self.dataForCheckUses, "<<<<<")
        }

        let roundObj = self.dataForCheck[self.dataForCheckUses];
    
        // console.log("enter");

        let quizQuestion = `${LOCALIZATION._("Select word from seed on position")}: ${roundObj.position}`
    
        $('#quiz').empty();
        $("#quizQuestion").text(quizQuestion);
    
        let buttonTextObj = roundObj.quizWordsObj;
    
        // console.log(buttonTextObj)
    
        let quizHtml = `
        <p class="row">
            <button id="0" class="col button button-large button-raised button-fill">${buttonTextObj[0].name}</button>
            <button id="1" class="col button button-large button-raised button-fill">${buttonTextObj[1].name}</button>
        </p>
        <p class="row">
            <button id="2" class="col button button-large button-raised button-fill">${buttonTextObj[2].name}</button>
            <button id="3" class="col button button-large button-raised button-fill">${buttonTextObj[3].name}</button>
        </p>
        `
    
        $('#quiz').append(quizHtml);
    
        let correctAnswerIndex = self.getTrueAnswerNumber(buttonTextObj);
    
        for (let [index, data] of buttonTextObj.entries()) {
    
            if (index == correctAnswerIndex){
                $(`#${index}`).on('click', async () => {

                    self.correctCounter++
                    // console.log(self.correctCounter);
                    $(`#${index}`).addClass("color-green");

                    self.quizeProgressSet();

                    for (let [index, data] of buttonTextObj.entries()) {
                        $(`#${index}`).addClass('disabled');
                    }

                    if (self.correctCounter == 3){
                        let keyPair = await this.messenger.rpcCall('main_getKeysFromSeedPhrase', [self.seedPhrase,], 'background');

                        let publicKey = keyPair.public;
                        let privateKey = keyPair.secret;

                        await this.messenger.rpcCall('main_addAccount', [publicKey, privateKey, self.seedPhrase, self.password], 'background');
                        await this.messenger.rpcCall('main_changeAccount', [publicKey,], 'background');

                        location.reload();
                    }

                    await self.sleep(700);

                    self.formNewRound();

                })
            }
            else{
                $(`#${index}`).on('click', async () => {
                    // console.log(self.correctCounter);
                    $(`#${index}`).addClass("color-red");

                    for (let [index, data] of buttonTextObj.entries()) {
                        $(`#${index}`).addClass('disabled');
                    }

                    self.correctCounter = 0

                    self.quizeProgressSet();

                    await self.sleep(700);

                    self.formNewRound();
                })
            }
    
        }

        self.dataForCheckUses++;
        // console.log("dataForCheckUses:", self.dataForCheckUses);

    
    }
    
    async getDataForCheck() {
        let self = this;

        let donorSeedPhrase = await this.messenger.rpcCall('main_generateSeedPhrase', undefined, 'background');
    
        let correctWordsList = self.seedPhrase.split(" ");
        let donorWordsList = donorSeedPhrase.split(" ");
    
        let correctWordsPosList = [];
    
        for (let [index, word] of correctWordsList.entries()) {
            let wordPosObj = {
                "word": word,
                "pos": index + 1
            };
            correctWordsPosList.push(wordPosObj)
        }
    
        self.shuffle(correctWordsPosList);
    
        let wordsToCheckList = correctWordsPosList.slice(0, 3);
    
        let resList = [];
    
        for (let wordObj of wordsToCheckList) {
            let stepObj = {
                "position": wordObj.pos,
                "quizWordsObj": self.getRoundQuizWordsObj(wordObj.word, donorWordsList)
            };
    
            resList.push(stepObj);
        }
    
        let dataForCheck =  resList.sort((a, b) => {
            return a.position - b.position
        });

        self.dataForCheck = dataForCheck;

        return dataForCheck
    
    }
 }


export default SeedCheckUtils;
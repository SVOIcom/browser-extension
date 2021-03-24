/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

const EXCEPTIONS = {
    testException: {code: -1, message: 'Test exception', more: 'For testing purposes'},
    rejectedByUser: {
        code: 10000,
        message: 'Rejected by user',
        more: 'User pressed cancel transaction button or cancel at password checking'
    },
    invalidPassword: {
        code: 10001,
        message: 'Invalid password',
        more: 'The user entered the password incorrectly several times '
    },
}

export default EXCEPTIONS;
/**
 * @name ScaleWallet - Everscale browser wallet and injector
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
    invalidNetwork: {code: 10002, message: 'Invalid network', more: 'Invalid network selected'},
    publicKeyNotFound: {code: 10003, message: 'Public key not found', more: 'No public key in keyring'},
    keyAlreadyInKeyring: {code: 10004, message: 'Key already in keyring', more: 'Key, that you enter, is already in your local storage'},
    invalidInvoker: {code: 10005, message: 'Invalid invoker', more: 'Internal error. You can\'t invoke this RPC method'},
}

export default EXCEPTIONS;
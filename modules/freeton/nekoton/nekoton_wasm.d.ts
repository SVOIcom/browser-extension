/* tslint:disable */
/* eslint-disable */
/**
* @param {string} address
* @returns {boolean}
*/
export function checkAddress(address: string): boolean;
/**
* @param {ClockWithOffset} clock
* @param {string} account_stuff_boc
* @param {string} contract_abi
* @param {string} method
* @param {TokensObject} input
* @param {boolean} responsible
* @returns {ExecutionOutput}
*/
export function runLocal(clock: ClockWithOffset, account_stuff_boc: string, contract_abi: string, method: string, input: TokensObject, responsible: boolean): ExecutionOutput;
/**
* @param {string} tvc
* @param {string} contract_abi
* @param {number} workchain_id
* @param {string | undefined} public_key
* @param {TokensObject} init_data
* @returns {string}
*/
export function getExpectedAddress(tvc: string, contract_abi: string, workchain_id: number, public_key: string | undefined, init_data: TokensObject): string;
/**
* @param {string} boc
* @returns {string}
*/
export function getBocHash(boc: string): string;
/**
* @param {Array<AbiParam>} params
* @param {TokensObject} tokens
* @returns {string}
*/
export function packIntoCell(params: Array<AbiParam>, tokens: TokensObject): string;
/**
* @param {Array<AbiParam>} params
* @param {string} boc
* @param {boolean} allow_partial
* @returns {TokensObject}
*/
export function unpackFromCell(params: Array<AbiParam>, boc: string, allow_partial: boolean): TokensObject;
/**
* @param {string} boc
* @returns {string}
*/
export function extractPublicKey(boc: string): string;
/**
* @param {string} code
* @returns {string}
*/
export function codeToTvc(code: string): string;
/**
* @param {string} tvc
* @returns {StateInit}
*/
export function splitTvc(tvc: string): StateInit;
/**
* @param {string} contract_abi
* @param {string} method
* @param {TokensObject} input
* @returns {string}
*/
export function encodeInternalInput(contract_abi: string, method: string, input: TokensObject): string;
/**
* @param {string} message_body
* @param {string} contract_abi
* @param {MethodName} method
* @param {boolean} internal
* @returns {DecodedInput | undefined}
*/
export function decodeInput(message_body: string, contract_abi: string, method: MethodName, internal: boolean): DecodedInput | undefined;
/**
* @param {string} message_body
* @param {string} contract_abi
* @param {MethodName} event
* @returns {DecodedEvent | undefined}
*/
export function decodeEvent(message_body: string, contract_abi: string, event: MethodName): DecodedEvent | undefined;
/**
* @param {string} message_body
* @param {string} contract_abi
* @param {MethodName} method
* @returns {DecodedOutput | undefined}
*/
export function decodeOutput(message_body: string, contract_abi: string, method: MethodName): DecodedOutput | undefined;
/**
* @param {Transaction} transaction
* @param {string} contract_abi
* @param {MethodName} method
* @returns {DecodedTransaction | undefined}
*/
export function decodeTransaction(transaction: Transaction, contract_abi: string, method: MethodName): DecodedTransaction | undefined;
/**
* @param {Transaction} transaction
* @param {string} contract_abi
* @returns {DecodedTransactionEvents}
*/
export function decodeTransactionEvents(transaction: Transaction, contract_abi: string): DecodedTransactionEvents;
/**
* @param {string} public_key
* @param {string} data
* @param {string} signature
* @returns {boolean}
*/
export function verifySignature(public_key: string, data: string, signature: string): boolean;
/**
* @param {string} dst
* @param {string} contract_abi
* @param {string} method
* @param {string | undefined} state_init
* @param {TokensObject} input
* @param {number} timeout
* @returns {SignedMessage}
*/
export function createExternalMessageWithoutSignature(dst: string, contract_abi: string, method: string, state_init: string | undefined, input: TokensObject, timeout: number): SignedMessage;

export type EnumItem<T extends string, D> = { type: T, data: D };



export type TransactionId = {
    lt: string,
    hash: string,
};



export type GenTimings = {
    genLt: string,
    genUtime: number,
};



export type LastTransactionId = {
    isExact: boolean,
    lt: string,
    hash?: string,
};



export type ContractState = {
    balance: string,
    genTimings: GenTimings,
    lastTransactionId?: LastTransactionId,
    isDeployed: boolean,
    codeHash?: string,
};



export type AccountStatus = 'uninit' | 'frozen' | 'active' | 'nonexist';



export type Message = {
    hash: string,
    src?: string,
    dst?: string,
    value: string,
    bounce: boolean,
    bounced: boolean,
    body?: string,
    bodyHash?: string,
};



export type PendingTransaction = {
    messageHash: string,
    bodyHash: string,
    src?: string,
    expireAt: number,
};



export type AccountsList = {
  accounts: string[];
  continuation: string | undefined;
}



export type TransactionsList = {
    transactions: Transaction[];
    continuation: TransactionId | undefined;
};



export type Transaction = {
    id: TransactionId,
    prevTransactionId?: TransactionId,
    createdAt: number,
    aborted: boolean,
    exitCode?: number,
    resultCode?: number,
    origStatus: AccountStatus,
    endStatus: AccountStatus,
    totalFees: string,
    inMessage: Message,
    outMessages: Message[],
};



export type TransactionsBatchType = 'old' | 'new';

export type TransactionsBatchInfo = {
    minLt: string,
    maxLt: string,
    batchType: TransactionsBatchType,
};



export type StateInit = {
    data: string | undefined;
    code: string | undefined;
};



export type DecodedInput = {
    method: string,
    input: TokensObject,
};



export type DecodedEvent = {
    event: string,
    data: TokensObject,
};



export type DecodedOutput = {
    method: string,
    output: TokensObject,
};



export type DecodedTransaction = {
    method: string,
    input: TokensObject,
    output: TokensObject,
};



export type DecodedTransactionEvents = Array<DecodedEvent>;



export type ExecutionOutput = {
    output?: TokensObject,
    code: number,
};



export type MethodName = string | string[]



export type AbiToken =
    | null
    | boolean
    | string
    | number
    | { [K in string]: AbiToken }
    | AbiToken[]
    | (readonly [AbiToken, AbiToken])[];

type TokensObject = { [K in string]: AbiToken };



export type AbiParamKindUint = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint160' | 'uint256';
export type AbiParamKindInt = 'int8' | 'int16' | 'int32' | 'int64' | 'int128' | 'int160' | 'int256';
export type AbiParamKindTuple = 'tuple';
export type AbiParamKindBool = 'bool';
export type AbiParamKindCell = 'cell';
export type AbiParamKindAddress = 'address';
export type AbiParamKindBytes = 'bytes';
export type AbiParamKindGram = 'gram';
export type AbiParamKindTime = 'time';
export type AbiParamKindExpire = 'expire';
export type AbiParamKindPublicKey = 'pubkey';
export type AbiParamKindString = 'string';
export type AbiParamKindArray = `${AbiParamKind}[]`;

export type AbiParamKindMap = `map(${AbiParamKindInt | AbiParamKindUint | AbiParamKindAddress},${AbiParamKind | `${AbiParamKind}[]`})`;

export type AbiParamOptional = `optional(${AbiParamKind})`

export type AbiParamKind =
  | AbiParamKindUint
  | AbiParamKindInt
  | AbiParamKindTuple
  | AbiParamKindBool
  | AbiParamKindCell
  | AbiParamKindAddress
  | AbiParamKindBytes
  | AbiParamKindGram
  | AbiParamKindTime
  | AbiParamKindExpire
  | AbiParamKindString
  | AbiParamKindPublicKey;

export type AbiParam = {
  name: string;
  type: AbiParamKind | AbiParamKindMap | AbiParamKindArray | AbiParamOptional;
  components?: AbiParam[];
};



export type ReliableBehavior =
    | 'intensive_polling'
    | 'block_walking';

export type TransportInfo = {
    maxTransactionsPerFetch: number;
    reliableBehavior: ReliableBehavior;
};



export type LatestBlock = {
    id: string,
    endLt: string,
    genUtime: number,
};



export type SignedMessage = {
    hash: string,
    bodyHash: string,
    expireAt: number,
    boc: string,
};



export type PollingMethod = 'manual' | 'reliable';



export type FullContractState = {
    balance: string;
    genTimings: GenTimings;
    lastTransactionId: LastTransactionId;
    isDeployed: boolean;
    boc: string;
};



export interface IGqlSender {
  isLocal(): boolean;
  send(data: string, handler: GqlQuery): void;
}


/**
*/
export class ClockWithOffset {
  free(): void;
/**
*/
  constructor();
/**
* @param {number} offset_ms
*/
  updateOffset(offset_ms: number): void;
/**
* @returns {number}
*/
  offsetMs(): number;
}
/**
*/
export class GenericContract {
  free(): void;
/**
* @param {SignedMessage} message
* @returns {Promise<Transaction>}
*/
  sendMessageLocally(message: SignedMessage): Promise<Transaction>;
/**
* @param {SignedMessage} message
* @returns {Promise<PendingTransaction>}
*/
  sendMessage(message: SignedMessage): Promise<PendingTransaction>;
/**
* @returns {Promise<void>}
*/
  refresh(): Promise<void>;
/**
* @param {string} block_id
* @returns {Promise<void>}
*/
  handleBlock(block_id: string): Promise<void>;
/**
* @param {string} lt
* @param {string} hash
* @returns {Promise<void>}
*/
  preloadTransactions(lt: string, hash: string): Promise<void>;
/**
* @returns {string}
*/
  readonly address: string;
/**
* @returns {PollingMethod}
*/
  readonly pollingMethod: PollingMethod;
}
/**
*/
export class GqlQuery {
  free(): void;
/**
* @param {string} data
*/
  onReceive(data: string): void;
/**
* @param {any} arg0
*/
  onError(arg0: any): void;
/**
*/
  onTimeout(): void;
}
/**
*/
export class GqlTransport {
  free(): void;
/**
* @param {ClockWithOffset} clock
* @param {IGqlSender} sender
*/
  constructor(clock: ClockWithOffset, sender: IGqlSender);
/**
* @param {string} address
* @param {any} handler
* @returns {Promise<GenericContract>}
*/
  subscribeToGenericContract(address: string, handler: any): Promise<GenericContract>;
/**
* @param {string} address
* @returns {Promise<LatestBlock>}
*/
  getLatestBlock(address: string): Promise<LatestBlock>;
/**
* @param {string} current_block_id
* @param {string} address
* @param {number} timeout
* @returns {Promise<string>}
*/
  waitForNextBlock(current_block_id: string, address: string, timeout: number): Promise<string>;
/**
* @param {string} address
* @returns {Promise<FullContractState | undefined>}
*/
  getFullContractState(address: string): Promise<FullContractState | undefined>;
/**
* @param {string} code_hash
* @param {number} limit
* @param {string | undefined} continuation
* @returns {Promise<AccountsList>}
*/
  getAccountsByCodeHash(code_hash: string, limit: number, continuation?: string): Promise<AccountsList>;
/**
* @param {string} address
* @param {TransactionId | undefined} continuation
* @param {number} limit
* @returns {Promise<TransactionsList>}
*/
  getTransactions(address: string, continuation: TransactionId | undefined, limit: number): Promise<TransactionsList>;
/**
* @param {string} hash
* @returns {Promise<Transaction | undefined>}
*/
  getTransaction(hash: string): Promise<Transaction | undefined>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_genericcontract_free: (a: number) => void;
  readonly genericcontract_address: (a: number, b: number) => void;
  readonly genericcontract_sendMessageLocally: (a: number, b: number, c: number) => void;
  readonly genericcontract_sendMessage: (a: number, b: number, c: number) => void;
  readonly genericcontract_refresh: (a: number) => number;
  readonly genericcontract_handleBlock: (a: number, b: number, c: number) => number;
  readonly genericcontract_preloadTransactions: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly genericcontract_pollingMethod: (a: number) => number;
  readonly __wbg_clockwithoffset_free: (a: number) => void;
  readonly clockwithoffset_new: () => number;
  readonly clockwithoffset_updateOffset: (a: number, b: number) => void;
  readonly clockwithoffset_offsetMs: (a: number) => number;
  readonly checkAddress: (a: number, b: number) => number;
  readonly runLocal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly getExpectedAddress: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly getBocHash: (a: number, b: number, c: number) => void;
  readonly packIntoCell: (a: number, b: number, c: number) => void;
  readonly unpackFromCell: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly extractPublicKey: (a: number, b: number, c: number) => void;
  readonly codeToTvc: (a: number, b: number, c: number) => void;
  readonly splitTvc: (a: number, b: number, c: number) => void;
  readonly encodeInternalInput: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly decodeInput: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly decodeEvent: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly decodeOutput: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly decodeTransaction: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly decodeTransactionEvents: (a: number, b: number, c: number, d: number) => void;
  readonly verifySignature: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly createExternalMessageWithoutSignature: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly __wbg_gqlquery_free: (a: number) => void;
  readonly gqlquery_onReceive: (a: number, b: number, c: number) => void;
  readonly gqlquery_onError: (a: number, b: number) => void;
  readonly gqlquery_onTimeout: (a: number) => void;
  readonly __wbg_gqltransport_free: (a: number) => void;
  readonly gqltransport_new: (a: number, b: number) => number;
  readonly gqltransport_subscribeToGenericContract: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly gqltransport_getLatestBlock: (a: number, b: number, c: number, d: number) => void;
  readonly gqltransport_waitForNextBlock: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly gqltransport_getFullContractState: (a: number, b: number, c: number, d: number) => void;
  readonly gqltransport_getAccountsByCodeHash: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly gqltransport_getTransactions: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly gqltransport_getTransaction: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbb120239a7c4e272: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h7bcd9da4440792bc: (a: number, b: number, c: number, d: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

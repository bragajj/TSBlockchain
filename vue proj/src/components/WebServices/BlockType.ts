//SE 575 - 2020
//Laura M, Matthew P, Jeff B

/* eslint-disable */
import * as cryptoJ from 'crypto-js';

export type BlockChangeMessage = {idx: number; data: BlockType}



class BlockType {

    public id: number;
    public hash: string;
    public priorHash: string;
    public timestamp: number;
    public data: string;
    //Should the user be able to set difficulty or do we hardcode this? Difficulty is the number of leading zeros for the hash for Proof of Work
    public difficultyLevel: number;
    //Nonce gets incremented for Proof of work
    public nonce: number;
    public hashSuccess: boolean;
    public hashFail: boolean;


    constructor(id: number, hash: string, priorHash: string, timestamp: number, data: string, difficultyLevel: number, nonce: number, hashSuccess: boolean, hashFail: boolean) {
    this.id = id;
    this.priorHash = priorHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
    this.difficultyLevel = difficultyLevel;
    this.nonce = nonce;
    this.hashSuccess = false;
    this.hashFail = false;
    }
}

//Generate Genesis BlockType. It's data is "GenesisBlockKB"
const gBlock: BlockType = new BlockType(
    0, 'af21a5a7e781414961f3befe19d5f6866633d06ea5a55057e5297544a9eb1a50', '', 1, 'GenesisBlockKB', 0, 0
);

//Blockchain starts with genesis BlockType
let bchain: BlockType[] = [gBlock];

const getChain = (): BlockType[] => bchain;

const getmostRecentBlock = (): BlockType => bchain[bchain.length - 1];



const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000);

//seconds
const TIME_BETWEEN_BLOCKGEN: number = 10;
//blocks
const DIFFICULTY_ADJ_INTERVAL: number = 10;

//
const getdifficultyLevel = (bchainOne: BlockType[]): number => {
    const mostRecentBlock: BlockType = bchainOne[bchain.length - 1];
    if (mostRecentBlock.id % DIFFICULTY_ADJ_INTERVAL === 0 && mostRecentBlock.id !== 0) {

        return getAdjusteddifficultyLevel(mostRecentBlock, bchainOne);

    } else {

        return mostRecentBlock.difficultyLevel;
    }
};


//Difficulty adjustment handling. Difficulty level will have to be increased and decreased for blocks
const getAdjusteddifficultyLevel = (mostRecentBlock: BlockType, bchainOne: BlockType[]) => {
    const prevAdjustmentBlock: BlockType = bchainOne[bchain.length - DIFFICULTY_ADJ_INTERVAL];
    const timeExpected: number = TIME_BETWEEN_BLOCKGEN * DIFFICULTY_ADJ_INTERVAL;
    const timeTaken: number = mostRecentBlock.timestamp - prevAdjustmentBlock.timestamp;
    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.difficultyLevel + 1;
    } else if (timeTaken > timeExpected * 2) {
        return prevAdjustmentBlock.difficultyLevel - 1;
    } else {
        return prevAdjustmentBlock.difficultyLevel;
    }
};

//New BlockType
const generateNextBlock = (blockData: string) => {
    const previousBlock: BlockType = getmostRecentBlock();
    const difficultyLevel: number = getdifficultyLevel(getChain());
    console.log('difficultyLevel: ' + difficultyLevel);
    const nextid: number = previousBlock.id + 1;
    const nextTimestamp: number = getCurrentTimestamp();
    const newBlock: BlockType = findBlock(nextid, previousBlock.hash, nextTimestamp, blockData, difficultyLevel);
    addBlock(newBlock);

    return newBlock;
};

//Mine for the correct hash. This should connect to our mine button to validate a BlockType via Proof of Work
const findBlock = (id: number, priorHash: string, timestamp: number, data: string, difficultyLevel: number): BlockType => {
    let nonce = 0;
    while (true) {
        const hash: string = calculateHash(id, priorHash, timestamp, data, difficultyLevel, nonce);
        if (hashMatchesdifficultyLevel(hash, difficultyLevel)) {
            return new BlockType(id, hash, priorHash, timestamp, data, difficultyLevel, nonce);
        }
        nonce++;
    }
};

//Calculate hash for BlockType (Maybe we do this automatically as data changes in Vue or on clicking the update button?)
const calculateHashForBlock = (BlockType: BlockType): string => 

calculateHash(BlockType.id, BlockType.priorHash, BlockType.timestamp, BlockType.data, BlockType.difficultyLevel, BlockType.nonce);


//Calculate hash via Crypto-Js SHA256 
const calculateHash = (id: number, priorHash: string, timestamp: number, data: string, difficultyLevel: number, nonce: number): string => 

cryptoJ.SHA256(id + priorHash + timestamp + data + difficultyLevel + nonce).toString();


//Add BlockType, if it's valid
const addBlock = (newBlock: BlockType) => { 
    if (checkValidityNewBlock(newBlock, getmostRecentBlock())) {

    bchain.push(newBlock);
    //Should we update JSON here?
     this.$http.request({
            url: this.defaultServerAddress + "/blocks/" ,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: ({
    "id" : newBlock.id,
    "priorHash" : newBlock.priorHash,
    "timestamp" : newBlock.timestamp,
    "data" : newBlock.data,
    "hash" : newBlock.hash,
    "difficultyLevel" : newBlock.difficultyLevel,
    "nonce" : newBlock.nonce  })
            });
    }
};


//Check that all datatypes are valid
const dataBlockCheck = (BlockType: BlockType): boolean => {
    return typeof BlockType.id === 'number'
        && typeof BlockType.hash === 'string'
        && typeof BlockType.priorHash === 'string'
        && typeof BlockType.timestamp === 'number'
        && typeof BlockType.data === 'string';
};


//Check the validity
const checkValidityNewBlock = (newBlock: BlockType, previousBlock: BlockType): boolean => {
    //Conditions for validity
    if (!dataBlockCheck(newBlock)) {
        
        console.log('Invalid');
        return false;
    }
    if (previousBlock.id + 1 !== newBlock.id) {
        return false;
    } else if (previousBlock.hash !== newBlock.priorHash) {
        return false;
    } else if (!timestampValidCheck(newBlock, previousBlock)) {
        return false;
    } else if (!hasValidHash(newBlock)) {
        return false;
    }
    return true;
};

//The correct chain is that with the greatest accumulated difficulty
const getAccumulateddifficultyLevel = (bchainOne: BlockType[]): number => {
    return bchainOne
        .map((BlockType) => BlockType.difficultyLevel)
        .map((difficultyLevel) => Math.pow(2, difficultyLevel))
        .reduce((a, b) => a + b);
};


//Check timestamp validity.
const timestampValidCheck = (newBlock: BlockType, previousBlock: BlockType): boolean => {

    return ( previousBlock.timestamp - 60 < newBlock.timestamp ) && newBlock.timestamp - 60 < getCurrentTimestamp();
};

const hasValidHash = (BlockType: BlockType): boolean => {

    if (!hashMatchesBlockContent(BlockType)) {
        console.log('invalid:' + BlockType.hash);
        return false;
    }

    if (!hashMatchesdifficultyLevel(BlockType.hash, BlockType.difficultyLevel)) {
        console.log('difficultyLevel not correct. Expected: ' + BlockType.difficultyLevel + 'but got: ' + BlockType.hash);
    }
    return true;
};


//Check that the hash actually matches the BlockType correctly
const hashMatchesBlockContent = (BlockType: BlockType): boolean => {
    const blockHash: string = calculateHashForBlock(BlockType);
    return blockHash === BlockType.hash;
};


//Difficulty level 
const hashMatchesdifficultyLevel = (hash: string, difficultyLevel: number): boolean => {
    const hashInBinary: string = hexToBinary(hash);
    const requiredPrefix: string = '0'.repeat(difficultyLevel);
    return hashInBinary.startsWith(requiredPrefix);
};


//Check if the chain is valid
const chainValidation = (blockchainToValidate: BlockType[]): boolean => {
    //Valid Genesis Check
    const gBlockCheck = (BlockType: BlockType): boolean => {
        return JSON.stringify(BlockType) === JSON.stringify(gBlock);
    };

    if (!gBlockCheck(blockchainToValidate[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!checkValidityNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};

const addBlockToChain = (newBlock: BlockType) => {
    if (checkValidityNewBlock(newBlock, getmostRecentBlock())) {
        bchain.push(newBlock);
        return true;
    }
    return false;
};


//Replace the chain if it's Valid
const replaceChain = (newBlocks: BlockType[]) => {

    if (chainValidation(newBlocks) &&
        getAccumulateddifficultyLevel(newBlocks) > getAccumulateddifficultyLevel(getChain())) {
        console.log('Valid, updating chain.');
        bchain = newBlocks;
        //We need to update the json here//push to the json the new BlockType if it's valid
    } else {
        console.log('Invalid');
    }
};

///Referencing naivecoin util hexToBinary: https://github.com/lhartikk/naivecoin/blob/chapter2/src/util.ts
const hexToBinary = (s: string): string => {
    let ret: string = '';
    const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
    };
    for (let i: number = 0; i < s.length; i = i + 1) {
        if (lookupTable[s[i]]) {
            ret += lookupTable[s[i]];
        } else {
            return "";
        }
    }
    return ret;
};

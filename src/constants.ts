export const contractAddress = '0xfd5C6e8ad339891E3f4d9d85788BB9Ef06701e42';
export const startblock = 121811899;
export const rpcApi = 'https://opt-mainnet.g.alchemy.com/v2/Mjj_SdklUaCdR6EPfVKXb7m6Pj5TjzWL';
export const fromStart = true;
export const merkle_root_csca = "11406887179192998141316434121926377942525639172220901846038964800699077034561";
export const CSCA_TREE_DEPTH = 12;

export interface EventsData {
    [key: string]: {
        index: number;
        commitment: BigInt;
        merkle_root: BigInt;
        blockNumber: number;
    };
}

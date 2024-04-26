import { ApiPromise } from "@polkadot/api";
export default class Crust {
    readonly seeds: string;
    readonly crustApi: ApiPromise;
    constructor(s: string, chainAddr?: string);
    uploadFileToIPFS(file: File): Promise<import("ipfs-core-types/src/root").AddResult>;
    placeStorageOrder(fileCid: string, fileSize: number | undefined, tips: number, memo: string): Promise<any>;
    addPrepaidAmount(fileCid: string, amount: number): Promise<any>;
    getOrderStatus(fileCid: string): Promise<any>;
}

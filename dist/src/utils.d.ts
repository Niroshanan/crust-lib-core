import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
export declare function loadKeyringPair(seeds: string): import("@polkadot/keyring/types").KeyringPair;
export declare const getKeyValue: (obj: any, key: string) => any;
export declare const base64ToFile: (base64String: string, fileName: string) => File;
export declare function sendTx(tx: SubmittableExtrinsic, seeds: string): Promise<boolean>;

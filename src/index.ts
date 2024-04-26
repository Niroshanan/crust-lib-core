import { typesBundleForPolkadot } from "@crustio/type-definitions";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { sendTx } from "./utils";
import { create } from "ipfs-http-client";

export default class Crust {
  readonly seeds: string;
  readonly crustApi: ApiPromise;

  constructor(s: string, chainAddr = "wss://rpc.crust.network") {
    this.seeds = s;
    this.crustApi = new ApiPromise({
      provider: new WsProvider(chainAddr),
      typesBundle: typesBundleForPolkadot,
    });
  }

  async uploadFileToIPFS(file: File) {
    try {
      const keyring = new Keyring();
      const pair = keyring.addFromUri(this.seeds);
      const sig = pair.sign(pair.address);
      const sigHex = "0x" + Buffer.from(sig).toString("hex");

      const authHeader = Buffer.from(`sub-${pair.address}:${sigHex}`).toString(
        "base64"
      );

      const ipfsGateway = "https://crustgateway.com";
      const ipfs = create({
        url: ipfsGateway + "/api/v0/add",
        headers: {
          authorization: "Basic " + authHeader,
        },
      });
      const metadata = await ipfs.add(file);
      if (metadata) {
        return metadata;
      } else {
        throw new Error("IPFS add failed, please try again.");
      }
    } catch (error) {
      throw error;
    }
  }

  async placeStorageOrder(
    fileCid: string,
    fileSize: number = 1 * 1024 * 1024,
    tips: number,
    memo: string
  ): Promise<any> {
    try {
      await this.crustApi.isReadyOrError;
      const tx = this.crustApi.tx.market.placeStorageOrder(
        fileCid,
        fileSize,
        tips,
        memo
      );
      const res = await sendTx(tx, this.seeds);
      this.crustApi.disconnect();
      return res;
    } catch (error) {
      throw error;
    }
  }

  async addPrepaidAmount(fileCid: string, amount: number): Promise<any> {
    try {
      await this.crustApi.isReadyOrError;
      const tx = this.crustApi.tx.market.addPrepaid(fileCid, amount);
      const res = await sendTx(tx, this.seeds);
      this.crustApi.disconnect();
      return res;
    } catch (error) {
      throw error;
    }
  }
  async getOrderStatus(fileCid: string): Promise<any> {
    try {
      await this.crustApi.isReadyOrError;
      const res: any = await this.crustApi.query.market.filesV2(fileCid);
      this.crustApi.disconnect();
      return res.toHuman();
    } catch (error) {
      throw error;
    }
  }
}

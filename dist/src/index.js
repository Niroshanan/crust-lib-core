"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_definitions_1 = require("@crustio/type-definitions");
const api_1 = require("@polkadot/api");
const utils_1 = require("./utils");
const ipfs_http_client_1 = require("ipfs-http-client");
class Crust {
    constructor(s, chainAddr = "wss://rpc.crust.network") {
        this.seeds = s;
        this.crustApi = new api_1.ApiPromise({
            provider: new api_1.WsProvider(chainAddr),
            typesBundle: type_definitions_1.typesBundleForPolkadot,
        });
    }
    uploadFileToIPFS(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keyring = new api_1.Keyring();
                const pair = keyring.addFromUri(this.seeds);
                const sig = pair.sign(pair.address);
                const sigHex = "0x" + Buffer.from(sig).toString("hex");
                const authHeader = Buffer.from(`sub-${pair.address}:${sigHex}`).toString("base64");
                const ipfsGateway = "https://crustgateway.com";
                const ipfs = (0, ipfs_http_client_1.create)({
                    url: ipfsGateway + "/api/v0/add",
                    headers: {
                        authorization: "Basic " + authHeader,
                    },
                });
                const metadata = yield ipfs.add(file);
                if (metadata) {
                    return metadata;
                }
                else {
                    throw new Error("IPFS add failed, please try again.");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    placeStorageOrder(fileCid_1) {
        return __awaiter(this, arguments, void 0, function* (fileCid, fileSize = 1 * 1024 * 1024, tips, memo) {
            try {
                yield this.crustApi.isReadyOrError;
                const tx = this.crustApi.tx.market.placeStorageOrder(fileCid, fileSize, tips, memo);
                const res = yield (0, utils_1.sendTx)(tx, this.seeds);
                this.crustApi.disconnect();
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addPrepaidAmount(fileCid, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.crustApi.isReadyOrError;
                const tx = this.crustApi.tx.market.addPrepaid(fileCid, amount);
                const res = yield (0, utils_1.sendTx)(tx, this.seeds);
                this.crustApi.disconnect();
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOrderStatus(fileCid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.crustApi.isReadyOrError;
                const res = yield this.crustApi.query.market.filesV2(fileCid);
                this.crustApi.disconnect();
                return res.toHuman();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Crust;

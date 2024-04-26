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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTx = exports.base64ToFile = exports.getKeyValue = exports.loadKeyringPair = void 0;
const api_1 = require("@polkadot/api");
const lodash_1 = __importDefault(require("lodash"));
function loadKeyringPair(seeds) {
    const kr = new api_1.Keyring({
        type: "sr25519",
    });
    const krp = kr.addFromUri(seeds);
    return krp;
}
exports.loadKeyringPair = loadKeyringPair;
const getKeyValue = (obj, key) => {
    if (!obj)
        return null;
    for (const k in obj) {
        if (k === key)
            return obj[k];
        if (lodash_1.default.isObject(obj[k]) && !lodash_1.default.isArray(obj[k])) {
            let v = (0, exports.getKeyValue)(obj[k], key);
            if (v)
                return v;
        }
    }
    return null;
};
exports.getKeyValue = getKeyValue;
const base64ToFile = (base64String, fileName) => {
    let arr = base64String.split(","), bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: "image" });
};
exports.base64ToFile = base64ToFile;
function sendTx(tx, seeds) {
    return __awaiter(this, void 0, void 0, function* () {
        const krp = loadKeyringPair(seeds);
        return new Promise((resolve, reject) => {
            tx.signAndSend(krp, ({ events = [], status }) => {
                console.log(`💸  Tx status: ${status.type}, nonce: ${tx.nonce}`);
                if (status.isInBlock) {
                    events.forEach(({ event: { method, section } }) => {
                        if (method === "ExtrinsicSuccess") {
                            console.log(`✅  Place storage order success!`);
                            resolve(true);
                        }
                    });
                }
                else {
                    // Pass it
                }
            }).catch((e) => {
                console.error(` Error: ${e.message}`);
                reject(e);
            });
        });
    });
}
exports.sendTx = sendTx;

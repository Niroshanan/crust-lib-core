import { Keyring } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import _ from "lodash";

export function loadKeyringPair(seeds: string) {
  const kr = new Keyring({
    type: "sr25519",
  });

  const krp = kr.addFromUri(seeds);
  return krp;
}

export const getKeyValue = (obj: any, key: string): any => {
  if (!obj) return null;

  for (const k in obj) {
    if (k === key) return obj[k];

    if (_.isObject(obj[k]) && !_.isArray(obj[k])) {
      let v = getKeyValue(obj[k], key);

      if (v) return v;
    }
  }

  return null;
};

export const base64ToFile = (base64String: string, fileName: string) => {
  let arr: any = base64String.split(","),
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: "image" });
};

export async function sendTx(
  tx: SubmittableExtrinsic,
  seeds: string
): Promise<boolean> {
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
      } else {
        // Pass it
      }
    }).catch((e) => {
      console.error(` Error: ${e.message}`);
      reject(e);
    });
  });
}

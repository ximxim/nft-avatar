import { readFileSync } from "fs";
import { ethers } from "ethers";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ThirdwebSDK,
  NATIVE_TOKEN_ADDRESS,
} from "@3rdweb/sdk";

export const config = {
  api: {
    bodyParser: false,
  },
};

const privateKey = process.env.NEXT_PUBLIC_WALLET_KEY as string;
const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL as string;
const moduleAddress = process.env.NEXT_PUBLIC_THIRD_WEB_NFT_MODULE as string;

const post = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).json({});
    return;
  }
  try {
    const {
      fields: { properties, ...fields },
      files,
    } = await post(req, res);
    const metadata = {
      ...fields,
      properties: JSON.parse(properties),
      image: readFileSync(files.file.filepath),
    };
    const sdk = new ThirdwebSDK(
      new ethers.Wallet(privateKey, ethers.getDefaultProvider(rpcUrl))
    );
    const module = sdk.getNFTModule(moduleAddress);

    const mintStartTimeEpochSeconds = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365;
    const mintEndTimeEpochSeconds = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
    console.log(mintStartTimeEpochSeconds, mintEndTimeEpochSeconds);
    const { payload, signature } = await module.generateSignature({
      metadata,
      price: 0,
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      mintStartTimeEpochSeconds,
      mintEndTimeEpochSeconds,
      to: "0x0000000000000000000000000000000000000000",
    });

    res.status(200).json({ payload, signature });
  } catch (ex) {
    console.log("ex", ex);
    res.status(400).json({});
  }
}

import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ThirdwebSDK, NATIVE_TOKEN_ADDRESS, NftModuleMetadata } from '@3rdweb/sdk';

const privateKey = process.env.NEXT_PUBLIC_WALLET_KEY as string;
const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL as string;
const moduleAddress = process.env.NEXT_PUBLIC_THIRD_WEB_NFT_MODULE as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(400).json({});
    return;
  };
  try {
    const sdk = new ThirdwebSDK(
      new ethers.Wallet(privateKey, ethers.getDefaultProvider(rpcUrl)),
    );
    const metadata = req.body as NftModuleMetadata;
    const module = sdk.getNFTModule(moduleAddress);

    const { payload, signature } = await module.generateSignature({
      metadata,
      price: 0,
      currencyAddress: NATIVE_TOKEN_ADDRESS,
      mintStartTimeEpochSeconds: Math.floor(Date.now() / 1000),
      mintEndTimeEpochSeconds:
        Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
      to: "0x0000000000000000000000000000000000000000",
    });

    res.status(200).json({ payload, signature })
  } catch (ex) {
    console.log('ex', ex);
    res.status(400).json({});
  }
}

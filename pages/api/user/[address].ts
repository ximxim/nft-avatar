import { ThirdwebSDK } from '@3rdweb/sdk';
import { getDefaultProvider } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL as string;
const moduleAddress = process.env.NEXT_PUBLIC_THIRD_WEB_NFT_MODULE as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(400).json({});
    return;
  };
  try {
    const sdk = new ThirdwebSDK(getDefaultProvider(rpcUrl))
    const address = req.query.address as string;
    const module = sdk.getNFTModule(moduleAddress);
    const nfts = await module.getOwned(address);

    res.status(200).json(nfts[nfts.length - 1]);
  } catch (ex) {
    console.log('ex', ex);
    res.status(400).json({});
  }
}

import axios from "axios";
import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  FunctionComponent,
} from "react";
import { ThirdwebSDK, IAppModule, NFTMetadata } from "@3rdweb/sdk";
import { getDefaultProvider, BigNumber } from "ethers";
import { EIP1193Provider } from "ethereum-types";
import {
  Flex,
  Text,
  Icon,
  Image,
  Modal,
  Button,
  Heading,
  useToast,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from "@chakra-ui/react";
import { GiPartyPopper } from "react-icons/gi";
// @ts-ignore
import Confetti from "react-confetti";

import { Web3ModalService, IWalletInfo } from "../../services";

const rpcUrl = process.env.NEXT_PUBLIC_NETWORK_RPC_URL as string;
const moduleAddress = process.env.NEXT_PUBLIC_THIRD_WEB_NFT_MODULE as string;

interface SignatureResponse {
  payload: {
    to: string;
    id: string;
    uri: string;
    price: number;
    metadata: NFTMetadata;
    currencyAddress: string;
    mintEndTimeEpochSeconds: number;
    mintStartTimeEpochSeconds: number;
  };
  signature: string;
}

interface ICurrentUserState {
  minting: boolean;
  nft?: NFTMetadata;
  isLoading: boolean;
  app?: IAppModule;
  isConnecting: boolean;
  disconnect: () => void;
  walletInfo?: IWalletInfo;
  thirdWebSdk?: ThirdwebSDK;
  isCorrectNetwork: boolean;
  switchNetwork: () => void;
  getBalance: (nftId: string) => Promise<BigNumber>;
  mint: (body: FormData) => Promise<boolean>;
  connect: (retryCount?: number) => Promise<void>;
}

const ConfettiComp = () => {
  return (
    // @ts-ignore
    <Confetti />
  );
};

export const UserContext = createContext<ICurrentUserState>({
  minting: false,
  isLoading: false,
  mint: async () => false,
  connect: async () => {},
  isConnecting: false,
  disconnect: () => {},
  isCorrectNetwork: false,
  switchNetwork: () => {},
  getBalance: async () => BigNumber.from(0),
});

export const UserProvider: FunctionComponent = ({ children }) => {
  const toast = useToast();
  const router = useRouter();
  const [walletInfo, setWalletInfo] = useState<IWalletInfo>();
  const [nft, setNft] = useState<NFTMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [minting, setMinting] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);
  const [thirdWebSdk, setThirdWebSdk] = useState<ThirdwebSDK>();
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const link = `${process.env.NEXT_PUBLIC_OPEN_SEA_LINK}/${process.env.NEXT_PUBLIC_THIRD_WEB_NFT_MODULE}/${nft?.id}`;

  /* ========== ACTIONS ========== */
  const handleGetWalletInfo = useCallback(async () => {
    const info = await Web3ModalService.getWalletInfo();
    setWalletInfo(info);
    return info;
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    Web3ModalService.disconnect();
    setWalletInfo(undefined);
    router.replace("/");
  }, []);

  const handleSwitchNetwork = useCallback(async () => {
    const chainCheckResult = await Web3ModalService.checkAndSwitchChain();
    setIsCorrectNetwork(chainCheckResult);
  }, []);

  const connect = useCallback(
    async (retryCount: number = 0) => {
      setIsConnecting(true);
      try {
        // 1. Connect to wallet
        const success = await Web3ModalService.connect();
        if (!success || !Web3ModalService.ethers) throw "Unable to conenct";
        const signer = await Web3ModalService.ethers.getSigner();
        setThirdWebSdk(new ThirdwebSDK(signer));
        // 2. Switch to correct network
        await handleSwitchNetwork();
        // 3. Fetch wallet info to store
        await handleGetWalletInfo();
      } catch (ex) {
        if (retryCount > 0) {
          return handleDisconnectWallet();
        }
        /**
         * adding recurssive call to self in order to retry
         * one more time in case the failure was temporary.
         * Metamask creates a bug after switching the network
         * this recursion solves that issue.
         */
        connect(retryCount + 1);
      } finally {
        setIsConnecting(false);
      }
    },
    [handleDisconnectWallet, handleGetWalletInfo, handleSwitchNetwork]
  );

  const handleMint = useCallback(
    async (body: FormData) => {
      try {
        if (!thirdWebSdk || !body) throw "deps not ready";
        setMinting(true);
        const { data } = await axios.post<SignatureResponse>(
          "/api/createSignature",
          body
        );
        const module = thirdWebSdk.getNFTModule(moduleAddress);
        const nftMinted = await module.mintWithSignature(
          data.payload,
          data.signature
        );
        const mintedNft = await module.get(nftMinted.toString());
        setNft(mintedNft);
        setIsSuccessModalVisible(true);
        return true;
      } catch (ex) {
        console.debug(ex);
        // @ts-ignore
        const error = ex?.data?.message;
        toast({
          title: "Error",
          description: error || "Unable to mint at the moment. Please try again.",
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          status: "error",
        });
        return false;
      } finally {
        setMinting(false);
      }
    },
    [thirdWebSdk]
  );

  const getBalance = useCallback(
    async (nftId: string) => {
      try {
        if (!thirdWebSdk || !nftId) throw "deps not ready";
        const module = thirdWebSdk.getBundleDropModule(moduleAddress);
        const balance = await module.balance(nftId);
        return balance;
      } catch {
        return BigNumber.from(0);
      }
    },
    [thirdWebSdk]
  );

  /* ========== EFFECTS ========== */
  useEffect(() => {
    const { cachedProvider } = Web3ModalService.web3Modal;
    if (!!cachedProvider) {
      connect();
    }

    const provider = window.ethereum as EIP1193Provider;

    if (!provider) return;

    // Listening to networkChanged event from injected wallets to handle edge cases
    provider.on("networkChanged", (newChainId) => {
      setIsCorrectNetwork(Web3ModalService.checkChain(newChainId));
    });

    // Listening to accountsChanged event from injected wallets to handle edge cases
    provider.on("accountsChanged", (accounts) => {
      if (accounts.length) return;
      handleDisconnectWallet();
    });
  }, []);

  useEffect(() => {
    if (!walletInfo?.account || nft) return;

    (async () => {
      const sdk = new ThirdwebSDK(getDefaultProvider(rpcUrl));
      const module = sdk.getNFTModule(moduleAddress);
      const nfts = await module.getOwned(walletInfo?.account);
      setNft(nfts[nfts.length - 1]);
    })();
  }, [walletInfo, nft]);

  return (
    <UserContext.Provider
      value={{
        nft,
        connect,
        minting,
        isLoading,
        getBalance,
        walletInfo,
        thirdWebSdk,
        isConnecting,
        isCorrectNetwork,
        mint: handleMint,
        disconnect: handleDisconnectWallet,
        switchNetwork: handleSwitchNetwork,
      }}
    >
      {isSuccessModalVisible && <ConfettiComp />}
      {children}
      <Modal
        isOpen={isSuccessModalVisible}
        onClose={() => setIsSuccessModalVisible(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Congratulations
            <Icon as={GiPartyPopper} ml={2} />
            <Icon as={GiPartyPopper} ml={1} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" justify="center" align="center" gap={4}>
              <Image src={nft?.image} alt="NFT Image" />
              <Heading textAlign="center" mx={1}>
                {nft?.name?.toUpperCase()}
              </Heading>
              <Text textAlign="center">
                Your NFT avatar is an image and public profile that follows you
                from site to site when you do things like comment or post on a
                web3 DAPP. The information that you provide here will become a
                part of your public profile at NFT avatar.
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              // @ts-ignore
              onClick={() => window.open(link, "_blank").focus()}
            >
              View on Opensea
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </UserContext.Provider>
  );
};

import { useState, useEffect } from 'react';
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
import type { NextPage } from "next";
import {
  Box,
  Icon,
  Text,
  Flex,
  Stack,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  BsGlobe,
  BsWallet2,
  BsShieldLockFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import { RiUser5Fill, RiLeafFill } from "react-icons/ri";
import { VscArrowRight } from 'react-icons/vsc';
import { AiOutlineSafetyCertificate } from 'react-icons/ai';
import { MdOutlineAlternateEmail } from "react-icons/md";

import { Card, useUserContext, IDForm } from "../components";

/* ======================= HOME PAGE ======================= */
const Home: NextPage = () => {
  const { mint } = useUserContext();
  const [solarized, setSolarized] = useState<any>();

  useEffect(() => {
    (async() => {
      // @ts-ignore
      const solarizedDark = await import('react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night');
      setSolarized(solarizedDark.default);
    })();
  }, []);

  return (
    <Box>
      <Heading textAlign="center" display={['block', 'none']}>NFT Avatar</Heading>
      <Flex
        flexDirection={["column", null, "row-reverse"]}
        align="flex-start"
        justifyContent="space-between"
        p={4}
      >
        <IDForm />
        <Stack pr={[0, null, 8]} gap={["8rem", null, "15rem"]} mb="10rem" maxW={[null, null, 'sm', "xl"]}>
          <Stack mt={['2rem', null, "9rem"]}>
            <Heading as="h1" size="2xl" lineHeight={1.1} textAlign={['center', null, 'initial']}>
              One avatar for everything, everywhere.
            </Heading>
            <Text fontSize="lg" fontWeight="semibold" textAlign={['center', null, 'initial']}>
              NFT avatar powers your public profile, visible wherever you post,
              comment, and interact online.
            </Text>
            <Flex fontSize={18} align="center" pt={4} display={['none', null, 'flex']}>
              <Text>
                CREATE NFT AVATAR
              </Text>
              <Icon as={VscArrowRight} ml={3} />
            </Flex>
          </Stack>
          <Stack gap={8}>
            <Card
              flex={1}
              icon={BsFillCheckCircleFill}
              icon2={BsGlobe}
              heading="Set once, seen everywhere."
              body="Create, upload, and manage your globally recognized avatar from a single place."
            />
            <Card
              flex={1}
              icon={RiUser5Fill}
              icon2={MdOutlineAlternateEmail}
              heading="More than just an image."
              body="Instantly tell the web3 who you are and where people can find you. NFT avatar can display avatar, wallet address, and other details such as properties."
            />
            <Card
              flex={1}
              icon={RiLeafFill}
              icon2={AiOutlineSafetyCertificate}
              heading="Environmentally friendly NFTs"
              body="Your avatar is created on Polygon chain. The gas prices are manageable and transactions are very green."
            />
            <Card
              icon={BsShieldLockFill}
              icon2={BsWallet2}
              heading="Public, open, and responsible."
              body="Your avatar is linked to a public wallet address. You choose what to display on NFT avatar enabled sites: what you share on your avatar is open to the web3 world."
            />
          </Stack>
          <Stack gap="1rem">
            <Heading as="h6" fontSize={14} textAlign={['center', null, 'initial']}>FOR WEB3 SITE OWNERS & DEVELOPERS</Heading>
            <Heading as="h2" fontSize={26} textAlign={['center', null, 'initial']}>Join a network of brands building an open web3.</Heading>
            <Text textAlign={['center', null, 'initial']}>Simple open REST API allows retrieving wallet address avatar information easy from any platform. NFT avatar offers many possibilities through open standards.</Text>
            <Stack justify={["center", null, 'initial']} align={["center", null, 'initial']} fontSize={11}>
              <Heading as="h5" fontSize={20} textAlign={['center', null, 'initial']}>Basic Usage</Heading>
              <Box maxW={['xs', 'sm', 'md', 'lg']}>
                <SyntaxHighlighter language='shell' style={solarized} showLineNumbers customStyle={{ borderRadius: '8px' }}>
                  {`curl --location --request \\
GET ${typeof window === 'undefined' ? '[DOMAIN NAME]' : window.location.origin}/api/user/[address]`}
                </SyntaxHighlighter>
              </Box>
              <Heading as="h5" fontSize={20} pt={4} textAlign={['center', null, 'initial']}>Advanced Usage</Heading>
              <Box maxW={['xs', 'sm', 'md', 'lg']}>
                <SyntaxHighlighter language="javascript" style={solarized} showLineNumbers customStyle={{ borderRadius: '8px' }}>
                  {`// Use this setup for dedicated RPC urls for faster fetching
import { ThirdwebSDK } from '@3rdweb/sdk';
import { getDefaultProvider } from 'ethers';
import { useState } from 'react';

function getNFTAvatar(address) {
  const sdk = new ThirdwebSDK(
    getDefaultProvider('${process.env.NEXT_PUBLIC_NETWORK_RPC_URL}')
  )
  const bundleModule = sdk.getNFTModule(
    '${process.env.NEXT_PUBLIC_THIRD_WEB_NFT_MODULE}'
  );
  const nfts = await bundleModule.getOwned(address);

  return nfts[nfts.length - 1];
}`}
                </SyntaxHighlighter>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Home;

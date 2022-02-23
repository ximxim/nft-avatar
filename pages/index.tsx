import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
import { RiUser5Fill } from "react-icons/ri";
import { VscArrowRight } from 'react-icons/vsc';
import { MdOutlineAlternateEmail } from "react-icons/md";

import { Card, useUserContext, IDForm } from "../components";

/* ======================= HOME PAGE ======================= */
const Home: NextPage = () => {
  const { mint } = useUserContext();
  const [solarized, setSolarized] = useState<any>();

  useEffect(() => {
    (async() => {
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
        justifyContent="space-around"
        p={4}
      >
        <IDForm />
        <Stack pr={[0, null, 8]} gap={["8rem", null, "15rem"]} mb="10rem" maxW="xl">
          <Stack mt={['2rem', null, "9rem"]}>
            <Heading as="h1" size="2xl" lineHeight={1.1} textAlign={['center', null, 'initial']}>
              One avatar for everything, everywhere.
            </Heading>
            <Text fontSize="lg" fontWeight="semibold" textAlign={['center', null, 'initial']}>
              Gravatar powers your public profile, visible wherever you post,
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
              body="Instantly tell the web who you are and where people can find you. Gravatar can display links, photos, contact info, wallet addresses, and other details."
            />
            <Card
              icon={BsShieldLockFill}
              icon2={BsWallet2}
              heading="Public, open, and responsible."
              body="Your avatar is linked to a public email address. You choose what to display on Gravatar-enabled sites: what you share on your profile is open to the world."
            />
          </Stack>
          <Stack gap="1rem">
            <Heading as="h6" fontSize={14} textAlign={['center', null, 'initial']}>FOR SITE OWNERS & DEVELOPERS</Heading>
            <Heading as="h2" fontSize={26} textAlign={['center', null, 'initial']}>Join a network of brands building an open web.</Heading>
            <Text textAlign={['center', null, 'initial']}>Resources and plugins for popular content management systems will help you use Gravatar in no time. From a streamlined signup flow to image manipulation and other built‑in benefits, Gravatar offers many possibilities through open standards.</Text>
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
                  {`import { ThirdwebSDK } from '@3rdweb/sdk';
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

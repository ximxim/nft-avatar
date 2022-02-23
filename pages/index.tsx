import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SyntaxHighlighter from 'react-syntax-highlighter';
import type { NextPage } from "next";
import {
  Box,
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
    <Flex
      flexDirection={["column", null, "row-reverse"]}
      align="flex-start"
      justifyContent="space-around"
      p={4}
    >
      <IDForm />
      <Stack pr={[0, null, 8]} gap="10rem" mb="10rem" maxW="xl">
        <Stack mt="9rem">
          <Heading as="h1" size="2xl" lineHeight={1.1}>
            One avatar for everything, everywhere.
          </Heading>
          <Text fontSize="lg" fontWeight="semibold">
            Gravatar powers your public profile, visible wherever you post,
            comment, and interact online.
          </Text>
        </Stack>
        <Stack gap="3rem">
          <Card
            icon={BsFillCheckCircleFill}
            icon2={BsGlobe}
            heading="Set once, seen everywhere."
            body="Create, upload, and manage your globally recognized avatar from a single place."
          />
          <Card
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
          <Heading as="h6" fontSize={14}>FOR SITE OWNERS & DEVELOPERS</Heading>
          <Heading as="h2">Join a network of brands building an open web.</Heading>
          <Text>Resources and plugins for popular content management systems will help you use Gravatar in no time. From a streamlined signup flow to image manipulation and other built‑in benefits, Gravatar offers many possibilities through open standards.</Text>
          <Box maxW={['xs', 'sm', 'md', 'lg']} fontSize={11}>
            <SyntaxHighlighter language="javascript" style={solarized} showLineNumbers>
          {`import { ThirdwebSDK } from '@3rdweb/sdk';
import { getDefaultProvider } from 'ethers';
import { useState } from 'react';

function getNFTAvatar(address) {
  const sdk = new ThirdwebSDK(
    getDefaultProvider('https://polygon-rpc.com')
  )
  const bundleModule = sdk.getNFTModule(
    '0x35BF42Da9f5d61a26675E3c9CEF05a230e011aE0'
  );
  const nfts = await bundleModule.getOwned(address);

  return nfts[nfts.length - 1];
}`}
            </SyntaxHighlighter>
          </Box>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Home;

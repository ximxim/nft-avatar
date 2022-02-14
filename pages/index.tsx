import axios from 'axios';
import { useState } from "react";
import dynamic from 'next/dynamic';
import type { NextPage } from "next";
import { BundleDropMetadata } from "@3rdweb/sdk";
import {
  Box,
  Link,
  Text,
  Heading,
  Flex,
  Container,
  SimpleGrid,
} from "@chakra-ui/react";

const Dropzone = dynamic(
    () => import('../components/Dropzone/Dropzone'),
    {
        ssr: false
    }
)

import { Header, Card, useUserContext } from "../components";

/* ======================= HOME PAGE ======================= */
const Home: NextPage = () => {
  const { mint } = useUserContext();

  return (
    <Flex columnGap="100px" flexDirection={['column', null, 'row-reverse']} align="flex-start" p={4}>
      <Dropzone onFileAccepted={(file) => {
        const body = new FormData();
        body.append("file", file);
        body.append('name', 'Henry');
        body.append('description', 'up to');
        // @ts-ignore
        mint(body);
      }} />
      <Box flex={1}>
        <Heading as="h1" size="4xl">
          Jurrasic Park
        </Heading>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          mt={2}
        >
          Claim your dinosaur NFT on us
        </Text>
      </Box>
    </Flex>
  );
};

export default Home;

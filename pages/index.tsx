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

import { Header, Card, useUserContext, IDForm } from "../components";

/* ======================= HOME PAGE ======================= */
const Home: NextPage = () => {
  const { mint } = useUserContext();

  return (
    <Flex columnGap="100px" flexDirection={['column', null, 'row-reverse']} align="flex-start" p={4}>
      <IDForm />
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

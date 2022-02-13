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
  Skeleton,
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
    <Box minHeight="100vh" display="flex" flexDir="column">
      <Header />
      <Container maxW="container.xl" mt="95px" flex={1}>
        <Box textAlign="center">
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
          <Dropzone onFileAccepted={(file) => {
            const body = new FormData();
            body.append("file", file);
            body.append('name', 'Henry');
            body.append('description', 'up to');
            // @ts-ignore
            mint(body);
          }} />
        </Box>
      </Container>
      <Container as="footer" maxW="xl" textAlign="center" py={10}>
        <Text>
          Made with{" "}
          <span role="img" aria-label="heart emoji">
            ❤️
          </span>{" "}
          by{" "}
          <Link href="https://github.com/ximxim" isExternal>
            ximxim
          </Link>
        </Text>
      </Container>
    </Box>
  );
};

export default Home;

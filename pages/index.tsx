import { useState } from "react";
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

import { Header, Card, useUserContext, DetailsModal } from "../components";

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
            onClick={() =>
              mint({
                id: 'Something',
                uri: 'ipfs://bafkreiemrdnm26x3mpzjkhpewirwrzubjvuje2rbj2lgqexesbqq72utey',
                name: "Some Awesome NFT",
                description: "This is a description of the NFT",
                image:
                  "ipfs://bafkreiemrdnm26x3mpzjkhpewirwrzubjvuje2rbj2lgqexesbqq72utey",
              })
            }
          >
            Claim your dinosaur NFT on us
          </Text>
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

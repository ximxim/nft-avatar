import '../globals.css';
import type { AppProps } from "next/app";
import { ChakraProvider, Container } from "@chakra-ui/react";

import { theme } from "../utils";
import { Header } from '../components';
import { UserProvider } from '../components/UserContext/UserProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <Header />
        <Container
          maxW={[
            null,
            null,
            "container.md",
            "container.lg",
            "container.xl",
          ]}
          p={4}
        >
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </UserProvider>
  );
}

export default MyApp;

import '../globals.css';
import type { AppProps } from "next/app";
import { ChakraProvider, Container } from "@chakra-ui/react";

import { theme } from "../utils";
import { Header } from '../components';
import { UserProvider } from '../components/UserContext/UserProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
        <UserProvider>
        <Header />
        <Container
          maxW={[
            null,
            null,
            "container.lg",
            "container.lg",
            "container.xl",
          ]}
          p={4}
        >
          <Component {...pageProps} />
        </Container>
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FunctionComponent } from "react";
import {
  MdPerson,
  MdNetworkCell,
  MdAccountBalanceWallet,
} from "react-icons/md";
import { GiFishingBoat } from 'react-icons/gi';
import { FaUserAstronaut, FaGithub } from 'react-icons/fa';
import {
  Box,
  Text,
  List,
  Link,
  Icon,
  Flex,
  Alert,
  Button,
  Avatar,
  Popover,
  Skeleton,
  ListItem,
  ListIcon,
  Container,
  AlertIcon,
  IconButton,
  PopoverBody,
  useColorMode,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  PopoverCloseButton,
  Heading,
} from "@chakra-ui/react";

import { useUserContext } from "../UserContext";

const networkName = process.env.NEXT_PUBLIC_CHAIN_NAME as string;

export const Header: FunctionComponent = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const { isCorrectNetwork, connect, isConnecting, walletInfo, switchNetwork, nft } =
    useUserContext();

  return (
    <Box w="100%" zIndex={1} backgroundColor={bgColor}>
      <Container
        maxW="container.xl"
        py={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex alignItems="center">
          <Icon as={FaUserAstronaut} fontSize={40} mr={3} />
          <Heading display={['none', 'block']}>NFT Avatar</Heading>
        </Flex>
        <Box>
          <IconButton
            ml={2}
            // @ts-ignore
            onClick={() => window.open(process.env.NEXT_PUBLIC_OPEN_SEA_COLLECTION, '_blank').focus()}
            aria-label="Checkout Collection on OpenSea"
            icon={<GiFishingBoat />}
          />
          <IconButton
            ml={2}
            // @ts-ignore
            onClick={() => window.open(process.env.NEXT_PUBLIC_GITHUBT_LINK, '_blank').focus()}
            aria-label="Checkout Github Repo"
            icon={<FaGithub />}
          />
          <IconButton
            ml={2}
            onClick={toggleColorMode}
            aria-label="Toggle theme"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          />
          {walletInfo?.account ? (
            <Popover>
              <PopoverTrigger>
                <IconButton
                  ml={2}
                  aria-label="Toggle theme"
                  icon={<Avatar size='xs' name={nft?.name} src={nft?.image} />}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverBody>
                  <List spacing={3} mb={4}>
                    <ListItem>
                      <ListIcon as={MdPerson} />
                      {walletInfo.account || <Skeleton height={20} />}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={MdNetworkCell} />
                      {walletInfo.network?.name || <Skeleton height={20} />}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={MdAccountBalanceWallet} />
                      {walletInfo.wallet[1] || <Skeleton height={20} />}
                    </ListItem>
                  </List>
                  {!isCorrectNetwork && (
                    <Alert status="warning">
                      <AlertIcon />
                      <Box>
                        <Text mb={2}>
                          This app works on {networkName} network.
                        </Text>
                        <Link onClick={switchNetwork}>Switch Network</Link>
                      </Box>
                    </Alert>
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              ml={2}
              onClick={() => connect()}
              isLoading={isConnecting}
              loadingText="Connecting"
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};

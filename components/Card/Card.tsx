import { motion } from "framer-motion";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { BundleDropMetadata } from "@3rdweb/sdk";
import { FunctionComponent } from "react";
import { Stack, StackProps, Box, Flex, Text, Link, BoxProps, Icon, Heading, useColorModeValue } from "@chakra-ui/react";

import { BsGlobe, BsFillCheckCircleFill } from 'react-icons/bs';

interface ICardProps extends StackProps {
  icon: any;
  icon2: any;
  heading: string;
  body: string;
}

export const Card: FunctionComponent<ICardProps> = ({
  icon,
  icon2,
  heading,
  body,
  ...boxProps
}) => {

  return (
    <Stack {...boxProps}>
      <Box>
        <Icon as={icon} fontSize={48} />
        <Icon as={icon2} fontSize={48} ml={2} />
      </Box>
      <Heading as="h2">{heading}</Heading>
      <Text>{body}</Text>
    </Stack>
  );
};

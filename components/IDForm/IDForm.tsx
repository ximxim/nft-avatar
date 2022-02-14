import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from "react";
import {
  Box,
  Code,
  Flex,
  Input,
  Button,
  Divider,
  Collapse,
  FormLabel,
  IconButton,
  FormControl,
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";
import * as yup from "yup";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { MdAdd, MdClose, MdRemove } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";

import { PropertiesForm, PropertiesFormValues } from "./components";
import { useUserContext } from "../UserContext/useUserContext";

const Dropzone = dynamic(() => import("../Dropzone/Dropzone"), {
  ssr: false,
});

interface IIDFormValues {
  image: File;
  name: string;
}

const schema = yup
  .object({
    name: yup.string().required(),
    image: yup.mixed().required(),
  })
  .required();

export const IDForm: FunctionComponent = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [properties, setProperties] = useState<PropertiesFormValues[]>([]);
  const { mint, isLoading, minting, nft } = useUserContext();
  console.log(nft);
  const {
    register,
    setValue,
    unregister,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IIDFormValues>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = useCallback(
    (values: IIDFormValues) => {
      const body = new FormData();
      body.append("file", values.image);
      body.append("name", values.name);
      body.append("properties", JSON.stringify(properties));
      body.append("description", "Create by NFT Avatar");
      mint(body);
    },
    [mint, properties]
  );

  useEffect(() => {
    register("image");

    return () => {
      unregister(["image"]);
    };
  }, [register]);

  const handleAddProperty = useCallback((property: PropertiesFormValues) => {
    const { display_type, ...rest } = property;
    setProperties((prevState) => [
      ...prevState,
      {
        display_type: display_type !== "default" ? display_type : undefined,
        ...rest,
      },
    ]);
  }, []);

  const handleRemoveProperty = useCallback((index: number) => {
    setProperties((prevState) => [...prevState.filter((_, i) => i !== index)]);
  }, []);

  return (
    <Box maxW="xs">
      <FormControl mb={4} isInvalid={!!errors.image?.message}>
        <Dropzone onFileAccepted={(file) => setValue("image", file)} />
        <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
      </FormControl>
      <FormControl mb={4} isInvalid={!!errors.name?.message}>
        <FormLabel htmlFor="name" hidden>Name</FormLabel>
        <Input id="name" type="name" placeholder="Name" {...register("name")} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>
      <Box maxH="180px" overflow="scroll">
        {properties.map((prop, index) => (
          <Flex key={index} maxW="xs" mb={4}>
            <Code mr={2} fontSize={12}>
              {JSON.stringify(prop, null, 2)}
            </Code>
            <IconButton
              fontSize="20px"
              variant="outline"
              icon={<MdClose />}
              aria-label="Remove Property"
              onClick={() => handleRemoveProperty(index)}
            />
          </Flex>
        ))}
      </Box>
      <Collapse in={isOpen} animateOpacity>
        <Divider mb={4} />
        <PropertiesForm onSubmit={handleAddProperty} />
      </Collapse>
      <Flex gap={4}>
        <IconButton
          onClick={onToggle}
          variant="outline"
          aria-label="Toggle Properties"
          fontSize="20px"
          icon={isOpen ? <MdRemove /> : <MdAdd />}
        />
        <Button
          w="100%"
          disabled={!isValid}
          isLoading={minting || isLoading}
          onClick={handleSubmit(onSubmit)}
          loadingText={minting ? "Creating Your Avatar" : ""}
        >
          Create NFT Avatar
        </Button>
      </Flex>
    </Box>
  );
};

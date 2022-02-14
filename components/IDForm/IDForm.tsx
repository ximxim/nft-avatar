import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dynamic from "next/dynamic";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { MdAdd, MdClose } from "react-icons/md";
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
  const [properties, setProperties] = useState<Record<'trait_type' | 'value', string>[]>([]);
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

  const handleAddProperty = useCallback(() => {
    setProperties((prevState) => [...prevState, { trait_type: "", value: "" }]);
  }, []);

  const handleRemoveProperty = useCallback((index: number) => {
    setProperties((prevState) => [...prevState.filter((_, i) => i !== index)]);
  }, []);

  const handleKeyChange = useCallback((index: number, value: string) => {
    setProperties((prevState) => [
      ...prevState.map((val, i) => {
        if (i === index) return { trait_type: value, value: val.value };
        return val;
      }),
    ]);
  }, []);

  const handleValueChange = useCallback((index: number, value: string) => {
    setProperties((prevState) => [
      ...prevState.map((val, i) => {
        if (i === index) return { trait_type: val.trait_type, value };
        return val;
      }),
    ]);
  }, []);

  return (
    <Box maxW="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.image?.message}>
          <Dropzone onFileAccepted={(file) => setValue("image", file)} />
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>
        <FormControl mb={4} isInvalid={!!errors.name?.message}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            type="name"
            placeholder="Name"
            {...register("name")}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        {properties.map((val, index) => (
          <Flex gap={2} key={index}>
            <FormControl mb={4}>
              <Input
                placeholder="key"
                onChange={(e) => handleKeyChange(index, e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <Input
                placeholder="value"
                onChange={(e) => handleValueChange(index, e.target.value)}
              />
            </FormControl>
            <IconButton
              onClick={() => handleRemoveProperty(index)}
              variant="outline"
              aria-label="Call Sage"
              fontSize="20px"
              icon={<MdClose />}
            />
          </Flex>
        ))}
        <Flex gap={4}>
          <IconButton
            onClick={handleAddProperty}
            variant="outline"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<MdAdd />}
          />
          <Button
            w="100%"
            isLoading={minting || isLoading}
            type="submit"
            disabled={!isValid}
            loadingText={minting ? "Creating Your Avatar" : ""}
          >
            Create NFT Avatar
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

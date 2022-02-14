import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dynamic from "next/dynamic";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
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
  const { mint, isLoading, minting } = useUserContext();
  const {
    register,
    setValue,
    unregister,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IIDFormValues>({
    resolver: yupResolver(schema),
    mode: 'all'
  });

  const onSubmit = useCallback(
    (values: IIDFormValues) => {
      const body = new FormData();
      body.append("file", values.image);
      body.append("name", values.name);
      body.append("description", "Create by NFT Avatar");
      mint(body);
    },
    [mint]
  );

  useEffect(() => {
    register("image");
    return () => {
      unregister(["image"]);
    };
  }, [register]);

  return (
    <Box>
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
        <Button w="100%" isLoading={minting || isLoading} type="submit" disabled={!isValid} loadingText={minting ? 'Creating Your Avatar' : ''}>
          Create NFT Avatar
        </Button>
      </form>
    </Box>
  );
};

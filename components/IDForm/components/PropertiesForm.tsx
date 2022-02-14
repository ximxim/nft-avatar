import React, {
  useState,
  useEffect,
  useCallback,
  FunctionComponent,
} from "react";
import {
  Box,
  Flex,
  Input,
  Select,
  Button,
  FormLabel,
  IconButton,
  FormControl,
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { MdAdd, MdClose, MdRemove } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";

import { useUserContext } from "../../UserContext/useUserContext";

type DisplayType = "boost_number" | "boost_percentage" | "number" | "date" | 'default' | undefined;

export interface PropertiesFormValues {
  trait_type: string;
  value: string | number;
  display_type: DisplayType;
}

const schema = yup
  .object({
    trait_type: yup.string().required(),
    value: yup.mixed().required(),
  })
  .required();

interface IPropertiesFormProps {
  onSubmit: (property: PropertiesFormValues) => void;
}

export const PropertiesForm: FunctionComponent<IPropertiesFormProps> = ({ onSubmit }) => {
  const {
    reset,
    watch,
    register,
    setValue,
    resetField,
    unregister,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PropertiesFormValues>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    register("display_type");

    return () => {
      unregister(["display_type"]);
    };
  }, [register]);

  const handleSubmission = useCallback((property: PropertiesFormValues) => {
    onSubmit(property);
    reset();
    resetField('value');
    resetField('trait_type')
    resetField('display_type');
  }, [onSubmit]);

  return (
      <Box>
        <Flex gap={2}>
          <FormControl mb={4}>
            <FormLabel htmlFor="trait_type" hidden>trait_type</FormLabel>
            <Input
              id="trait_type"
              placeholder="key"
              {...register("trait_type")}
            />
            <FormErrorMessage>{errors.trait_type?.message}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="value" hidden>value</FormLabel>
            <Input
              id="value"
              placeholder="value"
              {...register("value")}
            />
            <FormErrorMessage>{errors.value?.message}</FormErrorMessage>
          </FormControl>
        </Flex>
        <FormControl mb={4}>
          <FormLabel htmlFor="value" hidden>display_type</FormLabel>
          <Select placeholder='display_type' onChange={e => setValue('display_type', e.target.value as DisplayType)}>
            <option value='default'>default</option>
            <option value='number'>number</option>
            <option value='date'>date</option>
            <option value='boost_number'>boost_number</option>
            <option value='boost_percentage'>boost_percentage</option>
          </Select>
          <FormErrorMessage>{errors.display_type?.message}</FormErrorMessage>
        </FormControl>
        <Button
          mb={4}
          w="100%"
          disabled={!isValid}
          onClick={handleSubmit(handleSubmission)}
        >
          Add Property
        </Button>
      </Box>
  );
};

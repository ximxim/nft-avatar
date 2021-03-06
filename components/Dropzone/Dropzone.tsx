import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUserAstronaut } from 'react-icons/fa';
import { Center, useColorModeValue, Icon, Image, Text, Flex } from '@chakra-ui/react';

export default function Dropzone({ onFileAccepted }: { onFileAccepted: (file: File) => void }) {
  const [createObjectURL, setCreateObjectURL] = useState<string>();
  const onDrop = useCallback((acceptedFiles) => {
    onFileAccepted(acceptedFiles[0]);
    setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]));
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: 'image/*', maxFiles: 1, multiple: false,
  });

  const dropText = isDragActive ? 'Drop the file here ...' : 'Drag \'n\' drop image file here, or click to select a file';

  const activeBg = useColorModeValue('gray.300', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.700');

  return (
    <Center
      w="xs"
      h="xs"
      cursor="pointer"
      bg={isDragActive ? activeBg : 'transparent'}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="2px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {createObjectURL ? (
        <Image src={createObjectURL} alt="Uploaded Image" />
      ) : (
        <Flex p={10} flexDir="column" justify="center" align="center">
          <Icon as={FaUserAstronaut} m={2} fontSize={100} opacity={0.5} />
          <Text textAlign="center" opacity={0.5}>{dropText}</Text>
        </Flex>
      )}
    </Center>
  );
}

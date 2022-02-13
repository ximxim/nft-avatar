import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillFileAdd } from 'react-icons/ai';
import { Center, useColorModeValue, Icon, Image, Box } from '@chakra-ui/react';

export default function Dropzone({ onFileAccepted }: { onFileAccepted: (file: File) => void }) {
  const [createObjectURL, setCreateObjectURL] = useState<string>();
  const onDrop = useCallback((acceptedFiles) => {
    onFileAccepted(acceptedFiles[0]);
    setCreateObjectURL(URL.createObjectURL(acceptedFiles[0]));

  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: '.png', maxFiles: 1, multiple: false,
  });

  const dropText = isDragActive ? 'Drop the files here ...' : 'Drag \'n\' drop .torrent file here, or click to select files';

  const activeBg = useColorModeValue('gray.100', 'gray.600');
  const borderColor = useColorModeValue(
    isDragActive ? 'teal.300' : 'gray.300',
    isDragActive ? 'teal.500' : 'gray.500',
  );

  return (
    <Center
      w="sm"
      h="sm"
      cursor="pointer"
      bg={isDragActive ? activeBg : 'transparent'}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {createObjectURL ? (
        <Image src={createObjectURL} alt="Uploaded Image" />
      ) : (
        <Box p={10}>
          <Icon as={AiFillFileAdd} mr={2} />
          <p>{dropText}</p>
        </Box>
      )}
    </Center>
  );
}

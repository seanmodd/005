import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, Textarea, Code, VStack, Button, } from "@chakra-ui/react"

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });

  };
  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()]
    })
    console.log(result)
    setCode(result.outputFiles[0].text)
  };

  return (

    <ChakraProvider>

      <VStack align="center" justify="center" my={30} spacing={30}>
        <Textarea
          bg="blue.50"
          color="blue.900"
          w="50%"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div>
          <Button colorScheme="whatsapp" onClick={onClick}>Submit</Button>
        </div>
        <Code>{code}</Code>
      </VStack>

    </ChakraProvider>

  );
};

ReactDOM.render(<App />, document.querySelector('#root'));



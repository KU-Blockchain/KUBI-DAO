import * as React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import NavBar from '../components/NavBar';
import { Web3Provider } from "@/contexts/Web3Context";



const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
    <ChakraProvider theme={theme}>
      <NavBar />
      <Component {...pageProps} />
    </ChakraProvider>
    </Web3Provider>
  );
}

export default MyApp;

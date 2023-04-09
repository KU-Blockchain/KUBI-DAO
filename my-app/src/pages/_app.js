import * as React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import NavBar from '../components/NavBar';
import { Web3Provider } from "@/contexts/Web3Context";
import {DataBaseProvider} from "@/contexts/DataBaseContext";



const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <DataBaseProvider>
    <Web3Provider>
    <ChakraProvider theme={theme}>
      <NavBar />
      <Component {...pageProps} />
    </ChakraProvider>
    </Web3Provider>
    </DataBaseProvider>
  );
}

export default MyApp;

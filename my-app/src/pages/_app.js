import * as React from "react";
import { ChakraProvider, extendTheme, Flex, Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { Web3Provider } from "@/contexts/Web3Context";
import { DataBaseProvider } from "@/contexts/DataBaseContext";

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
          <Flex direction="column" minH="100vh">
            <Box as="header">
              <NavBar />
            </Box>
            <Flex as="main" direction="column" flex="1" overflow="hidden">
              <Component {...pageProps} />
            </Flex>
          </Flex>
        </ChakraProvider>
      </Web3Provider>
    </DataBaseProvider>
  );
}

export default MyApp;

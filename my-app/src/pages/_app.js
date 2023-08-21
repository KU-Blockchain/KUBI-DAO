import * as React from "react";
import { useRouter } from 'next/router'; // Import useRouter
import { useEffect } from "react";
import { ChakraProvider, extendTheme, Flex, Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { Web3Provider } from "@/contexts/Web3Context";
import { DataBaseProvider } from "@/contexts/DataBaseContext";
import { LeaderboardProvider } from "@/contexts/leaderboardContext";

const theme = extendTheme({
  config: {
    brand: {
      100: "#6495ED",
    }
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter(); // Get the router object

  useEffect(() => {
    document.title = 'KUBI DAO';
  }, []);
  return (
    <DataBaseProvider>
      <Web3Provider>
        <LeaderboardProvider>
          <ChakraProvider theme={theme}>
            <Flex 
              direction="column" 
              minH="100vh" 
              bg={router.pathname === "/tasks" ? "clear" : "#1285ff"} // Set the background based on the current route
            >
              <Box as="header">
                <NavBar />
              </Box>
              <Flex as="main" direction="column" flex="1" overflow="hidden">
                <Component {...pageProps} />
              </Flex>
            </Flex>
          </ChakraProvider>
        </LeaderboardProvider>
      </Web3Provider>
    </DataBaseProvider>
  );
}

export default MyApp;

import { Box, Container } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";

function Layout({ children }) {
	const { pathname } = useLocation();
	return (
		<Box position={"relative"} w='full'>
			<Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
				<Header />
                {children}
			</Container>
		</Box>
	);
}

export default Layout;
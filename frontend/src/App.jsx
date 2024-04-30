import { Routes, Route } from "react-router-dom"
import UserPage from "./pages/UserPage"
import Header from "./components/Header"
import PostPage from "./pages/PostPage"
import { Container } from "@chakra-ui/react"

function App() {

  return (
    <Container maxW="620px">
      <Header/>
      <Routes>
        <Route path="/:username" element={<UserPage/>}/>
        <Route path="/:username/post/:pid" element={<PostPage/>}/>

      </Routes>
    </Container>
  )
}

export default App

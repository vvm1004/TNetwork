import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import RoomPage from "./pages/RoomPage";
import { SettingsPage } from "./pages/SettingsPage";
import Layout from "./Layout";

function App() {
    const user = useRecoilValue(userAtom);
    return (
        <Routes>
            <Route path='/' element={user ? <Layout><HomePage /></Layout> : <Navigate to='/auth' />} />
            <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
            <Route path='/update' element={user ? <Layout><UpdateProfilePage /></Layout> : <Navigate to='/auth' />} />
            <Route path='/:username' element={user ? <Layout><UserPage /><CreatePost /></Layout> : <UserPage />} />
            <Route path='/:username/post/:pid' element={<Layout><PostPage /></Layout>} />
            <Route path='/chat' element={user ? <Layout><ChatPage /></Layout> : <Navigate to='/auth' />} />
            <Route path='/settings' element={user ? <Layout><SettingsPage /></Layout> : <Navigate to='/auth' />} />
            <Route path='/room/:roomID' element={user? <RoomPage /> :  <Navigate to='/auth' />} />
        </Routes>
    );
}

export default App;

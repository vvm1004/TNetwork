import { Button, Flex, Image, Link, useColorMode, Badge } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings, MdNotifications } from "react-icons/md";
import { useSocket } from "../context/SocketContext";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import axios from "../customize/axios.jsx"
import messageSound from "../assets/sounds/message.mp3";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const showToast = useShowToast();
	const { socket } = useSocket()
	const [unreadCount, setUnreadCount] = useState(0);

	const fetchUnreadCount = async () => {
		try {
			const { data } = await axios.get("/api/v1/notifications/unreadCount", {
				headers: {
					'x-client-id': user._id,
				},
			});
			setUnreadCount(data.unreadCount)

		} catch (error) {
			console.log("Error fetching unread count:", error);
		}
	};

	useEffect(() => {
		if (user) {
			fetchUnreadCount();

			socket?.on("newNotification2", () => {
				fetchUnreadCount();
				showToast("New Notification", "You have a new notification", "info");
				const sound = new Audio(messageSound)
				sound.play()
			});


			return () => {
				socket?.off("newNotification");
			};
		}
	}, [user, socket]);

	const handleNotificationsClick = async () => {
		setUnreadCount(0)

	};
	return (

		<Flex justifyContent={"space-between"} mt={6} mb='12'>
			{user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

			<Image
				cursor={"pointer"}
				alt='logo'
				w={6}
				src={colorMode === "dark" ? "/logo_light.png" : "/logo_dark.png"}
				onClick={toggleColorMode}
			/>

			{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link
						as={RouterLink}
						to={`/notifications`}
						position="relative"
						onClick={handleNotificationsClick}
					>
						<MdNotifications size={20} />
						{unreadCount > 0 && (
							<Badge
								position="absolute"
								top="-1"
								right="-1"
								colorScheme="red"
								borderRadius="full"
								fontSize="xs"
							>
								{unreadCount}
							</Badge>
						)}
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

export default Header;

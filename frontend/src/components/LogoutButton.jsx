import { Button } from "@chakra-ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";
import axios from '../customize/axios'

const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);

	const handleLogout = async () => {
		try {
			const res = await axios.post("/api/v1/users/logout", {}, {
				headers: {
					"Content-Type": "application/json",
					"x-client-id": currentUser._id,
				},
			});
			const data = res.data;

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user");
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");

			setUser(null);
		} catch (error) {
			showToast("Error", error.response ? error.response.data.error : error.message, "error");
		}
	};

	return (
		<Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
			<FiLogOut size={20} />
		</Button>
	);
};

export default LogoutButton;

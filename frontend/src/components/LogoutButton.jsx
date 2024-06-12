import { Button } from "@chakra-ui/button";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast"
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const currenUser = useRecoilValue(userAtom)

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/v1/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'x-client-id': currenUser._id
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user");
			setUser(null);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};
	return (
		<Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout}>
			<FiLogOut size={20} />
		</Button>
	);
};

export default LogoutButton;
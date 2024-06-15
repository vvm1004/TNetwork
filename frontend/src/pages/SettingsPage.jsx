import { Button, Text } from "@chakra-ui/react";
import axios from "../customize/axios";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();
	const currentUser = useRecoilValue(userAtom);

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		try {
			const res = await axios.put("/api/v1/users/freeze", {}, {
				headers: { 
					"Content-Type": "application/json",
					'x-client-id': currentUser._id
				},
			});

			const data = res.data;

			if (data.error) {
				return showToast("Error", data.error, "error");
			}
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.response ? error.response.data.error : error.message, "error");
		}
	};

	return (
		<>
			<Text my={1} fontWeight={"bold"}>
				Freeze Your Account
			</Text>
			<Text my={1}>You can unfreeze your account anytime by logging in.</Text>
			<Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
				Freeze
			</Button>
		</>
	);
};

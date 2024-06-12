import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const curentUser = useRecoilValue(userAtom)
	const logout = async () => {
		try {
			const res = await fetch("/api/v1/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					'x-client-id': curentUser._id
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

	return logout;
};

export default useLogout;
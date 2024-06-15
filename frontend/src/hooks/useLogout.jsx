import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from '../customize/axios'

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();

	const logout = async () => {
		try {
			const res = await axios.post("/api/v1/users/logout", {}, {
				headers: {
					"Content-Type": "application/json",
					'x-client-id': currentUser._id
				},
			});
			const data = res.data;

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			localStorage.removeItem("user");
			setUser(null);
			navigate('/auth');
		} catch (error) {
			showToast("Error", error.response ? error.response.data.error : error.message, "error");
		}
	};

	return logout;
};

export default useLogout;

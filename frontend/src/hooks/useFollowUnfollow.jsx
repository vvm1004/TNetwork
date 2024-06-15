import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import axios from '../customize/axios'

const useFollowUnfollow = (user) => {
	const currentUser = useRecoilValue(userAtom);
	const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
	const [updating, setUpdating] = useState(false);
	const showToast = useShowToast();

	const handleFollowUnfollow = async () => {
        if (!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }
        if (updating) return;

        setUpdating(true);
        try {
            const res = await axios.post(`/api/v1/users/follow/${user._id}`, {}, {
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

            const updatedFollowing = !following;
            setFollowing(updatedFollowing);

            if (updatedFollowing) {
                showToast("Success", `Followed ${user.name}`, "success");
            } else {
                showToast("Success", `Unfollowed ${user.name}`, "success");
            }
        } catch (error) {
			showToast("Error", error.response ? error.response.data.error : error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

	return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
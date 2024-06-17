import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Flex, Text, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem, Spinner } from "@chakra-ui/react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart, FaReply } from "react-icons/fa";
import axios from "../customize/axios";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext";
import { useRecoilValue } from "recoil";

const NotificationPage = () => {
    const currentUser = useRecoilValue(userAtom);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const showToast = useShowToast();
    const { socket } = useSocket();
    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get("/api/v1/notifications", {
                headers: {
                    'x-client-id': currentUser._id
                }
            });
            setNotifications(data);
            setIsLoading(false);
        } catch (error) {
            showToast("Error", error.response ? error.response.data.error : error.message, "error");
            setIsLoading(false); // Ensure isLoading is set to false on error
        }
    };

    const deleteNotifications = async () => {
        try {
            await axios.delete("/api/v1/notifications", {
                headers: {
                    'x-client-id': currentUser._id
                }
            });
            showToast("Success", "Notifications deleted successfully", "success");
            fetchNotifications(); // Refetch after deletion
        } catch (error) {
            showToast("Error", error.response ? error.response.data.error : error.message, "error");
        }
    };

    useEffect(() => {
        fetchNotifications();
        socket?.on("newNotification", (notification) => {
            setNotifications((prevNotifications) => [notification, ...prevNotifications]);
            fetchNotifications();
        });


        return () => {
            socket?.off("newNotification");
        };
    }, [socket]);

    return (
        <Box borderTop="1px" flex="4" borderLeft="1px" borderRight="1px" borderColor="gray.700" minH="100vh">
            <Flex justify="space-between" align="center" p="4" borderBottom="1px" borderColor="gray.700">
                <Text fontWeight="bold">Notifications</Text>
                <Menu>
                    <MenuButton as={IconButton} icon={<IoSettingsOutline />} />
                    <MenuList>
                        <MenuItem onClick={deleteNotifications}>Delete all notifications</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            {isLoading ? (
                <Flex justify="center" align="center" height="full">
                    <Spinner size={"lg"} />
                </Flex>
            ) : (
                <>
                    {notifications.length === 0 ? (
                        <Text textAlign="center" p="4" fontWeight="bold">
                            No notifications 🤔
                        </Text>
                    ) : (
                        notifications.map((notification) => (
                            <Box borderBottom="1px" borderColor="gray.700" key={notification._id}>
                                <Flex gap="2" p="4">
                                    {notification.type === "follow" && <FaUser className="w-7 h-7 text-primary" />}
                                    {notification.type === "like" && <FaHeart className="w-7 h-7 text-red-500" />}
                                    {notification.type === "replies" && <FaReply className="w-7 h-7 text-blue-500" />} {/* Thêm icon cho reply */}

                                    <Link to={`/${notification.from.username}`}>
                                        <Avatar src={notification.from.profilePic || "/avatar-placeholder.png"} size="sm" />
                                        <Flex gap="1">
                                            <Text fontWeight="bold">@{notification.from.username}</Text>{" "}
                                            {notification.type === "follow" ? (
                                                <Text>followed you</Text>
                                            ) : notification.type === "like" ? (
                                                <Text>liked your post</Text>
                                            ) : notification.type === "replies" ? (
                                                <Text Text > replied to your post</Text>
                                            ) : null}
                                        </Flex>
                                    </Link>
                                </Flex>
                            </Box>
                        ))
                    )}
                </>
            )}
        </Box >
    );
};

export default NotificationPage;
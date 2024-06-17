import { atom } from "recoil";

const notificationsAtom = atom({
  key: "notificationsAtom",
  default: {
    data: [],
    unreadCount: 0,
  },
});

export default notificationsAtom;

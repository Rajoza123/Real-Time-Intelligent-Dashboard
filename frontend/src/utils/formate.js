import dayjs from "dayjs";

export const prettyTime = (iso) => dayjs(iso).format("HH:mm:ss");
export const ago = (iso) => dayjs(iso).fromNow?.() || iso;

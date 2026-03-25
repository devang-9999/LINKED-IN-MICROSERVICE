import { io, Socket } from "socket.io-client";

export let socket: Socket;

export const connectSocket = () => {
  socket = io(process.env.NEXT_PUBLIC_NOTIFICATION_URL!, {
    withCredentials: true,
    transports: ["websocket"],
  });

  return socket;
};
export const getSocket = () => socket;
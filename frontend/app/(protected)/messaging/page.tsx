/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "./Messaging.css";

import { Box, Button, IconButton, Avatar } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SearchIcon from "@mui/icons-material/Search";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  headline?: string;
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  roomId: string;
  createdAt: string;
  status?: "sent" | "delivered" | "seen";
};

export default function MessagingLayout() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [me, setMe] = useState<string | null>(null);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ================= GET CURRENT USER ================= */
  useEffect(() => {
    fetch("http://localhost:4000/users/profile/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("👤 Me:", data);
        setMe(data.id);
      })
      .catch((err) => console.error("Failed to fetch me", err));
  }, []);

  /* ================= GET USERS ================= */
  useEffect(() => {
    if (!me) return;

    axios
      .get("http://localhost:4000/users/profile/messaging/users", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("👥 Users:", res.data);
        setUsers(res.data);
      })
      .catch((err) => console.error("Failed to load users", err));
  }, [me]);

  /* ================= SOCKET INIT ================= */
  useEffect(() => {
    if (!me) return;

    console.log("🔌 Connecting to SOCKET → 3005");

    const socket = io("http://localhost:3005", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err);
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      socket.disconnect();
    };
  }, [me]);

  /* ================= GLOBAL MESSAGE LISTENER ================= */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handler = (msg: Message) => {
      console.log("📩 Incoming:", msg);

      setConversationId((prev) => prev || msg.roomId);

      setMessages((prev) => {
        const exists = prev.find((m) => m.id === msg.id);
        if (exists) return prev;
        return [...prev, msg];
      });

      socket.emit("messageDelivered", {
        messageId: msg.id,
      });
    };

    socket.on("newMessage", handler);

    return () => socket.off("newMessage", handler);
  }, []);

  /* ================= SELECT USER ================= */
  const handleSelectUser = async (user: User) => {
    console.log("👆 Selected:", user);

    setSelectedUser(user);
    setMessages([]);
    setConversationId(null);

    const res = await fetch("http://localhost:3005/conversations", {
      credentials: "include",
    });

    const conversations = await res.json();

    console.log("💬 Conversations:", conversations);

    const convo = conversations.find((c: any) =>
      c.participants.includes(user.id)
    );

    if (convo) {
      console.log("✅ Found conversation:", convo.id);
      setConversationId(convo.id);
    } else {
      console.log("🆕 No conversation yet");
    }
  };

  /* ================= ROOM JOIN + FETCH ================= */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversationId) return;

    console.log("📡 Joining:", conversationId);

    socket.emit("joinRoom", conversationId);
    socket.emit("fetchMessages", { roomId: conversationId });

    const messagesHandler = (msgs: Message[]) => {
      console.log("📥 Messages:", msgs);
      setMessages(msgs);
    };

    const seenHandler = () => {
      console.log("👁 Seen update");
      setMessages((prev) =>
        prev.map((m) => ({ ...m, status: "seen" }))
      );
    };

    const typingHandler = () => {
      setOtherUserTyping(true);

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        setOtherUserTyping(false);
      }, 1500);
    };

    socket.on("messages", messagesHandler);
    socket.on("messagesSeen", seenHandler);
    socket.on("typing", typingHandler);

    return () => {
      socket.emit("leaveRoom", conversationId);
      socket.off("messages", messagesHandler);
      socket.off("messagesSeen", seenHandler);
      socket.off("typing", typingHandler);
    };
  }, [conversationId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = () => {
    const socket = socketRef.current;

    if (!messageText.trim() || !selectedUser || !socket) return;

    console.log("📤 Sending:", {
      roomId: conversationId,
      receiverId: selectedUser.id,
      content: messageText,
    });

    socket.emit("sendMessage", {
      roomId: conversationId || undefined,
      receiverId: selectedUser.id,
      content: messageText,
    });

    setMessageText("");
  };

  /* ================= UI ================= */
  return (
    <Box className="messaging-wrapper">
      <Box className="messaging-container">

        {/* LEFT PANEL */}
        <Box className="conversation-panel">
          <Box className="search-bar">
            <SearchIcon />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <div className="user-list">
            {users.length === 0 && (
              <div style={{ padding: 20, color: "#666" }}>
                No connections yet
              </div>
            )}

            {users
              .filter((u) =>
                `${u.firstName} ${u.lastName}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user.id}
                  className={`user-item ${
                    selectedUser?.id === user.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar
                    src={`http://localhost:4000/uploads/${user.profilePicture}`}
                  />
                  <div>
                    <div>{user.firstName} {user.lastName}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {user.headline}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Box>

        {/* CHAT WINDOW */}
        <Box className="chat-window">
          <Box className="chat-header">
            {selectedUser
              ? `${selectedUser.firstName} ${selectedUser.lastName}`
              : "Select a user"}
          </Box>

          <div className="chat-messages">
            {messages.map((msg) => {
              const isMe = msg.senderId === me;

              return (
                <div key={msg.id} className={`message-row ${isMe ? "me" : ""}`}>
                  <div className={`message-bubble ${isMe ? "sent" : "received"}`}>
                    {msg.content}

                    <div className="msg-time">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>

                    {isMe && (
                      <div style={{ fontSize: 10 }}>{msg.status}</div>
                    )}
                  </div>
                </div>
              );
            })}

            {otherUserTyping && <div>Typing...</div>}

            <div ref={messagesEndRef} />
          </div>

          {selectedUser && (
            <Box className="chat-input-area">
              <div className="chat-input">
                <IconButton onClick={() => setShowEmojiPicker((p) => !p)}>
                  <SentimentSatisfiedAltIcon />
                </IconButton>

                <input
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);

                    if (conversationId) {
                      socketRef.current?.emit("typing", {
                        roomId: conversationId,
                      });
                    }
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendMessage()
                  }
                />

                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <EmojiPicker
                      onEmojiClick={(e) =>
                        setMessageText((p) => p + e.emoji)
                      }
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleSendMessage}>Send</Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  userId: string;
  text: string;
  username: string;
  userImage?: string;
  createdAt: Date;
  pinned: boolean;
  pinnedBy?: string;
  replyingTo?: {
    messageId: string;
    username: string;
    text: string;
  };
  reactions: Array<{
    id: string;
    username: string;
    emoji: string;
  }>;
  readBy: Array<{
    id: string;
    userId: string;
    userImage?: string;
  }>;
}

// interface ClubChatPageProps {
//   userId: string;
//   username: string;
//   userImage?: string;
// }
const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export default function ClubChatPage() {
  const { user } = useAuth();
    const userId = user?.uid || "anonymous";
    const username = user?.displayName || "Anonymous";
    const userImage = user?.photoURL || undefined;
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  const [highlightedMessage, setHighlightedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const fetchMessages = async (pageNum: number = 1) => {
    try {
      const response = await fetch(
        `/api/messages?page=${pageNum}&limit=20`
      );
      const data = await response.json();
      
      if (pageNum === 1) {
        setMessages(data.messages);
      } else {
        setMessages((prev) => [...data.messages, ...prev]);
      }
      
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(1), 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessageIds = messages
        .filter((msg) => !msg.readBy.some((r) => r.userId === userId))
        .map((msg) => msg.id);

      if (unreadMessageIds.length > 0) {
        await fetch(`/api/messages/mark-read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageIds: unreadMessageIds, userId, userImage }),
        });
      }
    };

    if (messages.length > 0) {
      markMessagesAsRead();
    }
  }, [messages, userId, userImage]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
      fetchMessages(page + 1);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          text: message,
          username,
          userImage,
          replyingTo: replyingTo
            ? {
                messageId: replyingTo.id,
                username: replyingTo.username,
                text: replyingTo.text,
              }
            : undefined,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const msg = messages.find((m) => m.id === messageId);
      const userReaction = msg?.reactions?.find(
        (r) => r.username === username && r.emoji === emoji
      );

      const endpoint = userReaction ? "remove-reaction" : "add-reaction";
      
      const response = await fetch(`/api/messages/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, username, emoji }),
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? updatedMessage : m))
        );
      }
      
      setShowEmojiPicker(null);
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const handleTogglePin = async (messageId: string, pinned: boolean) => {
    try {
      const response = await fetch(`/api/messages/toggle-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          pinned,
          pinnedBy: pinned ? username : undefined,
        }),
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? updatedMessage : m))
        );
      }
      
      setShowMessageMenu(null);
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
      
      setShowMessageMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: element.offsetTop - messagesContainerRef.current.offsetTop,
        behavior: "smooth",
      });

      setHighlightedMessage(messageId);
      setTimeout(() => setHighlightedMessage(null), 1500);
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pinnedMessages = messages.filter((msg) => msg.pinned);
  const regularMessages = messages;
  const seenUsers =
    messages.length > 0 ? messages[messages.length - 1].readBy || [] : [];

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white shadow-2xl border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Chat</h1>
              <p className="text-indigo-200 mt-1 text-sm">
                Connected as <span className="font-semibold">{username}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Pinned Messages Section */}
      {pinnedMessages.length > 0 && (
        <div className="bg-amber-50 border-b-2 border-amber-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="text-sm text-amber-900 font-bold mb-3 flex items-center">
              <span className="text-lg mr-2">📌</span> Pinned Messages
            </div>
            <div className="space-y-2">
              {pinnedMessages.slice(-2).map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start p-3 rounded-xl bg-white hover:bg-amber-100 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group"
                  onClick={() => scrollToMessage(msg.id)}>
                  <Image
                    width={32}
                    height={32}
                    src={msg.userImage || "/default-avatar.png"}
                    alt={msg.username}
                    className="w-8 h-8 rounded-full mr-3 object-cover ring-2 ring-amber-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-800">
                      {msg.username}
                    </div>
                    <div className="text-sm text-slate-600 truncate">
                      {msg.text}
                    </div>
                    {msg.pinnedBy && (
                      <div className="text-xs text-amber-700 mt-1 font-medium">
                        Pinned by {msg.pinnedBy}
                      </div>
                    )}
                  </div>
                  {msg.pinnedBy === username && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePin(msg.id, false);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-amber-600 hover:text-amber-800 ml-2 transition-all p-2 rounded-full hover:bg-amber-200 text-sm font-bold">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mb-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                {loading ? "Loading..." : "Load More Messages"}
              </button>
            </div>
          )}

          {/* Messages */}
          {regularMessages
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((msg) => (
              <div
                id={`message-${msg.id}`}
                key={msg.id}
                className={`mb-6 transition-all duration-300 ${
                  highlightedMessage === msg.id
                    ? "bg-blue-100 rounded-2xl p-4 shadow-lg"
                    : ""
                }`}>
                <div
                  className={`flex ${
                    msg.userId === userId ? "justify-end" : "justify-start"
                  }`}>
                  {/* Avatar for others' messages */}
                  {msg.userId !== userId && (
                    <Image
                      width={40}
                      height={40}
                      src={msg.userImage || "/default-avatar.png"}
                      alt={msg.username}
                      className="w-10 h-10 rounded-full mr-3 object-cover ring-2 ring-indigo-200 shadow-md"
                    />
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 relative group shadow-md ${
                      msg.userId === userId
                        ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white"
                        : "bg-white text-slate-800"
                    }`}
                    onMouseLeave={() => {
                      setShowEmojiPicker(null);
                      setShowMessageMenu(null);
                    }}>
                    {/* Reply indicator */}
                    {msg.replyingTo && (
                      <div
                        className={`text-sm mb-3 px-3 py-2 rounded-lg ${
                          msg.userId === userId
                            ? "bg-indigo-700/50"
                            : "bg-slate-100"
                        }`}>
                        Replying to{" "}
                        <span className="font-bold">
                          {msg.replyingTo.username}
                        </span>
                        : 
                        {msg.replyingTo.text.length > 30
                          ? msg.replyingTo.text.slice(0, 30) + "..."
                          : msg.replyingTo.text}
                        
                      </div>
                    )}

                    {/* Message Header */}
                    <div className="flex items-center mb-2">
                      {msg.userId !== userId && (
                        <span className="font-bold text-base mr-2">
                          {msg.username}
                        </span>
                      )}
                      <span
                        className={`text-xs ${
                          msg.userId === userId
                            ? "text-indigo-100"
                            : "text-slate-500"
                        }`}>
                        {formatTime(msg.createdAt)}
                      </span>

                      {/* Message Actions */}
                      <div className="ml-auto flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            setShowEmojiPicker(
                              showEmojiPicker === msg.id ? null : msg.id
                            )
                          }
                          className={`text-lg transition-all p-1.5 rounded-full ${
                            msg.userId === userId
                              ? "hover:bg-indigo-700"
                              : "hover:bg-slate-100"
                          }`}>
                          😊
                        </button>
                        <button
                          onClick={() =>
                            setShowMessageMenu(
                              showMessageMenu === msg.id ? null : msg.id
                            )
                          }
                          className={`text-lg transition-all p-1.5 rounded-full ${
                            msg.userId === userId
                              ? "hover:bg-indigo-700"
                              : "hover:bg-slate-100"
                          }`}>
                          •••
                        </button>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="mb-3">
                      <p className="leading-relaxed text-base">{msg.text}</p>
                    </div>

                    {/* Emoji Picker */}
                    {showEmojiPicker === msg.id && (
                      <div
                        className={`absolute -top-14 left-0 flex space-x-2 p-3 rounded-xl z-50 shadow-2xl ${
                          msg.userId === userId
                            ? "bg-indigo-700"
                            : "bg-white"
                        } border-2 border-indigo-300`}>
                        {EMOJI_OPTIONS.map((emoji) => {
                          const userReaction = msg.reactions?.find(
                            (r) => r.username === username && r.emoji === emoji
                          );
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`text-2xl hover:scale-125 rounded-full p-2 transition-transform ${
                                userReaction ? "bg-indigo-200" : ""
                              }`}>
                              {emoji}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Message Menu */}
                    {showMessageMenu === msg.id && (
                      <div
                        className={`absolute right-2 top-14 z-10 rounded-xl shadow-2xl py-2 border-2 ${
                          msg.userId === userId
                            ? "bg-indigo-800 border-indigo-600"
                            : "bg-white border-slate-200"
                        }`}>
                        <button
                          onClick={() => {
                            setReplyingTo(msg);
                            setShowMessageMenu(null);
                          }}
                          className={`flex items-center w-full px-5 py-3 text-sm font-medium transition-all ${
                            msg.userId === userId
                              ? "hover:bg-indigo-700 text-white"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}>
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            />
                          </svg>
                          Reply
                        </button>
                        <button
                          onClick={() => handleTogglePin(msg.id, !msg.pinned)}
                          className={`flex items-center w-full px-5 py-3 text-sm font-medium transition-all ${
                            msg.userId === userId
                              ? "hover:bg-indigo-700 text-white"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}>
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          {msg.pinned ? "Unpin" : "Pin"}
                        </button>
                        {msg.userId === userId && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    )}

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {Array.from(
                          new Set(msg.reactions.map((r) => r.emoji))
                        ).map((emoji) => {
                          const count =
                            msg.reactions?.filter((r) => r.emoji === emoji)
                              .length || 0;
                          const userReaction = msg.reactions?.find(
                            (r) => r.username === username && r.emoji === emoji
                          );
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`text-sm px-3 py-1.5 rounded-full flex items-center font-medium transition-all hover:scale-110 ${
                                msg.userId === userId
                                  ? userReaction
                                    ? "bg-white text-indigo-900"
                                    : "bg-indigo-700"
                                  : userReaction
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-800"
                              }`}>
                              {emoji} {count > 1 ? count : ""}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Avatar for own messages */}
                  {msg.userId === userId && (
                    <Image
                      width={40}
                      height={40}
                      src={msg.userImage || "/default-avatar.png"}
                      alt={msg.username}
                      className="w-10 h-10 rounded-full ml-3 object-cover ring-2 ring-indigo-200 shadow-md"
                    />
                  )}
                </div>
              </div>
            ))}

          <div ref={messagesEndRef} />

          {/* Seen indicators */}
          {seenUsers.length > 0 && (
            <div className="flex justify-end items-center mt-4">
              <div className="flex -space-x-2">
                {seenUsers
                  .slice(0, 5)
                  .filter((reader) => reader.userId !== userId)
                  .map((reader, i) => (
                    <Image
                      key={i}
                      width={32}
                      height={32}
                      src={reader.userImage || "/default-avatar.png"}
                      alt={reader.userId}
                      className="w-8 h-8 rounded-full ring-2 ring-white shadow-md"
                    />
                  ))}
                {seenUsers.length > 5 && (
                  <span className="text-sm text-slate-600 bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center font-bold ring-2 ring-white shadow-md">
                    +{seenUsers.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-t-2 border-indigo-200 shadow-inner">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-indigo-900 text-sm">
                Replying to: {replyingTo.username}
              </div>
              <div className="text-slate-600 truncate text-sm">
                {replyingTo.text}
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="ml-4 text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-full hover:bg-indigo-100 font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t-2 border-slate-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-6 py-4 text-base border-2 border-slate-300 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none">
            <Send size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}
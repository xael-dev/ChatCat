import { useEffect, useMemo, useState } from "react";
import { Composer } from "./components/Composer";
import { ConnectionBadge } from "./components/ConnectionBadge";
import { MessageList } from "./components/MessageList";
import { Sidebar } from "./components/Sidebar";
import { fetchChatBootstrap } from "./lib/api";
import { useChatSocket } from "./lib/chatSocket";
import { appConfig } from "./lib/config";

function createOutgoingMessage({ text, roomId, currentUser }) {
  return {
    id: `local-${crypto.randomUUID()}`,
    roomId,
    author: currentUser.name,
    authorId: currentUser.id,
    text,
    createdAt: new Date().toISOString(),
    pending: true,
  };
}

export default function App() {
  const [bootstrap, setBootstrap] = useState({
    currentUser: { id: "local-user", name: "You", status: "online" },
    rooms: [],
    messages: [],
  });
  const [activeRoomId, setActiveRoomId] = useState("general");

  useEffect(() => {
    let cancelled = false;

    fetchChatBootstrap().then((payload) => {
      if (cancelled) {
        return;
      }

      setBootstrap(payload);

      if (payload.rooms.length > 0) {
        setActiveRoomId(payload.rooms[0].id);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeRoom = useMemo(
    () => bootstrap.rooms.find((room) => room.id === activeRoomId) || bootstrap.rooms[0],
    [activeRoomId, bootstrap.rooms],
  );

  const visibleMessages = useMemo(
    () => bootstrap.messages.filter((message) => message.roomId === activeRoom?.id),
    [activeRoom?.id, bootstrap.messages],
  );

  const { status, sendMessage } = useChatSocket({
    roomId: activeRoom?.id,
    url: appConfig.wsUrl.replace(/\/[^/]+$/, ""),
    currentUser: bootstrap.currentUser,
    onMessage: (incoming) => {
      setBootstrap((current) => {
        const messages = current.messages.filter(
          (message) => !message.pending || message.text !== incoming.text,
        );

        return {
          ...current,
          messages: [
            ...messages,
            {
              ...incoming,
              pending: false,
            },
          ],
        };
      });
    },
  });

  const send = (text) => {
    if (!activeRoom) {
      return;
    }

    const optimisticMessage = createOutgoingMessage({
      text,
      roomId: activeRoom.id,
      currentUser: bootstrap.currentUser,
    });

    setBootstrap((current) => ({
      ...current,
      messages: [...current.messages, optimisticMessage],
    }));

    const delivered = sendMessage({
      ...optimisticMessage,
      pending: false,
    });

    if (!delivered) {
      window.setTimeout(() => {
        setBootstrap((current) => ({
          ...current,
          messages: current.messages.map((message) =>
            message.id === optimisticMessage.id
              ? { ...message, pending: false }
              : message,
          ),
        }));
      }, 900);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <Sidebar
        rooms={bootstrap.rooms}
        activeRoomId={activeRoom?.id}
        currentUser={bootstrap.currentUser}
        onSelectRoom={setActiveRoomId}
      />

      <main className="chat-layout">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Current room</p>
            <h2>{activeRoom?.name || "Loading"}</h2>
            <p className="room-topic">{activeRoom?.topic}</p>
          </div>
          <div className="chat-header-meta">
            <div className="header-stat">
              <span>{activeRoom?.members || 0}</span>
              <p>members</p>
            </div>
            <ConnectionBadge status={status} />
          </div>
        </header>

        <section className="chat-stage">
          <MessageList
            messages={visibleMessages}
            currentUserId={bootstrap.currentUser.id}
          />
        </section>

        <footer className="chat-footer">
          <div className="composer-meta">
            <p>
              FastAPI integration target:
              <code>{appConfig.apiBaseUrl}</code>
            </p>
            <p>
              WebSocket endpoint:
              <code>{appConfig.wsUrl}</code>
            </p>
          </div>
          <Composer disabled={!activeRoom} onSend={send} />
        </footer>
      </main>
    </div>
  );
}

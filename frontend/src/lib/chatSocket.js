import { useEffect, useRef, useState } from "react";

function parseIncomingMessage(payload) {
  if (!payload) {
    return null;
  }

  if (payload.type === "message" && payload.message) {
    return payload.message;
  }

  if (payload.id && payload.text) {
    return payload;
  }

  return null;
}

export function useChatSocket({ roomId, url, currentUser, onMessage }) {
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!url || !roomId) {
      setStatus("offline");
      return undefined;
    }

    let isDisposed = false;

    const connect = () => {
      const resolvedUrl = url.endsWith(`/${roomId}`) ? url : `${url}/${roomId}`;
      const socket = new WebSocket(resolvedUrl);
      socketRef.current = socket;
      setStatus("connecting");

      socket.addEventListener("open", () => {
        if (isDisposed) {
          return;
        }

        setStatus("connected");

        socket.send(
          JSON.stringify({
            type: "presence",
            userId: currentUser.id,
            name: currentUser.name,
            roomId,
          }),
        );
      });

      socket.addEventListener("message", (event) => {
        try {
          const payload = JSON.parse(event.data);
          const incoming = parseIncomingMessage(payload);

          if (incoming) {
            onMessageRef.current?.(incoming);
          }
        } catch {
          // Ignore malformed websocket payloads from backend experiments.
        }
      });

      socket.addEventListener("close", () => {
        if (isDisposed) {
          return;
        }

        setStatus("reconnecting");
        reconnectTimeoutRef.current = window.setTimeout(connect, 1600);
      });

      socket.addEventListener("error", () => {
        socket.close();
      });
    };

    connect();

    return () => {
      isDisposed = true;

      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }

      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [currentUser.id, currentUser.name, roomId, url]);

  const sendMessage = (message) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(
      JSON.stringify({
        type: "message",
        roomId,
        message,
      }),
    );

    return true;
  };

  return {
    sendMessage,
    status,
  };
}

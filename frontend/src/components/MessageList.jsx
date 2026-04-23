function formatTime(value) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function MessageList({ messages, currentUserId }) {
  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.map((message) => {
        const isCurrentUser = message.authorId === currentUserId;

        return (
          <article
            className={`message-card${isCurrentUser ? " own" : ""}${
              message.pending ? " pending" : ""
            }`}
            key={message.id}
          >
            <div className="message-header">
              <strong>{isCurrentUser ? "You" : message.author}</strong>
              <span>{formatTime(message.createdAt)}</span>
            </div>
            <p>{message.text}</p>
          </article>
        );
      })}
    </div>
  );
}

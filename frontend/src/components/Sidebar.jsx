export function Sidebar({ rooms, activeRoomId, currentUser, onSelectRoom }) {
  return (
    <aside className="sidebar">
      <div className="brand-panel">
        <div className="brand-mark" aria-hidden="true">
          C
        </div>
        <div>
          <p className="eyebrow">Self-hosted chat</p>
          <h1>ChatCat</h1>
        </div>
      </div>

      <section className="user-panel">
        <p className="panel-label">Signed in as</p>
        <div className="user-chip">
          <span className="status-dot online" aria-hidden="true" />
          <div>
            <strong>{currentUser.name}</strong>
            <p>{currentUser.status}</p>
          </div>
        </div>
      </section>

      <section className="room-panel">
        <div className="room-panel-header">
          <p className="panel-label">Rooms</p>
          <span>{rooms.length}</span>
        </div>

        <div className="room-list">
          {rooms.map((room) => {
            const isActive = room.id === activeRoomId;

            return (
              <button
                key={room.id}
                className={`room-item${isActive ? " active" : ""}`}
                onClick={() => onSelectRoom(room.id)}
                type="button"
              >
                <div>
                  <strong>{room.name}</strong>
                  <p>{room.topic}</p>
                </div>
                <div className="room-meta">
                  <span>{room.members}</span>
                  {room.unreadCount > 0 ? (
                    <span className="unread-badge">{room.unreadCount}</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}

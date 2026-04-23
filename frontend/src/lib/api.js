import { appConfig } from "./config";

export async function fetchChatBootstrap() {
  try {
    const response = await fetch(`${appConfig.apiBaseUrl}/api/chat/bootstrap`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Bootstrap request failed with ${response.status}`);
    }

    return await response.json();
  } catch {
    return {
      currentUser: {
        id: "local-user",
        name: "You",
        status: "online",
      },
      rooms: [
        {
          id: "general",
          name: "General",
          topic: "Default room for the current FastAPI websocket endpoint.",
          unreadCount: 0,
          members: 24,
        },
        {
          id: "product",
          name: "Product",
          topic: "Roadmap, bugs, and deployment planning.",
          unreadCount: 3,
          members: 10,
        },
        {
          id: "ops",
          name: "Ops",
          topic: "Self-hosting notes and incident chatter.",
          unreadCount: 0,
          members: 5,
        },
      ],
      messages: [
        {
          id: "seed-1",
          roomId: "general",
          author: "Mira",
          authorId: "mira",
          text: "FastAPI wiring should be straightforward once the websocket contract is fixed.",
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          pending: false,
        },
        {
          id: "seed-2",
          roomId: "general",
          author: "Jon",
          authorId: "jon",
          text: "The frontend already supports optimistic sends and reconnection states.",
          createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
          pending: false,
        },
      ],
    };
  }
}

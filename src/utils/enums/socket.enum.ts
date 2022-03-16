export enum SOCKET_TYPES {
  WALLET_UPDATE = "walletUpdate",
  CUSTOMER_VERIFIED = "customerVerified",
}

export enum CHAT_SOCKET_TYPES {
  SUBSCRIBE_TO_CHAT = "subscribe-to-chat",
  ENTER_CHAT_ROOM = "enter-chat-room",
  ALL_MESSAGES = "all-messages",
  NEW_MESSAGE = "new-message",
  USER_CONNECT = "user-connect",
  ALL_ROOMS_LISTING = "all-rooms-listing",
  ALL_ROOMS = "all-rooms",
  CHAT_ROOM_CHANGED = "chat-room-changed",
  CLEAR_RECENT_MESSAGE = "clear-recent-message",
}

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  contacts: { byId: {}, allIds: [] },
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,
  participants: [],
  recipients: [],

  //own states
  chats: [],
  currentChatRoom: null,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    saveChats(state, action) {
      state.chats = action.payload;
    },
    setCurrentChat(state, action) {
      state.currentChatRoom = action.payload;
    },
    updateChatRoom(state, action) {
      let message = action.payload?.payload;
      let temp = [...state.chats];

      let index = temp.findIndex(
        (chat) => chat.chatRoomId == message.chatRoomId
      );

      if (index == -1) {
        temp.push(message);
      } else {
        temp[index] = message;

        temp = temp?.sort(function (a: any, b: any) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      }
      state.chats = temp;
    },
  },
});

export default slice.reducer;

export const { saveChats, setCurrentChat, updateChatRoom } = slice.actions;

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
  },
});

export default slice.reducer;

export const { saveChats, setCurrentChat } = slice.actions;

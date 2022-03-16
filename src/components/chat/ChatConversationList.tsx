import { List } from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { SkeletonConversationItem } from "../../components/skeleton";
import { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentChat } from "../../store/reducers/chatSlice";
import ChatConversationItem from "./ChatConversationItem";

ChatConversationList.propTypes = {
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  sx: PropTypes.object,
};

export default function ChatConversationList({
  isOpenSidebar,
  activeConversationId,
  sx,
  ...other
}) {
  const { chats } = useAppSelector((state: RootState) => state.chat);

  const dispatch = useAppDispatch();

  const { push } = useRouter();

  const loading = false;

  return (
    <List disablePadding sx={sx} {...other}>
      {(loading ? [...Array(12)] : chats).map((item, index) =>
        item ? (
          <ChatConversationItem
            key={item?._id}
            isOpenSidebar={isOpenSidebar}
            conversation={item}
            isSelected={activeConversationId === item?._id}
            onSelectConversation={() => {
              dispatch(setCurrentChat(item));
              push(`/chat/${item?.chatRoomId}`);
            }}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}

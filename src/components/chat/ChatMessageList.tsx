import PropTypes from "prop-types";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import LightboxModal from "../../components/LightboxModal";
import Scrollbar from "../../components/Scrollbar";
import { SocketContext } from "../../context/socket";
import { RootState } from "../../store/";
import { CHAT_SOCKET_TYPES } from "../../utils/enums/socket.enum";
import ChatMessageItem from "./ChatMessageItem";

ChatMessageList.propTypes = {
  conversation: PropTypes.object.isRequired,
};

export default function ChatMessageList({ conversation }) {
  const scrollRef = useRef(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { currentChatRoom } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    console.log("--use effect called--");
    console.log(scrollRef.current);

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.length]);

  const imagesLightbox = conversation
    .filter((messages) => messages.image)
    .map((messages) => messages.image);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{ ref: scrollRef }}
        sx={{ p: 3, height: 1 }}
      >
        {conversation.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={currentChatRoom}
            onOpenLightbox={handleOpenLightbox}
          />
        ))}
      </Scrollbar>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}

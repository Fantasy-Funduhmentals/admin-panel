import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import LightboxModal from "../../components/LightboxModal";
import Scrollbar from "../../components/Scrollbar";
import { RootState } from "../../store/";
import ChatMessageItem from "./ChatMessageItem";

ChatMessageList.propTypes = {
  conversation: PropTypes.object.isRequired,
};

export default function ChatMessageList({ conversation, otherUser }) {
  const scrollRef = useRef(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { currentChatRoom } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (scrollRef.current) {
      console.log("---use effect called---");
      scrollRef.current.scrollIntoView({ behavior: "smooth" });

      // scrollRef.current.scrollBottom = scrollRef.current.scrollHeight + 100;
    }
  }, [conversation.length]);

  console.log(scrollRef);

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
        // scrollableNodeProps={{ ref: scrollRef }}
        sx={{ p: 3, height: 1 }}
        // ref={scrollRef}
      >
        <div>
          {conversation.map((message) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              otherUser={otherUser}
              conversation={currentChatRoom}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
          <div ref={scrollRef} />
        </div>
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

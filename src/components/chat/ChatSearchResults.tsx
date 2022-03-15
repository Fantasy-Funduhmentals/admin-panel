import { Avatar, ListItemButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useMemo } from "react";
import SearchNotFound from "../../components/SearchNotFound";
import { useAppDispatch } from "../../store/hooks";
import { setCurrentChat } from "../../store/reducers/chatSlice";
import { getOtherUser } from "../../utils/helpers";

ChatSearchResults.propTypes = {
  query: PropTypes.string,
  results: PropTypes.array,
  onSelectContact: PropTypes.func,
};

export default function ChatSearchResults({ query, results, onSelectContact }) {
  const isFound = results.length > 0;
  const dispatch = useAppDispatch();
  const { push } = useRouter();

  return (
    <>
      <Typography
        paragraph
        variant="subtitle1"
        sx={{ px: 3, color: "text.secondary" }}
      >
        Contacts
      </Typography>

      {results.map((result) => {
        const otherUser = useMemo(() => {
          return getOtherUser(result.members);
        }, []);

        return (
          <ListItemButton
            key={result.id}
            onClick={() => {
              dispatch(setCurrentChat(result));
              push(`/chat/${result?.chatRoomId}`);
            }}
            sx={{
              px: 3,
              py: 1.5,
              typography: "subtitle2",
            }}
          >
            <Avatar
              alt={otherUser.name}
              src={otherUser.profilePicture}
              sx={{ mr: 2 }}
            />
            {otherUser.name}
          </ListItemButton>
        );
      })}

      {!isFound && (
        <SearchNotFound
          searchQuery={query}
          sx={{
            p: 3,
            mx: "auto",
            width: `calc(100% - 48px)`,
            bgcolor: "background.neutral",
          }}
        />
      )}
    </>
  );
}

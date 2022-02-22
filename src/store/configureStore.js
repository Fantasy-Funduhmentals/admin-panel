import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { verifyAuth } from "./actions/authActions";
import { renderAdminPanelData } from "./actions/walletActions";

const configureStore = () => {
  const middleware = [thunk];
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  store.dispatch(verifyAuth());
  store.dispatch(renderAdminPanelData());
  return store;
};

export default configureStore;

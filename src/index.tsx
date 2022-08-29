import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.less";

import App from "./app/App";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);

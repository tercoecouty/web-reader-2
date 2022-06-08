import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./normalize.less";
import "./index.less";

import App from "./app/App";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);

// import "./index.less";
// function Demo() {
//     return (
//         <h1>hello world</h1>
//     );
// }

// ReactDOM.createRoot(document.getElementById("root")).render(<Demo />);

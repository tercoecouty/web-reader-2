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

// import "./normalize.less";
// import "./index.less";
// function Demo() {
//     return (
//         <div>
//             <h1>hello world</h1>
//             <span className="bookmark-icon">
//                 <span></span>
//                 <span></span>
//             </span>
//         </div>
//     );
// }

// ReactDOM.createRoot(document.getElementById("root")).render(<Demo />);

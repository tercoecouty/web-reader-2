import "./App.less";
import LeftSidebar from "./Sidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar";
import Book from "./Book/Book";

export default function App() {
    return (
        <div className="app theme-default">
            <LeftSidebar />
            <Book />
            <RightSidebar />
        </div>
    );
}

// import { useEffect } from "react";
// export default function App() {
//     return <h1>hello world</h1>;
// }

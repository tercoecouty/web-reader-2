import "./App.less";
import LeftSidebar from "./Sidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar";
import Book from "./Book/Book";

export default function App() {
    return (
        <div className="app">
            <LeftSidebar />
            <Book />
            <RightSidebar />
        </div>
    );
}

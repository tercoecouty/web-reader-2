import "./App.less";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
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

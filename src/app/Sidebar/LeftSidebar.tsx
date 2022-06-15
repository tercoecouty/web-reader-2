import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SidebarItem from "./SidebarItem";

import TeamSvg from "./svg/team.svg?raw";
import BarsSvg from "./svg/bars.svg?raw";
import SearchSvg from "./svg/search.svg?raw";
import BookSvg from "./svg/book.svg?raw";
import SettingSvg from "./svg/setting.svg?raw";

import Drawer from "../../component/Drawer";
import Classes from "../Classes";
import Notes from "../Notes";
import Bookmarks from "../Bookmarks";

import {
    selectShowClasses,
    selectShowBookmarks,
    selectLoginUser,
    selectNotesUser,
    appActions,
} from "../../slice/appSlice";

export default function LeftSidebar() {
    const dispatch = useDispatch();
    const showClasses = useSelector(selectShowClasses);
    const showBookmarks = useSelector(selectShowBookmarks);
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);
    const [showNotes, setShowNotes] = useState(false);

    return (
        <div style={{ width: "48px", borderRight: "1px solid black" }}>
            <SidebarItem svg={TeamSvg} title="班级列表" onClick={() => dispatch(appActions.setShowClasses(true))} />
            <SidebarItem
                svg={BarsSvg}
                title="笔记"
                onClick={() => setShowNotes(true)}
                disabled={notesUser.id !== loginUser.id}
            />
            <SidebarItem
                svg={BookSvg}
                title="书签"
                onClick={() => dispatch(appActions.setShowBookmarks(true))}
                disabled={notesUser.id !== loginUser.id}
            />
            <SidebarItem svg={SearchSvg} title="搜索" disabled />
            <SidebarItem svg={SettingSvg} title="设置" disabled />
            <Drawer
                visible={showClasses}
                title="班级列表"
                position="left"
                onClose={() => dispatch(appActions.setShowClasses(false))}
            >
                <Classes />
            </Drawer>
            <Drawer visible={showNotes} title="笔记" position="left" onClose={() => setShowNotes(false)}>
                <Notes />
            </Drawer>
            <Drawer
                visible={showBookmarks}
                title="书签"
                position="left"
                onClose={() => dispatch(appActions.setShowBookmarks(false))}
            >
                <Bookmarks />
            </Drawer>
        </div>
    );
}

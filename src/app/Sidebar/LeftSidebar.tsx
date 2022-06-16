import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./LeftSidebar.less";

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
import Search from "../Search";

import {
    selectShowClasses,
    selectShowBookmarks,
    selectShowNotes,
    selectShowSearch,
    selectLoginUser,
    selectNotesUser,
    appActions,
} from "../../slice/appSlice";

export default function LeftSidebar() {
    const dispatch = useDispatch();
    const showClasses = useSelector(selectShowClasses);
    const showBookmarks = useSelector(selectShowBookmarks);
    const showNotes = useSelector(selectShowNotes);
    const showSearch = useSelector(selectShowSearch);
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);

    return (
        <div className="left-sidebar">
            <SidebarItem svg={TeamSvg} title="班级列表" onClick={() => dispatch(appActions.setShowClasses(true))} />
            <SidebarItem
                svg={BarsSvg}
                title="笔记"
                onClick={() => dispatch(appActions.setShowNotes(true))}
                disabled={notesUser?.id !== loginUser?.id}
            />
            <SidebarItem
                svg={BookSvg}
                title="书签"
                onClick={() => dispatch(appActions.setShowBookmarks(true))}
                disabled={notesUser?.id !== loginUser?.id}
            />
            <SidebarItem
                svg={SearchSvg}
                title="搜索"
                onClick={() => dispatch(appActions.setShowSearch(true))}
                disabled={notesUser?.id !== loginUser?.id}
            />
            <SidebarItem svg={SettingSvg} title="设置" disabled />
            <Drawer
                visible={showClasses}
                title="班级列表"
                position="left"
                onClose={() => dispatch(appActions.setShowClasses(false))}
            >
                <Classes />
            </Drawer>
            <Drawer
                visible={showNotes}
                title="笔记"
                position="left"
                onClose={() => dispatch(appActions.setShowNotes(false))}
            >
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
            <Drawer
                visible={showSearch}
                title="搜索"
                position="left"
                onClose={() => dispatch(appActions.setShowSearch(false))}
            >
                <Search />
            </Drawer>
            <div
                className="view-others-prompt"
                style={{ visibility: notesUser?.id === loginUser?.id ? "hidden" : "visible" }}
            >
                正在查看 <span>{notesUser?.name}</span> 的笔记，点击{" "}
                <button onClick={() => dispatch(appActions.setNotesUser(loginUser))}>退出</button>
            </div>
        </div>
    );
}

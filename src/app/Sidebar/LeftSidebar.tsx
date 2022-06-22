import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import "./LeftSidebar.less";

import Icon from "../../component/Icon";
import TeamSvg from "../../svg/team.svg?raw";
import BarsSvg from "../../svg/bars.svg?raw";
import SearchSvg from "../../svg/search.svg?raw";
import BookSvg from "../../svg/book.svg?raw";
import SettingSvg from "../../svg/setting.svg?raw";

import Drawer from "../../component/Drawer";
import Classes from "../Classes";
import Notes from "../Notes";
import Bookmarks from "../Bookmarks";
import Search from "../Search";
import Prompt from "./Prompt";

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
            <Icon svg={TeamSvg} onClick={() => dispatch(appActions.setShowClasses(true))} />
            <Icon
                svg={BarsSvg}
                onClick={() => dispatch(appActions.setShowNotes(true))}
                className={classNames({ disabled: notesUser?.id !== loginUser?.id })}
            />
            <Icon
                svg={BookSvg}
                onClick={() => dispatch(appActions.setShowBookmarks(true))}
                className={classNames({ disabled: notesUser?.id !== loginUser?.id })}
            />
            <Icon
                svg={SearchSvg}
                onClick={() => dispatch(appActions.setShowSearch(true))}
                className={classNames({ disabled: notesUser?.id !== loginUser?.id })}
            />
            <Icon svg={SettingSvg} className="disabled" />
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
            {notesUser?.id !== loginUser?.id && (
                <Prompt userName={notesUser?.name} onClose={() => dispatch(appActions.setNotesUser(loginUser))} />
            )}
        </div>
    );
}

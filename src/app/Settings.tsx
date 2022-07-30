import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Settings.less";

import Switch from "../component/Switch";
import Select from "../component/Select";

import { bookActions, selectTwoPage, selectIndent, selectLineSpacing } from "../slice/bookSlice";
import { selectShowSettings } from "../slice/appSlice";

export default function Settings() {
    const dispatch = useDispatch();
    const showSettings = useSelector(selectShowSettings);
    const _twoPage = useSelector(selectTwoPage);
    const _indent = useSelector(selectIndent);

    const [hasChange, setHasChange] = useState(false);
    const [twoPage, setTwoPage] = useState(_twoPage);
    const [indent, setIndent] = useState(_indent);

    useEffect(() => {
        if (!showSettings) {
            setTwoPage(_twoPage);
            setIndent(_indent);
            setHasChange(false);
        }
    }, [showSettings]);

    const toggleTwoPage = () => {
        setTwoPage(!twoPage);
        setHasChange(true);
    };

    const handleIndentChange = (value: number) => {
        setIndent(value);
        setHasChange(true);
    };

    const saveSettings = () => {
        if (twoPage !== _twoPage) {
            dispatch(bookActions.setTwoPage(twoPage));
        }
        if (indent !== _indent) {
            dispatch(bookActions.setIndent(indent));
        }
        setHasChange(false);
    };

    return (
        <div className="settings">
            <div className="settings-item">
                <span>双页显示</span>
                <Switch checked={twoPage} onChange={toggleTwoPage} />
            </div>
            <div className="settings-item">
                <span>缩进</span>
                <Select options={[0, 1, 2, 4]} value={indent} onChange={handleIndentChange} />
            </div>
            {hasChange && (
                <div className="settings-save" onClick={saveSettings}>
                    保存设置
                </div>
            )}
        </div>
    );
}

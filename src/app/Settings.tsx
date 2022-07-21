import { useSelector, useDispatch } from "react-redux";
import "./Settings.less";

import Switch from "../component/Switch";
import { bookActions, selectTwoPage, selectIndent, selectLineSpacing } from "../slice/bookSlice";

export default function Settings() {
    const dispatch = useDispatch();
    const twoPage = useSelector(selectTwoPage);
    const indent = useSelector(selectIndent);
    const lineSpacing = useSelector(selectLineSpacing);

    return (
        <div className="settings">
            <div className="settings-item">
                <span>双页显示</span>
                <Switch checked={twoPage} onChange={() => dispatch(bookActions.setTwoPage(!twoPage))} />
            </div>
            <div className="settings-item">
                <span>缩进</span>
                <Switch checked={indent} onChange={() => dispatch(bookActions.setIndent(!indent))} />
            </div>
            <div className="settings-item">
                <span>行间距</span>
                <Switch
                    checked={!!lineSpacing}
                    onChange={() => {
                        dispatch(bookActions.setLineSpacing(lineSpacing ? 0 : 6));
                    }}
                />
            </div>
        </div>
    );
}

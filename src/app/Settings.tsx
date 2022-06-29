import { useSelector, useDispatch } from "react-redux";
import "./Settings.less";

import Switch from "../component/Switch";
import { bookActions, selectTwoPage } from "../slice/bookSlice";

export default function Settings() {
    const dispatch = useDispatch();
    const twoPage = useSelector(selectTwoPage);

    return (
        <div className="settings">
            <div className="settings-item">
                <span>双页显示</span>
                <Switch open={twoPage} onChange={() => dispatch(bookActions.setTwoPage(!twoPage))} />
            </div>
        </div>
    );
}

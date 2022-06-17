import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import "./Classes.less";

import { selectClasses, selectCurrentClassId, classActions } from "../slice/classSlice";
import { selectNotesUser, appActions } from "../slice/appSlice";

export default function Classes() {
    const dispatch = useDispatch();
    const currentClassId = useSelector(selectCurrentClassId);
    const classes = useSelector(selectClasses);
    const notesUser = useSelector(selectNotesUser);

    const renderOptions = () => {
        return classes.map((item) => (
            <option key={item.id} value={item.id}>
                {item.name}
            </option>
        ));
    };

    const clickUser = (user: IUser) => {
        dispatch(appActions.setNotesUser(user));
        dispatch(appActions.setShowClasses(false));
    };

    const renderStudentList = () => {
        const classItem = classes.find((item) => item.id === currentClassId);
        if (!classItem) return null;

        return classItem.students.map((user) => {
            const className = classNames("student-list-row", { selected: user.id === notesUser.id });
            return (
                <div key={user.id} className={className} onClick={() => clickUser(user)}>
                    <div>{user.account}</div>
                    <div>{user.name}</div>
                </div>
            );
        });
    };

    return (
        <div className="classes">
            <div className="classes-select-container">
                <select
                    className="classes-select"
                    value={currentClassId}
                    onChange={(e) => dispatch(classActions.setCurrentClassId(parseInt(e.target.value)))}
                >
                    {renderOptions()}
                </select>
            </div>

            <div className="student-list">
                <div className="student-list-header">
                    <div>学号</div>
                    <div>姓名</div>
                </div>
                {renderStudentList()}
            </div>
        </div>
    );
}

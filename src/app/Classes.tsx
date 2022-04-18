import { useDispatch, useSelector } from "react-redux";
import "./Classes.less";

import { selectClasses, selectCurrentClassId, classActions } from "../slice/classSlice";
import { selectLoginUser, selectNotesUser, appActions } from "../slice/appSlice";

export default function Classes() {
    const dispatch = useDispatch();
    const currentClassId = useSelector(selectCurrentClassId);
    const classes = useSelector(selectClasses);
    const loginUser = useSelector(selectLoginUser);
    const notesUser = useSelector(selectNotesUser);

    const renderOptions = () => {
        return classes.map((item) => (
            <option key={item.id} value={item.id}>
                {item.name}
            </option>
        ));
    };

    const renderStudentList = () => {
        const classItem = classes.find((item) => item.id === currentClassId);
        if (!classItem) return null;

        return classItem.students.map((user) => {
            let className = ["student-list-row"];
            if (user.id === notesUser.id) className.push("selected");

            return (
                <div
                    key={user.id}
                    className={className.join(" ")}
                    onClick={() => dispatch(appActions.setNotesUser(user))}
                >
                    <div>{user.studentId}</div>
                    <div>{user.name}</div>
                </div>
            );
        });
    };

    return (
        <div className="classes">
            <select
                className="classes-select"
                value={currentClassId}
                onChange={(e) => dispatch(classActions.setCurrentClassId(parseInt(e.target.value)))}
            >
                {renderOptions()}
            </select>
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

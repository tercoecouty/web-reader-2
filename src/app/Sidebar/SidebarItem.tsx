import { forwardRef } from "react";
import "./SidebarItem.less";
import Icon from "../../component/Icon";

interface ISidebarItemProps {
    disabled?: boolean;
    svg: string;
    title?: string;
    onClick?: () => void;
}

const SidebarItem = forwardRef<any, ISidebarItemProps>((props, ref) => {
    const { svg, disabled, onClick } = props;

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
    };

    let classNames = ["sidebar-item"];
    if (disabled) {
        classNames.push("disabled");
    }

    return (
        <div className={classNames.join(" ")} onClick={handleClick} ref={ref}>
            <Icon svg={svg} />
        </div>
    );
});

export default SidebarItem;

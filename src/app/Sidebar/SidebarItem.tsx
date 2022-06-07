import "./SidebarItem.less";
import Icon from "../../component/Icon";
import Tooltip from "../../component/Tooltip";

interface ISidebarItemProps {
    disabled?: boolean;
    svg: string;
    title: string;
    placement?: "left" | "right" | "top" | "bottom";
    onClick?: () => void;
}

export default function SidebarItem(props: ISidebarItemProps) {
    const { svg, disabled, onClick, title } = props;
    const placement = props.placement || "right";

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
    };

    let classNames = ["sidebar-item"];
    if (disabled) {
        classNames.push("disabled");
    }

    return (
        <Tooltip title={title} placement={placement}>
            <div className={classNames.join(" ")} onClick={handleClick}>
                <Icon svg={svg} />
            </div>
        </Tooltip>
    );
}

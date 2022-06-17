import classNames from "classnames";
import "./SidebarItem.less";
import Icon from "../../component/Icon";

interface ISidebarItemProps {
    disabled?: boolean;
    svg: string;
    title: string;
    placement?: "left" | "right" | "top" | "bottom";
    onClick?: () => void;
}

export default function SidebarItem(props: ISidebarItemProps) {
    const { svg, disabled, onClick, title } = props;

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
    };

    return (
        <div className={classNames("sidebar-item", { disabled })} onClick={handleClick} title={title}>
            <Icon svg={svg} />
        </div>
    );
}

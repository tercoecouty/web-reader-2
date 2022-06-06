// import { useEffect, useState } from "react";

import "./normalize.css";
import "./Demo.less";
import Tooltip from "./Tooltip";

export default function Demo() {
    return (
        <div>
            <div>
                <span>The classNames function takes any number </span>
                <Tooltip placement="bottom" title="My Tooltip">
                    <strong>hello world</strong>
                </Tooltip>
                <span> arguments which can be a string or object. The argument 'foo' is short for</span>
            </div>
        </div>
    );
}

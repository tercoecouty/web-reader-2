import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import "./Search.less";

import { selectPages } from "../slice/bookSlice";

// 一个段落的前一行可能在第一页，后一行就在第二页了
export default function Search() {
    const pages = useSelector(selectPages);
    const [value, setValue] = useState("");
    const [searchResult, setSearchResult] = useState<Generator>(null);

    const getParas = function* (pages: IPage[]) {
        let paraText = "";
        for (const page of pages) {
            for (const line of page.lines) {
                if (line.isFirstLine) {
                    if (paraText) yield paraText;
                    paraText = line.text;
                } else {
                    paraText += line.text;
                }
            }
        }

        yield paraText;
    };

    const search = function* (keyword: string) {
        for (const paraText of getParas(pages)) {
            for (const match of paraText.matchAll(new RegExp(keyword, "g"))) {
                yield match;
            }
        }
    };

    const handleSearch = () => {
        if (value === "") {
            setSearchResult(null);
        } else {
            const _searchResult = search(value);
            setSearchResult(_searchResult);
        }
    };

    const renderSearchResult = () => {
        if (!searchResult) return null;

        const domResults = [];
        let count = 0;
        while (true) {
            const next = searchResult.next();
            if (next.done || count > 10) break;

            const input = next.value.input;
            const index = next.value.index;
            const keyword = next.value[0];
            domResults.push(
                <div key={count} className="search-result-item">
                    <div className="search-result-text">
                        <span>{input.slice(0, index)}</span>
                        <span className="search-keyword">{input.slice(index, index + keyword.length)}</span>
                        <span>{input.slice(index + keyword.length)}</span>
                    </div>
                    <div className="search-result-pageNumber">1</div>
                </div>
            );
            count++;
        }

        return domResults;
    };

    const domResults = useMemo(() => renderSearchResult(), [searchResult]);

    return (
        <div className="search">
            <div className="search-header">
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                <button onClick={handleSearch}>搜索</button>
            </div>
            <div className="search-result">{domResults}</div>
        </div>
    );
}

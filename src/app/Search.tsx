import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Search.less";

import { selectPages, bookActions } from "../slice/bookSlice";
import { appActions } from "../slice/appSlice";

// 一个段落的前一行可能在第一页，后一行就在第二页了
// 高亮的前一个字在第一页，后一个字在第二页
export default function Search() {
    const dispatch = useDispatch();
    const pages = useSelector(selectPages);
    const [value, setValue] = useState("");
    const [searchResult, setSearchResult] = useState<Generator>(null);

    const getParas = function* (pages: IPage[]) {
        let firstCharId = 1;
        let text = "";
        for (const page of pages) {
            for (const line of page.lines) {
                if (line.isFirstLine) {
                    if (text) yield { firstCharId, text };
                    text = line.text;
                    firstCharId = line.firstCharId;
                } else {
                    text += line.text;
                }
            }
        }

        yield { firstCharId, text };
    };

    const search = function* (keyword: string) {
        for (const para of getParas(pages)) {
            for (const match of para.text.matchAll(new RegExp(keyword, "g"))) {
                const paraText = match.input as string;
                const index = match.index;
                let leftIndex = paraText.lastIndexOf("。", index);
                let rightIndex = paraText.indexOf("。", index);
                leftIndex = leftIndex === -1 ? 0 : leftIndex + 1;
                rightIndex = rightIndex === -1 ? paraText.length : rightIndex + 1;

                yield {
                    keyword,
                    firstCharId: para.firstCharId + index,
                    left: paraText.slice(leftIndex, index),
                    right: paraText.slice(index + keyword.length, rightIndex),
                };
            }
        }
    };

    // useEffect(() => {
    //     const searchResult = search("藤野先生");
    //     console.log(searchResult.next());
    //     console.log(searchResult.next());
    //     console.log(searchResult.next());
    // }, [pages]);

    const handleSearch = () => {
        if (value === "") {
            dispatch(appActions.setSearchRange(null));
            setSearchResult(null);
        } else {
            dispatch(appActions.setSearchRange(null));
            const _searchResult = search(value);
            setSearchResult(_searchResult);
        }
    };

    const handleClick = (pageNumber: number, firstCharId: number, lastCharId: number) => {
        dispatch(appActions.setSearchRange({ firstCharId, lastCharId: lastCharId - 1 }));
        dispatch(bookActions.setPageNumber(pageNumber));
        dispatch(appActions.setShowSearch(false));
    };

    const renderSearchResult = () => {
        if (!searchResult) return null;

        const domResults = [];
        while (true) {
            const next = searchResult.next();
            if (next.done) break;

            const { keyword, firstCharId, left, right } = next.value;

            let pageNumber = 1;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const paraFirstCharId = page.lines[0].firstCharId;
                const lastLine = page.lines[page.lines.length - 1];
                const paraLastCharId = lastLine.firstCharId + lastLine.text.length;
                if (firstCharId > paraFirstCharId && firstCharId < paraLastCharId) {
                    pageNumber = i + 1;
                    break;
                }
            }

            domResults.push(
                <div
                    key={firstCharId}
                    className="search-result-item"
                    onClick={() => handleClick(pageNumber, firstCharId, firstCharId + keyword.length)}
                >
                    <div className="search-result-text">
                        <span>{left}</span>
                        <span className="search-keyword">{keyword}</span>
                        <span>{right}</span>
                    </div>
                    <div className="search-result-pageNumber">{pageNumber}</div>
                </div>
            );
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

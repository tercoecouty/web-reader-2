import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Search.less";

import { selectPages, bookActions } from "../slice/bookSlice";
import { appActions } from "../slice/appSlice";

function indexOf(text, chars, index) {
    for (let i = index; i < text.length; i++) {
        for (const char of chars) {
            if (char === text[i]) {
                return i;
            }
        }
    }

    return -1;
}

function lastIndexOf(text, chars, index) {
    for (let i = index; i >= 0; i--) {
        for (const char of chars) {
            if (char === text[i]) {
                return i;
            }
        }
    }

    return -1;
}

export default function Search() {
    const dispatch = useDispatch();
    const pages = useSelector(selectPages);
    const [value, setValue] = useState("");
    const [searchResult, setSearchResult] = useState<Generator>(null);
    const [done, setDone] = useState(false);
    const [domResults, setDomResults] = useState([]);

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
                let leftIndex = lastIndexOf(paraText, "。？.;", index);
                let rightIndex = indexOf(paraText, "。？.;", index);
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

    const loadMore = () => {
        if (!searchResult) return null;

        const _domResults = [];
        let count = 1;
        while (true) {
            if (count++ > 10) break;

            const next = searchResult.next();
            if (next.done) {
                setDone(true);
                break;
            }

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

            _domResults.push(
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

        setDomResults([...domResults, ..._domResults]);
    };

    useEffect(() => {
        if (searchResult) loadMore();
        else setDomResults([]);
    }, [searchResult]);

    const handleSearch = () => {
        if (value === "") {
            dispatch(appActions.setSearchRange(null));
            setSearchResult(null);
        } else {
            dispatch(appActions.setSearchRange(null));
            const _searchResult = search(value);
            setSearchResult(_searchResult);
        }

        setDone(false);
        setDomResults([]);
    };

    const handleClick = (pageNumber: number, firstCharId: number, lastCharId: number) => {
        dispatch(appActions.setSearchRange({ firstCharId, lastCharId: lastCharId - 1 }));
        dispatch(bookActions.setPageNumber(pageNumber));
        dispatch(appActions.setShowSearch(false));
    };

    const handleInput = (e) => {
        const _value = e.target.value;
        if (_value.length > 10) return;
        setValue(_value);
    };

    const handleClear = () => {
        dispatch(appActions.setSearchRange(null));
        setValue("");
        setDone(false);
        setSearchResult(null);
    };

    return (
        <div className="search">
            <div className="search-header">
                <input type="text" value={value} onChange={handleInput} />
                <button onClick={handleClear}>清空</button>
                <button onClick={handleSearch}>搜索</button>
            </div>
            <div className="search-result">{domResults}</div>
            {searchResult && done && (
                <div className="search-footer">
                    <span className="no-more">没有更多</span>
                </div>
            )}
            {searchResult && !done && (
                <div className="search-footer">
                    <span className="load-more" onClick={() => loadMore()}>
                        加载更多
                    </span>
                </div>
            )}
        </div>
    );
}

export default class Books {
    private bookText = "";
    private totalWidth = 0;
    private totalHeight = 0;
    private domMeasure: HTMLElement = null;

    private charWidthMap: Map<string, number> = new Map();
    private chineseCharRegExp = /[\u4e00-\u9fa5]/;
    private chineseCharWidth = 0;
    private charHeight = 0;

    constructor(bookText: string, totalWidth: number, totalHeight: number, domMeasure: HTMLElement) {
        this.bookText = bookText;
        this.totalHeight = totalHeight;
        this.totalWidth = totalWidth;
        this.domMeasure = domMeasure;

        this.domMeasure.textContent = "正";
        this.chineseCharWidth = this.domMeasure.getBoundingClientRect().width;
        this.charHeight = this.domMeasure.getBoundingClientRect().height;

        this.charHeight += 5 * 2; // padding-top and padding bottom
    }

    public pageBreaking() {
        const pages: IPage[] = [];
        let pageHeight = 0;
        let pageLines: ILine[] = [];

        const lines = this.lineBreaking();
        for (const line of lines) {
            if (pageHeight + this.charHeight > this.totalHeight) {
                let spacing = (this.totalHeight - pageHeight) / pageLines.length;
                spacing = Math.floor(spacing * 100) / 100;
                pages.push({
                    lines: pageLines,
                    spacing,
                });
                pageHeight = this.charHeight;
                pageLines = [line];
                continue;
            }

            pageHeight += this.charHeight;
            pageLines.push(line);
        }

        pages.push({
            lines: pageLines,
            spacing: 0,
        });

        return pages;
    }

    public lineBreaking() {
        const lines: ILine[] = [];
        let charId = 1;
        let paraId = 1;
        let result;
        for (const paraText of this.bookText.split("\n")) {
            if (/^[\u0021-\u007e]+/.test(paraText)) {
                // console.time(`englishLineBreaking ${paraText.length}`);
                result = this.englishLineBreaking(paraText, charId);
                // console.timeEnd(`englishLineBreaking ${paraText.length}`);
            } else {
                // console.time(`chineseLineBreaking ${paraText.length}`);
                result = this.chineseLineBreaking(paraText, charId);
                // console.timeEnd(`chineseLineBreaking ${paraText.length}`);
            }
            lines.push(...result.lines);
            charId = result.charId;
            paraId++;
        }

        return lines;
    }

    private chineseLineBreaking(paraText: string, charId: number) {
        const lines: ILine[] = [];
        let isFirstLine = true;
        let lineWidth = this.chineseCharWidth * 2;
        let lineText = "";
        for (let char of paraText.trim()) {
            const charWidth = this.getCharWidth(char);
            if (lineWidth + charWidth > this.totalWidth) {
                let spacing = (this.totalWidth - lineWidth) / lineText.length;
                spacing = Math.floor(spacing * 1000) / 1000;
                lines.push({
                    text: lineText,
                    spacing,
                    isFirstLine,
                    firstCharId: charId - lineText.length,
                    spacingType: "letter",
                });

                lineWidth = charWidth;
                lineText = char;
                isFirstLine = false;
                charId++;
                continue;
            }

            lineWidth += charWidth;
            lineText += char;
            charId++;
        }

        lines.push({
            text: lineText,
            spacing: 0,
            isFirstLine,
            firstCharId: charId - lineText.length,
            spacingType: "letter",
        });

        return {
            lines,
            charId,
        };
    }

    private englishLineBreaking(paraText: string, charId: number) {
        const lines: ILine[] = [];
        const spaceWidth = this.getCharWidth(" ");
        let isFirstLine = true;
        let lineWidth = this.chineseCharWidth * 2;
        let lineText = "";
        let wordCount = 0;
        for (let word of paraText.split(" ")) {
            const wordWidth = [...word].reduce((width, char) => width + this.getCharWidth(char), 0);
            if (lineWidth + wordWidth > this.totalWidth) {
                lineText = lineText.trimEnd();
                lineWidth -= spaceWidth;
                let spacing = (this.totalWidth - lineWidth) / wordCount;
                spacing *= 1.05; // 手动调整英文字间距以得到更好的显示效果
                spacing = Math.floor(spacing * 1000) / 1000;
                lines.push({
                    text: lineText,
                    spacing,
                    isFirstLine,
                    firstCharId: charId - lineText.length,
                    spacingType: "word",
                });

                lineWidth = wordWidth + spaceWidth;
                lineText = word + " ";
                isFirstLine = false;
                wordCount = 1;
                charId++;
                continue;
            }

            lineWidth += wordWidth + spaceWidth;
            lineText += word + " ";
            wordCount++;
            charId++;
        }

        lineText = lineText.trimEnd();
        lines.push({
            text: lineText,
            spacing: 0,
            isFirstLine,
            firstCharId: charId - lineText.length,
            spacingType: "word",
        });

        return {
            lines,
            charId,
        };
    }

    private getCharWidth(char: string) {
        if (this.chineseCharRegExp.test(char)) {
            return this.chineseCharWidth;
        }

        const charWidth = this.charWidthMap.get(char);
        if (charWidth) {
            return charWidth;
        }

        return this.measureCharWidth(char);
    }

    private measureCharWidth(char: string) {
        this.domMeasure.textContent = char;
        return this.domMeasure.getBoundingClientRect().width;
    }
}

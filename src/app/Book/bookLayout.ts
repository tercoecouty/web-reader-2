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

    private lineBreaking() {
        const lines: ILine[] = [];
        let charId = 1;
        let paraId = 1;
        for (const paraText of this.bookText.split("\n")) {
            let isFirstLine = true;
            let lineWidth = this.chineseCharWidth * 2; // two indent
            let lineText = "";
            for (let char of paraText.trim()) {
                if (char === " ") char = "_"; // 先把空格转换成下划线查看排版效果，现在还不能处理断行处的空格
                const charWidth = this.getCharWidth(char);
                if (lineWidth + charWidth > this.totalWidth) {
                    let spacing = (this.totalWidth - lineWidth) / lineText.length;
                    spacing = Math.floor(spacing * 1000) / 1000;
                    lines.push({
                        text: lineText,
                        spacing,
                        isFirstLine,
                        firstCharId: charId - lineText.length,
                        paraId,
                    });
                    lineText = char;
                    lineWidth = charWidth;
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
                paraId,
            });

            paraId++;
        }

        return lines;
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

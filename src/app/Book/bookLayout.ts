export default class Books {
    private bookText = "";
    private totalWidth = 0;
    private totalHeight = 0;
    private domMeasure: HTMLElement = null;

    private charWidthMap: Map<string, number> = new Map();
    private chineseCharWidth = 0;
    private lineHeight = 0;

    private indent: number;
    private lineSpacing: number;
    private options: IBookLayoutOptions;

    constructor(
        bookText: string,
        totalWidth: number,
        totalHeight: number,
        domMeasure: HTMLElement,
        options: IBookLayoutOptions
    ) {
        this.bookText = bookText;
        this.totalHeight = totalHeight;
        this.totalWidth = totalWidth;
        this.domMeasure = domMeasure;

        this.domMeasure.textContent = "正";
        this.chineseCharWidth = this.domMeasure.getBoundingClientRect().width;
        this.lineHeight = this.domMeasure.getBoundingClientRect().height;

        this.indent = options.indent ? 2 : 0;
        this.lineSpacing = options.lineSpacing;
        this.options = options;
        this.lineHeight += options.lineSpacing * 2 || 0; // 上下边距
    }

    public getBookOptions() {
        return this.options;
    }

    public pageBreaking() {
        const pages: IPage[] = [];
        let pageHeight = 0;
        let pageLines: ILine[] = [];

        if (this.bookText.length === 0) return pages;

        const lines = this.lineBreaking();
        for (const line of lines) {
            if (pageHeight + this.lineHeight > this.totalHeight) {
                let spacing = (this.totalHeight - pageHeight) / pageLines.length;
                spacing = Math.floor(spacing * 100) / 100;
                pages.push({
                    lines: pageLines,
                    spacing,
                    lineSpacing: this.lineSpacing,
                });
                pageHeight = this.lineHeight;
                pageLines = [line];
                continue;
            }

            pageHeight += this.lineHeight;
            pageLines.push(line);
        }

        pages.push({
            lines: pageLines,
            spacing: 0,
            lineSpacing: this.lineSpacing,
        });

        return pages;
    }

    public lineBreaking() {
        const lines: ILine[] = [];
        let charId = 1;
        let result;
        for (const paraText of this.bookText.split("\n")) {
            if (/[\u4e00-\u9fa5]/.test(paraText)) {
                result = this.chineseLineBreaking(paraText, charId);
            } else {
                result = this.englishLineBreaking(paraText, charId);
            }
            lines.push(...result.lines);
            charId = result.charId;
        }

        return lines;
    }

    private chineseLineBreaking(paraText: string, charId: number) {
        const lines: ILine[] = [];
        let isFirstLine = true;
        let lineWidth = this.chineseCharWidth * this.indent; // 首行缩进
        let lineText = "";

        paraText = paraText.trim();
        for (let i = 0; i < paraText.length; i++) {
            let char = paraText[i];
            let charWidth = this.getCharWidth(char);
            // 顿号、逗号、句号、冒号、分号、叹号、问号、结束引号、结束括号、结束双书名号不能出现在一行的开头。
            // 开始引号、开始括号、开始双书名号不能出现在一行的结尾。
            if (i + 1 < paraText.length) {
                if (/[、，。：；！？）》”]/.test(paraText[i + 1]) || /[“（《]/.test(paraText[i])) {
                    char += paraText[i + 1];
                    charWidth += this.getCharWidth(paraText[i + 1]);
                    i += 1;
                }
            }

            if (lineWidth + charWidth > this.totalWidth) {
                let spacing = (this.totalWidth - lineWidth) / (lineText.length - 1);
                spacing = Math.floor(spacing * 100) / 100;
                lines.push({
                    text: lineText,
                    spacing,
                    isFirstLine,
                    indent: isFirstLine && this.indent,
                    firstCharId: charId - lineText.length,
                    spacingType: "letter",
                });

                lineWidth = charWidth;
                lineText = char;
                isFirstLine = false;
                charId += char.length;
                continue;
            }

            lineWidth += charWidth;
            lineText += char;
            charId += char.length;
        }

        lines.push({
            text: lineText,
            spacing: 0,
            isFirstLine,
            indent: isFirstLine && this.indent,
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
        let lineWidth = this.chineseCharWidth * this.indent; // 首行缩进
        let lineText = "";
        let wordCount = 0;
        for (let word of paraText.split(" ")) {
            const wordWidth = [...word].reduce((width, char) => width + this.getCharWidth(char), 0);
            if (lineWidth + wordWidth > this.totalWidth) {
                lineText = lineText.trimEnd();
                lineWidth -= spaceWidth;
                let spacing = (this.totalWidth - lineWidth) / (wordCount - 1);
                spacing = Math.floor(spacing * 100) / 100;
                lines.push({
                    text: lineText,
                    spacing,
                    isFirstLine,
                    indent: isFirstLine && this.indent,
                    firstCharId: charId - lineText.length,
                    spacingType: "word",
                });

                lineWidth = wordWidth + spaceWidth;
                lineText = word + " ";
                isFirstLine = false;
                wordCount = 1;
                charId += word.length; // 这里不要加一
                continue;
            }

            lineWidth += wordWidth + spaceWidth;
            lineText += word + " ";
            wordCount++;
            charId += word.length + 1;
        }

        lineText = lineText.trimEnd();
        lines.push({
            text: lineText,
            spacing: 0,
            isFirstLine,
            indent: isFirstLine && this.indent,
            firstCharId: charId - lineText.length,
            spacingType: "word",
        });

        return {
            lines,
            charId,
        };
    }

    private getCharWidth(char: string) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
            return this.chineseCharWidth;
        }

        let charWidth = this.charWidthMap.get(char);
        if (!charWidth) {
            charWidth = this.measureCharWidth(char);
            this.charWidthMap.set(char, charWidth);
        }

        return charWidth;
    }

    private measureCharWidth(char: string) {
        this.domMeasure.textContent = char;
        return this.domMeasure.getBoundingClientRect().width;
    }
}

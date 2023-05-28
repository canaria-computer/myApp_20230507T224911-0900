import { HTMLElement, parse as parseHtml } from "node-html-parser";
import DiffMatchPatch, { diff_match_patch } from "diff-match-patch";
import _ from "lodash";

/**
 * 
 * @param ownAnsHtmlText 解答私案HTMLテキスト
 * @param modelAnsHtmlText 模範解答HTMLテキスト
 * @returns [[ 判定内容, 正誤:(T:Incorrect/F:Correct) , 減点数, 間違っている箇所(CSS selector) ]]
 */
export function checkSpecialElement(ownAnsHtmlText: string, modelAnsHtmlText: string): [string, boolean, number, string][] {
    const rootOwn = parseHtml(ownAnsHtmlText, { lowerCaseTagName: true });
    const rootModel = parseHtml(modelAnsHtmlText, { lowerCaseTagName: true });
    const titleCheckResult = checkTitleName(rootOwn, rootModel);
    const checkHrTagResult = checkHrTag(rootOwn, rootModel);
    const checkHeadingTagResult = checkHeadingTag(rootOwn, rootModel);

    return [
        ["タイトル", titleCheckResult > 0, titleCheckResult, "title"],
        ["水平線", checkHrTagResult > 0, checkHrTagResult, "hr"],
        ["見出し[h1~h6]", checkHeadingTagResult > 0, checkHeadingTagResult, "h1,h2,h3,h4,h5,h6"],
    ];
}

function checkTitleName(rO: HTMLElement, rM: HTMLElement): number {
    const o = rO.querySelectorAll("title");
    const m = rM.querySelectorAll("title");
    if (o.length > 0 && m.length > 0) {
        const DiffChar = countDifferentCharacters(o[0].textContent, m[0].textContent) * 2;
        return DiffChar > 10 ? 10 : DiffChar;
    } else {
        return 10;
    }
}

function checkHrTag(rO: HTMLElement, rM: HTMLElement): number {
    const o = rO.querySelectorAll("hr");
    const m = rM.querySelectorAll("hr");
    return Math.abs(o.length - m.length) * 2;
}

function checkHeadingTag(rO: HTMLElement, rM: HTMLElement): number {
    const o = rO.querySelectorAll("h1,h2,h3,h4,h5,h6");
    const m = rM.querySelectorAll("h1,h2,h3,h4,h5,h6");
    // 見出しの数から減点
    return Math.abs(o.length - m.length) * 5;
}


/**
 * 2つの文字列の異なる文字の数をカウントします。
 * 文字列の前後の空白と改行は無視され、単一のスペースとして扱われます。
 *
 * @param {string} s1 - 比較する文字列1
 * @param {string} s2 - 比較する文字列2
 * @returns {number} - 異なる文字の数
 */
export function countDifferentCharacters(s1: string, s2: string): number {
    [s1, s2] = [
        s1.replace(/(\s+|\n+)/g, ""),
        s2.replace(/(\s+|\n+)/g, "")
    ];

    // @ts-ignore
    const dmp = new DiffMatchPatch();
    const diff = dmp.diff_main(s1, s2) as [number, string][];

    return _.sumBy(diff, (element) => Math.abs(element[0]) * element[1].length);
}
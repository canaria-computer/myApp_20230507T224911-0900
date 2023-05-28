import fs from "fs";
import stylelint from 'stylelint';
import path from "node:path";
import Encoding from 'encoding-japanese';
import _ from "lodash";
import md5File from 'md5-file';
import { HTMLElement, parse as parseHtml } from 'node-html-parser';
import xPath2Selector from "xpath-to-selector";
import { checkSpecialElement, countDifferentCharacters } from "./checkHtml";

interface InspectionEntry {
    [key: string]: boolean | number,
    demeritPoints: number
}

type IndexHtml = {
    path: string;
    characterCode: any;
    // utf8Data: Node | null;
    utf8Data: string | null;
    dataAnalyzedAsJSON: any;
}

export default class HomepageProducitonScoring {
    // class HomepageProducitonScoring {

    // 解答私案のディレクトリパス
    readonly ownDirPath: string;
    // 模範解答のディレクトリパス
    readonly modelDirPath: string;
    // サブディレクトリがあるかどうか(解答私案)
    readonly hasOwnSubDirExists: boolean;// ! ユーザへ通知
    readonly hasModelSubDirExists: boolean; // ! ユーザへ通知
    // サブディレクトリだけ
    readonly ownDirSubDirs: string[];
    readonly modelDirSubDirs: string[];
    // ディレクトリの中身
    readonly ownDir: string[];
    readonly modelDir: string[];
    // ファイルらしきもの - Dir
    readonly ownDirFiles: string[];
    readonly modelDirFiles: string[];
    // index.html があるかどうか
    readonly hasIndexHtmlInOwnDir: boolean;
    readonly hasIndexHtmlInModelDir: boolean;
    // style.css があるかどうか
    readonly hasIndexCssInOwnDir: boolean;
    readonly hasIndexCssInModelDir: boolean;

    entranceExamPersonName: string | null;

    // index.html ファイルを読み込む
    ownAnsIndexHtml: IndexHtml = {
        path: "",
        characterCode: "",
        utf8Data: null,
        dataAnalyzedAsJSON: ""
    };
    modelAnsIndexHtml: IndexHtml = {
        path: "",
        characterCode: "",
        utf8Data: null,
        dataAnalyzedAsJSON: ""
    };

    // 検査情報
    inspectionDataArray: [string, boolean, number][] = [
        ["検査情報の実行テスト", true, 1]
    ]

    private failedComparisonHashValue: string[] = new Array(); // ! ユーザに通知

    constructor(ownDirPath: string, modelDirPath: string) {
        // ディレクトリ 存在確認
        if (!(fs.existsSync(ownDirPath) && fs.existsSync(modelDirPath))) {
            // 存在しないパスは 例外をスロー
            throw new Error("Error: Path does not exist | エラー : 存在しないパス")
        }
        this.ownDirPath = ownDirPath;
        this.modelDirPath = modelDirPath;
        // ディレクトリの中身を得る
        this.ownDir = fs.readdirSync(this.ownDirPath);
        this.modelDir = fs.readdirSync(this.modelDirPath);
        // ディレクトリだけ
        this.ownDirSubDirs = this.ownDir.filter(f => fs.statSync(path.join(this.ownDirPath, f)).isDirectory());
        this.modelDirSubDirs = this.modelDir.filter(f => fs.statSync(path.join(this.modelDirPath, f)).isDirectory());
        // ファイルだけ リスト
        this.ownDirFiles = _.difference(this.ownDir, this.ownDirSubDirs);
        this.modelDirFiles = _.difference(this.modelDir, this.modelDirSubDirs);
        // 補助的な情報の解析
        this.hasOwnSubDirExists = (this.ownDir.filter(file => fs.statSync(path.join(this.ownDirPath, file)).isDirectory()).length > 0);
        this.hasModelSubDirExists = (this.modelDir.filter(file => fs.statSync(path.join(this.modelDirPath, file)).isDirectory()).length > 0);
        // 受験者氏名情報
        this.entranceExamPersonName = null;
        // 存在する場合は true
        this.hasIndexHtmlInOwnDir = this.ownDir.includes("index.html");
        this.hasIndexHtmlInModelDir = this.modelDir.includes("index.html");
        this.hasIndexCssInOwnDir = this.ownDir.includes("style.html");
        this.hasIndexCssInModelDir = this.modelDir.includes("style.html");
        // index.html のファイルパス
        if (this.hasIndexHtmlInOwnDir && this.hasIndexHtmlInModelDir) {
            // 最後に スラッシュがつくかどうか
            if (this.ownDirPath.slice(-1) !== "\\" || this.ownDirPath.slice(-1) !== "/") {
                this.ownDirPath += "/"; // セパレート 追加
                this.modelDirPath += "/"; // セパレート 追加
                this.ownAnsIndexHtml.path += this.ownDirPath
                this.modelAnsIndexHtml.path += this.modelDirPath
            }
            this.ownAnsIndexHtml.path += "index.html";
            this.modelAnsIndexHtml.path += "index.html";
            // 文字コード 調べ
            const ownAnsIndexHtmlFile = fs.readFileSync(this.ownAnsIndexHtml.path);
            const modelAnsIndexHtmlFile = fs.readFileSync(this.ownAnsIndexHtml.path);

            this.ownAnsIndexHtml.characterCode = Encoding.detect(ownAnsIndexHtmlFile);// ? <-------- 要らない?
            this.ownAnsIndexHtml.characterCode = Encoding.detect(modelAnsIndexHtmlFile);// ? <-------- 要らない?
        } else if (!(this.hasIndexHtmlInModelDir)) {
            throw new Error("Error: Model answer does not exist | エラー : 模範解答が存在しない")
        } else {
            this.inspectionDataArray.push(
                ["[File Error]ファイルなしにつき採点不能", true, 100]
            )
        }
        // ファイル差分
        this.getFilesDiff();
    }
    private getFilesDiff() {
        // ディレクトリ の中身を得る
        const comonFiles = _.intersection(this.modelDirFiles, this.ownDirFiles);
        for (const fileName of comonFiles) {
            // 検証する
            const [ownAnsFileHash, modelAnsFileHash] = [
                md5File.sync(this.ownDirPath + fileName),
                md5File.sync(this.modelDirPath + fileName),
            ]
            // 検証に失敗したもの
            if (ownAnsFileHash !== modelAnsFileHash) {
                // html or css --> 細かい検査
                if (/\.html$|\.css$/.test(fileName)) {
                    // TODO 
                    if (/\.html$/.test(fileName)) {
                        this.htmlDiff(this.ownDirPath + fileName,
                            this.modelDirPath + fileName
                        )
                    } else {
                        this.cssDiff(this.ownDirPath + fileName,
                            this.modelDirPath + fileName
                        )
                    }
                } else {
                    this.failedComparisonHashValue.push(fileName)
                }
            }
        }
    }
    private decodeIfNotUtf8Sync(filePath: string): string {
        // ファイルの読み込み
        const buffer = fs.readFileSync(filePath);
        // 文字コードの検出
        const detectedEncoding = Encoding.detect(buffer);
        // UTF-8以外の場合は変換(自動変換を試みる)
        if (detectedEncoding !== 'UTF8') {
            return Buffer.from(Encoding.convert(buffer, 'UTF8')).toString("utf8");
        }
        // UTF-8の場合はそのまま文字列に変換
        return buffer.toString('utf8');
    }

    private htmlDiff(ownAnsHtmlPath: string, modelAnsHtmlPath: string) {
        const fileName = ownAnsHtmlPath.slice(ownAnsHtmlPath.lastIndexOf("/") + 1)
        const ownAnsHtmlUtf8Data = this.convertHTMLTagsToLowerCase(this.decodeIfNotUtf8Sync(ownAnsHtmlPath));
        const modelAnsHtmlUtf8Data = this.convertHTMLTagsToLowerCase(this.decodeIfNotUtf8Sync(modelAnsHtmlPath));

        const rootownAnsHtml = parseHtml(ownAnsHtmlUtf8Data, { lowerCaseTagName: true, fixNestedATags: true });
        const rootmodelAnsHtml = parseHtml(modelAnsHtmlUtf8Data, { lowerCaseTagName: true, fixNestedATags: true });

        const domCompare = require('dom-compare');
        const { DOMParser } = require('xmldom');
        const parser = new DOMParser();

        const options = {
            // コメントアウトを比較するかどうか
            compareComments: false,
            // 空白に関するオプション
            stripSpaces: true,
            collapseSpaces: true,
            normalizeNewlines: true
        };

        const ownAnsIndexHtml = parser.parseFromString(ownAnsHtmlUtf8Data, "text/html");
        const modelAnsIndexHtml = parser.parseFromString(modelAnsHtmlUtf8Data, "text/html");
        // スタイルシートのリンクが間違っているか判定
        const ownStylesheetLink = rootownAnsHtml.querySelectorAll('head > link[rel="stylesheet"]');
        const modelStylesheetLink = rootmodelAnsHtml.querySelectorAll('head > link[rel="stylesheet"]');
        if (modelStylesheetLink.length > 0) {
            if (ownStylesheetLink[0].getAttribute("href") !== modelStylesheetLink[0].getAttribute("href")) {
                this.inspectionDataArray.push([`${fileName}:スタイルシートの設定の誤り`, true, 10]);
            } else if (modelStylesheetLink.length === 0) {
                this.inspectionDataArray.push([`${fileName}:スタイルシートの未処理`, true, 10]);
            }
        }
        // ---
        const result = domCompare.compare(ownAnsIndexHtml, modelAnsIndexHtml, options);
        const diff = result.getDifferences() as Array<{ node: string, message: string }>;

        const nomalElement = diff.filter((diffElement: { node: string; }) =>
            ["title", "hr", "h1", "h2", "h3", "h4", "h5", "h6"].indexOf(this.extractElementFromXPath(diffElement.node)) === -1
        ).filter(diffElement => diffElement.node !== "/html/body/p")

        // 減点 を行う
        for (const element of checkSpecialElement(ownAnsIndexHtml, modelAnsIndexHtml)) {
            const col = element.slice(0, 3) as [string, boolean, number];
            col[0] = fileName + ":" + col[0];
            this.inspectionDataArray.push(col);
        }


        for (const diffs of nomalElement) {
            const OwnAnsSelector = xPath2Selector(diffs.node).replace(/:nth-child\(\d+\)/g, "");
            const ModelAnsSelector = xPath2Selector(diffs.node).replace(/:nth-child\(\d+\)/g, "");
            // 取得した要素
            const selectOwnAnsElement = rootownAnsHtml.querySelectorAll(OwnAnsSelector);
            const selectModelAnsElement = rootmodelAnsHtml.querySelectorAll(ModelAnsSelector);
            if (selectOwnAnsElement.length > 0 && // 存在確認
                selectModelAnsElement.length > 0 &&
                !(this.hasAncestorWithAttribute(selectOwnAnsElement[0], "data-textTested")) // 検査済み チェックを確認
            ) {
                // 文字列の比較
                const charWrong = countDifferentCharacters(selectOwnAnsElement[0].textContent, selectModelAnsElement[0].textContent)
                selectOwnAnsElement[0].setAttribute("data-textTested", "true")
                if (charWrong > 0) {
                    this.inspectionDataArray.push([`${fileName}:文字の誤り\nセレクタ:${OwnAnsSelector}`, true, charWrong * 2]);
                }
            }
            if (selectModelAnsElement.length > 0 && selectModelAnsElement[0].tagName.toLowerCase() === "img") {
                // 未処理の場合
                if (selectOwnAnsElement.length === 0) { //要素がない
                    this.inspectionDataArray.push([`${fileName}:画像処理の未処理\nセレクタ${OwnAnsSelector}`, true, 5])
                } else {
                    this.inspectionDataArray.push([`${fileName}:画像処理誤り\nセレクタ${OwnAnsSelector}`, true, 5])
                    // イメージマップリンクの処理は未実装
                }
            }
            if (selectModelAnsElement.length > 0 && selectModelAnsElement[0].tagName.toLowerCase() === "table") {
                // レイアウトを検査する
                if (selectModelAnsElement[0].querySelectorAll("tr,td").length !==
                    selectOwnAnsElement[0].querySelectorAll("tr,td").length) {
                    this.inspectionDataArray.push([`${fileName}:表レイアウトの誤り\nセレクタ${OwnAnsSelector}`, true, 5])
                }
                // 枠について
                if (selectModelAnsElement[0].getAttribute("border") !==
                    selectOwnAnsElement[0].getAttribute("border")) {
                    this.inspectionDataArray.push([`${fileName}:表の枠線指定の誤り\nセレクタ${OwnAnsSelector}`, true, 2])
                }
            }
            // リスト要素
            if (
                selectModelAnsElement.length > 0 &&
                (
                    selectModelAnsElement[0].tagName.toLowerCase() === "ol" ||
                    selectModelAnsElement[0].tagName.toLowerCase() === "ul"
                ) &&
                !(this.hasAncestorWithAttribute(selectOwnAnsElement[0], "data-listTested"))
            ) {
                if (selectOwnAnsElement.length === 0) {
                    // 未処理
                    this.inspectionDataArray.push([`${fileName}:リスト要素の未処理\nセレクタ${OwnAnsSelector}`, true, 5])
                } else {
                    // リスト内要素数を判定
                    if (selectModelAnsElement[0].querySelectorAll("li").length !== selectOwnAnsElement[0].querySelectorAll("li").length) {
                        // 二重カウント 抑止
                        selectOwnAnsElement[0].setAttribute("data-listTested", "true");
                        this.inspectionDataArray.push([`${fileName}:リスト要素の誤り\nセレクタ${OwnAnsSelector}`, true, 5])
                    }
                }
            }

            // todo アンカーリンクの実装 : 気が向いたら作る
            // <--

            if (selectModelAnsElement.length > 0 && selectModelAnsElement[0].tagName.toLowerCase() === "input") {
                this.inspectionDataArray.push([`${fileName}:フォームコンポーネント(<input /> Element)の誤り\nセレクタ${OwnAnsSelector}`, true, 5])
            }

            if (selectModelAnsElement.length > 0) {
                const ownElement = selectOwnAnsElement[0];
                const modelElement = selectModelAnsElement[0];
                // ID
                if (ownElement.getAttribute("id") !== modelElement.getAttribute("id")) {
                    this.inspectionDataArray.push([`${fileName}:ID属性の誤り\nセレクタ${OwnAnsSelector}`, true, 5])
                }
                // class
                if (!_.isEqual(ownElement.classNames.split(" "), modelElement.classNames.split(" "))) {
                    this.inspectionDataArray.push([`${fileName}:クラスリストの誤り\nセレクタ${OwnAnsSelector}`, true, 5])
                }
                // if (this.compareAttributes(ownElement, modelElement)) {
                //     this.inspectionDataArray.push([`${fileName}:その他の属性の設定値の誤り\nセレクタ${OwnAnsSelector}`, true, 5])
                // };

            }
            // --->
        }

    }
    private cssDiff(ownAnsCssPath: string, modelAnsCssPath: string) {
        const ownAnsCSStext = this.decodeIfNotUtf8Sync(ownAnsCssPath);
        const modelAnsCSStext = this.decodeIfNotUtf8Sync(modelAnsCssPath);

        // CSSテキストを比較し、異なる設定を探す関数
        async function compareStyles(text1: string, text2: string): Promise<string[]> {
            // stylelintの設定
            const stylelintConfig = {
                rules: {
                    'color-format/format': [true, { format: 'rgb' }],
                },
            };

            // text1を検証
            const { errored, output: output1 } = await stylelint.lint({
                code: text1,
                config: stylelintConfig,
                fix: true,
            });

            // text2を検証
            const { output: output2 } = await stylelint.lint({
                code: text2,
                config: stylelintConfig,
                fix: true,
            });

            // 自動修正結果を比較
            const diff = _.difference(output2?.split('\n'), output1?.split('\n'));

            // 異なる設定を格納する配列
            const differentSelectors: string[] = [];

            // 異なる設定を配列に追加
            diff.forEach((line: any) => {
                const selectorMatch = line.match(/(\.[a-zA-Z0-9_-]+)/);
                if (selectorMatch) {
                    differentSelectors.push(selectorMatch[1]);
                }
            });

            return differentSelectors;
        }

        compareStyles(ownAnsCSStext, modelAnsCSStext)
            .then((differentSelectors) => {
                console.log(differentSelectors);
                let demeritPoints = differentSelectors.length * 5;
                if (demeritPoints >= 20) {
                    demeritPoints = 20;
                }
                if (0 < demeritPoints && demeritPoints <= 5) {
                    demeritPoints = 10;
                }
                this.inspectionDataArray.push(["CSSファイルの誤り", true, demeritPoints]);
            })
            .catch(console.error);
    }
    /**
     * 受験級を取得する関数
     * @returns 受験級のアラビア数字(算用数字)
     * @info `value` に使える値を返しません!!
     */
    getGradeInteger(): number | null {
        // ディレクトリ名から推論
        const res = this.ownDirPath.match(/HP[1-4]_/)
        if (res !== null) {
            return parseInt(res[0][2]);
        } else {
            return null;
        }
    }

    /**
     * 受験者氏名を取得する
     * 
     * @param priorityValue フォルダ名 と index.html で名前が異なるときどちらを優先するか
     * @returns 受験者氏名 or `null`
     * @info 競合するとき index.html の結果を返します
     *
     *  受検者の名前を探し返す
     * 1. 最初に 試験のルールに基づいてフォルダ名から推測します
     * 2. フォルダ名から名前が取得できないとき、 `index.html` を解析します
     * 3. いずれにおいても 名前が解決されないとき `null` を返します
     */
    getExaminationTakerName(priorityValue?: "folder" | "indexHtml"): string | null {
        let result: ExaminationTakerName = {
            indexHtml: null,
            folder: null,
        };

        // ディレクトリ名から推論
        const fromDirRes = this.ownDirPath.match(/_.+$/);
        if (fromDirRes !== null) {
            const position = fromDirRes[0].lastIndexOf("_");
            const name = fromDirRes[0].slice(position + 1);
            if (name.endsWith("/")) { // スラッシュを取り除いて返す
                result.folder = name.slice(0, -1);
            } else {
                // スラッシュがない場合
                result.folder = name;
            }
        }
        // ファイルからも解析
        if (this.hasIndexHtmlInOwnDir) {
            const root = parseHtml(
                this.decodeIfNotUtf8Sync(this.ownDirPath + "/" + "index.html"),
                { lowerCaseTagName: true }
            )
            // 受験番号 があるところを探す
            const examPersonDataField = root.querySelector("body > p")?.textContent;
            if (examPersonDataField !== undefined) {
                // 名前を取り出す
                const name = this.extractFullName(examPersonDataField);
                if (name !== null) {
                    // 失敗しなかったとき
                    result.indexHtml = name;
                } else {
                    result.indexHtml = null;
                }
            }
        }
        // 優先順位に従って結果を返す
        if (result.folder !== result.indexHtml && (priorityValue === undefined || priorityValue === "indexHtml")) {
            return result.indexHtml;
        } else {
            return result.folder;
        }
    }
    /**
     * ファイルを解析し 点数を算出します。
     * @returns {number} 採点結果の点数
     * @info **点数は 負の数になることがあります**。
     * @info **点数**は 小数点以下を無視して **整数部のみを返します**。
     */
    calScore(): number {
        const maxScore = 100;
        // 致命的な 欠損により判定できないとき
        if (this.inspectionDataArray.map(data => data[0].startsWith("[File Error]")).includes(true)) {
            return -Infinity
        } else {
            const sum = this.inspectionDataArray.filter(element => element[1]).reduce((acc, element) => acc + element[2], 0);
            return maxScore - sum + 1;// test データ のため 1点追加
        }
    }
    /**
     * 読み取り専用 ハッシュ値の検証に失敗したファイル名のリスト 
     */
    get failedComparHashValue() {
        return this.failedComparisonHashValue;
    }
    /**
     * 再帰的検索
     * @param {any} data 任意のデータ型
     * @param {any} targetNode ターゲットフィールド名
     * @returns {any} 任意の配列
     */
    searchRecursive(data: any, targetNode: string): any[] {
        const results: any[] = [];

        if (_.isObject(data)) {
            if (_.has(data, 'node') && _.get(data, 'node') === targetNode) {
                results.push(data);
            }

            if (_.has(data, 'child')) {
                const child = _.get(data, 'child');

                if (_.isArray(child)) {
                    _.forEach(child, (item: any) => {
                        const nestedResults = this.searchRecursive(item, targetNode);
                        results.push(...nestedResults);
                    })
                } else if (_.isObject(child)) {
                    const nestedResults = this.searchRecursive(child, targetNode);
                    results.push(...nestedResults);
                }
            }
        }
        return results;
    }
    /**
     * HTMLテキスト内のタグの要素名を小文字に変換します
     * ただしID名、クラス名、属性、テキストノードへの影響はありません
     *
     * @param {string} htmlText - 変換するHTMLテキスト
     * @returns {string} 変換後のHTMLテキスト
     */
    convertHTMLTagsToLowerCase(htmlText: string): string {
        const tagRegex = /<\s*\/?\s*([A-Za-z]+)/g;

        const convertedText = htmlText.replace(tagRegex, (match, p1) => {
            return match.replace(p1, p1.toLowerCase());
        });

        return convertedText;
    }
    /**
     * 
     * @param str 文字列 `受験番号` 空白 `姓` 空白 `名` に従った書式
     * @returns **名前** または 取り出せなかったとき **null**
     */
    extractFullName(str: string): string | null {
        const regex = /\d+\s+(.+)\s+(.+)/;
        const match = str.match(regex);

        if (match && match.length === 3) {
            const lastName = match[1];
            const firstName = match[2];
            return `${lastName} ${firstName}`;
        }

        return null;
    }
    private extractElementFromXPath(xpath: string): string {
        const result = xpath.match(/\/(\w+)/g);

        if (result) {
            const lastElement = result[result.length - 1];
            const element = lastElement.slice(1);
            return element;
        }

        return "";
    }
    /**
     * 指定された属性を持つ祖先要素が存在するかどうかを判定する
     * @param {HTMLElement} element - 検査対象の要素
     * @param {string} attributeName - 検索する属性名
     * @returns {boolean} - 指定された属性を持つ祖先要素が存在する場合は true、存在しない場合は false
     */
    private hasAncestorWithAttribute(element: HTMLElement, attributeName: string): boolean {
        let ancestor = element.parentNode;
        while (ancestor) {
            if (ancestor.hasAttribute(attributeName)) {
                return true;
            }
            ancestor = ancestor.parentNode;
        }
        return false;
    }
    /**
     * data-* , id , class List 以外の属性を比較し真偽値を返す
     * @param element1 比較 HTML 要素
     * @param element2 比較 HTML 要素
     * @returns data-* , id , class List 以外の属性が一致するかどうか
     */
    private compareAttributes(element1: HTMLElement, element2: HTMLElement): boolean {
        const attributes1 = _.keys(element1.attributes).filter(key => key !== "id" && key !== "class" && key !== "href" && key !== "border" && !(key.startsWith("data-")));
        const attributes2 = _.keys(element2.attributes).filter(key => key !== "id" && key !== "class" && key !== "href" && key !== "border" && !(key.startsWith("data-")));
        return attributes1.length === attributes2.length &&
            attributes1.every(key => element1.getAttribute(key) === element2.getAttribute(key));
    }


}

type ExaminationTakerName = {
    indexHtml: string | null,
    folder: string | null,
}
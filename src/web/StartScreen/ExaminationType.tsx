export default class ExaminationType {
    // ! サポートしているかどうか自動化する
    readonly EXAMINATION_LIST = [
        { value: "JP", isDisabled: true, label: "日本語ワープロ検定", },
        { value: "SP", isDisabled: true, label: "情報処理技能検定(表計算)", },
        { value: "DP", isDisabled: true, label: "情報処理技能検定(データベース)", },
        { value: "BD", isDisabled: true, label: "文書デザイン検定", },
        { value: "HP", isDisabled: false, label: "ホームページ作成検定", },
        { value: "PR", isDisabled: true, label: "プレゼンテーション作成検定", },
    ] as const;

    private readonly _ALIAS_NAMES = {
        JP: { JP_FormalName: "日本語ワープロ検定", EN_FormalName: "Examination in Japanese Word Processing" },
        SP: { JP_FormalName: "情報処理技能検定(表計算)", EN_FormalName: "Examination in Technical Ability of Data Processing (Spreadsheet)" },
        DP: { JP_FormalName: "情報処理技能検定(データベース)", EN_FormalName: "Examination in Technical Ability of Data Processing (Database)" },
        BD: { JP_FormalName: "文書デザイン検定", EN_FormalName: "Examination in Document Design" },
        HP: { JP_FormalName: "ホームページ作成検定", EN_FormalName: "Examination in Homepage Production" },
        PR: { JP_FormalName: "プレゼンテーション作成検定", EN_FormalName: "Examination in Presentation Production" },
    } as const;

    private readonly _GRADE_NAME_LIST = {
        Toku: { JP_FormalName: "特段", EN_formalName: "Toku-dan" },
        Sho: { JP_FormalName: "初段", EN_formalName: "Sho-dan" },
        First: { JP_FormalName: "1級", EN_formalName: "First Grade" },
        P_First: { JP_FormalName: "準1級", EN_formalName: "Pre-First Grade" },
        Second: { JP_FormalName: "2級", EN_formalName: "Second Grade" },
        P_Second: { JP_FormalName: "準2級", EN_formalName: "Pre-Second Grade" },
        Third: { JP_FormalName: "3級", EN_formalName: "Third Grade" },
        Fourth: { JP_FormalName: "4級", EN_formalName: "Fourth Grade" },
        Fifth: { JP_FormalName: "5級", EN_formalName: "Fifth Grade" },
        Sixth: { JP_FormalName: "6級", EN_formalName: "Sixth Grade" },
    } as const;

    readonly SUPPORT_GRADE_TABLE = {
        JP: ["Sho", "First", "P_First", "Second", "P_Second", "Third", "Fourth"],
        SP: ["Sho", "First", "P_First", "Second", "P_Second", "Third", "Fourth"],
        DP: ["First", "Second", "Third", "Fourth"],
        BD: ["First", "Second", "Third", "Fourth"],
        HP: ["First", "Second", "Third", "Fourth"],
        PR: ["First", "Second", "Third", "Fourth"],
    } as const;
    private readonly ExaminationTypeAndFileExtension = {
        JP: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf", "text/plain"],
        SP: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
        DP: null,
        BD: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"],
        HP: null,
        PR: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    }
    /**
     * 指定された試験の級の一覧を提供する
     * @param examination 短縮試験名称
     * @returns サポートしている試験の級の短縮名の配列
     */
    getSupportGrade(examination: keyof typeof this.SUPPORT_GRADE_TABLE) {
        return this.SUPPORT_GRADE_TABLE[examination];
    }
    /**
     * 完全修飾試験名称の日本語と英語名を返す
     * @param aliasName 別名
     * @returns 英語及び日本語の正式な試験名称配列
     */
    getExaminationFullName(aliasName: keyof ExaminationType["_ALIAS_NAMES"]) {
        return this._ALIAS_NAMES[aliasName]
    }
    /**
     * 完全修飾された級の英語名と日本語名を返す
     * @param shortName 短縮された級の名前
     * @returns 英語及び日本語の級の正式名称配列
     */
    getGradeFullName(shortName: keyof typeof this._GRADE_NAME_LIST) {
        return this._GRADE_NAME_LIST[shortName]
    }
    /**
     * 特定の文字列でも選択可能にするための関数
     * @param option ValueType<OptionTypeBase>
     * @param searchText string
     * @returns {boolean}
     */
    searchFilter(option: { label: string; value: string; }, searchText: string): boolean {
        const label = option.label.toLowerCase();
        const value = option.value.toLowerCase();
        searchText = searchText.toLowerCase();

        return (
            label.startsWith(searchText) ||
            value.startsWith(searchText) ||
            value === searchText
        );
    }
    /**
     * 算用数字から 級の文字列へ変換する
     * @param gradeNumber 級を簡易的に表すアラビア数字
     * @returns `ExaminationType` で 使う 文字列
     */
    getNumber2CharJP_FormalNameList(gradeNumber: number): {} {
        const convertibleGradeName = ["First", "Second", "Third", "Fourth"];
        return convertibleGradeName[gradeNumber - 1];
    }
    // * 気が向いたら実装する
    // getSupportFileExtensionFromExamType(examType): [string] | null {
    //     this.ExaminationTypeAndFileExtension[examType]
    //     return [""];
    // }
}
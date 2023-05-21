import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Link as RouterLink } from "react-router-dom";
import React from 'react'
import { useDispatch } from 'react-redux';
import { stepDown, stepUp } from '../Features/stepInfo';
import Grid from '@mui/material/Unstable_Grid2';

const allowPattern = {
    allow: "\u{2714} 許可",
    forbid: "\u{274C} 不許可",
} as const;

const rows = [
    createData("反社会的な利用", allowPattern.forbid),
    createData(
        "本開発者、日本情報処理検定協会、他の本ソフトウェアの利用者 のいずれかに対して害を与える行為・利用",
        allowPattern.forbid
    ),
    createData("このソフトウェアで提供される機能を利用すること", allowPattern.allow),
    createData("利用者の責任で複製・再配布すること", allowPattern.allow),
    createData("利用者の責任で本ソフトウェアを改良・改造すること", allowPattern.allow),
    createData("利用者の責任で本ソフトウェアをリバースエンジニアリングすること", allowPattern.allow),
    createData("ソフトウェアを再配布(改造されたものを含む。)するときに開発者の氏名を事実と異なる表示をすること", allowPattern.forbid),
    createData("ソフトウェアを再配布(改造されたものを含む。)するときに開発者の氏名を表示しないこと", allowPattern.allow),
    createData("ソフトウェアを再配布(改造されたものを含む。)の条件を厳しくすること", allowPattern.forbid),
    createData("ソフトウェアを再配布(改造されたものを含む。)の条件を明示しないこと", allowPattern.forbid),
] as const;

const EULA: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <>
            <Typography component="h1" variant="h3">利用条件エンドユーザライセンス合意(EULA)</Typography>
            <Typography component="h2" variant="h4">概要</Typography>
            <Typography>このアプリケーション(その他プラットフォームの本開発者によって提供されるものを含む。)の利用条件について使用する用語は次のように定義されます。</Typography>

            <Typography><strong>本開発者</strong>とは、このソフトウェアの配布者及び開発者をいう。</Typography>
            <Typography><strong>本サービス</strong>とは、このソフトウェアによって実現する計算結果を提供する機能及びこれに付随する機能のこと</Typography>
            <Typography><strong>本コンテンツ</strong>とは、本サービス上で提供される文字、音、静止画、動画、プログラム用データ、データ交換情報、ソフトウェアプログラム、コード等の総称（投稿情報を含む）のこと</Typography>
            <Typography><strong>利用者</strong>とは、本サービスを使う者のこと</Typography>

            <Typography component="h3" variant="h5">要約</Typography>
            <Typography>あなたは 以下の表に示された条件に従うときに このソフトウェアの使用が認められます。</Typography>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="重要事項をまとめた表">
                <TableHead>
                    <TableRow>
                        <TableCell>内容</TableCell>
                        <TableCell>可否</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.content}>
                            <TableCell component="th" scope="row">{row.content}</TableCell>
                            <TableCell component="th" scope="row">{row.isProhibitingAction}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Typography component="h3" variant="h5">非公式</Typography>
            <Typography>このソフトウェアは、日本情報処理検定の公認を得ていない 個人が開発したものです。</Typography>
            <Typography component="h3" variant="h5">費用の負担</Typography>
            <Typography>
                このソフトウェアは、利用料金を請求することがありません。
                ただし、ダウンロードの為の通信費などは利用者の負担になる。
            </Typography>
            <Typography component="h3" variant="h5">非保証</Typography>
            <Typography>
                本開発者は、本ソフトウェアについて、誤り、動作不良、エラー若しくは他の不具合が生じないこと、
                第三者の権利を侵害しないこと、商品性、ライセンシー
                若しくは第三者の特定の目的への適合性、又は
                本契約に明示的定めのない他の事項について、何らの保証もしない。
            </Typography>
            <Typography>
                本開発者は このソフトウェアが保守メンテナンスされることを保障しない。また、予告なしに開発・保守の
                中断することがある。
            </Typography>
            <Typography component="h3" variant="h5">知的財産権の非移転</Typography>
            <Typography>このソフトウェアについての知的財産権は、本開発者に帰属する。</Typography>
            <Typography component="h3" variant="h5">個人情報の保護</Typography>
            <Typography>
                このソフトウェアは、実行ファイルとして実装されるプラットフォームにおいて実行されるとき 常に利用者のローカルエンドで実行され開発者は、
                アップロード(ファイル選択) したファイルを閲覧出来ません。
            </Typography>
            <Typography>
                Web サイドで実装されるとき、このサービスはサーバへ情報を送信することがあります。この場合、 TLS/SSL による暗号化、場合によっては追加のセキュリティ対策や
                暗号化を実装し個人情報を保護します。ただし、これはベストエフォートで提供され機密性を保証しません。また、利用者は、個人情報を積極的に送信するべきではありません。(例:パスワードなど)
            </Typography>
            <Grid container justifyContent="space-between" sx={{ margin: 2 }}>
                <Button variant="outlined" startIcon={<NavigateBeforeIcon />} component={RouterLink} to='/' onClick={() => {
                    dispatch(stepDown());
                    // @ts-ignore
                    window.NavigationOperator.goBack();
                }}>戻る</Button>
                <Button variant="contained"
                    endIcon={<NavigateNextIcon />}
                    component={RouterLink} to='/ownAnswerFileInputScreen' onClick={() => {
                        dispatch(stepUp())
                    }}>EULAに同意して進む</Button>
            </Grid>
        </>
    )
}


function createData(content: string, isProhibitingAction: string) {
    return { content, isProhibitingAction };
}

export default EULA;
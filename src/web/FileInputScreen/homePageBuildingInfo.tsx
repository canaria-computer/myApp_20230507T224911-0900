import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

const HomePageBuildingInfo: React.FC = () => {
    return (
        <>
            <Alert severity="info" sx={{ margin: 1 }}>
                <AlertTitle>info : [参考情報]</AlertTitle>
                ホームページ作成検定は フォルダごと調べるため
                <strong>index.html</strong>が存在するフォルダを選択する必要があります。
            </Alert>
        </>
    )
}

export default HomePageBuildingInfo
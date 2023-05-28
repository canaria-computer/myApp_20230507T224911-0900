import { AppBar, Toolbar, Typography } from "@mui/material"

const header = () => {
    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <Typography variant="h6" color="inherit" component="div">
                    日検自動採点ツール
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default header
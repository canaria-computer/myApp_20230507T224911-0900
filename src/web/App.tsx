import "./App.css";

import { Route, Routes, useLocation } from "react-router-dom"
import Start from "./StartScreen/Start";
import EULA from "./EULA";
import OwnAnswerFileInput from "./FileInputScreen/ownAnswerFileInput"
import ModelAnserFileInput from "./FileInputScreen/modelAnserFileInput"
import ScoringAndResultDisplay from "./scoringAndResultDisplayScreen/scoringAndResultDisplay"
import StepperScreen from "../components/modules/StepperScreen"

import { ThemeProvider, createTheme } from "@mui/material/styles";
import Header from "../components/modules/Header";
import { CssBaseline, useMediaQuery } from "@mui/material";
import React from "react";
import SlideRoutes from "react-slide-routes";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // `createTheme`を有効化
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}


const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(() => createTheme({
    palette: {
      primary: {
        main: '#00796b',
      },
      secondary: {
        main: '#7e57c2',
      },
      // error: { main: "#d32f2f" },
      // warning: { main: "#ed6c02" },
      // info: { main: "#0288d1" },
      // success: { main: "#2e7d32" },
    }, components: {
      MuiTypography: {
        defaultProps: {
          mt: 2, sx: { margin: 1.5 },
          variantMapping: {
            h1: "h4", h2: "h5", h3: "h5", h4: "h5", h5: "h5",
            subtitle1: "h6", subtitle2: "h6",
          },
        },
      }
    }
  }), [prefersDarkMode],
  );
  // const stepInfo = useSelector((state: RootState) => state.stepper)

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <CssBaseline />
      <StepperScreen />
      <SlideRoutes duration={555}>
        <Route path="/" element={<Start />} />
        <Route path="/EULA" element={<EULA />} ></Route>
        <Route path="/ownAnswerFileInputScreen" element={<OwnAnswerFileInput />}></Route>
        <Route path="/modelAnswerFileInputScreen" element={<ModelAnserFileInput />}></Route>
        <Route path="/scoringAndResultDisplayScreen" element={<ScoringAndResultDisplay />}></Route>
      </SlideRoutes>
    </ThemeProvider>
  );

};


export default App;
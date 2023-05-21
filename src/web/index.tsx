import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit"
import stepInfoReducer from "../Features/stepInfo"
import examinationAndGradeInfoSteate from "../Features/ExaminationAndGradeInfo"
import filesAndFolderInfo from "../Features/FilesAndFolderInfo"
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";


const store = configureStore({
  reducer: {
    stepper: stepInfoReducer,
    examinationGradeInfo: examinationAndGradeInfoSteate,
    FilesAndFolderInfo: filesAndFolderInfo,
  },
})

type RootState = ReturnType<typeof store.getState>;
export type { RootState };

createRoot(document.getElementById("root") as Element).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
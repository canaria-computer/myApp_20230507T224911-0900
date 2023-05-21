/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/my-menu.ts":
/*!************************!*\
  !*** ./src/my-menu.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MyMenu": () => (/* binding */ MyMenu)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);

class MyMenu {
    mainWindow;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
    }
    createMenu() {
        const template = [
            {
                label: "ファイル",
                submenu: [
                    { role: 'close', label: 'ウィンドウを閉じる' }
                ]
            },
            {
                label: "編集",
                submenu: [
                    { role: 'undo', label: '元に戻す' },
                    { role: 'redo', label: 'やり直す' },
                    { type: 'separator' },
                    { role: 'cut', label: '切り取り' },
                    { role: 'copy', label: 'コピー' },
                    { role: 'paste', label: '貼り付け' },
                ]
            },
            {
                label: "画面表示",
                submenu: [
                    {
                        label: "画面拡大",
                        accelerator: "CmdOrCtrl+Plus, CmdOrCtrl+NumAdd",
                        click: () => {
                            const level = this.mainWindow.webContents.getZoomLevel();
                            this.mainWindow.webContents.setZoomLevel(level + 1);
                        },
                    },
                    {
                        label: "画面縮小",
                        accelerator: "CmdOrCtrl+-, CmdOrCtrl+numsub",
                        click: () => {
                            const level = this.mainWindow.webContents.getZoomLevel();
                            this.mainWindow.webContents.setZoomLevel(level - 1);
                        },
                    },
                    {
                        label: "拡大縮小率を戻す",
                        accelerator: "CmdOrCtrl+0 CmdOrCtrl+num0",
                        click: () => {
                            this.mainWindow.webContents.setZoomLevel(0);
                        },
                    },
                ],
            },
            {
                label: "前に戻る",
                accelerator: "Alt+Left",
                click: () => {
                    this.mainWindow.webContents.goBack();
                }
            },
            {
                label: "次に進める",
                accelerator: "Alt+Right",
                click: () => {
                    this.mainWindow.webContents.goBack();
                }
            }
        ];
        const menu = electron__WEBPACK_IMPORTED_MODULE_0__.Menu.buildFromTemplate(template);
        electron__WEBPACK_IMPORTED_MODULE_0__.Menu.setApplicationMenu(menu);
    }
}


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _my_menu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./my-menu */ "./src/my-menu.ts");



electron__WEBPACK_IMPORTED_MODULE_1__.app.whenReady().then(() => {
    const mainWindow = new electron__WEBPACK_IMPORTED_MODULE_1__.BrowserWindow({
        width: 1250,
        webPreferences: {
            preload: path__WEBPACK_IMPORTED_MODULE_0___default().resolve(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true, //false is secure
            // contextIsolation: false,
            // nodeIntegration: true,
        },
    });
    const webFrame = mainWindow.webContents;
    mainWindow.loadFile("dist/index.html");
    webFrame.openDevTools({ mode: "right" });
    const myMenu = new _my_menu__WEBPACK_IMPORTED_MODULE_2__.MyMenu(mainWindow);
    myMenu.createMenu();
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle('FileAndFolderSelect', async (event, arg) => {
        return electron__WEBPACK_IMPORTED_MODULE_1__.dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            // buttonLabel: ""
            defaultPath: electron__WEBPACK_IMPORTED_MODULE_1__.app.getPath('desktop')
        })
            .then((result) => {
            if (result.canceled)
                return '';
            return result.filePaths[0];
        });
    });
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle("NavigationOperator", (_event, arg) => {
        webFrame.goBack();
    });
    // 採点システム呼び出しAPIを定義
    electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle("scoringApps", (_event, arg) => {
        // バックエンド
        console.log(typeof arg, arg);
        return { message: "test" };
    });
});
electron__WEBPACK_IMPORTED_MODULE_1__.app.once("window-all-closed", () => electron__WEBPACK_IMPORTED_MODULE_1__.app.quit());

})();

/******/ })()
;
//# sourceMappingURL=main.js.map
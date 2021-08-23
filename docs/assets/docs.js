/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@devlop-ab/dialog/dist/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@devlop-ab/dialog/dist/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dialog),
/* harmony export */   "dialog": () => (/* binding */ dialog)
/* harmony export */ });

var template = "\n    <div data-dialog-backdrop tabindex=\"-1\" hidden>\n        <div\n            data-dialog=\"{type}\"\n            tabindex=\"-1\"\n            role=\"dialog\"\n            aria-labelledby=\"{titleId}\"\n            aria-describedby=\"{descriptionId}\"\n            aria-modal=\"true\"\n            aria-live=\"assertive\"\n        >\n            <form role=\"presentation\">\n                <header role=\"presentation\">\n                    <span id=\"{titleId}\">{title}</span>\n                </header>\n                <section class=\"message\">\n                    <span id=\"{descriptionId}\">{message}</span>\n                </section>\n                <section class=\"prompt\" data-role=\"prompt-section\">\n                    <input type=\"text\"\n                        value=\"\"\n                    >\n                </section>\n                <footer role=\"presentation\">\n                    <button type=\"button\" data-role=\"cancel\">{cancelText}</button>\n                    <button type=\"submit\" data-role=\"ok\">{okText}</button>\n                </footer>\n            </form>\n        </div>\n    </div>\n";
;
;
var makeDialog = function (type, message, options) {
    var _a;
    var dialogHTML = template;
    var title = (_a = options.title) !== null && _a !== void 0 ? _a : null;
    var cancelText = 'Cancel';
    var okText = 'Ok';
    var uniqueId = String(Date.now());
    var titleId = "dialog-" + uniqueId + "-title";
    var descriptionId = "dialog-" + uniqueId + "-description";
    dialogHTML = dialogHTML.replace(/\{titleId\}/g, titleId);
    dialogHTML = dialogHTML.replace(/\{descriptionId\}/g, descriptionId);
    dialogHTML = dialogHTML.replace('{type}', type);
    dialogHTML = dialogHTML.replace('{message}', message);
    dialogHTML = dialogHTML.replace('{title}', title !== null && title !== void 0 ? title : '');
    dialogHTML = dialogHTML.replace('{cancelText}', cancelText);
    dialogHTML = dialogHTML.replace('{okText}', okText);
    var div = document.createElement('div');
    div.insertAdjacentHTML('afterbegin', dialogHTML);
    if (title === null) {
        (div.querySelector('header')).remove();
        (div.querySelector('[aria-describedby]')).removeAttribute('aria-describedby');
        (div.querySelector('[aria-labelledby]')).setAttribute('aria-labelledby', descriptionId);
    }
    return div.firstElementChild;
};
var makeAlertDialog = function (message, options) {
    var dialog = makeDialog('alert', message, options);
    removeDialogInputSection(dialog);
    removeDialogCancelButton(dialog);
    return dialog;
};
var makeConfirmDialog = function (message, options) {
    var dialog = makeDialog('confirm', message, options);
    removeDialogInputSection(dialog);
    return dialog;
};
var makePromptDialog = function (message, _default, options) {
    var _a;
    var dialog = makeDialog('prompt', message, options);
    var inputField = getInputField(dialog);
    inputField.value = _default;
    var inputAttributes = (_a = options.input) !== null && _a !== void 0 ? _a : null;
    if (inputAttributes !== null) {
        updateInputFieldAttributes(inputField, inputAttributes);
    }
    return dialog;
};
var updateInputFieldAttributes = function (inputField, inputAttributes) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    inputField.type = (_a = inputAttributes.type) !== null && _a !== void 0 ? _a : inputField.type;
    if (((_b = inputAttributes.required) !== null && _b !== void 0 ? _b : null) !== null) {
        inputField.required = inputAttributes.required;
    }
    if (((_c = inputAttributes.placeholder) !== null && _c !== void 0 ? _c : null) !== null) {
        inputField.placeholder = inputAttributes.placeholder;
    }
    if (((_d = inputAttributes.multiple) !== null && _d !== void 0 ? _d : null) !== null) {
        inputField.multiple = inputAttributes.multiple;
    }
    if (((_e = inputAttributes.minLength) !== null && _e !== void 0 ? _e : null) !== null) {
        inputField.minLength = inputAttributes.minLength;
    }
    if (((_f = inputAttributes.maxLength) !== null && _f !== void 0 ? _f : null) !== null) {
        inputField.maxLength = inputAttributes.maxLength;
    }
    if (((_g = inputAttributes.min) !== null && _g !== void 0 ? _g : null) !== null) {
        inputField.min = String(inputAttributes.min);
    }
    if (((_h = inputAttributes.max) !== null && _h !== void 0 ? _h : null) !== null) {
        inputField.max = String(inputAttributes.max);
    }
    if (((_j = inputAttributes.max) !== null && _j !== void 0 ? _j : null) !== null) {
        inputField.max = String(inputAttributes.max);
    }
    if (((_k = inputAttributes.step) !== null && _k !== void 0 ? _k : null) !== null) {
        inputField.step = String(inputAttributes.step);
    }
    if (((_l = inputAttributes.pattern) !== null && _l !== void 0 ? _l : null) !== null) {
        inputField.pattern = inputAttributes.pattern;
    }
    if (((_m = inputAttributes.title) !== null && _m !== void 0 ? _m : null) !== null) {
        inputField.title = inputAttributes.title;
    }
    if (((_o = inputAttributes.list) !== null && _o !== void 0 ? _o : null) !== null) {
        inputField.setAttribute('list', inputAttributes.list);
    }
    if (((_p = inputAttributes.inputMode) !== null && _p !== void 0 ? _p : null) !== null) {
        inputField.inputMode = inputAttributes.inputMode;
    }
    if (((_q = inputAttributes.spellcheck) !== null && _q !== void 0 ? _q : null) !== null) {
        inputField.spellcheck = inputAttributes.spellcheck;
    }
};
var removeDialogInputSection = function (dialog) {
    var _a;
    (_a = dialog.querySelector('section[data-role="prompt-section"]')) === null || _a === void 0 ? void 0 : _a.remove();
};
var removeDialogCancelButton = function (dialog) {
    var _a;
    (_a = dialog.querySelector('footer > button[data-role="cancel"]')) === null || _a === void 0 ? void 0 : _a.remove();
};
var documentEventListeners = [];
var registerEventListeners = function (dialog, okCallback, cancelCallback) {
    var backdrop = 'dialogBackdrop' in dialog.dataset
        ? dialog
        : dialog.querySelector('[data-dialog-backdrop]');
    backdrop === null || backdrop === void 0 ? void 0 : backdrop.addEventListener('click', function (event) {
        event.stopPropagation();
        if (event.target !== backdrop) {
            return;
        }
        cancelCallback.apply(null);
    });
    registerDocumentEventListener('keydown', function (event) {
        if (event.key !== 'Escape') {
            return;
        }
        cancelCallback.apply(null);
    });
    window.setTimeout(function () {
        registerDocumentEventListener('click', function (event) {
            cancelCallback.apply(null);
        });
    });
    var form = dialog.querySelector('form');
    var cancelButton = dialog.querySelector('[data-role="cancel"]');
    var okButton = dialog.querySelector('[data-role="ok"]');
    var inputField = getInputField(dialog);
    cancelButton === null || cancelButton === void 0 ? void 0 : cancelButton.addEventListener('click', function (event) {
        cancelCallback.apply(null);
    });
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        okCallback.apply(null);
    });
    if (cancelButton !== null && okButton !== null) {
        [cancelButton, okButton].forEach(function (button) {
            button.addEventListener('keydown', function (event) {
                var isLeftOrRightKey = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
                if (!isLeftOrRightKey) {
                    return;
                }
                event.preventDefault();
                (event.target === okButton ? cancelButton : okButton).focus();
            });
        });
    }
    registerTabTrap(dialog);
};
var registerDocumentEventListener = function (type, listener) {
    document.addEventListener(type, listener);
    documentEventListeners.push({
        type: type,
        listener: listener
    });
};
var unregisterDocumentEventListeners = function () {
    var eventListenerReference;
    while (typeof (eventListenerReference = documentEventListeners.shift()) !== 'undefined') {
        document.removeEventListener(eventListenerReference.type, eventListenerReference.listener);
    }
};
var registerTabTrap = function (dialog) {
    var tabbableElements = Array.from(dialog.querySelectorAll('a, button, input'))
        .filter(function (tabbableElement) {
        var computedStyle = window.getComputedStyle(tabbableElement);
        if (computedStyle.display === 'none') {
            return false;
        }
        if (computedStyle.visibility === 'hidden') {
            return false;
        }
        if (['button', 'input'].includes(tabbableElement.tagName) && tabbableElement.disabled === true) {
            return false;
        }
        return true;
    });
    if (tabbableElements.length === 0) {
        return;
    }
    var firstTabbableElement = tabbableElements[0];
    var lastTabbableElement = tabbableElements[tabbableElements.length - 1];
    registerDocumentEventListener('focusin', function (event) {
        if (!dialog.contains(event.target)) {
            event.preventDefault();
            firstTabbableElement.focus();
        }
    });
    firstTabbableElement.addEventListener('keydown', function (event) {
        var shouldWrap = event.key === 'Tab' && event.shiftKey;
        if (shouldWrap) {
            event.preventDefault();
            lastTabbableElement.focus();
        }
    });
    lastTabbableElement.addEventListener('keydown', function (event) {
        var shouldWrap = event.key === 'Tab' && !event.shiftKey;
        if (shouldWrap) {
            event.preventDefault();
            firstTabbableElement.focus();
        }
    });
};
var openDialog = function (dialog, callback) {
    getDialogContainer().appendChild(dialog);
    dialog.hidden = false;
    dialog.firstElementChild.style.display = 'block';
    callback.apply(null);
};
var dialogContainer = null;
var getDialogContainer = function () {
    if (dialogContainer === null) {
        dialogContainer = document.createElement('div');
    }
    if (dialogContainer.parentElement === null) {
        document.body.appendChild(dialogContainer);
    }
    return dialogContainer;
};
var closeDialog = function (dialog) {
    dialog.remove();
    unregisterDocumentEventListeners();
};
var focusOkButton = function (dialog) {
    dialog.querySelector('button[data-role="ok"]').focus();
};
var focusCancelButton = function (dialog) {
    dialog.querySelector('button[data-role="cancel"]').focus();
};
var getInputField = function (dialog) {
    return dialog.querySelector('input');
};
var getInputFieldValue = function (dialog) {
    var _a, _b;
    return (_b = (_a = getInputField(dialog)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
};
var alertDialog = function (message, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var dialog = makeAlertDialog(message !== null && message !== void 0 ? message : '', options);
        registerEventListeners(dialog, function () {
            closeDialog(dialog);
            resolve();
        }, function () {
            closeDialog(dialog);
            resolve();
        });
        openDialog(dialog, function () {
            focusOkButton(dialog);
        });
    });
};
var confirmDialog = function (message, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var dialog = makeConfirmDialog(message !== null && message !== void 0 ? message : '', options);
        registerEventListeners(dialog, function () {
            closeDialog(dialog);
            resolve(true);
        }, function () {
            closeDialog(dialog);
            resolve(false);
        });
        openDialog(dialog, function () {
            if (options.focus === 'cancel') {
                focusCancelButton(dialog);
            }
            else {
                focusOkButton(dialog);
            }
        });
    });
};
var promptDialog = function (message, _default, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var dialog = makePromptDialog(message !== null && message !== void 0 ? message : '', _default !== null && _default !== void 0 ? _default : '', options);
        registerEventListeners(dialog, function () {
            closeDialog(dialog);
            var value = getInputFieldValue(dialog);
            resolve(value);
        }, function () {
            closeDialog(dialog);
            resolve(null);
        });
        openDialog(dialog, function () {
            var inputField = getInputField(dialog);
            inputField.focus();
            inputField.select();
        });
    });
};
var dialog = {
    'alert': alertDialog,
    'confirm': confirmDialog,
    'prompt': promptDialog
};



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
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./js/index.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _devlop_ab_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @devlop-ab/dialog */ "./node_modules/@devlop-ab/dialog/dist/index.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;

(_a = document.querySelector('#alert-with-title')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
    yield _devlop_ab_dialog__WEBPACK_IMPORTED_MODULE_0__.dialog.alert('Your changes have been saved.', {
        title: 'Saved',
    });
}));
(_b = document.querySelector('#alert-with-custom-button-text')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
    yield _devlop_ab_dialog__WEBPACK_IMPORTED_MODULE_0__.dialog.alert('Your changes have been saved.', {
        title: 'Saved',
        okText: 'Alright!',
    });
}));
// dialogConfirmTrigger.addEventListener('click', async (event : MouseEvent) : Promise<void> => {
//     event.preventDefault();
//     console.log('before confirm');
//     const result = await dialog.confirm('Do you want to delete the file?', {
//         title: 'Delete',
//         focus: 'cancel',
//     });
//     console.log('after confirm');
//     console.log(result);
//     dialogConfirmTrigger.focus();
// });
// dialogPromptTrigger.addEventListener('click', async (event : MouseEvent) : Promise<void> => {
//     event.preventDefault();
//     console.log('before prompt');
//     const answer = await dialog.prompt('What is your name?', null, {
//         title: 'Your name',
//         input: {
//             // type: 'date',
//             title: 'Remember your middle name.',
//             // required: true,
//             placeholder: 'Your full name',
//             // minLength: 0,
//             // maxLength: 12,
//             // min: 0,
//             // max: 20,
//             // step: 1,
//             // multiple: true,
//             // list: 'ice-cream-flavors',
//             // pattern: 'abc123',
//             // inputMode: 'email',
//             // spellcheck: true,
//             // required: true,
//             // spellcheck: true,
//         },
//     });
//     console.log('after prompt');
//     console.log(answer);
//     dialogPromptTrigger.focus();
// });

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************!*\
  !*** ./css/index.scss ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=docs.js.map
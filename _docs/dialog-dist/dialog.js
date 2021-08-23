'use strict';
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
export { dialog as default, dialog as dialog, };

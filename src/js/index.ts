'use strict';

const template = `
    <div data-dialog-backdrop tabindex="-1">
        <div
            data-dialog="{type}"
            tabindex="-1"
            role="dialog"
            aria-labelledby="{titleId}"
            aria-describedby="{descriptionId}"
            aria-modal="true"
            aria-live="assertive"
        >
            <form>
                <header>
                    <span id="{titleId}">{title}</span>
                    <button type="button" data-role="close" aria-label="Close"></button>
                </header>
                <section class="message">
                    <span id="{descriptionId}">{message}</span>
                </section>
                <section class="prompt" data-role="prompt-section">
                    <input type="text"
                        value=""
                    >
                </section>
                <footer>
                    <button type="button" data-role="cancel">{cancelText}</button>
                    <button type="submit" data-role="ok">{okText}</button>
                </footer>
            </form>
        </div>
    </div>
`;

interface EventListenerReference {
    type : string;
    listener: EventListenerOrEventListenerObject;
};

interface DialogOptionsInterface {
    title? : string;
};

interface AlertDialogOptionsInterface extends DialogOptionsInterface {
    okText? : string;
}

interface ConfirmDialogOptionsInterface extends DialogOptionsInterface {
    cancelText? : string;
    okText? : string;
}

interface PromptDialogOptionsInterface extends DialogOptionsInterface {
    cancelText? : string;
    okText? : string;
    input? : InputAttributesInterface;
}

interface InputAttributesInterface {
    type? : SupportedInputType;
    title? : string | null;
    required? : boolean;
    placeholder? : string | null;
    minLength? : number | null;
    maxLength? : number | null;
    min? : number | null;
    max? : number | null;
    step? : number | null;
    multiple? : boolean;
    list? : string | null;
    pattern? : string | null;
    inputMode? : string | null;
    spellcheck? : boolean;
}

type TabbableElement = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement;

type SupportedInputType =
    'color' |
    'date' |
    'datetime-local' |
    'email' |
    'month' |
    'number' |
    'password' |
    'range' |
    'search' |
    'tel' |
    'text' |
    'time' |
    'url' |
    'week';

const makeDialog = (
    type : string,
    message : string,
    options : DialogOptionsInterface,
) : HTMLElement => {
    let dialogHTML = template;

    const title : string = options.title ?? '';
    const cancelText : string = 'Cancel';
    const okText : string = 'Ok';

    const uniqueId : string = String(Date.now());

    const titleId : string = `dialog-${uniqueId}-title`;
    const descriptionId : string = `dialog-${uniqueId}-description`;

    dialogHTML = dialogHTML.replace(/\{titleId\}/g, titleId);
    dialogHTML = dialogHTML.replace(/\{descriptionId\}/g, descriptionId);
    dialogHTML = dialogHTML.replace('{type}', type);
    dialogHTML = dialogHTML.replace('{message}', message);
    dialogHTML = dialogHTML.replace('{title}', title);
    dialogHTML = dialogHTML.replace('{cancelText}', cancelText);
    dialogHTML = dialogHTML.replace('{okText}', okText);

    const div : HTMLElement = document.createElement('div');
    div.insertAdjacentHTML('afterbegin', dialogHTML);

    return div.firstElementChild as HTMLElement;
};

const makeAlertDialog = (
    message : string,
    options : AlertDialogOptionsInterface,
) : HTMLElement => {
    const dialog = makeDialog(
        'alert',
        message,
        options,
    );

    // remove the input section
    removeDialogInputSection(dialog);

    // remove the cancel button
    removeDialogCancelButton(dialog);

    return dialog;
};

const makeConfirmDialog = (
    message : string,
    options : ConfirmDialogOptionsInterface,
) : HTMLElement => {
    const dialog = makeDialog(
        'confirm',
        message,
        options,
    );

    // remove the input section
    removeDialogInputSection(dialog);

    return dialog;
};

const makePromptDialog = (
    message : string,
    _default : string,
    options : PromptDialogOptionsInterface,
) : HTMLElement => {
    const dialog = makeDialog(
        'prompt',
        message,
        options,
    );

    const inputField : HTMLInputElement = getInputField(dialog) !;

    // set the input default value
    inputField.value = _default;

    const inputAttributes : InputAttributesInterface | null = options.input ?? null;

    if (inputAttributes !== null) {
        updateInputFieldAttributes(inputField, inputAttributes);
    }

    return dialog;
};

const updateInputFieldAttributes = (inputField : HTMLInputElement, inputAttributes : InputAttributesInterface) : void => {
    inputField.type = inputAttributes.type ?? inputField.type;

    if ((inputAttributes.required ?? null) !== null) {
        inputField.required = inputAttributes.required !;
    }

    if ((inputAttributes.placeholder ?? null) !== null) {
        inputField.placeholder = inputAttributes.placeholder !;
    }

    if ((inputAttributes.multiple ?? null) !== null) {
        inputField.multiple = inputAttributes.multiple !;
    }

    if ((inputAttributes.minLength ?? null) !== null) {
        inputField.minLength = inputAttributes.minLength !;
    }

    if ((inputAttributes.maxLength ?? null) !== null) {
        inputField.maxLength = inputAttributes.maxLength !;
    }

    if ((inputAttributes.min ?? null) !== null) {
        inputField.min = String(inputAttributes.min);
    }

    if ((inputAttributes.max ?? null) !== null) {
        inputField.max = String(inputAttributes.max);
    }

    if ((inputAttributes.max ?? null) !== null) {
        inputField.max = String(inputAttributes.max);
    }

    if ((inputAttributes.step ?? null) !== null) {
        inputField.step = String(inputAttributes.step);
    }

    if ((inputAttributes.pattern ?? null) !== null) {
        inputField.pattern = inputAttributes.pattern !;
    }

    if ((inputAttributes.title ?? null) !== null) {
        inputField.title = inputAttributes.title !;
    }

    if ((inputAttributes.list ?? null) !== null) {
        inputField.setAttribute('list', inputAttributes.list !);
    }

    if ((inputAttributes.inputMode ?? null) !== null) {
        inputField.inputMode = inputAttributes.inputMode !;
    }

    if ((inputAttributes.spellcheck ?? null) !== null) {
        inputField.spellcheck = inputAttributes.spellcheck !;
    }
};

const removeDialogInputSection = (dialog : HTMLElement) : void => {
    dialog.querySelector('section[data-role="prompt-section"]')?.remove();
};

const removeDialogCancelButton = (dialog : HTMLElement) : void => {
    dialog.querySelector('footer > button[data-role="cancel"]')?.remove();
};

const documentEventListeners : Array<EventListenerReference> = [];

const registerEventListeners = (
    dialog : HTMLElement,
    okCallback : () => void,
    cancelCallback : () => void,
) : void => {
    const backdrop : HTMLElement | null = 'dialogBackdrop' in dialog.dataset
        ? dialog // the backdrop is the outermost element
        : dialog.querySelector('[data-dialog-backdrop]'); // find the backdrop as a child

    // close the dialog (cancel) when the backdrop is clicked
    backdrop?.addEventListener('click', (event : MouseEvent) : void => {
        event.stopPropagation();

        if (event.target !== backdrop) {
            return;
        }

        cancelCallback.apply(null);
    });

    // close the dialog (cancel) when the escape key is pressed
    registerDocumentEventListener('keydown', (event : KeyboardEvent) : void => {
        if (event.key !== 'Escape') {
            return;
        }

        cancelCallback.apply(null);
    });

    // close the dialog (cancel) if a mouse click is registered on outside the dialog.
    window.setTimeout(() : void => {
        registerDocumentEventListener('click', (event : MouseEvent) : void => {
            cancelCallback.apply(null);
        });
    });

    const form : HTMLFormElement = dialog.querySelector('form') !;

    const closeButton : HTMLButtonElement = dialog.querySelector('[data-role="close"]') !;
    const cancelButton : HTMLButtonElement = dialog.querySelector('[data-role="cancel"]') !;
    const okButton : HTMLButtonElement = dialog.querySelector('[data-role="ok"]') !;
    const inputField : HTMLInputElement | null = getInputField(dialog);

    // close the dialog (cancel) when the "close" button is clicked.
    closeButton.addEventListener('click', (event : MouseEvent) : void => {
        cancelCallback.apply(null);
    });

    // close the dialog (cancel) when the "cancel" button is clicked.
    cancelButton?.addEventListener('click', (event : MouseEvent) : void => {
        cancelCallback.apply(null);
    });

    // close the dialog (ok) when the form is submitted (the "ok" button will submit the form).
    form.addEventListener('submit', (event : Event) : void => {
        event.preventDefault();

        okCallback.apply(null);
    });

    if (cancelButton !== null && okButton !== null) {
        // if the left or right key is pressed, move focus to the other button.
        [cancelButton, okButton].forEach((button : HTMLButtonElement) : void => {
            button.addEventListener('keydown', (event : KeyboardEvent) : void => {
                const isLeftOrRightKey = event.key === 'ArrowLeft' || event.key === 'ArrowRight';

                if (! isLeftOrRightKey) {
                    return;
                }

                event.preventDefault();

                // Switch focus to the other key.
                (event.target === okButton ? cancelButton : okButton).focus();
            });
        });
    }

    // wrap tab
    registerTabTrap(dialog);
};

const registerDocumentEventListener = (type : string, listener : Function) : void => {
    // @ts-ignore
    document.addEventListener(type, listener);

    documentEventListeners.push({
        type: type,
        // @ts-ignore
        listener: listener,
    });
};

const unregisterDocumentEventListeners = () : void => {
    let eventListenerReference : EventListenerReference | undefined;

    while (typeof (eventListenerReference = documentEventListeners.shift()) !== 'undefined') {
        document.removeEventListener(eventListenerReference.type, eventListenerReference.listener);
    }
};

const registerTabTrap = (dialog : HTMLElement) : void => {
    const tabbableElements = Array.from(dialog.querySelectorAll('a, button, input') as NodeListOf<TabbableElement>)
        .filter((tabbableElement : TabbableElement) : boolean => {
            const computedStyle : CSSStyleDeclaration = window.getComputedStyle(tabbableElement);

            if (computedStyle.display === 'none') {
                return false;
            }

            if (computedStyle.visibility === 'hidden') {
                return false;
            }

            // @ts-ignore
            if (['button', 'input'].includes(tabbableElement.tagName) && tabbableElement.disabled === true) {
                return false;
            }

            return true;
        });

    if (tabbableElements.length === 0) {
        return;
    }

    const firstTabbableElement : TabbableElement = tabbableElements[0];
    const lastTabbableElement : TabbableElement = tabbableElements[tabbableElements.length - 1];

    // if any elements outside the dialog is about to receive focus, snatch it back to the dialog
    registerDocumentEventListener('focusin', (event : Event) : void => {
        if (! dialog.contains(event.target as HTMLElement)) {
            event.preventDefault();

            firstTabbableElement.focus();
        }
    });

    // @ts-ignore
    firstTabbableElement.addEventListener('keydown', (event : KeyboardEvent) : void => {
        // only wrap if shift + tab was pressed
        const shouldWrap : boolean = event.key === 'Tab' && event.shiftKey;

        if (shouldWrap) {
            event.preventDefault();

            // move focus back down to last input when "tabbing away" backwards from first element
            lastTabbableElement.focus();
        }
    });

    // @ts-ignore
    lastTabbableElement.addEventListener('keydown', (event : KeyboardEvent) : void => {
        // only wrap tab (without shift key) was pressed
        const shouldWrap : boolean = event.key === 'Tab' && ! event.shiftKey;

        if (shouldWrap) {
            event.preventDefault();

            // move focus back up to first input when "tabbing away" from last element
            firstTabbableElement.focus();
        }
    });
};

const openDialog = (dialog : HTMLElement, callback : () => void) : void => {
    // we need to have the timeout here for voice over to work properly.
    // expand this comment with a better description of why later.
    window.setTimeout(() : void => {
        getDialogContainer().appendChild(dialog);

        callback.apply(null);
    }, 0);
};

let dialogContainer : HTMLElement | null = null;

/**
 * use a container so we don't force a repaint of the
 * whole body everytime we add a new dialog.
 */
const getDialogContainer = () : HTMLElement => {
    if (dialogContainer === null) {
        dialogContainer = document.createElement('div');
    }

    if (dialogContainer.parentElement === null) {
        document.body.appendChild(dialogContainer);
    }

    return dialogContainer;
};

const closeDialog = (dialog : HTMLElement) : void => {
    dialog.remove();

    unregisterDocumentEventListeners();
};

const focusOkButton = (dialog : HTMLElement) : void => {
    (dialog.querySelector('button[data-role="ok"]') as HTMLButtonElement).focus();
};

const getInputField = (dialog : HTMLElement) : HTMLInputElement | null => {
    return dialog.querySelector('input') as HTMLInputElement | null;
};

const getInputFieldValue = (dialog : HTMLElement) : string => {
    return getInputField(dialog)?.value ?? '';
};

const alertDialog = (
    message? : string | undefined | null,
    options : AlertDialogOptionsInterface = {},
) : Promise<void> => {
    return new Promise<void>((resolve, reject) : void => {
        const dialog = makeAlertDialog(message ?? '', options);

        registerEventListeners(
            dialog,
            // ok handler
            () : void => {
                closeDialog(dialog);

                resolve();
            },
            // cancel handler
            () : void => {
                closeDialog(dialog);

                resolve();
            },
        );

        openDialog(dialog, () : void => {
            focusOkButton(dialog);
        });
    });
};

const confirmDialog = (
    message? : string | undefined | null,
    options : ConfirmDialogOptionsInterface = {},
) : Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) : void => {
        const dialog = makeConfirmDialog(message ?? '', options);

        registerEventListeners(
            dialog,
            // ok handler
            () : void => {
                closeDialog(dialog);

                resolve(true);
            },
            // cancel handler
            () : void => {
                closeDialog(dialog);

                resolve(false);
            },
        );

        openDialog(dialog, () : void => {
            focusOkButton(dialog);
        });
    });
};

const promptDialog = (
    message? : string | undefined,
    _default? : string | undefined | null,
    options : PromptDialogOptionsInterface = {},
) : Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) : void => {
        const dialog = makePromptDialog(message ?? '', _default ?? '', options);

        registerEventListeners(
            dialog,
            // ok handler
            () : void => {
                closeDialog(dialog);

                const value : string = getInputFieldValue(dialog);

                resolve(value);
            },
            // cancel handler
            () : void => {
                closeDialog(dialog);

                resolve(null);
            },
        );

        openDialog(dialog, () : void => {
            const inputField : HTMLInputElement = getInputField(dialog) !;

            inputField.focus();
            inputField.select();
        });
    });
};

const dialog = {
    'alert': alertDialog,
    'confirm': confirmDialog,
    'prompt': promptDialog,
};

export {
    dialog as default,
    dialog as dialog,
};

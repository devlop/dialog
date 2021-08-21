'use strict';

const template = `
    <div data-dialog-backdrop>
        <div data-dialog="{type}" tabindex="-1" role="dialog">
            <form>
                <header>
                    <span>{title}</span>
                    <button type="button" data-role="close"></button>
                </header>
                <section class="message">
                    <span>{message}</span>
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
    type? : string;
    required? : boolean;
    // placeholder? : string;
    // min? : number;
    // step? : number;
    // pattern? : string;
    // and more...
}

type TabbableElement = HTMLAnchorElement | HTMLButtonElement | HTMLInputElement;

const makeDialog = (
    type : string,
    message : string,
    options : DialogOptionsInterface,
) : HTMLElement => {
    let dialogHTML = template;

    const title : string = options.title ?? '';
    const cancelText : string = 'Cancel';
    const okText : string = 'Ok';

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
        // set any input attributes.
        inputField.type = inputAttributes.type ?? inputField.type;
        inputField.required = inputAttributes.required ?? false;
    }

    return dialog;
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

const openDialog = (dialog : HTMLElement) : void => {
    document.body.appendChild(dialog);
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

        openDialog(dialog);
        focusOkButton(dialog);

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
        )
    });
};

const confirmDialog = (
    message? : string | undefined | null,
    options : ConfirmDialogOptionsInterface = {},
) : Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) : void => {
        const dialog = makeConfirmDialog(message ?? '', options);

        openDialog(dialog);
        focusOkButton(dialog);

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
        )
    });
};

const promptDialog = (
    message? : string | undefined,
    _default? : string | undefined | null,
    options : PromptDialogOptionsInterface = {},
) : Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) : void => {
        const dialog = makePromptDialog(message ?? '', _default ?? '', options);

        openDialog(dialog);

        const inputField : HTMLInputElement = getInputField(dialog) !;

        inputField.focus();
        inputField.select();

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
        )
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

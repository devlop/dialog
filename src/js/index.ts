'use strict';

const template = `
    <div data-dialog-backdrop>
        <div data-dialog="{type}" tabindex="-1" role="dialog">
            <header>
                <span>{title}</span>
                <button type="button" data-role="cancel"></button>
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
                <button data-role="cancel">{cancelText}</button>
                <button data-role="ok">{okText}</button>
            </footer>
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

interface AlertDialogOptionsInterface {
    okText? : string;
}

interface ConfirmDialogOptionsInterface {
    cancelText? : string;
    okText? : string;
}

interface PromptDialogOptionsInterface {
    cancelText? : string;
    okText? : string;
    // input? : InputAttributesInterface;
}

interface InputAttributesInterface {
    // type? : string;
    // required? : boolean;
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
    options : DialogOptionsInterface,
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
    options : DialogOptionsInterface,
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
    options : DialogOptionsInterface,
) : HTMLElement => {
    const dialog = makeDialog(
        'prompt',
        message,
        options,
    );

    setInputFieldValue(dialog, _default);

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

    // close the dialog (cancel) when any cancel button is clicked
    (dialog.querySelectorAll('[data-role="cancel"]') as NodeListOf<HTMLButtonElement>).forEach((cancelButton : HTMLButtonElement) : void => {
        cancelButton.addEventListener('click', (event : MouseEvent) : void => {
            cancelCallback.apply(null);
        });
    });

    // close the dialog (ok) when any ok button is clicked
    (dialog.querySelector('[data-role="ok"]') as HTMLButtonElement).addEventListener('click', (event : MouseEvent) : void => {
        okCallback.apply(null);
    });

    // close the dialog (ok) if enter is pressed while input field is focused
    const inputField : HTMLInputElement | null = getInputField(dialog);

    if (inputField !== null) {
        inputField.addEventListener('keydown', (event : KeyboardEvent) : void => {
            if (event.key === 'Enter') {
                okCallback.apply(null);
            }
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

const focusInputField = (dialog : HTMLElement) : void => {
    const inputField : HTMLInputElement | null = getInputField(dialog);

    if (inputField === null) {
        return;
    }

    inputField.focus();
    inputField.setSelectionRange(0, inputField.value.length);
};

const setInputFieldValue = (dialog : HTMLElement, value : string) : void => {
    const inputField = getInputField(dialog);

    if (inputField !== null) {
        inputField.value = value;
    }
};

const getInputFieldValue = (dialog : HTMLElement) : string => {
    return getInputField(dialog)?.value ?? '';
};

const alertDialog = (
    message? : string | undefined | null,
    options : DialogOptionsInterface = {},
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
    options : DialogOptionsInterface = {},
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
    options : DialogOptionsInterface = {},
) : Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) : void => {
        const dialog = makePromptDialog(message ?? '', _default ?? '', options);

        openDialog(dialog);
        focusInputField(dialog);

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

import { dialog } from '@devlop-ab/dialog';

const alertExamples : {[key: string] : Array<any>} = {
    '#alert-with-title': ['Your changes have been saved.', {
        title: 'Saved',
    }],
    '#alert-with-custom-button-text': ['Your changes have been saved.', {
        title: 'Saved',
        okText: 'Alright!',
    }],
};

const confirmExamples = {
    '#confirm-with-custom-buttons': [`Delete the file "passwords.txt"?`, {
        title: 'Delete',
        okText: 'Yes',
        cancelText: 'No',
    }],
    '#confirm-with-prefocused-cancel-button': [`Delete the file "passwords.txt"?`, {
        title: 'Delete',
        focus: 'cancel',
    }],
};

const promptExamples = {
    '#prompt-with-default-value': ['Glory?', 'Hammer!'],
    '#prompt-with-placeholder': ['Enter your name', '', {
        title: 'Your name',
        input: {
            placeholder: 'Your full name please',
        },
    }],
    '#prompt-with-required-input': ['Enter your name', '', {
        title: 'Your name',
        input: {
            required: true,
        },
    }],
    '#prompt-with-custom-buttons': ['Please give us your name', '', {
        title: 'Your name',
        okText: 'Sure',
        cancelText: 'No, it\'s a secret',
    }],
    '#prompt-with-email-input': ['Enter your email', '', {
        title: 'Your Email',
        input: {
            type: 'email',
            required: true,
        },
    }],
    '#prompt-with-date-input': ['Enter your birthday', '', {
        title: 'Your Birthday',
        input: {
            type: 'date',
        },
    }],
    '#prompt-with-number-input-natural-between-50-99': ['Enter a natural number between 50 and 99', '', {
        title: 'Natural numbers',
        input: {
            type: 'number',
            required: true,
            min: 50,
            max: 99,
            step: 1,
        },
    }],
    '#prompt-with-minimum-and-maximum-length-requirements': ['Enter a single word with a length between 4 and 9 letters.', '', {
        title: 'A single word',
        input: {
            type: 'text',
            placeholder: 'Letters only (a-z), no other characters.',
            required: true,
            minLength: 4,
            maxLength: 9,
            pattern: '[a-z]+',
        },
    }],
};

Object.keys(alertExamples).forEach((alertExampleId : string) : void => {
    (document.querySelector(alertExampleId) as HTMLButtonElement | null)?.addEventListener('click', async (event : MouseEvent) : Promise<void> => {
        // @ts-ignore
        await dialog.alert.apply(null, alertExamples[alertExampleId]);
    });
});

Object.keys(confirmExamples).forEach((confirmExampleId : string) : void => {
    (document.querySelector(confirmExampleId) as HTMLButtonElement | null)?.addEventListener('click', async (event : MouseEvent) : Promise<void> => {
        // @ts-ignore
        const result = await dialog.confirm.apply(null, confirmExamples[confirmExampleId]);

        const output : HTMLElement | null = document.querySelector('#' + (event.target as HTMLElement).id + ' + code');

        if (output !== null) {
            output.innerText = result === true
                ? 'true'
                : 'false';
        }
    });
});

Object.keys(promptExamples).forEach((promptExampleId : string) : void => {
    (document.querySelector(promptExampleId) as HTMLButtonElement | null)?.addEventListener('click', async (event : MouseEvent) : Promise<void> => {
        // @ts-ignore
        const result = await dialog.prompt.apply(null, promptExamples[promptExampleId]);

        const output : HTMLElement | null = document.querySelector('#' + (event.target as HTMLElement).id + ' + code');

        if (output !== null) {
            output.innerText = result !== null
                ? `"${result}"`
                : 'null';
        }
    });
});

import { dialog } from '@devlop-ab/dialog';

(document.querySelector('#alert-with-title') as HTMLButtonElement | null)?.addEventListener('click', async (event : MouseEvent) : Promise<void> => {
    await dialog.alert('Your changes have been saved.', {
        title: 'Saved',
    });
});

(document.querySelector('#alert-with-custom-button-text') as HTMLButtonElement | null)?.addEventListener('click', async (event : MouseEvent) : Promise<void> => {
    await dialog.alert('Your changes have been saved.', {
        title: 'Saved',
        okText: 'Alright!',
    });
});

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

<p align="center">
    <a href="https://www.npmjs.org/package/@devlop-ab/dialog"><img src="https://img.shields.io/npm/v/@devlop-ab/dialog.svg" alt="Latest Stable Version"></a>
    <a href="https://github.com/devlop/komponent/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

<p align="center">
    <img src="/assets/example.png" alt="Example of a confirm dialog" width="450">
</p>

# dialog

Lightweight and accessible drop-in replacement for the built-in browser dialog methods 
[alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), 
[confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) and 
[prompt](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt).

# Installing

using npm

```bash
npm install @devlop-ab/dialog
```

# Usage

All methods are compatible with the standard dialog methods and accept the same arguments, 
plus an additional `options` argument to change basic dialog appearance and behaviour.

All methods returns a promise, so by using await we can mimic the built in behaviour of 
halting execution of the current function while waiting for the dialog response.

```javascript
import { dialog } from '@devlop-ab/dialog';

// alert (no return value)
await dialog.alert('Hello world!');

// confirm (returns true or false)
const result = await dialog.confirm('Do you really want to leave?');

// prompt (returns string or null if cancelled)
const result = await dialog.prompt('Are you feeling lucky?', 'sure');
```

## Dialog options

All dialog methods accept an (optional) options argument where you can do basic configuration changes.

```javascript
// all options are optional
{
    'title': 'Title of the dialog',
    'okText': 'Yes',
    'cancelText': 'No',
    'focus': 'cancel',
}

// examples
await dialog.alert('I\'m afraid i can\'t do that Dave.', {
    'title': 'HAL',
});

const result = await dialog.confirm('Do you really want to leave?', {
    'okText': 'Yes', 
    'cancelText': 'No',
});
```

## Styles 

The javascript does not output any styles, you must include them in your css/sass build.

**Using SASS** 

```scss
// importing using sass
@import '@devlop-ab/dialog/dist/css/sky.css';
```

**Using vanilla CSS** 

Copy the css file you want to use from the `node_modules/@devlop-ab/dialog/dist/css` directory and put it with your other assets.

## Customizing the CSS

Each theme exposes a plethora of css variables allowing you to change colors, fonts and padding without overriding any css.

```scss
// importing using sass
@import '@devlop-ab/dialog/dist/css/sky.css';

[data-dialog] {
    --cancel-button-color: red;
}
```

<p align="center">
    <a href="https://www.npmjs.org/package/@devlop-ab/dialog"><img src="https://img.shields.io/npm/v/@devlop-ab/dialog.svg" alt="Latest Stable Version"></a>
    <a href="https://github.com/devlop/komponent/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

# dialog

Modern drop-in replacement for native dialog methods 
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
plus an additional `options` argument to modify the dialog.

```javascript
import { dialog } from '@devlop-ab/dialog';

// alert (no return value)
dialog.alert('Hello world!');

// confirm (returns true or false)
const result = dialog.confirm('Do you really want to leave?');

// prompt (returns string or null)
const result = dialog.prompt('Are you feeling lucky?', 'sure');
```

It is also possible to import a single method instead of the whole dialog class.

```javascript
import { alert } from '@devlop-ab/dialog';
import { confirm } from '@devlop-ab/dialog';
import { prompt } from '@devlop-ab/dialog';
```

## Dialog options

All dialog methods accept an (optional) options argument where you can do basic configuration changes.

```javascript
{
    'title': 'Title of the dialog',
}
```

It's not possible to change the design (such as hiding the header) using the options, 
to change the design you need to customize the styles.

## Styles 

The javascript does not output any styles, you must include them in your css/sass build.

**Using SASS** 

```sass
// to get the default theme.
@import '@devlop-ab/dialog/css';

// or choose another theme.
@import '@devlop-ab/dialog/css/windows-xp';
@import '@devlop-ab/dialog/css/pink';
```

**Using vanilla CSS** 

Copy the css file you want to use from the `node_modules/@devlop-ab/dialog/css` directory and put it with your other assets.

## Customize the design.

It's easiest to customize the design by importing the theme you want to use and then 
declaring your own css to change the parts you want to change.

If you do major design changes it's recommended to copy the theme instead and changing what you want.

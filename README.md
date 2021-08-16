<p align="center">
    <a href="https://www.npmjs.org/package/@devlop-ab/dialog"><img src="https://img.shields.io/npm/v/@devlop-ab/dialog.svg" alt="Latest Stable Version"></a>
    <a href="https://github.com/devlop/komponent/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

# dialog

Modern drop-in replacement for native dialog methods [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), 
[confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) and [prompt](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt).

# Installing

using npm

```bash
npm install @devlop-ab/dialog
```

# Usage

All methods are compatible with the standard dialog methods and accept the same arguments, plus an additional `options` argument to modify the dialog.

```javascript
import { dialog } from '@devlop-ab/dialog';

// alert (no return value)
dialog.alert('This is an alert!');

// confirm (returns true or false)
const result = dialog.confirm('Are you sure?');

// prompt (returns string or null)
const result = dialog.prompt('Please enter your name', 'Johan');
```

It is also possible to import a single method instead of the whole dialog class.

```javascript
import { alert } from '@devlop-ab/dialog';
import { confirm } from '@devlop-ab/dialog';
import { prompt } from '@devlop-ab/dialog';
```
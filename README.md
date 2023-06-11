<div style="text-align:center">

![logo](docs/assets/logo_white.webp#gh-dark-mode-only)
![logo](docs/assets/logo.webp#gh-light-mode-only)

</div>


> An easy Way For You to Convert WhatsApp Markdown to HTML.
>
> Inspired by [Drawdown](https://github.com/adamvleggett/drawdown) &copy; Adam Leggett 
## Install

### NPM

```
npm i --save @wayfu/waydown
```

In your app.js import and initialized the module like normal.

```js
import Waydown from "@wayfu/waydown";
```

### Vanilla

If you wish to skip the modular build and NOT use npm you can use the vanilla build like so:

### CDN

```html
<script src="https://unpkg.com/@wayfu/waydown@latest/dist/index.min.js"></script>
```

## How to use it:

```js
let text = "This is a sample text to test *Waydown*."

element.innerHTML = Waydown(text)
```
Almost all WhatsApp _markdown_ key supported like `*bold*`, `_italic_`, `*_bold italic_*`, `~strikethrough~`, and \`code\`.
Also support converting _link like_ string to HTML link element.
### Options
Waydown accept second parameter for options. It can be a `object` or `boolean`. For the object type parameter, we're using [`elemenOptions`](https://github.com/wayfu-id/wayfu-dom/blob/main/README.md#2-creating-elements) from [@wayfu/wayfu-dom](https://github.com/wayfu-id/wayfu-dom/), you can check there. We just add 1 property `plain` which accept `boolean` value.

For the `boolean` value itself is the `plain` property value. If this value sets to `true`, the return is same as the input `text`. This is usefull if you working at WYISWYG editor for WhatsApp markdown.
```ts
type WaydownOption = {
    plain: boolean,
} & elemenOptions;

function Waydown(text: string, plain?: boolean): string
function Waydown(text: string, opt?: WaydownOption): string
```
For the `elementOption` as `WaydownOption` will only be set at the *main* element. The main element tag will be `div` by default.

## TypeScript

This library comes with TypeScript "typings". If you happen to find any bugs in those, create an issue.

## License
Copyright &copy; 2023 [Wayfu](https://github.com/wayfu-id) under [ISC](LICENSE) License
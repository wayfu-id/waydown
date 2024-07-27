import DOM from "@wayfu/wayfu-dom";

declare global {
    interface Window {
        DOM?: DOM;
    }
}

export type WaydowOptions = {
    plain: boolean;
} & DOM.elementOptions;

declare class Waydown extends Function {
    readonly VERSION: string;
}

type eleOptions = {
    [k: string]: string | boolean | number;
} & DOM.elementOptions;

/**
 * Waydown : A WhatsApp markdown/Format decoder
 *
 * Inspired by Drawdown (c) Adam Leggett
 * https://github.com/adamvleggett/drawdown
 * @param source
 * @param options
 */
function Waydown(source: string): string;
function Waydown(source: string, options?: boolean): string;
function Waydown(source: string, options?: boolean | WaydowOptions) {
    options = options ?? false;
    const _dom = window.DOM ? window.DOM : document;

    const { tag, plain, ...prop }: WaydowOptions = ((o) => {
        if (typeof o === "boolean") {
            return { tag: "div", plain: o };
        }
        return o;
    })(options);

    /**
     * Create HTML elemenet and return it's `outerHTML` value
     * @param tag
     * @param content
     * @param opt
     */
    const element = (tag: string, content: string, opt?: eleOptions) => {
        if (_dom instanceof Document) {
            let element = _dom.createElement(tag);
            element.innerHTML = content;

            for (let attr in opt) {
                element.setAttribute(attr, JSON.stringify(opt[attr]));
            }

            return element.outerHTML;
        }

        let props = Object.assign({ tag, html: content }, opt) as DOM.elementOptions,
            { first } = _dom.create(props);

        return first ? first.outerHTML : "";
    };

    /**
     * Set HMTL tag highlighter to input content
     * @param content
     */
    const highlight = (content: string): string => {
        if (plain) return content;

        return content.replace(
            /(^|[^A-Za-z\d\\])(([*])|(_)|(~)|`)(\2?)([^<]*?)\2\6(?!\2)(?=\W|_|$)/g,
            (all, _, p1, bold, italic, strike, mono, cont) => {
                const tag = ((b, i, s, c) => {
                    return c ? "code" : b ? "strong" : i ? "em" : s ? "s" : "";
                })(bold, italic, strike, mono);

                const newContent = (mono: string) => {
                    return highlight(mono ? cont.replace(/`/g, "") : cont);
                };

                return `${_}${element(tag, newContent(mono))}`;
            }
        );
    };

    /**
     * Get `raw` string from input content
     * @param newContent
     */
    const raw = (content: string): string => {
        return highlight(content).replace(/\\([\\\|`*_{}\[\]()#+\-~])/g, "$1");
    };

    /**
     * Create paragraph element upon every paragraph string
     * @param content
     * @param tag
     * @param prop
     */
    const paragraph = (content: string, tag?: string, prop?: eleOptions): string => {
        if (plain) return content;
        let _tag = tag ?? "div";

        return content.replace(/(?=^|\n)(\s+)*([^<]+?)[\n\s]*(?=<|\n|$)/g, (all, _, cont) => {
            _ = _ ? _.replace(/\n/, "<br/>") : "";
            return `${_}${element(_tag, raw(cont), prop)}`;
        });
    };

    /**
     * Chreate link element upon every `link like` string
     * @param content
     * @returns
     */
    const link = (content: string): string => {
        if (plain) return content;

        return content.replace(
            /(?:(http(?:s)?)?:\/\/)?((?:([a-z\d-]+?)\.([\.a-z]{2,}?))|((?:[\.\d]{1,3}?){4}?))(\:\d+)?((?:\/[-a-z\d%_.~+]*?)*?)(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?(?=$|\s|\n|<)/gi,
            (m, ...g) => {
                let [proc, domain] = g;
                return element("a", m, {
                    href: m,
                    title: domain,
                    alt: domain,
                    target: "_blank",
                });
            }
        );
    };

    return link(paragraph(source, tag, prop)).trim();
}

Object.defineProperties(Waydown, {
    VERSION: {
        value: __VERSION__,
        enumerable: true,
        writable: false,
    },
});

export default Waydown;

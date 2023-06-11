import DOM from "@wayfu/wayfu-dom";

/**
 * @typedef {{
 *  plain: boolean,
 * } & import("@wayfu/wayfu-dom").elemenOptions} WaydownOptions
 */

/**
 * Waydown : A WhatsApp markdown/Format decoder
 *
 * Inspired by Drawdown (c) Adam Leggett
 * https://github.com/adamvleggett/drawdown
 *
 * @type {{
 *  (source: string) => string;
 *  (source: string, plain?: boolean) => string;
 *  (source: string, options?: WaydownOptions) => string
 * }}
 */
const Waydown = function (source, options = {}) {
    const { tag, plain, ...prop } = ((o) => {
        if (typeof o === "boolean") {
            return { tag: "div", plain: o };
        }
        return o;
    })(options);

    /**
     * Create HTML elemenet and return it's `outerHTML` value
     * @param {string} tag
     * @param {string} content
     * @param {{ [k: string]: string | number | boolean }} opt
     * @returns
     */
    const element = (tag, content, opt = {}) => {
        let props = Object.assign({ tag, html: content }, opt);
        return DOM.create(props).first.outerHTML;
    };

    /**
     * Set HMTL tag highlighter to input content
     * @param {string} content
     * @returns
     */
    const highlight = (content) => {
        if (plain) return content;

        return content.replace(
            /(^|[^A-Za-z\d\\])(([*])|(_)|(~)|`)(\2?)([^<]*?)\2\6(?!\2)(?=\W|_|$)/g,
            (all, _, p1, bold, italic, strike, mono, cont) => {
                const tag = ((b, i, s, c) => {
                    return c ? "code" : b ? "strong" : i ? "em" : s ? "s" : "";
                })(bold, italic, strike, mono);

                const newContent = (mono) => {
                    return highlight(mono ? cont.replace(/`/g, "") : cont);
                };

                return `${_}${element(tag, newContent(mono))}`;
            }
        );
    };

    /**
     * Get `raw` string from input content
     * @param {string} content
     * @returns
     */
    const raw = (content) => {
        return highlight(content).replace(/\\([\\\|`*_{}\[\]()#+\-~])/g, "$1");
    };

    /**
     * Create paragraph element upon every paragraph string
     * @param {string} content
     * @param {string} tag
     * @param {{[k: string]: string | number | boolean}} prop
     * @returns
     */
    const paragraph = (content, tag = "div", prop = {}) => {
        if (plain) return content;

        return content.replace(
            /(?=^|\n)(\s+)*([^<]+?)[\n\s]*(?=<|\n|$)/g,
            (all, _, cont) => {
                _ = _ ? _.replace(/\n/, "<br/>") : "";
                return `${_}${element(tag, raw(cont), prop)}`;
            }
        );
    };

    /**
     * Chreate link element upon every `link like` string
     * @param {string} content
     * @returns
     */
    const link = (content) => {
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
};

export default Waydown;

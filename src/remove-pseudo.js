/**
 *
 * Forked by BANO.notIT on 20.04.19 from https://github.com/uncss/uncss/blob/4816231bddb1d86a94552be1881ec4d01e4cac15/src/lib.js#L11
 */

const postcssSelectorParser = require('postcss-selector-parser')

module.exports = (function () {
    const ignoredPseudos = [
            /* link */
            ':link', ':visited',
            /* user action */
            ':hover', ':active', ':focus', ':focus-within',
            /* UI element states */
            ':enabled', ':disabled', ':checked', ':indeterminate',
            /* form validation */
            ':required', ':invalid', ':valid',
            /* pseudo elements */
            '::first-line', '::first-letter', '::selection', '::before', '::after',
            /* pseudo classes */
            ':target',
            /* CSS2 pseudo elements */
            ':before', ':after',
            /* Vendor-specific pseudo-elements:
             * https://developer.mozilla.org/ja/docs/Glossary/Vendor_Prefix
             */
            '::?-(?:moz|ms|webkit|o)-[a-z0-9-]+'
        ],
        // Actual regex is of the format: /^(:hover|:focus|...)$/i
        pseudosRegex = new RegExp('^(' + ignoredPseudos.join('|') + ')$', 'i')

    function transform(selectors) {
        selectors.walkPseudos((selector) => {
            if (pseudosRegex.test(selector.value)) {
                selector.remove()
            }
        })
    }

    const processor = postcssSelectorParser(transform)

    return function (selector) {
        return processor.processSync(selector)
    }
}())

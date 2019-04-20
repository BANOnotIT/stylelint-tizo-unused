/**
 * Created by BANO.notIT on 31.08.17.
 * @flow
 */

const stylelint = require('stylelint')
const resolveSelector = require('postcss-resolve-nested-selector')
const isValidGlob = require('is-valid-glob')
const isAbsoluteUrl = require('is-absolute-url')

const getPage = require('./getPage')

type Options = {
    pages: Array<string>
}

const ruleName = 'tizo/unused'
const messages = stylelint.utils.ruleMessages(ruleName, {
    invalidPage: path => `Path '${path}' is neither URL nor Glob`,
    unused: selector => `Selector '${selector}' never used on defined pages`
})

function pagesContainSelector(pages: Document[], selector: string) {
    return pages.some(page =>
        page.querySelector(selector) !== null
    )
}

module.exports = stylelint.createPlugin(ruleName, function (options: Options) {


    return function (root, result) {
        // console.log(result)
        const validOptions = stylelint.utils.validateOptions(result, ruleName, {
            actual: options,
            possible: {
                pages: page => typeof page === 'string'
            }
        }) && (() => {

            const {pages} = options

            let noErrors = true

            pages.forEach(page => {
                if (isAbsoluteUrl(page) || isValidGlob(page))
                    return

                noErrors = false
                result.warn(messages.invalidPage(page))
            })

            return noErrors
        })()


        if (!validOptions) {
            return
        }


        return Promise
            .all(options.pages.map(page => getPage(page).catch(msg => result.warn(msg))))
            .then(pages => {
                pages = pages.filter(page => page)
                return pages
            })
            .then((pages) => {
                root.walkRules(rule => {
                    rule.selectors.forEach(selector => {
                        resolveSelector(selector, rule)
                            .forEach(
                                selector => {
                                    if (!pagesContainSelector(pages, selector)) {
                                        stylelint.utils.report({
                                            node: rule,
                                            message: messages.unused(selector),
                                            result
                                        })
                                    }
                                }
                            )
                    })
                })
            })
            .catch(err => {
                // eslint-disable-next-line no-console
                console.log(err)
            })

    }
})

module.exports.ruleName = ruleName
module.exports.messages = messages

/**
 * @flow
 * Created by BANO.notIT on 20.04.19.
 */

const jsdom = require('jsdom')
const fs = require('fs')
const request = require('request')
const messages = require('./messages')
const isAbsoluteUrl = require('is-absolute-url')
const glob = require('glob')

module.exports = (page: string): Promise<Document> => new Promise(
    (done, fail) => {
        if (!isAbsoluteUrl(page)) {
            glob(page, (err, files) => {
                if (err) {
                    return fail(messages.pageReadFail(page, err))
                }

                if (!files) {
                    return fail(messages.fileNotFound(page))
                }

                files.forEach(file =>
                    fs.readFile(file, (err, content) => {
                        if (err) {
                            return fail(messages.pageReadFail(page, err))
                        }
                        done(new jsdom.JSDOM(content))
                    })
                )
            })
        } else {
            request(page, (err, res, content) => {
                if (err) {
                    return fail(messages.pageLoadFail(page, err))
                }
                if (res.statusCode !== 200) {
                    return fail(messages.pageBadStatus(page, res.statusCode))
                }
                return done((new jsdom.JSDOM(content)).window.document)
            })
        }
    }
)

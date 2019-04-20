// @flow


module.exports = {
    pageLoadFail(page: string, err: Error) {
        return `Error while loading page '${page}':\n${err.toString()}`
    },
    pageBadStatus(page: string, status: number) {
        return `Page '${page}' resulted with inappropriate status: ${status} != 200`
    },
    pageReadFail(page: string, error: Error) {
        return `Error while reading '${page}':\n${error.toString()}`
    }
}

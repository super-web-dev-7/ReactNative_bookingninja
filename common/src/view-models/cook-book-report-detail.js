export default class CookBookReportDetailVM {

    constructor(userStore, salesforceApi, cookBook) {
        this.userStore = userStore
        this.salesforceApi = salesforceApi
        this.cookBook = cookBook
    }
}

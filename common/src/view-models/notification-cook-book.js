import PaginationStore from "../stores/pagination";
import CookBook from "../stores/models/cook-book";
import {action, computed, observable} from "mobx";

export default class NotificationCookBookVM {
    @observable
    search = ''
    dataRequest = PaginationStore(CookBook).create()

    constructor(userStore, salesforceApi) {
        this.userStore = userStore
        this.salesforceApi = salesforceApi
        this.requestData(true)
    }

    @action
    updateSearch = newData => {
        this.search = newData.trim()
    }

    requestData(withRefreshing = false) {
        this.dataRequest.requestList(
            (nextUrl) => this.salesforceApi.paginationQuery(this.userStore,
                this.salesforceApi.QUERY_COOK_BOOKS, nextUrl),
            withRefreshing)
    }

    @computed
    get data() {
        const data = this.dataRequest.data
        if (!data || this.search.length === 0) return data
        const search = this.search.toLowerCase()

        return data.filter(item => item.Name.toLowerCase().startsWith(search))
    }
}

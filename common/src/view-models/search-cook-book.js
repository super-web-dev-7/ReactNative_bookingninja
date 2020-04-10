import PaginationStore from "../stores/pagination";
import {action, computed, observable} from "mobx";
import RequestStore from "../stores/request";
import * as querystring from "query-string";
import CookBook from "../stores/models/cook-book";
import moment from "moment";


export default class SearchCookBookVM {

    @observable
    filterHasPhone = false
    @observable
    cachedFilterHasPhone = this.filterHasPhone
    @observable
    filterCallType
    @observable
    cachedFilterCallType = this.filterCallType
    @observable
    filterInterestLevel
    @observable
    cachedFilterInterestLevel = this.filterInterestLevel
    @observable
    filterAccountExecutive
    @observable
    cachedFilterAccountExecutive = this.filterAccountExecutive
    @observable
    filterStartDate
    @observable
    cachedFilterStartDate = this.filterStartDate
    @observable
    filterEndDate
    @observable
    cachedFilterEndDate = this.filterEndDate


    cookBooksRequest = PaginationStore(CookBook).create()
    filterInfoRequest = RequestStore().create()

    constructor(userStore, salesforceApi) {
        this.userStore = userStore
        this.salesforceApi = salesforceApi
        this.requestFilterInfo()
        this.requestCookBooks(true)
    }

    requestFilterInfo = () => {
        this.filterInfoRequest.setIsLoading()

        this.salesforceApi.multiRequests(this.userStore,
            {
                method: "GET",
                url: `${this.salesforceApi.VERSION}/query/?${querystring.stringify({q: this.salesforceApi.QUERY_ACCOUNT_EXECUTIVE})}`,
            })
            .then(this.filterInfoRequest.setData)
            .catch(this.filterInfoRequest.setError)
    }

    @computed
    get filterAccountExecutiveData() {
        return this.filterInfoRequest.data && this.filterInfoRequest.data[0].records
    }

    requestCookBooks(withRefreshing = false) {
        let filter
        if (this.filterHasPhone || this.filterCallType || this.filterInterestLevel || this.filterAccountExecutive || this.filterStartDate || this.filterEndDate) {
            const filterList = []
            if (this.filterHasPhone) {
                filterList.push(`(Mobile__c != null OR Phone__c != null OR X2nd_Phone__c != null)`)
            }
            if (this.filterCallType) {
                filterList.push(`Call_Result__c = '${this.filterCallType}'`)
            }
            if (this.filterInterestLevel) {
                filterList.push(`Interest_Level__c = '${this.filterInterestLevel}'`)
            }
            if (this.filterAccountExecutive) {
                filterList.push(`Account_Executive__c = '${this.filterAccountExecutive.Id}'`)
            }
            if (this.filterStartDate) {
                filterList.push(`Scheduled_Date__c >= ${moment(this.filterStartDate).format('YYYY-MM-DD')}`)
            }
            if (this.filterEndDate) {
                filterList.push(`Scheduled_Date__c <= ${moment(this.filterEndDate).format('YYYY-MM-DD')}`)
            }

            filter = ` WHERE ${filterList.join(' AND ')}`
        }
        this.cookBooksRequest.requestList(
            (nextUrl) => this.salesforceApi.paginationQuery(this.userStore,
                `${this.salesforceApi.QUERY_COOK_BOOKS}${filter || ''}`, nextUrl).then(data => {
                this.cacheFilter()
                return data
            }),
            withRefreshing)
    }

    @action
    cacheFilter() {
        this.cachedFilterHasPhone = this.filterHasPhone
        this.cachedFilterCallType = this.filterCallType
        this.cachedFilterInterestLevel = this.filterInterestLevel
        this.cachedFilterAccountExecutive = this.filterAccountExecutive
        this.cachedFilterStartDate = this.filterStartDate
        this.cachedFilterEndDate = this.filterEndDate
    }

    @computed
    get isFilterChange() {
        return this.filterHasPhone !== this.cachedFilterHasPhone ||
            this.filterCallType !== this.cachedFilterCallType ||
            this.filterInterestLevel !== this.cachedFilterInterestLevel ||
            this.filterAccountExecutive !== this.cachedFilterAccountExecutive ||
            this.filterStartDate !== this.cachedFilterStartDate ||
            this.filterEndDate !== this.cachedFilterEndDate
    }

    @action
    changeAccountExecutive = (index) => {
        this.filterAccountExecutive = this.filterAccountExecutiveData && this.filterAccountExecutiveData[index]
    }

    @action
    changeCallResultType = (index, selectedCallType) => {
        this.filterCallType = selectedCallType
    }

    @action
    changeInterestLevel = (index, selectedInterestLevel) => {
        this.filterInterestLevel = selectedInterestLevel
    }

    @action
    switchFilterHasPhone = () => {
        this.filterHasPhone = !this.filterHasPhone
    }

    @action
    changeStartDate = (selectedDate) => {
        this.filterStartDate = selectedDate
    }

    @action
    changeEndDate = (selectedDate) => {
        this.filterEndDate = selectedDate
    }
}

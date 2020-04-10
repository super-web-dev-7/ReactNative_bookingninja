import * as querystring from "query-string";
import axios from "axios";
import MultiError from "./multi-error";
import handleError from "./handle-error";
import getAccessToken, {HEADER_KEY} from "./get-access-token";
import {ENV} from "../../env_vars";

export const TEST_END_POINT = ENV['TEST_END_POINT']
export const PRODUCTION_END_POINT = ENV['PRODUCTION_END_POINT']

// TODO: Switch to schema generators
export default class SalesforceApi {
    UNIT_PARAMETERS = "Id, Name, Property__c, Status__c, LastModifiedDate"
    CONTACT_PARAMETERS = 'Id, Name, Email, Phone, Salutation'
    COOK_BOOK_PARAMETERS = 'Id, Name, Account_Executive__r.Name, Interest_Level__c, Call_Result__c,' +
        'Scheduled_Date__c, Contact__r.Phone, Contact__r.Salutation, Contact__r.Name,' +
        'Contact__r.LinkedIN__c, Contact__r.Account.Name,' +
        'Contact__r.Email, Contact__r.Id, Title__c, Mobile__c, Phone__c,' +
        'X2nd_Phone__c, Scheduled_Time__c, Type__c, Record_Call__c, CreatedBy.Name'
    ACCOUNT_EXECUTIVE_PARAMETERS = 'Id, Email__c'
    VERSION = "v42.0"

    QUERY_DIRTY_UNIT = `SELECT ${this.UNIT_PARAMETERS} FROM Unit__c WHERE Status__c = \'Dirty\' ORDER BY LastModifiedDate DESC`
    QUERY_CLEAN_UNIT = `SELECT ${this.UNIT_PARAMETERS} FROM Unit__c WHERE Status__c = \'Clean\' ORDER BY LastModifiedDate DESC`
    QUERY_CONTACTS = `SELECT ${this.CONTACT_PARAMETERS} FROM Contact`
    QUERY_COOK_BOOKS = `SELECT ${this.COOK_BOOK_PARAMETERS} FROM Cook_Book__c`
    QUERY_ACCOUNT_EXECUTIVE = `SELECT ${this.ACCOUNT_EXECUTIVE_PARAMETERS} FROM Account_Executive__c`

    CALL_RESULT_TYPES = {
        CONTACTED: 'Contacted',
        VOICE_MAIL: 'Voice Mail',
        CALL_BACKS: 'Call Backs',
        APPOINTMENTS: 'Appointments',
        SECOND_MEETINGS: '2nd Meetings',
        DEMO_OR_TRIAL: 'Demo/Trial',
        PROPOSAL: 'Proposal',
        CLOSE: 'Close'
    }
    INTEREST_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    PREFIX_DATA_VERSION = `/services/data/${this.VERSION}`

    async paginationQuery(userStore, query, nextUrl) {
        const response = await this.authorizedRequest(userStore, nextUrl ? nextUrl : `${this.PREFIX_DATA_VERSION}/query/?${querystring.stringify({q: query})}`);

        return {data: response.data.records, done: response.data.done, nextUrl: response.data.nextRecordsUrl};
    }

    async query(userStore, query) {
        const response = await this.authorizedRequest(userStore, `${this.PREFIX_DATA_VERSION}/query/?${querystring.stringify({q: query})}`);
        return response.data.records;
    }

    async updateData(userStore, type, id, fields, newData) {
        const response = await this.multiRequests(userStore,
            {
                method: "PATCH",
                url: `${this.VERSION}/sobjects/${type}/${id}`,
                richInput: newData,
            },
            {
                method: "GET",
                url: `${this.VERSION}/sobjects/${type}/${id}?fields=${fields}`,
            });

        return response[1];
    }

    async multiRequests(userStore, ...requests) {
        const response = await this.authorizedRequest(userStore, `${this.PREFIX_DATA_VERSION}/composite/batch`, "post",
            {
                batchRequests: [...requests]
            });

        if (response.data.hasErrors) {
            throw new MultiError(response.data);
        } else {
            return response.data.results.map(({result}) => result);
        }
    }

    async sendFeedback(userStore, type, id, formData, imageData) {
        return imageData ? this.authorizedRequest(userStore,
            `${this.PREFIX_DATA_VERSION}/sobjects/${type}/${id}`,
            "patch",
            formData).then(() => this.updateMultiPartData(userStore, id, imageData)) :
            this.updateMultiPartData(userStore, id, imageData)
    }

    async updateMultiPartData(userStore, id, formData) {
        return this.authorizedRequest(userStore,
            `${this.PREFIX_DATA_VERSION}/connect/files/users/me`,
            "post",
            formData)
            .then(({data}) => {
                console.tron.log(`DATA: ${JSON.stringify(data)}`)
                return this.authorizedRequest(userStore,
                    `${this.PREFIX_DATA_VERSION}/sobjects/ContentDocumentLink`,
                    "post",
                    {
                        ContentDocumentId: data.id,
                        LinkedEntityId: id,
                        ShareType: "V"
                    })
            })
    }

    async multiMultiPartRequests(userStore, ...requests) {
        const response = await this.authorizedRequest(userStore, `${this.PREFIX_DATA_VERSION}/composite/batch`, "post",
            {
                batchRequests: [...requests]
            },
            {
                'Content-Type': 'multipart/form-data'
            });

        if (response.data.hasErrors) {
            throw new MultiError(response.data);
        } else {
            return response.data.results.map(({result}) => result);
        }
    }

    async authorizedRequest(userStore, endpoint, method = "get", body = undefined, headers = {}) {
        const url = userStore.getSelectedOrgUrl() + endpoint;
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        headers['Accept'] = 'application/json';
        headers[HEADER_KEY] = await getAccessToken();
        const requestConfig = {method, url, headers, data: body}
        try {
            return await axios.request(requestConfig);
        } catch (e) {
            return await handleError(e, userStore, requestConfig)
        }
    }
};

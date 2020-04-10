import {types} from "mobx-state-tree";

const CookBook = types.model({
    Id: types.string,
    Name: types.string,
    Account_Executive__r: types.maybeNull(types.frozen()),
    Interest_Level__c: types.maybeNull(types.string),
    Call_Result__c: types.maybeNull(types.string),
    Scheduled_Date__c: types.maybeNull(types.string),
    Scheduled_Time__c: types.maybeNull(types.string),
    Contact__r: types.maybeNull(types.frozen()),
    Title__c: types.maybeNull(types.string),
    Mobile__c: types.maybeNull(types.string),
    Phone__c: types.maybeNull(types.string),
    X2nd_Phone__c: types.maybeNull(types.string),
    Type__c: types.maybeNull(types.string),
    Record_Call__c: types.optional(types.boolean, false),
    CreatedBy: types.frozen(),
})

export default CookBook

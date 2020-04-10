import moment from "moment";

export function getSalesforceTime(time) {
    return moment(time, 'hh:mm:ss')
}

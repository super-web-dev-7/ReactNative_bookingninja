import {types} from "mobx-state-tree";
import Contact from "./models/contact";
import GetEnv from "./env";
import PaginationStore from "./pagination";

const ContactStore = types.compose("ContactStore",
    GetEnv,

    types.model({
        contactList: PaginationStore(Contact)
    })
        .actions(self => ({
            requestContacts(userStore, withRefreshing = false) {
                self.contactList.requestList(
                    (nextUrl) => self.env.salesforceApi.paginationQuery(userStore,
                        self.env.salesforceApi.QUERY_CONTACTS, nextUrl),
                    withRefreshing)
            },
        }))
)

export default ContactStore
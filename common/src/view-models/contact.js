import {action, computed, observable} from "mobx";

const buildAlphabet = (records) => {
    const data = {}

    records.forEach((item) => {
        const letter = item.Name.charAt(0).toUpperCase();
        let list = data[letter];
        if (!list) {
            data[letter] = list = [];
        }
        list.push(item)
    });
    return data;
};

export default class ContactViewModel {

    @observable
    search = ''

    constructor(contactStore, userStore) {
        this.contactStore = contactStore

        if (contactStore.contactList.data.length === 0) {
            contactStore.requestContacts(userStore, true)
        }
    }

    @action
    setSearch = (search) => {
        this.search = search
    }

    @computed get sortedContactList() {
        let contactList = this.contactStore.contactList.data
        if (!contactList || contactList.length === 0) return null

        const searchLow = this.search.toLowerCase()
        if (searchLow.length > 0) {
            contactList = contactList.filter(item => item.Name.toLowerCase().indexOf(searchLow) !== -1)
        }
        return buildAlphabet(contactList)
    }
}

import {types} from "mobx-state-tree";
import ContactStore from "./contact";
import UserStore from "./user";

const RootStore = types.model({
    contactStore: types.optional(ContactStore, {}),
    userStore: types.optional(UserStore, {}),
})

export default RootStore
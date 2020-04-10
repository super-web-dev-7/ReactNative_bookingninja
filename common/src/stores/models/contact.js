import {types} from "mobx-state-tree";

const Contact = types.model({
    Name: types.string,
    Phone: types.maybeNull(types.string),
    Salutation: types.maybeNull(types.string),
    Email: types.maybeNull(types.string),
})

export default Contact

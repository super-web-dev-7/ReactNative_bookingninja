import {getEnv, types} from "mobx-state-tree";

const GetEnv = types.model()
    .volatile(self => ({
        env: getEnv(self)
    }))

export default GetEnv
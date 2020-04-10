import {types} from "mobx-state-tree";

export default function BaseRequestStore(dataType = types.frozen(), errorType = types.frozen()) {
    return types.model({
        data: dataType,
        isFetching: types.optional(types.boolean, false),
        error: errorType
    }).actions(self => ({
        setIsLoading() {
            self.isFetching = true
            self.error = null
        },
        setError(error) {
            self.isFetching = false
            self.error = error
        },
        setData(data) {
            self.isFetching = false
            self.data = data
        }
    }))
}

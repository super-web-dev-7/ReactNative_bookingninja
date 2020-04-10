import {flow, types} from "mobx-state-tree";
import BaseRequestStore from "./base-request";

/**
 *
 * @param propertyType mobx-state-tree type of list item
 * @returns {IModelType<ModelPropertiesDeclarationToProperties<{}>, {} & {requestList: (...args: any[][]) => Promise<FlowReturnType<any>>}, _NotCustomized, _NotCustomized>}
 * requestList - Use requestPromise method (async func with parameter nextUrl, await object with parameters data, nextUrl)
 *
 * @constructor
 */
export default function PaginationStore(propertyType) {
    return types.optional(
        types.compose('PaginationStore',
            BaseRequestStore(types.array(propertyType)),
            types.model({
                isRefreshFetching: types.optional(types.boolean, false)
            }).volatile(self => ({
                nextUrl: undefined,
            })).actions(self => ({
                requestList: flow(function* (requestPromise, withRefreshing) {
                    if (self.isFetching || (!withRefreshing && !self.canLoadNext)) return

                    try {
                        self.setIsLoading()
                        self.isRefreshFetching = !!withRefreshing

                        const newListData = yield requestPromise(withRefreshing ? undefined : self.nextUrl)

                        if (withRefreshing) {
                            self.setData(newListData.data)
                        } else {
                            self.data.push(...newListData.data)
                            self.setData(self.data)
                        }
                        self.nextUrl = newListData.nextUrl

                        self.isRefreshFetching = false
                    } catch (er) {
                        self.setError(er)
                        self.isRefreshFetching = false
                    }
                })
            })).views(self => ({

                get canLoadNext() {
                    return self.nextUrl
                }
            }))
        ), {})
}

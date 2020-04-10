import {types} from "mobx-state-tree";
import BaseRequestStore from "./base-request";


export default function RequestStore(dataType = types.frozen(), errorType = types.frozen()) {
    return types.optional(BaseRequestStore(dataType, errorType), {})
}

import {Actions} from "react-native-router-flux";
import axios from "axios";
import {HEADER_KEY} from "./get-access-token";
import getAccessToken from "./get-access-token";

//TODO Refactor all requests for stores
export default async function handleError(error, userStore, axiosConfig) {
    console.tron.log(JSON.stringify(error.response));

    if (error.response.status === 401) {
        await userStore.reLogin()
        if (userStore.loggedIn && (!userStore.email || !userStore.password)) {
            Actions.Login();
            throw error
        } else {
            if (axiosConfig.headers && axiosConfig.headers[HEADER_KEY]) {
                axiosConfig.headers[HEADER_KEY] = await getAccessToken()
            }
            return axios.request(axiosConfig)
        }
    } else throw error
}

import {Actions} from "react-native-router-flux";
import axios from "axios";
import {loadString} from "../../lib/storage";
import handleError from "./handle-error";
import {AUTH_KEYS} from "../../utils/keys";


export default class WaveApi {
    END_POINT = "https://tests.wave909.com"

    async sendMessage(userStore, to, message) {
        const token = await loadString(AUTH_KEYS.ACCESS_TOKEN);
        if (!token || token === '') {
            Actions.Login();
            throw new Error('Unauthorized');
        }

        return this.request(userStore, "/sendMessage", "post", {
            accessToken: token,
            to,
            body: message,
        })
    }

    async twilioAuth(userStore) {
        const token = await loadString(AUTH_KEYS.ACCESS_TOKEN);
        if (!token || token === '') {
            Actions.Login();
            throw new Error('Unauthorized');
        }
        const app = {
            test: 'sales',
            production: 'sales-prod'
        }[userStore.selectedOrg];

        return this.request(userStore, '/accessToken', 'post', {
            accessToken: token,
            app
        })
    }

    async request(userStore, endpoint, method = "get", body = undefined) {
        const url = this.END_POINT + endpoint;
        const headers = {};
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
        const requestConfig = {method, url, headers, data: body}
        try {
            return await axios.request(requestConfig);
        } catch (e) {
            return await handleError(error, userStore, requestConfig)
        }
    }
}

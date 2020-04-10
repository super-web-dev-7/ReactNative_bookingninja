import {loadString} from "../../lib/storage";
import {Actions} from "react-native-router-flux";
import {AUTH_KEYS} from "../../utils/keys";

export const HEADER_KEY = "Authorization"

export default async function getAccessToken() {
    const token = await loadString(AUTH_KEYS.ACCESS_TOKEN);
    if (!token || token === '') {
        Actions.Login();
        throw new Error('Unauthorized');
    }

    return `Bearer ${token}`
}

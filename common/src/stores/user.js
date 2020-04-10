import {types} from "mobx-state-tree";
import GetEnv from "./env";
import {when} from "mobx";
import {ENV} from "../env_vars";

const UserStore = types.compose("UserStore",
    GetEnv,

    types.model({
        tryLogging: false,
        loggedIn: types.optional(types.boolean, false),
        email: types.maybe(types.string),
        password: types.maybe(types.string),
        selectedOrg: types.optional(types.string, 'production'),
        loginError: types.frozen()
    })
        .actions(self => ({
            async reLogin() {
                this.setIsTryLogging(true)
                self.loginError = undefined
                await when(() => !self.tryLogging, {timeout: 5000})
            },
            tryLogin(email, password) {
                self.email = email
                self.password = password
                self.loginError = undefined
                this.setIsTryLogging(true)
            },
            setLoginError(error) {
                self.email = undefined
                self.password = undefined
                self.loginError = error
                this.setIsTryLogging(false)
            },
            setIsLoggedIn(loggedIn) {
                self.loggedIn = loggedIn
            },
            setIsTryLogging(isTryLogging) {
                self.tryLogging = isTryLogging
            },
            async selectOrg(selectedOrg) {
                self.selectedOrg = selectedOrg
            },
            getSelectedOrgUrl() {
                return self.selectedOrg === 'test' ? ENV.TEST_END_POINT : ENV.PRODUCTION_END_POINT
            },
            getAuthUrl() {
                const clientID = self.selectedOrg === 'test' ? ENV.TEST_AUTH_CLIENT_ID : ENV.PRODUCTION_AUTH_CLIENT_ID
                const RESPONSE_TYPE = 'token';
                const createAuthUrl = (ORG_URL, AUTH_CLIENT_ID) => `${ORG_URL}/services/oauth2/authorize?response_type=${RESPONSE_TYPE}&client_id=${AUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(ENV.AUTH_CALLBACK_SRC)}`;
                return createAuthUrl(this.getSelectedOrgUrl(), clientID);
            }
        }))
)

export default UserStore

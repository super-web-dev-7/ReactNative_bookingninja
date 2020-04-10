/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {ENV} from "../common/src/env_vars";

ENV["TEST_END_POINT"] = "https://bntso2--mobiledev1.my.salesforce.com"
ENV["TEST_AUTH_CLIENT_ID"] = "3MVG9ahGHqp.k2_x3hS.CVI.V_HPV9LITazaMShwP7Ky_6jzrk1arLhpWMOhM9IiOSs4qD1Sh5b8a0HKCm1dy"
ENV["PRODUCTION_END_POINT"] = "https://ctygroup.my.salesforce.com"
ENV["PRODUCTION_AUTH_CLIENT_ID"] = "3MVG9IHf89I1t8hq516JPLWKQ7AEN9xuVcQ5dgkY3aQtoxkBlIou_8irEXDazeKQUg503a8jH16NNxq1L0zoM"
ENV["LOGIN_APP_NAME"] = "Booking Ninjas"
ENV["AUTH_CALLBACK_SRC"] = "bninjasworker://mobilesdk/detect/oauth/done"

AppRegistry.registerComponent(appName, () => App);

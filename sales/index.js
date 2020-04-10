/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {ENV} from "../common/src/env_vars";


ENV["TEST_END_POINT"] = "https://bookingninjas--vadim.cs45.my.salesforce.com"
ENV["TEST_AUTH_CLIENT_ID"] = "3MVG9eQyYZ1h89HeO90UV6o6amCPf9lB62mKV2sUwmRzZd3qtTKkIfzLVB60qWCI.615InUzNfI7xg0dEgKP."
ENV["PRODUCTION_END_POINT"] = "https://bookingninjas.my.salesforce.com"
ENV["PRODUCTION_AUTH_CLIENT_ID"] = "3MVG9uudbyLbNPZPaf3P2a8AVB7ejGZeKov5YYsFQneCgrJDkVltsD0uNlS9QmrUu8493L8SSDkRbstIGl2nn"
ENV["LOGIN_APP_NAME"] = "Booking Ninjas Sales"
ENV["AUTH_CALLBACK_SRC"] = "bninjas://mobilesdk/detect/oauth/done"


AppRegistry.registerComponent(appName, () => App);

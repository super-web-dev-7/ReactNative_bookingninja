import React from 'react';
import {Linking, StyleSheet, WebView} from 'react-native';
import {inject, observer} from "mobx-react";
import * as querystring from "query-string";
import {loadString, saveString} from "../../lib/storage";
import {Actions} from "react-native-router-flux";
import {View} from "react-native-animatable";
import {AUTH_KEYS} from "../../utils/keys";

const {Crashlytics} = require('react-native-fabric');

const styles = StyleSheet.create({
    container: {
        height: 0,
        position: "absolute",
        overflow: "hidden",
        top: "100%",
    }
})

const injectedJs = (username, password) => `
if(document.getElementById('error')) {
    window.postMessage('error')
}

const approve = document.getElementById('oaapprove');
if(approve) {
    approve.click();
} else {
    document.getElementById('username').value = '${username}';
    document.getElementById('password').value = '${password}';
    document.getElementById('rememberUn').click();
    document.getElementById('Login').click();
}`;

@inject("userStore")
@observer
export default class LoginWrapper extends React.Component {

    componentDidMount() {
        Linking.addEventListener('url', this.handleOauthCallback);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOauthCallback);
    }

    handleOauthCallback = async (event) => {
        console.tron.log(`URL: ${event.url}`)
        const loginInfo = querystring.parse(event.url.split('#')[1]);
        await saveString(AUTH_KEYS.INSTANCE_URL, loginInfo.instance_url);
        await saveString(AUTH_KEYS.ACCESS_TOKEN, loginInfo.access_token);
        Crashlytics.setUserName(await loadString(AUTH_KEYS.LAST_USERNAME));

        if (!this.props.userStore.loggedIn) {
            this.props.userStore.setIsLoggedIn(true)
            Actions.Main();
        }
        this.props.userStore.setIsTryLogging(false)
    }

    inject = (event) => {
        console.tron.log(`ON LOAD END: ${JSON.stringify(event.nativeEvent)}`)
        const {email, password} = this.props.userStore
        this.webview.injectJavaScript(injectedJs(email, password))
    };

    onError = (event) => {
        console.tron.error(event.nativeEvent.data)
        this.props.userStore.setLoginError(event.nativeEvent.data)
    };

    onLoadStart = (event) => {
        console.tron.log(`ON LOAD START: ${JSON.stringify(event.nativeEvent)}`)
    }

    render() {
        if (!this.props.userStore.tryLogging) return null

        const uri = this.props.userStore.getAuthUrl();
        console.tron.log(uri)

        return (
            <View style={styles.container}>
                <WebView
                    source={{uri}}
                    javaScriptEnabled
                    javaScriptEnabledAndroid
                    startInLoadingState
                    scrollEnabled={false}
                    ref={(ref) => {
                        this.webview = ref;
                    }}
                    onLoadEnd={this.inject}
                    onMessage={this.onError}
                    onLoadStart={this.onLoadStart}
                />
            </View>
        )
    }

}

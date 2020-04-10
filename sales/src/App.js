import React from 'react';
import Routes from './navigation/Routes'
import {UIManager, StyleSheet} from 'react-native'
import setupReactotron from "../../common/src/services/reactotron";
import {loadString} from "../../common/src/lib/storage";
import {Provider} from "mobx-react";
import {setupRootStore} from "../../common/src/stores/setup-root-store";
import {getEnv} from "mobx-state-tree";
import LoginWrapper from "../../common/src/container/login/login_wrapper";
import {View} from "react-native-animatable";
import {AUTH_KEYS} from "../../common/src/utils/keys";

const {Crashlytics} = require('react-native-fabric');

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends React.Component {
    state = {
        rootStore: null,
    };

    async componentDidMount() {
        await setupReactotron();

        const username = await loadString(AUTH_KEYS.LAST_USERNAME);
        const selectedOrg = await loadString(AUTH_KEYS.SELECTED_ORG);
        if (username) {
            Crashlytics.setUserName(username);
        }

        this.setState({
            rootStore: await setupRootStore(selectedOrg),
        })
    }

    render() {
        const rootStore = this.state && this.state.rootStore

        // Before we show the app, we have to wait for our state to be ready.
        // In the meantime, don't render anything. This will be the background
        // color set in native by rootView's background color.
        //
        // This step should be completely covered over by the splash screen though.
        //
        // You're welcome to swap in your own component to render if your boot up
        // sequence is too slow though.
        if (!rootStore) {
            return null
        }

        //TODO Remove after moving on stores
        const env = getEnv(rootStore)

        return <Provider {...rootStore} {...env}>
            <View style={styles.container}>
                <Routes/>
                <LoginWrapper/>
            </View>
        </Provider>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

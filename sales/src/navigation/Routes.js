import React, {Component} from 'react';

import {Router, Scene} from 'react-native-router-flux'
import Login from '../../../common/src/container/login/login'

import HouseKeeper from '../../../common/src/container/screens/housekeeper'
import Contact from "../../../common/src/container/screens/contact";
import Keypad from "../../../common/src/container/screens/keypad";
import MenuScreen from "../../../common/src/container/screens/menu";
import {Icon} from "react-native-elements";
import RecentIcon from "../../../common/src/Assets/recent.svg";
import {inject, observer} from "mobx-react";
import NotificationCookBook from "../../../common/src/container/screens/notification-cook-book";
import CookBookReportDetail from "../../../common/src/container/screens/cook-book-report-detail";
import CallResult from "../../../common/src/container/screens/call-result";
import SearchCookBook from "../../../common/src/container/screens/search-cook-book";

const TabIcon = ({focused, title}) => {
    let image;
    let type = "material"
    const color = focused ? "#2196F3" : "#707070"

    switch (title) {
        case 'Menu':
            image = "home"
            break;
        case 'Messages':
            image = "mail"
            break;

        case 'Recents':
            return <RecentIcon style={{color: color}}/>

        case 'Contacts':
            image = "group"
            break;

        case 'Keypad':
            image = "dialpad"
            break;

        case 'Notifications':
            image = "notifications"
            break;

        case 'SearchCookBook':
            image = "search"
            break;
    }

    return (<Icon color={color} type={type} name={image}/>);
}

// TODO: Replace with react-navigation https://medium.com/@Laurens_Lang/react-native-migrating-from-react-native-router-flux-to-react-navigation-7c47b1cc679c
@inject("userStore")
@observer
export default class Routes extends Component {

    render() {
        return <Router>
            <Scene key="root">
                <Scene key="Login" component={Login} hideNavBar={true} initial={!this.props.userStore.loggedIn}/>
                <Scene key="Main" hideNavBar={true} initial={this.props.userStore.loggedIn}>
                    <Scene
                        key="tabBar"
                        tabs
                        tabBarPosition='bottom'
                        activeTintColor='#2196F3'
                        inactiveTintColor='black'
                        // showLabel={true}
                        lazy
                        hideNavBar={true}
                    >
                        <Scene
                            key="Menu"
                            component={MenuScreen}
                            title="Menu"
                            icon={TabIcon}
                            hideNavBar={true}
                        />
                        {/*TODO BOOKN-2 Hide this screens*/}
                        {/*<Scene*/}
                        {/*key="Message"*/}
                        {/*component={Message}*/}
                        {/*title="Messages"*/}
                        {/*icon={TabIcon}*/}
                        {/*hideNavBar={true}*/}
                        {/*/>*/}
                        {/*<Scene*/}
                        {/*key="Recent"*/}
                        {/*component={Recent}*/}
                        {/*title="Recents"*/}
                        {/*icon={TabIcon}*/}
                        {/*hideNavBar={true}*/}
                        {/*/>*/}
                        <Scene
                            key="Contact"
                            component={Contact}
                            title="Contacts"
                            icon={TabIcon}
                            hideNavBar={true}
                        />
                        <Scene
                            key="Keypad"
                            component={Keypad}
                            title="Keypad"
                            icon={TabIcon}
                            hideNavBar={true}
                        />
                        <Scene
                            key="Notification"
                            component={NotificationCookBook}
                            title="Notifications"
                            icon={TabIcon}
                            hideNavBar={true}
                        />
                        <Scene
                            key='SearchCookBook'
                            component={SearchCookBook}
                            title='SearchCookBook'
                            icon={TabIcon}
                            hideNavBar={true}
                        />
                    </Scene>

                    <Scene
                        key="HouseKeeper"
                        component={HouseKeeper}
                        hideNavBar={true}
                    />
                    <Scene
                        key="CookBookReportDetail"
                        component={CookBookReportDetail}
                        hideNavBar={true}/>
                    <Scene
                        key="CallResult"
                        component={CallResult}
                        hideNavBar={true}/>
                </Scene>
            </Scene>
        </Router>
    }
}

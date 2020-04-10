import React, {Component} from 'react';
import {
    ImageBackground,
    LayoutAnimation,
    PermissionsAndroid,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import DialerHeader from "../../views/voip/dialer-header";
import {showLongToast} from "../../utils/toast-utils";
import {Actions} from "react-native-router-flux";
import {Icon} from "react-native-elements";
import Numpad from "../../views/voip/dialer-header/numpad";
import {disposeOnUnmount, inject, observer} from "mobx-react";
import KeypadViewModel, {CallError, CallStates} from "../../view-models/keypad";
import {action, computed, observable, reaction} from "mobx";
import PermissionError from "../../utils/permission-error";
import Feather from "react-native-vector-icons/Feather";
import Header from "../../views/header";

const getMicrophonePermission = async () => {
    const audioPermission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    const hadPermission = await PermissionsAndroid.check(audioPermission);

    if (!hadPermission) {
        return await PermissionsAndroid.request(audioPermission, {
            title: 'Microphone Permission',
            message: 'App needs access to you microphone ' + 'so you can talk with other users.',
        });
    }
    return true;
};


let fakeProps = {};
let fakePropsSub;
// fixme: Get rid of the react-native-router-flux (https://github.com/aksonov/react-native-router-flux/issues/3435)
export const ActionsKeypad = (props) => {
    fakeProps = props ? props : {};
    if (fakePropsSub) {
        fakePropsSub(fakeProps)
    }
    Actions.Keypad()
}

const ScreenStates = {
    TYPE: "type",
    CALL: "call",
    CALL_WITH_KEYBOARD: "call_with_keyboard",
}

@inject("contactStore", "userStore", "waveApi")
@observer
export default class Keypad extends Component {
    @observable
    mCallSeconds = 0
    @observable
    currentState = ScreenStates.TYPE

    callTimer = undefined

    viewModel = new KeypadViewModel(this.props.contactStore, this.props.userStore, this.props.waveApi)

    @disposeOnUnmount
    updateCallSecondsDisposer
    @disposeOnUnmount
    changeScreenStateDisposer

    componentDidMount() {
        this.passTheNumber(fakeProps);
        fakePropsSub = this.passTheNumber;

        this.updateCallSecondsDisposer = reaction(() => this.viewModel.callState.call_state,
            (callState) => {
                if (callState === CallStates.CONNECTED) {
                    this.startCallTimer()
                } else {
                    this.endCallTimer()
                }
            })
        this.changeScreenStateDisposer = reaction(() => this.viewModel.callState,
            (callState) => {
                if (callState.call_state === CallStates.NONE) {
                    this.changeScreenState(ScreenStates.TYPE)
                } else if (callState.call_state === CallStates.DISCONNECTED) {
                    const withRouting = callState.isConnected
                    this.changeScreenState(ScreenStates.TYPE, !withRouting)
                    if (withRouting) {
                        Actions.CallResult()
                    }
                } else if (this.currentState !== ScreenStates.CALL && this.currentState !== ScreenStates.CALL_WITH_KEYBOARD) {
                    this.changeScreenState(ScreenStates.CALL)
                }
            })

        this.viewModel.twilioAddListeners()

        this.viewModel.initTwilio(getMicrophonePermission)
            .catch(error => {
                if (error instanceof PermissionError) {
                    showLongToast(error.message)
                }
            })
    }

    componentWillUnmount() {
        fakePropsSub = undefined;

        this.viewModel.twilioRemoveListeners()
    }

    passTheNumber = (props) => {
        this.viewModel.changePhoneNumber(props.phoneNumber || '')
    }

    startCallTimer() {
        if (this.callTimer !== undefined) return

        this.callTimer = setInterval(this.updateCallSeconds, 1000)
    }

    @action
    updateCallSeconds = () => {
        this.mCallSeconds += 1
    }

    @action
    endCallTimer() {
        if (this.callTimer === undefined) {
            clearInterval(this.callTimer)
            this.callTimer = undefined
        }

        this.mCallSeconds = 0
    }

    @action
    changeScreenState(newState, withAnimation = true) {
        if (withAnimation) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        }
        this.currentState = newState
    }

    @computed
    get callSeconds() {
        return new Date((this.mCallSeconds || 0) * 1000).toISOString().substr(11, 8)
    }

    getCallState() {
        const callState = this.viewModel.callState

        if (!callState && !callState.call_state) return undefined

        switch (callState.call_state) {
            case CallStates.CALLING:
                return "calling..."
            case CallStates.CONNECTED:
                return this.callSeconds
            case CallStates.DISCONNECTING:
                return "disconnecting..."
            case CallStates.DISCONNECTED:
                return ""
        }
    }

    renderSubCallButton(title, icon, enabled, onChange) {
        return <Icon
            key={`sub_call_button:${title}`}
            name={icon}
            type='material'
            color={enabled ? "#2196F3" : "#707070"}
            size={30}
            raised={enabled}
            reverse={enabled}
            reverseColor="white"
            containerStyle={styles.subRowCallButton}
            onPress={() => onChange(!enabled)}/>;
    }

    changeKeyboard = (openKeyboard) => {
        this.changeScreenState(openKeyboard ? ScreenStates.CALL_WITH_KEYBOARD : ScreenStates.CALL)
    }

    * renderInputViews() {
        const {currentState} = this

        yield <DialerHeader
            prefix={"+"}
            phoneNumber={this.viewModel.phoneNumber}
            changePhoneNumber={this.viewModel.changePhoneNumber}
            enable={currentState === ScreenStates.TYPE}/>;

        if (currentState === ScreenStates.CALL || currentState === ScreenStates.CALL_WITH_KEYBOARD) {

            yield <View key="subRowCallButtonsContainer" style={styles.subRowCallButtonsContainer}>
                {this.renderSubCallButton("Mute", this.viewModel.isMute ? "mic-off" : "mic", this.viewModel.isMute, this.viewModel.changeMute)}
                {this.renderSubCallButton("Keypad", "dialpad", this.currentState === ScreenStates.CALL_WITH_KEYBOARD, this.changeKeyboard)}
                {this.renderSubCallButton("Speaker", this.viewModel.isSpeaker ? "volume-off" : "volume-up", this.viewModel.isSpeaker, this.viewModel.changeSpeaker)}
            </View>;
        }

        if (currentState === ScreenStates.TYPE || currentState === ScreenStates.CALL_WITH_KEYBOARD) {
            yield <Numpad
                key="numpad"
                onDial={currentState === ScreenStates.CALL_WITH_KEYBOARD ? this.viewModel.sendCallDigits : this.viewModel.handleDial}
                disabled={this.viewModel.callState.call_state === CallStates.DISCONNECTING}/>;
        } else {
            yield <View key="spacer" style={styles.spacer}/>;
        }

        if (currentState === ScreenStates.TYPE) {
            yield <Icon
                key="call_button"
                name='ios-call'
                type='ionicon'
                color='#63D91C'
                size={36}
                raised={true}
                reverse={true}
                reverseColor="white"
                containerStyle={styles.inputButton}
                onPress={this.handleCall}/>;
        } else {
            yield <Icon
                key="call_button"
                name='phone-hangup'
                type='material-community'
                color='#d92200'
                size={36}
                raised={true}
                reverse={true}
                disabled={this.viewModel.callState.call_state === CallStates.DISCONNECTING}
                reverseColor="white"
                containerStyle={styles.inputButton}
                onPress={this.viewModel.hangup}/>;
        }
    }

    handleCall = () => {
        this.viewModel.call(getMicrophonePermission)
            .catch(error => {
                if (error instanceof CallError) {
                    showLongToast(error.message)
                }
            })
    }

    * renderViews() {
        const {currentState} = this

        const contact = this.viewModel.contact

        if (currentState === ScreenStates.CALL) {
            yield <View style={styles.firstLetterSpacer}/>
            yield <Text key="firstLetter"
                        style={styles.firstLetterLastName}>{contact ? contact.Name.charAt(0) : "+"}</Text>;
            yield <Text key="callState" style={styles.callState}>{this.getCallState()}</Text>;
        }

        if (currentState === ScreenStates.CALL || currentState === ScreenStates.CALL_WITH_KEYBOARD) {
            yield <Text key="fullName"
                        style={styles.fullName}>{contact ? `${contact.Salutation} ${contact.Name}` : ""}</Text>;
        } else {
            yield <Header
                key="header"
                headerRight={this.header_right}/>;
        }

        yield <View key="inputContainer" style={styles.inputContainer}>
            {[...this.renderInputViews()]}
        </View>;
    }

    render() {
        return <ImageBackground
            key="background"
            style={styles.container}
            source={require('../../Assets/back.png')}>
            {[...this.renderViews()]}
        </ImageBackground>
    }

    header_right = () => {
        return (
            <View style={styles.headerRight}>
                <TouchableOpacity style={{marginLeft: 5}}>
                    <Feather name="more-vertical" size={25} color="#fff"/>
                </TouchableOpacity>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#2196F3',
    },
    headerRight: {
        flexDirection: 'row',
    },
    inputContainer: {
        flex: 1,
        paddingBottom: 8,
        backgroundColor: 'white',
    },
    firstLetterSpacer: {
        marginTop: 32,
    },
    firstLetterLastName: {
        textAlign: 'center',
        alignSelf: "center",
        paddingTop: 6,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        fontSize: 62,
        color: "white",
        borderColor: "white",
    },
    callState: {
        alignSelf: "center",
        color: "white",
        margin: 8,
    },
    fullName: {
        alignSelf: "center",
        color: "white",
        margin: 16,
        fontWeight: 'bold',
        fontSize: 28,
    },
    inputButton: {
        alignSelf: "center",
    },
    spacer: {
        flex: 1,
    },
    subRowCallButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    subRowCallButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});




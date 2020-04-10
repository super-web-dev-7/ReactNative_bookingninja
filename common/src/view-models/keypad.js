import TwilioVoice from "react-native-twilio-programmable-voice";
import {Platform} from "react-native";
import jwtDecode from "jwt-decode";
import {action, computed, observable} from "mobx";
import PermissionError from "../utils/permission-error";
import {loadString, saveString} from "../lib/storage";
import {AUTH_KEYS} from "../utils/keys";

export const TWILIO_STATUSES = {
    NOT_STARTED: 'not-started',
    PENDING: 'pending',
    READY: 'ready',
    FAILED: 'failed',
}

export const CallStates = {
    NONE: "none",
    CALLING: "CALLING",
    CONNECTED: "CONNECTED",
    DISCONNECTING: "DISCONNECTING",
    DISCONNECTED: "DISCONNECTED",
}

const MAX_PHONE_NUMBER_SYMBOLS = 14

export default class KeypadViewModel {

    @observable
    phoneNumber = ''
    @observable
    twilioStatus = TWILIO_STATUSES.NOT_STARTED
    @observable
    callState = {call_state: CallStates.NONE, isConnected: false}
    @observable
    isMute = false
    @observable
    isSpeaker = false

    constructor(contactStore, userStore, waveApi) {
        this.contactStore = contactStore
        this.userStore = userStore
        this.waveApi = waveApi
    }

    @action
    twilioReady = () => {
        console.tron.log("TWILIO READY")
        this.twilioStatus = TWILIO_STATUSES.READY
    }
    @action
    twilioFailed = () => {
        console.tron.log("TWILIO FAILED")
        this.twilioStatus = TWILIO_STATUSES.FAILED
    }
    twilioConnected = (data) => {
        const call_to = this.callState.call_to;
        this.changeCallState({...data, call_to})
    };

    twilioDisconnected = (data) => {
        const call_to = this.callState.call_to;
        this.changeCallState({...data, call_to})
    };

    @action
    changeCallState(newState) {
        newState.isConnected = newState.call_state === CallStates.CONNECTED ||
            (newState.call_state !== CallStates.NONE && newState.call_state !== CallStates.CALLING && this.callState.isConnected)
        this.callState = newState
    }

    twilioAddListeners() {
        TwilioVoice.addEventListener('deviceReady', this.twilioReady);
        TwilioVoice.addEventListener('deviceNotReady', this.twilioFailed);
        TwilioVoice.addEventListener('connectionDidConnect', this.twilioConnected);
        TwilioVoice.addEventListener('connectionDidDisconnect', this.twilioDisconnected);
    }

    twilioRemoveListeners() {
        TwilioVoice.removeEventListener('deviceReady', this.twilioReady);
        TwilioVoice.removeEventListener('deviceNotReady', this.twilioFailed);
        TwilioVoice.removeEventListener('connectionDidConnect', this.twilioConnected);
        TwilioVoice.removeEventListener('connectionDidDisconnect', this.twilioDisconnected);
    }

    @action
    async initTwilio(getMicrophonePermission) {
        this.twilioStatus = TWILIO_STATUSES.PENDING;

        let token = await loadString(AUTH_KEYS.TWILIO_TOKEN);
        let tokenCorrect = false;
        if (token && token !== "") {
            console.tron.log(`Found token, decoding...`);
            try {
                const decoded = jwtDecode(token);
                console.tron.log(JSON.stringify(decoded));
                const now = Date.now() / 1000;
                if (now < decoded.exp) {
                    console.tron.log(`Stored token validated`);
                    tokenCorrect = true;
                } else {
                    console.tron.log(`Stored token is invalid ${now} > ${decoded.exp}`);
                }
            } catch (e) {
                console.tron.log(`Stored token is invalid`);
            } // ignored
        }

        if (!tokenCorrect) {
            console.tron.log(`Loading the token`);
            try {
                const response = await this.waveApi.twilioAuth(this.userStore);
                console.tron.log(`Token loaded ${JSON.stringify(response.data)}`);
                token = response.data.twilioToken;
                await saveString(AUTH_KEYS.TWILIO_TOKEN, token);
            } catch (e) {
                console.tron.error("Failed to auth in twilio", e)
            }
        }

        if (!await getMicrophonePermission()) {
            throw new PermissionError('Can\'t connect without the microphone permission')
        }
        console.tron.log(`Connecting with ${token}`);
        await TwilioVoice.initWithToken(token);

        if (Platform.OS === 'ios') { //required for ios
            TwilioVoice.configureCallKit({
                appName: 'ReactNativeTwilioExampleApp',
            });
        }
    };

    async call(getMicrophonePermission) {
        if (!this.phoneNumber || this.phoneNumber.length === 0) throw new CallError('Please, input the number');

        if (this.twilioStatus === TWILIO_STATUSES.FAILED) {
            this.initTwilio(getMicrophonePermission);
            throw new CallError('Couldn\'t connect to the call service. Retrying...');
        }
        if (this.twilioStatus !== TWILIO_STATUSES.READY) {
            throw new CallError('Please wait for call authorization');
        }

        if (await getMicrophonePermission()) {
            this.changeCallState({call_to: '+' + this.phoneNumber, call_state: "CALLING"})
            this.changeSpeaker(this.isSpeaker)
            TwilioVoice.connect({To: '+' + this.phoneNumber});
        } else {
            throw new CallError('Audio Recording permission should be granted.')
        }
    };

    hangup = () => {
        if (this.callState.call_state === CallStates.CALLING ||
            this.callState.call_state === CallStates.CONNECTED) {
            this.changeCallState({...this.callState, call_state: CallStates.DISCONNECTING})
            this.changeMute(false);
            this.changeSpeaker(false);
            TwilioVoice.disconnect();
        }
    }

    @action
    changePhoneNumber = (newPhone) => {
        this.phoneNumber = newPhone
    }

    handleDial = (num) => {
        if (this.phoneNumber.length < MAX_PHONE_NUMBER_SYMBOLS) {
            let temp = this.phoneNumber;
            temp = temp + num;
            this.changePhoneNumber(temp);
        }
    };

    @computed get contact() {
        const contact = this.contactStore.contactList.data &&
            this.contactStore.contactList.data.find(item => item.Phone && item.Phone.replace(/[+()\-\s]+/g, "") === this.phoneNumber)

        if (!contact && this.contactStore.contactList.canLoadNext) {
            this.contactStore.contactList.requestContacts(this.userStore)
        }

        return contact
    }

    @action
    changeMute = (isMute) => {
        TwilioVoice.setMuted(isMute)
        this.isMute = isMute
    }

    sendCallDigits = (digit) => {
        TwilioVoice.sendDigits(digit)
    }

    @action
    changeSpeaker = (isSpeaker) => {
        TwilioVoice.setSpeakerPhone(isSpeaker)
        this.isSpeaker = isSpeaker
    }

}

export class CallError extends Error {
    static name = "CallError"
}

import React, {Component} from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TextField} from "react-native-material-textfield";
import {Icon} from "react-native-elements";
import {ActionsKeypad} from "../../container/screens/keypad";
import {showLongToast} from "../../utils/toast-utils";
import {inject} from "mobx-react";

@inject("waveApi", "userStore")
export class ContactModal extends Component {

    state = {
        isSendMessageOpen: false,

        sendMessage: undefined,
        sendMessageInputError: undefined,

        sendMessageIsFetching: false,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.contact !== this.props.contact) {
            this.setState({isSendMessageOpen: false})
        }
    }

    call = () => {
        const contact = this.props.contact;
        if (!contact) return

        this.closeContactModal();
        ActionsKeypad({phoneNumber: contact.Phone && contact.Phone.replace(/\D/g, '')});
    }

    closeContactModal = () => {
        this.props.onClose()
    }

    openMessageModal = () => {
        this.setState({isSendMessageOpen: true})
    }

    closeMessageModal = () => {
        this.setState({isSendMessageOpen: false})
    }

    setSendMessage = (newValue) => this.setState({
        sendMessage: newValue,
        sendMessageInputError: null,
    })

    sendMessage = () => {
        const contact = this.props.contact
        if (!contact) return

        const message = this.state.sendMessage ? this.state.sendMessage.trim() : undefined

        if (!this.state.isSendMessageOpen || !contact) return

        if (!message || message.length === 0) {
            this.setState({
                sendMessageInputError: "Input message text"
            })

            return
        }

        this.setState({
            sendMessageInputError: null,
            sendMessageIsFetching: true,
        })

        this.props.waveApi.sendMessage(this.props.userStore, contact.Phone, message)
            .then(() => {

                this.setState({
                    sendMessageIsFetching: false,
                    sendMessage: null,
                })
                this.closeContactModal()
                showLongToast("Message sent")
            })
            .catch(error => {

                this.setState({
                    sendMessageIsFetching: false,
                    sendMessageInputError: "Failed to send message",
                })
                console.tron.error("Failed to send message", error)
            })
    };

    * renderContactModalViews(contact) {
        if (this.state.isSendMessageOpen) {

            yield <View key="modalTitleContainer" style={styles.modalTitleContainer}>
                <TouchableOpacity key="modalBackButton" onPress={this.closeMessageModal}>
                    <Ionicons name="md-arrow-back" size={30} color="#2196F3"/>
                </TouchableOpacity>
                <Text key="sendMessageTitle" style={styles.sendMessageTitle}>
                    {`${contact.Salutation || ""} ${contact.Name}`}
                </Text>
            </View>

            yield <Text key="contactPhone" style={styles.modalSmallText}>
                {`Phone: ${contact.Phone}`}
            </Text>

            yield <TextField
                key="sendMessageInput"
                containerStyle={styles.sendMessageInput}
                label="Message"
                tintColor='#2196F3'
                value={this.state.sendMessage}
                error={this.state.sendMessageInputError}
                onChangeText={this.setSendMessage}
            />

            yield <View key="modalButtonRow" style={styles.modalButtonRow}>
                {this.state.sendMessageIsFetching ?
                    <ActivityIndicator key="sendMessageProgress" style={styles.sendMessageProgress} size="large"
                                       color="#2196F3"/>
                    :
                    <TouchableOpacity key="modalLastButton" style={styles.modalButton} onPress={this.sendMessage}>
                        <Text>SEND</Text>
                    </TouchableOpacity>
                }
            </View>
        } else {
            yield <View key="modalTitleContainer" style={styles.modalTitleContainer}>
                <Text key="sendMessageTitle" style={{fontSize: 32}}>
                    {`${contact.Salutation || ""} ${contact.Name}`}
                </Text>
            </View>

            yield <Text key="contactPhone" style={styles.modalSmallText}>
                {`Phone: ${contact.Phone}`}
            </Text>

            yield <Text key="contactEmail" style={styles.modalSmallText}>
                {`Email: ${contact.Email || "-"}`}
            </Text>

            yield <View key="modalButtonRow" style={styles.modalButtonRow}>
                <TouchableOpacity key="callButton" style={styles.modalButton} onPress={this.call}>
                    <Icon name='ios-call' type='ionicon' color='#2196F3' size={32}/>
                </TouchableOpacity>
                <TouchableOpacity key="messageButton" style={styles.modalButton} onPress={this.openMessageModal}>
                    <Icon name='message' type='material' color='#2196F3' size={32}/>
                </TouchableOpacity>
                <View style={{flex: 1}}/>
                <TouchableOpacity key="modalLastButton" style={styles.modalButton} onPress={this.closeContactModal}>
                    <Text>OK</Text>
                </TouchableOpacity>
            </View>
        }
    }

    render() {
        const {contact} = this.props
        return <Modal
            animationType={'slide'}
            transparent={true}
            visible={!!contact}
            onRequestClose={this.closeContactModal}>
            {contact &&
            <View style={styles.modalContainer}>
                <View style={styles.innerModalContainer}>
                    {[...this.renderContactModalViews(contact)]}
                </View>
            </View>}
        </Modal>
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#00000080',
        padding: 32,
        justifyContent: 'center'
    },
    innerModalContainer: {
        backgroundColor: 'white',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1,
        borderRadius: 8,
    },
    modalSmallText: {
        fontSize: 20,
        paddingVertical: 4
    },
    modalButtonRow: {
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        paddingVertical: 8,
    },
    modalButton: {
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalTitleContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    sendMessageInput: {
        alignSelf: "stretch",
    },
    sendMessageTitle: {
        fontSize: 28,
        marginStart: 16,
    },
    sendMessageProgress: {
        // margin: 8,
        flex: 1,
    },
})

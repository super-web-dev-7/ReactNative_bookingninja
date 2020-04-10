import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Image} from "react-native-elements";
import {showLongToast} from "../../utils/toast-utils";
import RoomStore from "../../stores/room";
import {TextField} from "react-native-material-textfield";
import {inject} from "mobx-react";
import ImagePicker from 'react-native-image-picker';

@inject("salesforceApi", "userStore")
export default class HouseItem extends Component {

    state = {
        item: this.props.item,

        changingState: undefined,

        isFeedbackModalOpen: false,

        missingItemInput: undefined,
        missingItemInputError: undefined,
        needFixItemInput: undefined,
        needFixItemInputError: undefined,
        modalImage: undefined,

        sendFeedbackIsFetching: false,
    }

    changeStatus(newStatus) {
        this.setState({
            changingState: newStatus,
        })

        const item = this.state.item
        this.props.salesforceApi.updateData(this.props.userStore, item.attributes.type, item.Id, this.props.salesforceApi.UNIT_PARAMETERS, {
            Status__c: newStatus,
        }).then(newData => {
            this.setState({
                item: newData,
                changingState: undefined,
            });
        }).catch(error => {
            this.setState({
                changingState: undefined
            });

            console.tron.error(error.message, error.stack)

            showLongToast(`Failed to update status for ${item.Name}`);
        });
    }

    changeStatusToClean = () => {
        this.changeStatus("Clean")
    }

    changeStatusToDirty = () => {
        this.changeStatus("Dirty")
    }

    renderChangeStatusButton(state) {
        const isThisState = this.state.item.Status__c === state

        if (this.state.changingState === state) {
            return <ActivityIndicator style={styles.progress} size="large" color="#2196F3"/>
        } else {
            let image
            let text
            let buttonCallback
            switch (state) {
                case RoomStore.stateTypes.CLEAN_ROOMS:
                    image = require('../../Assets/clean.png');
                    text = "The room is clean";
                    buttonCallback = this.changeStatusToClean;
                    break;
                default:
                case RoomStore.stateTypes.DIRTY_ROOMS:
                    image = require('../../Assets/dirty.png');
                    text = "The room is dirty";
                    buttonCallback = this.changeStatusToDirty;
                    break;
            }

            return <TouchableOpacity
                style={styles.buttonContainer}
                disabled={isThisState}
                onPress={buttonCallback}>
                <Image source={image} style={{width: 75, height: 70}} tintColor={isThisState ? "#707070" : undefined}/>
                <Text style={{fontSize: 18, marginTop: 10, textAlign: 'center'}}>{text}</Text>
            </TouchableOpacity>
        }
    }

    openFeedbackModal = () => this.setState({
        isFeedbackModalOpen: true,
    });

    closeFeedbackModal = () => this.setState({
        isFeedbackModalOpen: false,
    });

    openModalImagePicker = () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.tron.log(`Response = ${JSON.stringify(response)}`);

            if (response.didCancel) {
                console.tron.log('User cancelled image picker');
            } else if (response.error) {
                console.tron.log('ImagePicker Error: ', response.error);
            } else {
                const source = {
                    uri: response.uri,
                    name: response.fileName,
                    type: response.type
                };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    modalImage: source,
                });
            }
        });
    }

    sendFeedback = () => {
        if (!this.state.isFeedbackModalOpen) return

        const missingItem = this.state.missingItemInput ? this.state.missingItemInput.trim() : undefined
        const needFixItem = this.state.needFixItemInput ? this.state.needFixItemInput.trim() : undefined

        if ((!missingItem || missingItem.length === 0) &&
            (!needFixItem || needFixItem.length === 0)) {
            this.setState({
                missingItemInputError: "First, enter one of this fields",
                needFixItemInputError: "First, enter one of this fields",
            })

            return
        }

        this.setState({
            missingItemInputError: null,
            needFixItemInputError: null,
            sendFeedbackIsFetching: true,
        })

        const room = this.props.item
        let imageData
        const newData = {}
        if (missingItem && missingItem.length > 0) {
            newData.Items_Missing__c = missingItem
        }
        if (needFixItem && needFixItem.length > 0) {
            newData.Items_To_Repair__c = needFixItem
        }
        if (this.state.modalImage) {
            imageData = new FormData()
            imageData.append('fileData', {
                uri: this.state.modalImage.uri,
                name: this.state.modalImage.name,
                type: this.state.modalImage.type
            }, this.state.modalImage.name)
        }

        this.props.salesforceApi.sendFeedback(this.props.userStore, room.attributes.type, room.Id, newData, imageData)
            .then(() => {
                this.setState({
                    sendFeedbackIsFetching: false,
                    missingItemInput: undefined,
                    needFixItemInput: undefined,
                    modalImage: undefined
                });

                this.closeFeedbackModal()
                showLongToast("Success sending feedback")

            }).catch(error => {

            this.setState({
                sendFeedbackIsFetching: false,
                missingItemInputError: `Failed to set feedback for ${room.Id}`,
                needFixItemInputError: `Failed to set feedback for ${room.Id}`,
            })

            console.tron.error(error.message, error.stack)
        });
    }

    setMissingItem = (newValue) => this.setState({
        missingItemInput: newValue,
        missingItemInputError: null,
        needFixItemInputError: null,
    })

    setNeedFixItem = (newValue) => this.setState({
        needFixItemInput: newValue,
        missingItemInputError: null,
        needFixItemInputError: null,
    });

    * renderFeedbackModalViews() {
        yield <Text style={styles.modalTitleText}>
            Maintenance
        </Text>

        yield <TextField
            containerStyle={styles.modalInput}
            label="Missing items"
            tintColor='#2196F3'
            value={this.state.missingItemInput}
            error={this.state.missingItemInputError}
            onChangeText={this.setMissingItem}
        />

        yield <TextField
            containerStyle={styles.modalInput}
            label="Items to fix"
            tintColor='#2196F3'
            value={this.state.needFixItemInput}
            error={this.state.needFixItemInputError}
            onChangeText={this.setNeedFixItem}
        />

        yield <View style={styles.modalImageInputContainer}>
            <Image source={this.state.modalImage} style={styles.modalImage}/>
            <TouchableOpacity style={styles.modalImagePickButton} onPress={this.openModalImagePicker}>
                <Text>Choose</Text>
            </TouchableOpacity>
        </View>

        yield <View style={styles.modalButtonRow}>
            {this.state.sendFeedbackIsFetching ?
                <ActivityIndicator style={styles.sendFeedbackProgress} size="large" color="#2196F3"/>
                :
                [
                    <TouchableOpacity style={styles.modalButton} onPress={this.closeFeedbackModal}>
                        <Text>CANCEL</Text>
                    </TouchableOpacity>,
                    <TouchableOpacity style={styles.modalButton} onPress={this.sendFeedback}>
                        <Text>SEND</Text>
                    </TouchableOpacity>
                ]
            }
        </View>
    }

    renderFeedbackModal() {
        const isFeedbackOpen = this.state.isFeedbackModalOpen;

        return <Modal
            animationType={'slide'}
            transparent={true}
            visible={isFeedbackOpen}
            onRequestClose={this.closeFeedbackModal}>
            {isFeedbackOpen &&
            <View style={styles.modalContainer}>
                <View style={styles.innerModalContainer}>
                    {[...this.renderFeedbackModalViews()]}
                </View>
            </View>}
        </Modal>
    }

    render() {
        const {item} = this.state

        return <View style={styles.slide}>
            <View style={styles.photoContainer}>
                <Image source={require('../../Assets/room1.jpg')} style={styles.imageContainer}/>
                <View style={styles.photoTitleContainer}>
                    <Text style={styles.text}>{item.Name}</Text>
                    <TouchableOpacity style={styles.numberContainer}>
                        <Text style={styles.text}>21</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                {this.renderChangeStatusButton(RoomStore.stateTypes.CLEAN_ROOMS)}
                {this.renderChangeStatusButton(RoomStore.stateTypes.DIRTY_ROOMS)}
            </View>
            <TouchableOpacity style={styles.feedbackButton} onPress={this.openFeedbackModal}>
                <Text style={styles.feedbackText}>Feedback</Text>
            </TouchableOpacity>
            {this.renderFeedbackModal()}
        </View>
    }
}

const styles = StyleSheet.create({
    slide: {
        padding: 8,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    photoContainer: {
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').width - 100,
    },
    imageContainer: {
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').width - 100,
    },
    photoTitleContainer: {
        position: 'absolute',
        height: 50,
        bottom: 0,
        width: '100%',
        backgroundColor: '#0005',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    text: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    numberContainer: {
        marginHorizontal: 10,
        borderRadius: 50,
        backgroundColor: '#2196f3',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        marginTop: 50,
        width: Dimensions.get('window').width - 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        borderColor: '#707070',
        borderRadius: 10,
        borderWidth: 0.5,
        alignItems: 'center',
        width: (Dimensions.get('window').width - 20) / 2 - 10,
        height: (Dimensions.get('window').width - 20) / 2 - 10,
        padding: 30,
    },
    progress: {
        flex: 1,
    },

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
    modalInput: {
        alignSelf: "stretch",
    },
    modalTitleText: {
        fontSize: 28,
        marginStart: 16,
    },
    modalImageInputContainer: {
        padding: 8,
        flexDirection: 'row',
    },
    modalImage: {
        width: 50,
        height: 50
    },
    modalImagePickButton: {
        marginLeft: 8,
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },

    sendFeedbackProgress: {
        flex: 1,
    },

    feedbackButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    feedbackText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

import React, {Component} from 'react';
import {StyleSheet, View, Text} from "react-native";
import {Icon, ListItem} from "react-native-elements";

export default class DialerHeader extends Component {

    handleBack = () => {
        let temp = this.props.phoneNumber;
        temp = temp.substring(0, temp.length - 1);
        this.props.changePhoneNumber(temp);
    };

    handleClean = () => {
        this.props.changePhoneNumber("");
    }

    render() {
        const {enable} = this.props

        return <View
            style={enable ? [styles.phoneNumberContainer, styles.phoneNumberEnableContainer] : styles.phoneNumberContainer}>
            <ListItem
                disabled={!enable}
                key={0}
                title={this.props.phoneNumber}
                titleStyle={styles.itemTitle}
                rightElement={
                    enable && <Icon key="dealerHeaderBack" name='ios-backspace' type='ionicon' color='black'
                                    onPress={this.handleBack} onLongPress={this.handleClean}/>
                }
                leftElement={
                    this.props.prefix &&
                    <Text key="dealerHeaderPrefix"
                          style={styles.prefixText}>{this.props.prefix}</Text>
                }
            />
        </View>;
    };
}


const styles = StyleSheet.create({
    phoneNumberContainer: {
        height: 50,
        marginTop: 8,
        marginBottom: 8,
        marginHorizontal: 50,
    },
    phoneNumberEnableContainer: {
        marginTop: 50
    },
    itemTitle: {
        marginStart: -10,
        color: "black",
        fontSize: 20,
    },
    prefixText: {
        color: "black",
        fontSize: 20,
    }
});
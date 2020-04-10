import React, {PureComponent} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

// TODO: add a check for having onDial function in props (prop-types or TypeScript)
export default class Numpad extends PureComponent {

    renderButton(button) {
        return <TouchableOpacity
            disabled={this.props.disabled}
            style={styles.numButton}
            onPress={() => this.props.onDial(button)}>
            <Text style={styles.numText}>{button}</Text>
        </TouchableOpacity>
    }

    renderRowButton(firstButton, secondButton, thirdButton) {
        return <View style={styles.subRow}>
            {this.renderButton(firstButton)}
            {this.renderButton(secondButton)}
            {this.renderButton(thirdButton)}
        </View>
    }

    render() {
        return (<View style={styles.numpadContainer}>
            {this.renderRowButton("1", "2", "3")}
            {this.renderRowButton("4", "5", "6")}
            {this.renderRowButton("7", "8", "9")}
            {this.renderRowButton("#", "0", "*")}
        </View>);
    }
}

const styles = StyleSheet.create({
    numpadContainer: {
        flex: 1,
        marginHorizontal: 50,
        justifyContent: 'space-around'
    },
    subRow: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    numButton: {
        borderColor: '#08A8EA',
        borderWidth: 1,
        borderRadius: 50,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    numText: {
        color: '#707070',
        fontSize: 28,
        fontWeight: 'bold'
    }

});

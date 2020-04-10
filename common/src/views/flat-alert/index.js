import React, {Component} from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from "react-native";

export default class FlatAlert extends Component {

    *renderViews() {
        yield <Text style={styles.message}>{this.props.message}</Text>;

        if (this.props.onRetryPress) {
            yield <TouchableOpacity onPress={this.props.onRetryPress}>
                <Text style={styles.button}>{this.props.retry || "Retry"}</Text>
            </TouchableOpacity>;
        }
    }

    render() {
        return <View style={styles.centerContent}>
            {[...this.renderViews()]}
        </View>
    }
}


const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        color: '#2196F3',
        fontSize: 16,
    }
});
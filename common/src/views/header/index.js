import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Avatar, Badge, Header as HeaderComponent} from "react-native-elements";
import HeaderStyle from "./header-style";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Actions} from "react-native-router-flux";

export default class Header extends Component {

    headerLeft = () => {
        return (
            <View style={styles.headerLeft}>
                {this.props.onBackPress || this.props.withBack &&
                <TouchableOpacity onPress={this.props.onBackPress || navigationBack}>
                    <Ionicons name="md-arrow-back" size={30} color="#fff"/>
                </TouchableOpacity>}
                <TouchableOpacity style={styles.avatar}>
                    <Avatar
                        rounded
                        source={require("../../Assets/avatar.png")}
                        size="small"
                        overlayContainerStyle={styles.avatarIcon}
                    />
                    <Badge
                        status="success"
                        containerStyle={styles.headerLeftBadge}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    headerCenter = () => {
        return (
            <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{this.props.title}</Text>
            </View>
        );
    }

    render() {
        return <HeaderComponent
            key="header"
            containerStyle={HeaderStyle}
            leftComponent={this.props.headerLeft || this.headerLeft}
            centerComponent={this.props.title ? this.headerCenter : this.props.headerCenter}
            rightComponent={this.props.headerRight}
            backgroundColor='#2196F3'/>
    }
}

export const navigationBack = () => Actions.pop()

const styles = StyleSheet.create({
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerLeftBadge: {
        position: 'absolute',
        top: 25,
        right: 0,
    },
    headerCenter: {
        width: '100%',
        marginLeft: 80,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatar: {
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    avatarIcon: {
        backgroundColor: "#00000000"
    }
})

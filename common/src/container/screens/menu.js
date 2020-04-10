import React, {Component} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View, Text} from "react-native";
import Header from "../../views/header";
import {Actions} from "react-native-router-flux";

export default class MenuScreen extends Component {

    static menuList = [
        {
            title: "Search Cook Book",
            onClick: () => Actions.SearchCookBook(),
        },
        {
            title: "Phone",
            onClick: () => Actions.Keypad(),
        },
        {
            title: "Contacts",
            onClick: () => Actions.Contact(),
        },
        {
            title: "Notifications",
            onClick: () => Actions.Notification(),
        },
        {
            title: "Change org",
            onClick: () => Actions.Login(),
        }
    ]

    renderMenuItem = ({item}) => (
        <TouchableOpacity onPress={item.onClick}>
            <Text style={styles.menuItem}>{item.title}</Text>
        </TouchableOpacity>
    )

    renderSeparator = () => (
        <View
            style={styles.separator}
        />
    )

    render() {
        return <View style={styles.container}>
            <Header title="Menu"/>
            <FlatList
                data={MenuScreen.menuList}
                renderItem={this.renderMenuItem}
                ItemSeparatorComponent={this.renderSeparator}/>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#fff',
    },
    separator: {
        backgroundColor: "#707070",
        alignSelf: "stretch",
        marginHorizontal: 10,
        height: 0.5,
    },
    menuItem: {
        textAlign: "right",
        fontSize: 24,
        marginVertical: 24,
        marginHorizontal: 16,
    },
})

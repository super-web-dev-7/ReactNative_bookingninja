import React, {Component} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import Header from "../../views/header";
import Feather from "react-native-vector-icons/Feather";
import CookBookInfoItem, {CookBookInfoPickerItem} from "../../views/cook-book-report/cook-book-info-item";

export default class CallResult extends Component {

    header_right = () => {
        return (
            <View style={styles.headerRight}>
                <TouchableOpacity style={{marginHorizontal: 5}}>
                    <Feather name="filter" size={25} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity style={{marginHorizontal: 5}}>
                    <Feather name="trash-2" size={25} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 5}}>
                    <Feather name="more-vertical" size={25} color="#fff"/>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#347fd5"/>
            <Header
                title="Call result"
                headerRight={this.header_right}
                withBack/>
            <View style={styles.inlineContainer}>
                <CookBookInfoPickerItem
                    title='Call result'
                    options={[
                        'Contacted',
                        'Voice Mail',
                        'Call Backs',
                        'Appointments',
                        '2nd Meetings',
                        'Demo/Trial',
                        'Proposal',
                        'Close',
                    ]}
                    containerStyle={styles.infoItemContainer}/>
                <CookBookInfoItem
                    title='Notes'
                    info='-'
                    containerStyle={styles.infoItemContainer}/>
                <CookBookInfoItem
                    title='Next call'
                    info='5/16/2019'
                    containerStyle={styles.infoItemContainer}/>
                <CookBookInfoItem
                    title='Reassign to new AI'
                    info=''
                    containerStyle={styles.infoItemContainer}/>
            </View>
        </View>
    }
}


const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#fff',
    },
    inlineContainer: {
        padding: 16
    },
    infoItemContainer: {
        marginVertical: 4
    },
})

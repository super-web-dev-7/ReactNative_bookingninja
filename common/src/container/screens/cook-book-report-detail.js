import React, {Component} from 'react';
import {ScrollView, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Header from "../../views/header";
import {inject, observer} from "mobx-react";
import CookBookReportDetailVM from "../../view-models/cook-book-report-detail";
import CookBookInfo from "../../views/cook-book-report/cook-book-info";

@inject("salesforceApi", "userStore")
@observer
export default class CookBookReportDetail extends Component {

    viewModel = new CookBookReportDetailVM(this.props.userStore, this.props.salesforceApi, this.props.cookBook)

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
                title="Cook book report"
                headerRight={this.header_right}
                withBack/>
            <ScrollView style={styles.scroll}>
                <View style={styles.scrollContainer}>
                    <CookBookInfo cookBook={this.viewModel.cookBook}/>
                </View>
            </ScrollView>
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
    scroll: {
        flex: 1
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingVertical: 32,
    }
})

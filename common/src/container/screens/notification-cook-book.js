import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {Divider, ListItem, SearchBar,} from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import {Actions} from 'react-native-router-flux';
import Snackbar from 'react-native-snackbar';
import FlatAlert from "../../views/flat-alert";
import {disposeOnUnmount, inject, observer} from "mobx-react";
import Header from "../../views/header";
import NotificationCookBookVM from "../../view-models/notification-cook-book";
import {action, observable, reaction} from "mobx";

@inject("salesforceApi", "userStore")
@observer
export default class NotificationCookBook extends Component {

    viewModel = new NotificationCookBookVM(this.props.userStore, this.props.salesforceApi)

    @disposeOnUnmount
    getCookBookListErrorDisposer = reaction(() => this.viewModel.dataRequest.error,
        (error) => {
            if (error && !this.viewModel.dataRequest.isRefreshFetching && this.viewModel.dataRequest.data && this.viewModel.dataRequest.data.length > 0) {
                this.showErrorSnackbar();
            }
        })
    @observable
    isShowSnackbar = false
    @disposeOnUnmount
    isShowSnackbarDisposer = reaction(() => this.isShowSnackbar,
        (isShowSnackbar) => {
            if (isShowSnackbar) {
                Snackbar.show({
                    title: 'Failed to get Cook Book list',
                    duration: Snackbar.LENGTH_INDEFINITE,
                    action: {
                        title: 'RETRY',
                        color: '#2196F3',
                        onPress: this.requestData,
                    },
                });
            } else {
                Snackbar.dismiss();
            }
        })

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

    @action
    setIsShowSnackbar(isShowSnackbar) {
        this.isShowSnackbar = isShowSnackbar
    }

    renderItem = ({item, index}) =>
        (<View backgroundColor='#CC0000'>
            <View style={{backgroundColor: '#fff'}}>
                <TouchableOpacity onPress={() => Actions.CookBookReportDetail({cookBook: item})}>
                    <ListItem
                        key={0}
                        title={item.Name}
                        titleStyle={styles.itemTitle}
                        subtitle={item.Scheduled_Date__c}
                        subtitleStyle={styles.itemSubTitle}
                    />
                </TouchableOpacity>
            </View>


            <View style={{backgroundColor: '#fff'}}>
                <Divider style={{marginLeft: 50}}/>
            </View>

        </View>);


    renderPaginationProgress = () => (
        <ActivityIndicator size="large" color="#2196F3"/>
    )

    showErrorSnackbar() {
        this.setIsShowSnackbar(true)
    }

    onRefresh = () => {
        this.requestData(true)
    }
    requestData = (withRefreshing = false) => {
        if (this.viewModel.dataRequest.isFetching || (!withRefreshing && !this.viewModel.dataRequest.canLoadNext)) return;

        this.setIsShowSnackbar(false)

        this.viewModel.requestData(withRefreshing)
    }

    * renderViews() {
        const {isFetching, isRefreshFetching, canLoadNext, error} = this.viewModel.dataRequest;
        const data = this.viewModel.data

        yield <Header
            headerRight={this.header_right}/>;

        yield <SearchBar
            placeholder="Search"
            onChangeText={this.viewModel.updateSearch}
            value={this.viewModel.search}
            searchIcon={<Feather name="search" size={25} color="#707070"/>}
            inputContainerStyle={styles.searchBar_in}
            containerStyle={styles.searchBar_out}
        />;

        const isEmpty = !data || data.length === 0;

        if (!isEmpty) {
            yield <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                renderItem={this.renderItem}
                refreshing={isRefreshFetching}
                onRefresh={this.onRefresh}
                onEndReached={!isFetching && canLoadNext && !this.isShowSnackbar ? this.requestData : null}
                ListFooterComponent={isFetching && !isRefreshFetching ? this.renderPaginationProgress : undefined}
            />;
        } else if (isFetching) {
            yield <ActivityIndicator style={styles.progress} size="large" color="#2196F3"/>
        } else {
            yield <FlatAlert
                onRetryPress={this.requestData}
                message={error ? error.message : "Cook Book list is empty"}/>
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {[...this.renderViews()]}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#fff',
    },
    headerRight: {
        flexDirection: 'row',
    },
    searchBar_out: {
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 30,
        borderColor: '#707070',
        borderWidth: 1,
        paddingVertical: 4
    },
    searchBar_in: {
        backgroundColor: '#fff',
        borderRadius: 30,
    },
    itemTitle: {
        fontSize: 18,
        //   fontWeight: 'bold'
    },
    itemSubTitle: {
        color: '#707070',
        fontSize: 14,
    },
    progress: {
        flex: 1,
    }
});




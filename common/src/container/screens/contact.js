import React, {Component} from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
} from 'react-native';
import {Divider, SearchBar} from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import AlphabetListView from 'react-native-alphabetlistview';
import Snackbar from "react-native-snackbar";
import {inject, observer, disposeOnUnmount} from "mobx-react";
import ContactViewModel from "../../view-models/contact";
import {reaction} from "mobx";
import Header from "../../views/header";
import FlatAlert from "../../views/flat-alert";
import {ContactModal} from "../../views/contact/contact-modal";


class SectionHeader extends Component {
    render() {
        // inline styles used for brevity, use a stylesheet when possible
        var textStyle = {
            marginHorizontal: 20,
            paddingVertical: 2,
            fontWeight: 'bold',
            fontSize: 16
        };

        var viewStyle = {
            backgroundColor: '#ccc'
        };
        return (
            <View style={viewStyle}>
                <Text style={textStyle}>{this.props.title}</Text>
            </View>
        );
    }
}

class SectionItem extends Component {
    render() {
        return (
            <Text style={{
                color: '#2196F3',
                fontSize: 14,
                fontWeight: 'bold',
                marginHorizontal: 5
            }}>{this.props.title}</Text>
        );
    }
}

class Cell extends Component {
    render() {
        return (
            <TouchableOpacity style={{backgroundColor: '#fff'}} onPress={() => this.props.onClick(this.props.item)}>
                <View style={{height: 35, justifyContent: 'center', marginHorizontal: 20}}>
                    <Text>{this.props.item.Name}</Text>
                </View>
                <Divider style={{marginLeft: 20}}/>
            </TouchableOpacity>
        );
    }
}

@inject("contactStore", "userStore")
@observer
export default class Contact extends Component {

    state = {
        isShowSnackbar: false,

        displayedContact: undefined
    };

    viewModel = new ContactViewModel(this.props.contactStore, this.props.userStore)

    @disposeOnUnmount
    getContactListErrorDisposer

    componentDidMount() {
        this.getContactListErrorDisposer = reaction(() => this.props.contactStore.contactList.error,
            (error) => {
                if (!this.props.contactStore.contactList.isRefreshFetching && this.props.contactStore.contactList.data) {
                    this.showErrorSnackbar();
                }
            })
    }

    onRefresh = () => {
        this.requestData(true);
    }

    requestData = (reloading = false) => {
        if (this.props.contactStore.contactList.isFetching || (!reloading && !this.props.contactStore.contactList.canLoadNext)) return;

        Snackbar.dismiss();

        this.props.contactStore.requestContacts(this.props.userStore, reloading)
    }

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

    showErrorSnackbar() {
        this.setState({isShowSnackbar: true});

        Snackbar.show({
            title: 'Failed to get Contact list',
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
                title: 'RETRY',
                color: '#2196F3',
                onPress: this.requestData,
            },
        });
    }

    * renderViews() {
        const {error, isFetching, isRefreshFetching, canLoadNext} = this.props.contactStore.contactList;
        const data = this.viewModel.sortedContactList;

        yield <StatusBar barStyle="light-content" backgroundColor="#347fd5"/>

        yield <Header
            title="Contacts"
            headerRight={this.header_right}/>

        yield <SearchBar
            placeholder="Search"
            onChangeText={this.viewModel.setSearch}
            value={this.viewModel.search}
            searchIcon={<Feather name="search" size={25} color="#707070"/>}
            inputContainerStyle={styles.searchBar_in}
            containerStyle={styles.searchBar_out}
        />

        if (data) {
            yield <AlphabetListView
                data={data}
                cell={Cell}
                cellProps={{onClick: this.openContactModal}}
                cellHeight={30}
                sectionListItem={SectionItem}
                sectionHeader={SectionHeader}
                sectionHeaderHeight={22.5}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshFetching}
                        onRefresh={this.onRefresh}
                    />
                }
                onEndReached={!isFetching && canLoadNext && !this.state.isShowSnackbar ? this.requestData : null}
                ListFooterComponent={isFetching && !isRefreshFetching ? this.renderPaginationProgress : undefined}
            />
        } else if (isFetching) {
            yield <ActivityIndicator style={styles.progress} size="large" color="#2196F3"/>
        } else {
            yield <FlatAlert
                onRetryPress={this.requestData}
                message={error ? error.message : "Contact list is empty"}/>
        }
    }

    renderPaginationProgress = () => (
        <ActivityIndicator size="large" color="#2196F3"/>
    )

    openContactModal = (contact) => this.setState({
        displayedContact: contact,
    });

    closeContactModal = () => this.setState({
        displayedContact: null,
    });

    render() {
        return (
            <View style={styles.container}>
                {[...this.renderViews()]}
                <ContactModal
                    contact={this.state.displayedContact}
                    onClose={this.closeContactModal}/>
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
    progress: {
        flex: 1,
    },
});




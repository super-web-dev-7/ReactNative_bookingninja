import React, {Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Divider, ListItem, SearchBar,} from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import ModalDropdown from 'react-native-modal-dropdown';
import {Actions} from 'react-native-router-flux';
import Swipeout from 'react-native-swipeout';
import Snackbar from 'react-native-snackbar';
import FlatAlert from "../../views/flat-alert";
import {showLongToast} from "../../utils/toast-utils";
import {inject} from "mobx-react";
import Header from "../../views/header";


const options = {
    DIRTY_ROOMS: 'Dirty rooms',
    CLEAN_ROOMS: 'Clean rooms',
}

const swipeoutBtns = [
    {
        text: 'Delete',
        backgroundColor: '#CC0000',
    }
]

@inject("salesforceApi", "userStore")
export default class Notification extends Component {

    state = {
        search: '',
        isSelected: true,
        markColor: '#ffffff',

        selectedDataType: options.DIRTY_ROOMS,

        isFetching: false,
        isRefreshFetching: false,
        isShowSnackbar: false,

        isAllCleanDataLoaded: false,
        nextCleanUrl: undefined,
        clean: undefined,
        cleanError: undefined,

        isAllDirtyDataLoaded: false,
        nextDirtyUrl: undefined,
        dirty: undefined,
        dirtyError: undefined,

        confirmCleanPosition: undefined
    };

    updateSearch = search => {
        this.setState({search});
    };


    header_center = () => {
        return (
            <View style={styles.headerCenter}>
                <ModalDropdown
                    options={Object.keys(options).map(key => options[key])}
                    animated={true}
                    defaultValue={this.state.selectedDataType}
                    textStyle={{color: '#fff', fontSize: 16, fontWeight: 'bold',}}
                    dropdownTextStyle={{color: '#333', fontSize: 14,}}
                    dropdownTextHighlightStyle={{color: '#2196F3', fontSize: 14, fontWeight: 'bold',}}
                    dropdownStyle={{height: 75}}
                    onSelect={this.selectDataType}
                />
            </View>
        );
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

    confirmClean = (item, index) => () => {
        const dirty = this.state.dirty;

        const dirtyIndex = dirty.indexOf(item);

        if (dirtyIndex < 0) return;

        this.setState({confirmCleanPosition: index});

        this.props.salesforceApi.updateData(this.props.userStore, item.attributes.type, item.Id, this.props.salesforceApi.UNIT_PARAMETERS, {
            Status__c: "Clean",
        }).then(newData => {

            const clean = this.state.clean;
            if (clean) {
                clean.unshift(newData)
            }
            dirty.splice(dirtyIndex, 1)

            this.setState({
                confirmCleanPosition: undefined,
                dirty,
                clean,
            });

        }).catch(error => {
            this.setState({confirmCleanPosition: undefined});

            console.tron.error(error.message, error.stack)

            showLongToast(`Failed to set ${item.Name} cleaned`);
        });
    }

    markItemAsClean = (item, index) => Alert.alert(
        `Do you want to mark ${item.Name} as clean?`,
        null,
        [
            {text: 'Cancel', onPress: () => console.tron.log('Cancel Pressed')},
            {text: 'Mark as clean', onPress: this.confirmClean(item, index)},
        ],
        {cancelable: true},
    );

    componentDidMount() {
        this.requestData(true);
    }

    requestData = (reloading = false) => {
        const currentState = this.currentState;

        if (this.state.isFetching || (!reloading && !currentState.canLoadNext)) return;

        Snackbar.dismiss();

        this.setState({
            isFetching: true,
            isShowSnackbar: false,
        });

        const isDataEmpty = !currentState.data || currentState.data.length === 0;

        switch (this.state.selectedDataType) {
            case options.CLEAN_ROOMS:
                this.requestCleanData(reloading, isDataEmpty);
                break;
            default:
            case options.DIRTY_ROOMS:
                this.requestDirtyData(reloading, isDataEmpty);
                break;
        }
    }

    requestCleanData(reloading, isPrevDataEmpty) {
        this.props.salesforceApi.paginationQuery(this.props.userStore, this.props.salesforceApi.QUERY_CLEAN_UNIT, !reloading ? this.state.nextCleanUrl : undefined)
            .then(({data, done, nextUrl}) => {
                this.setState({
                    isFetching: false,
                    isRefreshFetching: false,

                    clean: reloading ? data : [...this.state.clean, ...data],
                    cleanError: null,
                    isaAllCleanDataLoaded: done,
                    nextCleanUrl: nextUrl,
                })
            })
            .catch(error => {
                console.tron.error(error.message, error.stack);

                this.setState({
                    isFetching: false,
                    isRefreshFetching: false,
                    cleanError: error,
                });

                if (!reloading && !isPrevDataEmpty) {
                    this.showErrorSnackbar();
                }
            })
    }

    requestDirtyData(reloading, isPrevDataEmpty) {
        this.props.salesforceApi.paginationQuery(this.props.userStore, this.props.salesforceApi.QUERY_DIRTY_UNIT, !reloading ? this.state.nextDirtyUrl : undefined)
            .then(({data, done, nextUrl}) => {
                this.setState({
                    isFetching: false,
                    isRefreshFetching: false,

                    dirty: reloading ? data : [...this.state.dirty, ...data],
                    dirtyError: null,
                    isaAllDirtyDataLoaded: done,
                    nextDirtyUrl: nextUrl,
                })
            })
            .catch(error => {
                console.tron.error(error.message, error.stack);

                this.setState({
                    isFetching: false,
                    isRefreshFetching: false,
                    dirtyError: error,
                });

                if (!reloading && !isPrevDataEmpty) {
                    this.showErrorSnackbar();
                }
            })
    }

    get currentState() {
        switch (this.state.selectedDataType) {
            case options.CLEAN_ROOMS:
                return {
                    data: this.state.clean,
                    error: this.state.cleanError,
                    canLoadNext: !this.state.isAllCleanDataLoaded && this.state.nextCleanUrl,
                };
            default:
            case options.DIRTY_ROOMS:
                return {
                    data: this.state.dirty,
                    error: this.state.dirtyError,
                    canLoadNext: !this.state.isAllDirtyDataLoaded && this.state.nextDirtyUrl,
                };
        }
    }

    onRefresh = () => {
        if (this.state.isFetching) return;

        this.setState({isRefreshFetching: true});
        this.requestData(true);
    }

    getRightItemElement = (item, index) => () => {
        if (item.Status__c !== "Dirty") return null;

        if (this.state.confirmCleanPosition === index) {
            return TouchableOpacity
        } else {
            return <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity style={styles.markItem} onPress={() => this.markItemAsClean(item, index)}>
                    <TouchableOpacity style={{
                        width: 20,
                        height: 20,
                        backgroundColor: this.state.isSelected ? '#2196F3' : '#FFFFFF'
                    }} disabled={true}/>
                </TouchableOpacity>
                <Text style={{color: '#707070'}}>mark as clean</Text>
            </View>
        }
    }

    renderItem = ({item, index}) =>
        (<Swipeout right={swipeoutBtns}
                   backgroundColor='#CC0000'
                   autoClose={true}
        >
            <View style={{backgroundColor: '#fff'}}>
                <TouchableOpacity onPress={() => Actions.HouseKeeper({selectedRoom: item})}>
                    <ListItem
                        key={0}
                        title={item.Name}
                        titleStyle={styles.itemTitle}
                        subtitle={'Second floor right wing'}
                        subtitleStyle={styles.itemSubTitle}
                        leftElement={
                            <Image source={require('../../Assets/roomkey.png')} style={{width: 25, height: 30,}}/>
                        }
                        rightElement={this.getRightItemElement(item, index)}
                    />
                </TouchableOpacity>
            </View>


            <View style={{backgroundColor: '#fff'}}>
                <Divider style={{marginLeft: 50}}/>
            </View>

        </Swipeout>);


    renderPaginationProgress = () => (
        <ActivityIndicator size="large" color="#2196F3"/>
    )

    showErrorSnackbar() {
        this.setState({isShowSnackbar: true});

        Snackbar.show({
            title: 'Failed to get Notification list',
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
                title: 'RETRY',
                color: '#2196F3',
                onPress: this.requestData,
            },
        });
    }

    selectDataType = (index, value) => {
        this.setState({
            selectedDataType: value
        }, () => {
            if (!this.currentState.data) {
                this.requestData(true)
            }
        });
    }

    * renderViews() {
        const {isFetching, isRefreshFetching} = this.state;

        yield <Header
            headerCenter={this.header_center}
            headerRight={this.header_right}/>;

        yield <SearchBar
            placeholder="Search"
            onChangeText={this.updateSearch}
            value={this.state.search}
            searchIcon={<Feather name="search" size={25} color="#707070"/>}
            inputContainerStyle={styles.searchBar_in}
            containerStyle={styles.searchBar_out}
        />;

        const currentState = this.currentState;
        const isEmpty = !currentState.data || currentState.data.length === 0;

        if (!isEmpty) {
            yield <FlatList
                showsVerticalScrollIndicator={false}
                data={currentState.data}
                renderItem={this.renderItem}
                refreshing={isRefreshFetching}
                onRefresh={this.onRefresh}
                extraData={[this.state.confirmCleanPosition, this.state.isSelected]}
                onEndReached={!isFetching && currentState.canLoadNext && !this.state.isShowSnackbar ? this.requestData : null}
                ListFooterComponent={isFetching && !isRefreshFetching ? this.renderPaginationProgress : undefined}
            />;
        } else if (isFetching) {
            yield <ActivityIndicator style={styles.progress} size="large" color="#2196F3"/>
        } else {
            yield <FlatAlert
                onRetryPress={this.requestData}
                message={currentState.error ? currentState.error.message : "Notification list is empty"}/>
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
    headerCenter: {
        width: '100%',
        marginLeft: 80,
        flexDirection: 'row',
        alignItems: 'flex-start',
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
    listItemContainer: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    itemTitle: {
        fontSize: 18,
        //   fontWeight: 'bold'
    },
    itemSubTitle: {
        color: '#707070',
        fontSize: 14,
    },
    markItem: {
        borderColor: '#707070',
        borderWidth: 0.5,
        width: 25,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progress: {
        flex: 1,
    },
    itemProgress: {
        paddingEnd: 24,
    },
});




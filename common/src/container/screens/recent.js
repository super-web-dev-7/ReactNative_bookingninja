import React, {Component} from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, ListItem, SearchBar} from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import ModalDropdown from 'react-native-modal-dropdown';
import Swipeout from 'react-native-swipeout';
import Header from "../../views/header";

const options = [
    'All Calls',
    'Missed Calls',
]

const swipeoutBtns = [
    {
        text: 'Delete',
        backgroundColor: '#CC0000',
    }
]

const mock_data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,];
export default class Recent extends Component {

    state = {
        search: '',
    };

    updateSearch = search => {
        this.setState({search});
    };

    header_center = () => {
        return (
            <View style={styles.headerCenter}>
                <ModalDropdown options={options}
                               animated={true}
                               defaultIndex={0}
                               defaultValue='All Calls'
                               textStyle={{color: '#fff', fontSize: 16, fontWeight: 'bold',}}
                               dropdownTextStyle={{color: '#333', fontSize: 14,}}
                               dropdownTextHighlightStyle={{color: '#2196F3', fontSize: 14, fontWeight: 'bold',}}
                               dropdownStyle={{height: 75}}
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

    handleSetting = () => {

    }

    render() {
        const {search} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" style={styles.statusBar} backgroundColor="#347fd5"/>
                <Header
                    headerCenter={this.header_center}
                    headerRight={this.header_right}/>
                <SearchBar
                    placeholder="Search"
                    onChangeText={this.updateSearch}
                    value={search}
                    searchIcon={<Feather name="search" size={25} color="#707070"/>}
                    inputContainerStyle={styles.searchBar_in}
                    containerStyle={styles.searchBar_out}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={mock_data}
                    renderItem={({item}) =>
                        <Swipeout right={swipeoutBtns}
                                  backgroundColor='#CC0000'
                                  autoClose={true}
                        >
                            <ListItem
                                key={0}
                                title={'+31 (76) 5024750'}
                                titleStyle={styles.itemTitle}
                                subtitle={'Unknown (6:49)'}
                                rightTitle={'Today'}
                                subtitleStyle={styles.itemSubTitle}
                                rightTitleStyle={styles.itemRightTitle}
                                leftIcon={{name: 'call-in', type: 'simple-line-icon', color: '#707070'}}
                                rightIcon={{name: 'ios-information-circle-outline', type: 'ionicon', color: '#2196F3'}}
                            />
                            <View style={{backgroundColor: '#fff'}}>
                                <Divider style={{marginLeft: 50}}/>
                            </View>

                        </Swipeout>
                    }
                />
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
    itemRightTitle: {
        color: '#707070',
        fontSize: 14,
    }

});




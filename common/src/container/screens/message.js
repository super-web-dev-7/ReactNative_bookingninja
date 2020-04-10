import React, {Component} from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider, ListItem, SearchBar} from 'react-native-elements'
import Feather from 'react-native-vector-icons/Feather';
import Swipeout from 'react-native-swipeout';
import Header from "../../views/header";

const swipeoutBtns = [
    {
        text: 'Delete',
        backgroundColor: '#CC0000',
    }
]

const mock_data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,];

export default class Message extends Component {

    state = {
        search: '',
    };

    updateSearch = search => {
        this.setState({search});
    };

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
                <StatusBar barStyle="light-content" backgroundColor="#347fd5"/>
                <Header
                    title="Messages"
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
                                title={'Adrian Perez'}
                                titleStyle={styles.itemTitle}
                                subtitle={'Hi, Adrian. Nice to meet you.'}
                                rightTitle={'Today'}
                                rightTitleStyle={styles.itemRightTitle}
                                subtitleStyle={styles.itemSubTitle}
                                leftAvatar={{source: {uri: 'https://randomuser.me/api/portraits/men/41.jpg',}}}
                            />
                            <View style={{backgroundColor: '#fff'}}>
                                <Divider style={{marginLeft: 35}}/>
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
        fontSize: 16,
        //   fontWeight: 'bold'
    },
    itemSubTitle: {
        color: '#707070',
        fontSize: 14,
        height: 20,
        marginRight: -98,
    },
    itemRightTitle: {
        color: '#707070',
        fontSize: 14,
        marginTop: -25,
    },

});




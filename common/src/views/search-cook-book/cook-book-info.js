import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CookBookInfoItem, {
  CookBookInfoAccentItem
} from '../cook-book-report/cook-book-info-item';

export default class CookBookInfo extends Component {
  render() {
    return (
      <View style={this.props.containerStyle}>
        <View style={styles.title}>
          <View style={styles.titlePicture}>
            <Icon name='md-contact' size={40} color='#0883ED' />
          </View>
          <View style={styles.titleInfo}>
            <CookBookInfoAccentItem
              isLinking
              title='Contact name'
              info={
                this.props.cookBook.Contact__r &&
                this.props.cookBook.Contact__r.Name
              }
              type='title'
            />
            <CookBookInfoItem
              title='Title'
              info={this.props.cookBook.Title__c}
              type='title'
            />
          </View>
        </View>
        <CookBookInfoItem
          title='Scheduled Date'
          info={this.props.cookBook.Scheduled_Date__c}
        />
        <CookBookInfoItem
          title='Interest level'
          info={this.props.cookBook.Interest_Level__c}
        />
        <CookBookInfoItem
          title='Call Result'
          info={this.props.cookBook.Call_Result__c}
        />
        <CookBookInfoAccentItem
          isLinking
          title='Linkedin'
          info={
            this.props.cookBook.Contact__r &&
            this.props.cookBook.Contact__r.LinkedIN__c
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 72
  },
  titlePicture: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleInfo: { flex: 3 }
});

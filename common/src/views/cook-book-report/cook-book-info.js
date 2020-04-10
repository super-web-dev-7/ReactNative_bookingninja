import React, { Component } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import CookBookInfoItem, {
  CookBookInfoAccentItem,
  CookBookInfoCallItem
} from './cook-book-info-item';
import { CheckBox } from 'react-native-elements';
import { getSalesforceTime } from '../../utils/data-utils';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ContactModal } from '../contact/contact-modal';

@observer
export default class CookBookInfo extends Component {
  @observable
  openedContact = null;

  onEmailClick = email => () => {
    Linking.openURL(`mailto:${email}`);
  };

  onLinkedInClick = linkedIn => () => {
    Linking.openURL(linkedIn);
  };

  @action
  onOpenContact = contact => () => {
    this.openedContact = contact;
  };

  @action
  onCloseContact = () => {
    this.openedContact = null;
  };

  render() {
    return (
      <View style={styles.container}>
        <CookBookInfoItem
          title='Cook book Name'
          info={this.props.cookBook.Name}
        />
        <CookBookInfoAccentItem
          title='Contact name'
          isLinking
          info={
            this.props.cookBook.Contact__r &&
            this.props.cookBook.Contact__r.Name
          }
          onPress={
            this.props.cookBook.Contact__r &&
            this.onOpenContact(this.props.cookBook.Contact__r)
          }
        />
        <CookBookInfoItem title='Title' info={this.props.cookBook.Title__c} />
        <CookBookInfoItem
          title='Account'
          info={
            this.props.cookBook.Contact__r &&
            this.props.cookBook.Contact__r.Account.Name
          }
        />
        <CookBookInfoAccentItem
          title='Email'
          info={
            this.props.cookBook.Contact__r &&
            this.props.cookBook.Contact__r.Email
          }
          onPress={
            this.props.cookBook.Contact__r &&
            this.props.cookBook.Contact__r.Email &&
            this.onEmailClick(this.props.cookBook.Contact__r.Email)
          }
        />
        <CookBookInfoCallItem
          title='Mobile'
          number={this.props.cookBook.Mobile__c}
        />
        <CookBookInfoCallItem
          title='Phone'
          number={this.props.cookBook.Phone__c}
        />
        <CookBookInfoCallItem
          title='2nd phone'
          number={this.props.cookBook.X2nd_Phone__c}
        />
        <CookBookInfoItem
          title='Account Executive'
          info={
            this.props.cookBook.Account_Executive__r &&
            this.props.cookBook.Account_Executive__r.Name
          }
        />
        <CookBookInfoItem
          title='Scheduled Date'
          info={this.props.cookBook.Scheduled_Date__c}
        />
        <CookBookInfoItem
          title='Scheduled Time'
          info={
            this.props.cookBook.Scheduled_Time__c &&
            getSalesforceTime(this.props.cookBook.Scheduled_Time__c).format(
              'hh:mm'
            )
          }
        />
        <CookBookInfoItem title='Type' info={this.props.cookBook.Type__c} />
        <CookBookInfoItem
          title='Interest level'
          info={this.props.cookBook.Interest_Level__c}
        />
        <CookBookInfoAccentItem
          title='Linkedin'
          isLinking
          info={
            this.props.cookBook.Contact__r &&
            this.props.cookBook.Contact__r.LinkedIN__c
          }
          onPress={
            this.props.cookBook.Contact__r &&
            this.props.cookBook.Contact__r.LinkedIN__c &&
            this.onLinkedInClick(this.props.cookBook.Contact__r.LinkedIN__c)
          }
        />
        <CookBookInfoItem
          title='Record Call?'
          info={
            <CheckBox
              checked={this.props.cookBook.Record_Call__c}
              disabled={true}
            />
          }
        />
        <CookBookInfoItem
          title='Created by'
          info={this.props.cookBook.CreatedBy.Name}
        />
        <ContactModal
          contact={this.openedContact}
          onClose={this.onCloseContact}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

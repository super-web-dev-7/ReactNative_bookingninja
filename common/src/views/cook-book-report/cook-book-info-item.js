import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { ActionsKeypad } from '../../container/screens/keypad';
import ModalDropdown from 'react-native-modal-dropdown';

export default function CookBookInfoItem({
  title,
  info,
  containerStyle,
  type = 'simple'
}) {
  if (type === 'title') {
    return (
      <View style={[styles.itemContainerM, containerStyle]}>
        {!info || typeof info === 'string' ? (
          <Text style={styles.nameText}>{info || '-'}</Text>
        ) : (
          info
        )}
      </View>
    );
  } else if (type === 'simple') {
    return (
      <View style={[styles.itemContainer, containerStyle]}>
        <View style={styles.leftColumn}>
          {typeof title === 'string' ? (
            <Text style={styles.secondaryText}>{title}</Text>
          ) : (
            title
          )}
        </View>

        <View style={styles.rightColumn}>
          {!info || typeof info === 'string' ? (
            <Text style={styles.defaultText}>{info || '-'}</Text>
          ) : (
            info
          )}
        </View>
      </View>
    );
  }
}

export function CookBookInfoCallItem({ title, number, containerStyle }) {
  return (
    <CookBookInfoItem
      containerStyle={containerStyle}
      title={title}
      info={
        <TouchableOpacity
          disabled={!number || number.length === 0}
          onPress={() =>
            ActionsKeypad({ phoneNumber: number.replace(/\D/g, '') })
          }
        >
          <View style={styles.callContainer}>
            <MaterialIcon size={14} name='phone' color='#2196F3' />
            <Text
              style={[
                styles.defaultText,
                styles.accentText,
                styles.callPhoneText
              ]}
            >
              {number || '-'}
            </Text>
          </View>
        </TouchableOpacity>
      }
    />
  );
}

export function CookBookInfoAccentItem({
  title,
  info,
  containerStyle,
  onPress,
  isLinking,
  type = 'simple'
}) {
  return (
    <CookBookInfoItem
      containerStyle={containerStyle}
      title={title}
      info={
        <Text
          style={
            title === 'Contact name'
              ? [styles.nameText, isLinking && styles.accentText]
              : [
                  styles.defaultText,
                  styles.linkingText,
                  isLinking && styles.accentText
                ]
          }
          onPress={onPress}
        >
          {info || '-'}
        </Text>
      }
      type={type}
    />
  );
}

export function CookBookInfoPickerItem({
  title,
  defaultValue,
  containerStyle,
  onSelect,
  options
}) {
  return (
    <CookBookInfoItem
      containerStyle={containerStyle}
      title={title}
      info={
        <ModalDropdown
          options={options}
          animated={true}
          defaultValue={defaultValue}
          textStyle={{ color: 'black', fontSize: 14 }}
          dropdownTextStyle={{
            color: 'black',
            fontSize: 14,
            paddingVertical: 8,
            paddingHorizontal: 16
          }}
          dropdownTextHighlightStyle={{
            color: '#2196F3',
            fontSize: 14,
            paddingVertical: 8,
            paddingHorizontal: 16
          }}
          onSelect={onSelect}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  leftColumn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 2
  },
  rightColumn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 3
  },
  itemContainer: {
    flexDirection: 'row',
    margin: 12
  },
  itemContainerM: { flexDirection: 'row' },
  defaultText: {
    fontWeight: '500',
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#4F5566'
  },
  secondaryText: {
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'Roboto'
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 19
  },
  titleText: {
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 20
  },
  callContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  callPhoneText: {
    marginLeft: 4
  },
  accentText: {
    color: '#2196F3'
  },
  linkingText: {
    textDecorationLine: 'underline'
  }
});

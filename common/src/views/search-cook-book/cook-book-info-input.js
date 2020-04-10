import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePicker from "react-native-modal-datetime-picker";
import {useObservable, observer} from "mobx-react-lite";
import moment from "moment";

export default function CookBookInfoInput({title, input, options, defaultValue, onSelect}) {
    return <View style={styles.itemContainer}>
        <View style={styles.leftColumn}>
            {typeof title === 'string' ?
                <Text style={styles.defaultText}>{title}</Text> :
                title}
        </View>
        <View style={styles.rightColumn}>
            {input ?
                input :
                <ModalDropdown
                    options={options}
                    animated={true}
                    defaultValue={defaultValue}
                    textStyle={{color: 'black', fontSize: 16, fontWeight: 'bold',}}
                    dropdownStyle={{width: '100%', paddingVertical: 8}}
                    dropdownTextStyle={{color: 'black', fontSize: 14,}}
                    dropdownTextHighlightStyle={{color: '#2196F3', fontSize: 14, fontWeight: 'bold',}}
                    onSelect={onSelect}
                />}
        </View>
    </View>
}

export const CookBookInfoPickerInput = observer(({title, selectedDate, onSelect, minimumDate, maximumDate}) => {
    const observable = useObservable({
        isVisible: false
    })

    const close = () => {
        observable.isVisible = false
    }
    const visible = () => {
        observable.isVisible = true
    }

    return <CookBookInfoInput
        title={title}
        input={
            <View>
                <TouchableOpacity onPress={visible}>
                    <Text
                        style={styles.defaultText}>{selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : 'Please select...'}</Text>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={observable.isVisible}
                    date={selectedDate}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    onConfirm={(date) => {
                        onSelect(date)
                        close()
                    }}
                    onCancel={close}
                />
            </View>
        }
    />
})

const styles = StyleSheet.create({
    leftColumn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flex: 2,
    },
    rightColumn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flex: 3,
    },
    itemContainer: {
        flexDirection: 'row',
    },
    defaultText: {
        fontWeight: 'bold',
        fontSize: 14,
    }
})

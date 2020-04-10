import {StatusBar, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    HeaderStyle: {
        marginTop: -(StatusBar.currentHeight || 0)
    }
})

const HeaderStyle = styles.HeaderStyle

export default HeaderStyle
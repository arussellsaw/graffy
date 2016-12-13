import {
    StyleSheet
} from 'react-native';

export var backgroundColor = '#333333';
export var brandPrimary = '#FFB300';
export var fontColor = '#FFFFFF';

export default Styles = StyleSheet.create({
    container: {
        backgroundColor: backgroundColor,
        paddingTop: 20,
        flex: 3,
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
    },
    header: {
        height: 40,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    sideIconLeft: {
        marginTop: 10,
        marginRight: 50,
    },
    sideIconRight: {
        marginTop: 10,
        marginLeft: 50,
    },
    bodyText: {
        color: fontColor,
    },
    headerText: {
        color: fontColor,
        fontSize: 30,
    },
    listBody: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
    },
    panel: {
        marginBottom: 5,
    },
    modal: {
        borderRadius: 2,
        marginHorizontal: 20,
        marginVertical: 0,
        height: 400,
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: backgroundColor,
    },
    modalText: {
        fontSize: 20,
        paddingBottom: 15,
        color: fontColor,
    },
    modalTitle: {
        fontSize: 30,
        paddingBottom: 15,
        color: fontColor,
    },
    templateVar: {
        flex: 1,
        flexDirection: 'row',
    }
});

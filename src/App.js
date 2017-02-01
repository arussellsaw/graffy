import React, {Component, PropTypes} from 'react';
import {
    View,
    ScrollView,
    ListView,
    StatusBar,
    Text,
    TextInput,
    RefreshControl,
    Picker,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-simple-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux'
import * as actions from './actions'
import * as dataStore from './store'
import Styles from './styles'
import Graph from './components/graph'

export class App extends Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let dlds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            dataSource: ds,
            dashboardListDataSource: dlds
        };

        getGrafanaKey((key) => {
            this.props.dispatch(actions.recieveGrafanaKey(key))
        }).done()
        getGrafanaUrl((url) => {
            this.props.dispatch(actions.recieveGrafanaUrl(url))
        }).done()

        this.getTemplateVar = this.getTemplateVar.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderListModal = this.renderListModal.bind(this);
        this.renderTemplateModal = this.renderTemplateModal.bind(this);
        this.renderSettingsModal = this.renderSettingsModal.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (
            (!nextProps.dashboard.openSettingsModal) &&
            (nextProps.dashboard.url != '' && nextProps.dashboard.apiKey != '') &&
            (nextProps.dashboard.url != null && nextProps.dashboard.apiKey != null) &&
            (this.props.dashboard.apiKey != nextProps.dashboard.apiKey ||
            this.props.dashboard.url != nextProps.dashboard.url)
        ) {
            const { dispatch, dashboard, dashboardList } = nextProps
            dispatch(fetchDashboardList(dashboard.url,dashboard.apiKey))
            dispatch(
                actions.fetchDashboard(
                    dashboardList.selectedDashboard,
                    dashboard.url,
                    dashboard.apiKey
                )
            )
        }
        if (nextProps.dashboardList.selectedDashboard !== this.props.dashboardList.selectedDashboard) {
            const { dispatch, dashboardList, dashboard} = nextProps
            dispatch(actions.fetchDashboard(dashboardList.selectedDashboard, dashboard.url, dashboard.apiKey))
        }
        if (nextProps.panelList !== this.props.panelList) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.panelList)
            })
        }
        if (nextProps.dashboardList.list !== this.props.dashboardList.list) {
            this.setState({
                dashboardListDataSource: this.state.dashboardListDataSource.cloneWithRows(
                    nextProps.dashboardList.list
                    )
            })
        }
    }

    getTemplateVar(key) {
        if (this.props.template == undefined) {
            return null
        }
        var vars = this.props.template.vars;
        for (i = 0; i < vars.length; i++) {
            if (vars[i].key === key) {
                return vars[i].value
            }
        }
        return null
    }

    renderRow(rowData, sectionID, rowID, highlightRow) {
        var vars = []
        if (this.props.template != undefined) {
            vars = this.props.template.vars
        }
        var {dispatch} = this.props;
        return (
            <View>
                <Graph
                    dashboardName={this.props.dashboardList.selectedDashboard}
                    rowData={rowData}
                    url={this.props.dashboard.url}
                    apiKey={this.props.dashboard.apiKey}
                    renderIndex={rowID}
                    renderProgress={this.props.renderProgress}
                    templateVars={vars}
                    dispatch={dispatch}
                />
            </View>
        )
    }

    renderTemplateModal() {
        let {dispatch, dashboard, dashboardList, template} = this.props;
        var templating = [];
        if (dashboard.dashboardJSON.dashboard != undefined) {
            templating = dashboard.dashboardJSON.dashboard.templating.list
        }
        return (
            <Modal
                open={dashboard.openTemplateModal}
                animationDuration={200}
                animationTension={40}
                closeOnTouchOutside={false}
                modalStyle={Styles.modal}
                >
                <ScrollView>
                    <View style={{marginTop: 20}}>
                        {
                            templating.map((row,key) => {
                                var selected = this.getTemplateVar(row.name)
                                if (selected === null) {
                                    selected = row.current.value
                                }
                                return (
                                    <View key={key} style={{}}>
                                        <Text style={Styles.modalText}>{row.name}</Text>
                                        {row.options.map((val,key2) => {
                                            var fontWeight = '300'
                                            if (val.value === selected) {
                                                fontWeight = '700'
                                            }
                                            return (
                                                <TouchableOpacity key={key2} onPress={() => {
                                                    dispatch(setTemplateVar(row.name,val.text))
                                                }}>
                                                    <Text style={[
                                                        Styles.modalText, 
                                                        {fontWeight: fontWeight, fontSize: 15}
                                                        ]}>{val.text}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                )
                            })
                        }
                    </View>

                    <TouchableOpacity onPress={() => {
                        dispatch(closeTemplateModal())
                        dispatch(refreshDashboard(
                            dashboardList.selectedDashboard, 
                            dashboard.url, 
                            dashboard.apiKey
                            ));
                    }}>
                        <Text style={Styles.modalText}>close</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Modal>
        )
    }

    renderListModal() {
        let {dispatch, dashboard, dashboardList} = this.props;
        return (
            <Modal
                open={dashboardList.openModal}
                animationDuration={200}
                animationTension={40}
                closeOnTouchOutside={false}
                modalStyle={Styles.modal}
                >
                <ListView
                    style={Styles.dashboardList}
                    dataSource={this.state.dashboardListDataSource}
                    renderRow={rowData => {
                        return (
                            <TouchableOpacity onPress={() => {
                                dispatch(actions.recieveDashboard({}));
                                dispatch(actions.selectDashboard(rowData.uri.replace("db/","")))
                                dispatch(actions.toggleDashboardList())
                            }}>
                                <Text style={Styles.modalText}>{rowData.title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                    />
            </Modal>
        )
    }

    renderSettingsModal() {
        let {dispatch, dashboard} = this.props;
        return (
            <Modal
                open={dashboard.openSettingsModal}
                animationDuration={200}
                animationTension={40}
                closeOnTouchOutside={false}
                modalStyle={Styles.modal}
                >
                <View>
                    <Text style={Styles.modalTitle}>config</Text>
                    <TextInput
                    style={{height: 20, width: 300, color: '#FFFFFF', marginBottom: 20}}
                    placeholderTextColor={'#EBEBEB'}
                    autoCorrect={false}
                    autoCapitalise={'none'}
                    placeholder={'api key'}
                    onChangeText={(value) => {
                        dispatch(recieveGrafanaKey(value))
                    }}
                    value={dashboard.apiKey}
                    />
                    <TextInput
                    style={{height: 20, width: 300, color: '#FFFFFF'}}
                    autoCorrect={false}
                    autoCapitalise={'none'}
                    placeholder={'url'}
                    onChangeText={(value) => {
                        dispatch(recieveGrafanaUrl(value))
                    }}
                    value={dashboard.url}
                    />
                    <TouchableOpacity onPress={() => {
                        setGrafanaKey(dashboard.apiKey)
                        setGrafanaUrl(dashboard.url)
                        dispatch(closeSettingsModal())
                    }}>
                        <Text style={Styles.modalText}>save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    render() {
        let {dashboardList, dashboard, dispatch} = this.props;
        return (
            <View style={Styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <View style={Styles.header}>
                    <View style={Styles.headerContainer}>
                        <TouchableOpacity onPress={() => {
                            dispatch(openTemplateModal())
                        }}>
                            <View style={Styles.sideIconLeft}>
                                <Icon name="tags" size={20} color="#FFFFFF"/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            dispatch(toggleDashboardList());
                        }}>
                            <Text style={Styles.headerText}>{dashboardList.selectedDashboard}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            dispatch(openSettingsModal())
                        }}>
                            <View style={Styles.sideIconRight}>
                                <Icon name="gear" size={20} color="#FFFFFF"/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <ListView
                    style={Styles.listBody}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    removeClippedSubviews={true}
                    scrollRenderAheadDistance={1}
                    enableEmptySections={true}
                    pageSize={1}
                    refreshControl={
                        <RefreshControl
                            refreshing={dashboard.isFetching}
                            onRefresh={() => {
                                dispatch(refreshDashboard(
                                    dashboardList.selectedDashboard, 
                                    dashboard.url, 
                                    dashboard.apiKey
                                    ));
                            }}
                            tintColor={'#FFFFFF'}
                        />
                    }
                />
                {this.renderListModal()}
                {this.renderTemplateModal()}
                {this.renderSettingsModal()}
            </View>
        );
    }
}

App.propTypes = {
    dashboardList: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    panelList: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    dataSource: PropTypes.object,
}

function mapStateToProps(state) {
    const { dashboardList, dashboard, template} = state

    var list = [];

    if (dashboard.dashboardJSON.dashboard !== undefined) {
        dashboard.dashboardJSON.dashboard.rows.map(row => {
            row.panels.map(panel => {
                list.push(panel);
            })
        })
    }

    return {
        dashboardList,
        panelList: list,
        template,
        dashboard
    }
}

export default connect(mapStateToProps)(App);

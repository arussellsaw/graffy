import React, {Component} from 'react';
import {
    View,
    Dimensions,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import Image from 'react-native-image-progress';
import {
    incRenderProgress,
} from '../actions'

class Graph extends Component {

    constructor(props) {
        super(props)
        var dms = (Dimensions.get("window"))
        this.width = dms.width;
    }

    addVars(url, vars) {
        if (vars == undefined || vars.length == 0) {
            return url
        }
        for (i = 0; i < vars.length; i++) {
            url = url+"&var-"+vars[i].key+"="+vars[i].value
        }
        return url
    }

    renderPending() {
        return (
            <View style={Styles.panel}>
                <Text style={Styles.modalText}>Pending</Text>
            </View>
        )
    }

    render() {
        var dispatch = this.props.dispatch;
        var url = this.addVars(
            this.props.url+'/render/dashboard-solo/db/'+this.props.dashboardName+'?panelId='+this.props.rowData.id+'&width='+this.width * 2+'&height='+this.width+'&timeout=60',
            this.props.templateVars
        )
        console.log(this.props.renderIndex, this.props.renderProgress)
        if (this.props.renderIndex < this.props.renderProgress) {
            return this.renderPending()
        }
        return (
            <View style={Styles.panel}>
                <Image style={{width: this.width, height: this.width / 2}} source={{
                    uri: url,
                    headers: {
                        'Authorization': 'Bearer '+this.props.apiKey
                    }
                }}
                indicator={ProgressBar}
                onLoad={()=>{dispatch(incRenderProgress())}}
                />
            </View>
        );
    }

}

function mapStateToProps(state) {
    const { renderProgress } = state

    return {
        renderProgress,
    }
}

export default connect(mapStateToProps)(Graph);

export const REQUEST_DASHBOARDLIST = 'REQUEST_DASHBOARDLIST';
export const RECIEVE_DASHBOARDLIST = 'RECIEVE_DASHBOARDLIST';
export const TOGGLE_DASHBOARDLIST = 'TOGGLE_DASHBOARDLIST';
export const SELECT_DASHBOARD = 'SELECT_DASHBOARD';
export const REQUEST_DASHBOARD = 'REQUEST_DASHBOARD';
export const RECIEVE_DASHBOARD = 'RECIEVE_DASHBOARD';
export const REFRESH_DASHBOARD = 'REFRESH_DASHBOARD';
export const RECIEVE_GRAFANAKEY = 'RECIEVE_GRAFANAKEY';
export const RECIEVE_GRAFANAURL = 'RECIEVE_GRAFANAURL';
export const OPEN_TEMPLATEMODAL = 'OPEN_TEMPLATEMODAL';
export const CLOSE_TEMPLATEMODAL = 'CLOSE_TEMPLATEMODAL';
export const SET_TEMPLATE_VAR = 'SET_TEMPLATE_VAR';
export const SET_TEMPLATE_VARS = 'SET_TEMPLATE_VARS';
export const OPEN_SETTINGSMODAL = 'OPEN_SETTINGSMODAL';
export const CLOSE_SETTINGSMODAL = 'CLOSE_SETTINGSMODAL';
export const INC_RENDERPROGRESS = 'INC_RENDERPROGRESS';

export function incRenderProgress() {
    return {
        type: INC_RENDERPROGRESS,
    }
}

export function openSettingsModal() {
    return {
        type: OPEN_SETTINGSMODAL,
    }
}

export function closeSettingsModal() {
    return {
        type: CLOSE_SETTINGSMODAL,
    }
}

export function setTemplateVars(vars) {
    return {
        type: SET_TEMPLATE_VARS,
        vars: vars,
    }
}

export function setTemplateVar(key,val) {
    return {
        type: SET_TEMPLATE_VAR,
        key: key,
        value: val,
    }
}

export function toggleDashboardList() {
    return {
        type: TOGGLE_DASHBOARDLIST
    }
}

export function recieveGrafanaKey(apiKey) {
    return {
        type: RECIEVE_GRAFANAKEY,
        key: apiKey
    }
}

export function recieveGrafanaUrl(url) {
    return {
        type: RECIEVE_GRAFANAURL,
        url: url,
    }
}

export function refreshDashboard(dashboard, grafanaUrl, apiKey) {
    return dispatch => {
        dispatch(recieveDashboard({}));
        dispatch(fetchDashboard(dashboard, grafanaUrl, apiKey));
    }
}

export function requestDashboardList() {
    return {
        type: REQUEST_DASHBOARDLIST
    }
}

export function recieveDashboardList(dashboardList) {
    return {
        type: RECIEVE_DASHBOARDLIST,
        dashboardList: dashboardList,
    }
}

export function fetchDashboardList(grafanaUrl, apiKey) {
    return dispatch => {
        dispatch(requestDashboardList());
        return fetch(grafanaUrl+'/api/search', {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+apiKey
            }
        })
            .then(response => response.json())
            .then(json => dispatch(recieveDashboardList(json)))
            .catch(function(err) {
                console.log(err.message);
            });
    }
}

export function selectDashboard(dashboard) {
    return {
        type: SELECT_DASHBOARD,
        dashboard: dashboard,
    }
}

export function requestDashboard(dashboard) {
    return {
        type: REQUEST_DASHBOARD,
        dashboard: dashboard,
    }
}

export function recieveDashboard(dashboard) {
    return {
        type: RECIEVE_DASHBOARD,
        dashboard,
    }
}

export function fetchDashboard(dashboard, grafanaUrl, apiKey) {
    return dispatch => {
        dispatch(requestDashboard(dashboard))
        return fetch(grafanaUrl+'/api/dashboards/db/'+dashboard, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '+apiKey
            }
        })
            .then(response => response.json())
            .then(json => dispatch(recieveDashboard(json)))
            .catch(function(err) {
                console.log("oh no!")
                console.log(err);
            });
    }
}

export function openTemplateModal() {
    return {
        type: OPEN_TEMPLATEMODAL,
    }
}

export function closeTemplateModal() {
    return {
        type: CLOSE_TEMPLATEMODAL,
    }
}

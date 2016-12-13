import {combineReducers} from 'redux';

import {
    SELECT_DASHBOARD,
    REQUEST_DASHBOARD,
    RECIEVE_DASHBOARD,
    REFRESH_DASHBOARD,
    REQUEST_DASHBOARDLIST,
    RECIEVE_DASHBOARDLIST,
    TOGGLE_DASHBOARDLIST,
    RECIEVE_GRAFANAKEY,
    RECIEVE_GRAFANAURL,
    OPEN_TEMPLATEMODAL,
    CLOSE_TEMPLATEMODAL,
    SET_TEMPLATE_VAR,
    SET_TEMPLATE_VARS,
    OPEN_SETTINGSMODAL,
    CLOSE_SETTINGSMODAL,
    INC_RENDERPROGRESS,
} from './actions';

function dashboardList(state = {selectedDashboard: 'alex-dashboard', list: [], openModal: false}, action) {
    switch (action.type) {
        case SELECT_DASHBOARD:
            return {
                ...state,
                selectedDashboard: action.dashboard,
            };
        case TOGGLE_DASHBOARDLIST:
            return {
                ...state,
                openModal: !state.openModal,
            }
        case RECIEVE_DASHBOARDLIST:
            return {
                ...state,
                list: action.dashboardList,
            }
        default:
            return state;
    }
}

function dashboard(state = {
    isFetching: false,
    dashboardJSON: {},
    apiKey: '',
    url: '',
    openTemplateModal: false,
    openSettingsModal: false,
}, action) {
    switch (action.type) {
        case OPEN_SETTINGSMODAL:
            return {
                ...state,
                openSettingsModal: true,
            }
        case CLOSE_SETTINGSMODAL:
            return {
                ...state,
                openSettingsModal: false,
            }
        case OPEN_TEMPLATEMODAL:
            return {
                ...state,
                openTemplateModal: true,
            }
        case CLOSE_TEMPLATEMODAL:
            return {
                ...state,
                openTemplateModal: false,
            }
        case RECIEVE_GRAFANAKEY:
            return {
                ...state,
                apiKey: action.key,
            }
        case RECIEVE_GRAFANAURL:
            return {
                ...state,
                url: action.url,
            }
        case REQUEST_DASHBOARD:
            return {
                ...state,
                isFetching: true,
            };
        case RECIEVE_DASHBOARD:
            return {
                ...state,
                isFetching: false,
                dashboardJSON: action.dashboard,
            };
        default:
            return state;
    }
}

function template(state = {
    vars: [],
}, action) {
    switch (action.type) {
        case SET_TEMPLATE_VARS: {
            return {
                ...state,
                vars: action.vars,
            }
        }
        case SET_TEMPLATE_VAR:
            var newVars = state.vars;
            for (i = 0; i < newVars.length; i++) {
                if (newVars[i].key == action.key) {
                    newVars[i].value = action.value
                    return {
                        ...state,
                        vars: newVars
                    }
                }
            }
            newVars.push({key: action.key, value: action.value})
            return {
                ...state,
                vars: newVars
            }
        default:
            return state;
    }
}

function renderProgress(state = 0,action) {
    switch (action.type) {
        case INC_RENDERPROGRESS:
            return state + 1;
        default: 
            return state;
    }
}

const rootReducer = combineReducers({
  template,
  dashboard,
  dashboardList,
  renderProgress,
})

export default rootReducer

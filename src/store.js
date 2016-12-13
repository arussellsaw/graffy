'use strict';

import {AsyncStorage} from 'react-native'

export function setGrafanaKey(apiKey) {
    try {
        AsyncStorage.setItem('@grafana:apiKey', apiKey);
    } catch (error) {
        alert(error);
    }
}

export var getGrafanaKey = async (callback) => {
    try {
        const value = await AsyncStorage.getItem('@grafana:apiKey');
        callback(value);
    } catch (error) {
        alert(error);
    }
}

export function setGrafanaUrl(url) {
    try {
        AsyncStorage.setItem('@grafana:url', url);
    } catch (error) {
        alert(error);
    }
}

export var getGrafanaUrl = async (callback) => {
    try {
        const value = await AsyncStorage.getItem('@grafana:url');
        callback(value);
    } catch (error) {
        alert(error);
    }
}

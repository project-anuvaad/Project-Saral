import React, { useEffect } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

//redux
import { connect, useDispatch } from 'react-redux';

//constant
import { apkVersion } from '../../configs/config';
import AppTheme from '../../utils/AppTheme';
import Strings from '../../utils/Strings';

//components
import HeaderComponent from '../common/components/HeaderComponent';
import ScanStatusList from './ScanStatusList';

//styles
import { styles } from './ScanStatusStyle';

//dummyData
import { dummyData } from './dummyData';
import { bindActionCreators } from 'redux';

//api
import APITransport from '../../flux/actions/transport/apitransport'
import axios from 'axios';
import { scanStatusDataAction } from './scanStatusDataAction';
import { getLoginCred } from '../../utils/StorageUtils';

import C from '../../flux/actions/constants'

import { useState } from 'react/cjs/react.development';
import { LoginAction } from '../../flux/actions/apis/LoginAction';

const ScanStatus = ({
    loginData,
    filteredData,
    scanedData
}) => {

    //Hooks
    useEffect(() => {
        callScanStatusData()
    }, []);

    const dispatch = useDispatch()

    //function
    const renderItem = ({ item, index }) => {
        return (
            <ScanStatusList
                id={item.studentId}
                subject={item.subject}
            />
        )
    }

    const callScanStatusData = async () => {
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.class,
            "subject": filteredData.subject,
            "fromDate": filteredData.examDate,
            "page": 1,
            "downloadRes": true
        }
        let apiObj = new scanStatusDataAction(dataPayload);
        FetchSavedScannedData(apiObj, loginCred.schoolId, loginCred.password)

    }

    const FetchSavedScannedData = (api, uname, pass) => {
        if (api.method === 'POST') {
            let apiResponse = null
            const source = axios.CancelToken.source()
            const id = setTimeout(() => {
                if (apiResponse === null) {
                    source.cancel('The request timed out.');
                }
            }, 60000);
            axios.post(api.apiEndPoint(), api.getBody(), {
                auth: {
                    username: uname,
                    password: pass
                }
            })
                .then(function (res) {
                    apiResponse = res
                    clearTimeout(id)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                })
                .catch(function (err) {
                    clearTimeout(id)
                });
        }
    }

    function dispatchAPIAsync(api) {
        return {
            type: api.type,
            payload: api.getPayload()
        }
    }

    const renderEmptyData = ({ item }) => {
        return (
            <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
                <Text>No Data Available</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* <HeaderComponent
                title={Strings.up_saralData}
                customLogoutTextStyle={{ color: AppTheme.GREY }}
                versionText={apkVersion}
            /> */}
            {
                (loginData && loginData.data)
                &&
                <View style={styles.schoolCon}>
                    <Text
                        style={styles.schoolName}
                    >
                        {Strings.school_name + ' Name : '}
                        <Text style={{ fontWeight: 'normal' }}>{loginData.data.school.name}</Text>
                    </Text>
                    <Text style={styles.schoolId}>
                        {Strings.schoolId_text + ' : '}
                        <Text style={{ fontWeight: 'normal' }}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                </View>
            }

            <Text style={styles.scanStatus}>{Strings.scan_status}</Text>

            <FlatList
                data={scanedData && scanedData.data}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyData}
                keyExtractor={(item,index) => `${index.toString()}`}
                contentContainerStyle={styles.content}
            />

        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        filteredData: state.filteredData.response,
        scanedData: state.scanedData.response
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanStatus);

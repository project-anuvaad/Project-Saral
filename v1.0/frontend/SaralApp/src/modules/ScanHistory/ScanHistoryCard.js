import React, { memo, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SaveScanData } from '../../flux/actions/apis/saveScanDataAction';
import AppTheme from '../../utils/AppTheme';
import { getLoginCred, getScannedDataFromLocal } from '../../utils/StorageUtils';
import Strings from '../../utils/Strings';

//api
import APITransport from '../../flux/actions/transport/apitransport'

//styles
import { styles } from './ScanHistoryStyles';
import { scanStatusDataAction } from '../ScanStatus/scanStatusDataAction';
import axios from 'axios';
import { NavigationActions, StackActions } from 'react-navigation';


const ScanHistoryCard = ({
    showButtons = true,
    navigation,
    filteredData,
    scanedData,
    loginData
}) => {

    const [isLoading, setIsLoading] = useState(false)


    const onPressContinue = () => {
        navigation.navigate('myScan')
    }

    const onPressStatus = () => {
        navigation.navigate('ScanStatus')
    }

    const dispatch = useDispatch()

    const onPressSaveInDB = async () => {
        const data = await getScannedDataFromLocal();
        console.log("data",data);
        if (data) {
            for (const value of data) {
                console.log("value",value);
                let apiObj =  new SaveScanData(value, loginData.data.token);
                dispatch(APITransport(apiObj))

                // Alert.alert(Strings.message_text, Strings.saved_successfully, [{
                //     text: Strings.ok_text, onPress: () => {
                //         callScanStatusData()
                //     }
                // }])
            }
        } else {
            Alert.alert('There is no data!')
        }
    }

    const callScanStatusData = async () => {
        setIsLoading(true)
        let loginCred = await getLoginCred()

        let dataPayload = {
            "classId": filteredData.class,
            "subject": filteredData.subject,
            "fromDate": filteredData.examDate,
            "page": 0,
            "schoolId": loginCred.schoolId,
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
                    setIsLoading(false)
                    goToMyScanScreen()
                    apiResponse = res
                    clearTimeout(id)
                    api.processResponse(res)
                    dispatch(dispatchAPIAsync(api));
                })
                .catch(function (err) {
                    console.log("Err", err);
                    Alert.alert("Something Went Wrong")
                    setIsLoading(false)
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

    const goToMyScanScreen = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'myScan', params: { from_screen: 'cameraActivity' } })],
        });
        navigation.dispatch(resetAction);
        return true
    }

    return (
        <TouchableOpacity
            style={[styles.container]}
            disabled

        >
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingTop: '3%', paddingLeft: '1%', paddingRight: '1%', paddingBottom: '5%' }}>
                <View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.class_text}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.className}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.section}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.section}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.exam_date}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.examDate}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.subject}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.subject}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle]}>
                            <Text>{Strings.exam_id}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle]}>
                            <Text>{filteredData.response.examTestID}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle,]}>
                            <Text>{Strings.scan_status}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle,]}>
                            <Text>{0}</Text>
                        </View>
                    </View>
                    <View style={styles.scanCardStyle}>
                        <View style={[styles.scanLabelStyle, styles.scanLabelKeyStyle, { borderBottomWidth: 1 }]}>
                            <Text>{Strings.save_status}</Text>
                        </View>
                        <View style={[styles.scanLabelStyle, styles.scanLabelValueStyle, { borderBottomWidth: 1 }]}>
                            <Text>{scanedData ? scanedData.length : 0}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ marginBottom: '3%', width: '100%', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    {
                        // scanStatusShow
                        showButtons
                        &&
                        <TouchableOpacity
                            style={{
                                backgroundColor: AppTheme.WHITE, borderRadius: 4,
                                // width: showButtons ? '45%' : '80%',
                                width: true ? '45%' : '80%',
                                alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4,
                                marginLeft: 5,
                                marginRight: 5
                            }}
                            onPress={onPressStatus}
                        >
                            <Text>{Strings.scan_status}</Text>
                        </TouchableOpacity>
                    }
                    {
                        showButtons
                        &&
                        <TouchableOpacity
                            style={{
                                backgroundColor: AppTheme.WHITE, borderRadius: 4, width: '45%',
                                alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4,
                                marginLeft: 5,
                                marginRight: 5
                            }}
                            onPress={onPressSaveInDB}
                        >
                            <Text style={{ color: AppTheme.BLACK }}>{Strings.save_scan}</Text>
                        </TouchableOpacity>}
                </View>
            </View>

            {
                showButtons
                &&
                <View style={{ marginBottom: '5%', marginTop: '2%', width: '100%', alignItems: 'center' }}>
                    {/* // showContinueBtn
                    // &&
                    // scanStatus != 'Completed' && */}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: AppTheme.GREY, borderRadius: 4, width: '80%', alignItems: 'center', justifyContent: 'center', elevation: 8, paddingVertical: 4 }}
                            onPress={onPressContinue}
                        >
                            <Text style={{ color: AppTheme.WHITE }}>{Strings.continue_scan}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

        </TouchableOpacity>
    );
}
const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData,
        scanedData: state.scanedData.response.data,
        loginData: state.loginData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(memo(ScanHistoryCard));
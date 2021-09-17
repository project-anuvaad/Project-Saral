import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Alert } from 'react-native';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import APITransport from '../../flux/actions/transport/apitransport'

//storage
import { getStudentsExamData } from '../../utils/StorageUtils';
import ButtonComponent from '../common/components/ButtonComponent';
import StudentsDataComponent from './StudentsDataComponent';

//style
import { styles } from './StudentsDataStyle';

//header
import HeaderComponent from '../common/components/HeaderComponent';

//constant
import Strings from '../../utils/Strings';
import AppTheme from '../../utils/AppTheme';

//npm
import AsyncStorage from '@react-native-community/async-storage';
import { apkVersion } from '../../configs/config';
import { ROIAction } from './ROIAction';

const StudentsList = ({
    filteredData,
    loginData,
    navigation
}) => {

    //hooks

    const [allStudentData, setAllStudentData] = useState([])

    useEffect(() => {
        studentData()
        getRoi()
    }, []);

    //function
    const studentData = async () => {
        let studentsExamData = await getStudentsExamData();
        const filterStudentsData = studentsExamData.filter((e) => {
            if (e.class == filteredData.response.className && e.section == filteredData.response.section) {
                return true
            }
        })
        setAllStudentData(filterStudentsData[0].data ? filterStudentsData[0].data.students : []);
    }


    const renderStudentData = ({ item }) => {
        return (
            <StudentsDataComponent
                item={item}
            />
        )
    }

    const renderEmptyList = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>No Students Available</Text>
            </View>
        )
    }

    const navigateToNext = () => {
        navigation.navigate('ScanHistory')
    }

    const onLogoutClick = async () => {
        Alert.alert(Strings.message_text, Strings.are_you_sure_you_want_to_logout, [
            { 'text': Strings.no_text, style: 'cancel' },
            {
                'text': Strings.yes_text, onPress: async () => {
                    await AsyncStorage.clear();
                    navigation.navigate('auth');
                }
            }
        ])
    }

    const getRoi = () => {

        let payload =
        {
            "examId": filteredData.response.examTestID
            // "examId": "string"
        }

        let apiObj = new ROIAction(payload);
        APITransport(apiObj)
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            {/* <HeaderComponent
                title={Strings.up_saralData}
                logoutHeaderText={Strings.logout_text}
                customLogoutTextStyle={{ color: AppTheme.GREY }}
                onLogoutClick={onLogoutClick}
            /> */}
            {(loginData && loginData.data) &&
                <View>
                    <Text
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingTop: '4%' }}
                    >
                        {Strings.school_name + ' : '}
                        <Text style={{ fontWeight: 'normal' }}>
                            {loginData.data.school.name}
                        </Text>
                    </Text>
                    <Text
                        style={{ fontSize: AppTheme.FONT_SIZE_REGULAR, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', paddingVertical: '1%' }}
                    >
                        {Strings.schoolId_text + ' : '}
                        <Text style={{ fontWeight: 'normal' }}>
                            {loginData.data.school.schoolId}
                        </Text>
                    </Text>
                </View>

            }
            <Text
                style={{ fontSize: AppTheme.FONT_SIZE_REGULAR - 3, color: AppTheme.BLACK, fontWeight: 'bold', paddingHorizontal: '5%', marginBottom: '4%' }}
            >
                {Strings.version_text + ' : '}
                <Text style={{ fontWeight: 'normal' }}>
                    {apkVersion}
                </Text>
            </Text>

            <FlatList
                data={allStudentData}
                renderItem={renderStudentData}
                ListEmptyComponent={renderEmptyList}
                keyExtractor={(item) => item.studentId.toString()}
                contentContainerStyle={styles.flatlistCon}
                showsVerticalScrollIndicator={false}
            />

            <ButtonComponent
                customBtnStyle={styles.nxtBtnStyle}
                btnText="NEXT"
                onPress={navigateToNext}
            />

        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        filteredData: state.filteredData,
        loginData: state.loginData,
        roiData: state.roiData
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);

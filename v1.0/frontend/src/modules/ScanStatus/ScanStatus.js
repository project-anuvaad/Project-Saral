import React from 'react';
import { FlatList, Text, View } from 'react-native';

//redux
import { connect } from 'react-redux';

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

const ScanStatus = ({
    loginData
}) => {

    const renderItem = ({ item, index }) => {
        return (
            <ScanStatusList
                id={item.aadharID}
                name={item.name}
                isSaved={item.isSaved}
            />
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
                data={dummyData}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.aadharID.toString()}`}
                contentContainerStyle={styles.content}
            />

        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
    }
}

export default connect(mapStateToProps, null)(ScanStatus);

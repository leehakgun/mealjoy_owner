import React from 'react';
import { View, StyleSheet,SafeAreaView, Platform, } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

const AddressChange = ({ navigation, route }) => { // route 파라미터 추가
  const getAddressData = (data) => {
    let defaultAddress = ''; // 기본주소
    if (data.buildingName === 'N') {
      defaultAddress = data.apartment;
    } else {
      defaultAddress = data.buildingName;
    }

    if(route.params?.onSelect) {
      route.params.onSelect({
        zone_code: data.zonecode,
        default_address: data.address + ' ' + defaultAddress,
      });
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Postcode
        style={{ flex: 1, width: '100%' }}
        jsOptions={{ animated: true }}
        onSelected={getAddressData}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 10, 
  },
  safeArea: {
    flex: 1, // 전체 화면 사용
    // 필요한 경우 여기에 추가 스타일 지정
  },

});

export default AddressChange;
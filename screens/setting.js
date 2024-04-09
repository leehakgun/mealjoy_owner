import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Image } from 'react-native';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

const Setting = () => {
  // 설정 항목의 state와 로직이 필요하면 여기에 추가하세요.
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 정보 수정</Text>
      </View>

      <ScrollView >
     
      <View style={styles.infoContainer}>
      
        
        <View style={styles.edge}>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>이름</Text>
          <Text style={styles.valueText}>박지뉴</Text>
          <View></View>
        </View>
    
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>이메일</Text>
          <Text style={styles.valueText}>jaecholoves@naver.com</Text>
          <View></View>
        </View>
        <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate('Nick')}>
          <Text style={styles.infoText}>닉네임</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate('Number')}>
          <Text style={styles.infoText}>휴대폰 번호</Text>
          <Text style={styles.valueText}>010-1234-1234</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate('Password')}>
          <Text style={styles.infoText}>비밀번호</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
        </View>
      </View>

      </ScrollView>

      {/* 하단 탭 바 */}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    edge:{
        borderColor:'#efefef',
        borderWidth:0.7,
        marginLeft:10,
        marginRight:10,
        borderRadius:9
    },

    infologo:{
        flex:1,
        alignItems:'center',
        marginTop:20
    },
    logo: {
        width: 300, // 로고의 너비. 필요에 따라 조절하세요.
        height: 150, // 로고의 높이. 필요에 따라 조절하세요.
        marginBottom: -20, // 로고와 검색 입력란 사이의 마진을 조절합니다.
        marginTop : -50,
      },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    backgroundColor: '#fff',
  },
  tabItem: {
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoContainer: {
    marginVertical: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    paddingTop:20,
    paddingBottom:20
  },
  infoText: {
    fontSize: 16,
  },
  valueText: {
    color: '#8e8e8e',
  },
  footer: {
    padding: 10,
    alignItems:'center',
  },
  button: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
    borderColor: '#ff3b30',
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: 'gray',
    fontSize: 13,
    fontWeight: 'bold',
  },
  // 여기에 추가 스타일을 정의하세요.
});



export default Setting;

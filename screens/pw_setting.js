import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';


const Password = () => {
  // 설정 항목의 state와 로직이 필요하면 여기에 추가하세요.
  const navigation = useNavigation();
  const [Password, setPassword] = useState('');
  const [inputText, setInputText] = useState('');

  const handlePasswordChange = () => {
    // 이 함수에서는 닉네임을 변경하는 로직을 구현합니다.
    // 예를 들어, 서버로 닉네임을 보내는 코드나, 로컬 상태를 업데이트하는 코드가 위치할 수 있습니다.
    setPassword(inputText);
    // 닉네임 변경 후에 원하는 동작 수행, 예를 들어 홈 화면으로 이동
    // navigation.navigate('Home');
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 변경</Text>
      </View>

      <ScrollView >
     
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>안전한 변경을 위해 현재 비밀번호를 확인할게요</Text>  
        </View>
        <View style={styles.search}>
            <TouchableOpacity>
                <Text>비밀번호 찾기</Text>
                <Ionicons name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>

        <View style={styles.nicksetting}>
        <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해주세요"
            value={inputText}
            onChangeText={setInputText}
          />
        </View>

      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={handlePasswordChange}>
        <Text style={styles.setting}>변경 완료</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    search:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    nicksetting:{
        backgroundColor:'#efefef',
        alignSelf:'center',
        width:350,
        height:45,
        borderRadius:5
    },
    input:{
        paddingTop:13,
        paddingLeft:10
    },

    setting:{
        fontSize:18,
        color:'white',
        fontWeight:'bold'
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
    paddingTop:15
  },
  tabItem: {
    backgroundColor: 'gray',
    borderRadius: 3,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    width: 350
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

  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#efefef',
    paddingBottom:20,
    paddingTop:20
  },
  infoText: {
    fontSize: 16,
    fontWeight:'bold'
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



export default Password;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
  Button,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


// Header 컴포넌트
const Header = ({ navigation }) => {

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('admin_main')}>
          <Ionicons name="arrow-back" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <Text style={styles.headerText}>문의 하기</Text>
      </View>
      <View style={styles.headerDivider} />
    </View>
  );
};

 // InquiryForm 컴포넌트
 const InquiryForm = ({ userInfo, onInquiry }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    console.log("문의 등록:", title, content);
    // inquiry 함수를 호출하여 서버에 문의 내용을 전송
    onInquiry(title, content, userInfo);
    // 데이터 전송 후 상태 초기화
    setTitle("");
    setContent("");
  };

  return (
    <View style={styles.inquiryContainer}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        value={content}
        onChangeText={setContent}
        placeholder="문의 내용"
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>등록</Text>
      </TouchableOpacity>
    </View>
  );
};




const App = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
 
  useEffect(() => {
    const fetchStores = async () => {
      try {
        // userInfo에서 userId 추출
        const userInfoString = await AsyncStorage.getItem('userInfo');

        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;        
        
        console.log("유저",userInfo)
        setUserInfo(userInfo);
        
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);



  const inquiry = async( ) => {
    console.log("호출", title, content)
    try{
      // 서버에 요청 보내기
      const response = await axios.post(`http://61.80.80.153:8090/botbuddies/inquiry`, {
        userId: userInfo.user_id,
        title: title,
        details: content,
      });
  
      console.log(response.data)
  
      // 응답 데이터 처리
      if (response.data) {
        setStores(response.data);
        // 서버로부터 받은 데이터를 images 배열 형태로 변환하여 저장
       console.log("말",response.data)
        
      }
    }catch(error){
      console.error(error)
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <InquiryForm />
      </ScrollView>

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // SafeAreaView 색상을 배경색과 일치시키기
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 129,
  },
  tabBar: {
    height: 60,
    flexDirection: "row",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  inquiryContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  inquiryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "red", // 버튼 배경색
    padding: 15,
    borderRadius: 5,
    margin: 10,
    justifyContent: "center",
    alignSelf: "center",
    width : 100,
    height : 45,
  },
  buttonText : {
    color : 'white',
    alignSelf : 'center',
    fontWeight : 'bold',
  },
  headerDivider: {
    height: 1, // 구분선의 두께
    backgroundColor: "#e0e0e0", // 구분선 색상
    marginVertical: 10, // 위 아래 마진
  },
});
export default App;
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const HomeLogin = () => {
  const navigation = useNavigation();

  // Existing code...
  // 로그인 상태 관리
  const [loginInfo, setLoginInfo] = useState({
    id: "",
    password: "",
  });

  // 입력 필드의 값을 초기화하기 위한 상태
  const [resetFields, setResetFields] = useState(false);

  // 로그인 입력 핸들러
  const handleLoginChange = (name, value) => {
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  // 로그인 버튼 핸들러
  const handleLogin = async () => {
    console.log(loginInfo);
    try {
      if (loginInfo.id == "" || loginInfo.password == "") {
        Alert.alert("아이디 및 비밀번호를 입력해주세요.");
      } else {
        const response = await axios.post(
          "http://121.147.52.59:8090/botbuddies/homelogin",
          {
            id: loginInfo.id,
            password: loginInfo.password,
          }
        );

        //   console.log("resule",response.data)

        if (response.data) {
          console.log("resule", response.data);
        } else {
          console.log("로그인 실패");
        }

        if (response.data === null || response.data.length === 0) {
          // 로그인 실패 처리
          Alert.alert("로그인 실패", "아이디 또는 비밀번호를 확인해주세요.");
        } else {
          // 로그인 성공 처리
          const userInfoString = JSON.stringify(response.data); // 사용자 정보를 문자열로 변환
          await AsyncStorage.setItem("userInfo", userInfoString); // AsyncStorage에 저장

          Alert.alert("로그인 성공", "환영합니다!");
          navigation.navigate("admin_main");
          // navigation.navigate('Main'); // 화면 이동
          // 주의: 이 함수 내에서 navigation 객체에 접근하려면 props를 통해 전달받거나 useNavigation 훅을 사용해야 합니다.
          setResetFields(true);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("로그인 오류", "로그인 처리 중 오류가 발생했습니다.");
    }
  };
  useEffect(() => {
    if (resetFields) {
      setLoginInfo({ id: "", password: "" }); // 입력 필드 초기화
      setResetFields(false); // resetFields 상태 초기화
    }
  }, [resetFields]);

  // 회원가입 핸들러
  const onSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          {/* Logo를 중앙에 배치합니다. */}
          <Image source={require("./assets/logo.png")} style={styles.logo} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>아이디*</Text>
          <TextInput
            style={styles.input}
            placeholder="아이디를 입력하세요"
            onChangeText={(value) => handleLoginChange("id", value)}
            value={loginInfo.id}
          />
          <Text style={styles.inputLabel}>비밀번호*</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요 "
            secureTextEntry={true}
            onChangeText={(value) => handleLoginChange("password", value)}
            value={loginInfo.password}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonLogin]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSignUp]}
              onPress={onSignUp}
            >
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    // 공통 버튼 스타일
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonLogin: {
    backgroundColor: "red",
    borderColor: "red",
    borderWidth: 1,
    flex: 1, // 각 버튼이 동일한 크기를 가지도록 설정
    marginRight: 10, // 버튼 사이의 간격을 설정
    borderRadius: 5,
  },
  buttonSignUp: {
    backgroundColor: "red", // 회원가입 버튼의 배경색을 투명하게 설정
    borderColor: "red",
    borderWidth: 1,
    flex: 1, // 각 버튼이 동일한 크기를 가지도록 설정
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: 350,
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 200,
    alignSelf: "center", // This will center the logo within its container
    marginTop: 45, // Adjust space as needed
    // If resizeMode is required, uncomment the following line
    // resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: "center", // This should center all its children horizontally
    justifyContent: "center", // This will center its children vertically if the container has a fixed height
    // Other styles...
  },

  container: {
    // 여기 수정

    flex: 1,
    paddingHorizontal: 16, // 좌우 여백을 주기 위해 horizontal padding 값을 조정합니다. // 상단 바 여백
    backgroundColor: "white",
    marginTop: -70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // Remove padding if you want the back button to be at the very top

    backgroundColor: "white",
    padding: 20,
  },

  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 70,
    // Adjust the space between the logo and the input fields as needed
  },
  inputLabel: {
    fontSize: 15, // 라벨의 글자 크기
    color: "black", // 라벨의 글자 색상
    //fontWeight: 'bold',
    marginBottom: 5, // 라벨과 입력 필드 사이의 간격
    // 필요한 다른 스타일을 추가합니다.
    marginRight: 280,
  },

  input: {
    // ... other input styles ...
    height: 46,
    paddingHorizontal: 8,
    backgroundColor: "#fff", // Ensure the background is white
    borderColor: "#e1e1e1", // Set the border color to light gray
    borderWidth: 1, // Set the border width
    borderRadius: 4, // You can set this to change the roundness of the corners (optional)
    color: "#333", // Set the text color inside the input
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    width: 350,
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 0,
    borderColor: "red",
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 20,
    //backgroundColor: '#f9f9f9',//배경 지워도 되고 안지워도 되고
  },

  // headerTitle: {
  //   marginLeft: 135,
  //   fontWeight: 'bold',
  //   fontSize: 20,
  // },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonOutline: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 0,
    borderColor: "red",
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonOutlineText: {
    color: "white",
    fontWeight: "bold",
  },
});
export default HomeLogin;

import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Modal,
  FlatList,
  Alert,
  Platform,
  Button,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REACT_APP_ENTREPRENEUR_API_KEY } from "@env";

// Firebase 프로젝트 설정
const firebaseConfig = {
  apiKey: "AIzaSyCIJTUXUiGTqfDHqcxRg_Zmqpj7X8RxrUU",
  authDomain: "northern-net-417806.firebaseapp.com",
  projectId: "northern-net-417806",
  storageBucket: "northern-net-417806.appspot.com",
  messagingSenderId: "931311955507",
  appId: "1:931311955507:android:286418ba7a5ba19018fd46",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const storage = getStorage();

// 카테고리 목록을 저장하는 데이터
const categories = {
  한식: 1,
  "카페/디저트": 2,
  중국집: 3,
  분식: 4,
  버거: 5,
  치킨: 6,
  "피자/양식": 7,
  "일식/돈까스": 8,
  샌드위치: 9,
  "찜/탕": 10,
  "족발/보쌈": 11,
  샐러드: 12,
  아시안: 13,
  "도시락/죽": 14,
  "회/초밥": 15,
  "고기/구이": 16,
};

const CustomCheckbox = ({ label, value, onValueChange }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value ? styles.checkedCheckbox : null]}>
        {value && (
          <Ionicons name="checkmark" size={24} style={styles.checkmarkIcon} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const Header = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("admin_main")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#ff3b30" />
      </TouchableOpacity>
      <Text style={styles.headerText}>매장등록</Text>
      <View style={styles.iconButton}></View>
    </View>
  );
};

const StoreRegistrationScreen = () => {
  // 각 입력 필드의 상태를 관리하기 위한 state를 선언합니다.
  const [businessNumber, setBusinessNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [hasTabling, setHasTabling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [storeImages, setStoreImages] = useState([]);
  const [time, setTime] = useState({
    opening: new Date(),
    closing: new Date(),
  });
  const [mode, setMode] = useState("opening");
  const [tempTime, setTempTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(""); // 선택된 카테고리의 키를 저장하는 state
  const [userId, setUserId] = useState(null);

  // useEffect를 사용하여 userInfo에서 유저 아이디를 추출하는 부분
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          const userId = userInfo.user_id;
          setUserId(userId);
        } else {
          console.log("User info not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, []);

  // 테이블 정보 업데이트
  const updateTable = (index, field, value) => {
    const newTables = tables.map((table, i) => {
      if (i === index) {
        return { ...table, [field]: value };
      }
      return table;
    });
    setTables(newTables);
  };

  // 카테고리 데이터를 객체에서 배열로 변환하는 과정
  const categoryKeys = Object.keys(categories); // 카테고리 객체의 키를 배열로 변환

  // 카테고리 선택 핸들러
  const handleCategorySelect = (key) => {
    setSelectedCategory(categories[key]); // 선택된 카테고리의 ID 값을 상태에 저장
    setSelectedCategoryKey(key); // 선택된 카테고리의 키를 상태에 저장
    setModalVisible(false);
  };

  // 카테고리 아이템 렌더링 함수
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  // 사업자 번호 인증 API 호출 함수
  const verifyBusinessNumber = async () => {
    if (!businessNumber) {
      console.log("사업자 번호를 입력해주세요.");
      return;
    }

    const data = {
      b_no: [businessNumber], // 사업자번호를 배열 형태로 전달
    };

    try {
      const response = await fetch(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${REACT_APP_ENTREPRENEUR_API_KEY}`, // 실제 serviceKey를 입력해야 합니다.
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const jsonResponse = await response.json(); // 응답을 JSON 형태로 파싱
        console.log(jsonResponse); // 파싱된 데이터를 로그로 출력
        Alert.alert("인증 성공", "사업자 번호 인증에 성공했습니다."); // 인증 성공 메시지 표시
      } else {
        // 응답이 성공적이지 않을 경우의 처리
        console.error("사업자 번호 인증 요청에 실패했습니다.");
      }
    } catch (error) {
      // 요청 과정에서 에러가 발생한 경우의 처리
      console.error("인증 과정 중 문제가 발생했습니다.", error);
    }
  };

  // 매장 사진 업로드 함수
  const handleStorePhotoUpload = async () => {
    if (storeImages.length >= 1) {
      Alert.alert("업로드 제한", "매장 사진은 1개만 업로드할 수 있습니다.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log("Picker result:", pickerResult);

    if (
      !pickerResult.cancelled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      try {
        // pickerResult.assets 배열에서 첫 번째 요소의 uri를 사용
        const uploadUrl = await uploadImage(pickerResult.assets[0].uri); // 수정된 부분
        // 업로드된 이미지의 URL을 'storeImages' 배열에 추가
        setStoreImages([...storeImages, uploadUrl]);
      } catch (error) {
        Alert.alert(
          "업로드 실패",
          "이미지 업로드에 실패했습니다. 다시 시도해주세요."
        );
        console.error("Image upload error:", error);
      }
    }
  };

  const uploadImage = async (uri) => {
    console.log("Starting upload for URI:", uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log(response, blob);
      const storageRef = ref(storage, `stores/${Date.now()}`);
      console.log("Before uploading bytes");
      const snapshot = await uploadBytes(storageRef, blob);
      console.log("After uploading bytes");
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Upload image error:", error);
      throw new Error("Failed to upload image");
    }
  };

  // 매장 사진 삭제를 위한 함수
  const handleRemoveStoreImage = (index) => {
    setStoreImages((currentImages) =>
      currentImages.filter((_, i) => i !== index)
    );
  };

  // 테이블 설정
  const tableTypes = [
    { type: "1인석", id: "1" },
    { type: "2인석", id: "2" },
    { type: "4인석", id: "4" },
    { type: "6인석", id: "6" },
    { type: "8인석", id: "8" },
  ];

  // 각 테이블 유형의 수량 상태를 관리합니다.
  const [tableCounts, setTableCounts] = useState({
    1: 0,
    2: 0,
    4: 0,
    6: 0,
    8: 0,
  });

  // 수량을 조정하는 함수입니다.
  const adjustTableCount = (id, amount) => {
    setTableCounts((prevCounts) => ({
      ...prevCounts,
      [id]: Math.max(0, (prevCounts[id] || 0) + amount),
    }));
  };

  const handleStoreRegistration = async () => {
    // Firebase Storage에 모든 이미지 업로드 및 URL 수집
    const uploadedImageUrls = await Promise.all(
      storeImages.map(async (imageUri) => {
        return uploadImage(imageUri);
      })
    );

    const data = {
      user_id: userId, // AsyncStorage에서 가져온 유저 아이디 사용
      regiNum: businessNumber,
      store_name: storeName,
      store_addr: storeAddress,
      store_phone: storePhone,
      store_desc: storeDescription,
      category_seq: selectedCategory,
      tableNum: tableCounts,
      open_time: time.opening.toISOString(),
      end_time: time.closing.toISOString(),
      imgFilename: uploadedImageUrls, // Firebase에서 업로드된 이미지 URL 추가
      tabling_state: hasTabling ? 1 : 0, // 'table_state' 값을 데이터에 추가
    };

    console.log(data);

    try {
      const response = await fetch(
        "http://121.147.52.59:8090/botbuddies/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        Alert.alert("매장 등록 성공", "매장 정보가 성공적으로 등록되었습니다.");
      } else {
        const errorResponse = await response.text();
        console.error("매장 등록 실패:", errorResponse);
        Alert.alert("매장 등록 실패", "서버에서 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("매장 등록 중 오류 발생: ", error);
      Alert.alert("매장 등록 실패", "네트워크 문제가 발생했습니다.");
    }
  };

  // 테이블 유형별로 렌더링할 항목을 생성합니다.
  const renderTableType = (item, index) => (
    <View
      key={item.id}
      style={[
        styles.tableItemContainer,
        index < tableTypes.length - 1 && styles.divider, // 마지막 항목을 제외하고 모든 항목에 하단 경계선 추가
      ]}
    >
      <Text style={styles.tableTypeText}>{item.type}</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          onPress={() => adjustTableCount(item.id, -1)}
          style={styles.stepperButton}
        >
          <Text style={styles.stepperButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.tableCountText}>{tableCounts[item.id] || 0}</Text>
        <TouchableOpacity
          onPress={() => adjustTableCount(item.id, 1)}
          style={styles.stepperButton}
        >
          <Text style={styles.stepperButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  // 새로운 날짜
  const handleTimeChange = (event, selectedTime) => {
    setShowPicker(Platform.OS === "ios"); // iOS에서만 선택기를 유지
    if (selectedTime) {
      // 선택한 시간이 있을 경우에만 업데이트
      setTempTime(selectedTime);
      if (Platform.OS === "android") {
        setTime({ ...time, [mode]: selectedTime }); // 안드로이드에서는 여기서 시간을 설정
      }
    }
  };

  const handleConfirm = () => {
    setShowPicker(false); // 모달 닫기
    setTime({ ...time, [mode]: tempTime }); // 최종 시간 설정
  };

  const handleCancel = () => {
    setShowPicker(false); // 모달 닫기
  };

  // DateTimePicker 컴포넌트에서 onChange 이벤트를 다음과 같이 수정
  <DateTimePicker
    value={tempTime}
    mode="time"
    is24Hour={true}
    display={Platform.OS === "ios" ? "spinner" : "default"}
    onChange={handleTimeChange} // 이벤트 핸들러 연결
    // 기타 필요한 props
  />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.menutitle}>사업자 번호</Text>
        {/* 사업자 번호 입력 필드 */}
        <View style={styles.inputContainer}>
          <TextInput
            value={businessNumber}
            onChangeText={(text) =>
              setBusinessNumber(text.replace(/[^0-9]/g, ""))
            }
            placeholder="사업자 번호를 입력하세요"
            keyboardType="phone-pad" // 전화번호 키보드 사용
            maxLength={10} // 최대 입력 글자 수를 10으로 제한
          />
        </View>

        {/* 사업자 번호 인증 버튼 */}
        <TouchableOpacity style={styles.button} onPress={verifyBusinessNumber}>
          <Text style={styles.buttonText}>사업자 번호 인증</Text>
        </TouchableOpacity>

        {/* 매장 사진 업로드 및 미리보기 */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleStorePhotoUpload}
        >
          <Text style={styles.uploadButtonText}>매장 사진 업로드</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {storeImages.map((imageUri, index) => (
            <View key={index} style={styles.imageAndButtonContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                onPress={() => handleRemoveStoreImage(index)} // 매장 사진 삭제
                style={styles.deleteButtonBelow}
              >
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        {/* 매장 상호 입력칸 */}
        <Text style={styles.menutitle}>매장 상호</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={storeName}
            onChangeText={setStoreName}
            placeholder="매장 상호를 입력하세요"
            // 기타 필요한 TextInput props
          />
        </View>

        {/* 매장 주소 입력칸 */}
        <Text style={styles.menutitle}>매장 주소</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={storeAddress}
            onChangeText={setStoreAddress}
            placeholder="매장 주소를 입력하세요"
            // 기타 필요한 TextInput props
          />
        </View>

        {/* 매장 전화번호 입력칸 */}
        <Text style={styles.menutitle}>매장 전화번호</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={storePhone}
            onChangeText={setStorePhone}
            placeholder="매장 전화번호를 입력하세요"
            keyboardType="phone-pad"
            // 기타 필요한 TextInput props
          />
        </View>
        {/* DB에 있는 카테고리 선택칸 */}
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text>{selectedCategoryKey || "카테고리를 선택하세요"}</Text>
        </TouchableOpacity>

        {/* 카테고리 선택 모달 */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={Object.keys(categories)} // 카테고리 객체의 키 배열을 data로 전달
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* 매장 설명 입력칸 */}
        <Text style={styles.menutitle}>매장 설명</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={storeDescription}
            onChangeText={setStoreDescription}
            placeholder="매장 설명을 입력하세요"
            multiline
            // 기타 필요한 TextInput props
          />
        </View>

        {/* 테이블링 유무 체크 버튼 */}
        <CustomCheckbox
          style={styles.tablingbutton}
          label="테이블링"
          value={hasTabling}
          onValueChange={setHasTabling}
        />

        <View style={styles.timeSection}>
          {/* 오픈 시간 설정 버튼 및 표시 */}
          <View style={styles.timeSettingContainer}>
            <TouchableOpacity
              onPress={() => {
                setMode("opening");
                setShowPicker(true);
              }}
              style={styles.timeButton}
            >
              <Text style={styles.timeButtonText}>오픈 시간 설정</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>
              {time.opening.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>

          {/* 마감 시간 설정 버튼 및 표시 */}
          <View style={styles.timeSettingContainer}>
            <TouchableOpacity
              onPress={() => {
                setMode("closing");
                setShowPicker(true);
              }}
              style={styles.timeButton}
            >
              <Text style={styles.timeButtonText}>마감 시간 설정</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>
              {time.closing.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>
        {showPicker && (
          <Modal transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                />
                <View style={styles.buttonsContainer}>
                  <Button title="취소" onPress={handleCancel} />
                  <Button title="확인" onPress={handleConfirm} />
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* 테이블 등록 칸 */}
        {/* 테이블 관리 섹션 렌더링 부분을 조건부 렌더링으로 변경 */}
        {selectedCategoryKey !== "카페/디저트" && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>테이블 관리</Text>
            </View>
            {tableTypes.map(renderTableType)}
          </View>
        )}

        {/* 테이블 입력란을 렌더링하는 함수 호출 */}

        {/* <TouchableOpacity style={styles.button} onPress={ 가게 등록 로직 } > */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleStoreRegistration}
        >
          <Text style={styles.meajang}>등록 완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // 배경색을 흰색으로 설정
  },
  inputContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f7f7f7", // 입력 필드의 배경색
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e1e1e1", // 경계선 색상
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // SafeAreaView 색상을 배경색과 일치시키기
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  iconButton: {
    padding: 10, // 충분한 클릭 영역 확보
  },
  button: {
    backgroundColor: "#ff3b30", // 버튼 배경색
    padding: 15,
    borderRadius: 5,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  // 사업자 번호 인증 css
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 5, // 이미지 모서리를 둥글게
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    marginLeft: 285,
    marginBottom: 10,
    marginTop: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12, // 원형 체크박스
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  checkedCheckbox: {
    backgroundColor: "white", // 체크됐을 때의 배경 색상
    borderColor: "red", // 체크됐을 때의 경계선 색상
  },
  checkmarkIcon: {
    color: "red", // 체크 아이콘의 색상을 빨간색으로 설정
  },
  label: {
    // 라벨 스타일
    fontSize: 14,
    fontWeight: "bold",
    // marginRight: 5, // 필요한 경우 라벨의 오른쪽 여백 조정
  },

  // 추가적인 스타일을 아래에 정의합니다.
  textInput: {
    borderWidth: 1,
    borderColor: "#e1e1e1", // 입력 필드의 경계선 색상
    borderRadius: 5,
    padding: 10,
    marginVertical: 5, // 위아래 마진
  },
  titleText: {
    fontSize: 16, // 텍스트 크기
    fontWeight: "bold", // 글씨 두께
    margin: 10,
  },
  uploadButtonText: {
    color: "#fff", // 업로드 버튼 텍스트 색상
    fontWeight: "bold", // 글씨 두께
  },
  registerButtonText: {
    color: "#fff", // 등록 버튼 텍스트 색상
    fontWeight: "bold", // 글씨 두께
  },
  checkboxLabel: {
    marginLeft: 8, // 체크박스와 라벨 사이의 여백
  },
  menutitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%", // 모달 창의 너비를 전체 폭으로 설정
    maxHeight: "50%", // 모달 창의 최대 높이 설정
    elevation: 5, // 안드로이드에서 그림자 효과
    alignItems: "stretch", // 가운데 정렬을 위해 추가
  },
  categoryItem: {
    paddingVertical: 15,
    width: "100%", // 카테고리 아이템의 너비를 모달 창의 너비와 동일하게 설정
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  // 테이블 추가/제거 버튼 컨테이너 스타일
  tableControlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  tableInput: {
    margin: 10,
    padding: 10,
    backgroundColor: "#f7f7f7", // 입력 필드의 배경색
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e1e1e1", // 경계선 색상
  },
  // 테이블 입력란 스타일
  tableInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableNameInput: {
    flex: 1,
    marginRight: 5,
  },
  capacityInput: {
    flex: 1,
    marginLeft: 5,
  },
  //sd
  timeSettingContainer: {
    flexDirection: "row", // 가로 방향으로 요소들을 나열
    alignItems: "center", // 요소들을 세로 축 중앙에 배치
  },

  timeButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },

  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
  },
  imageAndButtonContainer: {
    flexDirection: "column", // 컨테이너 내 요소들을 세로로 배열
    alignItems: "center", // 세로축(center)을 기준으로 중앙 정렬
    marginRight: 10, // 이미지 간의 오른쪽 여백
    marginBottom: 10, // 컨테이너 간의 아래쪽 여백
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  deleteButtonBelow: {
    marginTop: -5, // 이미지와 삭제 버튼 사이의 거리
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 1,
  },
  deleteButton: {
    marginTop: -5, // 이미지와 삭제 버튼 사이의 거리
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 1,
  },
  // 모달 바깥부분 누르면 모달 꺼짐
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 모달 배경의 반투명한 검은색
  },
  tableItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderColor: "#ccc",
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  divider: {
    borderBottomWidth: 1, // 선의 너비
    borderBottomColor: "#ccc", // 선의 색상
  },
  tableTypeText: {
    fontSize: 16,
    alignSelf: "center",
    marginLeft: 30,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  stepperButton: {
    backgroundColor: "#ff3b30",
    padding: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    width: 30,
    height: 35,
  },
  stepperButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
  },
  tableCountText: {
    fontSize: 16,
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
  meajang: {
    color: "#fff",
    fontWeight: "bold",
  },
  //새로운거
  section: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  //tofhdnsrj
  timeSection: {
    flexDirection: "row", // 가로 방향으로 요소들을 나열
    justifyContent: "space-between", // 요소들 사이에 균등한 간격을 둠
    alignItems: "center", // 요소들을 세로 축 중앙에 배치
    marginVertical: 10, // 위아래 마진 추가
  },
  timeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tablingbutton: {},
});

export default StoreRegistrationScreen;

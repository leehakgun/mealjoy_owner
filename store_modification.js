import React, { useState, useEffect } from "react";
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

import {
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// API 호출 및 기타 로직 처리를 위한 함수들을 정의합니다.
// 예: const verifyBusinessNumber = async (number) => { /* ... */ };

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

const sendStoreSeqToServer = async (storeSeq) => {
  try {
    const response = await fetch(
      "http://121.147.52.59:8090/botbuddies/modify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeSeq }),
      }
    );

    if (response.ok) {
      console.log("Store sequence successfully sent to server");
    } else {
      console.error("Failed to send store sequence to server");
    }
  } catch (error) {
    console.error("Error sending store sequence to server:", error);
  }
};

// 카테고리 목록을 저장하는 가상의 데이터
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
        onPress={() => navigation.navigate("mypage_managent")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#ff3b30" />
      </TouchableOpacity>
      <Text style={styles.headerText}>매장수정</Text>
      <View style={styles.iconButton}></View>
    </View>
  );
};

const StoreRegistrationScreen = ({ route }) => {
  // 각 입력 필드의 상태를 관리하기 위한 state를 선언합니다.
  const [businessNumber, setBusinessNumber] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [hasTabling, setHasTabling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [storeImages, setStoreImages] = useState([]);
  const [time, setTime] = useState({
    opening: new Date(),
    closing: new Date(),
  });
  const [mode, setMode] = useState("opening");
  const [tempTime, setTempTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const [storeSeq, setStoreSeq] = useState("");
  const [userId, setUserId] = useState(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [categorySeq, setCategorySeq] = useState("");
  const [openTime, setOpenTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [regiNum, setRegiNum] = useState("");
  const [tablingState, setTablingState] = useState(false);
  const [reservaState, setReservaState] = useState(false);
  const [tableNums, setTableNums] = useState([]);


  useEffect(() => {
    if (route.params?.store_seq && route.params?.user_id) {
      setStoreSeq(route.params.store_seq);
      setUserId(route.params.user_id);
      console.log(
        `Received storeSeq: ${route.params.store_seq}, userId: ${route.params.user_id}`
      );
    } else {
      console.error("Missing parameters: store_seq or user_id");
      Alert.alert("Error", "Missing necessary navigation parameters.");
    }
  }, [route.params]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        // route.params로부터 store_seq와 user_id 직접 추출
        const { store_seq, user_id } = route.params;

        // store_seq와 user_id가 제공되지 않았을 경우 에러 처리
        if (!store_seq || !user_id) {
          console.error("store_seq or user_id is missing");
          Alert.alert("Error", "Store sequence or user ID is missing.");
          return;
        }

        // 서버에 매장 세부 정보 요청
        const response = await fetch(
          `http://121.147.52.59:8090/botbuddies/modify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ store_seq, user_id }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch store details");
        }

        const responseData = await response.json();
        if (responseData.length > 0) {
          const data = responseData[0]; // 첫 번째 객체를 사용
          console.log(data);
          setStoreName(data.store_name);
          setStoreAddress(data.store_addr);
          setStorePhone(data.store_phone);
          setCategorySeq(data.category_seq);
          setStoreDescription(data.store_desc);
          setRegiNum(data.regi_num);
          setStoreImages([data.img_filename]);


          // 카테고리 설정
          const categoryKey = Object.keys(categories).find(
            key => categories[key] === parseInt(data.category_seq)
          );
          setSelectedCategoryKey(categoryKey); // 한글 이름을 설정
          setSelectedCategory(data.category_seq); // 실제 카테고리 ID를 저장

          setOpeningDate(new Date(data.open_date));
          setHasTabling(data.tabling_state === "1");
          setHasReservation(data.reserva_state === "1");

          const openTimeParsed = new Date(`1970-01-01T${data.open_time}`);
          const endTimeParsed = new Date(`1970-01-01T${data.end_time}`);
          setTime({ opening: openTimeParsed, closing: endTimeParsed });

          // table_nums의 존재 여부 확인 후 처리
          if (data.table_nums) {
            const tableNumsArray = data.table_nums.split(",");
            const tableCounts = tableNumsArray.reduce((acc, cur) => {
              acc[cur] = (acc[cur] || 0) + 1;
              return acc;
            }, {});
            // 상태 업데이트

          }
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
        Alert.alert("Error", "Could not fetch store details.");
      }
    };
  
    fetchStoreDetails();
  }, []);
  // 입력 핸들러 함수들...
  const handleStoreNameChange = (text) => {
    setStoreDetails((prevDetails) => ({ ...prevDetails, storeName: text }));
  };

  // 매장 수정 사항을 서버에 전송하는 함수
  const handleUpdateStoreDetails = async () => {
    // Firebase Storage에 모든 이미지 업로드 및 URL 수집
    const uploadedImageUrls = await Promise.all(
      selectedImages.map(async (imageUri) => {
        return uploadImage(imageUri);
      })
    );

    // 각 테이블 유형의 수량 정보를 서버가 요구하는 형식으로 변환
    const tableNumsObject = Object.entries(tableCounts).reduce(
      (acc, [key, value]) => {
        if (value > 0) {
          // 수량이 0보다 큰 항목만 포함
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    const formatTime = (date) => {
      const hours = `0${date.getHours()}`.slice(-2); // 시간을 2자리 숫자로 포맷
      const minutes = `0${date.getMinutes()}`.slice(-2); // 분을 2자리 숫자로 포맷
      return `${hours}:${minutes}`;
    };
    // 업데이트할 매장 정보 데이터
    const updatedStoreData = {
      store_seq: storeSeq,
      user_id: userId,
      store_name: storeName,
      store_addr: storeAddress,
      store_phone: storePhone,
      category_seq: selectedCategory, // DB에 저장할 실제 카테고리 ID
      store_desc: storeDescription,
      open_time: formatTime(time.opening), // 오픈 시간 포맷 적용
      end_time: formatTime(time.closing), // 마감 시간 포맷 적용
      regiNum: regiNum,
      tabling_state: hasTabling ? 1 : 0,
      reserva_state: hasReservation ? 1 : 0,
      imgFilename: storeImages, // 업로드된 이미지 URL 목록
      tableNum: tableNumsObject, // JSON 문자열로 변환

    };
    console.log("데이터 값 : ", updatedStoreData); // 콘솔에 업데이트할 데이터 출력
    try {
      const response = await fetch(
        "http://121.147.52.59:8090/botbuddies/updateStore",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStoreData),
        }
      );

      if (response.ok) {
        Alert.alert("성공", "매장 정보가 성공적으로 업데이트되었습니다.");
        // 업데이트 성공 후 필요한 로직 처리 (예: 화면 전환)
      } else {
        const errorResponse = await response.text();
        console.error("매장 정보 업데이트 실패:", errorResponse);
        Alert.alert("실패", "매장 정보 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("매장 정보 업데이트 중 오류 발생:", error);
      Alert.alert("오류", "매장 정보 업데이트 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    // 매장 정보를 불러오는 함수
    const fetchStoreInfo = async () => {
      try {
        // 여기에 매장 정보를 불러오는 API 호출 코드 작성
        // 예: const response = await fetch(`your_api_endpoint/${storeSeq}`);
        // const data = await response.json();
        // setStoreInfo(data);
      } catch (error) {
        console.error("매장 정보 불러오기 실패:", error);
      }
    };

    fetchStoreInfo();
  }, [storeSeq]);

  const handleSave = async () => {
    try {
      // 여기에 수정된 매장 정보를 서버로 전송하는 API 호출 코드 작성
      // 예: await fetch(`your_api_endpoint/update/${storeSeq}`, { method: "POST", body: JSON.stringify(storeInfo) });
      alert("매장 정보가 업데이트되었습니다.");
    } catch (error) {
      console.error("매장 정보 업데이트 실패:", error);
    }
  };

  // 각 필드의 값을 수정하는 핸들러 함수들...
  const handleChange = (name, value) => {
    setStoreInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 카테고리 데이터를 객체에서 배열로 변환하는 과정
  const categoryKeys = Object.keys(categories); // 카테고리 객체의 키를 배열로 변환

  // 카테고리 선택 핸들러
  const handleCategorySelect = (key) => {
    setSelectedCategoryKey(key); // 사용자에게 보여질 카테고리의 한글 이름을 상태에 저장
    setSelectedCategory(categories[key]); // DB에 전송될 카테고리의 숫자 ID를 상태에 저장
    setModalVisible(false); // 모달을 닫습니다.
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
        {/* 사업자 번호 인증 버튼 */}

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
        <Text style={styles.menutitle}>카테고리</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text>{selectedCategoryKey || "카테고리를 선택하세요"}</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)} // 바깥 영역을 누르면 모달 닫힘
          >
            <View style={styles.modalContent}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={Object.keys(categories)}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item}
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
          label="테이블링 유무"
          value={hasTabling}
          onValueChange={setHasTabling}
        />
        {/* 예약 유무 체크 버튼 */}
        <CustomCheckbox
          label="예약 유무"
          value={hasReservation}
          onValueChange={setHasReservation}
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
        {/* 테이블 관리 섹션 */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>테이블 관리</Text>
        </View>
        {tableTypes.map(renderTableType)}

        {/* 테이블 입력란을 렌더링하는 함수 호출 */}

        {/* <TouchableOpacity style={styles.button} onPress={ 가게 등록 로직 } > */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateStoreDetails}
        >
          <Text style={styles.meajang}>수정 완료</Text>
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
});

export default StoreRegistrationScreen;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

// Header 컴포넌트 정의
const Header = ({ navigation }) => {
  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("admin_main")}>
          <Ionicons name="arrow-back" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <Text style={styles.headerText}>메뉴 관리</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

// ShopSelectModal 컴포넌트 정의
const ShopSelectModal = ({ visible, onClose, onSelect, stores }) => {
  const options = ["매장1", "매장2", "매장3"]; // 예시 매장 목록
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {stores.map((store) => (
            <TouchableOpacity
              key={store.store_seq} // 각 매장을 구분하기 위한 고유한 키로 store_seq 사용
              style={styles.modalButton}
              onPress={() => {
                onSelect(store.store_name, store.store_seq);
                onClose();
              }}
            >
              <Text style={styles.modalButtonText}>{store.store_name}</Text>
            </TouchableOpacity>
          ))}
          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const App = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState("매장 선택");
  const [editingMenu, setEditingMenu] = useState(null); // 현재 편집 중인 메뉴 객체
  const scrollViewRef = useRef(null); // ScrollView를 참조하기 위한 ref
  const navigation = useNavigation();
  const [stores, setStores] = useState([]); // 서버로부터 받은 매장 목록을 저장할 상태
  const [selectedStoreSeq, setSelectedStoreSeq] = useState(null);
  const [menus, setMenus] = useState([]);

  const toggleMenuActiveStatus = async (menu) => {
    try {
      const response = await axios.post(
        "http://121.147.52.59:8090/botbuddies/menustate",
        { menu_seq: menu.menu_seq }
      );
      const updatedState = parseInt(response.data);
      console.log(
        `메뉴 식별자 ${menu.menu_seq} 메뉴 상태 변경 :`,
        updatedState
      ); // 로그 출력
      setMenus((prevMenus) =>
        prevMenus.map((item) =>
          item.menu_seq === menu.menu_seq
            ? { ...item, isActive: updatedState }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to toggle menu active status:", error);
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        const userInfo = JSON.parse(userInfoString || "{}");
        const response = await axios.post(
          "http://121.147.52.59:8090/botbuddies/storename",
          {
            user_id: userInfo.user_id,
          }
        );
        console.log("불러온 매장 이름들:", response.data); // 이 부분을 추가합니다.
        setStores(response.data); // 서버로부터 받은 매장 목록을 상태에 저장
        if (response.data.length > 0) {
          // 매장 목록이 있을 경우, 첫 번째 매장의 이름을 기본 선택값으로 설정
          setSelectedShop(response.data[0].store_name);
          setSelectedStoreSeq(response.data[0].store_seq); // 추가: 첫 번째 매장의 store_seq를 상태에 설정
        }
      } catch (error) {
        console.error("매장 목록을 가져오는 데 실패했습니다:", error);
      }
    };
    fetchStores();
  }, []);

  // 메뉴 데이터를 불러오는 부분
  useEffect(() => {
    const fetchMenus = async () => {
      if (selectedStoreSeq) {
        try {
          const response = await axios.post(
            "http://121.147.52.59:8090/botbuddies/storemenu",
            { store_seq: selectedStoreSeq }
          );
          // 서버로부터 받은 데이터를 기반으로 메뉴 리스트 업데이트
          const fetchedMenus = response.data.map((menu) => ({
            ...menu,
            // menu_state가 '1'이면 true, 아니면 false로 설정하여 isActive 상태 결정
            isActive: menu.menu_state === "1",
          }));
          setMenus(fetchedMenus); // 메뉴 상태 업데이트
        } catch (error) {
          console.error("메뉴 정보를 가져오는 데 실패했습니다:", error);
        }
      }
    };
    fetchMenus();
  }, [selectedStoreSeq]);

  const handleEditMenu = (menu) => {
    setEditingMenu(menu);
    setIsAddingNew(true); // 수정 모드로 변경
  };


  // 매장 선택 모달을 보여주는 함수
  const showShopSelectModal = () => {
    setModalVisible(true);
  };

  // 매장 선택 모달을 숨기는 함수
  const hideShopSelectModal = () => {
    setModalVisible(false);
  };

  
  const deleteMenu = async (menuSeq) => {
    try {
      await axios.delete(`http://121.147.52.59:8090/botbuddies/menudelete/${menuSeq}`);
      setMenus((currentMenus) =>
        currentMenus.filter((menu) => menu.menu_seq !== menuSeq)
      );
      Alert.alert("삭제 성공", "메뉴가 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("메뉴 삭제 실패:", error);
      Alert.alert("삭제 실패", "메뉴 삭제 중 오류가 발생했습니다.");
    }
  };
  

  const MenuEditor = ({ onSave, onCancel, existingMenu }) => {
    const [menuName, setMenuName] = useState(
      existingMenu ? existingMenu.menu_name : ""
    );
    const [menuDesc, setMenuDesc] = useState(
      existingMenu ? existingMenu.menu_desc : ""
    );
    const [price, setPrice] = useState(
      existingMenu ? existingMenu.price.toString() : ""
    );
    // 이미지 URL은 바로 state에 설정하므로 아래와 같이 초기화합니다.
    const [menuImgUrl, setMenuImgUrl] = useState(
      existingMenu ? existingMenu.menu_img : ""
    );
    const [imagePreviews, setImagePreviews] = useState(
      existingMenu ? [existingMenu.menu_img] : []
    );

    // ImagePicker를 통한 이미지 업로드 처리
    const handleImageUpload = async () => {
      if (imagePreviews.length >= 1) {
        Alert.alert("업로드 제한", "메뉴 사진은 1개만 업로드할 수 있습니다.");
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
          // 업로드된 이미지 URL 상태 업데이트
          setMenuImgUrl(uploadUrl);
          setImagePreviews([...imagePreviews, uploadUrl]);
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
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("Uploaded image URL:", downloadURL); // 이 부분이 URL을 콘솔에 출력합니다.
        return downloadURL;
      } catch (error) {
        console.error("Upload image error:", error);
        throw new Error("Failed to upload image");
      }
    };

    // 매장 사진 삭제를 위한 함수
    const handleRemoveMenuImage = (index) => {
      setImagePreviews((currentImages) =>
        currentImages.filter((_, i) => i !== index)
      );
    };

    // onSave 핸들러에서 모든 상태를 함께 전달
    const handleSave = () => {
      onSave({ menuName, menuDesc, price, menuImgUrl });
    };

    

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={onCancel}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleImageUpload}
              style={styles.uploadButton}
            >
              <Text style={styles.buttonText}>이미지 업로드</Text>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {imagePreviews.map((imageUri, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.menuImagePreview}
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveMenuImage(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TextInput
              value={menuName}
              onChangeText={setMenuName}
              placeholder="메뉴 이름"
              style={styles.input}
            />
            <TextInput
              value={menuDesc}
              onChangeText={setMenuDesc}
              placeholder="메뉴 설명"
              style={styles.input}
            />
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="가격"
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { marginRight: 10 }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { marginLeft: 10 }]}
                onPress={onCancel}
              >
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const handleSaveMenu = async ({ menuName, menuDesc, price, menuImgUrl }) => {
    try {
      const store_seq = selectedStoreSeq;

      if (!store_seq) {
        console.error("매장이 선택되지 않았습니다.");
        Alert.alert("오류", "매장이 선택되지 않았습니다.");
        return;
      }

      // 입력값 확인
      console.log("선택된 매장 seq:", store_seq);
      console.log("메뉴 이름:", menuName);
      console.log("메뉴 설명:", menuDesc);
      console.log("가격:", price);
      console.log("메뉴 이미지 URL:", menuImgUrl);

      const postData = {
        store_seq,
        menu_name: menuName,
        menu_desc: menuDesc,
        price: parseInt(price, 10),
        menu_img: menuImgUrl,
      };

      let response;

      if (editingMenu) {
        // 수정 모드
        postData.menu_seq = editingMenu.menu_seq;
        console.log("수정할 메뉴 데이터:", postData);

        response = await axios.post(
          "http://121.147.52.59:8090/botbuddies/menuupdate",
          postData
        );

        // 로그 출력
        console.log("메뉴 수정 응답:", response.data);

        // 수정된 메뉴로 상태 업데이트
        setMenus((currentMenus) =>
          currentMenus.map((menu) =>
            menu.menu_seq === editingMenu.menu_seq
              ? { ...menu, ...postData }
              : menu
          )
        );
      } else {
        // 추가 모드
        console.log("추가할 메뉴 데이터:", postData);

        response = await axios.post(
          "http://121.147.52.59:8090/botbuddies/insertmenu",
          postData
        );

        const newMenu = {
          ...postData,
          menu_seq: response.data.menu_seq,
          isActive: true,
        };

        // 새 메뉴를 메뉴 리스트에 추가
        setMenus((currentMenus) => [...currentMenus, newMenu]);
      }

      setIsAddingNew(false); // 모달 닫기
      setEditingMenu(null); // 편집 중인 메뉴 상태 초기화
      Alert.alert("성공", "메뉴가 성공적으로 처리되었습니다.");
    } catch (error) {
      console.error("메뉴 처리 실패:", error);
      Alert.alert("실패", "메뉴 처리 중 오류가 발생했습니다.");
    }
  };

  // 매장 선택 시 실행되는 함수 수정
  const handleSelectShop = (shopName, storeSeq) => {
    console.log("Selected shop:", shopName);
    setSelectedShop(shopName); // 선택된 매장 이름을 상태 변수로 설정
    setSelectedStoreSeq(storeSeq); // 선택된 매장의 store_seq를 상태 변수로 설정
    hideShopSelectModal();
  };

  // 각 메뉴 아이템을 표시하기 위한 컴포넌트
  const MenuItem = ({ menu, onEdit, onRemove, toggleMenuActiveStatus }) => {
    // 활성화/비활성화 상태에 따라 버튼 텍스트 결정
    const menuItemStyle = [
      styles.menuItem,
      { backgroundColor: menu.isActive ? "white" : "rgba(0, 0, 0, 0.1)" },
    ];

    const toggleButtonText = menu.isActive ? "활성화" : "비활성화";
    return (
      <View style={menuItemStyle}>
        <Image source={{ uri: menu.menu_img }} style={styles.menuImage} />
        <View style={styles.menuDetails}>
          <Text style={styles.menuTitle}>{menu.menu_name}</Text>
          <Text style={{ marginTop: 10 }}>{`${menu.price}원`}</Text>
          <Text style={{ marginTop: 10 }}>{menu.menu_desc}</Text>
        </View>
        <View style={styles.menuActions}>
          {/* 활성화/비활성화 상태 토글 버튼 */}
          <TouchableOpacity
            onPress={() => toggleMenuActiveStatus(menu)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>{toggleButtonText}</Text>
          </TouchableOpacity>
          {/* 수정 버튼 */}
          <TouchableOpacity
            onPress={() => onEdit(menu)}
            style={styles.menuButton}
          >
            <Text style={styles.menuButtonText}>수정</Text>
          </TouchableOpacity>
          {/* 제거 버튼 */}
          <TouchableOpacity
            onPress={() => deleteMenu(menu.menu_seq)}
            style={styles.menuButton}
          >
            <Text style={styles.menuButtonText}>제거</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation} />
      {/* 매장 선택 모달을 표시하는 버튼 */}
      <TouchableOpacity
        style={styles.storeButton}
        onPress={showShopSelectModal}
      >
        {/* 선택된 매장 이름으로 버튼 텍스트 업데이트 */}
        <Text style={styles.storeButtonText}>{selectedShop}</Text>
      </TouchableOpacity>
      {/* ShopSelectModal 컴포넌트 */}
      <ShopSelectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(shopName, storeSeq) => handleSelectShop(shopName, storeSeq)}
        stores={stores}
      />

      <ScrollView style={styles.scrollView}>
        {menus.map((menu, index) => (
          <MenuItem
            key={index}
            menu={menu}
            onEdit={() => handleEditMenu(menu)}
            onRemove={() => deleteMenu(menu.menu_seq)} // 수정된 부분
            toggleMenuActiveStatus={() => toggleMenuActiveStatus(menu)} // Passing the function as a prop
          />
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingMenu(null); // 편집 중인 메뉴 정보 초기화
            setIsAddingNew(true); // 새 메뉴 추가 모드 활성화
          }}
        >
          <Text style={{ alignSelf: "center", fontSize: 20 }}>+</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* 새 메뉴 추가 또는 수정을 위한 Modal 또는 Editor 컴포넌트 */}
      {isAddingNew && (
        <MenuEditor
          onSave={handleSaveMenu}
          onCancel={() => setIsAddingNew(false)}
          existingMenu={editingMenu}
        />
      )}
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
    marginBottom: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 129,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  menuImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  menuDetails: {
    flex: 1,
    marginLeft: 10,
  },
  menuTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  menuActions: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    margin: 5,
  },
  addButton: {
    backgroundColor: "red",
    alignSelf: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  storeButton: {
    borderWidth: 1,
    borderRadius: 15,
    width: "80%",
    borderColor: "black",
    alignSelf: "center",
    justifyContent: "center",
    height: 50,
    marginBottom: 15,
  },
  storeButtonText: {
    alignSelf: "center",
    color: "black",
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  modalButton: {
    paddingVertical: 15,
  },
  modalButtonText: {
    fontSize: 20,
    textAlign: "center",
  },
  menuImage: {
    // 이미지 미리보기 스타일 정의
    width: 100,
    height: 100,
    borderRadius: 10, // 둥근 모서리
    alignSelf: "center", // 중
  },
  imagePreviewContainer: {
    flexDirection: "column", // 가로로 이미지를 나열
    alignItems: "center", // 세로 축 중앙 정렬
    justifyContent: "center", // 가로 축 중앙 정렬
  },
  menuImagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10, // 이미지 둥근 모서리 처리
    marginBottom: 10, // 이미지와 삭제 버튼 사이의 간격
  },
  deleteButton: {
    marginTop: -25,
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  uploadButton: {
    backgroundColor: "red", // 업로드 버튼 배경색
    padding: 10,
    borderRadius: 5,
    marginBottom: 20, // 업로드 버튼과 이미지 미리보기 사이의 간격
    alignSelf: "center",
  },
  button: {
    backgroundColor: "red", // 기본 버튼 배경색
    padding: 10,
    marginVertical: 10, // 버튼 간의 수직 간격
    borderRadius: 5,
    width: "80%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "30%",
  },
  menubutton: {
    backgroundColor: "red", // 기본 버튼 배경색
    padding: 10,
    marginVertical: 10, // 버튼 간의 수직 간격
    borderRadius: 5,

    alignSelf: "center",
  },
  menubuttontext: {
    alignSelf: "center",
  },
  inputmenu: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    height: 40,
    width: 250,
    alignSelf: "center",
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: "#ffffff", // 원하는 배경색으로 설정
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 15,
  },
  closeButtonText: {
    color: "#ff3b30", // 텍스트 색상을 설정
    fontWeight: "bold",
    fontSize: 20,
  },
  toggleButton: {
    backgroundColor: "red",
    padding: 10,
    marginBottom: 5, // 다른 버튼과의 간격
    borderRadius: 5,
  },
  toggleButtonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  menuButton: {
    backgroundColor: "red",
    padding: 10,
    marginTop: 5, // 다른 버튼과의 간격
    borderRadius: 5,
  },
  menuButtonText: {
    color: "#ffffff",
    textAlign: "center",
  },
});

export default App;

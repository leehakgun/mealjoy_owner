import React, { useState, useEffect, useCallback } from "react";
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
  Platform,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

// Header 컴포넌트
const Header = ( {navigation} ) => {
  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('admin_main')}>
          <Ionicons name="arrow-back" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <Text style={styles.headerText}>마이 페이지</Text>
      </View>
        <View style={styles.headerDivider} />
      <View style={styles.divider} />
    </View>
  );
};



// 매장 선택을 위한 팝업 모달 컴포넌트
const ShopSelectModal = ({ visible, onClose, onSelect,stores }) => {
  const options = [
    "나주곰탕 양산점",
    "나주곰탕 신가점 2",
    "나주곰탕 용봉점 3",
  ];

  // 모달 바깥 부분 터치 이벤트 처리
  const handleModalOuterPress = () => {
    onClose(); // 모달 닫기
  };

  return (
    <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    {/* 모달 컨텐츠 */}
    <View style={styles.modalOverlay}>
      {/* ... */}
      <View style={styles.modalContentContainer}>
  {stores.map((store, index) => (
    <TouchableOpacity
      key={store.storeInfo[0].store_seq}
      style={styles.modalButton}
      onPress={() => onSelect(store.storeInfo[0].store_name, store.storeInfo)}
    >
      <Text style={styles.modalButtonText}>{store.storeInfo[0].store_name}</Text>
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
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [isStartDatePicker, setIsStartDatePicker] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' 또는 'replied'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigation = useNavigation();
  const [stores, setStores] = useState([]); // 모든 매장 목록을 저장할 상태
  const [selectedStore, setSelectedStore] = useState('매장 선택'); // 첫 번째 store_name을 담을 상태
  const [storeNames, setStoreNames] = useState([]); 
 const[storeInfo, setStoreInfo] = useState([]);
 const [selectedStoreSeq, setSelectedStoreSeq] = useState(null);
 const [user_id, setSelectedUserName] = useState(null);


 useEffect(() => {
  // 서버로부터 매장 데이터를 받아오는 함수
  const fetchStores = async () => {
    try {
      // userInfo에서 userId 추출
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
      // 서버에 요청 보내기
      const response = await axios.post('http://61.80.80.153:8090/botbuddies/review', {
        userId: userInfo.user_id
      });
      console.log("받은 값:",response.data[0].storeInfo[0].store_name);
      console.log("받은 값:",response.data[0].storeInfo[0].user_id); // 서버 응답 로그 출력

      console.log("테스트1", response.data)
      setStores(response.data);
      setStoreInfo(response.data[0].storeInfo);
      // 응답 데이터 처리
      // 첫 번째 매장 이름을 선택된 매장으로 설정
      if (response.data && response.data.length > 0) {
        setSelectedStore(response.data[0].storeInfo[0].store_name);
        setSelectedStoreSeq(response.data[0].storeInfo[0].store_seq); // 이 줄을 추가합니다
        setSelectedUserName(response.data[0].storeInfo[0].user_id);
        console.log("받은 store_seq:", response.data[0].storeInfo[0].store_seq); // 이 줄을 추가합니다
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  fetchStores();
}, []);
  
  
const go_logout =async () => {
  
      // 로그아웃 성공, 로컬 스토리지에서 사용자 정보 삭제
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userToken');
      // 사용자를 로그인 화면 또는 홈 화면으로 리디렉션
      navigation.navigate('HomeLogin'); // 'Login'은 로그인 화면의 라우트 이름
 
}


  

  // 매장 선택 핸들러 함수
  const handleSelectStore = (storeName, selectStoreInfo) => {
    console.log("매장명", storeName);
    console.log("매장정보", selectStoreInfo);
    setSelectedStore(storeName);
    setStoreInfo(selectStoreInfo);
    setSelectedStoreSeq(selectStoreInfo[0].store_seq);
    setModalVisible(false); // 모달 닫기
  };


  // 매장 선택 모달 닫는 핸들러
  const handleSelect = (option) => {
    console.log("선택된 옵션:", option);
    setModalVisible(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    
  };

  const handleDeleteConfirm = async () => {
    console.log("선택된 매장의 store_seq:", selectedStoreSeq);
    if (!selectedStoreSeq) {
      console.log("선택된 매장이 없습니다.");
      return;
    }
  
    try {
      // 가게 삭제 API 호출
      const response = await axios.post('http://61.80.80.153:8090/botbuddies/deleteStore', {
        storeSeq: selectedStoreSeq, // 삭제할 매장의 store_seq
        userId: user_id
      });
      console.log("가게 삭제 성공:", response.data);
      setStores(response.data)
      setSelectedStore(response.data[0].storeInfo[0].store_name);
  
      // 사용자에게 알림창 표시
      Alert.alert(
        "매장 삭제 완료", // 알림 제목
        "매장이 성공적으로 삭제되었습니다.", // 알림 메시지
        [
          {
            text: "확인",
            onPress: () => {
              
              setShowDeleteModal(false); // 삭제 확인 모달 닫기
            }
          }
        ]
      );
  
    } catch (error) {
      console.error('가게 삭제 실패:', error);
    }
};

  const handleDeleteCancel = () => {
    console.log("가게 삭제 취소.");
    setShowDeleteModal(false);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation}/>
      <ScrollView>
        <View style={styles.selectionContainer}>
        <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectionContent}>
              <Text style={styles.selectionButtonText}>{selectedStore}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={30} color="black"/>
            </View>
          </TouchableOpacity>

          
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('store_modification')}>
            <Text style={styles.editButtonText}>매장 정보 수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.boxButtonText}  >매장 삭제</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logout}>
          <TouchableOpacity onPress={go_logout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <ShopSelectModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onSelect={handleSelectStore}
  stores={stores} // 추출한 매장 이름 배열을 props로 전달합니다.
/>
          <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteModalContent}>
              <Text>가게를 삭제하시겠습니까?</Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.deleteModalButton, { marginRight: 10 }]}
                  onPress={handleDeleteConfirm}
                >
                  <Text style={styles.deleteModalButtonText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteModalButton2}
                  onPress={handleDeleteCancel}
                >
                  <Text style={styles.deleteModalButtonText2}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
        </Modal>
        
      </ScrollView>

      {/* 탭 바 부분 */}

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('admin_main')}>
          <Entypo name="home" size={24} color="#ff3b30" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome6 name="user" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#fff",
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
      width: "100%",
      maxHeight: "50%",
    },
    modalButton: {
      padding: 15,
      width: "100%",
    },
    modalButtonText: {
      fontSize: 20,
      textAlign: "center",
    },
    selectionContainer: {
      paddingVertical: 15, // 상하 패딩을 조금 늘립니다.
      paddingHorizontal: 10, // 좌우 패딩을 늘립니다.
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "stretch", // 컨테이너가 전체 폭을 차지하도록 합니다.
      borderWidth: 1,
      borderColor: "#929292",
      borderRadius: 5,
      marginHorizontal: 10, // 좌우 마진을 줄입니다.
      marginTop: 10, // 위쪽 마진을 추가합니다.
      marginBottom: 20, // 아래쪽 마진을 늘립니다.
      
    },
    buttonText: {
      fontSize: 30,
    },
    reviewImage: {
      width: 50,
      height: 50,
      resizeMode: "cover",
    },
    ownerResponseInput: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 4,
      padding: 5,
    },
    filterButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    filterButton: {
      width: 150,
      height: 50,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
  boxContainer: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    // 상자 안의 여백과 그림자 효과를 추가할 수 있습니다.
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  innerBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 버튼 사이에 공간을 두기 위함
  },
  
  boxButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  selectionButton: {
    borderWidth: 1, // 버튼 테두리 두께
    borderColor: '#ccc', // 버튼 테두리 색상
    paddingVertical: 20, // 상하 패딩
    paddingHorizontal: 70, // 좌우 패딩
    borderRadius: 6, // 모서리 둥글기
    marginBottom: 20, // 다른 요소들과의 여백
    alignItems: 'center', // 내용물 가운데 정렬
    marginBottom: 15, // 다음 버튼과의 여백을 늘립니다.
    width:'90%',
  },
  selectionButtonText: {
    fontSize: 16,
    color: '#000', // 글자 색상
    fontWeight: 'bold',
    paddingRight:10,
  },
  // 가게 수정, 가게 삭제 버튼 
  editButton: {
    backgroundColor: '#FFFFFF', // 하얀 배경
    borderWidth: 1, // 테두리 두께
    borderColor: '#ff3b30', // 빨간색 테두리
    paddingHorizontal: 20, // 좌우 패딩 늘리기
    paddingVertical:8,
   
    borderRadius: 6, // 모서리 둥글기
    width: '90%', // 버튼 너비
    marginBottom: 10, // 버튼 간 여백
  },
  editButtonText: {
    textAlign: 'center',
    color: '#ff3b30', // 빨간색 글자
    fontWeight: 'bold',
    
  },
  deleteButton: {
    backgroundColor: '#ff3b30', // 빨간 배경
    paddingVertical: 10, // 상하 패딩
    paddingHorizontal: 30, // 좌우 패딩 늘리기
    borderRadius: 6, // 모서리 둥글기
    width: '90%', // 버튼 너비
  },
  // 설정 메뉴 css
   
  deleteModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  deleteModalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  deleteModalButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  deleteModalButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  selectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10, // 가장자리와 내용물 사이의 간격을 조정합니다.
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
    fontSize : 20,
  },
  headerDivider: {
    height: 1, // 구분선의 두께
    backgroundColor: '#e0e0e0', // 구분선 색상
    marginVertical: 10, // 위 아래 마진
  },
  deleteModalButtonText: {
    color:"#fff",
    fontWeight:"bold"
  },
  deleteModalButtonText2: {
    color:"#ff3b30",
    borderColor:"#ff3b30",
    fontWeight:"bold",
   
  },
  deleteModalButton2 :{
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth:1,
    borderColor:"#ff3b30",
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 오버레이
  },
  logout: {
    // 탭 바 바로 위에 위치하도록 marginBottom을 조정합니다.
    marginBottom: 70, // 탭 바의 높이와 동일하거나 그보다 조금 더 높은 값을 설정합니다.
    alignItems: 'center', // 가운데 정렬
    marginTop: 350, // 필요한 경우 상단 여백 추가
  },
  
  logoutText: {
    color: '#929292', // 연한 회색
    fontSize: 16, // 글자 크기 조정
  },
  
  });
  
export default App;
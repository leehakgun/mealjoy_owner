import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";

import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { LocaleConfig } from "react-native-calendars";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';




LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";






// Header 컴포넌트
const Header = ( { navigation } ) => {
  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('admin_main')}>
          <Ionicons name="arrow-back" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <Text style={styles.headerText}>리뷰 관리</Text>
      </View>
      {/* 헤더 아래 선 추가 */}
      <View style={styles.headerDivider} />
    </View>
  );
};

const ReviewCard = ({ review, onUpdate, setStores, setStoreInfo }) => {
 
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(review.answer || "");
  const [ownerResponse, setOwnerResponse] = useState(""); // 사장님 답변을 위한 상태 추가
  const navigation = useNavigation();


  const handleOwnerResponseSubmit = async () => {
    // onUpdate 함수를 호출하여 상위 컴포넌트에 변경 사항을 알림
    
    setOwnerResponse(""); // 입력 필드 초기화n
    // console.log("답변", ownerResponse)
    try {

      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      
  
      // 서버에 리뷰 등록 요청
      const response = await axios.post('http://218.149.140.89:8090/botbuddies/insertans', {
        review_seq: review.review_seq,
        answer : ownerResponse,
        user_id:userInfo.user_id
      });


  
      // HTTP 상태 코드가 200 범위 내이면 성공으로 간주
      if (response.status >= 200 && response.status < 300) {
        // // 리뷰 데이터를 다시 불러와 화면 업데이트
        // onUpdate(review.review_seq, ownerResponse);

        setStores(response.data);
        setStoreInfo(response.data[0].storeInfo);

        

        
      } else {
        // HTTP 상태 코드가 성공 범위를 벗어난 경우 사용자에게 알림 처리
       
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      // 네트워크 오류나 기타 예외 처리를 위한 사용자 알림
      
    }
  };

  const openEditModal = () => {
    setCurrentEdit(review.answer);
    setEditModalVisible(true);
  };

  const submitEdit = async () => {
    onUpdate(review.review_seq, currentEdit); // 수정된 owner 텍스트와 함께 review.id를 넘겨줌
    setEditModalVisible(false);


    // console.log("답변", currentEdit)
    try {

      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      
  
      // 서버에 리뷰 등록 요청
      const response = await axios.post('http://218.149.140.89:8090/botbuddies/updateans', {
        review_seq: review.review_seq,
        answer : currentEdit,
        user_id:userInfo.user_id
      });


  
      // HTTP 상태 코드가 200 범위 내이면 성공으로 간주
      if (response.status >= 200 && response.status < 300) {
        // // 리뷰 데이터를 다시 불러와 화면 업데이트
        // onUpdate(review.review_seq, ownerResponse);

        setStores(response.data);
        setStoreInfo(response.data[0].storeInfo);

       

        
      } else {
        // HTTP 상태 코드가 성공 범위를 벗어난 경우 사용자에게 알림 처리
        
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      // 네트워크 오류나 기타 예외 처리를 위한 사용자 알림
     
    }
  };

  const handleCancelEdit = () => {
    setCurrentEdit(review.answer); // 취소 시 이전 댓글 내용으로 되돌림
    setEditModalVisible(false);
  };

  // 별점을 렌더링하는 함수
  const renderStars = () => {
    return Array.from({ length: review.score }, (_, i) => (
      <AntDesign key={i} name="star" size={13} color="#ffd700" />
    ));
  };

  const onDelete = async () => {
    // console.log(review. review_seq)
    try {
     
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      const review_seq = review.review_seq;
      // 서버에 리뷰 삭제 요청
      const response = await axios.post('http://218.149.140.89:8090/botbuddies/Deleteanswer', {
        review_seq: review.review_seq
      });
  
      // HTTP 상태 코드가 200 범위 내이면 성공으로 간주
      if (response.status >= 200 && response.status < 300) {
        // 리뷰 데이터를 다시 불러와 화면 업데이트
        setStoreInfo(prevStoreInfo => prevStoreInfo.filter(item => item.review_seq !== review_seq));
        
      } else {
        // HTTP 상태 코드가 성공 범위를 벗어난 경우 사용자에게 알림 처리
       
      }
    } catch (error) {
     
      // 네트워크 오류나 기타 예외 처리를 위한 사용자 알림
      
    }
  };

  // 이미지를 렌더링하는 함수
  const renderImages = () => {
    // 리뷰 이미지 파일 이름이 쉼표로 구분된 문자열인 경우
    if (typeof review.reviewImageFilenames === "string") {
      const imageUris = review.reviewImageFilenames.split(','); // 쉼표로 구분하여 배열 생성
  
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {imageUris.map((uri, index) => (
            <Image key={index} source={{ uri: uri.trim() }} style={styles.reviewImage} />
          ))}
        </ScrollView>
      );
    }
    // 리뷰 이미지 파일 이름이 배열인 경우 (이미 분리된 경우)
    else if (Array.isArray(review.reviewImageFilenames)) {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {review.reviewImageFilenames.map((uri, index) => {
            // URI가 문자열이라면, 원격 이미지로 간주하고 처리
            if (typeof uri === "string") {
              return <Image key={index} source={{ uri: uri.trim() }} style={styles.reviewImage} />;
            }
            // URI가 문자열이 아니라면, 로컬 이미지로 간주하고 처리
            else {
              return <Image key={index} source={uri} style={styles.reviewImage} />;
            }
          })}
        </ScrollView>
      );
    }
    // 그 외 경우, 아무것도 렌더링하지 않음
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      
        <View style={styles.reviewCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Image
            source={require('./assets/user.png')}
            style={styles.userImage}
          />
          <Text style={styles.customerName}>{review.reviewUserNick}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            {renderStars()}
          </View>
          <Text style={styles.reviewtitle}>{review.title}</Text>
          <Text style={styles.reviewText}>{review.details}</Text>
          {renderImages()}



          {review.answer && ( // owner 정보가 있을 때만 렌더링
            <View style={styles.ownerContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
          source={require("./assets/owner2.png")}
          style={styles.ownerImage}
            />
              <Text style={styles.ownername}>사장님</Text>
              </View>
              <Text style={styles.ownerText}>{review.answer}</Text>
              <View style={styles.editDeleteButtonContainer}>
              <TouchableOpacity onPress={openEditModal} style={styles.submitButton} >
                  <Text style={styles.submitButtonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(review.customerName)} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>삭제</Text>
                </TouchableOpacity>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={editModalVisible}
                  onRequestClose={() => setEditModalVisible(false)}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <TextInput
                        style={styles.modalTextInput}
                        onChangeText={(text) => setCurrentEdit(text)}
                        value={currentEdit}
                      />
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          onPress={submitEdit}
                          style={styles.submitButton}
                        >
                          <Text style={styles.submitButtonText}>등록</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleCancelEdit}
                          style={styles.cancelButton}
                        >
                          <Text style={styles.cancelButtonText}>취소</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          )}
          {review.answer ? (
  // 이미 답변이 있는 경우, 아무것도 표시하지 않음
  <View></View>
) : (
  // 답변이 없는 경우, 답변 입력을 위한 텍스트 필드와 '등록' 버튼 표시
  <View>
    <TextInput
      style={styles.ownerResponseInput}
      placeholder="답변을 입력하세요..."
      value={ownerResponse}
      onChangeText={setOwnerResponse}
    />
    <TouchableOpacity
      onPress={handleOwnerResponseSubmit}
      style={styles.submitButton}
    >
      <Text style={styles.submitButtonText}>등록</Text>
    </TouchableOpacity>
  </View>
)}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      {  Array.isArray(stores) &&
      stores.map((store, index) => (
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






const RatingSummary = ({ reviews }) => {
  const maxReviews = Math.max(...reviews.map((r) => r.count));

  // 리뷰 개수가 모두 0인지 확인
  const allReviewsAreZero = reviews.every(review => review.count === 0);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>리뷰 평점</Text>
      {reviews.map((review, index) => (
        <View key={index} style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>{`${review.rating}점`}</Text>
          <View style={styles.ratingBarContainer}>
            <View
              style={[
                styles.ratingBar,
                // 리뷰 개수가 0이거나 모든 리뷰의 개수가 0이면 회색, 아니면 빨간색
                { backgroundColor: allReviewsAreZero || review.count === 0 ? '#D3D3D3' : '#ff3b30', width: `${(review.count / maxReviews) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.reviewCount}>{review.count}</Text>
        </View>
      ))}
    </View>
  );
};



const App = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(today);
  const [stores, setStores] = useState([]); // 모든 매장 목록을 저장할 상태
  const [selectedStore, setSelectedStore] = useState('매장 선택'); // 첫 번째 store_name을 담을 상태
  const [storeNames, setStoreNames] = useState([]); 
 const[storeInfo, setStoreInfo] = useState([]);



 const reviewsData = [  
  { rating: 5, count: 0 },
  { rating: 4, count: 0 },
  { rating: 3, count: 0 },
  { rating: 2, count: 0 },
  { rating: 1, count: 0 },
];

const updateReviewCounts = (reviewsData, reviewList) => {
  // reviewsData의 구조를 그대로 복사하여 새로운 배열을 만듭니다.
  const updatedReviewsData = reviewsData.map(review => ({ ...review }));
  // console.log("리뷰 정보", reviewList)
  // reviewList를 순회하면서 각 리뷰의 score에 해당하는 rating을 찾아 count를 1 증가시킵니다.
  reviewList.forEach(reviews => {
    const score = reviews.score;
    const score2 = parseInt(score, 10);
    const reviewDataIndex = updatedReviewsData.findIndex(data => data.rating === score2);
    
    if (reviewDataIndex !== -1) {
      updatedReviewsData[reviewDataIndex].count += 1;
    }

  });

  return updatedReviewsData;
};

const updatedReviewsData = updateReviewCounts(reviewsData, storeInfo);
  // console.log(updatedReviewsData);



  useEffect(() => {
    // 서버로부터 매장 데이터를 받아오는 함수
    const fetchStores = async () => {
      try {
        // userInfo에서 userId 추출
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
        // 서버에 요청 보내기
        const response = await axios.post('http://218.149.140.89:8090/botbuddies/review', {
          userId: userInfo.user_id
        });
        // console.log("받은 값:",response.data[0].storeInfo[0].store_name); // 서버 응답 로그 출력
         setStores(response.data);
         setStoreInfo(response.data[0].storeInfo);
        // 응답 데이터 처리
         // 첫 번째 매장 이름을 선택된 매장으로 설정
      if (response.data && response.data.length > 0) {
        setSelectedStore(response.data[0].storeInfo[0].store_name);
      } else {
        // 서버 응답이 배열이 아니면 빈 배열로 상태 업데이트
        setStores([]);
      }
        
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
  
    fetchStores();
  }, []);
 


  const handleSelectStore = (storeName, selectStoreInfo) => {
    // console.log("매장명", storeName);
    // console.log("매장정보", selectStoreInfo);
    setSelectedStore(storeName);
    setStoreInfo(selectStoreInfo);
    setModalVisible(false); // 모달 닫기
  };

  

  const onDayPress = (day) => {
    const selectedDateString = day.dateString;
    // 선택된 날짜가 오늘 이후의 날짜인지 확인
    if (moment(selectedDateString).isAfter(today)) {
      // 오늘 이후의 날짜이므로 선택하지 않음
      alert("오늘 이후의 날짜는 선택할 수 없습니다.");
      return;
    }
    setSelectedDate(selectedDateString);
  };

  const calendarTheme = {
    todayTextColor: "black",
    textDayFontSize: 15,
    textMonthFontSize: 20,
    textMonthFontWeight: "bold",
    textSectionTitleColor: "rgba(138, 138, 138, 1)",
    arrowColor: "#ff3b30",
    selectedDayBackgroundColor: "#ff3b30",
    selectedDayTextColor: "#ffffff",
    monthFormat: "YYYY년 MMMM",
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [isStartDatePicker, setIsStartDatePicker] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' 또는 'replied'
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateForPicker, setDateForPicker] = useState("start"); // 'start' or 'end'
  const [markedDates, setMarkedDates] = useState({});
  const today = moment().format("YYYY-MM-DD");
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [reviewData, setReviewData] = useState([]); 
  const route = useRoute();
  const { userInfo } = route.params;
  const [reviews, setReviews] = useState([]); // 리뷰 데이터를 상태로 관리

  // 리뷰 데이터를 업데이트하는 함수
  const handleUpdateReview = (reviewId, newOwnerResponse) => {
    // console.log("업데이트 전 리뷰:", reviews); // 업데이트 전 상태 로그
    const updatedReviews = reviews.map((review) => {
      if (review.review_seq === reviewId) {
        // id가 일치하는 리뷰를 찾아 owner 필드를 업데이트
        return { ...review, owner: newOwnerResponse };
      }
      return review;
    });
    // console.log("업데이트 후 리뷰:", updatedReviews); // 업데이트 후 상태 로그
    setReviews(updatedReviews); // 업데이트된 리뷰 배열로 상태 업데이트
  };
  
  const showDatePickerModal = (forPicker) => {
    const currentDate = new Date();
    const selectedDate = forPicker === "start" ? startDate : endDate;

    // 종료 날짜를 선택하는 경우 현재 날짜 이후인지 확인
    if (forPicker === "end" && selectedDate.getTime() > currentDate.getTime()) {
      alert("종료 날짜는 현재 날짜 이후로 선택할 수 없습니다.");
      return;
    }

    setDateForPicker(forPicker);
    setDatePickerVisibility(true);
  };

  const handleDateSelect = (day) => {
    const selectedDay = new Date(day.dateString);

    if (dateForPicker === "start") {
      setStartDate(selectedDay);
      setDateForPicker("end");
    } else if (dateForPicker === "end") {
      setEndDate(selectedDay);
      setDateForPicker("start");
    }

    // 선택된 날짜로 마킹 업데이트
    updateMarkedDates(selectedDay);

    // 모달을 닫지 않고 닫기 버튼을 누를 때만 닫습니다.
  };

  // 시작 날짜부터 종료 날짜까지 연속적인 날짜를 빨간색으로 표시하는 함수
  const updateMarkedDates = (selectedDay) => {
    let start = startDate;
    let end = endDate;

    if (dateForPicker === "start") {
      start = selectedDay;
    } else {
      end = selectedDay;
    }

    const period = {};
    let current = new Date(start.getTime());

    while (current <= end) {
      const dateString = moment(current).format("YYYY-MM-DD");

      // Apply solid color to start and end dates
      if (
        current.getTime() === start.getTime() ||
        current.getTime() === end.getTime()
      ) {
        period[dateString] = {
          selected: true,
          startingDay: current.getTime() === start.getTime(),
          endingDay: current.getTime() === end.getTime(),
          color: "#ff3b30",
          textColor: "white",
        };
      } else {
        // Apply transparent color to dates in between
        period[dateString] = {
          color: "#ff3b30", // 70% opacity of #ff3b30
          textColor: "white",
        };
      }

      current.setDate(current.getDate() + 1);
    }

    setMarkedDates(period);
  };

  // 리뷰 데이터에서 답변이 있는 리뷰만 필터링하는 함수
  const repliedReviews = storeInfo.filter((review) => review.answer);

  // 현재 필터에 따라 보여줄 리뷰 리스트를 결정하는 함수
  // 리뷰 정보 수정 
  const displayedReviews = useMemo(() => {
    // 배열인지 확인 후, 배열이 아니라면 빈 배열로 대체
    const currentReviews = Array.isArray(isDateFiltered ? reviewData : storeInfo) ? (isDateFiltered ? reviewData : storeInfo) : [];
    
    return currentReviews.filter(review => {
        if (filter === "all") return true;
        if (filter === "unreplied") return !review.answer;
        return true;
    });
}, [filter, isDateFiltered, reviewData, storeInfo]);
  // 리뷰 조회 함수
  // 리뷰 데이터를 저장할 상태 변수 추가

  const searchReviews = async () => {
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    const storeSeqArray = storeInfo.map(info => info.store_seq);
    // console.log("뭐게?",storeSeqArray[0]);
    
    const Start_Date = formatDate(startDate);
    const End_Date = formatDate(endDate);
  
    try {
      const response = await axios.post('http://218.149.140.89:8090/botbuddies/search_review', {
        startDate: Start_Date,
        endDate: End_Date,
        store_seq: storeSeqArray[0],
      });
  
      if (response.status >= 200 && response.status < 300) {
        setReviewData(response.data);
        setIsDateFiltered(true); // 날짜 필터가 적용된 상태로 설정
        // console.log("리뷰데이터",response.data)
        
        // console.log(reviewData); // 상태 업데이트 이후 로깅
      } else {
        console.error("HTTP error:", response.status);
      }
    } catch (error) {
      console.error("Network or other error:", error);
    }
  };

  // 매장 선택 모달 닫는 핸들러
  const handleSelect = (option) => {
    // console.log("선택된 옵션:", option);
    setModalVisible(false);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // 리뷰 출력 수정 중
  const filteredReviews = storeInfo.filter((review) => {
    if (filter === "all") {
      return true; // 모든 리뷰를 반환
    }
    if (filter === "unreplied") {
      return !review.answer; // 답변이 비어 있는 리뷰만 반환
    } // '미답변 리뷰' 필터가 선택된 경우 owner 필드가 비어 있는 리뷰만 반환
    return true;
  });

  const RatingSummary = ({ reviews }) => {
    const maxReviews = Math.max(...reviews.map((r) => r.count));
  
    // 리뷰 개수가 모두 0인지 확인
    const allReviewsAreZero = reviews.every(review => review.count === 0);
  
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>리뷰 평점</Text>
        {reviews.map((review, index) => (
          <View key={index} style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{`${review.rating}점`}</Text>
            <View style={styles.ratingBarContainer}>
              <View
                style={[
                  styles.ratingBar,
                  // 리뷰 개수가 0이거나 모든 리뷰의 개수가 0이면 회색, 아니면 빨간색
                  { backgroundColor: allReviewsAreZero || review.count === 0 ? '#D3D3D3' : '#ff3b30', width: `${(review.count / maxReviews) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.reviewCount}>{review.count}</Text>
          </View>
        ))}
      </View>
    );
  };
  


  {filteredReviews.map((review) => (
    <ReviewCard
      key={review.review_seq}
      review={review}
      onUpdate={handleUpdateReview}
    />
  ))}

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation}/>
      <ScrollView>
        <View>
        <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.selectionContent}>
              <Text style={styles.selectionButtonText}>{selectedStore}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={30} color="black"/>
            </View>
          </TouchableOpacity>
        </View>
        <ShopSelectModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onSelect={handleSelectStore}
  stores={stores} // 추출한 매장 이름 배열을 props로 전달합니다.
/>

        {/* 리뷰평점 */}
        <RatingSummary reviews={updatedReviewsData} />

        <View style={styles.datebutton}>
          {/* 날짜 범위 선택 버튼 */}
          <View style={styles.dateRangeButtonContainer}>
            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              style={styles.dateRangeButton}
            >
              <Ionicons name="calendar" size={24} color="#ff3b30" />
              <Text style={styles.dateRangeButtonText}>{`${moment(
                startDate
              ).format("YYYY-MM-DD")} ~ ${moment(endDate).format(
                "YYYY-MM-DD"
              )}`}</Text>
            </TouchableOpacity>

            {/* 조회 버튼 */}
            <TouchableOpacity onPress={searchReviews}>
              <View style={styles.inquiryContainer}>
                <Text style={styles.buttonText}>조회</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 날짜 선택 모달 */}
          {isDatePickerVisible && (
            <Modal visible={isDatePickerVisible} transparent={true}>
              <View style={styles.calendarmodalContainer}>
                <View style={styles.calendarmodalContent}>
                  <Calendar
                    onDayPress={(day) => handleDateSelect(day)}
                    markedDates={markedDates}
                    markingType={"period"}
                    theme={calendarTheme}
                  />
                  <TouchableOpacity
                    style={styles.okbutton}
                    onPress={() => setDatePickerVisibility(false)}
                  >
                    <Text style={styles.oktext}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>

        <View style={styles.headerDivider} />
        <View style={styles.filterButtonContainer}>
        <TouchableOpacity
          onPress={() => handleFilterChange("all")}
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonSelected,
          ]}
        >
          <Text style={styles.filterButtonText}>전체 리뷰</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFilterChange("unreplied")}
          style={[
            styles.filterButton,
            filter === "unreplied" && styles.filterButtonSelected,
          ]}
        >
          <Text style={styles.filterButtonText}>미답변 리뷰</Text>
        </TouchableOpacity>
      </View>
      {
  displayedReviews.length > 0 ? (
    displayedReviews.map((review) => (
      <ReviewCard key={review.review_seq} review={review}
      setStores={setStores}
            setStoreInfo={setStoreInfo}
            onUpdate={handleUpdateReview} />
    ))
  ) : (
    <View style={styles.centeredContent}>
    <Text style={styles.centeredText}>리뷰가 없습니다.</Text>
  </View>
  )
}
            
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
  // 모달 전체 배경 스타일
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 오버레이
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalButton: {
    padding: 15,
    width: "100%",
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16, // 텍스트 폰트 크기 변경
    color: "#ff3b30",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    margin: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 16,
    width: 40,
  },
  ratingBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  ratingBar: {
    height: 10,
    backgroundColor: "#ff3b30",
    borderRadius: 5,
  },
  reviewCount: {
    fontSize: 16,
  },
  datebutton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  inquiryContainer: {
    flex: 1,
    paddingVertical: 10, // 상하 패딩을 20으로 설정
    paddingHorizontal: 20, // 좌우 패딩 (선택적으로 추가 가능)
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1, // 테두리선 추가
    borderColor: "#ff3b30", // 테두리선 색상
    borderRadius: 20, // 테두리 모서리를 둥글게
    width: 70, // 컨테이너의 너비를 지정
    backgroundColor: "#fff",
  },
  reviewCard: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 6,
  },
  customerName: {
    fontWeight: "bold",
    fontSize: 15,
  },
  reviewImage: {
    width: 150, // 이미지 크기에 맞게 조절해주세요.
    height: 150, // 이미지 크기에 맞게 조절해주세요.
    resizeMode: "cover",
    marginVertical: 5,
    marginRight: 10,
    borderRadius: 10,
  },
  ownerResponseInput: {
    marginTop: 10,
    marginBottom:5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 5,
    minHeight: 50, // 입력 필드의 최소 높이를 설정합니다.
    textAlignVertical: "top", // 멀티라인 입력을 위해 텍스트를 위쪽으로 정렬합니다.
  },
  filterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  filterButton: {
    width: 150,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionButtonText: {
    fontSize: 18,
    color: "#000", // 글자 색상
    fontWeight: "bold",
    paddingRight: 10,
  },
  selectionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10, // 가장자리와 내용물 사이의 간격을 조정합니다.
  },
  headerDivider: {
    height: 1, // 구분선의 두께
    backgroundColor: "#e0e0e0", // 구분선 색상
    marginVertical: 10, // 위 아래 마진
  },
  selectionButton: {
    borderWidth: 1, // 버튼 테두리 두께
    borderColor: "#ccc", // 버튼 테두리 색상
    paddingVertical: 20, // 상하 패딩
    paddingHorizontal: 70, // 좌우 패딩
    borderRadius: 6, // 모서리 둥글기
    marginBottom: 20, // 다른 요소들과의 여백
    alignItems: "center", // 내용물 가운데 정렬
    marginBottom: 15, // 다음 버튼과의 여백을 늘립니다.
    width: "90%",
    marginLeft: 20,
  },
  modalContentWrapper: {
    width: "100%",
    backgroundColor: "transparent", // 클릭 이벤트를 위해 투명하게 설정
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
  // 달력 뭐 어쩌라고
  calendarmodalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calendarmodalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  okbutton: {
    // 버튼 스타일 (배경 색상, 패딩, 등)
    backgroundColor: "#ff3b30", // 배경 색상 예시
    padding: 10,
    borderRadius: 5,
  },
  oktext: {
    // 텍스트 스타일
    color: "#fff", // 여기에서 원하는 텍스트 색상으로 변경
    textAlign: "center",
  },
  dateRangeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // 요소들 사이의 간격을 균등하게 설정합니다.
    alignItems: "center", // 요소들을 수직 가운데 정렬합니다.
    marginVertical: 10, // 위아래 여백 설정
    paddingHorizontal: 20, // 좌우 여백 설정
  },
  dateRangeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10, // 오른쪽 여백 설정
  },
  dateRangeButtonText: {
    paddingLeft: 10, // 텍스트와 아이콘 사이의 간격 조절
  },
  submitButton: {
    backgroundColor: "#ff3b30", // 원하는 색상 코드로 변경
    borderRadius: 5,
    padding: 10,// 버튼 사이의 간격
  },

  submitButtonText: {
    color: "#ffffff", // 버튼 텍스트 색상
    fontWeight: "bold",
    textAlign: "center",
  },
  reviewText: {
    fontSize: 16,
    marginBottom:5,
  },
  cancelButton: {
    backgroundColor: "#757575", // 취소 버튼 색상
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5, // 버튼 사이의 간격
  },

  cancelButtonText: {
    color: "#ffffff", // 취소 버튼 텍스트 색상
    fontWeight: "bold",
    textAlign: "center",
  },
  ownerContainer: {
    backgroundColor: "#f2f2f2", // 연한 회색 바탕색
    padding: 10, // 적절한 패딩 설정
    borderRadius: 6, // 둥근 모서리 조정
    marginTop: 5, // owner 정보와 리뷰 텍스트 사이의 간격 조정
  },
  ownername: {
    fontWeight: "bold",
  },
  ownerText: {
    fontSize: 16, // 적절한 폰트 크기 설정
    marginTop: 5,
    marginLeft: 5,
  },
  editDeleteButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTextInput: {
    minWidth: "80%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
    textAlignVertical: "top",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // 버튼 사이에 균등 간격을 두고 싶다면 이 속성을 사용
    padding: 10, // 필요에 따라 조절
  },
  filterButtonSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff3b30",
  },
  reviewtitle:{
    fontWeight:'bold',
    fontSize:18,
    marginTop:5,
    marginBottom:10,
  },
  cancelButtonText: {
    color: "#ffffff", // 취소 버튼 텍스트 색상
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButtonText: {
    color: "#ffffff", // 버튼 텍스트 색상
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100, // 또는 적절한 높이 값
  },
  centeredText: {
    fontSize: 16,
    color: 'gray', // 원하는 색상으로 설정
  },
  userImage: {
    width: 40, // 사진의 너비
    height: 40, // 사진의 높이
    borderRadius: 20, // 원형 사진을 만들기 위해 너비와 높이의 반으로 설정
    marginRight: 5, // 닉네임과의 간격
  },
  ownerImage: {
    width: 40, // 사진의 너비
    height: 40, // 사진의 높이
    borderRadius: 20, // 원형 사진을 만들기 위해 너비와 높이의 반으로 설정

  },
});
export default App;
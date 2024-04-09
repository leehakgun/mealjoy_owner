import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // FontAwesome 아이콘을 사용하기 위해 추가
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// 각 이미지 아이템의 예상 높이 설정
const ITEM_HEIGHT = 150; // 이 값은 실제 이미지 높이와 패딩 등을 고려한 것임
const NUM_COLUMNS = 2; // 한 줄에 표시할 아이템의 수

const { width } = Dimensions.get("window");
const containerPadding = 10; // FlatList 컨테이너의 좌우 패딩
const imageMargin = 5; // 이미지 사이의 마진
const imageWidth = (width - containerPadding * 2 - imageMargin * 4) / 2; // 이미지 너비 조정

const App = () => {
  const navigation = useNavigation();
  const [listHeight, setListHeight] = useState(0);
  const [stores, setStores] = useState([]); // 초기 상태를 빈 배열로 설정
  const [images, setImages] = useState([]); // images 상태 추가
  const [storeSeq, setstoreSeq] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // userInfo에서 userId 추출
        const userInfoString = await AsyncStorage.getItem("userInfo");
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

        console.log("시작시작");

        // 서버에 요청 보내기
        const response = await axios.post(
          `http://61.80.80.153:8090/botbuddies/storelist`,
          {
            userId: userInfo.user_id,
          }
        );

        // 응답 데이터 처리
        if (response.data) {
          setStores(response.data);
          // 서버로부터 받은 데이터를 images 배열 형태로 변환하여 저장
          const newImages = response.data.map((store, index) => ({
            id: store.store_seq.toString(), // id를 문자열로 변환
            uri: { uri: store.img_filename }, // uri 객체를 직접 설정
            text: store.store_name, // 매장 이름
          }));
          setImages(newImages); // images 상태 업데이트
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);
  console.log("store", stores);

  const go_store = async (store) => {
    console.log(" 뭔데 ", store.id);
    try {
      const response = await axios.post(
        `http://61.80.80.153:8090/botbuddies/selectStore`,
        {
          store_seq: store.id,
        }
      );
      console.log("무슨 매장", response.data);
      // 서버로부터 받은 데이터를 review_managent 화면으로 전달
      navigation.navigate("management", { reviewData: response.data });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const go_reivew = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

      const response = await axios.post(
        `http://61.80.80.153:8090/botbuddies/review`,
        {
          userId: userInfo.user_id,
        }
      );
      console.log("뭘받지?", response.data);

      // 서버로부터 받은 데이터에서 store_seq만 추출하여 새로운 배열 생성
      const storeSeqs = response.data.map((item) => item.store_seq);
      console.log("storeSeqs:", storeSeqs); // 콘솔에 store_seq만 출력

      // 서버로부터 받은 데이터를 review_managent 화면으로 전달
      navigation.navigate("review_managent", {
        reviewData: response.data,
        userInfo: userInfo,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const go_mypage = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

      const response = await axios.post(
        `http://61.80.80.153:8090/botbuddies/review`,
        {
          userId: userInfo.user_id,
        }
      );

      // 서버로부터 받은 데이터를 review_managent 화면으로 전달
      navigation.navigate("mypage_managent", { reviewData: response.data });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 부분 */}
      <View style={styles.header}>
        <Image source={require("./assets/logo.png")} style={styles.icon} />
        <TouchableOpacity>
          <FontAwesome6
            name="bell"
            size={24}
            color="#ff3b30"
            style={styles.bellIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerDivider} />

      {/* 바디 부분 - 해당 부분에 컨텐츠가 들어가야 합니다 */}
      <View style={styles.body}>
        <Text style={styles.management}>설정</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("store_registraion")}
          >
            <MaterialIcons name="store" size={42} color="#ff3b30" />
            <Text style={styles.text}>매장등록</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("menu_management")}
          >
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={40}
              color="#ff3b30"
            />
            <Text style={styles.text}>메뉴관리</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={go_reivew}>
            <MaterialIcons name="rate-review" size={40} color="#ff3b30" />
            <Text style={styles.text}>리뷰관리</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("owner_inquiry")}
          >
            <MaterialIcons name="quiz" size={40} color="#ff3b30" />
            <Text style={styles.text}>문의하기</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.management}>매장 관리</Text>
        <ScrollView horizontal={false} showsHorizontalScrollIndicator={false}>
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => go_store(item)}
                style={styles.card}
              >
                <Image source={item.uri} style={styles.cardImage} />
                <Text style={styles.cardText}>{item.text}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => item.id.toString()}
            numColumns={1}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={<View style={{ height: 10 }} />}
          />
        </ScrollView>
      </View>

      {/* 탭 바 부분 */}

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Entypo name="home" size={24} color="#ff3b30" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={go_mypage}>
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
  header: {
    flexDirection: "row", // 항목들을 가로로 배열합니다.
    alignItems: "center", // 세로 축 기준으로 중앙 정렬합니다.
    justifyContent: "center", // 항목들을 컨테이너의 시작 부분에 정렬합니다.
    paddingHorizontal: 15, // 좌우 여백을 추가합니다.
    height: 60, // 헤더의 높이를 지정합니다.
  },
  imageListContainer: {
    flex: 1,
    justifyContent: "flex-start",

    alignItems: "center",
  },
  body: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: {
    marginLeft: 5,
    marginRight: -30, // 로고 이미지와 아이콘 사이의 간격을 지정합니다.
  },
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: containerPadding, // 여기를 조정하여 FlatList의 양쪽 패딩을 줄임
    marginBottom: 30,
  },
  management: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "flex-start",
    marginTop: 5, // 텍스트 아래 여백 추가
    marginLeft: 20, // 왼쪽 여백 추가
  },

  imageWrapper: {
    width: "50%", // 화면 너비의 절반만큼
    aspectRatio: 1, // 1:1 비율 유지
    padding: 10, // 각 이미지 주위에 간격 추가
  },
  image: {
    flex: 1,
    borderRadius: 10, // 모서리를 라운드 처리
    width: 150, // 화면 너비의 절반만큼
    height: 150,
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  imageContainer: {
    margin: imageMargin, // 이미지 사이의 마진
    width: imageWidth, // 동적으로 계산된 너비 사용
    aspectRatio: 1, // 유지하고 싶은 경우
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },

  overlayText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // 텍스트를 가운데로 정렬
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingTop: 20, // 상단 패딩
    paddingBottom: 20, // 하단 패딩
    paddingHorizontal: 5, // 좌우 패딩을 줄임
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 25,
    paddingVertical: 10, // 아이콘 주위의 상하 패딩
    paddingHorizontal: 10, // 아이콘 주위의 좌우 패딩
    marginHorizontal: 7, // 아이템 간의 가로 마진 증가
    backgroundColor: "#fff",
    height: 80, // 높이 지정
    width: (width - 80) / 4, // 아이템의 너비 계산을 수정
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    shadowOpacity: 0.25, // 그림자 투명도
    shadowRadius: 2, // 그림자 블러 반경
    elevation: 5, // 안드로이드에서 그림자를 위한 높이
  },
  menuItemText: {
    color: "#ff3b30",
    marginTop: 5, // 텍스트와 아이콘 사이의 간격
    fontSize: 14, // 텍스트 크기 조정
    textAlign: "center", // 텍스트를 가운데 정렬
  },
  text: {
    fontSize: 12,
    color: "black",
  },
  headerDivider: {
    height: 1, // 구분선의 두께
    backgroundColor: "#e0e0e0", // 구분선 색상
    marginVertical: 10, // 위 아래 마진
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#f1f3f5",
    width: Dimensions.get("window").width - 20, // 카드의 너비를 화면의 너비에서 양쪽 여백을 뺀 값으로 설정
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 위치
    shadowOpacity: 0.25, // 그림자 투명도
    shadowRadius: 2, // 그림자 블러 반경
    elevation: 5, // 안드로이드에서 그림자를 위한 높이
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5,
    marginLeft: 1,
    marginBottom: 10,
  },
  cardImage: {
    width: "100%", // 카드 너비에 맞춤
    height: 150, // 원하는 높이 설정
    borderRadius: 8, // 카드와 같은 둥근 모서리 반경 적용
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center", // 가운데 정렬
  },
});

export default App;

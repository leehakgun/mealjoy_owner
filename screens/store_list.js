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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';



const images = [
    { id: '0', uri: require('../assets/bentto.png'), label: '전체' },
    { id: '1', uri: require('../assets/bentto.png'), label: '한식' },
    { id: '2', uri: require('../assets/bentto.png'), label: '카페/디저트' },
    { id: '3', uri: require('../assets/cake.png'), label: '중국집' },
    { id: '4', uri: require('../assets/cake.png'), label: '분식' },
    // 2번째 줄
    { id: '5', uri: require('../assets/bugger.png'), label: '버거' },
    { id: '6', uri: require('../assets/chick.png'), label: '치킨' },
    { id: '7', uri: require('../assets/pizza.png'), label: '피자/양식' },
    { id: '8', uri: require('../assets/pizza.png'), label: '일식/돈까스' },
    // 3번째 줄
    { id: '9', uri: require('../assets/sand.png'), label: '샌드위치' },
    { id: '10', uri: require('../assets/shushi.png'), label: '찜/탕' },
    { id: '11', uri: require('../assets/bentto.png'), label: '족발/보쌈' },
    { id: '12', uri: require('../assets/meet.png'), label: '샐러드' },
    { id: '13', uri: require('../assets/coffe.png'), label: '아시안' },
    { id: '14', uri: require('../assets/coffe.png'), label: '도시락/죽' },
    { id: '15', uri: require('../assets/coffe.png'), label: '회/초밥' },
    { id: '16', uri: require('../assets/coffe.png'), label: '고기/구이' },
    {id:'17'},
    {id:'18'}
  
    // ... 더 많은 이미지를 추가할 수 있습니다.
  ];

// 정렬 팝업 메뉴 컴포넌트
const SortMenu = ({ visible, onClose, onSelect }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {["랭킹순", "거리순", "평점순", "리뷰순"].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.modalButton}
              onPress={() => onSelect(option)}
            >
              <Text style={styles.modalButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.closeButtonContainer}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// HeaderContainer 컴포넌트
const HeaderContainer = () => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => console.log("뒤로 가기")}>
        <Ionicons name="arrow-back" size={24} color="#ff3b30" />
      </TouchableOpacity>
      <Text style={styles.headerText}>현재 위치</Text>
      <TouchableOpacity onPress={() => console.log("알림")}>
        <Ionicons name="notifications" size={24} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );
};



// Divider 컴포넌트
const Divider = () => {
  return <View style={styles.divider} />;
};



const App = ({route}) => {
    const navigation = useNavigation();
  const cafes = route.params;
  const [sortOption, setSortOption] = useState("ranking");
  const [sortedCafes, setSortedCafes] = useState(cafes);
  const [modalVisible, setModalVisible] = useState(false);

  const storeList = async (id) => {
    
    try{
      const response = await axios.post('http://211.227.224.159:8090/botbuddies/storeList', {id : id})

      navigation.navigate('Stores', response.data)

    } catch (error){
      console.error(error);
    }
  }

  const renderImagesRow = (imagesRow) => {
    return (
      <View style={styles.imagesRow}>
        {imagesRow.map((img) => (
          <TouchableOpacity key={img.id} style={styles.imageTouchable} onPress={() => storeList(img.id)}>
            <Image source={img.uri} style={styles.image} />
            <Text style={styles.imageLabel}>{img.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };


  // Header 컴포넌트
const Header = ({ totalCafes, onSortPress, sortOption }) => {
    const optionToText = {
      ranking: "랭킹순",
      distance: "거리순",
      rating: "평점순",
      review: "리뷰순",
    };
  
    return (
      <View>
        <HeaderContainer />
        <ScrollView
          horizontal={true}
          style={styles.horizontalscrollView}
          showsHorizontalScrollIndicator={false}
        >
          <View>
              {renderImagesRow(images.slice(0, 16))}
          </View>
        </ScrollView>
  
        <Divider />
        <View style={styles.subHeaderContainer}>
          <Text style={styles.storeCount}>{totalCafes}개의 매장</Text>
          <TouchableOpacity onPress={onSortPress}>
            <Text style={styles.sortButton}>{optionToText[sortOption]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  

  useEffect(() => {
    // 정렬 로직 (랭킹순으로 정렬)
  }, [sortOption]);

  const handleSortPress = () => {
    setModalVisible(true);
  };

  const handleSelectSortOption = (option) => {
    const textToOption = {
      "랭킹순": "ranking",
      "거리순": "distance",
      "평점순": "rating",
      "리뷰순": "review",
    };

    setSortOption(textToOption[option]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        totalCafes={sortedCafes.length}
        onSortPress={handleSortPress}
        sortOption={sortOption}
      />

      <SortMenu
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelectSortOption}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {sortedCafes.map((cafe) => (
          <View key={cafe.store_seq} style={styles.cafeContainer}>
            <Image source={cafe.image} style={styles.cafeImage} />
            <View style={styles.cafeInfo}>
              <Text style={styles.cafeName}>{cafe.store_name}</Text>
              <Text style={styles.cafeRating}>{cafe.rating}</Text>
              <Text style={styles.cafeReviewCount}>
                {cafe.reviewCount} 리뷰
              </Text>
              <Text style={styles.cafeDescription}>{cafe.store_desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Entypo name="home" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="search" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome5 name="robot" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="heart" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome6 name="user" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 스타일 시트는 이전 제공된 것을 그대로 사용하시면 됩니다.


const styles = StyleSheet.create({
    imagesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%', // 가로로 꽉 차게 설정
        marginBottom: 20, // 여백 설정
      },
      imageTouchable: {
        alignItems: 'center', // 이미지와 라벨을 중앙 정렬
      width: 75,
      },
      image: {
        width: 75, // 이미지의 크기 설정
        height: 75, // 이미지의 크기 설정
        borderRadius: 10, // 이미지의 모서리 둥글게
      },
      imageLabel: {
        textAlign:'center',
        marginTop: 5, // 이미지와 글자 사이의 간격을 조정합니다.
        fontSize: 14, // 글자 크기를 조정합니다.
        color: '#000', // 글자 색상을 조정합니다.
        // 여기에 글자에 대한 추가 스타일을 적용할 수 있습니다.
      },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  storeCount: {
    fontSize: 16,
  },
  sortButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  sortButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  selectedSortButton: {
    backgroundColor: "#ff3b30",
  },
  sortButtonText: {
    color: "#ff3b30",
  },
  selectedSortButtonText: {
    color: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  iconContainer: {
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  Image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
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
  scrollView: {
    flex: 1,
    height: 100,
  },
  cafeContainer: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cafeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cafeInfo: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  cafeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cafeRating: {
    fontSize: 16,
    color: "#ff3b30",
  },
  cafeReviewCount: {
    fontSize: 14,
    color: "#999",
  },
  cafeDescription: {
    fontSize: 12,
    color: "#666",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 모달 배경을 반투명하게 설정
    
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxHeight: "50%",
    alignItems: "center", // 모달 내용을 중앙 정렬
  },
  modalButton: {
    marginVertical: 10,
    alignSelf: "center", // 모든 선택 옵션 버튼을 중앙 정렬
  },
  modalButtonText: {
    fontSize: 18,
  },
  closeButtonContainer: {
    marginTop: 20,
    padding: 10,
    alignSelf: "center", // 닫기 버튼을 중앙 정렬
  },
  closeButtonText: {
    fontSize: 18,
  },
  imgcontainer: {
    width: 50,
    height: 50,
    overflow: "hidden",
  },
  image: {
    width: 50,
    height: 50,
  },
  imgContainer: {
    height: 50,
    overflow: "hidden",
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  horizontalscrollView: {
    maxHeight: 100,
  },
});

export default App;
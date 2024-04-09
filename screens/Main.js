import React from 'react';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,SafeAreaView,
  KeyboardAvoidingView,
  Platform,TouchableWithoutFeedback,Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


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
const dismissKeyboard = () => Keyboard.dismiss();
const App = () => {
    const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // 키보드가 보일 때
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // 키보드가 숨겨질 때
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  const Stack = createStackNavigator();

  return (
    
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView style={styles.content}>
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
      <View style={styles.searchAndIconContainer}>
        <View>
        </View>
      <Image
    source={require('../assets/logo.png')}
    resizeMode="contain"
    style={styles.logo}
  />
<TouchableOpacity style={styles.bellIcon}>
      <Feather name="bell" size={24} color="black" />
    </TouchableOpacity>
  </View>
   
    <View style={styles.searchSection}>
      <TextInput
        style={styles.searchInput}
        placeholder="지역,음식,메뉴검색"
        placeholderTextColor="#888"
      />
      <TouchableOpacity onPress={() => navigation.navigate('SearchResult')}>
      <EvilIcons name="search" size={24} color="black" style={styles.searchIcon}/>
      </TouchableOpacity>
    </View>
    
        <View style={styles.dropdownContainer}>
        <TouchableOpacity
  style={styles.dropdown}
  onPress={() => {
    navigation.navigate('AddressChange', {
      onSelect: (addressData) => {
        console.log(addressData); // 여기에서 주소 데이터를 처리합니다.
        // 예: 상태에 저장하거나 다른 로직을 실행합니다.
      },
    });
  }}
>
          <Text style={styles.dropdownText}>동구 대명동 ▼</Text>
        </TouchableOpacity>
        </View>
      </View>
      
     <View>
      {renderImagesRow(images.slice(0, 4))}
      {renderImagesRow(images.slice(4, 8))}
      {renderImagesRow(images.slice(8, 12))}
      {renderImagesRow(images.slice(12, 16))}
   </View>
      {/* 메인 컨텐츠 영역 */}
     
        {/* 대형 프로모션 카드 */}
        <TouchableOpacity style={styles.promotionCard}>
          <Text style={styles.promotionText}>오늘의 할인</Text>
          <Text style={styles.promotionSubtext}>테이크아웃시 3000원 할인!</Text>
        </TouchableOpacity>    
 </View>
 </ScrollView>
 </KeyboardAvoidingView>
 </TouchableWithoutFeedback>
      {/* 하단 탭 바 */}
      {!keyboardVisible && (
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
        <Entypo name="home" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('SearchResult')}>
          <Icon name="search" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ChatBot')}>
        <FontAwesome5 name="robot" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('FavoriteStore')}>
          <Icon name="heart" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
        <FontAwesome6 name="user" size={24} color="#ff3b30" onPress={() => navigation.navigate('Setting')}/>
        </TouchableOpacity>
      </View>
 )}
   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bellIcon: {
    marginTop:5,
    marginLeft:Platform.OS === 'android' ? -15 : -8,
// 벨 아이콘과 검색창 사이의 간격 조정
    // marginTop으로 벨 아이콘의 위치를 미세 조정할 수 있음
    // 벨 아이콘을 살짝 위로 올림
  },

  searchAndIconContainer: {
    flexDirection: 'row', // 로고와 벨 아이콘을 가로로 배치
    justifyContent: 'space-between',
  },
  searchIcon: {
    padding: 10,
  },
  searchSection: {
    width:300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  dropdownContainer: {
    alignSelf: 'flex-start', // 이 컨테이너 내의 요소를 왼쪽으로 정렬
    width: '30%', // 컨테이너의 너비를 header의 전체 너비로 설정
    paddingBottom:20,
    paddingTop:5
  },
  divider: {
    height: 1, // 선의 두께
    backgroundColor: '#e0e0e0', // 선의 색상
    width: '100%', // 선의 너비를 부모 컨테이너에 맞춥니다.
    marginTop: 1, // 선 위의 여백
    marginBottom: 1, // 선 아래의 여백
  },
  logo: {
    width: 300, // 로고의 너비. 필요에 따라 조절하세요.
    height: 150, // 로고의 높이. 필요에 따라 조절하세요.
    marginBottom: -40, // 로고와 검색 입력란 사이의 마진을 조절합니다.
    marginTop : -60,
    marginLeft: Platform.OS === 'android' ? 5 : 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // 이 배경색은 상단 노치와 하단 제스처 영역의 배경색입니다.
  },
  keyboardAvoid: {
    flex: 1,
  },
  // ... 다른 스타일들 ...
  tabBar: {
    flexDirection: 'row',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff', // 탭 바의 배경색을 설정합니다.
  },
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
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  header: {
    paddingTop:Platform.OS === 'android' ? 50 : 10,
    padding: 16,
    paddingBottom:-10,
    backgroundColor: '#fff', // '#f53b50'이었지만, 배경을 흰색으로 변경했습니다.
    alignItems: 'center', // 추가: 요소들을 수평 중앙에 정렬합니다.
    
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop : -35,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent', // 배경을 투명하게 설정
    color: '#424242',
  },
  dropdown: {
    marginTop: 8,
  },
  dropdownText: {
    marginTop:10,
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
  },
  content: {
    flex: 1,
    // 컨텐츠 영역 스타일링
  },
  promotionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffebed',
    alignItems: 'center',
    // 그림자 효과 등 추가
  },
  promotionText: {
    fontSize: 18,
    fontWeight: 'bold',
    // 텍스트 색상 변경 등
  },
  promotionSubtext: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
    // 텍스트 색상 변경 등
  },
  tabBar: {
    height: 60,
    flexDirection: 'row',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  // 탭 아이템 스타일 추가
});

export default App;

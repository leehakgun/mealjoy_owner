import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,SafeAreaView,
  KeyboardAvoidingView,
  Platform,TouchableWithoutFeedback,Keyboard,FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

    const dismissKeyboard = () => Keyboard.dismiss();


    const SearchResult = () => {
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
    
      const renderImagesRow = (imagesRow) => {
        return (
          <View style={styles.imagesRow}>
            {imagesRow.map((img) => (
              <TouchableOpacity key={img.id} style={styles.imageTouchable}>
                <Image source={img.uri} style={styles.image} />
                <Text style={styles.imageLabel}>{img.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      };
      const restaurants = [
        // 식당 데이터 샘플
        {
          id: '1',
          name: '밀식초',
          category: '한식',
          rating: '9.5',
          reviews: '908 리뷰',
          imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
        },
        {
            id: '2',
            name: '밀식초',
            category: '한식',
            rating: '9.5',
            reviews: '908 리뷰',
            imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
          },
          {
            id: '3',
            name: '밀식초',
            category: '한식',
            rating: '9.5',
            reviews: '908 리뷰',
            imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
          },
          {
            id: '4',
            name: '밀식초',
            category: '한식',
            rating: '9.5',
            reviews: '908 리뷰',
        
            imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
          },
          {
            id: '5',
            name: '밀식초',
            category: '한식',
            rating: '9.5',
            reviews: '908 리뷰',
            imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
          },
          {
            id: '6',
            name: '밀식초',
            category: '한식',
            rating: '9.5',
            reviews: '908 리뷰',
            imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
          },
          {
            id: '7',
            name: '밀식초',
            category: '한식',
            rating: '9.5',
            reviews: '908 리뷰',
            imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
          },
        // ...기타 식당 데이터
      ];
    
      const [favorites, setFavorites] = useState({}); 

  const toggleFavorite = (id) => {
    setFavorites((currentFavorites) => ({
      ...currentFavorites,
      [id]: !currentFavorites[id],
    }));
  };
      const renderRestaurant = ({ item }) => 
      (
        <View style={styles.restaurantItem}>
          <TouchableOpacity>
      <Image source={item.imageUri} style={styles.restaurantImage} />
      </TouchableOpacity>
      <View style={styles.restaurantDetailContainer}>
        <View style={styles.restaurantNameAndIcon}>
        <TouchableOpacity>
          <Text style={styles.restaurantName}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heart} onPress={() => toggleFavorite(item.id)}>
            <FontAwesome name={favorites[item.id] ? "heart" : "heart-o"} size={24} color="red" />
          </TouchableOpacity>
        </View>
          <TouchableOpacity>
        <Text style={styles.restaurantcategory}>{item.category}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color="#FFD700" />
          <Text style={styles.restaurantRating}>{item.rating}</Text>
        </View>
        <Text style={styles.restaurantReviews}>{item.reviews}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
      

      const Stack = createStackNavigator();
    

      return (
        <SafeAreaView style={styles.safeArea}>
          
            <KeyboardAvoidingView
              style={styles.keyboardAvoid}
              behavior={Platform.OS === 'ios' ? 'padding' : null}>



              <FlatList
                data={restaurants}
                renderItem={renderRestaurant}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                  <>
                    <View style={styles.header}>
          <View style={styles.searchAndIconContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
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
                  </>
                }
              />

     </KeyboardAvoidingView>
     
     
          {/* 하단 탭 바 */}
          {!keyboardVisible && (
          <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Main')}>
            <Entypo name="home" size={24} color="#ff3b30" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('SearchResult')}>
              <Icon name="search" size={24} color="#ff3b30" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ChatBot')}>
            <FontAwesome5 name="robot" size={24} color="#ff3b30" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <Icon name="heart" size={24} color="#ff3b30" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
            <FontAwesome6 name="user" size={24} color="#ff3b30" />
            </TouchableOpacity>
          </View>
     )}
       
        </SafeAreaView>
      );
    };

    const styles = StyleSheet.create({
      backButton:{
        marginTop:7
      },
      heart:{
        paddingRight:20
      },
      restaurantDetailContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      restaurantNameAndIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      heartIcon: {
        marginRight: 20, // 아이콘과 이름 사이의 간격을 조
      },
        restaurantcategory:{
            paddingTop:5,
            paddingBottom:5,
        },
        restaurantItem: {
            flexDirection: 'row',
            marginVertical: 8,
            backgroundColor: '#fff',
            borderRadius: 8,
            paddingLeft:15,
            elevation: 3,
          },
          restaurantImage: {
            width: 120,
            height: 120,
            borderRadius: 8,
            marginRight: 10,
            resizeMode:'cover'
          },
          restaurantInfo: {
            justifyContent: 'center',
          },
          restaurantName: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          restaurantRating: {
            marginLeft: 5,
            fontSize: 14,
          },
          restaurantReviews: {
            fontSize: 12,
            color: '#666',
          },
        bellIcon: {
          marginTop:5,
      // 벨 아이콘과 검색창 사이의 간격 조정
          // marginTop으로 벨 아이콘의 위치를 미세 조정할 수 있음
          // 벨 아이콘을 살짝 위로 올림
        },
      
        searchAndIconContainer: {
          flexDirection: 'row', // 로고와 벨 아이콘을 가로로 배치
          justifyContent: 'flex-start',
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

      
        // 탭 아이템 스타일 추가
      });

    export default SearchResult;
import React, { useState } from 'react';
import {
  View, Image, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, KeyboardAvoidingView, Platform,
 FlatList
} from 'react-native';

import { FontAwesome5, Entypo, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import {  Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';



const  initialRestaurants=[
  {
      id: '1',
      name: '밀식초',
      category: '한식',
      rating: '9.5',
      reviews: '908 리뷰',
      imageUri: require('../assets/joy.png'), // 이미지 경로 예시
    },
    {
        id: '2',
        name: '밀식초',
        category: '한식',
        rating: '9.5',
        reviews: '908 리뷰',
        imageUri: require('../assets/coffe.png'), // 이미지 경로 예시
      },
];

const initialFavorites = initialRestaurants.reduce((acc, restaurant) => {
  acc[restaurant.id] = true;
  return acc;
}, {});

const FavoriteStore = () => {
  const navigation = useNavigation();

  

  const [favorites, setFavorites] = useState(initialFavorites);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const toggleFavorite = (id) => {
    setFavorites((currentFavorites) => {
      const updatedFavorites = { ...currentFavorites };
      if (updatedFavorites[id]) {
        delete updatedFavorites[id];
        setRestaurants((currentRestaurants) =>
          currentRestaurants.filter((item) => item.id !== id)
        );
      } else {
        updatedFavorites[id] = true;
      }
      return updatedFavorites;
    });
  };
  

  const renderRestaurant = ({ item }) => (
    <View style={styles.restaurantItem}>
      <TouchableOpacity onPress={() => { /* 이미지 클릭 관련 동작 */ }}>
        <Image source={item.imageUri} style={styles.restaurantImage} />
      </TouchableOpacity>
      <View style={styles.restaurantDetailContainer}>
        <View style={styles.restaurantNameAndIcon}>
          <TouchableOpacity onPress={() => { /* 식당 이름 클릭 관련 동작 */ }}>
            <Text style={styles.restaurantName}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heart} onPress={() => toggleFavorite(item.id)}>
            <FontAwesome name={favorites[item.id] ? "heart" : "heart-o"} size={24} color="red" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { /* 카테고리 클릭 관련 동작 */ }}>
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

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <FlatList
          data={restaurants}
          renderItem={renderRestaurant}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <>
            
            <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backrow}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>관심매장 목록</Text>
          <View style={{ paddingHorizontal: 16 }}></View>
          
        </View>
        <View>
            <Text style={styles.total}>총 {restaurants.length}개</Text></View>
            </>
          }
        />
      </KeyboardAvoidingView>

          

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Main')}>
          <Entypo name="home" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('SearchResult')}>
          <FontAwesome name="search" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ChatBot')}>
          <FontAwesome5 name="robot" size={24} color="#ff3b30" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome name="heart" size={24} color="#ff3b30" onPress={() => navigation.navigate('ReviewWrite')}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome6 name="user" size={24} color="#ff3b30" />
        </TouchableOpacity>
        </View>

    </SafeAreaView>
  );
  
};
const styles = StyleSheet.create({
    total:{
        fontSize:15,
        fontWeight: 'bold',
        marginLeft:22,
        marginTop:20,
        marginBottom:15
    },
    backrow:{
        paddingLeft:15
      },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        flex:1,
        paddingRight:15
      },
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
    
    
      searchAndIconContainer: {
        flexDirection: 'row', // 로고와 벨 아이콘을 가로로 배치
        justifyContent: 'flex-start',
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
        flexDirection: 'row',// 중앙 정렬을 위해 space-between 사용
        justifyContent:'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingBottom:20,
        
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

export default FavoriteStore;

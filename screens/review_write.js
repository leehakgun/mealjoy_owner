import React, { useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView, TouchableOpacity,Alert, Keyboard, TextInput, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Entypo, FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const ReviewWrite = () => {
  const navigation = useNavigation();
  const [rating, setRating] = useState(3);
  const [photoCount, setPhotoCount] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleRemoveImage = (index) => {
    setSelectedImages((currentImages) => currentImages.filter((_, i) => i !== index));
    setPhotoCount(prevCount => prevCount - 1); // 사진 개수 감소
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSetRating = (newRating) => {
    setRating(newRating);
  };

  const handlePhotoUpload = async () => {
    if (selectedImages.length >= 3) {
      Alert.alert( // 이 부분을 Alert.alert로 변경합니다.
      '업로드 제한', // 첫 번째 인자: 타이틀
      '사진은 최대 3개까지 업로드할 수 있습니다.' // 두 번째 인자: 메시지
    );
        return;
      }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert( // 이 부분을 Alert.alert로 변경합니다.
      '엑세스 권한 동의', // 첫 번째 인자: 타이틀
      '카메라 롤에 대한 액세스 권한이 필요합니다!' // 두 번째 인자: 메시지
    );
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      // 이미지를 배열에 추가하고, 사진 개수를 업데이트
      setSelectedImages(currentImages => [...currentImages, result.assets[0].uri]);
      setPhotoCount(prevCount => prevCount + 1);
    }
  };


  const handleSubmitReview = () => {
    console.log('리뷰 작성이 완료되었습니다:', reviewText);
    console.log('선택된 사진:', selectedImages);
    // 여기에서 서버로 데이터를 보내는 로직 등을 추가할 수 있습니다.
    navigation.goBack();
  };
  return (
    
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.safeArea}>
       
          <View style={styles.logoContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Image
              source={require('../assets/logo.png')}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
          <ScrollView contentContainerStyle={styles.container}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "height"} style={styles.reviewSection}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
           
            <View style={styles.rateContainer}>
              <Text style={styles.rateTitle}>가게에 별점을 남겨주세요!</Text>
              <View style={styles.stars}>
                {[...Array(5)].map((_, index) => {
                  return (
                    <TouchableOpacity key={index} onPress={() => handleSetRating(index + 1)}>
                      <FontAwesome
                        name={index < rating ? "star" : "star-o"}
                        size={40}
                        color="#ffd700"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity style={styles.photoUploadContainer} onPress={handlePhotoUpload}>
              <FontAwesome name="camera" size={24} color="#000" />
              <Text>{selectedImages.length}/3</Text>
            </TouchableOpacity>
            <ScrollView horizontal contentContainerStyle={styles.imagePreviewContainer}>
            {selectedImages.map((imageUri, index) => (
  <View key={index} style={styles.imagePreviewContainer}>
    
    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
          <Text style={styles.removeButtonText}>X</Text>
        </TouchableOpacity>
  </View>
))}
 </ScrollView>
        
            <TextInput
              style={styles.input}
              placeholder="리뷰를 남겨주세요!"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
              <Text style={styles.submitButtonText}>리뷰 제출</Text>
            </TouchableOpacity>
             
          </KeyboardAvoidingView>
       </ScrollView>
        
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
            <FontAwesome name="heart" size={24} color="#ff3b30" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <FontAwesome6 name="user" size={24} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
    
  );
};

const styles = StyleSheet.create({
    imagePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center', // 새로 추가: 삭제 버튼을 이미지와 수평으로 정렬하기 위함
        marginRight: 10,
      },
      removeButton: {
        marginTop: -5, // 삭제 버튼의 위치를 이미지의 모서리로 조절
        backgroundColor: 'red', // 배경을 빨간색으로 설정
        borderRadius: 12, // 버튼을 원형으로 만듦
        width: 24, // 버튼의 크기
        height: 24, // 버튼의 크기
        justifyContent: 'center', // 버튼 내부 텍스트를 가운데로 정렬
        alignItems: 'center', // 버튼 내부 텍스트를 가운데로 정렬
        zIndex: 1, // 버튼을 이미지 위에 표시

      },
      removeButtonText: {
        color: 'white', // 버튼 내부 텍스트 색상을 흰색으로 설정
        fontWeight: 'bold', // 글꼴을 굵게 설정
      },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginBottom: 10,
      },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginLeft:6.5
      },
      imagePreview: {
        width: 100, // 원하는 너비로 설정하세요
        height: 100, // 원하는 높이로 설정하세요
        resizeMode: 'cover' // 'cover' 혹은 'contain' 중 원하는 방식을 선택하세요
      },
  reviewSection: {
    paddingTop: 50, 
    paddingHorizontal: 20,
    flex:1
  },
  rateContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  rateTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  photoUploadContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    paddingBottom:80,
  },
  logoContainer: {
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
   
    backgroundColor: 'white',
    zIndex:10,
   

  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: -40,
    marginTop: -60,
  },
  backButton: {
    marginLeft: 15,
    marginTop: 7
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    backgroundColor: '#fff',
    paddingBottom: 44,
    paddingTop: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
});

export default ReviewWrite;

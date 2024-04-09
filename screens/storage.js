import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { decode } from 'base-64'; // base-64 패키지에서 decode 함수를 가져옵니다.

// Firebase 프로젝트 설정
const firebaseConfig = {
  apiKey: "AIzaSyCIJTUXUiGTqfDHqcxRg_Zmqpj7X8RxrUU",
  authDomain: "northern-net-417806.firebaseapp.com",
  projectId: "northern-net-417806",
  storageBucket: "northern-net-417806.appspot.com",
  messagingSenderId: "931311955507",
  appId: "1:931311955507:android:286418ba7a5ba19018fd46"
};


// Firebase 앱 초기화
initializeApp(firebaseConfig);
const storage = getStorage();

export default function ImageUploader() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets[0].uri) {
      try {
        const downloadURL = await uploadImage(result.assets[0].uri);
        console.log('File available at', downloadURL);
        setImage(downloadURL); // 스토리지 URL을 사용하여 이미지를 표시
        console.log(downloadURL);
      } catch (error) {
        console.error("Upload failed", error);
      }
    } else {
      console.log('이미지 선택이 취소되었거나 유효하지 않습니다.');
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${new Date().toISOString()}`);
    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
      {<Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/northern-net-417806.appspot.com/o/images%2F2024-03-20T10%3A18%3A39.615Z?alt=media&token=de16aedf-6af2-497d-b2db-c99518dd0ae8' }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}
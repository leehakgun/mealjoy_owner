import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase 프로젝트 설정
const firebaseConfig = {
  apiKey: "AIzaSyCIJTUXUiGTqfDHqcxRg_Zmqpj7X8RxrUU",
  authDomain: "northern-net-417806.firebaseapp.com",
  projectId: "northern-net-417806",
  storageBucket: "northern-net-417806.appspot.com",
  messagingSenderId: "931311955507",
  appId: "1:931311955507:android:286418ba7a5ba19018fd46"
};

// Firebase 앱 초기화 (이미 초기화된 앱이 없을 경우에만)
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const storage = getStorage();

export default function ImageUploader() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
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
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import admin_main from './admin_main';
import mypage_managent from './mypage_managent';
import store_modification from './store_modification';
import store_registraion from './store_registraion';
import owner_inquiry from './owner_inquiry';
import menu_management from './menu_management';
import review_managent from './review_managent';
import HomeLogin from './HomeLogin';
import management from './management';


const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeLogin">
        <Stack.Screen name="admin_main" component={admin_main} options={{ headerShown: false }}/>
        <Stack.Screen name="mypage_managent" component={mypage_managent} options={{ headerShown: false }}/>
        <Stack.Screen name="store_modification" component={store_modification} options={{ headerShown: false }}/>
        <Stack.Screen name="store_registraion" component={store_registraion} options={{ headerShown: false }}/>
        <Stack.Screen name="owner_inquiry" component={owner_inquiry} options={{ headerShown: false }}/>
        <Stack.Screen name="menu_management" component={menu_management} options={{ headerShown: false }}/>
        <Stack.Screen name="review_managent" component={review_managent} options={{ headerShown: false }}/> 
        <Stack.Screen name="HomeLogin" component={HomeLogin} options={{ headerShown: false }}/> 
        <Stack.Screen name="management" component={management} options={{ headerShown: false }}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}


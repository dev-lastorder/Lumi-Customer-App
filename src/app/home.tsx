// app/home.tsx - MODIFIED WITH DEVELOPMENT MENU
// Adds a floating dev menu to easily test auth flows

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'react-toastify';
import CustomTabsScreen from './CustomTabsScreen';
import { logoutSuper, clearSignupFormData, selectSuperAppUser } from '@/redux';

export default function SuperAppHome() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectSuperAppUser);
  console.log("🚀 ~ SuperAppHome ~ user:", user)
  const [showDevMenu, setShowDevMenu] = useState(false);

  console.log("Super app home screen");

  // Development menu actions
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutSuper());
            dispatch(clearSignupFormData());
            toast.success('Logged out successfully!');
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const handleTestSignup = () => {
    dispatch(logoutSuper());
    dispatch(clearSignupFormData());
    setShowDevMenu(false);
    toast.info('Testing signup flow...');
    router.replace('/(auth)/signupform');
  };

  const handleTestLogin = () => {
    dispatch(logoutSuper());
    dispatch(clearSignupFormData());
    setShowDevMenu(false);
    toast.info('Testing login flow...');
    router.replace('/(auth)/login');
  };

  const handleTestWelcome = () => {
    dispatch(logoutSuper());
    dispatch(clearSignupFormData());
    setShowDevMenu(false);
    toast.info('Going to welcome screen...');
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Main App Content */}
      <CustomTabsScreen />

      {/* Development Menu Button - Only in DEV mode */}
      {/* {__DEV__ && (
        <TouchableOpacity
          onPress={() => setShowDevMenu(true)}
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
            backgroundColor: '#FF6B6B',
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      )} */}

      {/* Development Menu Modal */}
      <Modal
        visible={showDevMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDevMenu(false)}
      >
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setShowDevMenu(false)}
          activeOpacity={1}
        >
          <TouchableOpacity 
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              width: '80%',
              maxWidth: 300,
            }}
            activeOpacity={1}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                🛠️ Dev Menu
              </Text>
              <TouchableOpacity onPress={() => setShowDevMenu(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Current User Info */}
            {user && (
              <View style={{ backgroundColor: '#f0f0f0', padding: 12, borderRadius: 10, marginBottom: 20 }}>
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                  Currently logged in as:
                </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                  {user.name}
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  {user.phone}
                </Text>
              </View>
            )}

            {/* Menu Options */}
            <TouchableOpacity
              onPress={handleTestSignup}
              style={{
                backgroundColor: '#4ECDC4',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="person-add" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Test Signup Flow
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTestLogin}
              style={{
                backgroundColor: '#45B7D1',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="log-in" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Test Login Flow
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTestWelcome}
              style={{
                backgroundColor: '#A8E6CF',
                padding: 15,
                borderRadius: 10,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="home" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Go to Welcome
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: '#FF6B6B',
                padding: 15,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="log-out" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Logout
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
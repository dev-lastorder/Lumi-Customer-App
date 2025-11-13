import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function SearchAnimation() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/GIFs/Searching.gif')}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});

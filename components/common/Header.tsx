import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface HeaderProps {
  title: string;
  canGoBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, canGoBack = false }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {canGoBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Header;

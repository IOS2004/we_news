import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ImageStyle;
}

const Logo: React.FC<LogoProps> = ({ size = 48, style }) => {
  return (
    <Image
      source={require('../../assets/icon.png')}
      style={[
        styles.logo,
        { width: size, height: size },
        style
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // Default styling for the logo
  },
});

export default Logo;

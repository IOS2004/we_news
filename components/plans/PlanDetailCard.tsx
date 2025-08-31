import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Button from '../common/Button';

interface PlanDetailCardProps {
  name: string;
  price: number;
  duration: string;
  features: string[];
  isActive?: boolean;
}

const PlanDetailCard: React.FC<PlanDetailCardProps> = ({ name, price, duration, features, isActive = false }) => {
  return (
    <Card style={isActive ? styles.activeCard : undefined}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>₹{price}</Text>
      <Text style={styles.duration}>{duration}</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Text key={index} style={styles.feature}>• {feature}</Text>
        ))}
      </View>
      <Button title={isActive ? 'Current Plan' : 'Subscribe'} onPress={() => {}} disabled={isActive} />
    </Card>
  );
};

const styles = StyleSheet.create({
  activeCard: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default PlanDetailCard;

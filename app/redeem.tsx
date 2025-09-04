import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  Image,
  Modal,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenWrapper, Header, Button } from '../components/common';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Gradients } from '../constants/theme';

// Mock product data - will be replaced with API data
const mockProducts = [
  {
    id: '1',
    name: 'Amazon Gift Card',
    description: '₹500 Amazon Gift Voucher',
    price: 500,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=150&h=150&fit=crop&crop=center',
    category: 'Gift Cards',
    stock: 25,
    rating: 4.8,
    discount: 0,
  },
  {
    id: '2',
    name: 'Google Play Credit',
    description: '₹300 Google Play Store Credit',
    price: 300,
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=150&h=150&fit=crop&crop=center',
    category: 'Digital Credits',
    stock: 50,
    rating: 4.7,
    discount: 10,
  },
  {
    id: '3',
    name: 'Netflix Subscription',
    description: '1 Month Netflix Premium',
    price: 799,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=150&h=150&fit=crop&crop=center',
    category: 'Subscriptions',
    stock: 15,
    rating: 4.9,
    discount: 5,
  },
  {
    id: '4',
    name: 'Spotify Premium',
    description: '3 Months Spotify Premium',
    price: 399,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=center',
    category: 'Subscriptions',
    stock: 30,
    rating: 4.6,
    discount: 15,
  },
  {
    id: '5',
    name: 'Flipkart Voucher',
    description: '₹1000 Flipkart Shopping Voucher',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop&crop=center',
    category: 'Gift Cards',
    stock: 20,
    rating: 4.5,
    discount: 0,
  },
  {
    id: '6',
    name: 'Swiggy Credits',
    description: '₹250 Swiggy Food Credits',
    price: 250,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop&crop=center',
    category: 'Food & Dining',
    stock: 40,
    rating: 4.4,
    discount: 8,
  },
  {
    id: '7',
    name: 'Wireless Earbuds',
    description: 'Premium TWS Earbuds with ANC',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=150&h=150&fit=crop&crop=center',
    category: 'Electronics',
    stock: 12,
    rating: 4.3,
    discount: 18,
  },
  {
    id: '8',
    name: 'Phone Case',
    description: 'Transparent Shockproof Phone Case',
    price: 499,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=150&h=150&fit=crop&crop=center',
    category: 'Electronics',
    stock: 35,
    rating: 4.2,
    discount: 25,
  },
  {
    id: '9',
    name: 'Zomato Credits',
    description: '₹400 Zomato Food Credits',
    price: 400,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&h=150&fit=crop&crop=center',
    category: 'Food & Dining',
    stock: 60,
    rating: 4.1,
    discount: 5,
  },
  {
    id: '10',
    name: 'Book My Show Voucher',
    description: '₹600 Movie & Event Voucher',
    price: 600,
    image: 'https://images.unsplash.com/photo-1489185078076-a2de1d9f0ba0?w=150&h=150&fit=crop&crop=center',
    category: 'Entertainment',
    stock: 18,
    rating: 4.7,
    discount: 10,
  },
];

const categories = ['All', 'Gift Cards', 'Digital Credits', 'Subscriptions', 'Food & Dining', 'Electronics', 'Entertainment'];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  discount: number;
}

export default function RedeemScreen() {
  const [walletBalance] = useState(2500); // Mock wallet balance
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const handleGoBack = () => {
    router.back();
  };

  const handleRedeemProduct = (product: Product) => {
    if (walletBalance < product.price) {
      Alert.alert(
        'Insufficient Balance',
        `You need ₹${product.price - walletBalance} more to redeem this product.`,
        [{ text: 'OK' }]
      );
      return;
    }
    setSelectedProduct(product);
    setShowConfirmModal(true);
  };

  const confirmRedeem = () => {
    if (selectedProduct) {
      // Here you would make API call to process the redemption
      Alert.alert(
        'Redemption Successful!',
        `${selectedProduct.name} has been redeemed successfully. You will receive details shortly.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowConfirmModal(false);
              setSelectedProduct(null);
              // Navigate back or refresh data
            }
          }
        ]
      );
    }
  };

  const getDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const discountedPrice = getDiscountedPrice(item.price, item.discount);
    const canAfford = walletBalance >= discountedPrice;

    return (
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={Colors.warning} />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.stock}>• {item.stock} left</Text>
          </View>
          
          <View style={styles.priceContainer}>
            {item.discount > 0 && (
              <Text style={styles.originalPrice}>₹{item.price}</Text>
            )}
            <Text style={styles.currentPrice}>₹{discountedPrice}</Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.redeemButton,
              !canAfford && styles.redeemButtonDisabled
            ]}
            onPress={() => handleRedeemProduct({ ...item, price: discountedPrice })}
            disabled={!canAfford}
          >
            <Text style={[
              styles.redeemButtonText,
              !canAfford && styles.redeemButtonTextDisabled
            ]}>
              {canAfford ? 'Redeem Now' : 'Insufficient Balance'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCategory = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.categoryTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper style={styles.screenWrapper}>
      {/* Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Redeem Products</Text>
        
        <TouchableOpacity style={styles.walletInfo}>
          <Ionicons name="wallet-outline" size={20} color={Colors.textOnPrimary} />
          <Text style={styles.walletBalance}>₹{walletBalance.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.overviewSection}>
          <View style={styles.dashboardCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIndicator}>
                <View style={styles.cardDot} />
                <Text style={styles.cardTitle}>Redeem Products</Text>
              </View>
              <Ionicons name="gift" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.cardSubtitle}>
              Use your wallet balance to get amazing products and services
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategory)}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            <Text style={styles.productCount}> ({filteredProducts.length})</Text>
          </Text>
          
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="gift" size={32} color={Colors.primary} />
              <Text style={styles.modalTitle}>Confirm Redemption</Text>
            </View>
            
            {selectedProduct && (
              <View style={styles.modalBody}>
                <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                <Text style={styles.modalProductDescription}>{selectedProduct.description}</Text>
                
                <View style={styles.modalPriceInfo}>
                  <Text style={styles.modalPriceLabel}>Amount to be deducted:</Text>
                  <Text style={styles.modalPrice}>₹{selectedProduct.price}</Text>
                </View>
                
                <View style={styles.modalBalanceInfo}>
                  <Text style={styles.modalBalanceLabel}>Remaining balance:</Text>
                  <Text style={styles.modalBalance}>₹{(walletBalance - selectedProduct.price).toLocaleString()}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmRedeem}
              >
                <Text style={styles.modalConfirmText}>Confirm Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xl,
    ...Shadows.md,
  },
  backButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.whiteTransparent,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  walletBalance: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  overviewSection: {
    paddingHorizontal: 0,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  dashboardCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  // Use a pixel line-height; Typography.lineHeight.relaxed is a ratio (e.g., 1.6),
  // which causes text clipping on Android when used directly.
  lineHeight: Math.round(Typography.fontSize.base * Typography.lineHeight.relaxed),
  },
  categoriesSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  productCount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textSecondary,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  categoryTextActive: {
    color: Colors.textOnDark,
  },
  productsSection: {
    marginBottom: Spacing.xl,
  },
  productsGrid: {
    paddingHorizontal: Spacing.lg,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  productCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    ...Shadows.md,
  },
  productImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  discountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  discountText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnDark,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  productDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rating: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginLeft: 2,
  },
  stock: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  originalPrice: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  redeemButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: Colors.borderLight,
  },
  redeemButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnDark,
  },
  redeemButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  modalBody: {
    marginBottom: Spacing.xl,
  },
  modalProductName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  modalProductDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  modalPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  modalPriceLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  modalPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  modalBalanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  modalBalanceLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
  },
  modalBalance: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalConfirmButton: {
    backgroundColor: Colors.primary,
  },
  modalCancelText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
  },
  modalConfirmText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnDark,
  },
});

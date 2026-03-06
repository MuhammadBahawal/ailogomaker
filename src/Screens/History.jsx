import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PremiumIcon from '../assets/icons/premium.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import BottomTabBar from '../Components/BottomTabBar';
import RoundIconButton from '../Components/RoundIconButton';

const History = ({activeTab = 'history', onTabChange}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar animated barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>History</Text>
              <Text style={styles.subtitle}>
                Your generated logos will appear here.
              </Text>
            </View>

            <View style={styles.heroActions}>
              <RoundIconButton
                backgroundColor="#FFFFFF"
                borderColor="#121212"
                iconColor="#121212">
                <SettingsIcon />
              </RoundIconButton>
              <RoundIconButton
                backgroundColor="#F7BA1B"
                borderColor="#F7BA1B"
                iconColor="#FFFFFF">
                <PremiumIcon />
              </RoundIconButton>
            </View>
          </View>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>No history yet</Text>
            <Text style={styles.placeholderText}>
              Generate a logo from the AI Logo tab and it can be surfaced here next.
            </Text>
          </View>
        </View>

        <BottomTabBar activeTab={activeTab} onTabChange={onTabChange} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F3EE',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F7F3EE',
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    color: '#111111',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
    color: '#7B7670',
  },
  heroActions: {
    flexDirection: 'row',
  },
  placeholderCard: {
    marginTop: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E4D8C8',
    backgroundColor: '#FFF8F0',
    padding: 18,
  },
  placeholderTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#6A6259',
  },
});

export default History;

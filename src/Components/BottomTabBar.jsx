import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import HistoryTabIcon from '../assets/icons/history-tab.svg';
import LogoTabIcon from '../assets/icons/logo-tab.svg';
import ToolsTabIcon from '../assets/icons/tools-tab.svg';
import {bottomTabs} from '../data/logoMaker';

const iconsByTab = {
  logo: LogoTabIcon,
  tools: ToolsTabIcon,
  history: HistoryTabIcon,
};

const BottomTabBar = ({activeTab = 'logo', onTabChange}) => {
  return (
    <View style={styles.tabBar}>
      {bottomTabs.map(tab => {
        const active = activeTab === tab.id;
        const tabColor = active ? '#F29F31' : '#1A1A1A';
        const Icon = iconsByTab[tab.id];

        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange?.(tab.id)}
            style={styles.tabButton}>
            <Icon color={tabColor} height={22} width={22} />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E6DED2',
    backgroundColor: '#F7F3EE',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  tabLabelActive: {
    color: '#F29F31',
    fontWeight: '700',
  },
});

export default BottomTabBar;

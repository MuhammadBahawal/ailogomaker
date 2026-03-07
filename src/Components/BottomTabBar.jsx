import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import HistoryTabIcon from '../assets/icons/history-tab.svg';
import LogoTabIcon from '../assets/icons/logo-tab.svg';
import ToolsTabIcon from '../assets/icons/tools-tab.svg';
import {bottomTabs} from '../data/logoMaker';

const ICON_FRAME_WIDTH = 32;
const ICON_FRAME_HEIGHT = 18;

const iconConfigByTab = {
  logo: {
    Icon: LogoTabIcon,
    width: 30,
    height: 17,
  },
  tools: {
    Icon: ToolsTabIcon,
    width: 17,
    height: 17,
  },
  history: {
    Icon: HistoryTabIcon,
    width: 17,
    height: 17,
  },
};

const ACTIVE_TAB_COLOR = '#F5A035';
const INACTIVE_TAB_COLOR = '#000000';

const BottomTabBar = ({activeTab = 'logo', onTabChange}) => {
  return (
    <View style={styles.tabBar}>
      {bottomTabs.map(tab => {
        const active = activeTab === tab.id;
        const tabColor = active ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR;
        const {Icon, ...iconSize} = iconConfigByTab[tab.id];

        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange?.(tab.id)}
            style={styles.tabButton}>
            <View style={styles.iconFrame}>
              <Icon color={tabColor} {...iconSize} />
            </View>
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
  iconFrame: {
    width: ICON_FRAME_WIDTH,
    height: ICON_FRAME_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
    color: INACTIVE_TAB_COLOR,
  },
  tabLabelActive: {
    color: ACTIVE_TAB_COLOR,
    fontWeight: '700',
  },
});

export default BottomTabBar;

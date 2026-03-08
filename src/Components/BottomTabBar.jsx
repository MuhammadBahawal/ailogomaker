import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import HistoryTabIconActive from '../assets/icons/history-tab.svg';
import HistoryTabIconInactive from '../assets/icons/history-tab-inactive.svg';
import LogoTabIconActive from '../assets/icons/logo-tab.svg';
import LogoTabIconInactive from '../assets/icons/logo-tab-inactive.svg';
import ToolsTabIconActive from '../assets/icons/tools-tab.svg';
import ToolsTabIconInactive from '../assets/icons/tools-tab-inactive.svg';
import {bottomTabs} from '../data/logoMaker';

const ICON_FRAME_SIZE = 22;
const ICON_SIZE = 18;
const LABEL_HEIGHT = 18;
const LABEL_VIEWBOX_WIDTH = 96;
const LABEL_FONT_SIZE = 12;

const iconsByTab = {
  logo: {
    active: LogoTabIconActive,
    inactive: LogoTabIconInactive,
  },
  tools: {
    active: ToolsTabIconActive,
    inactive: ToolsTabIconInactive,
  },
  history: {
    active: HistoryTabIconActive,
    inactive: HistoryTabIconInactive,
  },
};

const INACTIVE_TAB_COLOR = '#000000';
const ACTIVE_GRADIENT_START = '#F49D35';
const ACTIVE_GRADIENT_END = '#E23E2E';

const TabLabel = ({active, label, tabId}) => {
  const gradientId = `bottom-tab-label-${tabId}`;

  return (
    <View style={styles.labelFrame}>
      <Svg height={LABEL_HEIGHT} viewBox={`0 0 ${LABEL_VIEWBOX_WIDTH} ${LABEL_HEIGHT}`} width="100%">
        {active ? (
          <Defs>
            <LinearGradient id={gradientId} x1="0%" x2="100%" y1="50%" y2="50%">
              <Stop offset="0" stopColor={ACTIVE_GRADIENT_START} />
              <Stop offset="1" stopColor={ACTIVE_GRADIENT_END} />
            </LinearGradient>
          </Defs>
        ) : null}
        <SvgText
          fill={active ? `url(#${gradientId})` : INACTIVE_TAB_COLOR}
          fontSize={LABEL_FONT_SIZE}
          fontWeight="600"
          textAnchor="middle"
          x={LABEL_VIEWBOX_WIDTH / 2}
          y="13">
          {label}
        </SvgText>
      </Svg>
    </View>
  );
};

const BottomTabBar = ({activeTab = 'logo', onTabChange}) => {
  return (
    <View style={styles.tabBar}>
      {bottomTabs.map(tab => {
        const active = activeTab === tab.id;
        const IconSet = iconsByTab[tab.id];
        const Icon = active ? IconSet.active : IconSet.inactive;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange?.(tab.id)}
            style={styles.tabButton}>
            <View style={styles.iconFrame}>
              <Icon height={ICON_SIZE} width={ICON_SIZE} />
            </View>
            <TabLabel active={active} label={tab.label} tabId={tab.id} />
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
    width: ICON_FRAME_SIZE,
    height: ICON_FRAME_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelFrame: {
    marginTop: 4,
    width: '100%',
    height: LABEL_HEIGHT,
  },
});

export default BottomTabBar;

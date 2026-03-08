import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PremiumIcon from '../assets/icons/premium.svg';
import SettingsIcon from '../assets/icons/settings.svg';
<<<<<<< HEAD
import BgRemoverToolCell from '../assets/images/bgremoverToolCell.svg';
import EnhanceToolCell from '../assets/images/enhanceToolCell.svg';
import UpscaleToolCell from '../assets/images/upscaleToolCell.svg';
=======
import FlatPreview from '../assets/previews/flat-preview.svg';
import MinimalPreview from '../assets/previews/minimal-preview.svg';
import SoftPreview from '../assets/previews/soft-preview.svg';
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
import BottomTabBar from '../Components/BottomTabBar';
import GradientLayer from '../Components/GradientLayer';
import RoundIconButton from '../Components/RoundIconButton';

const aiTools = [
  {
    id: 'upscale',
    title: 'Upscale',
    colors: ['#F46C6B', '#FF7D65'],
<<<<<<< HEAD
    exploreColor: '#F06B62',
    ShowcaseArt: UpscaleToolCell,
    showcaseHeight: 81,
    showcaseWidth: 134,
=======
    largeFrame: '#F8C0AD',
    smallFrame: '#442B2E',
    MainPreview: FlatPreview,
    SmallPreview: MinimalPreview,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
  {
    id: 'enhance',
    title: 'Enhance Image',
    colors: ['#7F5BFF', '#4D83FF'],
<<<<<<< HEAD
    exploreColor: '#6A62FF',
    ShowcaseArt: EnhanceToolCell,
    showcaseHeight: 81,
    showcaseWidth: 134,
  },
  {
    id: 'bg-remover',
    title: 'BG Remove',
    colors: ['#F8C31A', '#FF9500'],
    exploreColor: '#F3AB00',
    ShowcaseArt: BgRemoverToolCell,
    showcaseHeight: 92,
    showcaseWidth: 121,
  },
];

const ToolShowcase = ({ShowcaseArt, showcaseHeight, showcaseWidth}) => {
  return (
    <View style={styles.showcaseWrap}>
      <ShowcaseArt
        height={showcaseHeight}
        preserveAspectRatio="xMidYMid meet"
        width={showcaseWidth}
      />
=======
    largeFrame: '#E8D8C0',
    smallFrame: '#3858A6',
    MainPreview: SoftPreview,
    SmallPreview: FlatPreview,
  },
  {
    id: 'bg-remover',
    title: 'BG Remover',
    colors: ['#F8C31A', '#FF9500'],
    largeFrame: '#FFE2D9',
    smallFrame: '#D94A5C',
    MainPreview: FlatPreview,
    SmallPreview: SoftPreview,
  },
];

const ToolShowcase = ({MainPreview, SmallPreview, largeFrame, smallFrame}) => {
  return (
    <View style={styles.showcaseWrap}>
      <View
        style={[
          styles.smallTile,
          styles.smallTileLeft,
          {backgroundColor: smallFrame},
        ]}>
        <SmallPreview height={44} width={34} />
      </View>
      <View
        style={[
          styles.smallTile,
          styles.smallTileCenter,
          styles.smallTileCenterSurface,
        ]}>
        <MainPreview height={42} width={30} />
      </View>
      <View style={[styles.largeTile, {backgroundColor: largeFrame}]}>
        <MainPreview height={68} width={52} />
      </View>
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    </View>
  );
};

const ToolCard = ({onPress, tool}) => {
  return (
    <Pressable onPress={() => onPress?.(tool.id)} style={styles.cardShell}>
      <View style={styles.cardSurface}>
        <GradientLayer
          borderRadius={12}
          colors={tool.colors}
          gradientId={`tool-card-${tool.id}`}
        />
        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>{tool.title}</Text>
          <Text style={styles.cardSubtitle}>
            Stunning Design Templates for{'\n'}Cricut Machine
          </Text>
          <Pressable onPress={() => onPress?.(tool.id)} style={styles.exploreButton}>
<<<<<<< HEAD
            <Text style={[styles.exploreLabel, {color: tool.exploreColor}]}>Explore</Text>
            <Text style={[styles.exploreArrow, {color: tool.exploreColor}]}>{'>'}</Text>
          </Pressable>
        </View>
        <ToolShowcase
          ShowcaseArt={tool.ShowcaseArt}
          showcaseHeight={tool.showcaseHeight}
          showcaseWidth={tool.showcaseWidth}
=======
            <Text style={styles.exploreLabel}>Explore</Text>
            <Text style={styles.exploreArrow}>{'>'}</Text>
          </Pressable>
        </View>
        <ToolShowcase
          MainPreview={tool.MainPreview}
          SmallPreview={tool.SmallPreview}
          largeFrame={tool.largeFrame}
          smallFrame={tool.smallFrame}
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
        />
      </View>
    </Pressable>
  );
};

const AiTools = ({activeTab = 'tools', onOpenTool, onTabChange}) => {
  const handleToolPress = toolId => {
    if (
      toolId === 'upscale' ||
      toolId === 'enhance' ||
      toolId === 'bg-remover'
    ) {
      onOpenTool?.(toolId);
      return;
    }

    Alert.alert('Coming soon', `${toolId} tool screen abhi next step me wire hogi.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar animated barStyle="dark-content" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>AI Tools</Text>
              <Text style={styles.subtitle}>
                Stunning Design Templates for{'\n'}Cricut Machine
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

          <View style={styles.cardsColumn}>
            {aiTools.map(tool => {
              return (
                <ToolCard key={tool.id} onPress={handleToolPress} tool={tool} />
              );
            })}
          </View>
        </ScrollView>

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
  scrollContent: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '800',
    color: '#131313',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 15,
    color: '#8B847A',
  },
  heroActions: {
    flexDirection: 'row',
    marginTop: 2,
  },
  cardsColumn: {
    marginTop: 12,
  },
  cardShell: {
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#E7A93D',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  cardSurface: {
    minHeight: 118,
    borderRadius: 12,
    overflow: 'hidden',
<<<<<<< HEAD
    paddingLeft: 10,
    paddingRight: 8,
=======
    paddingHorizontal: 10,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCopy: {
    flex: 1,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    marginTop: 3,
    fontSize: 10.5,
    lineHeight: 12,
    color: 'rgba(255,255,255,0.92)',
  },
  exploreButton: {
    marginTop: 10,
    minWidth: 66,
    height: 20,
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreLabel: {
    fontSize: 9.5,
    lineHeight: 11,
    fontWeight: '700',
<<<<<<< HEAD
=======
    color: '#F06B62',
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
  exploreArrow: {
    marginLeft: 3,
    fontSize: 10,
    lineHeight: 11,
<<<<<<< HEAD
    fontWeight: '700',
  },
  showcaseWrap: {
    width: 136,
    height: 96,
    marginLeft: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
=======
    color: '#F06B62',
    fontWeight: '700',
  },
  showcaseWrap: {
    width: 88,
    height: 94,
    position: 'relative',
    marginLeft: 8,
  },
  largeTile: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 44,
    height: 94,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallTile: {
    position: 'absolute',
    width: 26,
    height: 40,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallTileLeft: {
    left: 10,
    bottom: 0,
    transform: [{rotate: '-18deg'}],
  },
  smallTileCenter: {
    left: 30,
    bottom: 2,
  },
  smallTileCenterSurface: {
    backgroundColor: '#FFFFFF',
  },
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
});

export default AiTools;

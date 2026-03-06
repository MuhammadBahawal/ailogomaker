import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PremiumIcon from '../assets/icons/premium.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import BottomTabBar from '../Components/BottomTabBar';
import GradientLayer from '../Components/GradientLayer';
import RoundIconButton from '../Components/RoundIconButton';
import {
  colorPalettes,
  defaultHomeState,
  industries,
  logoTypes,
  styleOptions,
} from '../data/logoMaker';

const SectionHeading = ({children}) => {
  return <Text style={styles.sectionHeading}>{children}</Text>;
};

const Home = ({
  activeTab = 'logo',
  initialState = defaultHomeState,
  onGenerate,
  onTabChange,
}) => {
  const {width} = useWindowDimensions();
  const [logoType, setLogoType] = useState(
    initialState.logoType ?? defaultHomeState.logoType,
  );
  const [selectedIndustry, setSelectedIndustry] = useState(
    initialState.selectedIndustry ?? defaultHomeState.selectedIndustry,
  );
  const [selectedStyle, setSelectedStyle] = useState(
    initialState.selectedStyle ?? defaultHomeState.selectedStyle,
  );
  const [selectedPalette, setSelectedPalette] = useState(
    initialState.selectedPalette ?? defaultHomeState.selectedPalette,
  );
  const [logoText, setLogoText] = useState(
    initialState.logoText ?? defaultHomeState.logoText,
  );
  const [prompt, setPrompt] = useState(
    initialState.prompt ?? defaultHomeState.prompt,
  );
  const [focusedField, setFocusedField] = useState(null);

  const cardWidth = Math.max(84, Math.min(92, (width - 70) / 4));

  const handleGenerate = () => {
    onGenerate?.({
      logoType,
      logoText,
      selectedIndustry,
      selectedStyle,
      selectedPalette,
      selectedTab: activeTab,
      prompt,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar animated barStyle="dark-content" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.title}>AI Logo Maker</Text>
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

          <View style={styles.segmentedControl}>
            {logoTypes.map(type => {
              const active = logoType === type.id;

              return (
                <Pressable
                  key={type.id}
                  onPress={() => setLogoType(type.id)}
                  style={styles.segmentOption}>
                  {active ? (
                    <GradientLayer
                      borderRadius={20}
                      colors={['#F3A83D', '#E88F2B']}
                      gradientId={`home-segment-${type.id}`}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.segmentLabel,
                      active && styles.segmentLabelActive,
                    ]}>
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View
            style={[
              styles.inputShell,
              focusedField === 'prompt' && styles.inputShellFocused,
            ]}>
            <View style={styles.inputInner}>
              <Text style={styles.inputLabel}>Prompt</Text>
              <TextInput
                multiline
                numberOfLines={4}
                onBlur={() => setFocusedField(null)}
                onChangeText={setPrompt}
                onFocus={() => setFocusedField('prompt')}
                placeholder="Describe your logo idea, mood, icon, and style"
                placeholderTextColor="#A59F98"
                style={styles.promptInput}
                textAlignVertical="top"
                value={prompt}
              />
            </View>
          </View>

          {logoType === 'text' ? (
            <View
              style={[
                styles.inputShell,
                styles.secondaryInputShell,
                focusedField === 'logoText' && styles.inputShellFocused,
              ]}>
              <View style={styles.inputInner}>
                <Text style={styles.inputLabel}>Logo Text</Text>
                <TextInput
                  autoCapitalize="words"
                  maxLength={24}
                  onBlur={() => setFocusedField(null)}
                  onChangeText={setLogoText}
                  onFocus={() => setFocusedField('logoText')}
                  placeholder="Enter the text to show on the logo"
                  placeholderTextColor="#A59F98"
                  style={styles.logoTextInput}
                  value={logoText}
                />
              </View>
            </View>
          ) : null}

          <SectionHeading>Select Industry</SectionHeading>
          <ScrollView
            horizontal
            contentContainerStyle={styles.horizontalListContent}
            showsHorizontalScrollIndicator={false}>
            {industries.map(industry => {
              const active = selectedIndustry === industry;

              return (
                <Pressable
                  key={industry}
                  onPress={() => setSelectedIndustry(industry)}
                  style={[
                    styles.chip,
                    active ? styles.chipActive : styles.chipInactive,
                  ]}>
                  <Text
                    style={[
                      styles.chipLabel,
                      active ? styles.chipLabelActive : styles.chipLabelInactive,
                    ]}>
                    {industry}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionHeading>Select Style</SectionHeading>
          <ScrollView
            horizontal
            contentContainerStyle={styles.styleScrollContent}
            showsHorizontalScrollIndicator={false}>
            {styleOptions.map(option => {
              const active = selectedStyle === option.id;
              const Preview = option.Preview;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => setSelectedStyle(option.id)}
                  style={[styles.styleCard, {width: cardWidth}]}>
                  <View
                    style={[
                      styles.previewFrame,
                      active && styles.previewFrameActive,
                    ]}>
                    <Preview width={cardWidth - 14} height={66} />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.styleLabel,
                      active && styles.styleLabelActive,
                    ]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionHeading>Select Color</SectionHeading>
          <View style={styles.paletteRow}>
            {colorPalettes.map((palette, paletteIndex) => {
              const active = selectedPalette === paletteIndex;

              return (
                <Pressable
                  key={palette.join('-')}
                  onPress={() => setSelectedPalette(paletteIndex)}
                  style={[
                    styles.paletteButton,
                    active && styles.paletteButtonActive,
                  ]}>
                  {palette.map(color => {
                    return (
                      <View
                        key={color}
                        style={[styles.paletteTone, {backgroundColor: color}]}
                      />
                    );
                  })}
                </Pressable>
              );
            })}
          </View>

          <Pressable onPress={handleGenerate} style={styles.ctaButton}>
            <GradientLayer
              borderRadius={28}
              colors={['#F2A53B', '#E94A34']}
              gradientId="home-generate"
            />
            <Text style={styles.ctaLabel}>GENERATE NOW</Text>
          </Pressable>
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
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 26,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroCopy: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 31,
    lineHeight: 35,
    fontFamily: 'SongMyung-Regular',
    color: '#141414',
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    color: '#7B7670',
    fontWeight: '400',
  },
  heroActions: {
    flexDirection: 'row',
  },
  segmentedControl: {
    marginTop: 20,
    flexDirection: 'row',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#F0A53C',
    backgroundColor: '#F9F4EC',
    padding: 2,
  },
  segmentOption: {
    flex: 1,
    height: 34,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    zIndex: 1,
  },
  segmentLabelActive: {
    color: '#121212',
  },
  promptInput: {
    minHeight: 92,
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
    paddingTop: 6,
    paddingBottom: 4,
  },
  logoTextInput: {
    minHeight: 46,
    fontSize: 15,
    lineHeight: 20,
    color: '#1A1A1A',
    paddingTop: 8,
    paddingBottom: 4,
  },
  inputShell: {
    marginTop: 12,
    borderRadius: 16,
    padding: 1.5,
    backgroundColor: '#F2B15A',
    shadowColor: '#EFA03B',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },
  secondaryInputShell: {
    marginTop: 10,
    backgroundColor: '#E58E44',
  },
  inputShellFocused: {
    backgroundColor: '#E8583C',
    shadowOpacity: 0.28,
  },
  inputInner: {
    borderRadius: 14,
    backgroundColor: '#FBFAF8',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputLabel: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
    color: '#A16A2A',
    letterSpacing: 0.3,
  },
  sectionHeading: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '700',
    color: '#111111',
  },
  horizontalListContent: {
    paddingRight: 16,
  },
  chip: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipActive: {
    borderColor: '#F0A23B',
    backgroundColor: '#F0A23B',
  },
  chipInactive: {
    borderColor: '#D7CFC4',
    backgroundColor: '#FFFFFF',
  },
  chipLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
  },
  chipLabelActive: {
    color: '#121212',
  },
  chipLabelInactive: {
    color: '#2C2C2C',
  },
  styleScrollContent: {
    paddingRight: 14,
  },
  styleCard: {
    alignItems: 'center',
    marginRight: 12,
  },
  previewFrame: {
    width: '100%',
    height: 70,
    borderRadius: 7,
    backgroundColor: '#E9E0D8',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 6,
  },
  previewFrameActive: {
    borderColor: '#F0A23B',
  },
  styleLabel: {
    width: '100%',
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  styleLabelActive: {
    color: '#D86E12',
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paletteButton: {
    width: 60,
    height: 28,
    borderRadius: 7,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
  },
  paletteButtonActive: {
    borderColor: '#F7BA1B',
    borderWidth: 2,
  },
  paletteTone: {
    flex: 1,
  },
  ctaButton: {
    marginTop: 42,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
    zIndex: 1,
  },
});

export default Home;

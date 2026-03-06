import React, {useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import CopyIcon from '../assets/icons/copy.svg';
import EditIcon from '../assets/icons/edit.svg';
import PremiumIcon from '../assets/icons/premium.svg';
import RefreshIcon from '../assets/icons/refresh.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import GeneratedArtwork from '../Components/GeneratedArtwork';
import GradientLayer from '../Components/GradientLayer';
import RoundIconButton from '../Components/RoundIconButton';

const ActionPill = ({children, icon: Icon, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.actionPill}>
      <Icon color="#FFFFFF" width={14} height={14} />
      <Text style={styles.actionPillLabel}>{children}</Text>
    </Pressable>
  );
};

const Result = ({generation, onBack, onRegenerate}) => {
  const {width} = useWindowDimensions();
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptDraft, setPromptDraft] = useState(generation?.prompt ?? '');

  useEffect(() => {
    setPromptDraft(generation?.prompt ?? '');
  }, [generation?.prompt]);

  if (!generation) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar animated barStyle="dark-content" />
        <View style={styles.screen}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No result available</Text>
            <Text style={styles.emptyStateText}>
              Go back to AI Logo and generate a logo first.
            </Text>
            <Pressable onPress={onBack} style={styles.emptyStateButton}>
              <Text style={styles.emptyStateButtonLabel}>Back to Home</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const artworkWidth = Math.min(width - 54, 250);

  const handleRegenerateAction = () => {
    onRegenerate?.(isEditingPrompt ? {prompt: promptDraft} : undefined);
    setIsEditingPrompt(false);
  };

  const handleShare = async () => {
    await Share.share({
      message: `${generation.logoText || generation.styleLabel}\n\n${generation.prompt}`,
    });
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Export/download integration abhi connect nahi hui.');
  };

  const handleEditPrompt = () => {
    if (isEditingPrompt) {
      setIsEditingPrompt(false);
      return;
    }

    setPromptDraft(generation.prompt);
    setIsEditingPrompt(true);
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
              <View style={styles.resultTitleRow}>
                <Pressable onPress={onBack} style={styles.backButton}>
                  <ArrowLeftIcon color="#181818" width={18} height={18} />
                </Pressable>
                <Text style={styles.resultTitle}>Result</Text>
              </View>
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

          <View style={styles.previewShell}>
            <GeneratedArtwork
              customWordmark={generation.logoText}
              logoType={generation.logoType}
              paletteColors={generation.paletteColors}
              styleId={generation.selectedStyle}
              variationIndex={generation.variationIndex}
              width={artworkWidth}
              height={artworkWidth}
            />
          </View>

          <View style={styles.actionsRow}>
            <ActionPill icon={RefreshIcon} onPress={handleRegenerateAction}>
              Re-generate
            </ActionPill>
            <ActionPill icon={EditIcon} onPress={handleEditPrompt}>
              Edit Prompt
            </ActionPill>
          </View>

          {isEditingPrompt ? (
            <>
              <View style={styles.promptCard}>
                <TextInput
                  multiline
                  onChangeText={setPromptDraft}
                  placeholder="Edit your prompt"
                  placeholderTextColor="#A59F98"
                  style={styles.promptEditorInput}
                  textAlignVertical="top"
                  value={promptDraft}
                />
                <View style={styles.copyHint}>
                  <CopyIcon color="#B8B1A7" width={13} height={13} />
                  <Text style={styles.copyLabel}>Copy</Text>
                </View>
              </View>

              <Pressable onPress={handleRegenerateAction} style={styles.primaryButton}>
                <GradientLayer
                  borderRadius={30}
                  colors={['#F2A53B', '#D93D9E']}
                  gradientId="result-regenerate"
                />
                <Text style={styles.primaryLabel}>Re-Generate</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.resultActionsStack}>
              <Pressable onPress={handleDownload} style={styles.primaryButton}>
                <GradientLayer
                  borderRadius={30}
                  colors={['#F2A53B', '#D93D9E']}
                  gradientId="result-download"
                />
                <Text style={styles.primaryLabel}>Download</Text>
              </Pressable>
              <Pressable onPress={handleShare} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonLabel}>Share</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    paddingRight: 10,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  resultTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: '#111111',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: '#7B7670',
  },
  heroActions: {
    flexDirection: 'row',
  },
  previewShell: {
    marginTop: 14,
    minHeight: 264,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#2789E6',
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionPill: {
    minWidth: 86,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: '#6D522F',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  actionPillLabel: {
    marginLeft: 6,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  promptCard: {
    marginTop: 22,
    minHeight: 122,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCCFC0',
    backgroundColor: '#FCFBF9',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 28,
  },
  promptEditorInput: {
    minHeight: 78,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#80796F',
  },
  copyHint: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyLabel: {
    marginLeft: 3,
    fontSize: 11,
    lineHeight: 13,
    color: '#B8B1A7',
  },
  primaryButton: {
    marginTop: 22,
    marginHorizontal: 12,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    zIndex: 1,
  },
  resultActionsStack: {
    marginTop: 48,
  },
  secondaryButton: {
    marginTop: 10,
    marginHorizontal: 12,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#68686D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: '#111111',
  },
  emptyStateText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#6E675D',
    textAlign: 'center',
  },
  emptyStateButton: {
    marginTop: 18,
    height: 44,
    minWidth: 140,
    borderRadius: 22,
    backgroundColor: '#6D522F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  emptyStateButtonLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Result;

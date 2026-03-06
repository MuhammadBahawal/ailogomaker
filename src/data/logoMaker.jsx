import CyberPreview from '../assets/previews/cyber-preview.svg';
import FlatPreview from '../assets/previews/flat-preview.svg';
import MinimalPreview from '../assets/previews/minimal-preview.svg';
import SoftPreview from '../assets/previews/soft-preview.svg';

export const logoTypes = [
  {id: 'graphic', label: 'Graphic Logo'},
  {id: 'text', label: 'Text Logo'},
];

export const industries = ['Business', 'Education', 'Technology', 'Restaurant'];

export const styleOptions = [
  {id: 'minimal', label: 'Minimal', Preview: MinimalPreview},
  {id: 'flat', label: 'Flat Design', Preview: FlatPreview},
  {id: 'soft', label: 'Soft Minimal', Preview: SoftPreview},
  {id: 'cyber', label: 'Cyber Tech', Preview: CyberPreview},
];

export const colorPalettes = [
  ['#C667FF', '#A64EFF', '#7C2AE8', '#34135F'],
  ['#A3B3FF', '#7D93FF', '#4868F2', '#1E3DAF'],
  ['#FFCC8B', '#F7A64F', '#E68126', '#A85014'],
  ['#8EF1A0', '#48DA76', '#1AAB52', '#0D6D32'],
  ['#FF8A8A', '#FF6767', '#F35050', '#D82A2A'],
];

export const bottomTabs = [
  {id: 'logo', label: 'AI Logo'},
  {id: 'tools', label: 'AI Tools'},
  {id: 'history', label: 'History'},
];

export const defaultHomeState = {
  logoType: 'graphic',
  logoText: '',
  selectedIndustry: 'Business',
  selectedStyle: 'flat',
  selectedPalette: 0,
  selectedTab: 'logo',
  prompt: '',
};

const paletteDescriptions = [
  'a vibrant purple gradient palette',
  'clean electric blue shades',
  'warm amber and orange tones',
  'fresh green contrast',
  'bold coral red accents',
];

const logoTypeDescriptions = {
  graphic: 'graphic logo',
  text: 'text-first wordmark logo',
};

export const getStyleOption = styleId => {
  return styleOptions.find(option => option.id === styleId) || styleOptions[0];
};

export const getPaletteColors = paletteIndex => {
  return colorPalettes[paletteIndex] || colorPalettes[0];
};

export const buildPromptText = homeState => {
  const promptText = homeState.prompt.trim();
  const logoText = homeState.logoText?.trim();

  if (promptText) {
    return promptText;
  }

  const style = getStyleOption(homeState.selectedStyle);
  const paletteText =
    paletteDescriptions[homeState.selectedPalette] || paletteDescriptions[0];
  const logoTypeText =
    logoTypeDescriptions[homeState.logoType] || logoTypeDescriptions.graphic;
  const textDirection =
    homeState.logoType === 'text' && logoText
      ? ` using the brand text "${logoText}"`
      : '';

  return `A modern ${logoTypeText}${textDirection} for a ${homeState.selectedIndustry.toLowerCase()} brand in ${style.label.toLowerCase()} style with ${paletteText}, clean composition, balanced spacing, premium branding look, and high-resolution vector detailing.`;
};

export const buildGenerationPayload = homeState => {
  const style = getStyleOption(homeState.selectedStyle);

  return {
    ...homeState,
    logoText: homeState.logoText?.trim() ?? '',
    prompt: buildPromptText(homeState),
    styleLabel: style.label,
    paletteColors: getPaletteColors(homeState.selectedPalette),
    variationIndex: 0,
  };
};

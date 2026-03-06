import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const DEFAULT_PALETTE = ['#A3B3FF', '#7D93FF', '#4868F2', '#1E3DAF'];

const rotatePalette = (palette, variationIndex) => {
  if (!palette.length) {
    return DEFAULT_PALETTE;
  }

  return palette.map((_, index) => {
    return palette[(index + variationIndex) % palette.length];
  });
};

const wordmarks = {
  cyber: ['THE HACKER', 'CYBER VAULT', 'NIGHT BYTE'],
  flat: ['THE TOUCAN', 'BRIGHT BIRD', 'FLAT FORGE'],
  soft: ['OLIVE MUSE', 'SOFT BLOOM', 'LEAF WHISPER'],
  minimal: ['MONO MARK', 'LINE FORM', 'NOVA GRID'],
};

const taglines = {
  cyber: ['YOUR TAGLINE HERE', 'DIGITAL DEFENSE STUDIO', 'SMART CODE BRAND'],
  flat: ['CREATIVE BRAND STUDIO', 'COLOR FIRST IDENTITY', 'MODERN ICON HOUSE'],
  soft: ['NATURAL BRAND STORY', 'ELEGANT ORGANIC IDENTITY', 'CALM VISUAL STUDIO'],
  minimal: ['STRUCTURED VISUAL IDENTITY', 'CLEAN SYSTEM BRAND', 'PRECISE MARK DESIGN'],
};

const CyberArtwork = ({colors, variationIndex, logoType}) => {
  const hoodTop = variationIndex % 2 === 0 ? colors[0] : colors[1];
  const hoodShadow = colors[3];
  const laptopColor = variationIndex % 2 === 0 ? '#1A2B75' : '#203B99';

  return (
    <>
      <Defs>
        <LinearGradient id="cyberOrb" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors[0]} />
          <Stop offset="100%" stopColor={colors[2]} />
        </LinearGradient>
        <LinearGradient id="hoodFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={hoodTop} />
          <Stop offset="100%" stopColor={hoodShadow} />
        </LinearGradient>
      </Defs>

      <Ellipse
        cx="140"
        cy={logoType === 'graphic' ? '92' : '86'}
        rx={logoType === 'graphic' ? '76' : '62'}
        ry={logoType === 'graphic' ? '58' : '48'}
        fill="url(#cyberOrb)"
        opacity="0.95"
      />
      <Path
        d="M110 148C104 115 109 78 140 60C171 78 176 115 170 148H110Z"
        fill="url(#hoodFill)"
      />
      <Path
        d="M96 154C103 132 118 118 140 118C162 118 177 132 184 154C171 164 156 169 140 169C124 169 109 164 96 154Z"
        fill={colors[3]}
        opacity="0.9"
      />
      <Ellipse cx="140" cy="105" rx="27" ry="31" fill="#FDB89F" />
      <Path
        d="M114 93C118 77 128 67 140 65C152 67 162 77 166 93C160 86 151 82 140 82C129 82 120 86 114 93Z"
        fill={colors[3]}
      />
      <Rect x="118" y="95" width="21" height="16" rx="3" fill="#161616" />
      <Rect x="141" y="95" width="21" height="16" rx="3" fill="#161616" />
      <Rect
        x="119.5"
        y="96.5"
        width="18"
        height="12.5"
        rx="2"
        fill={colors[0]}
        opacity="0.9"
      />
      <Rect
        x="142.5"
        y="96.5"
        width="18"
        height="12.5"
        rx="2"
        fill={colors[1]}
        opacity="0.9"
      />
      <Rect x="138" y="101" width="4" height="2.2" rx="1.1" fill="#161616" />
      <Path
        d="M108 142H172L165 179H115L108 142Z"
        fill={laptopColor}
      />
      <Path
        d="M118 152H162"
        stroke="#90A9FF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path
        d="M123 159H157"
        stroke="#6E89FF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path
        d="M140 164L143.6 170.8L151 171.4L145.2 176L147 183L140 179.3L133 183L134.8 176L129 171.4L136.4 170.8L140 164Z"
        fill={colors[0]}
      />
    </>
  );
};

const FlatArtwork = ({colors, variationIndex, logoType}) => {
  const sunColor = variationIndex % 2 === 0 ? colors[1] : colors[0];

  return (
    <>
      <Circle
        cx="140"
        cy={logoType === 'graphic' ? '92' : '84'}
        r={logoType === 'graphic' ? '58' : '48'}
        fill="#FFF3E1"
      />
      <Circle cx="140" cy="86" r="27" fill={sunColor} opacity="0.95" />
      <Path
        d="M114 90C125 69 153 63 175 76C162 78 152 84 145 95C136 109 131 124 115 139C112 122 112 103 114 90Z"
        fill={colors[2]}
      />
      <Path
        d="M123 115C134 110 144 110 154 115"
        stroke={colors[3]}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Rect
        x="108"
        y="144"
        width="64"
        height="5"
        rx="2.5"
        fill={colors[3]}
        opacity="0.2"
      />
    </>
  );
};

const SoftArtwork = ({colors, logoType}) => {
  return (
    <>
      <Circle
        cx="140"
        cy={logoType === 'graphic' ? '96' : '88'}
        r={logoType === 'graphic' ? '50' : '42'}
        fill="#F3ECE3"
        stroke={colors[1]}
        strokeWidth="2"
      />
      <Path
        d="M140 62V133"
        stroke={colors[3]}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <Path
        d="M140 77C126 79 118 90 116 106"
        stroke={colors[3]}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <Path
        d="M140 77C154 79 162 90 164 106"
        stroke={colors[3]}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <Path
        d="M140 98C129 100 122 108 119 120"
        stroke={colors[2]}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <Path
        d="M140 98C151 100 158 108 161 120"
        stroke={colors[2]}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </>
  );
};

const MinimalArtwork = ({colors, logoType}) => {
  const topY = logoType === 'graphic' ? 72 : 64;

  return (
    <>
      <Path
        d={`M96 ${topY}L76 ${topY + 34}`}
        stroke={colors[3]}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <Path
        d={`M128 ${topY - 4}L108 ${topY + 30}`}
        stroke={colors[3]}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <Path
        d={`M164 ${topY + 12}L142 ${topY + 49}`}
        stroke={colors[2]}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <Circle cx="171" cy={topY - 8} r="5" fill={colors[3]} />
      <Circle cx="138" cy={topY + 52} r="5" fill={colors[2]} />
      <Rect
        x="92"
        y="145"
        width="96"
        height="4"
        rx="2"
        fill={colors[3]}
        opacity="0.18"
      />
    </>
  );
};

const artworkByStyle = {
  cyber: CyberArtwork,
  flat: FlatArtwork,
  soft: SoftArtwork,
  minimal: MinimalArtwork,
};

const GeneratedArtwork = ({
  logoType,
  customWordmark,
  paletteColors = DEFAULT_PALETTE,
  styleId,
  variationIndex = 0,
  width = 240,
  height = 240,
}) => {
  const colors = rotatePalette(
    paletteColors,
    variationIndex % Math.max(paletteColors.length, 1),
  );
  const Artwork = artworkByStyle[styleId] || FlatArtwork;
  const titles = wordmarks[styleId] || wordmarks.flat;
  const subtitles = taglines[styleId] || taglines.flat;
  const activeTitle = customWordmark?.trim()
    ? customWordmark.trim().toUpperCase().slice(0, 18)
    : titles[variationIndex % titles.length];
  const activeSubtitle = subtitles[variationIndex % subtitles.length];
  const titleY = logoType === 'graphic' ? 210 : 176;
  const subtitleY = logoType === 'graphic' ? 230 : 196;

  return (
    <Svg width={width} height={height} viewBox="0 0 280 260">
      <Rect x="0" y="0" width="280" height="260" rx="28" fill="#F8F8F8" />
      <Artwork
        colors={colors}
        variationIndex={variationIndex}
        logoType={logoType}
      />
      <G>
        <SvgText
          x="140"
          y={titleY}
          textAnchor="middle"
          fontSize={logoType === 'graphic' ? '20' : '24'}
          fontWeight="700"
          fill={colors[3]}>
          {activeTitle}
        </SvgText>
        <SvgText
          x="140"
          y={subtitleY}
          textAnchor="middle"
          fontSize="8.5"
          letterSpacing="1.2"
          fontWeight="600"
          fill="#8F8A85">
          {activeSubtitle}
        </SvgText>
      </G>
    </Svg>
  );
};

export default GeneratedArtwork;

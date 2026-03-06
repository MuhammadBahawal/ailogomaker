import React, {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AiTools from './src/Screens/AiTools';
import BgRemover from './src/Screens/BgRemover';
import EnhanceImage from './src/Screens/EnhanceImage';
import History from './src/Screens/History';
import Home from './src/Screens/Home';
import Result from './src/Screens/Result';
import UpscaleImage from './src/Screens/UpscaleImage';
import {
  buildGenerationPayload,
  defaultHomeState,
} from './src/data/logoMaker';

const App = () => {
  const [route, setRoute] = useState('logo');
  const [homeDraft, setHomeDraft] = useState(defaultHomeState);
  const [generation, setGeneration] = useState(null);

  const handleGenerate = nextHomeState => {
    const nextGeneration = buildGenerationPayload(nextHomeState);

    setHomeDraft(nextHomeState);
    setGeneration(nextGeneration);
    setRoute('result');
  };

  const handleBack = () => {
    setRoute('logo');
  };

  const handleTabChange = nextTab => {
    setRoute(nextTab);
  };

  const handleOpenTool = toolId => {
    if (
      toolId === 'upscale' ||
      toolId === 'enhance' ||
      toolId === 'bg-remover'
    ) {
      setRoute(toolId);
    }
  };

  const handleRegenerate = updates => {
    if (!generation) {
      return;
    }

    const nextHomeState = {
      logoType: updates?.logoType ?? generation.logoType,
      logoText: updates?.logoText ?? generation.logoText,
      selectedIndustry:
        updates?.selectedIndustry ?? generation.selectedIndustry,
      selectedStyle: updates?.selectedStyle ?? generation.selectedStyle,
      selectedPalette: updates?.selectedPalette ?? generation.selectedPalette,
      selectedTab: updates?.selectedTab ?? 'logo',
      prompt: updates?.prompt ?? generation.prompt,
    };

    const nextGeneration = {
      ...buildGenerationPayload(nextHomeState),
      variationIndex: generation.variationIndex + 1,
    };

    setHomeDraft(nextHomeState);
    setGeneration(nextGeneration);
  };

  let content = null;

  if (route === 'result' && generation) {
    content = (
      <Result
        generation={generation}
        onBack={handleBack}
        onRegenerate={handleRegenerate}
      />
    );
  } else if (route === 'result') {
    content = (
      <Home
        activeTab="logo"
        initialState={homeDraft}
        onGenerate={handleGenerate}
        onTabChange={handleTabChange}
      />
    );
  } else if (route === 'upscale') {
    content = <UpscaleImage onBack={() => setRoute('tools')} />;
  } else if (route === 'enhance') {
    content = <EnhanceImage onBack={() => setRoute('tools')} />;
  } else if (route === 'bg-remover') {
    content = <BgRemover onBack={() => setRoute('tools')} />;
  } else if (route === 'tools') {
    content = (
      <AiTools
        activeTab={route}
        onOpenTool={handleOpenTool}
        onTabChange={handleTabChange}
      />
    );
  } else if (route === 'history') {
    content = <History activeTab={route} onTabChange={handleTabChange} />;
  } else {
    content = (
      <Home
        activeTab={route}
        initialState={homeDraft}
        onGenerate={handleGenerate}
        onTabChange={handleTabChange}
      />
    );
  }

  return (
    <SafeAreaProvider>{content}</SafeAreaProvider>
  );
};

export default App;

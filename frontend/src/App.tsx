// frontend/src/App.tsx
import React, { useEffect } from 'react';
import { usePainSessionStore } from './store/usePainSessionStore';
import { Screen1_Welcome } from './screens/Screen1_Welcome';
import { Screen2_Location } from './screens/Screen2_Location';
import { Screen3_Radiation } from './screens/Screen3_Radiation';
import { Screen4_Intensity } from './screens/Screen4_Intensity';
import { Screen5_Nature } from './screens/Screen5_Nature';
import { Screen6_TimeMovement } from './screens/Screen6_TimeMovement';
import { Screen7_VisualReport } from './screens/Screen7_VisualReport';

export const App: React.FC = () => {
  const { currentStep, language } = usePainSessionStore();

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  switch (currentStep) {
    case 'SCREEN_1_WELCOME':
      return <Screen1_Welcome />;
    case 'SCREEN_2_LOCATION':
      return <Screen2_Location />;
    case 'SCREEN_3_RADIATION':
      return <Screen3_Radiation />;
    case 'SCREEN_4_INTENSITY':
      return <Screen4_Intensity />;
    case 'SCREEN_5_NATURE':
      return <Screen5_Nature />;
    case 'SCREEN_6_TIME_MOVEMENT':
      return <Screen6_TimeMovement />;
    case 'SCREEN_7_REPORT':
      return <Screen7_VisualReport />;
    default:
      return <Screen1_Welcome />;
  }
};

export default App;

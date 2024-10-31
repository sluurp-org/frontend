interface StepbyStartGuideOption {
  isOnce?: boolean;
  version?: string;
  onCompleteGuide?: () => void;
}

interface StepbySetUserProperty {
  id: string;
  created_at?: string;
}

declare const StepBy: {
  init: (key: string) => void;
  startGuide: (guideId: string, option?: StepbyStartGuideOption) => void;
  setUserProperties: (properties: StepbySetUserProperty) => void;
};

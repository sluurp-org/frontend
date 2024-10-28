import { createContext, useContext, useState } from "react";
import Joyride, { Step } from "react-joyride";

const ChannelTalkContext = createContext({
  isTourActive: false,
  tourSteps: [] as Step[],
  currentPage: "home",
  startTour: (steps: Step[], page: string) => {},
  stopTour: () => {},
});

export const CahnnelTalkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourSteps, setTourSteps] = useState<Step[]>([]);
  const [currentPage, setCurrentPage] = useState("home"); // 현재 페이지 상태

  const startTour = (steps: Step[], page: string) => {
    setTourSteps(steps as Step[]); // Ensure steps are cast to Step[]
    setCurrentPage(page);
    setIsTourActive(true);
  };

  const stopTour = () => {
    setIsTourActive(false);
  };

  return (
    <ChannelTalkContext.Provider
      value={{
        isTourActive,
        currentPage,
        stopTour,
        tourSteps,
        startTour,
      }}
    >
      {children}
    </ChannelTalkContext.Provider>
  );
};

export const useChannelTalk = () => useContext(ChannelTalkContext);

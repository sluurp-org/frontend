import { createContext, useContext, useState } from "react";
import Joyride, { Step } from "react-joyride";

const TourContext = createContext({
  isTourActive: false,
  tourSteps: [] as Step[],
  currentPage: "home",
  startTour: (steps: Step[], page: string) => {},
  stopTour: () => {},
});

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
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
    <TourContext.Provider
      value={{
        isTourActive,
        currentPage,
        stopTour,
        tourSteps,
        startTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);

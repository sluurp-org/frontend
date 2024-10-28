import React from "react";
import Joyride from "react-joyride";
import { useTour } from "./TourContext";
import { useRouter } from "next/router";

const MyTour = () => {
  const router = useRouter();
  const { isTourActive, tourSteps, stopTour } = useTour();

  return (
    <Joyride
      steps={tourSteps}
      run={isTourActive}
      continuous
      showSkipButton
      showProgress
      callback={(data) => {
        const { action, status, step } = data;
        const { next, prev } = step?.data;

        if (prev === true && action === "prev") {
          router.back();
        }

        if (next && action === "next") {
          router.push(next);
        }

        // 투어 완료 시 투어 종료
        if (status === "finished" || action === "close") {
          stopTour();
        }
      }}
    />
  );
};

export default MyTour;

import { useUserMe } from "@/hooks/queries/useUser";
import React, { createContext, useContext, useEffect } from "react";

const StepbyContext = createContext(null);

export const StepbyProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useUserMe();

  useEffect(() => {
    if (typeof StepBy === "undefined") return;

    StepBy.init(
      "KDI9zuwv2d8Ztz6YgEZJZiIniRjA3NkQ0Vv2H4xooKljmPATKnlvSa3unJnqC6HUM4JTjnjOfHVrLlkh0e0fZg"
    );

    if (data && data.id) {
      StepBy.setUserProperties({
        id: data?.id.toString(),
      });
    }
  }, [data]);

  return (
    <StepbyContext.Provider value={null}>{children}</StepbyContext.Provider>
  );
};

export const useStepby = () => useContext(StepbyContext);

import { NavigationContainerRef, useNavigationContainerRef } from "@react-navigation/native";
import React, { useEffect } from "react";
import { bedoEvents } from "../core/bedoEvents";

interface Props {
  children: React.ReactNode;
}

export function BedoNavigationSyncProvider({ children }: Props) {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubState = navigationRef.addListener("state", () => {
      bedoEvents.emit("nav:stateChange");
    });

    // cleanup
    return () => {
      unsubState();
    };
  }, [navigationRef]);

  return <>{children}</>;
}

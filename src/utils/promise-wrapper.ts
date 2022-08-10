import { SyntheticEvent } from "react";

export function onPromise<T>(promise: (_event: SyntheticEvent) => Promise<T>) {
    return (event: SyntheticEvent) => {
      if (promise) {
        promise(event).catch((error) => {
          console.log("Unexpected error", error);
        });
      }
    };
  }
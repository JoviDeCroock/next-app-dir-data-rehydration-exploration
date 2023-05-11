import React from "react";
import { ServerInsertedHTMLContext } from "next/navigation";

const RehydrationContext = React.createContext<any>(undefined);

function transportDataToJS(data: any) {
    const key = 'urql_transport'
    return `(window[Symbol.for("${key}")] ??= []).push(${JSON.stringify(
      data
    )})`;
  }

export const RehydrationContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const rehydrationContext = React.useRef<any>();
  if (typeof window == "undefined") {
    if (!rehydrationContext.current) {
      rehydrationContext.current = buildContext();
    }
  }

  return (
    <RehydrationContext.Provider value={rehydrationContext.current}>
      {children}
    </RehydrationContext.Provider>
  );
};

export function useRehydrationContext(): any | undefined {
  const rehydrationContext = React.useContext(RehydrationContext);
  const insertHtml = React.useContext(ServerInsertedHTMLContext);

  // help transpilers to omit this code in bundling
  if (typeof window !== "undefined") return;

  if (
    insertHtml &&
    rehydrationContext &&
    !rehydrationContext.currentlyInjected
  ) {
    rehydrationContext.currentlyInjected = true;
    insertHtml(() => <rehydrationContext.RehydrateOnClient />);
  }
  return rehydrationContext;
}

function buildContext(): any {
  const rehydrationContext: any = {
    currentlyInjected: false,
    transportValueData: {},
    transportedValues: {},
    incomingResults: [],
    RehydrateOnClient() {
      rehydrationContext.currentlyInjected = false;
      if (
        !Object.keys(rehydrationContext.transportValueData).length &&
        !Object.keys(rehydrationContext.incomingResults).length
      )
        return <></>;

      const __html = transportDataToJS({
        rehydrate: Object.fromEntries(
          Object.entries(rehydrationContext.transportValueData).filter(
            ([key, value]) =>
              rehydrationContext.transportedValues[key] !== value
          )
        ),
        results: rehydrationContext.incomingResults,
      });

      Object.assign(
        rehydrationContext.transportedValues,
        rehydrationContext.transportValueData
      );

      rehydrationContext.transportValueData = {};
      rehydrationContext.incomingResults = [];

      return (
        <script
          dangerouslySetInnerHTML={{
            __html,
          }}
        />
      );
    },
  };
  return rehydrationContext;
}
import {ReactElement, useState, useEffect, useRef, createElement} from "react";
import {View, AppState} from "react-native";

import {AppEventListenerProps} from "../typings/AppEventListenerProps";

declare const mx: any;

export function AppEventListener(props: AppEventListenerProps<{}>): ReactElement {
    const [appState, setAppState] = useState(AppState.currentState);
    const appStateRef = useRef(AppState.currentState);
    useEffect(() => {
        const onAppStateChange = async (nextAppState: any) => {
            console.error(`App State Change : ${appStateRef.current} → ${nextAppState}`);
            console.error('AppState', appState)
            if (appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
                if (props.onResume && props.onResume.canExecute) {
                    props.onResume.execute();
                }

            } else if (appStateRef.current === "active" && nextAppState.match(/inactive|background/)) {
                if (props.onExit && props.onExit.canExecute) {
                    props.onExit.execute();
                }
            }

            appStateRef.current = nextAppState;
            setAppState(nextAppState);
        };

        AppState.addEventListener("change", onAppStateChange);

        return () => {
            // appStateListener.remove();
        };
    }, []);

    return <View></View>
}

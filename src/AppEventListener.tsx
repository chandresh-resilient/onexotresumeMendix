import {ReactElement, useState, useEffect, useRef, createElement} from "react";
import {View, AppState, ViewStyle, TextStyle} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing timestamps
import {AppEventListenerProps} from "../typings/AppEventListenerProps";
import {Style, mergeNativeStyles} from "@mendix/pluggable-widgets-tools";

declare const mx: any; // Mendix global object
export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

const defaultStyle: CustomStyle = {
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000000,
        height: 700
    },
    label: {
        fontSize: 14,
        color: "red"
    }
}

export function AppEventListener(props: AppEventListenerProps<CustomStyle>): ReactElement {
    // const { onExit, onResume } = props;
    const [appState, setAppState] = useState(AppState.currentState);
    const appStateRef = useRef(AppState.currentState);
    const styles = mergeNativeStyles(defaultStyle, props.style);
    console.log(styles)
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

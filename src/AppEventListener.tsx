import { ReactElement, useState, useEffect, useRef ,createElement} from "react";
import {View, AppState,Dimensions,Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing timestamps
import { AppEventListenerProps } from "../typings/AppEventListenerProps";
declare const mx: any; // Mendix global object


export function AppEventListener(props: AppEventListenerProps<{}>): ReactElement {
    // const { onExit, onResume } = props;
    const [appState, setAppState] = useState(AppState.currentState);
    const appStateRef = useRef(AppState.currentState);
    useEffect(() => {
        const onAppStateChange = async (nextAppState: any) => {
           // console.error(`App State Change : ${appStateRef.current} → ${nextAppState}`);
           // console.error('AppState',appState)

            if (appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
                // App comes to foreground, check if more than 15 sec has passed
                const lastBackgroundTime = await AsyncStorage.getItem("backgroundTimestamp");
                const OldfontScale = await AsyncStorage.getItem("qgoFontScale");
                const currentFontScale = Dimensions.get("window").fontScale;
                const roundedFontScale = Math.round(currentFontScale * 100) / 100;

                if(OldfontScale !== null && OldfontScale !== undefined && OldfontScale !== roundedFontScale.toString() && Platform.OS === "ios"){
                    mx.reload();
                }else{
                    console.error("Last Background Time",lastBackgroundTime)
                    if (lastBackgroundTime) {
                        const timeDiff = (Date.now() - parseInt(lastBackgroundTime, 10)) / 1000; // Convert to seconds
                        console.error(`App was in background for ${timeDiff} seconds`);

                        if (timeDiff > props.delay) {
                            if (props.onResume && props.onResume.canExecute) {
                                props.onResume.execute();
                            }
                        }
                    }
                }
            } else{
                //console.error("App is going to the background!");
                let fontScale = Dimensions.get("window").fontScale;
                let rounded = Math.round(fontScale * 100) / 100;
                await AsyncStorage.setItem("backgroundTimestamp", Date.now().toString()); // Store time
                await AsyncStorage.setItem("qgoFontScale",rounded.toString())
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


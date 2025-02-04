import { ReactElement, useState, useEffect, useRef ,createElement} from "react";
import {View, AppState,ViewStyle,TextStyle} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing timestamps
import { AppEventListenerProps } from "../typings/AppEventListenerProps";
import { Style ,mergeNativeStyles} from "@mendix/pluggable-widgets-tools";
declare const mx: any; // Mendix global object
export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

const defaultStyle: CustomStyle = {
    container: {
        flex: 1,
        width:"100%",
        alignItems: "center",
        justifyContent: "center",
        zIndex:1000000,
        height:700
    },
    label:{
        fontSize: 14,
        color:"red"
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
            console.error('AppState',appState)
            if (appStateRef.current.match(/inactive|background/) && nextAppState === "active") {
                // App comes to foreground, check if more than 15 sec has passed
                const lastBackgroundTime = await AsyncStorage.getItem("backgroundTimestamp");
                console.error("Last Background Time",lastBackgroundTime)
                if (lastBackgroundTime) {
                    const timeDiff = (Date.now() - parseInt(lastBackgroundTime, 10)) / 1000; // Convert to seconds
                    console.error(`App was in background for ${timeDiff} seconds`);
                    console.error(`restart scheduled for anything more than ${props.delay} seconds`);

                    if (timeDiff > props.delay) {
                        console.error(`show message`);
                        mx.ui.openForm("HotelNativeMobile/PG_Idle.page.xml", {
                            location: "popup",
                            callback: function(form) {
                                console.error(`restarting app now`);
                                setTimeout(() => {
                                    mx.reload(); // Reload after 3 seconds
                                }, 1500);
                            }
                        });

                        // // let time = Platform.OS === "ios" ? props.reloadtimeIos : props.reloadtime
                        // setTimeout(() => {
                        //     mx.reload(); // Reload after 3 seconds
                        // }, 1500);
                    }
                }

            } else if (appStateRef.current === "active" && nextAppState.match(/inactive|background/)) {
                console.error("App is going to the background!");
                await AsyncStorage.setItem("backgroundTimestamp", Date.now().toString()); // Store time
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

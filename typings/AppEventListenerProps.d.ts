/**
 * This file was generated from AppEventListener.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue } from "mendix";

export interface AppEventListenerProps<Style> {
    name: string;
    style: Style[];
    delay: number;
    onResume?: ActionValue;
    onExit?: ActionValue;
}

export interface AppEventListenerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    delay: number | null;
    onResume: {} | null;
    onExit: {} | null;
}

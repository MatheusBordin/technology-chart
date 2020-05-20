/**
 * Setting interface.
 */
export interface ISetting {
    quadrants: string[];
    rings: string[];
    data: ISettingData[];
    layout?: ISettingLayout;
}

/**
 * Setting layout interface.
 */
export interface ISettingLayout {
    colors?: string[][];
    quadrantSpacement?: number;
    padding?: number;
    point?: {
        highlightBg?: string;
        bg?: string;
        textColor?: string;
    },
    legend?: {
        textColor?: string;
        textSize?: string;
    }
}

/**
 * Setting data class.
 */
export interface ISettingData {
    quadrant: string;
    ring: string;
    value: string;
    bg?: string;
    highlightBg?: string;
    index?: number;
}
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
    point?: {
        highlightColor?: string;
    }
}

/**
 * Setting data class.
 */
export interface ISettingData {
    quadrant: string;
    ring: string;
    value: string;
    index?: number;
}
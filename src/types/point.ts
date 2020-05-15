import { IPosition } from "./position";

/**
 * Point object attribute type.
 */
export interface IPointAttributes {
    angle: {
        start: number;
        end: number;
    };
    size: {
        ring: number;
    };
    position: {
        fromOrigin: number;
        spacement: IPosition;
    };
}
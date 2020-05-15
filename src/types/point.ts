import { IVector } from "./position";

/**
 * Point object attribute type.
 */
export interface IPointAttributes {
    angle: {
        start: number;
        end: number;
    };
    size: {
        canvas: number;
        ring: number;
    };
    position: {
        fromOrigin: number;
        spacement: IVector;
    };
}
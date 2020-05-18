import { IVector } from "./position";

export type PointColisionValidation = (point: IVector) => boolean;

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
        point: number;
    };
    position: {
        fromOrigin: number;
        spacement: IVector;
    };
    validation: {
        colision: PointColisionValidation;
    };
    layout: {
        highlightColor: string;
    }
}
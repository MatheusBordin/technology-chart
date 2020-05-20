import { IVector } from "./position";

export type PointColisionValidation = (point: IVector) => boolean;

/**
 * Legend object attribute type.
 */
export interface ILegendAttributes {
    layout: {
        textColor: string;
        textSize: string;
    }
}
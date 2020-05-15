import { IVector } from "./position";

/**
 * Quadrant ring object attribute type.
 */
export interface IQuadrantRingAttributes {
    position: IVector;
    index: {
        quadrant: number;
        ring: number;
    },
    size: {
        canvas: number;
        quadrant: number;
        ring: number;
    },
    layout: {
        spacement: number;
        color: string;
    }
}
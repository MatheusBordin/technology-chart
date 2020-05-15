import { IPosition } from "./position";

/**
 * Quadrant ring object attribute type.
 */
export interface IQuadrantRingAttributes {
    position: IPosition;
    index: {
        quadrant: number;
        ring: number;
    },
    size: {
        quadrant: number;
        ring: number;
    },
    layout: {
        spacement: number;
        color: string;
    }
}
import { IVector } from "./position";

/**
 * Quadrant ring object attribute type.
 */
export interface IQuadrantRingAttributes {
    label: {
        quadrant: string;
        ring: string;
    };
    position: IVector;
    index: {
        quadrant: number;
        ring: number;
    },
    size: {
        canvas: number;
        quadrant: number;
        ring: number;
        radius: number;
    },
    layout: {
        spacement: number;
        color: string;
        point: {
            hightlightColor: string;
        }
    }
}
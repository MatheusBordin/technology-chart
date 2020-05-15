import { IVector } from "../types/position";

/**
 * Get displacement signal
 */
export function displacementSignal(angle: number): IVector {
    const rightDown = Math.PI / 2;
    const rightTop = Math.PI * 2;
    const leftDown = Math.PI;
    const leftTop = Math.PI * 3 / 2;

    if (angle < rightDown) {
        return { x: 1, y: 1 };
    } else if (angle < leftDown) {
        return { x: -1, y: 1 };
    } else if (angle < leftTop) {
        return { x: -1, y: -1 };
    } else if (angle < rightTop) {
        return { x: 1, y: -1 };
    }

    return {
        x: 1,
        y: 1,
    };
}
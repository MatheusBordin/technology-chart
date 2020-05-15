
/**
 * Calc first item of radius PG.
 */
export function calcFirstRingRadius(sum: number, length: number, q = 1.3) {
    return (sum * (q - 1)) / (Math.pow(q, length) - 1);
}

/**
 * Calc item of ring radius.
 */
export function calcRingRadius(first, index, q = 1.3) {
    return first * Math.pow(q, index);
}
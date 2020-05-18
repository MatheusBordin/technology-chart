
/**
 * To degree function.
 */
export function toDegree(value: number) {
    return value * 180 / Math.PI;
}

/**
 * From degree function.
 */
export function fromDegree(value: number) {
    return value * Math.PI / 180;
}

/**
 * Calculate arc size.
 */
export function arcSize(startAngle: number, endAngle: number, radius: number) {
    const angle = toDegree(endAngle - startAngle);

    return angle * Math.PI * radius / 180;
}

/**
 * Calculate angle by arc siuze.
 */
export function angleByArc(size: number, radius: number) {
    return fromDegree((size * 180) / (Math.PI * radius));
}
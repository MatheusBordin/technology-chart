const multiplyCurrentTransform = false;

/**
 * Draw text in arc.
 */
export function drawTextAlongArc(context: CanvasRenderingContext2D, text: string, centerX: number, centerY: number, radius: number, startAngle: number, endAngle?: number) {
    const textWidth = context.measureText(text).width;
    let pA: number;
    const pAS = 1 / radius;
    let angle: number;
    let angularWidth: number;
    let widthScale: number;
    const aligned = context.textAlign;
    let dir = 1;

    if (endAngle != null) {
        // if end is supplied then fit text between start and end
        pA = ((endAngle - startAngle) / textWidth) * dir;
        widthScale = (pA / pAS) * dir;
    } else {
        // if no end is supplied correct start and end for alignment

        // if forward is not given then swap top of circle text to read the correct direction
        if(((startAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) > Math.PI){
            dir = -1;
        }

        pA = -pAS * dir ;
        widthScale = -1 * dir;

        switch (aligned) {
            case "center":       // if centered move around half width
                startAngle -= (pA * textWidth )/2;
                endAngle = startAngle + pA * textWidth;
                break;
            case "right":// intentionally falls through to case "end"
            case "end":
                endAngle = startAngle;
                startAngle -= pA * textWidth;
                break;
            case "left":  // intentionally falls through to case "start"
            case "start":
                endAngle = startAngle + pA * textWidth;
        }
    }

    context.textAlign = "center"; // align for rendering
    angle = startAngle; // set the start angle

    for (let i = 0; i < text.length; i += 1) {
        angularWidth = context.measureText(text[i]).width * pA; // get the angular width of the text
        const xDx = Math.cos(angle + angularWidth / 2);           // get the yAxies vector from the center x,y out
        const xDy = Math.sin(angle + angularWidth / 2);

        if(multiplyCurrentTransform){ // transform multiplying current transform
            context.save();
            if (xDy < 0) { // is the text upside down. If it is flip it
                context.transform(-xDy * widthScale, xDx * widthScale, -xDx, -xDy, xDx * radius + centerX, xDy * radius + centerY);
            } else {
                context.transform(-xDy * widthScale, xDx * widthScale, xDx, xDy, xDx * radius + centerX, xDy * radius + centerY);
            }
        }else{
            if (xDy < 0) { // is the text upside down. If it is flip it
                context.setTransform(-xDy * widthScale, xDx * widthScale, -xDx, -xDy, xDx * radius + centerX, xDy * radius + centerY);
            } else {
                context.setTransform(-xDy * widthScale, xDx * widthScale, xDx, xDy, xDx * radius + centerX, xDy * radius + centerY);
            }
        }

        context.fillText(text[i], 0, 0); // render the character

        if(multiplyCurrentTransform){  // restore current transform
            context.restore();
        }

        angle += angularWidth;                     // step to the next angle
    }

    // all done clean up.
    if(!multiplyCurrentTransform){
        context.setTransform(1, 0, 0, 1, 0, 0); // restore the transform
    }

    context.textAlign = aligned;
}
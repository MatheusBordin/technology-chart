import { IVector } from "../types/position";
import { angleByArc } from "../utils/circle";
import { displacementSignal } from "../utils/displacement";
import { drawTextAlongArc } from "../utils/draw";
import { BaseObject } from "./base";

/**
 * Ring legend object.
 */
export class RingLegend extends BaseObject {
    constructor(
        private _label: string,
        private _center: IVector,
        private _radius: number,
        private _ring: number,
        private _startAngle: number,
        private _mode: "linear" | "circle" = "linear",
    ) {
        super();
    }

    public get shouldRender() {
        return this._startAngle < Math.PI;
    }

    public get leftQuarter() {
        return this._startAngle < Math.PI && this._startAngle >= Math.PI / 2;
    }

    /**
     * Draw the legend.
     */
    public draw(context: CanvasRenderingContext2D) {
        if (!this.shouldRender) {
            return;
        }

        if (this._mode === "circle") {
            this._drawCircle(context);
        } else if (this._mode === "linear") {
            this._drawLinear(context);
        }
    }

    /**
     * Draw legend in linear mode.
     */
    private _drawLinear(context: CanvasRenderingContext2D) {
        context.save();
        context.font = "9pt sans-serif";
        context.fillStyle = "rgba(0, 0, 0, 0.8)";
        context.beginPath();

        let x = this._center.x;
        if (this.leftQuarter) {
            x += displacementSignal(this._startAngle).x * this._radius;
        } else {
            x += displacementSignal(this._startAngle).x * this._radius - this._ring;
        }

        const rotAngle = this._startAngle >= Math.PI / 2 ? this._startAngle - Math.PI / 2 : this._startAngle;
        context.moveTo(0, 0);
        context.rotate(rotAngle);

        context.fillText(this._label, x, this._center.y);
        context.closePath();
        context.restore();
    }

    /**
     * Draw legend in arc mode.
     */
    private _drawCircle(context: CanvasRenderingContext2D) {
        const size = 6.9244 * this._label.length;
        const space = angleByArc(5, this._radius);
        const startAngle = this._startAngle + space;
        const endAngle = startAngle + angleByArc(size, this._radius);

        context.fillStyle = "rgba(0, 0, 0, 0.6)";
        drawTextAlongArc(context, this._label, this._center.x + 10, this._center.y, this._radius, startAngle, endAngle);
    }
}
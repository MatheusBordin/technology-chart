import { IPointAttributes } from "../types/point";
import { SettingData } from "../types/setting";
import { displacementSignal } from "../utils/displacement";
import { BaseObject } from "./base";

/**
 * Point object.
 * Represents technology in the chart.
 * Rendered by donut slice (Quadrant ring).
 */
export class Point extends BaseObject {
    private _attrs: IPointAttributes;
    private _data: SettingData;

    constructor(data: SettingData, attributes: IPointAttributes) {
        super();

        this._attrs = attributes;
        this._data = data;
    }

    /**
     * The size of point.
     */
    public get size() {
        return 20;
    }

    /**
     * Get variation by size.
     * Need because the spacement modify the plot.
     */
    public get variation() {
        const spacement = this.size;
        const signal = displacementSignal(this._attrs.angle.start);

        return {
            x: spacement * signal.x,
            y: spacement * signal.y,
        };
    }

    /**
     * Draw a point.
     */
    public draw(context: CanvasRenderingContext2D) {
        const halfCanvasSize = this._attrs.size.canvas / 2;
        const angle = this._attrs.angle.start + Math.random() * (this._attrs.angle.end - this._attrs.angle.start);
        const initPoint = this._attrs.position.fromOrigin + this.size;
        const ringVariation = (this._attrs.size.ring - this.size) * Math.random();
        const distance = initPoint + ringVariation;

        const xVar = this._attrs.position.spacement.x;
        const yVar = this._attrs.position.spacement.y;

        const x = Math.sin((Math.PI/2) - angle) * distance + halfCanvasSize + xVar;
        const y = Math.sin(angle) * distance + halfCanvasSize + yVar;

        // Begin.
        context.beginPath();
        // Draw the circle.
        context.arc(x, y, this.size / 2, 0, Math.PI * 2);
        context.fillStyle = "black";
        context.fill();
        // Draw the label
        context.fillStyle = "white";
        context.font = "12pt sans-serif";
        context.fillText(this._data.index.toString(), x - 4, y + 6);
        // Close
        context.closePath();
    }
}
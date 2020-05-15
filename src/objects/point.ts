import { IPointAttributes } from "../types/point";
import { IVector } from "../types/position";
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
    private _position: IVector;

    constructor(data: SettingData, attributes: IPointAttributes) {
        super();

        this._attrs = attributes;
        this._data = data;

        this._prepare();
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
    public draw(context: CanvasRenderingContext2D, reset = false) {
        if (reset) {
            this._prepare();
        }

        // Begin.
        context.save();
        context.beginPath();
        // Draw the circle.
        context.moveTo(this._position.x, this._position.y);
        context.arc(this._position.x, this._position.y, this.size / 2, 0, Math.PI * 2);
        context.fillStyle = "#222";
        context.fill();
        // Draw the label
        context.fillStyle = "white";
        context.font = "12pt sans-serif";
        context.fillText(this._data.index.toString(), this._position.x - 4, this._position.y + 6);
        // Close
        context.closePath();
        context.restore();
    }

    /**
     * Prepare point position.
     */
    private _prepare() {
        const halfCanvasSize = this._attrs.size.canvas / 2;
        const angle = this._attrs.angle.start + Math.random() * (this._attrs.angle.end - this._attrs.angle.start);
        const initPoint = this._attrs.position.fromOrigin + this.size;
        const ringVariation = (this._attrs.size.ring - this.size) * Math.random();
        const distance = initPoint + ringVariation;

        const xVar = this._attrs.position.spacement.x;
        const yVar = this._attrs.position.spacement.y;

        this._position = {
            x: Math.sin((Math.PI/2) - angle) * distance + halfCanvasSize + xVar,
            y: Math.sin(angle) * distance + halfCanvasSize + yVar,
        };
    }
}
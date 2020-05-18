import { IPointAttributes } from "../types/point";
import { IVector } from "../types/position";
import { ISettingData } from "../types/setting";
import { BaseObject } from "./base";

/**
 * Point object.
 * Represents technology in the chart.
 * Rendered by donut slice (Quadrant ring).
 */
export class Point extends BaseObject {
    private _attrs: IPointAttributes;
    private _data: ISettingData;
    private _position: IVector;

    constructor(data: ISettingData, attributes: IPointAttributes) {
        super();

        this._attrs = attributes;
        this._data = data;

        this._prepare();
    }

    /**
     * Get data.
     */
    public get data() {
        return this._data;
    }

    /**
     * The size of point.
     */
    public get size() {
        return this._attrs.size.point;
    }

    /**
     * Current position.
     */
    public get position() {
        return this._position;
    }

    /**
     * Get index.
     */
    public get index() {
        return this._data.index;
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
        context.arc(this._position.x, this._position.y, this.size, 0, Math.PI * 2);
        context.fillStyle = "#222";
        context.fill();

        // Draw the label
        context.fillStyle = "white";
        context.font = "10pt sans-serif";
        context.fillText(this._data.index.toString().padStart(2, "0"), this._position.x - 7, this._position.y + 5);
        // Close
        context.closePath();
        context.restore();
    }

    /**
     * Prepare point position.
     */
    private _prepare(retryCount = 50) {
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

        const shouldRetry = this._attrs.validation.colision(this._position);
        if (shouldRetry && retryCount > 0) {
            this._prepare(retryCount - 1);
        }
    }
}
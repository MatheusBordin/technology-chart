import { IPointAttributes } from "../types/point";
import { SettingData } from "../types/setting";
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
        return 10;
    }

    /**
     * Draw a point.
     */
    public draw(context: CanvasRenderingContext2D) {
        const angle = this._attrs.angle.start + Math.random() * (this._attrs.angle.end - this._attrs.angle.start);
        const initPoint = this._attrs.position.fromOrigin + this.size;
        const ringVariation = (this._attrs.size.ring - this.size) * Math.random();
        const distance = initPoint + ringVariation;

        const xVar = this._attrs.position.spacement.x - this.size;
        const yVar = this._attrs.position.spacement.y - this.size;

        const x = Math.sin((Math.PI/2) - angle) * distance + 250 + xVar;
        const y = Math.sin(angle) * distance + 250 + yVar;

        if (this._data.index === 3) {
            console.log(x, y, this._attrs.position.spacement);
        }

        // Begin.
        context.beginPath();
        // Draw the circle.
        context.arc(x, y, this.size, 0, Math.PI * 2);
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
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
    private _marked = false;

    constructor(data: ISettingData, attributes: IPointAttributes) {
        super();

        this._attrs = attributes;
        this._data = data;

        this._prepare();
    }

    /**
     * Mark point as highlight.
     */
    public set marked(value: boolean) {
        this._marked = value;
    }

    /**
     * Returns if the point has marked.
     */
    public get marked() {
        return this._marked;
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
     * Get bg of point.
     */
    public get background() {
        if (this.marked) {
            return this._data.highlightBg ?? this._attrs.layout.highlightBg;
        }

        return this._data.bg ?? this._attrs.layout.bg;
    }

    /**
     * Get textColor of point.
     */
    public get textColor() {
        if (this.marked) {
            return this._data.highlightTextColor ?? this._attrs.layout.highlightTextColor;
        }

        return this._data.textColor ?? this._attrs.layout.textColor;
    }

    /**
     * Draw a point.
     */
    public draw(context: CanvasRenderingContext2D, reset = false) {
        if (reset) {
            this._prepare();
        }

        // Draw the bg.
        if (!!this.background.match(/https?:\/{2}/)) {
            const img = new Image();
            img.src = this.background;
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;

                const x = this._position.x - width / 2;
                const y = this._position.y - height / 2;

                context.save();
                context.beginPath();

                context.drawImage(img, x, y);
                this.drawText(context, true);

                context.closePath();
                context.restore();
            };
        } else {
            context.save();
            context.beginPath();

            context.moveTo(this._position.x, this._position.y);
            context.arc(this._position.x, this._position.y, this.size, 0, Math.PI * 2);
            context.fillStyle = this.background;
            context.fill();

            this.drawText(context);

            context.closePath();
            context.restore();
        }
    }

    /**
     * Draw point label.
     */
    public drawText(context: CanvasRenderingContext2D, custom = false) {
        context.save();
        context.beginPath();

        context.fillStyle = this.textColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "10pt sans-serif";
        context.fillText(this._data.index.toString().padStart(2, "0"), this._position.x, custom ? this._position.y + 5 : this._position.y);

        context.closePath();
        context.restore();
    }

    /**
     * Prepare point position.
     */
    private _prepare(retryCount = 50) {
        const halfCanvasSize = this._attrs.position.origin.x;
        const angle = this._attrs.angle.start + Math.random() * (this._attrs.angle.end - this._attrs.angle.start);
        const initPoint = this._attrs.position.fromOrigin + this.size;
        const ringVariation = (this._attrs.size.ring - this.size * 2) * Math.random();
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
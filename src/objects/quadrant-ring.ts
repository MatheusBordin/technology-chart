import { IPosition } from "../types/position";
import { IQuadrantRingAttributes } from "../types/quadrant-ring";
import { SettingData } from "../types/setting";
import { BaseObject } from "./base";
import { Point } from "./point";

/**
 * Quadrant ring object.
 * Represents a donut slice.
 */
export class QuadrantRing extends BaseObject {
    private _attrs: IQuadrantRingAttributes;
    private _data: SettingData[];
    private _points: Point[];

    constructor(data: SettingData[], attributes: IQuadrantRingAttributes) {
        super();

        this._attrs = attributes;
        this._data = data;
        this._points = [];
    }

    /**
     * Return the start angle of current quadrant index.
     */
    public get startAngle() {
        return this._attrs.size.quadrant * this._attrs.index.quadrant;
    }

    /**
     * Return the end angle of current quadrant index.
     */
    public get endAngle() {
        return this.startAngle + this._attrs.size.quadrant;
    }
    /**
     * Return the spacement for each direction: x and y.
     */
    public get spacement(): IPosition {
        const spacement = this._attrs.layout.spacement / 2;
        const rightTop = Math.PI / 2;
        const rightDown = Math.PI * 2;
        const leftTop = Math.PI;
        const leftDown = Math.PI * 3 / 2;

        if (this.startAngle < rightTop) {
            return { x: spacement, y: spacement };
        } else if (this.startAngle < leftTop) {
            return { x: -spacement, y: spacement };
        } else if (this.startAngle < leftDown) {
            return { x: -spacement, y: -spacement };
        } else if (this.startAngle < rightDown) {
            return { x: spacement, y: -spacement };
        }

        return {
            x: 0,
            y: 0,
        };
    }

    /**
     * Return rendered position of this.
     *
     * @readonly
     * @memberof QuadrantRing
     */
    public get position(): IPosition {
        const spacement = this.spacement;

        return {
            x: this._attrs.position.x + spacement.x,
            y: this._attrs.position.y + spacement.y,
        }
    }

    /**
     * Return donut size in current index of ring.
     */
    public get radius() {
        return this._attrs.size.ring * (this._attrs.index.ring + 1);
    }

    /**
     * Draw a donut slice.
     */
    public draw(context: CanvasRenderingContext2D) {
        this._prepare();
        context.save();
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);

        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.startAngle,
            this.endAngle,
            false
        );

        context.closePath();
        context.fillStyle = this._attrs.layout.color;
        context.fill();
        context.restore();

        for (const point of this._points) {
            point.draw(context);
        }
    }

    /**
     * Prepare execution.
     */
    private _prepare() {
        this._points = this._data.map(x =>
            new Point(x, {
                angle: {
                    start: this.startAngle,
                    end: this.endAngle,
                },
                position: {
                    fromOrigin: this.radius - this._attrs.size.ring,
                    spacement: this.spacement,
                },
                size: {
                    ring: this._attrs.size.ring,
                }
            })
        );
    }
}
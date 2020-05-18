import { IVector } from "../types/position";
import { IQuadrantRingAttributes } from "../types/quadrant-ring";
import { ISettingData } from "../types/setting";
import { displacementSignal } from "../utils/displacement";
import { BaseObject } from "./base";
import { Point } from "./point";

/**
 * Quadrant ring object.
 * Represents a donut slice.
 */
export class QuadrantRing extends BaseObject {
    private _attrs: IQuadrantRingAttributes;
    private _data: ISettingData[];
    private _points: Point[];

    constructor(data: ISettingData[], attributes: IQuadrantRingAttributes) {
        super();

        this._attrs = attributes;
        this._data = data;
        this._points = [];

        this._prepare();
    }

    /**
     * Return points.
     */
    public get points() {
        return this._points;
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
    public get spacement(): IVector {
        const spacement = this._attrs.layout.spacement / 2;
        const signal = displacementSignal(this.startAngle);

        return {
            x: spacement * signal.x,
            y: spacement * signal.y,
        };
    }

    /**
     * Return rendered position of this.
     *
     * @readonly
     * @memberof QuadrantRing
     */
    public get position(): IVector {
        const spacement = this.spacement;

        return {
            x: this._attrs.position.x + spacement.x,
            y: this._attrs.position.y + spacement.y,
        }
    }

    /**
     * Verify colision with points in this object.
     */
    public verifyColision(vector: IVector, simple = true) {
        const spacement = simple ? 10 : 20;

        return this._points.find(x => {
            const startX = x.position.x - spacement;
            const endX = x.position.x + spacement;
            const startY = x.position.y - spacement;
            const endY = x.position.y + spacement;

            const collide = vector.x >= startX && vector.x <= endX && vector.y >= startY && vector.y <= endY;
            return collide;
        });
    }

    /**
     * Draw a donut slice.
     */
    public draw(context: CanvasRenderingContext2D, reset = false) {
        if (reset) {
            this._prepare();
        }

        context.save();
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);

        context.arc(
            this.position.x,
            this.position.y,
            this._attrs.size.radius,
            this.startAngle,
            this.endAngle,
            false
        );

        context.closePath();
        context.fillStyle = this._attrs.layout.color;
        context.fill();
        context.restore();

        for (const point of this._points) {
            point.draw(context, reset);
        }
    }

    /**
     * Prepare execution.
     */
    private _prepare() {
        this._points = [];

        for (const item of this._data) {
            const point = new Point(item, {
                angle: {
                    start: this.startAngle,
                    end: this.endAngle,
                },
                position: {
                    fromOrigin: this._attrs.size.radius - this._attrs.size.ring,
                    spacement: this.spacement,
                },
                size: {
                    canvas: this._attrs.size.canvas,
                    ring: this._attrs.size.ring,
                    point: 10
                },
                validation: {
                    colision: (vector) => this.verifyColision(vector, false) != null
                }
            });

            this._points.push(point);
        }
    }
}
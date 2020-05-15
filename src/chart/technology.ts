import { BaseObject } from "../objects/base";
import { QuadrantRing } from "../objects/quadrant-ring";
import { Setting } from "../types/setting";
import { calcFirstRingRadius, calcRingRadius } from "../utils/radius";

/**
 * Technology chart.
 * Entrypoint of rendering process.
 */
export class TechnologyChart {
    private _canvas: HTMLCanvasElement;
    private _settings: Setting;
    private _objects: BaseObject[];

	constructor(canvas, settings) {
        this._canvas = canvas;
        this._settings = Setting.create(settings);
        this._objects = [];

        this._prepare();
        this._attachEvents();
        this.draw();
    }

    /**
     * Return the context of canvas.
     */
    public get context() {
        return this._canvas.getContext('2d');
    }

    /**
     * Count of rings.
     */
    public get ringCount() {
        return this._settings.rings.length;
    }

    /**
     * Count of quadrants.
     */
    public get quadrantCount() {
        return this._settings.quadrants.length;
    }

    /**
     * Size of canvas.
     */
    public get size() {
        return Math.max(this._canvas.offsetWidth, this._canvas.offsetHeight);
    }

    /**
     * Size of the quadrant, in radians.
     */
    public get quadrantSize() {
        return Math.PI*2 / this.quadrantCount;
    }

    /**
     * Draw a chart.
     */
    public draw(reset = false) {
        if (reset) {
            this._prepare();
        }

        this.context.clearRect(0, 0, this.size, this.size);

        for (const item of this._objects) {
            item.draw(this.context, reset);
        }
    }

    /**
     * Prepare draw process.
     */
    private _prepare() {
        this._adjustSize();

        // Create objects.
        this._objects = [];

        const firstRadius = calcFirstRingRadius((this.size - this._settings.layout.quadrantSpacement) / 2, this.ringCount);

        this._settings.quadrants.forEach((quadrant, qI) => {
            let radiusAcc = 0;

            this._settings.rings.forEach((ring, rI) => {
                const invertedIndex = this.ringCount - rI - 1;
                const ringSize = calcRingRadius(firstRadius, invertedIndex);
                radiusAcc += ringSize;

                this._objects.unshift(
                    this._createQuadrantRing(quadrant, ring, qI, rI, radiusAcc, ringSize)
                );
            });
        });
    }

    /**
     * Create quadrant ring object.
     */
    private _createQuadrantRing(quadrant: string, ring: string, qI: number, rI: number, radius: number, ringSize: number) {
        return new QuadrantRing(
            this._settings.data.filter(x => x.quadrant === quadrant && x.ring === ring),
            {
                index: {
                    quadrant: qI,
                    ring: rI,
                },
                layout: {
                    spacement: this._settings.layout.quadrantSpacement,
                    color: this._settings.layout.colors[qI][rI],
                },
                position: {
                    x: this.size / 2,
                    y: this.size / 2,
                },
                size: {
                    canvas: this.size,
                    ring: ringSize,
                    radius,
                    quadrant: this.quadrantSize,
                },
            }
        );
    }

    /**
     * Adjust size os canvas.
     */
    private _adjustSize() {
        // Configure size.
        this._canvas.style.width = this.size + "px";
        this._canvas.style.height = this.size + "px";
        this._canvas.width = this.size;
        this._canvas.height = this.size;
    }

    /**
     * Attach events to canvas.
     */
    private _attachEvents() {
        window.addEventListener("resize", () => {
            this.draw(true);
        });

        this._canvas.addEventListener("mouseenter", () => {
            const event = new CustomEvent("canvas-to-dom", {
                detail: { ctd: true }
            });

            document.dispatchEvent(event);
        });
    }
}
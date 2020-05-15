import { BaseObject } from "../objects/base";
import { QuadrantRing } from "../objects/quadrant-ring";
import { Setting } from "../types/setting";

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

        this._attachEvents();
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
        return Math.min(this._canvas.offsetWidth, this._canvas.offsetHeight);
    }

    /**
     * Size of the ring.
     */
    public get ringSize() {
        const spacementNormalized = this._settings.layout.quadrantSpacement / this.ringCount;
        const ringSize = (this.size / 2) / this.ringCount;

        return ringSize - spacementNormalized;
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
    public draw() {
        this._prepare();

        this.context.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetHeight);

        for (const item of this._objects) {
            item.draw(this.context);
        }
    }

    /**
     * Prepare draw process.
     */
    private _prepare() {
        this._objects = [];

        for (let qI = 0; qI < this.quadrantCount; qI++) {
            const quadrant = this._settings.quadrants[qI];

            for (let rI = this.ringCount - 1; rI >= 0; rI--) {
                const ring = this._settings.rings[rI];

                const object = new QuadrantRing(
                    this._settings.data.filter(x => x.quadrant === quadrant && x.ring === ring),
                    {
                        index: {
                            quadrant: qI,
                            ring: rI,
                        },
                        layout: {
                            spacement: this._settings.layout.quadrantSpacement,
                            color: this._settings.layout.colors[rI],
                        },
                        position: {
                            x: this.size / 2,
                            y: this.size / 2,
                        },
                        size: {
                            ring: this.ringSize,
                            quadrant: this.quadrantSize,
                        },
                    }
                );

                this._objects.push(object);
            }
        }
    }

    /**
     * Attach events to canvas.
     */
    private _attachEvents() {
        window.addEventListener("resize", () => {
            this.draw();
        });

        this._canvas.addEventListener("mouseenter", () => {
            const event = new CustomEvent("canvas-to-dom", {
                detail: { ctd: true }
            });

            document.dispatchEvent(event);
        });
    }
}
import { BaseObject } from "../objects/base";
import { Point } from "../objects/point";
import { QuadrantRing } from "../objects/quadrant-ring";
import { ISetting } from "../types/setting";
import { calcFirstRingRadius, calcRingRadius } from "../utils/radius";
import { validateSetting } from "../utils/setting";

/**
 * Technology chart.
 * Entrypoint of rendering process.
 */
export class TechnologyChart {
    private _canvas: HTMLCanvasElement;
    private _settings: ISetting;
    private _objects: BaseObject[];
    private _currPointFocus: Point;

	constructor(canvas, settings) {
        this._canvas = canvas;
        this._settings = validateSetting(settings);
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
     * Mark point in chart.
     */
    public markPoint(quadrant: string, ring: string, value: string) {
        const object = this._objects.find(x => {
            if (x instanceof QuadrantRing) {
                return x.quadrant === quadrant && x.ring === ring;
            }

            return false;
        }) as QuadrantRing;
        if (object == null) {
            return;
        }

        const point = object.points.find(x => x.data.value === value);
        if (point  == null) {
            return;
        }

        point.marked = true;
        this.draw();
    }

    /**
     * Mark point in chart.
     */
    public unmarkPoint(quadrant: string, ring: string, value: string) {
        const object = this._objects.find(x => {
            if (x instanceof QuadrantRing) {
                return x.quadrant === quadrant && x.ring === ring;
            }

            return false;
        }) as QuadrantRing;
        if (object == null) {
            return;
        }

        const point = object.points.find(x => x.data.value === value);
        if (point  == null) {
            return;
        }

        point.marked = false;
        this.draw();
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
        // Adjust size to be responsive.
        this._adjustSize();

        // Create objects.
        this._objects = [];

        // The ring size is an PG, to calculate the rings item size the first item value is needed.
        const ringTotalSize = (this.size - this._settings.layout.quadrantSpacement) / 2; // PG summation.
        const firstRadius = calcFirstRingRadius(ringTotalSize, this.ringCount);

        // Populate objects.
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
                label: {
                    quadrant,
                    ring,
                },
                index: {
                    quadrant: qI,
                    ring: rI,
                },
                layout: {
                    spacement: this._settings.layout.quadrantSpacement,
                    color: this._settings.layout.colors[qI][rI],
                    point: {
                        highlightBg: this._settings.layout.point.highlightBg,
                        bg: this._settings.layout.point.bg,
                        textColor: this._settings.layout.point.textColor,
                    }
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

        this._canvas.addEventListener("mousemove", (e) => {
            const mouseX = e.x;
            const mouseY = e.y;
            const canvasX = this._canvas.offsetLeft;
            const canvasY = this._canvas.offsetTop;
            const x = mouseX - canvasX;
            const y = mouseY - canvasY;

            for (const object of this._objects) {
                if (object instanceof QuadrantRing) {
                    const collideItem = object.verifyColision({ x, y });

                    if (collideItem != null) {
                        if (this._currPointFocus?.index !== collideItem.index) {
                            this._currPointFocus = collideItem;
                            const event = new CustomEvent("pointenter", {
                                detail: collideItem,
                            })

                            this._canvas.dispatchEvent(event);
                        }

                        return;
                    }
                }
            }

            if (this._currPointFocus != null) {
                const event = new CustomEvent("pointleave", {
                    detail: this._currPointFocus.data,
                })

                this._canvas.dispatchEvent(event);
            }

            this._currPointFocus = null;
        });
    }
}
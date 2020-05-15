
/**
 * Base object.
 */
export abstract class BaseObject {
    /**
     * Drar de object.
     */
    public abstract draw(context: CanvasRenderingContext2D, reset: boolean): void;
}
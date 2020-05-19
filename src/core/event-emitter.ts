type EventHandler<K> = (e?: K) => void;

/**
 * Event emitter imp.
 *
 * @export
 * @class EventEmitter
 * @template T The events name type. Default is string.
 * @template K The data argument type. Default is any.
 */
export class EventEmitter<T = string, K = any> {
    public _listeners = new Map<T, EventHandler<K>[]>();

    /**
     * Add listener to event.
     */
    public on(event: T, handler: EventHandler<K>) {
        const listeners = this._listeners.get(event) || [];
        listeners.push(handler);

        this._listeners.set(event, listeners);
    }

    /**
     * Emit event with data.
     */
    protected emit(event: T, data: K) {
        const listeners = this._listeners.get(event) || [];

        for (const item of listeners) {
            item(data);
        }
    }
}
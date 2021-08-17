import { StateKey } from './types';

export class TransferState {
    private transferState: Map<StateKey<string>, any>;

    public get<T>(key: StateKey<T>, defaultValue?: T): T {
        return this.transferState.get(key) || defaultValue;
    }

    public set<T>(key: StateKey<T>, value: T): void {
        this.transferState.set(key, value);
    }

    public has<T>(key: StateKey<T>): boolean {
        return this.transferState.has(key);
    }

    public clear(): void {
        this.transferState.clear();
    }

    public remove<T>(key: StateKey<T>): boolean {
        return this.transferState.delete(key);
    }

    public static async resolveAll() {
        for (const [key, value] of global['__transfer__state'].entries()) {
            const result = value instanceof Promise ? await value : value;
            global['__transfer__state'].set(key, result);
        }
    }

    public constructor() {
        if (!global['__transfer__state']) {
            global['__transfer__state'] = new Map();
        }

        this.transferState = new Proxy(global['__transfer__state'], {
            get(target, prop) {
                let value = target[prop];
                return (typeof value === 'function') ? value.bind(target) : value;
            }
        });
    }
}

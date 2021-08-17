import { RouteConfig } from './types';

export const resolveAsyncRoutes = async (location: string, routes: (location: string) => Promise<RouteConfig[]>) => {
    if (routes && typeof routes === 'function') {
        const res = routes(location);
        if (res && res instanceof Promise) {
            const promiseRes = await res;
            return promiseRes;
        } else {
            return res;
        }
    } else {
        return [];
    }
};

export interface RouteConfig {
    key?: React.Key;
    location?: Location;
    component?: React.ComponentType;
    path?: string | string[];
    exact?: boolean;
    strict?: boolean;
    routes?: RouteConfig[];
    render?: (props: any) => React.ReactNode;
    [propName: string]: any;
}

export type StateKey<T> = string & {
    __not_a_string?: never;
};

export interface AsyncRoutesResolverProps {
    routes: (location: string) => RouteConfig[] | Promise<RouteConfig[]>,
    location?: string
}

export interface AsyncRoutesResolverState {
    routes: RouteConfig[]
}

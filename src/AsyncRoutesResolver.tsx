import React from 'react';
import { AsyncRoutesResolverProps, AsyncRoutesResolverState } from './types';
import { TransferState } from './TransferState';
import { isServer } from './isServer';

export const AsyncRoutesResolverContext = React.createContext([]);

export class AsyncRoutesResolver extends React.Component<AsyncRoutesResolverProps, AsyncRoutesResolverState> {
    private transferState: TransferState;

    public constructor(props: AsyncRoutesResolverProps) {
        super(props);
        this.transferState = new TransferState();
        this.state = { routes: null };
    }

    public async componentWillMount() {
        if (this.props.routes && typeof this.props.routes === 'function') {
            const routesPromise = this.props.routes(this.props.location);
            if (routesPromise instanceof Promise) {
                if (isServer() && !this.transferState.has(this.props.location)) {
                    this.transferState.set(this.props.location, routesPromise);
                }

                const routes = await routesPromise;
                this.setState({ routes });
            } else {
                if (isServer() && !this.transferState.has(this.props.location)) {
                    this.transferState.set(this.props.location, routesPromise);
                }

                this.setState({ routes: routesPromise });
            }
        }
    }

    public render() {
        if (isServer()) {
            if (this.props.routes instanceof Array) {
                return <AsyncRoutesResolverContext.Provider value={this.props.routes}>
                    {this.props.children}
                </AsyncRoutesResolverContext.Provider>;
            }

            if (this.transferState.has(this.props.location) && !(this.transferState.get(this.props.location) instanceof Promise)) {
                return <AsyncRoutesResolverContext.Provider value={this.transferState.get(this.props.location)}>
                    {this.props.children}
                </AsyncRoutesResolverContext.Provider>;
            }
        } else {
            if (this.props.routes && this.props.routes instanceof Array) {
                return <AsyncRoutesResolverContext.Provider value={this.props.routes}>
                    {this.props.children}
                </AsyncRoutesResolverContext.Provider>;
            } else {
                return <AsyncRoutesResolverContext.Provider value={this.state.routes}>
                    {this.props.children}
                </AsyncRoutesResolverContext.Provider>;
            }
        }

        return null;
    }
}

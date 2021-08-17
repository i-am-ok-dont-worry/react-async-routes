import React from 'react';
import { AsyncRoutesResolverContext } from './AsyncRoutesResolver';

export const withAsyncRoutes = (Component) => {
    return class extends React.Component {
        static contextType = AsyncRoutesResolverContext;

        constructor(props) {
            super(props);
        }

        render() {
            return <Component {...this.props} routes={this.context} />
        }
    }
}

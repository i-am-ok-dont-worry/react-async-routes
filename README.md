# React Async Router
This package aims to provide support for async routes resolving for React Router v4.
Use async function to provide declarative router routes.

Async routes resolving can be helpful if routes declaration is unknown during
compilation and can only be resolved during runtime.


## Install 
npm install @iamok/react-router-async-routes --save

or

yarn add @iamok/react-router-async-routes


## Usage

#### Client side
To use async routes on Client Side wrap `<BrowserRouter>` into `<AsyncRoutesResolver>` component

```js
import { AsyncRoutesResolver } from '@iamok/react-async-routes';

const asyncRoutes = () => Promise.resolve([
    {
        component: App,
        routes: [
          {
              path: '/',
              exact: true,
              component: Page,
          }
        ]
    }
]);

ReactDOM.render(
    <AsyncRoutesResolver routes={asyncRoutes}>
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    </AsyncRoutesResolver>,
    document.getElementById('app') as HTMLElement
);
```

`AsyncRoutesResolver` will provide context with resolved routes declarations
that can be later used for `<Router>` component.

```js
import { withAsyncRoutes } from '@iamok/react-async-routes';

class Router extends React.PureComponent {
    static contextType = AsyncRoutesResolverContext;

    render() {
        return <Switch>
            <Route
                path="/"
                render={({
                    match,
                    location,
                }: RouteConfigComponentProps<{}>) => {
                    const renderer = () =>
                        renderRoutes(
                             this.context,
                            { match, history: this.props.history },
                            { location }
                    );

                    return renderer();
                }}
            />
        </Switch>;
    }
}

export default withAsyncRoutes(withRouter(Router));
```

#### Server side
In order to use async routes in SSR async routes must be resolved before `ReactDOMServer.renderToString`
is executed.

```js
import { resolveAsyncRoutes, AsyncRoutesResolver } from '@iamok/react-async-routes';

const routes = await resolveAsyncRoutes(req.url, asyncRoutes);

ReactDOMServer.renderToString(
  <AsyncRoutesResolver routes={routes}>
    <StaticRouter location={req.url}>
      <Router />
    </StaticRouter>
  </AsyncRoutesResolver>
);
```

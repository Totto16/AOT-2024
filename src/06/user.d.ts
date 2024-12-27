const createRoute = <Route extends string|number>(author: string, route: Route):Route => {
	console.log(`[createRoute] route created by ${author} at ${Date.now()}`);
	return route
  }

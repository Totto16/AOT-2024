const createRoute7 = <
  const Route extends string[]
>(
  author: string,
  route: Route
) => ({
  author,
  route,
  createdAt: Date.now(),
});

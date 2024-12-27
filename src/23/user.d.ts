/** Push an element to a tuple */
type Push = "p";
type LazyPush = "lp";

/** Filter a tuple */
type Filter = "f";
type LazyFilter = "lf";

/** Determine if the given type extends another */
type Extends = "e";
type LazyExtends = "le";

/** Capitalize a string */
type Cap = "c";

/** Apply an operation to all inputs */
type ApplyAll = "a";
type LazyApplyAll = "la";

/** Apply */

type ApplyAllImpl<T extends unknown[], Method> = T extends [infer Head, ...infer Tail]
	? [Apply23<Method, Head>, ...ApplyAllImpl<Tail, Method>]
	: [];

type FilterImpl<T extends unknown[], Elem> = T extends [infer Head, ...infer Tail]
	? Apply23<Elem, Head> extends true
		? [Head, ...FilterImpl<Tail, Elem>]
		: FilterImpl<Tail, Elem>
	: [];

type Apply23<Operation, Argument> = Operation extends Push
	? [LazyPush, Argument]
	: Operation extends Filter
		? [LazyFilter, Argument]
		: Operation extends Extends
			? [LazyExtends, Argument]
			: Operation extends ApplyAll
				? [LazyApplyAll, Argument]
				: Operation extends Cap
					? Argument extends string
						? Capitalize<Argument>
						: { error: "argument for capitalize not of type string" }
					: Operation extends [LazyPush, infer PushArg]
						? Argument extends unknown[]
							? [...Argument, PushArg]
							: { error: "argument for lazy push not of type array" }
						: Operation extends [LazyExtends, infer ExtendsType]
							? Argument extends ExtendsType
								? true
								: false
							: Operation extends [LazyFilter, infer FilterArg]
								? Argument extends unknown[]
									? FilterImpl<Argument, FilterArg>
									: { error: "argument for lazy filter not of type array" }
								: Operation extends [LazyApplyAll, infer ApplyAllArg]
									? Argument extends unknown[]
										? ApplyAllImpl<Argument, ApplyAllArg>
										: { error: "argument for lazy apply all not of type array" }
									: { error: "No such operation" };

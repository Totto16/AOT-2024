type Apply<Arg, Ret> = (arg: Arg) => Ret

const compose =
	<A, B, C, D>(f: Apply<A, B>, g: Apply<B, C>, h: Apply<C, D>): Apply<A, D> =>
	(a: A) =>
		h(g(f(a)))

type FirstChar<T extends string> = T extends `${infer First}${infer Rest}`
	? First
	: never
type FirstElem<T extends unknown[]> = T extends [] ? never : T[0]
type Tuple<T> = [T]
interface Box<T> {
	value: T
}

const upperCase = <const T extends string>(x: T): Uppercase<T> =>
	x.toUpperCase() as Uppercase<T>
const lowerCase = <const T extends string>(x: T): Lowercase<T> =>
	x.toLowerCase() as Lowercase<T>
const firstChar = <const T extends string, R = FirstChar<T>>(x: T): R =>
	x[0] as R
const firstItem = <const T extends unknown[]>(x: T): FirstElem<T> =>
	x[0] as FirstElem<T>
const makeTuple = <const T>(x: T): Tuple<T> => [x]
const makeBox = <const T>(value: T): Box<T> => ({ value })

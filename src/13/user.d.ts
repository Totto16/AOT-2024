// using Variance Annotation, to say this is an Invariant
// see: https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations
interface Demand<in out T> {
	demand: T
}

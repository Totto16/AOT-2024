type Inv<T> = (value: T) => T // Invariant

type InvType<T> = T extends Inv<infer S> ? S : never // Get Type of Invariant

interface Demand<T, S extends Inv<T> = Inv<T>> {
	demand: InvType<S>
}

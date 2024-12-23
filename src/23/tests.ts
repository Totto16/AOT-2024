import type { Expect, Equal } from "type-testing"

type t0_actual = Apply23<Cap, "hello"> // =>
type t0_expected = "Hello" // =>
type t0 = Expect<Equal<t0_actual, t0_expected>>

type t1_actual = Apply23<
	// =>
	Apply23<Push, "world">,
	["hello"]
>
type t1_expected = ["hello", "world"] // =>
type t1 = Expect<Equal<t1_actual, t1_expected>>

type t2_actual = Apply23<
	// =>
	Apply23<ApplyAll, Cap>,
	Apply23<Apply23<Push, "world">, ["hello"]>
>
type t2_expected = ["Hello", "World"] // =>
type t2 = Expect<Equal<t2_actual, t2_expected>>

type t3_actual = Apply23<
	// =>
	Apply23<Filter, Apply23<Extends, number>>,
	[1, "foo", 2, 3, "bar", true]
>
type t3_expected = [1, 2, 3] // =>
type t3 = Expect<Equal<t3_actual, t3_expected>>

type Station1 = Apply23<Cap, "robot"> // =>
type Station2 = Apply23<Apply23<Push, Station1>, ["Tablet", "teddy bear"]> // =>
type Station3 = Apply23<
	Apply23<Filter, Apply23<Extends, Apply23<Cap, string>>>,
	Station2
>
type t4_actual = Station3
type t4_expected = ["Tablet", "Robot"]
type t4 = Expect<Equal<t4_actual, t4_expected>>

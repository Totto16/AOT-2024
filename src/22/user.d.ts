interface Error {
	code: number
	error: string
}

interface Result<T> {
	data: T
	rest: string
}

type ParseNull<T extends string> = T extends `null${infer Rest}`
	? { data: null; rest: Rest }
	: { code: 12; error: "Not a valid null constant" }

type ParseBoolean<T extends string> = T extends `false${infer Rest}`
	? { data: false; rest: Rest }
	: T extends `true${infer Rest}`
	? { data: true; rest: Rest }
	: { code: 4; error: "Not a valid boolean" }

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

type ParseNumberImpl<
	T extends string,
	Acc extends string
> = T extends `${infer DigitVal extends Digit}${infer Rest1}`
	? ParseNumberImpl<Rest1, `${Acc}${DigitVal}`>
	: Acc extends `${infer Num extends number}`
	? { data: Num; rest: T }
	: { code: 5; error: "Not a valid number" }

type ParseNumber<T extends string> = ParseNumberImpl<T, "">

type ValidEscapeChar = "n" | "r" | "t" | "\\" | "b" | "f" | '"'

type EscapeValueOf<Val extends ValidEscapeChar> = Val extends "n"
	? "\n"
	: Val extends "r"
	? "\r"
	: Val extends "t"
	? "\t"
	: Val extends "\\"
	? "\\"
	: Val extends "b"
	? "\b"
	: Val extends "f"
	? "\f"
	: Val extends '"'
	? '"'
	: Val

type ParseStringImpl<
	T extends string,
	Acc extends string
> = T extends `"${infer Rest1}`
	? { data: Acc; rest: Rest1 }
	: T extends `${infer Char}${infer Rest2}`
	? Char extends "\\"
		? Rest2 extends `${infer Char2}${infer Rest3}`
			? Char2 extends ValidEscapeChar
				? ParseStringImpl<Rest3, `${Acc}${EscapeValueOf<Char2>}`>
				: {
						code: 9
						error: "Not a valid string: escape sequence invalid"
				  }
			: { code: 8; error: "Not a valid string: escape sequence to short" }
		: ParseStringImpl<Rest2, `${Acc}${Char}`>
	: { code: 7; error: "Not a valid string: Not terminated" }

type ParseString<T extends string> = T extends `"${infer Rest}`
	? ParseStringImpl<Rest, "">
	: { code: 6; error: "Not a valid string" }

type ParsePrimitive<T extends string> = ParseBoolean<T> extends {
	data: infer Data
	rest: infer Rest
}
	? { data: Data; rest: Rest }
	: ParseNumber<T> extends { data: infer Data; rest: infer Rest }
	? { data: Data; rest: Rest }
	: ParseString<T> extends { data: infer Data; rest: infer Rest }
	? { data: Data; rest: Rest }
	: ParseNull<T> extends { data: infer Data; rest: infer Rest }
	? { data: Data; rest: Rest }
	: { code: 3; error: "Error 3" }

type ParseArrayImpl<
	T extends string,
	Acc extends unknown[]
> = T extends `]${infer Rest1}`
	? { data: Acc; rest: Rest1 }
	: T extends `,${infer Rest2}`
	? ParseArrayImpl<RemovePrefixWhitespace<Rest2>, Acc>
	: ParseJsonImpl<T> extends {
			data: infer Data
			rest: infer Rest3 extends string
	  }
	? ParseArrayImpl<RemovePrefixWhitespace<Rest3>, [...Acc, Data]>
	: { code: 11; error: "Not a valid array" }

type ParseArray<T extends string> = T extends `[${infer Rest}`
	? ParseArrayImpl<RemovePrefixWhitespace<Rest>, []>
	: { code: 10; error: "Not a valid array" }

type ParseValueObjImpl<T extends string> =
	T extends `:${infer Rest1 extends string}`
		? ParseJsonImpl<RemovePrefixWhitespace<Rest1>> extends {
				data: infer Data
				rest: infer Rest2 extends string
		  }
			? { data: Data; rest: RemovePrefixWhitespace<Rest2> }
			: {
					code: 18
					error: "Not a valid object: no value found, not a valid json value"
			  }
		: { code: 17; error: "Not a valid object: no value found, missing :" }

type ParseKeyObjImpl<T extends string> = ParseString<T> extends {
	data: infer KeyData1
	rest: infer Rest1
}
	? { data: KeyData1; rest: Rest1 }
	: ParseNumber<T> extends {
			data: infer KeyData2
			rest: infer Rest2
	  }
	? { data: KeyData2; rest: Rest2 }
	: { code: 19; error: "Not a valid object: invalid key" }

type ParseKeyValueObjImpl<T extends string> = ParseKeyObjImpl<T> extends {
	data: infer KeyData extends string | number
	rest: infer Rest1 extends string
}
	? ParseValueObjImpl<RemovePrefixWhitespace<Rest1>> extends {
			data: infer ValueData
			rest: infer Rest2
	  }
		? { data: Record<KeyData, ValueData>; rest: Rest2 }
		: { code: 16; error: "Not a valid object: no value found" }
	: { code: 15; error: "Not a valid object: no key found" }

/** Eliminate intersections */
type RemoveIntersection<T> = { [P in keyof T]: T[P] }

type ParseObjectImpl<
	T extends string,
	Acc extends Record<string, unknown>
> = T extends `}${infer Rest1}`
	? { data: Acc; rest: Rest1 }
	: T extends `,${infer Rest2}`
	? ParseObjectImpl<RemovePrefixWhitespace<Rest2>, Acc>
	: ParseKeyValueObjImpl<T> extends {
			data: infer Data extends Record<string, unknown>
			rest: infer Rest3 extends string
	  }
	? ParseObjectImpl<
			RemovePrefixWhitespace<Rest3>,
			RemoveIntersection<Acc & Data>
	  >
	: { code: 14; error: "Not a valid object" }

type ParseObject<T extends string> = T extends `{${infer Rest}`
	? ParseObjectImpl<RemovePrefixWhitespace<Rest>, {}>
	: { code: 13; error: "Not a valid object" }

type ParseJsonImpl<T extends string> = ParsePrimitive<T> extends {
	data: infer Data
	rest: infer Rest
}
	? { data: Data; rest: Rest }
	: ParseArray<T> extends { data: infer Data; rest: infer Rest }
	? { data: Data; rest: Rest }
	: ParseObject<T> extends { data: infer Data; rest: infer Rest }
	? { data: Data; rest: Rest }
	: { code: 2; error: "Error 2" }

type Whitespace22 = " " | "\n" | "\t" | "\r"

type RemovePrefixWhitespace<T extends string> =
	T extends `${infer A extends Whitespace22}${infer Rest}`
		? RemovePrefixWhitespace<Rest>
		: T

type ParseJson<T extends string> = ParseJsonImpl<
	RemovePrefixWhitespace<T>
> extends {
	data: infer Data
	rest: infer Rest
}
	? Rest extends ""
		? Data
		: { code: 0; error: "Json has garbage at end"; rest: Rest }
	: { code: 1; error: "Invalid Json" }

type Parse<T extends string> = ParseJson<T>

import type { Expect, Equal } from "type-testing"

type nu_check_0 = Expect<Equal<ParseNull<"null__">, { data: null; rest: "__" }>>
type nu_check_1 = Expect<
	Equal<
		ParseNull<"garbage">,
		{ code: 12; error: "Not a valid null constant" }
	>
>

type b_check_0 = Expect<
	Equal<ParseBoolean<"false__">, { data: false; rest: "__" }>
>
type b_check_1 = Expect<
	Equal<ParseBoolean<"true__">, { data: true; rest: "__" }>
>
type b_check_2 = Expect<
	Equal<ParseBoolean<"garbage">, { code: 4; error: "Not a valid boolean" }>
>

type n_check_0 = Expect<Equal<ParseNumber<"4__">, { data: 4; rest: "__" }>>
type n_check_1 = Expect<
	Equal<ParseNumber<"1214__">, { data: 1214; rest: "__" }>
>
type n_check_2 = Expect<
	Equal<ParseNumber<"garbage">, { code: 5; error: "Not a valid number" }>
>

type s_check_0 = Expect<
	Equal<ParseString<'"a string 1"__'>, { data: "a string 1"; rest: "__" }>
>
type s_check_1 = Expect<
	Equal<
		ParseString<'"not terminated'>,
		{ code: 7; error: "Not a valid string: Not terminated" }
	>
>
type s_check_2 = Expect<
	Equal<ParseString<"garbage">, { code: 6; error: "Not a valid string" }>
>
type s_check_3 = Expect<
	Equal<
		ParseString<'"\\'>,
		{ code: 8; error: "Not a valid string: escape sequence to short" }
	>
>
type s_check_4 = Expect<
	Equal<
		ParseString<'"\\p'>,
		{ code: 9; error: "Not a valid string: escape sequence invalid" }
	>
>
type s_check_5 = Expect<
	Equal<
		ParseString<'"\\n\\r\\t\\b\\f\\\\\\""__'>,
		{ data: '\n\r\t\b\f\\"'; rest: "__" }
	>
>

type a_check_0 = Expect<Equal<ParseArray<"[]__">, { data: []; rest: "__" }>>
// not really valid, but just to check, that a ,  is stripped away at any time
type a_check_1 = Expect<Equal<ParseArray<"[,]__">, { data: []; rest: "__" }>>
type a_check_2 = Expect<
	Equal<ParseArray<"[      ]__">, { data: []; rest: "__" }>
>
type a_check_3 = Expect<
	Equal<ParseArray<"[1,2]__">, { data: [1, 2]; rest: "__" }>
>
type a_check_4 = Expect<
	Equal<ParseArray<"[[1,2]]__">, { data: [[1, 2]]; rest: "__" }>
>
type a_check_5 = Expect<
	Equal<ParseArray<"garbage">, { code: 10; error: "Not a valid array" }>
>
type a_check_6 = Expect<
	Equal<ParseArray<"[">, { code: 11; error: "Not a valid array" }>
>

type o_check_0 = Expect<Equal<ParseObject<"{}__">, { data: {}; rest: "__" }>>
type o_check_1 = Expect<
	Equal<ParseObject<"garbage">, { code: 13; error: "Not a valid object" }>
>
type o_check_2 = Expect<
	Equal<ParseObject<'{"1",   }__'>, { code: 14; error: "Not a valid object" }>
>
type o_check_3 = Expect<
	Equal<ParseObject<'{"1":2,   }__'>, { data: { "1": 2 }; rest: "__" }>
>
type o_check_4 = Expect<
	Equal<ParseObject<"{1:2,   }__">, { data: { 1: 2 }; rest: "__" }>
>
type o_check_5 = Expect<
	Equal<
		ParseObject<'{"1":2, "3312":[1]  }__'>,
		{ data: { "1": 2; "3312": [1] }; rest: "__" }
	>
>
type o_check_6 = Expect<
	Equal<
		ParseObject<'{"1":2, "3312":{"a":"b", "c":null}  }__'>,
		{ data: { "1": 2; "3312": { a: "b"; c: null } }; rest: "__" }
	>
>

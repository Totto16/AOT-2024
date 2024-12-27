import type { Expect, Equal } from "type-testing"

import type {
	Between,
	Digits0,
	Digits1,
	Whitespace0,
	Str,
	Padded,
	Sym,
	DigitParser,
	IntParser,
	JSONNullParser,
	JSONBooleanParser,
	JSONNumberParser,
	JSONArrayParser,
	JSONObjectParser,
	JSONStringParser,
	JSONValueParser,
	JSONParser,
} from "./tests"

// tests for parsers already provided

type is_parser_tests_0 = Expect<Equal<IsParser<Whitespace0>, true>>

type is_parser_tests_1 = Expect<Equal<IsParser<Digits0>, true>>

type is_parser_tests_2 = Expect<Equal<IsParser<Digits1>, true>>

type is_parser_tests_3 = Expect<
	Equal<IsParser<Between<Whitespace0, Whitespace0, Digits1>>, true>
>

type is_parser_tests_4 = Expect<Equal<IsParser<Str<"Hello">>, true>>

type is_parser_tests_5 = Expect<Equal<IsParser<Padded<Whitespace0>>, true>>

type is_parser_tests_6 = Expect<Equal<IsParser<Sym<"++">>, true>>

type is_parser_tests_7 = Expect<Equal<IsParser<DigitParser>, true>>

type is_parser_tests_8 = Expect<Equal<IsParser<IntParser>, true>>

// individual JSON parser tests. based on day 22

type nu_check_0 = Expect<
	Equal<Parse<JSONNullParser, "null__">, ParserSuccessResult<null, "__">>
>
type nu_check_1 = Expect<
	Equal<
		Parse<JSONNullParser, "garbage">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 2">
			acc: []
		}>
	>
>

type b_check_0 = Expect<
	Equal<Parse<JSONBooleanParser, "false__">, ParserSuccessResult<false, "__">>
>
type b_check_1 = Expect<
	Equal<Parse<JSONBooleanParser, "true__">, ParserSuccessResult<true, "__">>
>
type b_check_2 = Expect<
	Equal<
		Parse<JSONBooleanParser, "garbage">,
		ParserErrorResult<"Choice didn't match, none of the subparsers matched">
	>
>

type n_check_0 = Expect<
	Equal<Parse<JSONNumberParser, "4__">, ParserSuccessResult<4, "__">>
>
type n_check_1 = Expect<
	Equal<Parse<JSONNumberParser, "1214__">, ParserSuccessResult<1214, "__">>
>
type n_check_2 = Expect<
	Equal<
		Parse<JSONNumberParser, "garbage">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match"
			result: ParserErrorResult<"Choice didn't match, none of the subparsers matched">
			acc: [MaybeResult]
		}>
	>
>

type s_check_0 = Expect<
	Equal<
		Parse<JSONStringParser, '"a string 1"__'>,
		{ data: "a string 1"; rest: "__" }
	>
>
type s_check_1 = Expect<
	Equal<
		Parse<JSONStringParser, '"not terminated'>,
		{ code: 7; error: "Not a valid string: Not terminated" }
	>
>
type s_check_2 = Expect<
	Equal<
		Parse<JSONStringParser, "garbage">,
		{ code: 6; error: "Not a valid string" }
	>
>
type s_check_3 = Expect<
	Equal<
		Parse<JSONStringParser, '"\\'>,
		{ code: 8; error: "Not a valid string: escape sequence to short" }
	>
>
type s_check_4 = Expect<
	Equal<
		Parse<JSONStringParser, '"\\p'>,
		{ code: 9; error: "Not a valid string: escape sequence invalid" }
	>
>
type s_check_5 = Expect<
	Equal<
		Parse<JSONStringParser, '"\\n\\r\\t\\b\\f\\\\\\""__'>,
		{ data: '\n\r\t\b\f\\"'; rest: "__" }
	>
>

type a_check_0 = Expect<
	Equal<Parse<JSONArrayParser, "[]__">, { data: []; rest: "__" }>
>
// not really valid, but just to check, that a ,  is stripped away at any time
type a_check_1 = Expect<
	Equal<Parse<JSONArrayParser, "[,]__">, { data: []; rest: "__" }>
>
type a_check_2 = Expect<
	Equal<Parse<JSONArrayParser, "[      ]__">, { data: []; rest: "__" }>
>
type a_check_3 = Expect<
	Equal<Parse<JSONArrayParser, "[1,2]__">, { data: [1, 2]; rest: "__" }>
>
type a_check_4 = Expect<
	Equal<Parse<JSONArrayParser, "[[1,2]]__">, { data: [[1, 2]]; rest: "__" }>
>
type a_check_5 = Expect<
	Equal<
		Parse<JSONArrayParser, "garbage">,
		{ code: 10; error: "Not a valid array" }
	>
>
type a_check_6 = Expect<
	Equal<Parse<JSONArrayParser, "[">, { code: 11; error: "Not a valid array" }>
>

type o_check_0 = Expect<
	Equal<Parse<JSONObjectParser, "{}__">, { data: {}; rest: "__" }>
>
type o_check_1 = Expect<
	Equal<
		Parse<JSONObjectParser, "garbage">,
		{ code: 13; error: "Not a valid object" }
	>
>
type o_check_2 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1",   }__'>,
		{ code: 14; error: "Not a valid object" }
	>
>
type o_check_3 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1":2,   }__'>,
		{ data: { "1": 2 }; rest: "__" }
	>
>
type o_check_4 = Expect<
	Equal<
		Parse<JSONObjectParser, "{1:2,   }__">,
		{ data: { 1: 2 }; rest: "__" }
	>
>
type o_check_5 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1":2, "3312":[1]  }__'>,
		{ data: { "1": 2; "3312": [1] }; rest: "__" }
	>
>
type o_check_6 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1":2, "3312":{"a":"b", "c":null}  }__'>,
		{ data: { "1": 2; "3312": { a: "b"; c: null } }; rest: "__" }
	>
>

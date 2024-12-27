import type { Expect, Equal, IsAny, IsNever, NotEqual } from "type-testing"

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

type is_parser_tests_9 = Expect<Equal<IsParser<JSONNullParser>, true>>

type is_parser_tests_10 = Expect<Equal<IsParser<JSONBooleanParser>, true>>

type is_parser_tests_11 = Expect<Equal<IsParser<JSONNumberParser>, true>>

type is_parser_tests_12 = Expect<Equal<IsParser<JSONArrayParser>, true>>

type is_parser_tests_12_a = Expect<NotEqual<IsNever<JSONArrayParser>, true>>

type is_parser_tests_12_b = Expect<NotEqual<IsAny<JSONArrayParser>, true>>

type is_parser_tests_13 = Expect<Equal<IsParser<JSONObjectParser>, true>>

type is_parser_tests_13_a = Expect<NotEqual<IsNever<JSONObjectParser>, true>>

type is_parser_tests_13_b = Expect<NotEqual<IsAny<JSONObjectParser>, true>>

type is_parser_tests_14 = Expect<Equal<IsParser<JSONStringParser>, true>>

type is_parser_tests_15 = Expect<Equal<IsParser<JSONValueParser>, true>>

type is_parser_tests_16 = Expect<Equal<IsParser<JSONParser>, true>>

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
		ParserSuccessResult<"a string 1", "__">
	>
>
type s_check_1 = Expect<
	Equal<
		Parse<JSONStringParser, '"not terminated'>,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<
					[
						"n",
						"o",
						"t",
						" ",
						"t",
						"e",
						"r",
						"m",
						"i",
						"n",
						"a",
						"t",
						"e",
						"d"
					],
					""
				>,
				ParserErrorResult<"Just didn't match, case 1">
			]
			index: 2
		}>
	>
>
type s_check_2 = Expect<
	Equal<
		Parse<JSONStringParser, "garbage">,
		ParserErrorResult<{
			message: "Left didn't match, first parser didn't match"
			result: ParserErrorResult<{
				message: "Right didn't match, first parser didn't match"
				result: ParserErrorResult<"Just didn't match, case 2">
				index: 1
			}>
			index: 1
		}>
	>
>
type s_check_3 = Expect<
	Equal<
		Parse<JSONStringParser, '"\\'>,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<[], "\\">,
				ParserErrorResult<"Just didn't match, case 2">
			]
			index: 2
		}>
	>
>
type s_check_4 = Expect<
	Equal<
		Parse<JSONStringParser, '"\\p'>,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<[], "\\p">,
				ParserErrorResult<"Just didn't match, case 2">
			]
			index: 2
		}>
	>
>
type s_check_5 = Expect<
	Equal<
		Parse<JSONStringParser, '"\\n\\r\\t\\b\\f\\\\\\""__'>,
		ParserSuccessResult<'\n\r\t\b\f\\"', "__">
	>
>

type a_check_0 = Expect<
	Equal<Parse<JSONArrayParser, "[]__">, ParserSuccessResult<[], "__">>
>

type z3 = Parse<JSONArrayParser, "[,]__">
type a_result_1 = Parse<JSONArrayParser, "[,]__">
type a_check_1 = Expect<Equal<a_result_1["success"], false>>
type a_check_2 = Expect<
	Equal<Parse<JSONArrayParser, "[      ]__">, ParserSuccessResult<[], "__">>
>
type a_check_3 = Expect<
	Equal<Parse<JSONArrayParser, "[1,2]__">, ParserSuccessResult<[1, 2], "__">>
>
type a_check_4 = Expect<
	Equal<
		Parse<JSONArrayParser, "[[1,2]]__">,
		ParserSuccessResult<[[1, 2]], "__">
	>
>

type a_result_5 = Parse<JSONArrayParser, "garbage">

type a_check_5 = Expect<Equal<a_result_5["success"], false>>

type a_result_6 = Parse<JSONArrayParser, "[">
type a_check_6 = Expect<Equal<a_result_6["success"], false>>

type o_check_0 = Expect<
	Equal<Parse<JSONObjectParser, "{}__">, ParserSuccessResult<{}, "__">>
>
type o_check_1 = Expect<
	Equal<
		Parse<JSONObjectParser, "garbage">,
		ParserErrorResult<{
			message: "Left didn't match, first parser didn't match"
			result: ParserErrorResult<{
				message: "Right didn't match, first parser didn't match"
				result: ParserErrorResult<{
					message: "Left didn't match, first parser didn't match"
					result: ParserErrorResult<{
						message: "Seq didn't match, parser didn't match"
						result: ParserErrorResult<"Just didn't match, case 2">
						acc: []
					}>
					index: 1
				}>
				index: 1
			}>
			index: 1
		}>
	>
>
type o_check_2 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1",   }__'>,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<Omit<{}, never>, '"1",   }__'>,
				ParserErrorResult<{
					message: "Left didn't match, first parser didn't match"
					result: ParserErrorResult<{
						message: "Seq didn't match, parser didn't match"
						result: ParserErrorResult<"Just didn't match, case 2">
						acc: []
					}>
					index: 1
				}>
			]
			index: 2
		}>
	>
>

type o_result_3 = Parse<JSONObjectParser, '{"1":2,   }__'>
type o_check_3 = Expect<Equal<o_result_3["success"], false>>
type o_check_4 = Expect<
	Equal<
		Parse<JSONObjectParser, "{1:2,   }__">,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<Omit<{}, never>, "1:2,   }__">,
				ParserErrorResult<{
					message: "Left didn't match, first parser didn't match"
					result: ParserErrorResult<{
						message: "Seq didn't match, parser didn't match"
						result: ParserErrorResult<"Just didn't match, case 2">
						acc: []
					}>
					index: 1
				}>
			]
			index: 2
		}>
	>
>
type z = Parse<
	Parse<
		Pair,
		[Parse<Left, [Padded<JSONStringParser>, Sym<":">]>, JSONValueParser]
	>,
	'"1": 2'
>
type o_check_5 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1":2 }__'>,
		ParserSuccessResult<{ "1": 2 }, "__">
	>
>
type z2 = Parse<JSONObjectParser, '{"1": 2, "3312": 1}__'>
type o_check_6 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1":2, "3312":[1]  }__'>,
		ParserSuccessResult<{ "1": 2; "3312": [1] }, "__">
	>
>
type o_check_7 = Expect<
	Equal<
		Parse<JSONObjectParser, '{"1":2, "3312":{"a":"b", "c":null}  }__'>,
		ParserSuccessResult<{ "1": 2; "3312": { a: "b"; c: null } }, "__">
	>
>

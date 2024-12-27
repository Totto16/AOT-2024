import type { Expect, Equal, NotEqual } from "type-testing"

// tests

// just tests
type just_arg_check_0 = Expect<
	NotEqual<
		Parse<Just, 1>,
		{
			error: "invalid argument for Just"
			argument: 1
			message: "argument is not a string"
		}
	>
>

type just_arg_check_1 = Expect<
	NotEqual<
		Parse<Just, "11">,
		{
			error: "invalid argument for Just"
			argument: "11"
			message: "argument length is not 1"
		}
	>
>
type just_arg_check_2 = Expect<
	Equal<Parse<Just, "1">, LazyOperation<JustKw, "1">>
>
type just_arg_check_3 = Expect<
	Equal<Parse<Just, "1" | "2">, LazyOperation<JustKw, "1" | "2">>
>

type just_is_parser = Expect<Equal<IsParser<Parse<Just, "1">>, true>>

type JustTestParser1 = Parse<Just, "a">

type just_parse_check_0 = Expect<
	Equal<Parse<JustTestParser1, "abb">, ParserSuccessResult<"a", "bb">>
>
type just_parse_check_1 = Expect<
	Equal<
		Parse<JustTestParser1, "cbb">,
		ParserErrorResult<"Just didn't match, case 2">
	>
>
type just_parse_check_2 = Expect<
	Equal<
		Parse<JustTestParser1, "">,
		ParserErrorResult<"Just didn't match, case 1">
	>
>

type JustTestParser2 = Parse<Just, "a" | "b">

type just_parse_check_3 = Expect<
	Equal<Parse<JustTestParser2, "ac">, ParserSuccessResult<"a", "c">>
>
type just_parse_check_4 = Expect<
	Equal<Parse<JustTestParser2, "bc">, ParserSuccessResult<"b", "c">>
>

// noneof tests

type none_of_arg_check_0 = Expect<
	Equal<
		Parse<NoneOf, 1>,
		{
			error: "invalid argument for NoneOf"
			argument: 1
			message: "argument is not a string"
		}
	>
>
type none_of_arg_check_1 = Expect<
	Equal<
		Parse<NoneOf, "11">,
		{
			error: "invalid argument for NoneOf"
			argument: "11"
			message: "argument length is not 1"
		}
	>
>
type none_of_arg_check_2 = Expect<
	Equal<Parse<NoneOf, "1">, LazyOperation<NoneOfKw, "1">>
>
type none_of_arg_check_3 = Expect<
	Equal<Parse<NoneOf, "1" | "2">, LazyOperation<NoneOfKw, "1" | "2">>
>

type none_of_is_parser = Expect<Equal<IsParser<Parse<NoneOf, "1">>, true>>

type NoneOfTestParser1 = Parse<NoneOf, "a">

type none_of_parse_check_0 = Expect<
	Equal<Parse<NoneOfTestParser1, "gbb">, ParserSuccessResult<"g", "bb">>
>
type none_of_parse_check_1 = Expect<
	Equal<
		Parse<NoneOfTestParser1, "abb">,
		ParserErrorResult<"NoneOf didn't match, case 2">
	>
>
type none_of_parse_check_2 = Expect<
	Equal<
		Parse<NoneOfTestParser1, "">,
		ParserErrorResult<"NoneOf didn't match, case 1">
	>
>

type NoneOfTestParser2 = Parse<NoneOf, "a" | "b">

type none_of_parse_check_3 = Expect<
	Equal<Parse<NoneOfTestParser2, "ca">, ParserSuccessResult<"c", "a">>
>
type none_of_parse_check_4 = Expect<
	Equal<Parse<NoneOfTestParser2, "cb">, ParserSuccessResult<"c", "b">>
>
type none_of_parse_check_5 = Expect<
	Equal<
		Parse<NoneOfTestParser2, "aff">,
		ParserErrorResult<"NoneOf didn't match, case 2">
	>
>

type none_of_parse_check_6 = Expect<
	Equal<
		Parse<NoneOfTestParser2, "bff">,
		ParserErrorResult<"NoneOf didn't match, case 2">
	>
>

// seq tests

type seq_arg_check_0 = Expect<
	Equal<
		Parse<Seq, 1>,
		{
			error: "invalid argument for Seq"
			argument: 1
			message: "argument is not an array of Parsers"
		}
	>
>
type seq_arg_check_1 = Expect<
	Equal<
		Parse<Seq, "11">,
		{
			error: "invalid argument for Seq"
			argument: "11"
			message: "argument is not an array of Parsers"
		}
	>
>
type seq_arg_check_2 = Expect<
	Equal<
		Parse<Seq, [1]>,
		{
			error: "invalid argument for Seq"
			argument: [1]
			message: "argument is not an array of Parsers"
		}
	>
>

type seq_arg_check_3 = Expect<
	Equal<
		Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<
			SeqKw,
			[LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]
		>
	>
>

type seq_arg_check_4 = Expect<
	Equal<
		Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">, Parse<Just, "3">]>,
		LazyOperation<
			SeqKw,
			[
				LazyOperation<JustKw, "1">,
				LazyOperation<JustKw, "2">,
				LazyOperation<JustKw, "3">
			]
		>
	>
>
type seq_arg_check_5 = Expect<Equal<Parse<Seq, []>, LazyOperation<SeqKw, []>>>

type seq_is_parser = Expect<
	Equal<IsParser<Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>

type SeqTestParser1 = Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">]>

type seq_parse_check_0 = Expect<
	Equal<Parse<SeqTestParser1, "123">, ParserSuccessResult<["1", "2"], "3">>
>
type seq_parse_check_1 = Expect<
	Equal<
		Parse<SeqTestParser1, "">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 1">
			acc: []
		}>
	>
>
type seq_parse_check_2 = Expect<
	Equal<
		Parse<SeqTestParser1, "0">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 2">
			acc: []
		}>
	>
>
type seq_parse_check_3 = Expect<
	Equal<
		Parse<SeqTestParser1, "1">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 1">
			acc: ["1"]
		}>
	>
>
type seq_parse_check_4 = Expect<
	Equal<
		Parse<SeqTestParser1, "11">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 2">
			acc: ["1"]
		}>
	>
>

// right tests

type right_arg_check_0 = Expect<
	Equal<
		Parse<Right, 1>,
		{
			error: "invalid argument for Right"
			argument: 1
			message: "argument is not a tuple with size 2"
		}
	>
>
type right_arg_check_1 = Expect<
	Equal<
		Parse<Right, "11">,
		{
			error: "invalid argument for Right"
			argument: "11"
			message: "argument is not a tuple with size 2"
		}
	>
>
type right_arg_check_2 = Expect<
	Equal<
		Parse<Right, [1]>,
		{
			error: "invalid argument for Right"
			argument: [1]
			message: "argument is not a tuple with size 2"
		}
	>
>

type right_arg_check_3 = Expect<
	Equal<
		Parse<Right, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<
			RightKw,
			[LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]
		>
	>
>

type right_is_parser = Expect<
	Equal<IsParser<Parse<Right, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>

type RightTestParser1 = Parse<Right, [Parse<Just, "1">, Parse<Just, "2">]>

type right_parse_check_0 = Expect<
	Equal<Parse<RightTestParser1, "123">, ParserSuccessResult<"2", "3">>
>
type right_parse_check_1 = Expect<
	Equal<
		Parse<RightTestParser1, "">,
		ParserErrorResult<{
			message: "Right didn't match, first parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 1">
			index: 1
		}>
	>
>
type right_parse_check_2 = Expect<
	Equal<
		Parse<RightTestParser1, "0">,
		ParserErrorResult<{
			message: "Right didn't match, first parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 2">
			index: 1
		}>
	>
>

type right_parse_check_3 = Expect<
	Equal<
		Parse<RightTestParser1, "1">,
		ParserErrorResult<{
			message: "Right didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<"1", "">,
				ParserErrorResult<"Just didn't match, case 1">
			]
			index: 2
		}>
	>
>
type right_parse_check_4 = Expect<
	Equal<
		Parse<RightTestParser1, "11">,
		ParserErrorResult<{
			message: "Right didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<"1", "1">,
				ParserErrorResult<"Just didn't match, case 2">
			]
			index: 2
		}>
	>
>

// left tests

type left_arg_check_0 = Expect<
	Equal<
		Parse<Left, 1>,
		{
			error: "invalid argument for Left"
			argument: 1
			message: "argument is not a tuple with size 2"
		}
	>
>
type left_arg_check_1 = Expect<
	Equal<
		Parse<Left, "11">,
		{
			error: "invalid argument for Left"
			argument: "11"
			message: "argument is not a tuple with size 2"
		}
	>
>
type left_arg_check_2 = Expect<
	Equal<
		Parse<Left, [1]>,
		{
			error: "invalid argument for Left"
			argument: [1]
			message: "argument is not a tuple with size 2"
		}
	>
>

type left_arg_check_3 = Expect<
	Equal<
		Parse<Left, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<
			LeftKw,
			[LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]
		>
	>
>

type left_is_parser = Expect<
	Equal<IsParser<Parse<Left, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>

type LeftTestParser1 = Parse<Left, [Parse<Just, "1">, Parse<Just, "2">]>

type left_parse_check_0 = Expect<
	Equal<Parse<LeftTestParser1, "123">, ParserSuccessResult<"1", "3">>
>
type left_parse_check_1 = Expect<
	Equal<
		Parse<LeftTestParser1, "">,
		ParserErrorResult<{
			message: "Left didn't match, first parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 1">
			index: 1
		}>
	>
>
type left_parse_check_2 = Expect<
	Equal<
		Parse<LeftTestParser1, "0">,
		ParserErrorResult<{
			message: "Left didn't match, first parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 2">
			index: 1
		}>
	>
>

type left_parse_check_3 = Expect<
	Equal<
		Parse<LeftTestParser1, "1">,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<"1", "">,
				ParserErrorResult<"Just didn't match, case 1">
			]
			index: 2
		}>
	>
>
type left_parse_check_4 = Expect<
	Equal<
		Parse<LeftTestParser1, "11">,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<"1", "1">,
				ParserErrorResult<"Just didn't match, case 2">
			]
			index: 2
		}>
	>
>

// pair tests

type pair_arg_check_0 = Expect<
	Equal<
		Parse<Pair, 1>,
		{
			error: "invalid argument for Pair"
			argument: 1
			message: "argument is not a tuple with size 2"
		}
	>
>
type pair_arg_check_1 = Expect<
	Equal<
		Parse<Pair, "11">,
		{
			error: "invalid argument for Pair"
			argument: "11"
			message: "argument is not a tuple with size 2"
		}
	>
>
type pair_arg_check_2 = Expect<
	Equal<
		Parse<Pair, [1]>,
		{
			error: "invalid argument for Pair"
			argument: [1]
			message: "argument is not a tuple with size 2"
		}
	>
>

type pair_arg_check_3 = Expect<
	Equal<
		Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<
			PairKw,
			[LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]
		>
	>
>

type pair_is_parser = Expect<
	Equal<IsParser<Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>

type PairTestParser1 = Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>

type pair_parse_check_0 = Expect<
	Equal<Parse<PairTestParser1, "123">, ParserSuccessResult<["1", "2"], "3">>
>
type pair_parse_check_1 = Expect<
	Equal<
		Parse<PairTestParser1, "">,
		ParserErrorResult<{
			message: "Pair didn't match, first parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 1">
			index: 1
		}>
	>
>
type pair_parse_check_2 = Expect<
	Equal<
		Parse<PairTestParser1, "0">,
		ParserErrorResult<{
			message: "Pair didn't match, first parser didn't match"
			result: ParserErrorResult<"Just didn't match, case 2">
			index: 1
		}>
	>
>

type pair_parse_check_3 = Expect<
	Equal<
		Parse<PairTestParser1, "1">,
		ParserErrorResult<{
			message: "Pair didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<"1", "">,
				ParserErrorResult<"Just didn't match, case 1">
			]
			index: 2
		}>
	>
>
type pair_parse_check_4 = Expect<
	Equal<
		Parse<PairTestParser1, "11">,
		ParserErrorResult<{
			message: "Pair didn't match, second parser didn't match"
			result: [
				ParserSuccessResult<"1", "1">,
				ParserErrorResult<"Just didn't match, case 2">
			]
			index: 2
		}>
	>
>

// eof tests

type eof_is_parser = Expect<Equal<IsParser<EOF>, true>>

type eof_parse_check_0 = Expect<
	Equal<Parse<EOF, "">, ParserSuccessResult<"", "">>
>
type eof_parse_check_1 = Expect<
	Equal<Parse<EOF, "1">, ParserErrorResult<"EOF didn't match">>
>

// pair tests

type choice_arg_check_0 = Expect<
	Equal<
		Parse<Choice, 1>,
		{
			error: "invalid argument for Choice"
			argument: 1
			message: "argument is not an array"
		}
	>
>
type choice_arg_check_1 = Expect<
	Equal<
		Parse<Choice, "11">,
		{
			error: "invalid argument for Choice"
			argument: "11"
			message: "argument is not an array"
		}
	>
>
type choice_arg_check_2 = Expect<
	Equal<
		Parse<Choice, [1]>,
		{
			error: "invalid argument for Choice"
			argument: [1]
			message: {
				message: "argument is not an parser"
				data: 1
			}
		}
	>
>

type choice_arg_check_3 = Expect<
	Equal<
		Parse<Choice, []>,
		{
			error: "invalid argument for Choice"
			argument: []
			message: "argument is an empty array"
		}
	>
>

type choice_arg_check_4 = Expect<
	Equal<
		Parse<Choice, [EOF, 3]>,
		{
			error: "invalid argument for Choice"
			argument: [EOF, 3]
			message: {
				message: "argument is not an parser"
				data: 3
			}
		}
	>
>

type choice_arg_check_5 = Expect<
	Equal<
		Parse<Choice, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<
			ChoiceKw,
			[LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]
		>
	>
>

type choice_is_parser = Expect<
	Equal<IsParser<Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>

type ChoiceTestParser1 = Parse<Choice, [Parse<Just, "1">, Parse<Just, "2">]>

type choice_parse_check_0 = Expect<
	Equal<Parse<ChoiceTestParser1, "123">, ParserSuccessResult<"1", "23">>
>
type choice_parse_check_1 = Expect<
	Equal<
		Parse<ChoiceTestParser1, "">,
		ParserErrorResult<"Choice didn't match, none of the subparsers matched">
	>
>
type choice_parse_check_2 = Expect<
	Equal<
		Parse<ChoiceTestParser1, "0">,
		ParserErrorResult<"Choice didn't match, none of the subparsers matched">
	>
>

type choice_parse_check_3 = Expect<
	Equal<Parse<ChoiceTestParser1, "1">, ParserSuccessResult<"1", "">>
>
type choice_parse_check_4 = Expect<
	Equal<Parse<ChoiceTestParser1, "11">, ParserSuccessResult<"1", "1">>
>

// many0 tests

type many0_arg_check_0 = Expect<
	Equal<
		Parse<Many0, 1>,
		{
			error: "invalid argument for Many0"
			argument: 1
			message: "argument is not an parser"
		}
	>
>
type many0_arg_check_1 = Expect<
	Equal<
		Parse<Many0, "11">,
		{
			error: "invalid argument for Many0"
			argument: "11"
			message: "argument is not an parser"
		}
	>
>
type many0_arg_check_2 = Expect<
	Equal<
		Parse<Many0, [1]>,
		{
			error: "invalid argument for Many0"
			argument: [1]
			message: "argument is not an parser"
		}
	>
>

type many0_arg_check_3 = Expect<
	Equal<
		Parse<Many0, Parse<Just, "1">>,
		LazyOperation<Many0Kw, LazyOperation<JustKw, "1">>
	>
>

type many0_is_parser = Expect<
	Equal<IsParser<Parse<Many0, Parse<Just, "1">>>, true>
>

type Many0TestParser = Parse<Many0, Parse<Just, "1">>

type many0_parse_check_0 = Expect<
	Equal<Parse<Many0TestParser, "123">, ParserSuccessResult<["1"], "23">>
>
type many0_parse_check_1 = Expect<
	Equal<Parse<Many0TestParser, "">, ParserSuccessResult<[], "">>
>
type many0_parse_check_2 = Expect<
	Equal<Parse<Many0TestParser, "0">, ParserSuccessResult<[], "0">>
>

type many0_parse_check_3 = Expect<
	Equal<Parse<Many0TestParser, "1">, ParserSuccessResult<["1"], "">>
>
type many0_parse_check_4 = Expect<
	Equal<Parse<Many0TestParser, "11">, ParserSuccessResult<["1", "1"], "">>
>

// many1 tests

type many1_arg_check_0 = Expect<
	Equal<
		Parse<Many1, 1>,
		{
			error: "invalid argument for Many1"
			argument: 1
			message: "argument is not an parser"
		}
	>
>
type many1_arg_check_1 = Expect<
	Equal<
		Parse<Many1, "11">,
		{
			error: "invalid argument for Many1"
			argument: "11"
			message: "argument is not an parser"
		}
	>
>
type many1_arg_check_2 = Expect<
	Equal<
		Parse<Many1, [1]>,
		{
			error: "invalid argument for Many1"
			argument: [1]
			message: "argument is not an parser"
		}
	>
>

type many1_arg_check_3 = Expect<
	Equal<
		Parse<Many1, Parse<Just, "1">>,
		LazyOperation<Many1Kw, LazyOperation<JustKw, "1">>
	>
>

type many1_is_parser = Expect<
	Equal<IsParser<Parse<Many1, Parse<Just, "1">>>, true>
>

type Many1TestParser = Parse<Many1, Parse<Just, "1">>

type many1_parse_check_0 = Expect<
	Equal<Parse<Many1TestParser, "123">, ParserSuccessResult<["1"], "23">>
>
type many1_parse_check_1 = Expect<
	Equal<
		Parse<Many1TestParser, "">,
		ParserErrorResult<"Many1 didn't match, matched 0 times">
	>
>
type many1_parse_check_2 = Expect<
	Equal<
		Parse<Many1TestParser, "0">,
		ParserErrorResult<"Many1 didn't match, matched 0 times">
	>
>

type many1_parse_check_3 = Expect<
	Equal<Parse<Many1TestParser, "1">, ParserSuccessResult<["1"], "">>
>
type many1_parse_check_4 = Expect<
	Equal<Parse<Many1TestParser, "11">, ParserSuccessResult<["1", "1"], "">>
>

// Mapper Tests

interface ToLiteralMapperTest<T> extends Mapper {
	map: () => T
}

interface ConsumeDataMapperTest extends Mapper {
	map: (
		data: this["data"]
	) => typeof data extends string ? [typeof data, true] : [typeof data, false]
}

type is_mapper_0 = Expect<Equal<IsMapper<ToLiteralMapperTest<null>>, true>>

type is_mapper_1 = Expect<Equal<IsMapper<ConsumeDataMapperTest>, true>>

// map_result tests

type map_result_arg_check_0 = Expect<
	Equal<
		Parse<MapResult, 1>,
		{
			error: "invalid argument for MapResult"
			argument: 1
			message: "argument is not an array"
		}
	>
>
type map_result_arg_check_1 = Expect<
	Equal<
		Parse<MapResult, []>,
		{
			error: "invalid argument for MapResult"
			argument: []
			message: "argument is an empty array"
		}
	>
>
type map_result_arg_check_2 = Expect<
	Equal<
		Parse<MapResult, [1]>,
		{
			error: "invalid argument for MapResult"
			argument: [1]
			message: {
				message: "argument is not an parser"
				data: 1
			}
		}
	>
>

type map_result_arg_check_3 = Expect<
	Equal<
		Parse<MapResult, [Parse<Just, "1">]>,
		{
			error: "invalid argument for MapResult"
			argument: [LazyOperation<"just", "1">]
			message: "argument has no mappers but just one parser"
		}
	>
>

type map_result_arg_check_4 = Expect<
	Equal<
		Parse<MapResult, [Parse<Just, "1">, ToLiteralMapperTest<null>]>,
		LazyOperation<
			MapResultKw,
			[LazyOperation<JustKw, "1">, ToLiteralMapperTest<null>]
		>
	>
>

type map_result_is_parser = Expect<
	Equal<
		IsParser<
			Parse<MapResult, [Parse<Just, "1">, ToLiteralMapperTest<null>]>
		>,
		true
	>
>

type MapResultTestParser1 = Parse<
	MapResult,
	[
		Parse<
			Choice,
			[Parse<Just, "1">, Parse<Seq, [Parse<Just, "2">, Parse<Just, "3">]>]
		>,
		ConsumeDataMapperTest
	]
>

type map_result_parse_check_0 = Expect<
	Equal<
		Parse<MapResultTestParser1, "123">,
		ParserSuccessResult<["1", true], "23">
	>
>
type map_result_parse_check_1 = Expect<
	Equal<
		Parse<MapResultTestParser1, "">,
		ParserErrorResult<"Choice didn't match, none of the subparsers matched">
	>
>
type map_result_parse_check_2 = Expect<
	Equal<
		Parse<MapResultTestParser1, "23_">,
		ParserSuccessResult<[["2", "3"], false], "_">
	>
>

type MapResultTestParser2 = Parse<
	MapResult,
	[Parse<Just, "1">, ToLiteralMapperTest<true>]
>

type map_result_parse_check_3 = Expect<
	Equal<Parse<MapResultTestParser2, "1">, ParserSuccessResult<true, "">>
>
type map_result_parse_check_4 = Expect<
	Equal<Parse<MapResultTestParser2, "11">, ParserSuccessResult<true, "1">>
>

// sepby0 tests

type sepby0_arg_check_0 = Expect<
	Equal<
		Parse<SepBy0, 1>,
		{
			error: "invalid argument for SepBy0"
			argument: 1
			message: "argument is not a tuple with size 2"
		}
	>
>
type sepby0_arg_check_1 = Expect<
	Equal<
		Parse<SepBy0, "11">,
		{
			error: "invalid argument for SepBy0"
			argument: "11"
			message: "argument is not a tuple with size 2"
		}
	>
>
type sepby0_arg_check_2 = Expect<
	Equal<
		Parse<SepBy0, [1]>,
		{
			error: "invalid argument for SepBy0"
			argument: [1]
			message: "argument is not a tuple with size 2"
		}
	>
>

type sepby0_arg_check_3 = Expect<
	Equal<
		Parse<SepBy0, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<
			SepBy0Kw,
			[LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]
		>
	>
>

type sepby0_is_parser = Expect<
	Equal<IsParser<Parse<SepBy0, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>

type SepBy0TestParser = Parse<SepBy0, [Parse<Just, "1">, Parse<Just, ",">]>

type sepby0_parse_check_0 = Expect<
	Equal<Parse<SepBy0TestParser, "123">, ParserSuccessResult<["1"], "23">>
>
type sepby0_parse_check_1 = Expect<
	Equal<Parse<SepBy0TestParser, "">, ParserSuccessResult<[], "">>
>
type sepby0_parse_check_2 = Expect<
	Equal<Parse<SepBy0TestParser, "0">, ParserSuccessResult<[], "0">>
>

type sepby0_parse_check_3 = Expect<
	Equal<Parse<SepBy0TestParser, "1">, ParserSuccessResult<["1"], "">>
>
type sepby0_parse_check_4 = Expect<
	Equal<Parse<SepBy0TestParser, "1,1">, ParserSuccessResult<["1", "1"], "">>
>

// maybe tests

type maybe_arg_check_0 = Expect<
	Equal<
		Parse<Maybe, 1>,
		{
			error: "invalid argument for Maybe"
			argument: 1
			message: "argument is not an parser"
		}
	>
>
type maybe_arg_check_1 = Expect<
	Equal<
		Parse<Maybe, "11">,
		{
			error: "invalid argument for Maybe"
			argument: "11"
			message: "argument is not an parser"
		}
	>
>
type maybe_arg_check_2 = Expect<
	Equal<
		Parse<Maybe, [1]>,
		{
			error: "invalid argument for Maybe"
			argument: [1]
			message: "argument is not an parser"
		}
	>
>

type maybe_arg_check_3 = Expect<
	Equal<
		Parse<Maybe, Parse<Just, "1">>,
		LazyOperation<MaybeKw, LazyOperation<JustKw, "1">>
	>
>

type maybe_is_parser = Expect<
	Equal<IsParser<Parse<Maybe, Parse<Just, "1">>>, true>
>

type MaybeTestParser = Parse<Maybe, Parse<Just, "1">>

type maybe_parse_check_0 = Expect<
	Equal<Parse<MaybeTestParser, "123">, ParserSuccessResult<"1", "23">>
>
type maybe_parse_check_1 = Expect<
	Equal<Parse<MaybeTestParser, "">, ParserSuccessResult<MaybeResult, "">>
>
type maybe_parse_check_2 = Expect<
	Equal<Parse<MaybeTestParser, "0">, ParserSuccessResult<MaybeResult, "0">>
>

type maybe_parse_check_3 = Expect<
	Equal<Parse<MaybeTestParser, "1">, ParserSuccessResult<"1", "">>
>
type maybe_parse_check_4 = Expect<
	Equal<Parse<MaybeTestParser, "11">, ParserSuccessResult<"1", "1">>
>

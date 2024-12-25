import type { Expect, Equal } from "type-testing";

type LazyParserMetadata<T extends string> = {
	metadata: true;
	lazy: true;
	parser: T;
};

type LazyOperation<T, Argument> = [T, Argument];

type ParserResult<T> = { success: boolean; data: T; rest: string };

type ParserErrorResult<Add = undefined> = { success: false; data: null; rest: ""; additional: Add };

type ParserSuccessResult<Data, Rest extends string> = { success: true; data: Data; rest: Rest };

type ParserGeneric<T> = (inp: string) => ParserResult<T>;

type LazyParerImpl = LazyOperation<unknown, unknown>;

type Parser = ParserGeneric<unknown> | LazyParerImpl;

type IsParser<T> = T extends Parser ? true : false;

// parser metadata
type Choice = LazyParserMetadata<"choice">;

type EOF = LazyParserMetadata<"eof">;

type JustKw = "just";
type Just = LazyParserMetadata<JustKw>;

type LeftKw = "left";
type Left = LazyParserMetadata<LeftKw>;

type RightKw = "right";
type Right = LazyParserMetadata<RightKw>;

type SeqKw = "seq";
type Seq = LazyParserMetadata<SeqKw>;

type Many0 = LazyParserMetadata<"many0">;

type Many1 = LazyParserMetadata<"many1">;

type MapResult = LazyParserMetadata<"mapresult">;

type Mapper = LazyParserMetadata<"mapper">;

type Maybe = LazyParserMetadata<"maybe">;

type MaybeResult = LazyParserMetadata<"mayberesult">;

type NoneOf = LazyParserMetadata<"noneof">;

type Pair = LazyParserMetadata<"pair">;

type SepBy0 = LazyParserMetadata<"sepby0">;

// implementations

type IsValidJustArg<T> = T extends string
	? T extends `${infer A}${infer B extends ""}`
		? true
		: "argument length is not 1"
	: "argument is not a string";

type IsValidRLSArg<T> = T extends [infer A, infer B]
	? A extends Parser
		? B extends Parser
			? true
			: "argument 2 is not a parser"
		: "argument 1 is not a parser"
	: "argument is not a tuple with size 2";

type LazyParser<T extends string, Argument> = T extends JustKw
	? IsValidJustArg<Argument> extends true
		? LazyOperation<T, Argument>
		: {
				error: "invalid argument for Just";
				argument: Argument;
				message: IsValidJustArg<Argument>;
			}
	: T extends RightKw
		? IsValidRLSArg<Argument> extends true
			? LazyOperation<T, Argument>
			: {
					error: "invalid argument for Right";
					argument: Argument;
					message: IsValidRLSArg<Argument>;
				}
		: T extends LeftKw
			? IsValidRLSArg<Argument> extends true
				? LazyOperation<T, Argument>
				: {
						error: "invalid argument for Left";
						argument: Argument;
						message: IsValidRLSArg<Argument>;
					}
			: T extends SeqKw
				? IsValidRLSArg<Argument> extends true
					? LazyOperation<T, Argument>
					: {
							error: "invalid argument for Seq";
							argument: Argument;
							message: IsValidRLSArg<Argument>;
						}
				: { todo: 0; data: T; arg: Argument };

type JustApplImpl<Data, Arg> = Arg extends string
	? Arg extends `${infer FirstChar}${infer Rest}`
		? FirstChar extends Data
			? ParserSuccessResult<FirstChar, Rest>
			: ParserErrorResult<"Just didn't match, case 2">
		: ParserErrorResult<"Just didn't match, case 1">
	: ParserErrorResult<"Just didn't match, Arguments didn't match, implementation error">;

type SeqApplImpl<Data, Arg> = Data extends [
	infer Parser1 extends Parser,
	infer Parser2 extends Parser,
]
	? Parse<Parser1, Arg> extends ParserSuccessResult<infer Data1, infer Rest1>
		? Parse<Parser2, Rest1> extends ParserSuccessResult<infer Data2, infer Rest2>
			? ParserSuccessResult<[Data1, Data2], Rest2>
			: ParserErrorResult<{
					message: "Seq didn't match, second parser didn't match";
					result: Parse<Parser2, Rest1>;
				}>
		: ParserErrorResult<{
				message: "Seq didn't match, first parser didn't match";
				result: Parse<Parser1, Arg>;
			}>
	: ParserErrorResult<"Seq didn't match, Arguments didn't match, implementation error">;

type LeftApplImpl<Data, Arg> = SeqApplImpl<Data, Arg> extends ParserSuccessResult<
	infer Data,
	infer Rest
>
	? Data extends [infer Data1, infer Data2]
		? ParserSuccessResult<Data1, Rest>
		: ParserErrorResult<"Left didn't match, Return Arguments from Seq didn't match, implementation error">
	: SeqApplImpl<Data, Arg>;

type RightApplImpl<Data, Arg> = SeqApplImpl<Data, Arg> extends ParserSuccessResult<
	infer Data,
	infer Rest
>
	? Data extends [infer Data1, infer Data2]
		? ParserSuccessResult<Data2, Rest>
		: ParserErrorResult<"Right didn't match, Return Arguments from Seq didn't match, implementation error">
	: SeqApplImpl<Data, Arg>;

type LazyParserAppl<Op, Data, Arg> = Op extends JustKw
	? JustApplImpl<Data, Arg>
	: Op extends SeqKw
		? SeqApplImpl<Data, Arg>
		: Op extends LeftKw
			? LeftApplImpl<Data, Arg>
			: Op extends RightKw
				? RightApplImpl<Data, Arg>
				: {
						todo: 2;
						op: Op;
						data: Data;
						arg: Arg;
					};

type Parse<Operation, Argument> = Operation extends LazyParserMetadata<infer T extends string>
	? LazyParser<T, Argument>
	: Operation extends LazyOperation<infer Op, infer Arg>
		? LazyParserAppl<Op, Arg, Argument>
		: { todo: 1; data: Operation; arg: Argument };

// tests

// just tests
type just_arg_check_0 = Expect<
	Equal<
		Parse<Just, 1>,
		{
			error: "invalid argument for Just";
			argument: 1;
			message: "argument is not a string";
		}
	>
>;
type just_arg_check_1 = Expect<
	Equal<
		Parse<Just, "11">,
		{
			error: "invalid argument for Just";
			argument: "11";
			message: "argument length is not 1";
		}
	>
>;
type just_arg_check_2 = Expect<Equal<Parse<Just, "1">, LazyOperation<JustKw, "1">>>;
type just_arg_check_3 = Expect<Equal<Parse<Just, "1" | "2">, LazyOperation<JustKw, "1" | "2">>>;

type just_is_parser = Expect<Equal<IsParser<Parse<Just, "1">>, true>>;

type JustTestParser1 = Parse<Just, "a">;

type just_parse_check_0 = Expect<
	Equal<Parse<JustTestParser1, "abb">, ParserSuccessResult<"a", "bb">>
>;
type just_parse_check_1 = Expect<
	Equal<Parse<JustTestParser1, "cbb">, ParserErrorResult<"Just didn't match, case 2">>
>;
type just_parse_check_2 = Expect<
	Equal<Parse<JustTestParser1, "">, ParserErrorResult<"Just didn't match, case 1">>
>;

type JustTestParser2 = Parse<Just, "a" | "b">;

type just_parse_check_3 = Expect<
	Equal<Parse<JustTestParser2, "ac">, ParserSuccessResult<"a", "c">>
>;
type just_parse_check_4 = Expect<
	Equal<Parse<JustTestParser2, "bc">, ParserSuccessResult<"b", "c">>
>;

// seq checks

type seq_arg_check_0 = Expect<
	Equal<
		Parse<Seq, 1>,
		{
			error: "invalid argument for Seq";
			argument: 1;
			message: "argument is not a tuple with size 2";
		}
	>
>;
type seq_arg_check_1 = Expect<
	Equal<
		Parse<Seq, "11">,
		{
			error: "invalid argument for Seq";
			argument: "11";
			message: "argument is not a tuple with size 2";
		}
	>
>;
type seq_arg_check_2 = Expect<
	Equal<
		Parse<Seq, [1]>,
		{
			error: "invalid argument for Seq";
			argument: [1];
			message: "argument is not a tuple with size 2";
		}
	>
>;

type seq_arg_check_3 = Expect<
	Equal<
		Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<SeqKw, [LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]>
	>
>;

type seq_is_parser = Expect<
	Equal<IsParser<Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>;

type SeqTestParser1 = Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">]>;

type seq_parse_check_0 = Expect<
	Equal<Parse<SeqTestParser1, "123">, ParserSuccessResult<["1", "2"], "3">>
>;
type seq_parse_check_1 = Expect<
	Equal<
		Parse<SeqTestParser1, "">,
		ParserErrorResult<{
			message: "Seq didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type seq_parse_check_2 = Expect<
	Equal<
		Parse<SeqTestParser1, "0">,
		ParserErrorResult<{
			message: "Seq didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

type seq_parse_check_3 = Expect<
	Equal<
		Parse<SeqTestParser1, "1">,
		ParserErrorResult<{
			message: "Seq didn't match, second parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type seq_parse_check_4 = Expect<
	Equal<
		Parse<SeqTestParser1, "11">,
		ParserErrorResult<{
			message: "Seq didn't match, second parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

// right checks

type right_arg_check_0 = Expect<
	Equal<
		Parse<Right, 1>,
		{
			error: "invalid argument for Right";
			argument: 1;
			message: "argument is not a tuple with size 2";
		}
	>
>;
type right_arg_check_1 = Expect<
	Equal<
		Parse<Right, "11">,
		{
			error: "invalid argument for Right";
			argument: "11";
			message: "argument is not a tuple with size 2";
		}
	>
>;
type right_arg_check_2 = Expect<
	Equal<
		Parse<Right, [1]>,
		{
			error: "invalid argument for Right";
			argument: [1];
			message: "argument is not a tuple with size 2";
		}
	>
>;

type right_arg_check_3 = Expect<
	Equal<
		Parse<Right, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<RightKw, [LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]>
	>
>;

type right_is_parser = Expect<
	Equal<IsParser<Parse<Right, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>;

type RightTestParser1 = Parse<Right, [Parse<Just, "1">, Parse<Just, "2">]>;

type right_parse_check_0 = Expect<
	Equal<Parse<RightTestParser1, "123">, ParserSuccessResult<"2", "3">>
>;
type right_parse_check_1 = Expect<
	Equal<
		Parse<RightTestParser1, "">,
		ParserErrorResult<{
			message: "Seq didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type right_parse_check_2 = Expect<
	Equal<
		Parse<RightTestParser1, "0">,
		ParserErrorResult<{
			message: "Seq didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

type right_parse_check_3 = Expect<
	Equal<
		Parse<RightTestParser1, "1">,
		ParserErrorResult<{
			message: "Seq didn't match, second parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type right_parse_check_4 = Expect<
	Equal<
		Parse<RightTestParser1, "11">,
		ParserErrorResult<{
			message: "Seq didn't match, second parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

// left checks

type left_arg_check_0 = Expect<
	Equal<
		Parse<Left, 1>,
		{
			error: "invalid argument for Left";
			argument: 1;
			message: "argument is not a tuple with size 2";
		}
	>
>;
type left_arg_check_1 = Expect<
	Equal<
		Parse<Left, "11">,
		{
			error: "invalid argument for Left";
			argument: "11";
			message: "argument is not a tuple with size 2";
		}
	>
>;
type left_arg_check_2 = Expect<
	Equal<
		Parse<Left, [1]>,
		{
			error: "invalid argument for Left";
			argument: [1];
			message: "argument is not a tuple with size 2";
		}
	>
>;

type left_arg_check_3 = Expect<
	Equal<
		Parse<Left, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<LeftKw, [LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]>
	>
>;

type left_is_parser = Expect<
	Equal<IsParser<Parse<Left, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>;

type LeftTestParser1 = Parse<Left, [Parse<Just, "1">, Parse<Just, "2">]>;

type left_parse_check_0 = Expect<
	Equal<Parse<LeftTestParser1, "123">, ParserSuccessResult<"1", "3">>
>;
type left_parse_check_1 = Expect<
	Equal<
		Parse<LeftTestParser1, "">,
		ParserErrorResult<{
			message: "Seq didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type left_parse_check_2 = Expect<
	Equal<
		Parse<LeftTestParser1, "0">,
		ParserErrorResult<{
			message: "Seq didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

type left_parse_check_3 = Expect<
	Equal<
		Parse<LeftTestParser1, "1">,
		ParserErrorResult<{
			message: "Seq didn't match, second parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type left_parse_check_4 = Expect<
	Equal<
		Parse<LeftTestParser1, "11">,
		ParserErrorResult<{
			message: "Seq didn't match, second parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

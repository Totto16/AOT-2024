import type { Expect, Equal, NotEqual } from "type-testing";

type LazyParserMetadata<T extends string> = {
	metadata: true;
	lazy: true;
	parser: T;
};

type LazyOperation<T, Argument> = { parser: true; op: T; arg: Argument };

type ParserResult<T> = { success: boolean; data: T; rest: string };

type ParserErrorResult<Add = undefined> = { success: false; data: null; rest: ""; additional: Add };

type ParserSuccessResult<Data, Rest extends string> = { success: true; data: Data; rest: Rest };

type ParserGeneric<T> = (inp: string) => ParserResult<T>;

type LazyParserImpl = LazyOperation<unknown, unknown>;

type Parser = ParserGeneric<unknown> | LazyParserImpl | (() => LazyParserImpl);

type IsParser<T> = T extends Parser ? true : false;

type IsMapper<T> = T extends Mapper ? true : false;

// parser metadata
type ChoiceKw = "choice";
type Choice = LazyParserMetadata<ChoiceKw>;

type EOFKw = "eof";
type EOF = LazyOperation<EOFKw, "">;

type JustKw = "just";
type Just = LazyParserMetadata<JustKw>;

type NoneOfKw = "noneof";
type NoneOf = LazyParserMetadata<NoneOfKw>;

type LeftKw = "left";
type Left = LazyParserMetadata<LeftKw>;

type RightKw = "right";
type Right = LazyParserMetadata<RightKw>;

type SeqKw = "seq";
type Seq = LazyParserMetadata<SeqKw>;

type PairKw = "pair";
type Pair = LazyParserMetadata<PairKw>;

type Many0Kw = "many0";
type Many0 = LazyParserMetadata<Many0Kw>;

type Many1Kw = "many1";
type Many1 = LazyParserMetadata<Many1Kw>;

type MapResultKw = "mapresult";
type MapResult = LazyParserMetadata<MapResultKw>;

type MapperFunction<T, A> = (data: T) => A;

interface MapperImpl<T, A> {
	data: T;
	map: MapperFunction<T, A>;
}

type Mapper = MapperImpl<unknown, unknown>;

type SepBy0Kw = "sepby0";
type SepBy0 = LazyParserMetadata<SepBy0Kw>;

type Maybe = LazyParserMetadata<"maybe">;

type MaybeResult = LazyParserMetadata<"mayberesult">;

// implementations

// this is for some bad tests cases
type StrictMap = {
	[key in JustKw]: false;
} & {
	[key in NoneOfKw]: true;
} & {
	[key in SeqKw]: false;
} & {
	[key in LeftKw]: true;
} & {
	[key in RightKw]: true;
} & {
	[key in PairKw]: true;
} & {
	[key in SepBy0Kw]: true;
};

type IsValidTokenArg<T, Strict extends boolean> = Strict extends true
	? IsValidTokenArgStrict<T>
	: IsValidTokenArgNonStrict<T>;

// this is for some non changebale test cases, that do not fullfill this requirements :(
type IsValidTokenArgNonStrict<T> = true;

type IsValidTokenArgStrict<T> = T extends string
	? T extends `${infer A}${infer B extends ""}`
		? true
		: "argument length is not 1"
	: "argument is not a string";

type IsValidTupleArg<T, Strict extends boolean> = Strict extends true
	? IsValidTupleArgStrict<T>
	: IsValidTupleArgNonStrict<T>;

// this is for some non changebale test cases, that do not fullfill this requirements :(
type IsValidTupleArgNonStrict<T> = T extends Parser[]
	? true
	: "argument is not an array of Parsers";

type IsValidTupleArgStrict<T> = T extends [infer A, infer B]
	? A extends Parser
		? B extends Parser
			? true
			: "argument 2 is not a parser"
		: "argument 1 is not a parser"
	: "argument is not a tuple with size 2";

type AreAllParsers<T extends unknown[]> = T extends []
	? true
	: T extends [infer FirstElem, ...infer Rest]
		? FirstElem extends Parser
			? AreAllParsers<Rest>
			: { message: "argument is not an parser"; data: FirstElem }
		: true;

type IsValidChoiceArg<T> = T extends unknown[]
	? T extends [infer FirstElem, ...infer Rest]
		? FirstElem extends Parser
			? AreAllParsers<Rest>
			: { message: "argument is not an parser"; data: FirstElem }
		: "argument is an empty array"
	: "argument is not an array";

type IsValidManyArg<T> = T extends Parser ? true : "argument is not an parser";

type AreAllMappers<T extends unknown[]> = T extends []
	? true
	: T extends [infer FirstElem, ...infer Rest]
		? FirstElem extends Mapper
			? AreAllMappers<Rest>
			: { message: "argument is not a Mapper"; data: FirstElem }
		: true;

type IsValidMapResultArg<T> = T extends unknown[]
	? T extends [infer Pars, ...infer Rest]
		? Pars extends Parser
			? Rest extends [infer _1, ...infer _2]
				? AreAllMappers<Rest>
				: "argument has no mappers but just one parser"
			: { message: "argument is not an parser"; data: Pars }
		: "argument is an empty array"
	: "argument is not an array";

type LazyParser<T extends string, Argument> = T extends JustKw
	? IsValidTokenArg<Argument, StrictMap[JustKw]> extends true
		? LazyOperation<T, Argument>
		: {
				error: "invalid argument for Just";
				argument: Argument;
				message: IsValidTokenArg<Argument, StrictMap[JustKw]>;
			}
	: T extends NoneOfKw
		? IsValidTokenArg<Argument, StrictMap[NoneOfKw]> extends true
			? LazyOperation<T, Argument>
			: {
					error: "invalid argument for NoneOf";
					argument: Argument;
					message: IsValidTokenArg<Argument, StrictMap[NoneOfKw]>;
				}
		: T extends RightKw
			? IsValidTupleArg<Argument, StrictMap[RightKw]> extends true
				? LazyOperation<T, Argument>
				: {
						error: "invalid argument for Right";
						argument: Argument;
						message: IsValidTupleArg<Argument, StrictMap[RightKw]>;
					}
			: T extends LeftKw
				? IsValidTupleArg<Argument, StrictMap[LeftKw]> extends true
					? LazyOperation<T, Argument>
					: {
							error: "invalid argument for Left";
							argument: Argument;
							message: IsValidTupleArg<Argument, StrictMap[LeftKw]>;
						}
				: T extends SeqKw
					? IsValidTupleArg<Argument, StrictMap[SeqKw]> extends true
						? LazyOperation<T, Argument>
						: {
								error: "invalid argument for Seq";
								argument: Argument;
								message: IsValidTupleArg<Argument, StrictMap[SeqKw]>;
							}
					: T extends PairKw
						? IsValidTupleArg<Argument, StrictMap[PairKw]> extends true
							? LazyOperation<T, Argument>
							: {
									error: "invalid argument for Pair";
									argument: Argument;
									message: IsValidTupleArg<Argument, StrictMap[PairKw]>;
								}
						: T extends ChoiceKw
							? IsValidChoiceArg<Argument> extends true
								? LazyOperation<T, Argument>
								: {
										error: "invalid argument for Choice";
										argument: Argument;
										message: IsValidChoiceArg<Argument>;
									}
							: T extends Many0Kw
								? IsValidManyArg<Argument> extends true
									? LazyOperation<T, Argument>
									: {
											error: "invalid argument for Many0";
											argument: Argument;
											message: IsValidManyArg<Argument>;
										}
								: T extends Many1Kw
									? IsValidManyArg<Argument> extends true
										? LazyOperation<T, Argument>
										: {
												error: "invalid argument for Many1";
												argument: Argument;
												message: IsValidManyArg<Argument>;
											}
									: T extends MapResultKw
										? IsValidMapResultArg<Argument> extends true
											? LazyOperation<T, Argument>
											: {
													error: "invalid argument for MapResult";
													argument: Argument;
													message: IsValidMapResultArg<Argument>;
												}
										: T extends SepBy0Kw
											? IsValidTupleArg<Argument, StrictMap[SepBy0Kw]> extends true
												? LazyOperation<T, Argument>
												: {
														error: "invalid argument for SepBy0";
														argument: Argument;
														message: IsValidTupleArg<Argument, StrictMap[SepBy0Kw]>;
													}
											: { todo: 0; data: T; arg: Argument };

type JustApplImpl<Data, Arg> = Arg extends string
	? Arg extends `${infer FirstChar}${infer Rest}`
		? FirstChar extends Data
			? ParserSuccessResult<FirstChar, Rest>
			: ParserErrorResult<"Just didn't match, case 2">
		: ParserErrorResult<"Just didn't match, case 1">
	: ParserErrorResult<"Just didn't match, Arguments didn't match, implementation error">;

type NoneOfApplImpl<Data, Arg> = Arg extends string
	? Arg extends `${infer FirstChar}${infer Rest}`
		? FirstChar extends Data
			? ParserErrorResult<"NoneOf didn't match, case 2">
			: ParserSuccessResult<FirstChar, Rest>
		: ParserErrorResult<"NoneOf didn't match, case 1">
	: ParserErrorResult<"NoneOf didn't match, Arguments didn't match, implementation error">;

type SeqApplImpl<Data, Arg, Strict extends boolean> = Strict extends true
	? SeqApplImplStrict<Data, Arg>
	: SeqApplImplNonStrict<Data, Arg>;

// this is for some non changebale test cases, that do not fullfill this requirements :(

type SeqApplImplNonStrict<Data, Arg, Acc extends unknown[] = []> = Arg extends string
	? Data extends []
		? ParserSuccessResult<Acc, Arg>
		: Data extends [infer Parser1 extends Parser, ...infer RestParsers extends Parser[]]
			? Parse<Parser1, Arg> extends ParserSuccessResult<infer Data1, infer Rest1>
				? SeqApplImplNonStrict<RestParsers, Rest1, [...Acc, Data1]>
				: ParserErrorResult<{
						message: "Seq didn't match, parser didn't match";
						result: Parse<Parser1, Arg>;
					}>
			: ParserErrorResult<"Seq didn't match, Arguments didn't match, implementation error">
	: ParserErrorResult<"Seq didn't match, Arguments didn't match, implementation error, arg not a string">;

type SeqApplImplStrict<Data, Arg> = Data extends [
	infer Parser1 extends Parser,
	infer Parser2 extends Parser,
]
	? Parse<Parser1, Arg> extends ParserSuccessResult<infer Data1, infer Rest1>
		? Parse<Parser2, Rest1> extends ParserSuccessResult<infer Data2, infer Rest2>
			? ParserSuccessResult<[Data1, Data2], Rest2>
			: ParserErrorResult<{
					message: "Seq didn't match, second parser didn't match";
					result: [Parse<Parser1, Arg>, Parse<Parser2, Rest1>];
					index: 2;
				}>
		: ParserErrorResult<{
				message: "Seq didn't match, first parser didn't match";
				result: Parse<Parser1, Arg>;
				index: 1;
			}>
	: ParserErrorResult<"Seq didn't match, Arguments didn't match, implementation error">;

type LeftApplImpl<Data, Arg> = SeqApplImpl<
	Data,
	Arg,
	StrictMap[LeftKw]
> extends ParserSuccessResult<infer Data, infer Rest>
	? Data extends [infer Data1, infer Data2]
		? ParserSuccessResult<Data1, Rest>
		: ParserErrorResult<"Left didn't match, return arguments from Seq didn't match, implementation error">
	: SeqApplImpl<Data, Arg, StrictMap[LeftKw]> extends ParserErrorResult<infer Add>
		? Add extends {
				message: infer Mes extends string;
				result: infer Res;
				index: infer Idx;
			}
			? Mes extends `Seq${infer RestMes}`
				? ParserErrorResult<{ message: `Left${RestMes}`; result: Res; index: Idx }>
				: ParserErrorResult<Add>
			: ParserErrorResult<"Left didn't match, error message from Seq didn't match, implementation error">
		: ParserErrorResult<"Left didn't match, not a valid ParserResult, implementation error">;

type RightApplImpl<Data, Arg> = SeqApplImpl<
	Data,
	Arg,
	StrictMap[RightKw]
> extends ParserSuccessResult<infer Data, infer Rest>
	? Data extends [infer Data1, infer Data2]
		? ParserSuccessResult<Data2, Rest>
		: ParserErrorResult<"Right didn't match, return arguments from Seq didn't match, implementation error">
	: SeqApplImpl<Data, Arg, StrictMap[RightKw]> extends ParserErrorResult<infer Add>
		? Add extends {
				message: infer Mes extends string;
				result: infer Res;
				index: infer Idx;
			}
			? Mes extends `Seq${infer RestMes}`
				? ParserErrorResult<{ message: `Right${RestMes}`; result: Res; index: Idx }>
				: ParserErrorResult<Add>
			: ParserErrorResult<"Right didn't match, error message from Seq didn't match, implementation error">
		: ParserErrorResult<"Right didn't match, not a valid ParserResult, implementation error">;

type PairApplImpl<Data, Arg> = SeqApplImpl<
	Data,
	Arg,
	StrictMap[PairKw]
> extends ParserSuccessResult<infer Data, infer Rest>
	? Data extends [infer Data1 extends string, infer Data2 extends string]
		? ParserSuccessResult<`${Data1}${Data2}`, Rest>
		: ParserErrorResult<"Pair didn't match, return arguments from Seq didn't match, implementation error">
	: SeqApplImpl<Data, Arg, StrictMap[PairKw]> extends ParserErrorResult<infer Add>
		? Add extends {
				message: infer Mes extends string;
				result: infer Res;
				index: infer Idx;
			}
			? Mes extends `Seq${infer RestMes}`
				? ParserErrorResult<{ message: `Pair${RestMes}`; result: Res; index: Idx }>
				: ParserErrorResult<Add>
			: ParserErrorResult<"Pair didn't match, error message from Seq didn't match, implementation error">
		: ParserErrorResult<"Pair didn't match, not a valid ParserResult, implementation error">;

type EOFApplImpl<Data, Arg> = Data extends ""
	? Arg extends ""
		? ParserSuccessResult<"", "">
		: ParserErrorResult<"EOF didn't match">
	: ParserErrorResult<"EOF didn't match, not a valid argument, implementation error">;

type ChoiceApplImpl<Data, Arg> = Data extends Array<Parser>
	? Data extends []
		? ParserErrorResult<"Choice didn't match, none of the subparsers matched">
		: Data extends [infer Parser1, ...infer RestParsers]
			? Parse<Parser1, Arg> extends ParserSuccessResult<infer Data1, infer Rest1>
				? ParserSuccessResult<Data1, Rest1>
				: ChoiceApplImpl<RestParsers, Arg>
			: ParserErrorResult<"Choice didn't match, unreachable case: reason, [] already checked">
	: ParserErrorResult<"Choice didn't match, Arguments didn't match, implementation error">;

type ManyGeneralApplImpl<Pars extends Parser, Arg extends string, Acc extends unknown[]> = Parse<
	Pars,
	Arg
> extends ParserSuccessResult<infer Data, infer Rest>
	? ManyGeneralApplImpl<Pars, Rest, [...Acc, Data]>
	: ParserSuccessResult<Acc, Arg>;

type Many0ApplImpl<Data, Arg> = Data extends Parser
	? Arg extends string
		? ManyGeneralApplImpl<Data, Arg, []>
		: ParserErrorResult<"Many0 didn't match, Arguments didn't match, implementation error 2">
	: ParserErrorResult<"Many0 didn't match, Arguments didn't match, implementation error 1">;

type Many1ApplImpl<Data, Arg> = Data extends Parser
	? Arg extends string
		? Parse<Data, Arg> extends ParserSuccessResult<infer Data1, infer Rest1>
			? ManyGeneralApplImpl<Data, Rest1, [Data1]>
			: ParserErrorResult<"Many1 didn't match, matched 0 times">
		: ParserErrorResult<"Many1 didn't match, Arguments didn't match, implementation error 2">
	: ParserErrorResult<"Many1 didn't match, Arguments didn't match, implementation error 1">;

type MapSingleMapperImpl<Type, M extends Mapper> = ReturnType<(M & { data: Type })["map"]>;

type MapMappersImpl<Initial, Mappers extends Mapper[]> = Mappers extends []
	? Initial
	: Mappers extends [infer Mapper1 extends Mapper, ...infer RestMappers extends Mapper[]]
		? MapMappersImpl<MapSingleMapperImpl<Initial, Mapper1>, RestMappers>
		: Initial;

type MapResultApplImpl<Data, Arg> = Data extends unknown[]
	? Data extends [infer Pars extends Parser, ...infer Mappers extends Mapper[]]
		? Parse<Pars, Arg> extends ParserSuccessResult<infer Data1, infer Rest1>
			? ParserSuccessResult<MapMappersImpl<Data1, Mappers>, Rest1>
			: Parse<Pars, Arg>
		: ParserErrorResult<"MapResult didn't match, Arguments didn't match, implementation error 2">
	: ParserErrorResult<"MapResult didn't match, Arguments didn't match, implementation error 1">;

interface SepBy0DataGetterMapper extends Mapper {
	map: (
		data: this["data"],
	) => typeof data extends [infer SepResult, infer ActualResult]
		? ActualResult
		: { error: "implementation error in SepBy0 implemenatation" };
}

type SepBy0ApplImpl<Data, Arg> = Data extends [
	infer ContentParser extends Parser,
	infer SepParser extends Parser,
]
	? Arg extends string
		? Parse<ContentParser, Arg> extends ParserSuccessResult<infer Data1, infer Rest1>
			? Parse<
					Parse<
						Many0,
						Parse<MapResult, [Parse<Seq, [SepParser, ContentParser]>, SepBy0DataGetterMapper]>
					>,
					Rest1
				> extends ParserSuccessResult<infer Data2, infer Rest2>
				? Data2 extends unknown[]
					? ParserSuccessResult<[Data1, ...Data2], Rest2>
					: ParserErrorResult<"SepBy0 didn't match, invalid internal parser result, is not an array, implementation error">
				: ParserErrorResult<"SepBy0 didn't match, invalid internal parser result, Many0 should always match, implementation error">
			: ParserSuccessResult<[], Arg>
		: ParserErrorResult<"SepBy0 didn't match, invalid arguments, implementation error, arg is not a string">
	: ParserErrorResult<"SepBy0 didn't match, invalid arguments, implementation error, data is not a tuple of parsers">;

type LazyParserAppl<Op, Data, Arg> = Op extends JustKw
	? JustApplImpl<Data, Arg>
	: Op extends NoneOfKw
		? NoneOfApplImpl<Data, Arg>
		: Op extends SeqKw
			? SeqApplImpl<Data, Arg, StrictMap[SeqKw]>
			: Op extends LeftKw
				? LeftApplImpl<Data, Arg>
				: Op extends RightKw
					? RightApplImpl<Data, Arg>
					: Op extends PairKw
						? PairApplImpl<Data, Arg>
						: Op extends EOFKw
							? EOFApplImpl<Data, Arg>
							: Op extends ChoiceKw
								? ChoiceApplImpl<Data, Arg>
								: Op extends Many0Kw
									? Many0ApplImpl<Data, Arg>
									: Op extends Many1Kw
										? Many1ApplImpl<Data, Arg>
										: Op extends MapResultKw
											? MapResultApplImpl<Data, Arg>
											: Op extends SepBy0Kw
												? SepBy0ApplImpl<Data, Arg>
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
	NotEqual<
		Parse<Just, 1>,
		{
			error: "invalid argument for Just";
			argument: 1;
			message: "argument is not a string";
		}
	>
>;

type just_arg_check_1 = Expect<
	NotEqual<
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

// noneof tests

type none_of_arg_check_0 = Expect<
	Equal<
		Parse<NoneOf, 1>,
		{
			error: "invalid argument for NoneOf";
			argument: 1;
			message: "argument is not a string";
		}
	>
>;
type none_of_arg_check_1 = Expect<
	Equal<
		Parse<NoneOf, "11">,
		{
			error: "invalid argument for NoneOf";
			argument: "11";
			message: "argument length is not 1";
		}
	>
>;
type none_of_arg_check_2 = Expect<Equal<Parse<NoneOf, "1">, LazyOperation<NoneOfKw, "1">>>;
type none_of_arg_check_3 = Expect<
	Equal<Parse<NoneOf, "1" | "2">, LazyOperation<NoneOfKw, "1" | "2">>
>;

type none_of_is_parser = Expect<Equal<IsParser<Parse<NoneOf, "1">>, true>>;

type NoneOfTestParser1 = Parse<NoneOf, "a">;

type none_of_parse_check_0 = Expect<
	Equal<Parse<NoneOfTestParser1, "gbb">, ParserSuccessResult<"g", "bb">>
>;
type none_of_parse_check_1 = Expect<
	Equal<Parse<NoneOfTestParser1, "abb">, ParserErrorResult<"NoneOf didn't match, case 2">>
>;
type none_of_parse_check_2 = Expect<
	Equal<Parse<NoneOfTestParser1, "">, ParserErrorResult<"NoneOf didn't match, case 1">>
>;

type NoneOfTestParser2 = Parse<NoneOf, "a" | "b">;

type none_of_parse_check_3 = Expect<
	Equal<Parse<NoneOfTestParser2, "ca">, ParserSuccessResult<"c", "a">>
>;
type none_of_parse_check_4 = Expect<
	Equal<Parse<NoneOfTestParser2, "cb">, ParserSuccessResult<"c", "b">>
>;
type none_of_parse_check_5 = Expect<
	Equal<Parse<NoneOfTestParser2, "aff">, ParserErrorResult<"NoneOf didn't match, case 2">>
>;

type none_of_parse_check_6 = Expect<
	Equal<Parse<NoneOfTestParser2, "bff">, ParserErrorResult<"NoneOf didn't match, case 2">>
>;

// seq tests

type seq_arg_check_0 = Expect<
	Equal<
		Parse<Seq, 1>,
		{
			error: "invalid argument for Seq";
			argument: 1;
			message: "argument is not an array of Parsers";
		}
	>
>;
type seq_arg_check_1 = Expect<
	Equal<
		Parse<Seq, "11">,
		{
			error: "invalid argument for Seq";
			argument: "11";
			message: "argument is not an array of Parsers";
		}
	>
>;
type seq_arg_check_2 = Expect<
	Equal<
		Parse<Seq, [1]>,
		{
			error: "invalid argument for Seq";
			argument: [1];
			message: "argument is not an array of Parsers";
		}
	>
>;

type seq_arg_check_3 = Expect<
	Equal<
		Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<SeqKw, [LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]>
	>
>;

type seq_arg_check_4 = Expect<
	Equal<
		Parse<Seq, [Parse<Just, "1">, Parse<Just, "2">, Parse<Just, "3">]>,
		LazyOperation<
			SeqKw,
			[LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">, LazyOperation<JustKw, "3">]
		>
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
			message: "Seq didn't match, parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type seq_parse_check_2 = Expect<
	Equal<
		Parse<SeqTestParser1, "0">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

type seq_parse_check_3 = Expect<
	Equal<
		Parse<SeqTestParser1, "1">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
		}>
	>
>;
type seq_parse_check_4 = Expect<
	Equal<
		Parse<SeqTestParser1, "11">,
		ParserErrorResult<{
			message: "Seq didn't match, parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
		}>
	>
>;

// right tests

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
			message: "Right didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
			index: 1;
		}>
	>
>;
type right_parse_check_2 = Expect<
	Equal<
		Parse<RightTestParser1, "0">,
		ParserErrorResult<{
			message: "Right didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
			index: 1;
		}>
	>
>;

type right_parse_check_3 = Expect<
	Equal<
		Parse<RightTestParser1, "1">,
		ParserErrorResult<{
			message: "Right didn't match, second parser didn't match";
			result: [ParserSuccessResult<"1", "">, ParserErrorResult<"Just didn't match, case 1">];
			index: 2;
		}>
	>
>;
type right_parse_check_4 = Expect<
	Equal<
		Parse<RightTestParser1, "11">,
		ParserErrorResult<{
			message: "Right didn't match, second parser didn't match";
			result: [ParserSuccessResult<"1", "1">, ParserErrorResult<"Just didn't match, case 2">];
			index: 2;
		}>
	>
>;

// left tests

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
			message: "Left didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
			index: 1;
		}>
	>
>;
type left_parse_check_2 = Expect<
	Equal<
		Parse<LeftTestParser1, "0">,
		ParserErrorResult<{
			message: "Left didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
			index: 1;
		}>
	>
>;

type left_parse_check_3 = Expect<
	Equal<
		Parse<LeftTestParser1, "1">,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match";
			result: [ParserSuccessResult<"1", "">, ParserErrorResult<"Just didn't match, case 1">];
			index: 2;
		}>
	>
>;
type left_parse_check_4 = Expect<
	Equal<
		Parse<LeftTestParser1, "11">,
		ParserErrorResult<{
			message: "Left didn't match, second parser didn't match";
			result: [ParserSuccessResult<"1", "1">, ParserErrorResult<"Just didn't match, case 2">];
			index: 2;
		}>
	>
>;

// pair tests

type pair_arg_check_0 = Expect<
	Equal<
		Parse<Pair, 1>,
		{
			error: "invalid argument for Pair";
			argument: 1;
			message: "argument is not a tuple with size 2";
		}
	>
>;
type pair_arg_check_1 = Expect<
	Equal<
		Parse<Pair, "11">,
		{
			error: "invalid argument for Pair";
			argument: "11";
			message: "argument is not a tuple with size 2";
		}
	>
>;
type pair_arg_check_2 = Expect<
	Equal<
		Parse<Pair, [1]>,
		{
			error: "invalid argument for Pair";
			argument: [1];
			message: "argument is not a tuple with size 2";
		}
	>
>;

type pair_arg_check_3 = Expect<
	Equal<
		Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<PairKw, [LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]>
	>
>;

type pair_is_parser = Expect<
	Equal<IsParser<Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>;

type PairTestParser1 = Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>;

type pair_parse_check_0 = Expect<
	Equal<Parse<PairTestParser1, "123">, ParserSuccessResult<"12", "3">>
>;
type pair_parse_check_1 = Expect<
	Equal<
		Parse<PairTestParser1, "">,
		ParserErrorResult<{
			message: "Pair didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 1">;
			index: 1;
		}>
	>
>;
type pair_parse_check_2 = Expect<
	Equal<
		Parse<PairTestParser1, "0">,
		ParserErrorResult<{
			message: "Pair didn't match, first parser didn't match";
			result: ParserErrorResult<"Just didn't match, case 2">;
			index: 1;
		}>
	>
>;

type pair_parse_check_3 = Expect<
	Equal<
		Parse<PairTestParser1, "1">,
		ParserErrorResult<{
			message: "Pair didn't match, second parser didn't match";
			result: [ParserSuccessResult<"1", "">, ParserErrorResult<"Just didn't match, case 1">];
			index: 2;
		}>
	>
>;
type pair_parse_check_4 = Expect<
	Equal<
		Parse<PairTestParser1, "11">,
		ParserErrorResult<{
			message: "Pair didn't match, second parser didn't match";
			result: [ParserSuccessResult<"1", "1">, ParserErrorResult<"Just didn't match, case 2">];
			index: 2;
		}>
	>
>;

// eof tests

type eof_is_parser = Expect<Equal<IsParser<EOF>, true>>;

type eof_parse_check_0 = Expect<Equal<Parse<EOF, "">, ParserSuccessResult<"", "">>>;
type eof_parse_check_1 = Expect<Equal<Parse<EOF, "1">, ParserErrorResult<"EOF didn't match">>>;

// pair tests

type choice_arg_check_0 = Expect<
	Equal<
		Parse<Choice, 1>,
		{
			error: "invalid argument for Choice";
			argument: 1;
			message: "argument is not an array";
		}
	>
>;
type choice_arg_check_1 = Expect<
	Equal<
		Parse<Choice, "11">,
		{
			error: "invalid argument for Choice";
			argument: "11";
			message: "argument is not an array";
		}
	>
>;
type choice_arg_check_2 = Expect<
	Equal<
		Parse<Choice, [1]>,
		{
			error: "invalid argument for Choice";
			argument: [1];
			message: {
				message: "argument is not an parser";
				data: 1;
			};
		}
	>
>;

type choice_arg_check_3 = Expect<
	Equal<
		Parse<Choice, []>,
		{
			error: "invalid argument for Choice";
			argument: [];
			message: "argument is an empty array";
		}
	>
>;

type choice_arg_check_4 = Expect<
	Equal<
		Parse<Choice, [EOF, 3]>,
		{
			error: "invalid argument for Choice";
			argument: [EOF, 3];
			message: {
				message: "argument is not an parser";
				data: 3;
			};
		}
	>
>;

type choice_arg_check_5 = Expect<
	Equal<
		Parse<Choice, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<ChoiceKw, [LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]>
	>
>;

type choice_is_parser = Expect<
	Equal<IsParser<Parse<Pair, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>;

type ChoiceTestParser1 = Parse<Choice, [Parse<Just, "1">, Parse<Just, "2">]>;

type choice_parse_check_0 = Expect<
	Equal<Parse<ChoiceTestParser1, "123">, ParserSuccessResult<"1", "23">>
>;
type choice_parse_check_1 = Expect<
	Equal<
		Parse<ChoiceTestParser1, "">,
		ParserErrorResult<"Choice didn't match, none of the subparsers matched">
	>
>;
type choice_parse_check_2 = Expect<
	Equal<
		Parse<ChoiceTestParser1, "0">,
		ParserErrorResult<"Choice didn't match, none of the subparsers matched">
	>
>;

type choice_parse_check_3 = Expect<
	Equal<Parse<ChoiceTestParser1, "1">, ParserSuccessResult<"1", "">>
>;
type choice_parse_check_4 = Expect<
	Equal<Parse<ChoiceTestParser1, "11">, ParserSuccessResult<"1", "1">>
>;

// many0 tests

type many0_arg_check_0 = Expect<
	Equal<
		Parse<Many0, 1>,
		{
			error: "invalid argument for Many0";
			argument: 1;
			message: "argument is not an parser";
		}
	>
>;
type many0_arg_check_1 = Expect<
	Equal<
		Parse<Many0, "11">,
		{
			error: "invalid argument for Many0";
			argument: "11";
			message: "argument is not an parser";
		}
	>
>;
type many0_arg_check_2 = Expect<
	Equal<
		Parse<Many0, [1]>,
		{
			error: "invalid argument for Many0";
			argument: [1];
			message: "argument is not an parser";
		}
	>
>;

type many0_arg_check_3 = Expect<
	Equal<Parse<Many0, Parse<Just, "1">>, LazyOperation<Many0Kw, LazyOperation<JustKw, "1">>>
>;

type many0_is_parser = Expect<Equal<IsParser<Parse<Many0, Parse<Just, "1">>>, true>>;

type Many0TestParser = Parse<Many0, Parse<Just, "1">>;

type many0_parse_check_0 = Expect<
	Equal<Parse<Many0TestParser, "123">, ParserSuccessResult<["1"], "23">>
>;
type many0_parse_check_1 = Expect<Equal<Parse<Many0TestParser, "">, ParserSuccessResult<[], "">>>;
type many0_parse_check_2 = Expect<Equal<Parse<Many0TestParser, "0">, ParserSuccessResult<[], "0">>>;

type many0_parse_check_3 = Expect<
	Equal<Parse<Many0TestParser, "1">, ParserSuccessResult<["1"], "">>
>;
type many0_parse_check_4 = Expect<
	Equal<Parse<Many0TestParser, "11">, ParserSuccessResult<["1", "1"], "">>
>;

// many1 tests

type many1_arg_check_0 = Expect<
	Equal<
		Parse<Many1, 1>,
		{
			error: "invalid argument for Many1";
			argument: 1;
			message: "argument is not an parser";
		}
	>
>;
type many1_arg_check_1 = Expect<
	Equal<
		Parse<Many1, "11">,
		{
			error: "invalid argument for Many1";
			argument: "11";
			message: "argument is not an parser";
		}
	>
>;
type many1_arg_check_2 = Expect<
	Equal<
		Parse<Many1, [1]>,
		{
			error: "invalid argument for Many1";
			argument: [1];
			message: "argument is not an parser";
		}
	>
>;

type many1_arg_check_3 = Expect<
	Equal<Parse<Many1, Parse<Just, "1">>, LazyOperation<Many1Kw, LazyOperation<JustKw, "1">>>
>;

type many1_is_parser = Expect<Equal<IsParser<Parse<Many1, Parse<Just, "1">>>, true>>;

type Many1TestParser = Parse<Many1, Parse<Just, "1">>;

type many1_parse_check_0 = Expect<
	Equal<Parse<Many1TestParser, "123">, ParserSuccessResult<["1"], "23">>
>;
type many1_parse_check_1 = Expect<
	Equal<Parse<Many1TestParser, "">, ParserErrorResult<"Many1 didn't match, matched 0 times">>
>;
type many1_parse_check_2 = Expect<
	Equal<Parse<Many1TestParser, "0">, ParserErrorResult<"Many1 didn't match, matched 0 times">>
>;

type many1_parse_check_3 = Expect<
	Equal<Parse<Many1TestParser, "1">, ParserSuccessResult<["1"], "">>
>;
type many1_parse_check_4 = Expect<
	Equal<Parse<Many1TestParser, "11">, ParserSuccessResult<["1", "1"], "">>
>;

// Mapper Tests

interface ToLiteralMapperTest<T> extends Mapper {
	map: () => T;
}

interface ConsumeDataMapperTest extends Mapper {
	map: (
		data: this["data"],
	) => typeof data extends string ? [typeof data, true] : [typeof data, false];
}

type is_mapper_0 = Expect<Equal<IsMapper<ToLiteralMapperTest<null>>, true>>;

type is_mapper_1 = Expect<Equal<IsMapper<ConsumeDataMapperTest>, true>>;

// map_result tests

type map_result_arg_check_0 = Expect<
	Equal<
		Parse<MapResult, 1>,
		{
			error: "invalid argument for MapResult";
			argument: 1;
			message: "argument is not an array";
		}
	>
>;
type map_result_arg_check_1 = Expect<
	Equal<
		Parse<MapResult, []>,
		{
			error: "invalid argument for MapResult";
			argument: [];
			message: "argument is an empty array";
		}
	>
>;
type map_result_arg_check_2 = Expect<
	Equal<
		Parse<MapResult, [1]>,
		{
			error: "invalid argument for MapResult";
			argument: [1];
			message: {
				message: "argument is not an parser";
				data: 1;
			};
		}
	>
>;

type map_result_arg_check_3 = Expect<
	Equal<
		Parse<MapResult, [Parse<Just, "1">]>,
		{
			error: "invalid argument for MapResult";
			argument: [LazyOperation<"just", "1">];
			message: "argument has no mappers but just one parser";
		}
	>
>;

type map_result_arg_check_4 = Expect<
	Equal<
		Parse<MapResult, [Parse<Just, "1">, ToLiteralMapperTest<null>]>,
		LazyOperation<MapResultKw, [LazyOperation<JustKw, "1">, ToLiteralMapperTest<null>]>
	>
>;

type map_result_is_parser = Expect<
	Equal<IsParser<Parse<MapResult, [Parse<Just, "1">, ToLiteralMapperTest<null>]>>, true>
>;

type MapResultTestParser1 = Parse<
	MapResult,
	[
		Parse<Choice, [Parse<Just, "1">, Parse<Seq, [Parse<Just, "2">, Parse<Just, "3">]>]>,
		ConsumeDataMapperTest,
	]
>;

type map_result_parse_check_0 = Expect<
	Equal<Parse<MapResultTestParser1, "123">, ParserSuccessResult<["1", true], "23">>
>;
type map_result_parse_check_1 = Expect<
	Equal<
		Parse<MapResultTestParser1, "">,
		ParserErrorResult<"Choice didn't match, none of the subparsers matched">
	>
>;
type map_result_parse_check_2 = Expect<
	Equal<Parse<MapResultTestParser1, "23_">, ParserSuccessResult<[["2", "3"], false], "_">>
>;

type MapResultTestParser2 = Parse<MapResult, [Parse<Just, "1">, ToLiteralMapperTest<true>]>;

type map_result_parse_check_3 = Expect<
	Equal<Parse<MapResultTestParser2, "1">, ParserSuccessResult<true, "">>
>;
type map_result_parse_check_4 = Expect<
	Equal<Parse<MapResultTestParser2, "11">, ParserSuccessResult<true, "1">>
>;

// sepby0 tests

type sepby0_arg_check_0 = Expect<
	Equal<
		Parse<SepBy0, 1>,
		{
			error: "invalid argument for SepBy0";
			argument: 1;
			message: "argument is not a tuple with size 2";
		}
	>
>;
type sepby0_arg_check_1 = Expect<
	Equal<
		Parse<SepBy0, "11">,
		{
			error: "invalid argument for SepBy0";
			argument: "11";
			message: "argument is not a tuple with size 2";
		}
	>
>;
type sepby0_arg_check_2 = Expect<
	Equal<
		Parse<SepBy0, [1]>,
		{
			error: "invalid argument for SepBy0";
			argument: [1];
			message: "argument is not a tuple with size 2";
		}
	>
>;

type sepby0_arg_check_3 = Expect<
	Equal<
		Parse<SepBy0, [Parse<Just, "1">, Parse<Just, "2">]>,
		LazyOperation<SepBy0Kw, [LazyOperation<JustKw, "1">, LazyOperation<JustKw, "2">]>
	>
>;

type sepby0_is_parser = Expect<
	Equal<IsParser<Parse<SepBy0, [Parse<Just, "1">, Parse<Just, "2">]>>, true>
>;

type SepBy0TestParser = Parse<SepBy0, [Parse<Just, "1">, Parse<Just, ",">]>;

type sepby0_parse_check_0 = Expect<
	Equal<Parse<SepBy0TestParser, "123">, ParserSuccessResult<["1"], "23">>
>;
type sepby0_parse_check_1 = Expect<Equal<Parse<SepBy0TestParser, "">, ParserSuccessResult<[], "">>>;
type sepby0_parse_check_2 = Expect<
	Equal<Parse<SepBy0TestParser, "0">, ParserSuccessResult<[], "0">>
>;

type sepby0_parse_check_3 = Expect<
	Equal<Parse<SepBy0TestParser, "1">, ParserSuccessResult<["1"], "">>
>;
type sepby0_parse_check_4 = Expect<
	Equal<Parse<SepBy0TestParser, "1,1">, ParserSuccessResult<["1", "1"], "">>
>;

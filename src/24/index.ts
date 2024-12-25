import type { Expect, Equal } from "type-testing";

type FullParserMetadata<T extends string> = {
	metadata: true;
	lazy: false;
	parser: T;
};

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

type Parser = ParserGeneric<unknown>;

// parser metadata
type Choice = LazyParserMetadata<"choice">;

type EOF = LazyParserMetadata<"eof">;

type JustKw = "just";
type Just = LazyParserMetadata<JustKw>;

type Left = LazyParserMetadata<"left">;

type Many0 = LazyParserMetadata<"many0">;

type Many1 = LazyParserMetadata<"many1">;

type MapResult = LazyParserMetadata<"mapresult">;

type Mapper = LazyParserMetadata<"mapper">;

type Maybe = LazyParserMetadata<"maybe">;

type MaybeResult = LazyParserMetadata<"mayberesult">;

type NoneOf = LazyParserMetadata<"noneof">;

type Pair = LazyParserMetadata<"pair">;

type Right = LazyParserMetadata<"right">;

type SepBy0 = LazyParserMetadata<"sepby0">;

type Seq = LazyParserMetadata<"seq">;

// implementations
type JSONParser1 = FullParserMetadata<"json">;

type FullParser<T extends string, Argument> = T extends "json"
	? { todo: true; arg: Argument }
	: { error: true };

type IsValidJustArg<T> = T extends string
	? T extends `${infer A}${infer B extends ""}`
		? true
		: "length is invalid"
	: "type is not string";

type LazyParser<T extends string, Argument> = T extends "choice"
	? LazyOperation<T, Argument>
	: T extends JustKw
		? IsValidJustArg<Argument> extends true
			? LazyOperation<T, Argument>
			: {
					error: "invalid argument for Just";
					argument: Argument;
					message: IsValidJustArg<Argument>;
				}
		: { todo: 0; data: T; arg: Argument };

type LazyParserAppl<Op, Arg, ActualArg> = Op extends JustKw
	? ActualArg extends `${infer FirstChar}${infer Rest}`
		? FirstChar extends Arg
			? ParserSuccessResult<FirstChar, Rest>
			: ParserErrorResult<"Just didn't match, case 2">
		: ParserErrorResult<"Just didn't match, case 1">
	: {
			todo: 2;
			data: [Op, Arg];
			arg: ActualArg;
		};

type Parse<Operation, Argument> = Operation extends FullParserMetadata<infer T extends string>
	? FullParser<T, Argument>
	: Operation extends LazyParserMetadata<infer T extends string>
		? LazyParser<T, Argument>
		: Operation extends LazyOperation<infer Op, infer Arg>
			? LazyParserAppl<Op, Arg, Argument>
			: { todo: 1; data: Operation; arg: Argument };

type just_arg_check_0 = Expect<
	Equal<
		Parse<Just, 1>,
		{
			error: "invalid argument for Just";
			argument: 1;
			message: "type is not string";
		}
	>
>;
type just_arg_check_1 = Expect<
	Equal<
		Parse<Just, "11">,
		{
			error: "invalid argument for Just";
			argument: "11";
			message: "length is invalid";
		}
	>
>;
type just_arg_check_2 = Expect<Equal<Parse<Just, "1">, LazyOperation<JustKw, "1">>>;
type just_arg_check_3 = Expect<Equal<Parse<Just, "1" | "2">, LazyOperation<JustKw, "1" | "2">>>;

type JustTestParser1 = Parse<Just, "a">;

type just_parse_check_0 = Expect<
	Equal<Parse<JustTestParser1, "abb">, { success: true; data: "a"; rest: "bb" }>
>;
type just_parse_check_1 = Expect<
	Equal<
		Parse<JustTestParser1, "cbb">,
		{ success: false; data: null; rest: ""; additional: "Just didn't match, case 2" }
	>
>;
type just_parse_check_2 = Expect<
	Equal<
		Parse<JustTestParser1, "">,
		{ success: false; data: null; rest: ""; additional: "Just didn't match, case 1" }
	>
>;

type JustTestParser2 = Parse<Just, "a" | "b">;

type just_parse_check_3 = Expect<
	Equal<Parse<JustTestParser2, "ac">, { success: true; data: "a"; rest: "c" }>
>;
type just_parse_check_4 = Expect<
	Equal<Parse<JustTestParser2, "bc">, { success: true; data: "b"; rest: "c" }>
>;

//type choice_check_0 = Expect<Equal<Parse<ChoiceTestParser, "abb">>>;

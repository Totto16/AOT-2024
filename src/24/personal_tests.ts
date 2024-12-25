import type { Expect, Equal } from "type-testing"


// tests for parsers already provided

type is_parser_tests_0 = Expect<Equal<IsParser<Whitespace0>, true>>;

type is_parser_tests_1 = Expect<Equal<IsParser<Digits0>, true>>;

type is_parser_tests_2 = Expect<Equal<IsParser<Digits1>, true>>;

type is_parser_tests_3 = Expect<Equal<IsParser<Between<Whitespace0, Whitespace0, Digits1>>, true>>;

type is_parser_tests_4 = Expect<Equal<IsParser<Str<"Hello">>, true>>;

type is_parser_tests_5 = Expect<Equal<IsParser<Padded<Whitespace0>>, true>>;

type is_parser_tests_6 = Expect<Equal<IsParser<Sym<"++">>, true>>;

type is_parser_tests_7 = Expect<Equal<IsParser<DigitParser>, true>>;

type is_parser_tests_8 = Expect<Equal<IsParser<IntParser>, true>>;

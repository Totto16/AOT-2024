type Whitespace = " " | "\n" | "\t" | "\r"

type VariableKeyword = "let" | "const" | "var"

interface LintResult {
	declared: string[]
	used: string[]
}

type SetWithout<A extends unknown[], B extends unknown[]> = A extends [
	infer A1,
	...infer A2
]
	? A1 extends B[number]
		? SetWithout<A2, B>
		: [A1, ...SetWithout<A2, B>]
	: []

type LintImpl<
	S extends string,
	Result extends LintResult = { declared: []; used: [] }
> = S extends `${Whitespace}${infer Rest}`
	? LintImpl<Rest, Result>
	: S extends `${VariableKeyword} ${infer ID} = "${string}";${infer Rest}`
	? LintImpl<
			Rest,
			{ declared: [...Result["declared"], ID]; used: Result["used"] }
	  >
	: S extends `${string}(${infer Arg});${infer Rest}`
	? LintImpl<
			Rest,
			{ declared: Result["declared"]; used: [...Result["used"], Arg] }
	  >
	: Result

type LintRes<Res extends LintResult> = {
	scope: Res
	unused: SetWithout<Res["declared"], Res["used"]>
}

type Lint<S extends string> = LintRes<LintImpl<S>>

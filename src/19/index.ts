type ExcludeAll<
	T extends string,
	R extends string
> = T extends `${infer First}${Exclude<R, "">}${infer Rest}`
	? `${First}${ExcludeAll<Rest, R>}`
	: T

type NewlineChars = "\n" | "\t" | "\r"

type RemoveNewlines<T extends string> = ExcludeAll<
	ExcludeAll<T, NewlineChars>,
	" "
>

type VariableKeyword = "let" | "const" | "var"

type ParseLine<T extends string> =
	T extends `${VariableKeyword}${infer ID}=${any}`
		? [{ id: ID; type: "VariableDeclaration" }]
		: T extends `${any}(${infer Arg})`
		? [{ argument: Arg; type: "CallExpression" }]
		: []

type Parse19<T extends string> = T extends `${infer Line};${infer Rest}`
	? [...ParseLine<RemoveNewlines<Line>>, ...Parse19<Rest>]
	: ParseLine<RemoveNewlines<T>>

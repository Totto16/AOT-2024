type Whitespace = " " | "\n" | "\t" | "\r";

type VariableKeyword20 = "let" | "const" | "var";

type AnalyzeScope<T> = T extends `${Whitespace}${infer Tail}`
	? AnalyzeScope<Tail>
	: T extends `${VariableKeyword20} ${infer Variable} = "${string}";${infer Tail}`
		? {
				declared: [Variable, ...AnalyzeScope<Tail>["declared"]];
				used: AnalyzeScope<Tail>["used"];
			}
		: T extends `${string}(${infer Arg});${infer Tail}`
			? {
					declared: AnalyzeScope<Tail>["declared"];
					used: [Arg, ...AnalyzeScope<Tail>["used"]];
				}
			: { declared: []; used: [] };
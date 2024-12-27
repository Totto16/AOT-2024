type Length<T extends unknown[]> = T["length"];

type Succ<T extends unknown[]> = [...T, ""];

type CondElement<T extends string, Arr extends unknown[]> = T extends "" ? [] : [[T, Length<Arr>]];

type GetRoute2<R extends string, Arr extends unknown[]> = R extends `-${infer Rest}`
	? GetRoute2<Rest, Succ<Arr>>
	: R extends `${infer T}-${infer R2}`
		? [[T, Length<Arr>], ...GetRoute2<R2, Succ<[]>>]
		: [...CondElement<R, Arr>];

type StartElement<T extends string> = T extends "" ? [] : [[T, 0]];

type GetRoute<T extends string> = T extends `${infer T}-${infer R}`
	? T extends ""
		? GetRoute<R>
		: [...StartElement<T>, ...GetRoute2<R, Succ<[]>>]
	: [...StartElement<T>];

type IntFromString<T extends string> = T extends `${infer N extends number}`
	? N
	: never

type NaughtyList = "Liam" | "Aala"

type NaughtyOrNice<Name extends string> = Name extends NaughtyList
	? "naughty"
	: "nice"

type FormatNames<T extends Array<[string, string, string]>> = {
	[K in keyof T]: {
		name: T[K][0]
		count: IntFromString<T[K][2]>
		rating: NaughtyOrNice<T[K][0]>
	}
}

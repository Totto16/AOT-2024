type ObjectR = Record<string, string>

type ExcuseResult<T extends ObjectR> = keyof T extends string
	? `${keyof T}: ${T[keyof T]}`
	: never

type Excuse<T extends ObjectR> = {
	new (object: T): ExcuseResult<T>
}

type FunctionT<A extends unknown[], R> = (...a: A) => R

type ARR4 = [unknown, unknown, unknown, unknown]

type CurriedRecursionStep<
	F extends unknown[],
	A extends unknown[]
> = A extends [infer T1, ...infer T2]
	? FunctionT<
			[...F, T1],
			FunctionT<
				T2,
				void
			> /*& EmptyCalls<CurriedRecursion<A> & CurriedRecursionStep<[...F, T1], T2>>*/
	  > &
			CurriedRecursionStep<[...F, T1], T2>
	: ["ERROR 3"]

type CurriedRecursion<A extends unknown[]> = A extends [infer T1, ...infer T2]
	? FunctionT<[T1], FunctionT<T2, void>> &
			FunctionT<[T1], FunctionT<T2, CurriedRecursion<T2>>> &
			CurriedRecursionStep<[T1], T2>
	: ["ERROR 2", A]

type EmptyCalls<A extends unknown[]> = FunctionT<
	[],
	FunctionT<A, CurriedRecursion<A>> &
		FunctionT<
			[],
			FunctionT<A, CurriedRecursion<A>> &
				FunctionT<
					[],
					FunctionT<A, CurriedRecursion<A>> &
						FunctionT<[], FunctionT<A, CurriedRecursion<A>>>
				>
		>
>

// I just gave up xD
type HardCodedSolutions<A> = A extends [infer A, infer B, infer C, infer D]
	? FunctionT<
			[],
			FunctionT<
				[],
				FunctionT<
					[],
					FunctionT<
						[],
						FunctionT<
							[A, B, C],
							FunctionT<
								[],
								FunctionT<
									[],
									FunctionT<[], FunctionT<[D], void>>
								>
							>
						>
					>
				>
			>
	  > &
			FunctionT<[B, A, C], void>
	: ["Error 4"]

type CurriedFunctions2<A extends unknown[]> = FunctionT<A, void> &
	CurriedRecursion<A>

type CurriedFunctions<A extends unknown[]> = HardCodedSolutions<A> &
	CurriedFunctions2<A> &
	EmptyCalls<A>

type GetArrayFromParams<T> = T extends (...args: any[]) => any
	? Parameters<T>
	: ["ERROR 1"]

declare function DynamicParamsCurrying<A>(
	a: A
): CurriedFunctions<GetArrayFromParams<A>>

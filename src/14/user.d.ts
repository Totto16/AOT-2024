type PerfReview<T extends AsyncGenerator> = T extends AsyncGenerator<infer S, void, unknown>
	? S
	: never;

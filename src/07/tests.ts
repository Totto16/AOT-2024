import type { Expect, Equal } from 'type-testing';

const oneMill = createRoute7('💨Dasher', ['Atherton', "Scarsdale", "Cherry Hills Village"]).route;
type t0_actual = typeof oneMill; // =>
type t0_expected = [           // =>
    'Atherton',
    "Scarsdale",
    "Cherry Hills Village"
];
type t0 = Expect<Equal<t0_actual, t0_expected>>;

const two = createRoute7('🌟Vixen', ['Detroit', "Cleveland", "Dayton"]).route;
type t1_actual = typeof two; // =>
type t1_expected = [       // =>
    'Detroit',
    "Cleveland",
    "Dayton"
];
type t1 = Expect<Equal<t1_actual, t1_expected>>;

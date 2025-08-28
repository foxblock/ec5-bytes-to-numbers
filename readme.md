# EC5-compatible byte array to number conversions
I needed to convert a lot of byte arrays into different types of numbers (int16, int32, floats, etc.) for LoRaWAN driver development. Unfortunately my environment (using the otto library in Go to load JS code) only allowed for EC5-compatible JavaScript.

So I made this set of utility functions. They convert a byte array to the following types:
- uint8, uint16, uint32, uint64
- int8, int16, int32
- half/float16, float/float32, double/float64

Note: int64 is not properly doable due to constraints in how JavaScript handles numbers in general.

The float conversion functions are notable, because they properly handle all "speacial" float cases (i.e. sub-normal numbers, NaN, -Infinity and such). Most versions I found online do not handle these!

There is also
- functions for converting a hex string to a byte array (either with or without leading "0x")
- a processor class for working on larger byte arrays containing multiple values.

## The code
There are two versions:
1. `convert.js` - Functions throw when passed array argument does not hold enough bytes.
2. `convert_nocheck.js` - Without the array length check. Will never throw and therefore are slightly faster, but might cause a runtime exception, if byte array is read out of bounds. Use when you know the input is well-formed or perform the length check elsewhere.

Both versions have parameters for byte offset into the array (defaults to 0) and endian setting (defaults to big endian).

Other than that there are no plausibility checks done. Especially the individual elements of the array are just assumed to be valid byte values (0..255).

I recommend copying only the necessary functions to your codebase and not including the whole file (since you probably don't need all types). Every function is stand-alone and does not rely on any other piece of code.

## Testing
`test_convert.js` holds the unit tests. These are fairly thourough. Any integer up to 32-bit width is fully checked. Uint64 is only checked for edge cases (since fully checking would take a minute or so). Testing float conversions is tricky, because JS converts everything to double. So we check all the edge cases and a few random values. 

Call `convert_test_all()` to run all tests.  
Note: For `convert_nocheck.js` the variable `convert_skip_error_tests` needs to be set to true, so the missing "array length error"-handling is not tested.

Note: Tests are NOT EC5 compatible, since they use the DataView class for comparison.

## Speed
There is not much to optimize, since the code is fairly straightforward.

However I included a `benchmark_convert.js` to compare the speed impact of different levels of parameter checks and error handling and to compare against EC6's DataView. The setup is not scientific, so only use it for rough comparisons ([fallacies of micro-benchmarks apply](https://sindresorhus.com/blog/micro-benchmark-fallacy)).

The branchless version (no length check, no endian setting, offset required) performs the fastest (no surprise there).  
The branchful versions are very close to each other speed-wise.  
Using a DataView for a large number of conversions is about 5x faster for integers and 25x faster for floats.  
That is when you create ONLY ONE DataView for the whole loop. If you create a new DataView object for every 256th number it is roughly on par and if you create a new DataView object for EVERY conversion, it is MUCH slower.

Run `multibench()` or `multibench_float()` to get your own measurements.

## License
MIT
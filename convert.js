// Functions for converting byte arrays to the following types:
// - uint8, uint16, uint32, uint64
// - int8, int16, int32
// - half/float16, float/float32, double/float64
// also
// - hex-strings to byte array
// - processor class for larger byte arrays containing multiple values
//
// Functions throw when passed array argument does not hold enough bytes.
// Other than that there are no plausibility checks done. Especially the
// individual elements of the array are just assumed to be valid byte 
// values (0..255).
//
// Includes unit tests:
// call convert_test_all() for all tests or see bottom of the file for individual test groups

/**
 * Converts byte array into uint8 without sanity checking contents of the array.
 * Throws an error if an out of bounds access would occur.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset into the array where decoding should start (default: 0).
 * @returns uint8 value as float64.
 */
function ByteArrayToUint8(bytes, offset) {
    if (offset === undefined)
        offset = 0;
    if (offset + 1 > bytes.length)
        throw new Error("ByteArrayToUint8 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    return bytes[offset];
}

/**
 * Converts byte array into uint16 without sanity checking contents of the array.
 * Throws an error if an out of bounds access would occur.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in arr is littleEndian, default=false for bigEndian.
 * @returns uint16 value as float64.
 */
function ByteArrayToUint16(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 2 > bytes.length)
        throw new Error("ByteArrayToUint16 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);
    
    if (littleEndian)
        return (bytes[offset + 1] << 8) + bytes[offset];
    else
        return (bytes[offset] << 8) + bytes[offset + 1];
}

// https://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
/**
 * Converts byte array into uint32 without sanity checking contents of the array.
 * Throws an error if an out of bounds access would occur.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in arr is littleEndian, default=false for bigEndian.
 * @returns uint32 value as float64.
 */
function ByteArrayToUint32(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 4 > bytes.length)
        throw new Error("ByteArrayToUint32 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    // ">>> 0" makes sure the result is always unsigned
    if (littleEndian)
        return ((bytes[offset + 3] << 24) >>> 0) + (bytes[offset + 2] << 16) + (bytes[offset + 1] << 8) + bytes[offset];
    else
        return ((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
}

/**
 * Converts byte array into uint64 without sanity checking contents of the array.
 * Throws an error if an out of bounds access would occur.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in arr is littleEndian, default=false for bigEndian.
 * @returns uint64 value as float64.
 * 
 * NOTE: Cannot directly read uint64 bytes, since JS shift operators return 32-bit ints, so
 * we have to use multiplication of two uint32 instead.
 * NOTE: Due to the automatic conversion to float64 the maximum safe value is 
 * Number.MAX_SAFE_INTEGER = 9007199254740991 = [0, 31, 255, 255, 255, 255, 255, 255] (big endian)
 */
function ByteArrayToUint64(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 8 > bytes.length)
        throw new Error("ByteArrayToUint64 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    if (littleEndian)
        return ByteArrayToUint32(bytes, offset + 4, littleEndian) * 4294967296 + ByteArrayToUint32(bytes, offset, littleEndian);
    else
        return ByteArrayToUint32(bytes, offset, littleEndian) * 4294967296 + ByteArrayToUint32(bytes, offset + 4, littleEndian);
}

/**
 * Converts byte array into int8 without sanity checking contents of the array.
 * Throws an error if an out of bounds access would occur.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset into the array where decoding should start (default: 0).
 * @returns int8 value as float64.
 */
function ByteArrayToInt8(bytes, offset) {
    if (offset === undefined)
        offset = 0;
    if (offset + 1 > bytes.length)
        throw new Error("ByteArrayToInt8 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);
    var unsigned = bytes[offset];
    return unsigned > 0x7f ? unsigned - 0x100 : unsigned;
}

/**
 * Converts byte array into int16 without sanity checking contents of the array.
 * Throws an error if an out of bounds access would occur.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in arr is littleEndian, default=false for bigEndian.
 * @returns int16 value as float64.
 */
function ByteArrayToInt16(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 2 > bytes.length)
        throw new Error("ByteArrayToInt16 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    if (littleEndian)
        var unsigned = (bytes[offset + 1] << 8) + bytes[offset];
    else
        var unsigned = (bytes[offset] << 8) + bytes[offset + 1];
    return unsigned > 0x7fff ? unsigned - 0x10000 : unsigned;
}

/**
 * Converts byte array into int32 without sanity checking contents of the array.
 * Throws an error if an out of bounds access would occur.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in arr is littleEndian, default=false for bigEndian.
 * @returns int32 value as float64.
 */
function ByteArrayToInt32(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 4 > bytes.length)
        throw new Error("ByteArrayToInt32 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    if (littleEndian)
        var unsigned = ((bytes[offset + 3] << 24) >>> 0) + (bytes[offset + 2] << 16) + (bytes[offset + 1] << 8) + bytes[offset];
    else
        var unsigned = ((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
    return unsigned > 0x7fffffff ? unsigned - 0x100000000 : unsigned;
}

/**
 * Converts a hex string in the form "deadF00D" or "0xdeadF00D" (i.e. case-insensitive) to a byte array.
 * Odd length strings lead to an error.
 * Invalid characters are replaced with 0.
 * Conversion is handled by the parseInt function.
 * @param str Input hex value as String.
 * @param littleEndian Optional boolean. True if order of bytes in str is littleEndian, default=false for bigEndian.
 * @returns array of byte values in big endian order.
 */
function HexToByteArray(str, littleEndian) {
    if (str.length % 2 !== 0)
        throw new Error("HexToByteArray: Odd length string. Length: " + str.length);

    var start = 0;
    if (str.startsWith("0x"))
        start = 2;
    str = str.replaceAll(/[^0123456789abcdefABCDEF]/g, "0");

    let bytes = new Array((str.length - start) / 2);
    if (littleEndian) {
        for (let c = str.length-2, i = 0; c >= start; c -= 2, ++i) {
            bytes[i] = parseInt(str.substring(c, c+2), 16);
        }
    } 
    else {
        for (let c = start, i = 0; c < str.length; c += 2, ++i) {
            bytes[i] = parseInt(str.substring(c, c+2), 16);
        }
    }
    return bytes;
}

/**
 * Converts byte array into float16/half (returned as a float64)
 * without sanity checking contents of the array.
 * Throws an error if out of bounds access would be done.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in str is littleEndian, default=false for bigEndian.
 * 
 * NOTE: Any number in JS is stored as float64/double. So decoding a float(32) or float16/half with 
 * this function will implicitly convert it to float64 afterwards and probably break any repeating
 * fraction bits. This might lead to a small precision loss and it being displayed differently 
 * when converted to a string: e.g. 21.9 in float32 (0x41AF3333) is converted to 0x4035E66666000000
 * in float64 and displayed as 21.899999618530273 instead of 21.9 (0x4035E66666666666).
 */
function ByteArrayToFloat16(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 2 > bytes.length)
        throw new Error("ByteArrayToFloat16 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    var bits = 0;
    if (littleEndian)
        bits = (bytes[offset + 1] << 8) | bytes[offset];
    else
        bits = (bytes[offset] << 8) | bytes[offset + 1];
    var sign = bits >>> 15 === 0 ? 1.0 : -1.0;
    var e = (bits >>> 10) & 0x1f;
    // calculate significand post-normalization
    var m = (e === 0) ? (bits & 0x3ff) << 1 : (bits & 0x3ff) | 0x400;
    
    if (e == 0x1f) {
        return (bits & 0x3ff) ? NaN : sign * Infinity;
    }

    var f = sign * m * Math.pow(2, e - 25);
    return f;
}

/**
 * Converts byte array into float32 (returned as a float64)
 * without sanity checking contents of the array.
 * Throws an error if out of bounds access would be done.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in str is littleEndian, default=false for bigEndian.
 * 
 * NOTE: Any number in JS is stored as float64/double. So decoding a float(32) or float16/half with 
 * this function will implicitly convert it to float64 afterwards and probably break any repeating
 * fraction bits. This might lead to a small precision loss and it being displayed differently 
 * when converted to a string: e.g. 21.9 in float32 (0x41AF3333) is converted to 0x4035E66666000000
 * in float64 and displayed as 21.899999618530273 instead of 21.9 (0x4035E66666666666).
 */
function ByteArrayToFloat32(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 4 > bytes.length)
        throw new Error("ByteArrayToFloat32 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    var bits = 0;
    if (littleEndian)
        bits = (bytes[offset + 3] << 24) | (bytes[offset + 2] << 16) | (bytes[offset + 1] << 8) | bytes[offset];
    else
        bits = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    var sign = (bits >>> 31) === 0 ? 1.0 : -1.0;
    var e = (bits >>> 23) & 0xff;
    // calculate significand post-normalization
    var m = (e === 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    
    if (e == 0xff) {
        return (bits & 0x7fffff) ? NaN : sign * Infinity;
    }

    var f = sign * m * Math.pow(2, e - 150);
    return f;
}

/**
 * Converts byte array into float64/double
 * without sanity checking contents of the array.
 * Throws an error if out of bounds access would be done.
 * @param bytes Standard array of bytes.
 * @param offset Optional offset offset into the array where decoding should start (default: 0).
 * @param littleEndian Optional boolean. True if order of bytes in str is littleEndian, default=false for bigEndian.
 */
function ByteArrayToFloat64(bytes, offset, littleEndian) {
    if (offset === undefined)
        offset = 0;
    if (offset + 8 > bytes.length)
        throw new Error("ByteArrayToFloat64 failed: not enough bytes to decode. Length: " + bytes.length + ", offset: " + offset);

    var bitsSignExp;
    var bitsMant_1;
    var bitsMant_2;
    if (littleEndian) {
        bitsSignExp = (bytes[offset + 7] << 8) | bytes[offset + 6];
        // we have to split the significand into two parts, since shift operators return 32-bit ints
        bitsMant_1 = ((bytes[offset + 3] << 24) >>> 0) + (bytes[offset + 2] << 16) + (bytes[offset + 1] << 8) + bytes[offset];
        bitsMant_2 = ((bytes[offset + 6] & 0xF) << 16) | (bytes[offset + 5] << 8) | bytes[offset + 4];
    }
    else {
        bitsSignExp = (bytes[offset] << 8) | bytes[offset + 1];
        bitsMant_1 = ((bytes[offset + 4] << 24) >>> 0) + (bytes[offset + 5] << 16) + (bytes[offset + 6] << 8) + bytes[offset + 7];
        bitsMant_2 = ((bytes[offset + 1] & 0xF) << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    }
    var sign = (bitsSignExp >>> 15) === 0 ? 1.0 : -1.0;
    var e = (bitsSignExp >>> 4) & 0x7ff;
    if (e == 0x7ff) {
        return (bitsMant_1 != 0 || bitsMant_2 != 0) ? NaN : sign * Infinity;
    }

    // Combined significand values (52bit) should be lower than Number.MAX_SAFE_INTEGER (53bit)
    // so we can store them in a double now
    var m = bitsMant_1 + 4294967296 * bitsMant_2;
    var f;
    // Need to check for e == 0, since 2^(-1075) is too small for double precision and will round to 0
    if (e === 0)
        f = sign * m * Math.pow(2, e - 1074);
    else // also do normalization in this step (add 1<<52)
        f = sign * (m + 4503599627370496) * Math.pow(2, e - 1075);
    return f;
}

// --------- PROCESSOR ---------

function ByteArrayProcessor(bytes, littleEndian) {
    this.bytes = bytes;
    this.offset = 0;
    this.LE = littleEndian;

    this.readNextUint8 = function() {
        var value = ByteArrayToUint8(this.bytes, this.offset);
        this.offset += 1;
        return value;
    };
    this.readNextUint16 = function() {
        var value = ByteArrayToUint16(this.bytes, this.offset, this.LE);
        this.offset += 2;
        return value;
    };
    this.readNextUint32 = function() {
        var value = ByteArrayToUint32(this.bytes, this.offset, this.LE);
        this.offset += 4;
        return value;
    };
    this.readNextUint64 = function() {
        var value = ByteArrayToUint64(this.bytes, this.offset, this.LE);
        this.offset += 8;
        return value;
    };
    this.readNextInt8 = function() {
        var value = ByteArrayToInt8(this.bytes, this.offset);
        this.offset += 1;
        return value;
    };
    this.readNextInt16 = function() {
        var value = ByteArrayToInt16(this.bytes, this.offset, this.LE);
        this.offset += 2;
        return value;
    };
    this.readNextInt32 = function() {
        var value = ByteArrayToInt32(this.bytes, this.offset, this.LE);
        this.offset += 4;
        return value;
    };
    this.readNextFloat16 = function() {
        var value = ByteArrayToFloat16(this.bytes, this.offset, this.LE);
        this.offset += 2;
        return value;
    };
    this.readNextFloat32 = function() {
        var value = ByteArrayToFloat32(this.bytes, this.offset, this.LE);
        this.offset += 4;
        return value;
    };
    this.readNextFloat64 = function() {
        var value = ByteArrayToFloat64(this.bytes, this.offset, this.LE);
        this.offset += 8;
        return value;
    };
}

let convert_skip_error_tests = false;

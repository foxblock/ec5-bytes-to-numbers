
function convert_test_uint8() {
    console.log("Testing ByteArrayToUint8...");
    for (let i = 0; i < 256; ++i) {
        let data = [i,i % 128];
        console.assert(ByteArrayToUint8(data) === i, "ByteArrayToUint8: Failed for %d", i);
        console.assert(ByteArrayToUint8(data, 1) === i % 128, "ByteArrayToUint8: Failed for %d and offset 1", i);
    }
    let data = [160,64];
    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    console.assert(ByteArrayToUint8(data, 0) === view.getUint8(0), "ByteArrayToUint8: Failed check against DataView");
    console.assert(ByteArrayToUint8(data, 1) === view.getUint8(1), "ByteArrayToUint8: Failed check against DataView");

    if (!convert_skip_error_tests) {
        try {
            let error = ByteArrayToUint8(data, 2);
            console.error("ByteArrayToUint8: Failed bounds check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_uint16() {
    console.log("Testing ByteArrayToUint16...");
    let total = 0;
    for (let i = 0; i < 256; ++i) {
        for (let k = 0; k < 256; ++k) {
            let data = [k,i,i,k];
            console.assert(ByteArrayToUint16(data, 0, true) === total, "ByteArrayToUint16: Failed for %d, little endian", total);
            console.assert(ByteArrayToUint16(data, 2, false) === total, "ByteArrayToUint16: Failed for %d, big endian", total);
            ++total;
        }
    }

    let data = [255,0,64,142];

    console.assert(ByteArrayToUint16(data, 0, false) === ByteArrayToUint16(data), "ByteArrayToUint16: Failed defaults");

    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    console.assert(ByteArrayToUint16(data, 0, true) === view.getUint16(0, true), "ByteArrayToUint16: Failed check against DataView");
    console.assert(ByteArrayToUint16(data, 2, true) === view.getUint16(2, true), "ByteArrayToUint16: Failed check against DataView");
    console.assert(ByteArrayToUint16(data, 0, false) === view.getUint16(0, false), "ByteArrayToUint16: Failed check against DataView");
    console.assert(ByteArrayToUint16(data, 2, false) === view.getUint16(2, false), "ByteArrayToUint16: Failed check against DataView");
    
    if (!convert_skip_error_tests) {
        try {
            let error = ByteArrayToUint16(data, 3);
            console.error("ByteArrayToUint16: Failed bounds check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_uint32() {
    console.log("Testing ByteArrayToUint32 (this takes a while)...");
    let total = 0;
    for (let i = 0; i < 256; ++i) {
        for (let k = 0; k < 256; ++k) {
            for (let l = 0; l < 256; ++l) {
                for (let m = 0; m < 256; ++m) {
                    let data = [m,l,k,i,i,k,l,m];
                    console.assert(ByteArrayToUint32(data, 0, true) === total, "ByteArrayToUint32: Failed for %d, little endian", total);
                    console.assert(ByteArrayToUint32(data, 4, false) === total, "ByteArrayToUint32: Failed for %d, big endian", total);
                    ++total;
                }
            }
        }
    }

    let data = [255,0,64,142,100,1,0,42]; // making sure the "sign"/highest bit is set in the first and last position of one uint32
    
    console.assert(ByteArrayToUint32(data, 0, false) === ByteArrayToUint32(data), "ByteArrayToUint32: Failed defaults");

    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    console.assert(ByteArrayToUint32(data, 0, true) === view.getUint32(0, true), "ByteArrayToUint32: Failed check against DataView");
    console.assert(ByteArrayToUint32(data, 4, true) === view.getUint32(4, true), "ByteArrayToUint32: Failed check against DataView");
    console.assert(ByteArrayToUint32(data, 0, false) === view.getUint32(0, false), "ByteArrayToUint32: Failed check against DataView");
    console.assert(ByteArrayToUint32(data, 4, false) === view.getUint32(4, false), "ByteArrayToUint32: Failed check against DataView");
    
    if (!convert_skip_error_tests) {
        try {
            let error = ByteArrayToUint32(data, 5);
            console.error("ByteArrayToUint32: Failed bounds check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_uint64() {
    // NOTE (JS, 01.03.24): Testing all 64bit numbers takes too long and ByteArrayToUint64 calls
    // ByteArrayToUint32 internally anyway. So we just test that concatination with a couple of fixed numbers
    console.log("Testing ByteArrayToUint64...");
    let data = [0, 31, 255, 255, 255, 255, 255, 255, 0, 12, 255, 42, 0, 69, 30, 0];
    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    console.assert(ByteArrayToUint64(data) === Number.MAX_SAFE_INTEGER, "ByteArrayToUint32: Failed max value check");
    console.assert(ByteArrayToUint64(data) == view.getBigUint64(), "ByteArrayToUint32: Failed check against DataView");
    console.assert(ByteArrayToUint64(data) == view.getBigUint64(), "ByteArrayToUint32: Failed check against DataView");
    console.assert(ByteArrayToUint64(data, 8, false) == view.getBigUint64(8, false), "ByteArrayToUint32: Failed check against DataView");
    console.assert(ByteArrayToUint64(data, 8, true) == view.getBigUint64(8, true), "ByteArrayToUint32: Failed little endian check against DataView");
}

function convert_test_int8() {
    console.log("Testing ByteArrayToInt8...");
    for (let i = 0; i < 256; ++i) {
        let data = [i, 255-i];
        console.assert(ByteArrayToInt8(data) === (i >= 128 ? i - 256 : i), "ByteArrayToInt8: Failed for %d", i);
        console.assert(ByteArrayToInt8(data, 1) === (i < 128 ? -i - 1 : 255 - i), "ByteArrayToInt8: Failed for %d and offset 1", i);
    }
    let data = [160,64];
    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    console.assert(ByteArrayToInt8(data, 0) === view.getInt8(0), "ByteArrayToInt8: Failed check against DataView");
    console.assert(ByteArrayToInt8(data, 1) === view.getInt8(1), "ByteArrayToInt8: Failed check against DataView");

    if (!convert_skip_error_tests) {
        try {
            let error = ByteArrayToInt8(data, 2);
            console.error("ByteArrayToInt8: Failed bounds check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_int16() {
    console.log("Testing ByteArrayToInt16...");
    let total = 0;
    for (let i = 0; i < 256; ++i) {
        for (let k = 0; k < 256; ++k) {
            let data = [k,i,i,k];
            console.assert(ByteArrayToInt16(data, 0, true) === (total >= 32768 ? total - 65536 : total), "ByteArrayToInt16: Failed for %d, little endian", total);
            console.assert(ByteArrayToInt16(data, 2, false) === (total >= 32768 ? total - 65536 : total), "ByteArrayToInt16: Failed for %d, big endian", total);
            ++total;
        }
    }

    let data = [160,64,255,0];

    console.assert(ByteArrayToInt16(data, 0, false) === ByteArrayToInt16(data), "ByteArrayToInt16: Failed defaults");

    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    console.assert(ByteArrayToInt16(data, 0, true) === view.getInt16(0, true), "ByteArrayToInt16: Failed check against DataView");
    console.assert(ByteArrayToInt16(data, 2, true) === view.getInt16(2, true), "ByteArrayToInt16: Failed check against DataView");
    console.assert(ByteArrayToInt16(data, 0, false) === view.getInt16(0, false), "ByteArrayToInt16: Failed check against DataView");
    console.assert(ByteArrayToInt16(data, 2, false) === view.getInt16(2, false), "ByteArrayToInt16: Failed check against DataView");
    
    if (!convert_skip_error_tests) {
        try {
            let error = ByteArrayToInt16(data, 3);
            console.error("ByteArrayToInt16: Failed bounds check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_int32() {
    console.log("Testing ByteArrayToInt32 (this takes a while)...");
    let total = 0;
    for (let i = 0; i < 256; ++i) {
        for (let k = 0; k < 256; ++k) {
            for (let l = 0; l < 256; ++l) {
                for (let m = 0; m < 256; ++m) {
                    let data = [m,l,k,i,i,k,l,m];
                    console.assert(ByteArrayToInt32(data, 0, true) === (total >= 2147483648 ? total - 4294967296 : total), "ByteArrayToInt32: Failed for %d, little endian", total);
                    console.assert(ByteArrayToInt32(data, 4, false) === (total >= 2147483648 ? total - 4294967296 : total), "ByteArrayToInt32: Failed for %d, big endian", total);
                    ++total;
                }
            }
        }
    }

    let data = [160,64,255,0,200,1,0,255];
    
    console.assert(ByteArrayToInt32(data, 0, false) === ByteArrayToInt32(data), "ByteArrayToInt32: Failed defaults");

    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    console.assert(ByteArrayToInt32(data, 0, true) === view.getInt32(0, true), "ByteArrayToInt32: Failed check against DataView");
    console.assert(ByteArrayToInt32(data, 4, true) === view.getInt32(4, true), "ByteArrayToInt32: Failed check against DataView");
    console.assert(ByteArrayToInt32(data, 0, false) === view.getInt32(0, false), "ByteArrayToInt32: Failed check against DataView");
    console.assert(ByteArrayToInt32(data, 4, false) === view.getInt32(4, false), "ByteArrayToInt32: Failed check against DataView");
    
    if (!convert_skip_error_tests) {
        try {
            let error = ByteArrayToInt32(data, 5);
            console.error("ByteArrayToInt32: Failed bounds check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_compareBytes(arrayA, arrayB) {
    if (arrayA.length !== arrayB.length)
        return false;

    for (let i = 0; i < arrayA.length; ++i)
    {
        let nanCount = 0 + Number.isNaN(arrayA[i]) + Number.isNaN(arrayB[i]);
        if ((nanCount == 0 && arrayA[i] !== arrayB[i]) || nanCount == 1)
            return false;
    }

    return true;
}

function convert_test_hex() {
    console.log("Testing HexToByteArray...");

    const bytesBig = [222,173,240,13];
    let res = HexToByteArray("deadF00D");
    console.assert(convert_test_compareBytes(res, bytesBig), "HexToByteArray: Failed big endian");

    const bytesLittle = [13,240,173,222];
    res = HexToByteArray("deadF00D", true);
    console.assert(convert_test_compareBytes(res, bytesLittle), "HexToByteArray: Failed little endian");
    
    res = HexToByteArray("DEADf00d");
    console.assert(convert_test_compareBytes(res, bytesBig), "HexToByteArray: Failed case insensitive");

    res = HexToByteArray("AFX+BF 5q1");
    let res2 = HexToByteArray("AF00BF0501");
    console.assert(convert_test_compareBytes(res, res2), "HexToByteArray: Failed invalid char substitution");

    res = HexToByteArray("deadF00D");
    res2 = HexToByteArray("0xdeadF00d");
    console.assert(convert_test_compareBytes(res, res2), "HexToByteArray: Failed ignore 0x");

    res = HexToByteArray("0x");
    console.assert(convert_test_compareBytes(res, []), "HexToByteArray: Failed solo 0x");
    res = HexToByteArray("");
    console.assert(convert_test_compareBytes(res, []), "HexToByteArray: Failed empty string");

    if (!convert_skip_error_tests) {
        try {
            let error = HexToByteArray("oddlength");
            console.error("HexToByteArray: Failed odd length check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_float_value(bDouble, bFloat, bHalf, value, halfValue) {
    if (halfValue == undefined)
        halfValue = value;

    const aDouble = new Uint8Array(bDouble);
    const aFloat = new Uint8Array(bFloat);
    console.assert(ByteArrayToFloat64(bDouble) === value, "ByteArrayToFloat: Failed double conversion for value " + value);
    console.assert(ByteArrayToFloat64(bDouble) === new DataView(aDouble.buffer).getFloat64(), "ByteArrayToFloat: Failed double conversion for value " + value);
    console.assert(ByteArrayToFloat32(bFloat) === new DataView(aFloat.buffer).getFloat32(), "ByteArrayToFloat32: Failed float conversion for value " + value);
    // Some conversions need a special value to check here, since JS does not properly support float16/half
    // The value might not be the "correct" float16 value, since everything is converted to float64 by JS
    console.assert(ByteArrayToFloat16(bHalf) === halfValue, "ByteArrayToFloat16: Failed half conversion for value " + value);
}

function convert_test_float_NaN() {
    console.assert(isNaN(ByteArrayToFloat64([127, 240, 0, 0, 0, 0, 0, 1])), "ByteArrayToFloat: Failed double conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat64([127, 248, 0, 0, 0, 0, 0, 1])), "ByteArrayToFloat: Failed double conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat64([127, 248, 0, 0, 0, 0, 0, 1].reverse(), 0, true)), "ByteArrayToFloat: Failed little endian double conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat32([255, 192, 0, 1])), "ByteArrayToFloat32: Failed float conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat32([255, 128, 0, 1])), "ByteArrayToFloat32: Failed float conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat32([255, 128, 0, 1].reverse(), 0, true)), "ByteArrayToFloat32: Failed little endian float conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat16([124, 1])), "ByteArrayToFloat16: Failed half conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat16([124, 123])), "ByteArrayToFloat16: Failed half conversion for NaN");
    console.assert(isNaN(ByteArrayToFloat16([124, 123].reverse(), 0, true)), "ByteArrayToFloat16: Failed little endian half conversion for NaN");
}

function convert_test_float_littleEndian(bDouble, bFloat, bHalf, value, halfValue) {
    if (halfValue == undefined)
        halfValue = value;

    const aDouble = new Uint8Array(bDouble);
    const aFloat = new Uint8Array(bFloat);
    console.assert(ByteArrayToFloat64(bDouble, 0, true) === value, "ByteArrayToFloat: Failed little endian double conversion for value " + value);
    console.assert(ByteArrayToFloat64(bDouble, 0, true) === new DataView(aDouble.buffer).getFloat64(0, true), "ByteArrayToFloat: Failed little endian double conversion for value " + value);
    console.assert(ByteArrayToFloat32(bFloat, 0, true) === new DataView(aFloat.buffer).getFloat32(0, true), "ByteArrayToFloat32: Failed little endian float conversion for value " + value);
    console.assert(ByteArrayToFloat16(bHalf, 0, true) === halfValue, "ByteArrayToFloat16: Failed little endian half conversion for value " + value);
}

function convert_test_float() {
    console.log("Testing ByteArrayToFloat...");
    // special edge cases based on 
    // https://en.wikipedia.org/wiki/Single-precision_floating-point_format#Notable_single-precision_cases
    convert_test_float_value([64, 9, 33, 251, 84, 68, 45, 24], [64, 73, 15, 219], [66, 72], Math.PI, 3.140625);
    convert_test_float_value([127, 240, 0, 0, 0, 0, 0, 0], [127, 128, 0, 0], [124, 0], Infinity);
    convert_test_float_value([255, 240, 0, 0, 0, 0, 0, 0], [255, 128, 0, 0], [252, 0], -Infinity);
    convert_test_float_value([128, 0, 0, 0, 0, 0, 0, 0], [128, 0, 0, 0], [128, 0], -0);
    convert_test_float_value([63, 240, 0, 0, 0, 0, 0, 1], [63, 128, 0, 1], [60, 1], 1.0000000000000002, 1.0009765625); // smallest number >1
    convert_test_float_value([63, 239, 255, 255, 255, 255, 255, 255], [63, 127, 255, 255], [59, 255], 0.9999999999999999, 0.99951171875); // largest number <1
    convert_test_float_value([0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 1], [0, 1], 4.9406564584124654e-324, 5.960464477539063e-8); // smallest positive subnormal number
    convert_test_float_value([0, 15, 255, 255, 255, 255, 255, 255], [0, 127, 255, 255], [3, 255], 2.2250738585072009e-308, 0.00006097555160522461); // largest subnormal number
    convert_test_float_value([0, 16, 0, 0, 0, 0, 0, 0], [0, 128, 0, 0], [4, 0], 2.2250738585072014e-308, 0.00006103515625); // smallest positive normal number
    convert_test_float_value([127, 239, 255, 255, 255, 255, 255, 255], [127, 127, 255, 255], [123, 255], Number.MAX_VALUE, 65504); // largest normal number

    convert_test_float_NaN();

    convert_test_float_littleEndian([64, 9, 33, 251, 84, 68, 45, 24].reverse(), [64, 73, 15, 219].reverse(), [66, 72].reverse(), Math.PI, 3.140625);
    convert_test_float_littleEndian([255, 240, 0, 0, 0, 0, 0, 0].reverse(), [255, 128, 0, 0].reverse(), [252, 0].reverse(), -Infinity);
    convert_test_float_littleEndian([127, 239, 255, 255, 255, 255, 255, 255].reverse(), [127, 127, 255, 255].reverse(), [123, 255].reverse(), Number.MAX_VALUE, 65504);
    
    if (!convert_skip_error_tests) {
        try {
            let val = ByteArrayToFloat16([42])
            console.error("ByteArrayToFloat16: Failed insufficient array length check");
        } catch (e) {
            // this should throw an error and end down here
        }
        try {
            let val = ByteArrayToFloat32([42, 123, 99])
            console.error("ByteArrayToFloat32: Failed insufficient array length check");
        } catch (e) {
            // this should throw an error and end down here
        }
        try {
            let val = ByteArrayToFloat64([42, 123, 99, 123, 0, 255, 1])
            console.error("ByteArrayToFloat64: Failed insufficient array length check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_processor() {
    const data = [128];
    data.push(...[222, 173]);
    data.push(...[250, 222, 190, 239]);
    data.push(...[0, 31, 255, 255, 0, 12, 255, 42]);
    data.push(...[255]);
    data.push(...[255, 0]);
    data.push(...[129, 44, 254, 0].reverse()); // little endian
    data.push(...[128, 0]);
    data.push(...[127, 128, 0, 0]);
    data.push(...[64, 9, 33, 251, 84, 68, 45, 24]);

    let processor = new ByteArrayProcessor(data);
    console.assert(processor.readNextUint8() === 128, "ByteArrayProcessor: Failed Uint8");
    console.assert(processor.readNextUint16() === 57005, "ByteArrayProcessor: Failed Uint16");
    console.assert(processor.readNextUint32() === 4208901871, "ByteArrayProcessor: Failed Uint32");
    console.assert(processor.readNextUint64() === 9007194960625450, "ByteArrayProcessor: Failed Uint64");
    console.assert(processor.readNextInt8() === -1, "ByteArrayProcessor: Failed Int8");
    console.assert(processor.readNextInt16() === -256, "ByteArrayProcessor: Failed Int16");
    processor.LE = true;
    console.assert(processor.readNextInt32() === -2127757824, "ByteArrayProcessor: Failed Int32 (little endian)");
    processor.LE = false;
    console.assert(processor.readNextFloat16() === -0, "ByteArrayProcessor: Failed Half");
    console.assert(processor.readNextFloat32() === Infinity, "ByteArrayProcessor: Failed Float");
    console.assert(processor.readNextFloat64() === Math.PI, "ByteArrayProcessor: Failed Double");
    
    if (!convert_skip_error_tests) {
        try {
            let error = processor.readNextUint8();
            console.error("HexToByteArray: Failed out of bounds check");
        } catch (e) {
            // this should throw an error and end down here
        }
    }
}

function convert_test_all() {
    convert_test_uint8();
    convert_test_uint16();
    convert_test_uint32();
    convert_test_uint64();
    convert_test_int8();
    convert_test_int16();
    convert_test_int32();
    convert_test_hex();
    convert_test_float();
    convert_test_processor();
    console.log("Testing finished! (look for any errors above)");
}

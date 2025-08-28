function multibench() {
    benchmark(1000);
    benchmark(10000);
    benchmark(100000);
    benchmark(1000000);
    benchmark(10000000);
}

function ByteArrayToUint32_2(bytes, offset, littleEndian) {
    if (offset == undefined)
        offset = 0;
    
    if (littleEndian)
        return ((bytes[offset + 3] << 24) >>> 0) + (bytes[offset + 2] << 16) + (bytes[offset + 1] << 8) + bytes[offset];
    else
        return ((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
}
function ByteArrayToUint32_3(bytes, offset, littleEndian) {
    if (littleEndian)
        return ((bytes[offset + 3] << 24) >>> 0) + (bytes[offset + 2] << 16) + (bytes[offset + 1] << 8) + bytes[offset];
    else
        return ((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
}
function ByteArrayToUint32_4(bytes, offset) {
    return ((bytes[offset + 3] << 24) >>> 0) + (bytes[offset + 2] << 16) + (bytes[offset + 1] << 8) + bytes[offset];
}

function ByteArrayToFloat32_2(buffer, offset, littleEndian) {
    var e
    var m;
    var mLen = 23;
    var eLen = 8;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = littleEndian ? 3 : 0 ;
    var d = littleEndian ? -1 : 1;
    var s = buffer[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = e * 0x100 + buffer[offset + i], i += d, nBits -= 8);

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = m * 0x100 + buffer[offset + i], i += d, nBits -= 8);

    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : s ? -Infinity : Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}

function ByteArrayToFloat64_2(buffer, offset, littleEndian) {
    var e
    var m;
    var mLen = 52;
    var eLen = 11;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = littleEndian ? 3 : 0 ;
    var d = littleEndian ? -1 : 1;
    var s = buffer[offset + i];

    i += d;

    e = s & ((1 << (-nBits)) - 1);
    s >>= (-nBits);
    nBits += eLen;
    for (; nBits > 0; e = e * 0x100 + buffer[offset + i], i += d, nBits -= 8);

    m = e & ((1 << (-nBits)) - 1);
    e >>= (-nBits);
    nBits += mLen;
    for (; nBits > 0; m = m * 0x100 + buffer[offset + i], i += d, nBits -= 8);

    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : s ? -Infinity : Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}

function multibench_float() {
    benchmark_float(10000);
    benchmark_float(100000);
    benchmark_float(1000000);
    benchmark_float(10000000);
}

function benchmark_float(iterations) {
    let data = new Array(1024);
    for (let i = 0; i < data.length; ++i)
        data[i] = Math.floor(Math.random() * 256);

    let result = 0;
    let startTime = 0;
    let endTime = 0;

    startTime = performance.now();
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 8));
        result += ByteArrayToFloat64(data, randomIndex, false);
    }
    endTime = performance.now();
    console.log("ByteArrayToFloat64: " + result);
    console.log("ByteArrayToFloat64: " + iterations + " iterations took: " + (endTime - startTime) + "ms");
    result = 0;

    startTime = performance.now();
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 8));
        result += ByteArrayToFloat64_2(data, randomIndex, false);
    }
    endTime = performance.now();
    console.log("ByteArrayToFloat64_2: " + result);
    console.log("ByteArrayToFloat64_2: " + iterations + " iterations took: " + (endTime - startTime) + "ms");
    result = 0;

    startTime = performance.now();
    const buffer = new Uint8Array(data);
    const view = new DataView(buffer.buffer);
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 8));
        result += view.getFloat64(randomIndex);
    }
    endTime = performance.now();
    console.log("DataView (create once): " + result);
    console.log("DataView (create once): " + iterations + " iterations took: " + (endTime - startTime) + "ms");
}

function benchmark(iterations) {
    let data = new Array(1024);
    for (let i = 0; i < data.length; ++i)
        data[i] = Math.floor(Math.random() * 256);

    let result = 0;
    let startTime = 0;
    let endTime = 0;

    startTime = performance.now();
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 4));
        result += ByteArrayToUint32(data, randomIndex);
    }
    endTime = performance.now();
    console.log("ByteArrayToUint32: " + result);
    console.log("ByteArrayToUint32: " + iterations + " iterations took: " + (endTime - startTime) + "ms");
    result = 0;

    startTime = performance.now();
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 4));
        result += ByteArrayToUint32_2(data, randomIndex);
    }
    endTime = performance.now();
    console.log("ByteArrayToUint32_2: " + result);
    console.log("ByteArrayToUint32_2: " + iterations + " iterations took: " + (endTime - startTime) + "ms");
    result = 0;
    
    startTime = performance.now();
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 4));
        result += ByteArrayToUint32_3(data, randomIndex);
    }
    endTime = performance.now();
    console.log("ByteArrayToUint32_3: " + result);
    console.log("ByteArrayToUint32_3: " + iterations + " iterations took: " + (endTime - startTime) + "ms");
    result = 0;
    
    startTime = performance.now();
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 4));
        result += ByteArrayToUint32_4(data, randomIndex);
    }
    endTime = performance.now();
    console.log("ByteArrayToUint32_4: " + result);
    console.log("ByteArrayToUint32_4: " + iterations + " iterations took: " + (endTime - startTime) + "ms");
    result = 0;

    startTime = performance.now();
    let buffer = new Uint8Array(data);
    let view = new DataView(buffer.buffer);
    for (let i = 0; i < iterations; ++i) {
        let randomIndex = Math.floor(Math.random() * (data.length - 4));
        result += view.getUint32(randomIndex);
    }
    endTime = performance.now();
    console.log("DataView (create once): " + result);
    console.log("DataView (create once): " + iterations + " iterations took: " + (endTime - startTime) + "ms");

    startTime = performance.now();
    for (let i = 0; i < iterations; ++i) {
        if (i % (data.length / 4) === 0) {
            buffer = new Uint8Array(data);
            view = new DataView(buffer.buffer);
        }
        let randomIndex = Math.floor(Math.random() * (data.length - 4));
        result += view.getUint32(randomIndex);
    }
    endTime = performance.now();
    console.log("DataView (create every 256): " + result);
    console.log("DataView (create every 256): " + iterations + " iterations took: " + (endTime - startTime) + "ms");
}
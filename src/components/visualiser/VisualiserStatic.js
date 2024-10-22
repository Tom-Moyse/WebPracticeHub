async function captureAudio(audioContext){
    console.log("WHOA")
    try {
        // Capture both video and audio from the screen
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        // Extract the audio track from the media stream
        const audioSource = audioContext.createMediaStreamSource(stream);

        // Create an analyser node for visualization
        const analyser = audioContext.createAnalyser();

        // Connect the audio source to the analyser
        audioSource.connect(analyser);

        return analyser

    } catch (err) {
        console.error('Error capturing desktop audio:', err);
    }
}

export function beginAnalyser() {
    console.log("HEY")
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
    const analyserpromise = captureAudio(audioContext)
    analyserpromise.then(analyser => {
        analyseAudio(analyser)
    }).catch(err => console.log(err));
} 

function analyseAudio(analyser){
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    analyser.fftSize = 2**14;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let WIDTH = canvas.width;
    let HEIGHT = canvas.height;
    let centerX = WIDTH / 2
    let centerY = HEIGHT / 2;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        centerX = WIDTH / 2
        centerY = HEIGHT / 2;
    })
    
    var mode = "bars";
    routeAnimation(mode);

    const dropdown = document.getElementById("visualiser-dropdown")
    dropdown.addEventListener("change", () => {
        const circForm = document.getElementById("circleOpts");
        const boxForm = document.getElementById("boxOpts");
        const hexbForm = document.getElementById("hexbOpts");
        const hexwForm = document.getElementById("hexwOpts");

        circForm.classList.add("hidden");
        boxForm.classList.add("hidden");
        hexbForm.classList.add("hidden");
        hexwForm.classList.add("hidden");
        mode = dropdown.value;
        switch (mode) {
            case "boxes":
                boxForm.classList.remove("hidden");
                break;
            case "circle":
                circForm.classList.remove("hidden");
                break;
            case "hexwave":
                hexwForm.classList.remove("hidden");
                break;
            case "hexbounce":
                hexbForm.classList.remove("hidden");
                break;
            default:
                break;
        }
    });

    setForm();

    let radius = parseFloat(document.getElementById("innerradius").value);
    let maxBarHeight = parseFloat(document.getElementById("outerradius").value);
    let interpolationCount = parseFloat(document.getElementById("interpolationcount").value);
    let smoothingFactor = parseFloat(document.getElementById("smoothingfactor").value);
    let scrollSpeed = parseFloat(document.getElementById("scrollspeed").value);
    let hueShift = parseFloat(document.getElementById("hueshift").value);
    let rotateSpeed = parseFloat(document.getElementById("rotatespeed").value);
    let exponentFactor = parseFloat(document.getElementById("exponentfactor").value);
    let strokeWidth = parseFloat(document.getElementById("strokewidth").value);
    let baseHue = parseFloat(document.getElementById("basehue").value);
    let maxIntensity = parseFloat(document.getElementById("maxintensity").value);
    let maxRotation = parseFloat(document.getElementById("maxrotation").value);
    let velConst = parseFloat(document.getElementById("velconst").value);
    let waveFreq = parseFloat(document.getElementById("wavefreq").value);
    let maxBright = parseFloat(document.getElementById("maxbrightness").value);
    let elementCount = Math.log2(dataArray.length) * interpolationCount;
    let indices = new Array(elementCount).fill(0).map((_, i) => i);
    shuffleIndices();
    
    document.getElementById("controlForm").addEventListener("input", () => {
        scrollSpeed = parseFloat(document.getElementById("scrollspeed").value);
        hueShift = parseFloat(document.getElementById("hueshift").value);
        exponentFactor = parseFloat(document.getElementById("exponentfactor").value);
        interpolationCount = parseFloat(document.getElementById("interpolationcount").value);
        smoothingFactor = parseFloat(document.getElementById("smoothingfactor").value);
        radius = parseFloat(document.getElementById("innerradius").value);
        maxBarHeight = parseFloat(document.getElementById("outerradius").value);
        strokeWidth = parseFloat( document.getElementById("strokewidth").value);
        rotateSpeed = parseFloat(document.getElementById("rotatespeed").value);
        baseHue = parseFloat(document.getElementById("basehue").value);
        maxIntensity = parseFloat(document.getElementById("maxintensity").value);
        maxRotation = parseFloat(document.getElementById("maxrotation").value);
        velConst = parseFloat(document.getElementById("velconst").value);
        waveFreq = parseFloat(document.getElementById("wavefreq").value);
        maxBright = parseFloat(document.getElementById("maxbrightness").value);
    })

    document.getElementById("interpolationcount").addEventListener('input', function () {
        elementCount = Math.log2(dataArray.length) * parseFloat(document.getElementById("interpolationcount").value);
        indices = new Array(elementCount).fill(0).map((_, i) => i);
        shuffleIndices();
        populateHexArrays();
    });

    document.getElementById("maxintensity").addEventListener('input', function () {
        const val = document.getElementById("maxintensity").value
        document.getElementById("maxintensity2").value = val;
        document.getElementById("maxintensity3").value = val;
    });

    document.getElementById("maxintensity2").addEventListener('input', function () {
        const val = document.getElementById("maxintensity2").value
        document.getElementById("maxintensity").value = val;
        document.getElementById("maxintensity3").value = val;
    });

    document.getElementById("maxintensity3").addEventListener('input', function () {
        const val = document.getElementById("maxintensity3").value
        document.getElementById("maxintensity2").value = val;
        document.getElementById("maxintensity").value = val;
    });

    var groupPositions = [];
    var groupDirections = [];
    populateHexArrays();

    function populateHexArrays(){
        groupPositions = [];
        groupDirections = []
        for (let i=0; i<Math.floor(elementCount / 7); i++){
            groupPositions.push([Math.floor((WIDTH / (2 * Math.floor(elementCount / 7))) + (i * (WIDTH / Math.floor(elementCount / 7)))), (0.05*HEIGHT) + (Math.random()*HEIGHT*0.9)]);
            let rand = (Math.random() * 2) - 1
            groupDirections.push([rand, Math.sqrt(1 - (rand**2))]);
        }
    }   
    
    

    function shuffleIndices(){
        for (let i = elementCount - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
    
            // Swap the indices
            const temp = indices[i];
            indices[i] = indices[j];
            indices[j] = temp;
        }
    }

    function drawBars() {
        let x = 0;
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        var barArray = processAudio(dataArray, interpolationCount, smoothingFactor);
        
        let barWidth = WIDTH / elementCount;

        //console.log(barArray.length)
        for (var i = 0; i < elementCount; i++) {
            
            let barHeight = (barArray[i]**exponentFactor);
            
            var h = (baseHue + (hueShift*i/elementCount) + (((Date.now() - prev)/1000) * scrollSpeed)) % 1
            var s = 1
            var v = Math.min(barHeight / maxBright, 1);
            var obj = HSVtoRGB(h, s, v);
    
            ctx.fillStyle = "rgb(" + obj.r + "," + obj.g + "," + obj.b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    
            x += barWidth + 1;
        }

        routeAnimation(mode);
    }

    function drawHexagonGroupSin() {
        analyser.getByteFrequencyData(dataArray);
    
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
        var barArray = processAudio(dataArray, interpolationCount, smoothingFactor);
        let groupUnitOffsets = [[0,0], [1,Math.sqrt(3)], [-1,Math.sqrt(3)], [-2,0], [2,0], [-1,-Math.sqrt(3)], [1,-Math.sqrt(3)]];

        let numCols = Math.floor(elementCount / groupUnitOffsets.length);
        let colOffset = WIDTH / numCols
        let columnOffsets = []
        for (let i=0; i<numCols; i++){
            columnOffsets.push(Math.floor((colOffset / 2) + (i * colOffset)))
        }
        let maxCircRadius = colOffset / 6;
        let heightRange = HEIGHT - (colOffset);
        const timePoint = ((Date.now() - prev)/1000);

        for (let i=0; i<elementCount; i++){
            let offset = groupUnitOffsets[i % groupUnitOffsets.length];
            let colIndex = Math.floor(i / groupUnitOffsets.length);
            const intensity = barArray[i]**exponentFactor;
            
            let circleRadius = Math.min(intensity / maxIntensity, 1) * maxCircRadius;
            let centerX = columnOffsets[colIndex] + (offset[0]*maxCircRadius);
            let centerY = (offset[1]*maxCircRadius) + (HEIGHT/2) + (heightRange/2 * Math.sin(timePoint + (colIndex * waveFreq * Math.PI / numCols)));

            var h = (baseHue + (hueShift*colIndex/columnOffsets.length) + (timePoint * scrollSpeed)) % 1
            var s = 1
            var v = Math.min(intensity / maxBright, 1);
            var obj = HSVtoRGB(h, s, v);
    
            ctx.fillStyle = "rgb(" + obj.r + "," + obj.g + "," + obj.b + ")";

            ctx.beginPath();
            ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
            ctx.fill();
        }

        routeAnimation(mode);
    }

    var prev = Date.now()

    function drawHexagonGroupBounce() {
        let curr = Date.now()
        let dt = Math.min(curr - prev, 0.05);
        if (dt == 0) { dt = 0.05; }
        analyser.getByteFrequencyData(dataArray);
    
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
        var barArray = processAudio(dataArray, interpolationCount, smoothingFactor);

        let groupUnitOffsets = [[0,0], [1,Math.sqrt(3)], [-1,Math.sqrt(3)], [-2,0], [2,0], [-1,-Math.sqrt(3)], [1,-Math.sqrt(3)]];
        let numGroups = Math.floor(elementCount / groupUnitOffsets.length);

        let maxCircRadius = WIDTH / (numGroups * 6);
        const timePoint = ((Date.now() - prev)/1000);

        let avgIntensity = []
        let intensitySum = 0
        for (let i=0; i<elementCount; i++){
            intensitySum += barArray[i]**exponentFactor
            if (i % 7 == 6){
                avgIntensity.push(intensitySum / 7)
                intensitySum = 0
            }
        }

        for (let i=0; i<elementCount; i++){
            let offset = groupUnitOffsets[i % groupUnitOffsets.length];
            let groupIndex = Math.floor(i / 7);
            if (groupIndex >= groupPositions.length){ break; }
            const intensity = avgIntensity[groupIndex];

            let circleRadius = Math.min(intensity / maxIntensity, 1) * maxCircRadius;
            let centerX = groupPositions[groupIndex][0] + (offset[0] * circleRadius);
            let centerY = groupPositions[groupIndex][1] + (offset[1] * circleRadius);

            var h = (baseHue + (hueShift*(centerX+centerY)/(WIDTH+HEIGHT)) + (timePoint * scrollSpeed)) % 1
            var s = 1
            var v = Math.min(intensity / maxBright, 1);
            var obj = HSVtoRGB(h, s, v);
    
            ctx.fillStyle = "rgb(" + obj.r + "," + obj.g + "," + obj.b + ")";

            ctx.beginPath();
            ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
            ctx.fill();
        }

        for (let i=0; i<numGroups; i++){
            let newX = groupPositions[i][0] + (groupDirections[i][0] * velConst * Math.min(avgIntensity[i] / maxIntensity, 1) * dt);
            let newY = groupPositions[i][1] + (groupDirections[i][1] * velConst * Math.min(avgIntensity[i] / maxIntensity, 1) * dt);

            if (newX > WIDTH - (maxCircRadius * 3)){
                newX = (2 * (WIDTH - (maxCircRadius * 3))) - newX
                groupDirections[i][0] *= -1
            }
            else if (newX < maxCircRadius * 3){
                newX = 2 * (maxCircRadius * 3) - newX
                groupDirections[i][0] *= -1
            }
            if (newY > HEIGHT - (maxCircRadius * 3)){
                newY = (2 * (HEIGHT - (maxCircRadius * 3))) - newY
                groupDirections[i][1] *= -1
            }
            else if (newY < maxCircRadius * 3){
                newY = 2 * (maxCircRadius * 3) - newY
                groupDirections[i][1] *= -1
            }

            groupPositions[i] = [newX, newY]
        }
        prev = curr;
        routeAnimation(mode);
    }

    function drawCircle() {
        analyser.getByteFrequencyData(dataArray);
    
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
        var barArray = processAudio(dataArray, interpolationCount, smoothingFactor);
    
        let barWidth = 2 * Math.PI / (elementCount);
        const timePoint = ((Date.now() - prev)/1000);
        for (var i = 0; i < elementCount; i++) {
            const barHeight = barArray[i]**exponentFactor;
    
            const angle = i * barWidth + (timePoint * rotateSpeed)
    
            const startX = centerX + radius * Math.cos(angle);
            const startY = centerY + radius * Math.sin(angle);
            const endX = centerX + (radius + (barHeight / maxBarHeight) * 100) * Math.cos(angle);
            const endY = centerY + (radius + (barHeight / maxBarHeight) * 100) * Math.sin(angle);
            //console.log(barHeight)
            var h = (baseHue + (hueShift*i/elementCount) + (timePoint * scrollSpeed)) % 1
            var s = 1
            var v = Math.min(barHeight / maxBright, 1);
            var obj = HSVtoRGB(h, s, v);
    
            ctx.strokeStyle = "rgb(" + obj.r + "," + obj.g + "," + obj.b + ")";
            ctx.lineWidth = strokeWidth; // Width of the bars
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke(); // Use stroke to draw lines
        }

        routeAnimation(mode);
    }

    function drawBoxes() {
        analyser.getByteFrequencyData(dataArray);
    
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
        var barArray = processAudio(dataArray, interpolationCount, smoothingFactor);

        const shuffledArray = new Float32Array(elementCount);
        for (let i=0; i<elementCount; i++){
            shuffledArray[i] = barArray[indices[i]];
        }

        let res = calculateAspectRatioGrid(WIDTH, HEIGHT, elementCount);
        let elSize = Math.floor(res.elementSize);

        for (let x=0; x<res.columns; x++){
            for (let y=0; y<res.rows; y++){
                let i = x + (y * res.columns);
                if (i >= elementCount) { break; } 
                let intensity = (shuffledArray[i]**exponentFactor);
                
                let coordX = Math.round(WIDTH * x / res.columns);
                let coordY = Math.round(HEIGHT * y / res.rows);
                let sizeReduction = Math.min(intensity/maxIntensity, 1) * elSize;

                var h = (baseHue + (hueShift*(x*y)/elementCount) + (((Date.now() - prev)/1000) * scrollSpeed)) % 1
                var s = 1
                var v = Math.min(intensity / maxBright, 1);
                var obj = HSVtoRGB(h, s, v);
        
                ctx.fillStyle = "rgb(" + obj.r + "," + obj.g + "," + obj.b + ")";

                ctx.save();

                let centerX = coordX + elSize / 2;
                let centerY = coordY + elSize / 2;
                ctx.translate(centerX, centerY);

                // Rotate the canvas based on the intensity value (convert to radians)
                let angle = Math.min(intensity / maxIntensity, 1) * Math.PI * maxRotation; // Full circle rotation based on intensity
                ctx.rotate(angle);

                // Draw the rectangle (adjusting to draw from the center)
                let halfSize = sizeReduction / 2;
                ctx.fillRect(-halfSize, -halfSize, sizeReduction, sizeReduction);

                // Restore the canvas state to avoid affecting the next drawing
                ctx.restore();
                //ctx.fillRect(coordX+Math.floor((elSize-sizeReduction)/2), coordY+Math.floor((elSize-sizeReduction)/2), sizeReduction, sizeReduction);
            }
        }

        routeAnimation(mode);
    }

    function routeAnimation(mode){
        switch (mode) {
            case "circle":
                requestAnimationFrame(drawCircle);
                break;
            case "bars":
                requestAnimationFrame(drawBars);
                break;
            case "boxes":
                requestAnimationFrame(drawBoxes);
                break;
            case "hexbounce":
                requestAnimationFrame(drawHexagonGroupBounce);
                break;
            case "hexwave":
                requestAnimationFrame(drawHexagonGroupSin);
                break;
            default:
                break;
        }
    }
}

function calculateAspectRatioGrid(width, height, numElements) {
    // Step 1: Calculate the desired aspect ratio
    const targetAspectRatio = width / height;

    // Step 2: Initialize variables to store the best grid dimensions
    let bestColumns = 1;
    let bestRows = numElements;
    let bestAspectRatioDifference = Infinity;

    // Step 3: Loop through potential numbers of columns and rows
    for (let columns = 1; columns <= numElements; columns++) {
        let rows = Math.ceil(numElements / columns);

        // Calculate the grid's aspect ratio
        let gridAspectRatio = columns / rows;
        let aspectRatioDifference = Math.abs(gridAspectRatio - targetAspectRatio);

        // Step 4: Choose the grid that most closely matches the target aspect ratio
        if (aspectRatioDifference < bestAspectRatioDifference) {
            bestColumns = columns;
            bestRows = rows;
            bestAspectRatioDifference = aspectRatioDifference;
        }

        // Break if an exact match is found
        if (aspectRatioDifference === 0) {
            break;
        }
    }

    // Step 5: Calculate the element size based on the best fit
    const elementSize = Math.min(width / bestColumns, height / bestRows);

    // Return the calculated number of columns, rows, and element size
    return {
        columns: bestColumns,
        rows: bestRows,
        elementSize: elementSize
    };
}

function processAudio(dataArray, interpolationRate, smoothingWindow){
    const logBins = Math.log2(dataArray.length);
    const logDataArray = new Uint8Array(logBins);

    for (let i=0; i<logBins; i++){
        const startIndex = Math.floor(Math.pow(2, i) - 1);
        const endIndex = Math.min(startIndex * 2, dataArray.length);

        let sum = 0;
        let count = 0;

        for (let j = startIndex; j < endIndex; j++) {
            sum += dataArray[j];
            count++;
        }
        
        logDataArray[i] = sum / count;
    }

    const totalBars = interpolationRate * logBins;
    const interpolatedDataArray = new Float32Array(totalBars);
    for (let i = 0; i < logBins - 1; i++) {
        const startHeight = logDataArray[i];
        const endHeight = logDataArray[i + 1];

        for (let j = 0; j < interpolationRate; j++) {
            const t = j / interpolationRate; // Normalized value between 0 and 1
            interpolatedDataArray[i * interpolationRate + j] = startHeight + (endHeight - startHeight) * t;// Math.log2(t+1);
        }
    }

    return smoothArray(interpolatedDataArray, smoothingWindow);
}

function smoothArray(inputArray, windowSize) {
    const smoothedArray = new Float32Array(inputArray.length);
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < inputArray.length; i++) {
        let sum = 0;
        let count = 0;

        // Calculate the sum of the window
        for (let j = -halfWindow; j <= halfWindow; j++) {
            const index = i + j;

            if (index >= 0 && index < inputArray.length) {
                sum += inputArray[index];
                count++;
            }
        }

        // Average the values within the window
        smoothedArray[i] = sum / count;
    }
    return smoothedArray;
}

function smoothArrayRegion(inputArray, windowSize, startIndex, Length) {
    const smoothedArray = new Float32Array(inputArray.length);
    const halfWindow = Math.floor(windowSize / 2);
    const wrap = startIndex + Length >= inputArray.length;


    for (let i = 0; i < inputArray.length; i++) {
        if (i >= startIndex && i < startIndex + Length || wrap && i < (startIndex + Length) % inputArray.length){
        let sum = 0;
        let count = 0;

        // Calculate the sum of the window with wrap-around
        for (let j = -halfWindow; j <= halfWindow; j++) {
            const index = (i + j + inputArray.length) % inputArray.length; // Wrap around

            sum += inputArray[index];
            count++;
        }

        // Average the values within the window
        smoothedArray[i] = sum / count;
        }
        else{
            smoothedArray[i] = inputArray[i];
        }
    }

    return smoothedArray;
}

function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


export function saveConfig(){
    let config = {};
    config["innerradius"] = document.getElementById("innerradius").value
    config["outerradius"] = document.getElementById("outerradius").value
    config["interpolationcount"] = document.getElementById("interpolationcount").value
    config["smoothingfactor"] = document.getElementById("smoothingfactor").value
    config["scrollspeed"] = document.getElementById("scrollspeed").value
    config["hueshift"] = document.getElementById("hueshift").value
    config["rotatespeed"] = document.getElementById("rotatespeed").value
    config["exponentfactor"] = document.getElementById("exponentfactor").value
    config["strokewidth"] = document.getElementById("strokewidth").value
    config["basehue"] = document.getElementById("basehue").value
    config["maxintensity"] = document.getElementById("maxintensity").value;
    config["maxrotation"] = document.getElementById("maxrotation").value;
    config["velconst"] = document.getElementById("velconst").value;
    config["wavefreq"] = document.getElementById("wavefreq").value;
    config["maxbrightness"] = document.getElementById("maxbrightness").value;

    window.sessionStorage.setItem("config", JSON.stringify(config));

    document.getElementById("configsave").textContent = "Config Saved"
    document.getElementById("configsave").disabled = true;

    setTimeout(() => {
        document.getElementById("configsave").textContent = "Save Config"
        document.getElementById("configsave").disabled = false;
    }, 1000);
}

export function defaultConfig(){
    document.getElementById("innerradius").value = "40";
    document.getElementById("outerradius").value = "150";
    document.getElementById("interpolationcount").value = "10";
    document.getElementById("smoothingfactor").value = "4";
    document.getElementById("scrollspeed").value = "0.1";
    document.getElementById("hueshift").value = "0.2";
    document.getElementById("rotatespeed").value = "1.5";
    document.getElementById("exponentfactor").value = "1.15";
    document.getElementById("strokewidth").value = "12";
    document.getElementById("basehue").value = "0";
    document.getElementById("maxintensity").value = "400";
    document.getElementById("maxrotation").value = "0.5";
    document.getElementById("velconst").value = "100";
    document.getElementById("wavefreq").value = "2";
    document.getElementById("maxbrightness").value = "200";

    document.getElementById("controlForm").dispatchEvent(new Event("input"));
    document.getElementById("interpolationcount").dispatchEvent(new Event("input"));
}


function setForm(){
    let config = JSON.parse(window.sessionStorage.getItem("config"));
    if (config != null){
        document.getElementById("innerradius").value = config["innerradius"]
        document.getElementById("outerradius").value = config["outerradius"]
        document.getElementById("interpolationcount").value = config["interpolationcount"]
        document.getElementById("smoothingfactor").value = config["smoothingfactor"]
        document.getElementById("scrollspeed").value = config["scrollspeed"]
        document.getElementById("hueshift").value = config["hueshift"]
        document.getElementById("rotatespeed").value = config["rotatespeed"]
        document.getElementById("exponentfactor").value = config["exponentfactor"]
        document.getElementById("strokewidth").value = config["strokewidth"]
        document.getElementById("basehue").value = config["basehue"]
        document.getElementById("maxintensity").value = config["maxintensity"];
        document.getElementById("maxintensity2").value = config["maxintensity"];
        document.getElementById("maxintensity3").value = config["maxintensity"];
        document.getElementById("maxrotation").value = config["maxrotation"];
        document.getElementById("velconst").value = config["velconst"];
        document.getElementById("wavefreq").value = config["wavefreq"];
        document.getElementById("maxbrightness").value = config["maxbrightness"];
    }
}
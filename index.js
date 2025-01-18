let selection = document.querySelector("select");
let select = selection.value;
let currentAlgo ="lz77";


selection.addEventListener("change", function() {
    select = selection.value;
    currentAlgo = select;
});
selection.addEventListener("change", function() {
    select = selection.value;
    currentAlgo = select;
});







function lz77Compress(input) {
	const searchBufferSize = 255;
	const lookAheadBufferSize = 15;
	let compressed = [];
	let i = 0;

	while (i < input.length) {
		let matchLength = 0;
		let matchDistance = 0;
		let searchBufferStart = Math.max(0, i - searchBufferSize);

		for (let j = searchBufferStart; j < i; j++) {
			let k = 0;
			while (k < lookAheadBufferSize && input[j + k] === input[i + k]) {
				k++;
			}
			if (k > matchLength) {
				matchLength = k;
				matchDistance = i - j;
			}
		}

		if (matchLength > 0) {
			compressed.push([matchDistance, matchLength, input[i + matchLength]]);
			i += matchLength + 1;
		} else {
			compressed.push([0, 0, input[i]]);
			i++;
		}
	}

	return compressed;
}

function lz77Decompress(compressed) {
	let decompressed = "";

	for (let i = 0; i < compressed.length; i++) {
		let [distance, length, nextChar] = compressed[i];
		if (distance === 0 && length === 0) {
			decompressed += nextChar;
		} else {
			let start = decompressed.length - distance;
			for (let j = 0; j < length; j++) {
				decompressed += decompressed[start + j];
			}
			decompressed += nextChar;
		}
	}

	return decompressed;
}

const inputElement = document.querySelector(".input-box");
const compressButton = document.querySelector(".button");
const decompressButton = document.querySelector(".decompress");
const outputElement = document.querySelector(".output-area");

compressButton.addEventListener("click", () => {

	const input = inputElement.value;
    if(currentAlgo === "lz77"){
        const compressed = lz77Compress(input);
        outputElement.textContent = JSON.stringify(compressed);
    }else if(currentAlgo === "lz78"){
        const compressed = lz78Compress(input);
        outputElement.textContent = JSON.stringify(compressed);
    }else if(currentAlgo === "lzw"){
        const compressed = lzwCompress(input);
        outputElement.textContent = JSON.stringify(compressed);
    }
});



function lz78Compress(input) {
    let dictionary = {}; 
    let output = []; 
    let nextIndex = 1; 
    let currentSubstring = "";

    for (let i = 0; i < input.length; i++) {
        currentSubstring += input[i]; 
        
        
        if (!(currentSubstring in dictionary)) {
            
            if (currentSubstring.length === 1) {
                output.push([0, currentSubstring]); 
            } else {
                output.push([dictionary[currentSubstring.slice(0, -1)] || 0, currentSubstring.slice(-1)]); 
              
            }
            dictionary[currentSubstring] = nextIndex++; 
            currentSubstring = ""; 
        }
    }
   
    if (currentSubstring.length > 0) {
        output.push([dictionary[currentSubstring.slice(0, -1)] || 0, currentSubstring.slice(-1)]);
    }

    return output;
}


function lz78Decompress(compressed) {
    let dictionary = [];
    let output = "";

    compressed.forEach(([index, char]) => {
        if (index === 0) {
            output += char;
            dictionary.push(char);
        } else {
            let newSubstring = dictionary[index - 1] + char;
            output += newSubstring;
            dictionary.push(newSubstring);
        }
    });

    return output;
}


function lzwCompress(input) {
    let dictionary = {};
    let data = input.split("");
    let out = [];
    let phrase = data[0];
    let code = 256;
    for (let i = 1; i < data.length; i++) {
        let currentChar = data[i];
        if (dictionary[phrase + currentChar] != null) {
            phrase += currentChar;
        } else {
            out.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));
            dictionary[phrase + currentChar] = code;
            code++;
            phrase = currentChar;
        }
    }
    out.push(phrase.length > 1 ? dictionary[phrase] : phrase.charCodeAt(0));
    return out;
}

function lzwDecompress(input) {
    let dictionary = {};
    let data = input;
    let currentChar = String.fromCharCode(data[0]);
    let oldPhrase = currentChar;
    let out = [currentChar];
    let code = 256;
    let phrase;
    for (let i = 1; i < data.length; i++) {
        let currCode = data[i];
        if (currCode < 256) {
            phrase = String.fromCharCode(data[i]);
        } else {
            phrase = dictionary[currCode] ? dictionary[currCode] : (oldPhrase + currentChar);
        }
        out.push(phrase);
        currentChar = phrase.charAt(0);
        dictionary[code] = oldPhrase + currentChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

decompressButton.addEventListener("click", () => {
    const compressed = JSON.parse(inputElement.value);
    let decompressed;
    if (currentAlgo === "lz77") {
        decompressed = lz77Decompress(compressed);
    } else if (currentAlgo === "lz78") {
        decompressed = lz78Decompress(compressed);
    } else if (currentAlgo === "lzw") {
        decompressed = lzwDecompress(compressed);
    }
    outputElement.textContent = decompressed;
});

decompressButton.addEventListener("click", () => {
	const compressed = JSON.parse(inputElement.value);
	const decompressed = lz77Decompress(compressed);
	outputElement.textContent = decompressed;
});

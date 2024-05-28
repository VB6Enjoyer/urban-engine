import { parseArrayBuffer } from 'midi-json-parser';

export function parseMidiFile(file: File): Promise<[string, number][]> {
    return new Promise<[string, number][]>((resolve, reject) => {
        const reader = new FileReader();

        // Handle the file loading process.
        reader.onload = (event) => {
            if (event.target && event.target.result instanceof ArrayBuffer) {
                const arrayBuffer = event.target.result;

                // Parse the MIDI data into JSON using parseArrayBuffer.
                parseArrayBuffer(arrayBuffer).then((json) => {
                    console.log('Parsed MIDI JSON:', json);

                    const notesArray = processMidiJson(json);
                    resolve(notesArray);
                }).catch((error) => {
                    console.error('Error parsing MIDI:', error);
                    reject(error);
                });
            } else {
                console.error('Failed to read MIDI file.');
                reject(new Error('Failed to read MIDI file.'));
            }
        };

        reader.readAsArrayBuffer(file);
    });
}

function processMidiJson(json: any) { // json shouldn't be "any", but I couldn't find the correct type for this.
    console.log('Processing MIDI JSON:', json);

    const jsonArray = convertArraysToObjectArrays(Object.values(json));
    let notesArray: [string, number][] = [];
    let tempo = 0;

    // Check for the position of the property that defines the MIDI's tempo within the json.
    for (const track of jsonArray) {
        const stack: any[] = [track];

        while (stack.length > 0) {
            const current = stack.pop();

            if (current && typeof current === 'object') {
                if (current.hasOwnProperty('setTempo')) {
                    tempo = current.setTempo.microsecondsPerQuarter;
                    break;
                }
                for (const key in current) {
                    if (current[key] && typeof current[key] === 'object') {
                        stack.push(current[key]);
                    }
                }
            }
        }
        if (tempo > 0) {
            break;
        }
    }

    const bpm = 60000 / (tempo / 1000); // Beats per minute.
    const division = json.division; // Division value from MIDI file.
    const msPerTick = 60000 / (bpm * division)

    for (let i = 0; i < jsonArray[2][1].length; i++) {
        const currentObject = jsonArray[2][1][i];
        const previousObject = jsonArray[2][1][i - 1];

        if (currentObject.noteOn) {
            if (previousObject.noteOn) { // If the previous note is a noteOn, then it is a chord and only the delta of one note is necessary.
                notesArray.push([String(currentObject.noteOn.noteNumber), ((currentObject.delta) * msPerTick)]);
            } else {
                notesArray.push([String(currentObject.noteOn.noteNumber), ((currentObject.delta + previousObject.delta) * msPerTick)]);
            }
        }
    }

    // Accommodate the note values so that they can be used with the code's implementation.
    for (let i = 0; i < notesArray.length; i++) {
        const noteValue = notesArray[i][0];

        switch (noteValue) {
            case "98": {
                notesArray[i][0] = "0";
                break;
            }
            case "99": {
                notesArray[i][0] = "1";
                break;
            }
            case "100": {
                notesArray[i][0] = "2";
                break;
            }
            case "95": {
                notesArray[i][0] = "3";
                break;
            }
            case "96": {
                notesArray[i][0] = "4";
                break;
            }
            case "97": {
                notesArray[i][0] = "5";
                break;
            }
        }
    }

    console.log(notesArray);
    return notesArray;
}

function convertArraysToObjectArrays(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(convertArraysToObjectArrays); // If it's an array, recursively convert its elements.
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            obj[key] = convertArraysToObjectArrays(obj[key]); // If it's an object, recursively convert its properties.
        }
    }

    return obj; // If it's neither an array nor an object, return it as is.
}
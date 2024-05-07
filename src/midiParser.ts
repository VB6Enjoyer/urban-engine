import { parseArrayBuffer } from 'midi-json-parser';

// Function to parse a MIDI file
export function parseMidiFile(file: File): Promise<[string, number][]> {
    return new Promise<[string, number][]>((resolve, reject) => {
        const reader = new FileReader();

        // Handle the file loading process
        reader.onload = (event) => {
            if (event.target && event.target.result instanceof ArrayBuffer) {
                const arrayBuffer = event.target.result;

                // Parse the MIDI data into JSON using parseArrayBuffer
                parseArrayBuffer(arrayBuffer).then((json) => {
                    // json is the JSON representation of the MIDI file
                    console.log('Parsed MIDI JSON:', json);

                    // Call a function to process the parsed MIDI JSON
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

        // Read the MIDI file as an ArrayBuffer using FileReader
        reader.readAsArrayBuffer(file);
    });
}

function processMidiJson(json: any) {
    console.log('Processing MIDI JSON:', json);
    const jsonArray = convertArraysToObjectArrays(Object.values(json));
    let notesArray: [string, number][] = [];
    const tempo = json.tracks[0][1].setTempo.microsecondsPerQuarter; // Tempo in microseconds per quarter note
    const bpm = 60000 / (tempo / 1000);
    const division = json.division; // Division value from MIDI file
    const msPerTick = 60000 / (bpm * division)
    console.log(msPerTick);

    for (let i = 0; i < jsonArray[2][1].length; i++) {
        const currentObject = jsonArray[2][1][i];

        if (currentObject.noteOn) {
            if (jsonArray[2][1][i - 1].noteOn) { // If the previous note is a noteOn, then it is a chord and only the delta of one note is necessary.
                notesArray.push([String(currentObject.noteOn.noteNumber - 96), ((currentObject.delta) * msPerTick)]);
            } else {
                notesArray.push([String(currentObject.noteOn.noteNumber - 96), ((currentObject.delta + jsonArray[2][1][i + 1].delta) * msPerTick)]);
            }
        }
    }

    console.log(notesArray);
    return notesArray;
}

// Function to calculate the duration of a note in ticks
/* function calculateNoteDuration(track: any[], currentIndex: number): number {
    let durationTicks = 0;
    let i = currentIndex;

    // Start at the current note event and iterate until a noteOff event is found
    while (i < track.length && !track[i].noteOff) {
        durationTicks += track[i].delta; // Accumulate delta times
        i++;
    }

    durationTicks += track[i].delta; // Include the delta time of the noteOff event
    return durationTicks;
} */

function convertArraysToObjectArrays(obj: any): any {
    if (Array.isArray(obj)) {
        // If it's an array, recursively convert its elements
        return obj.map(convertArraysToObjectArrays);
    } else if (typeof obj === 'object') {
        // If it's an object, recursively convert its properties
        for (const key in obj) {
            obj[key] = convertArraysToObjectArrays(obj[key]);
        }
    }
    // If it's neither an array nor an object, return it as is
    return obj;
}
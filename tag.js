import notes from './notes.json' assert { type: 'json' };

async function main() {
    console.log(notes.length)
}

main()
export function check_if_ready_asap(note) {
    const body = note.bodyText
    // console.log(body)
    const textToFind = `_i'm_ready_to_start_immediately`
    return body.includes(textToFind)
}

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
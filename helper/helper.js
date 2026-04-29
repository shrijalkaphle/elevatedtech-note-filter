
const QUESTION = `Where are you in the decision-making process on investing in support for your next role?`
const ANSWER = `_i'm_ready_to_start_immediately`

export function check_if_ready_asap(note) {
    const body = note.bodyText
    // console.log(body)
    
    const questionExists = body.includes(QUESTION)
    const startingImmidiatly = body.includes(ANSWER)

    if(!questionExists) return 'question not found - skip add tag'
    if(startingImmidiatly) return 'question and answer found - skip add tag'
    return 'question found but answer not found - add tag'
}

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function check_if_note_is_related(note) {
    // return false if no note found
    if(!note) return false
    const body = note.bodyText

    // check if question exists in note 
    const questionExists = body.includes(QUESTION)

    if(!questionExists) return false    // question not found - note inadmissible
    else return true    // question found - can proceed to answer check
}

export function check_if_contact_is_ready(note) {

    const body = note.bodyText

    // check if answer exists in note 
    const answerExists = body.includes(ANSWER)

    if(!answerExists) return true    // contact not ready to start immidiately - add tag
    else return false    // contact ready to start immidiatly - skip adding tag
}
require('dotenv').config()

const axios = require('axios')
const TOKEN = process.env.ACCESS_KEY
const ENDPOINT = process.env.API_URI
const LOCATIONID = process.env.LOCATION_ID

function check_if_ready_asap(note) {
    const body = note.bodyText
    // console.log(body)
    const textToFind = `_i'm_ready_to_start_immediately`
    return body.includes(textToFind)
}


async function main() {
    try {
        let totalRecord = 500
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        const contacts = []
        const headers = {
            Authorization: `Bearer ${TOKEN}`,
            Accept: 'application/json',
            Version: '2021-07-28',

        }

        do {
            const body = {
                locationId: LOCATIONID,
                pageLimit: 500,
                searchAfter: contacts.length ? contacts[contacts.length - 1].searchAfter : [],
                filters: [
                    {
                        field: 'dateAdded',
                        operator: 'range',
                        value: {
                            gt: sixMonthsAgo,
                            lt: now
                        }
                    }
                ]
            }
            const response = await axios.post(`${ENDPOINT}/contacts/search`, body, {
                headers
            })
            totalRecord = response.data.total;
            console.log(totalRecord)
            contacts.push(...response.data.contacts)
            console.log('looped')
        } while (contacts.length < totalRecord)

        // contacts.forEach(async contct => {
        //     const contactId = contct.id;
        //     const notes = await axios.get(`${ENDPOINT}/contacts/${contactId}/notes`, { headers });
        //     let exists = false;
        //     if(notes.data.notes[0]) exists = check_if_ready_asap(notes.data.notes[0])
        //     console.log(exists ? `${contct.email} no tag added` : `${contct.email} tag added`)
        // })
        // const contactId = response.data.contacts[1].id;
        console.log(contacts.length)
        // 
    } catch (e) {
        console.log('error', e.response);
    }
}

main()
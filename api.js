import 'dotenv/config'
import axios from 'axios'

const TOKEN = process.env.ACCESS_KEY
const ENDPOINT = process.env.API_URI
const LOCATIONID = process.env.LOCATION_ID

const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/json',
    Version: '2021-07-28',
}

const now = new Date();
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(now.getMonth() - 6);

export async function getContacts(searchAfter = []) {
    const body = {
        locationId: LOCATIONID,
        pageLimit: 500,
        searchAfter: searchAfter,
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
    return response.data
}

export async function getContactNote(contactId) {
    try {
        const response = await axios.get(`${ENDPOINT}/contacts/${contactId}/notes`, { headers });
        return response.data.notes[0]
    } catch (e) {
        console.log(e)
    }
}

export async function addTagToContact(contactId) {
    try {
        const response = await axios.post(`${ENDPOINT}/contacts/${contactId}/tags`, {
            tags: ['lt-lead']
        }, { headers });
        return response.data
    } catch (e) {
        console.log(e)
    }
}
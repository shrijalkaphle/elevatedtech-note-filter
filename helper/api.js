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

export async function removeTagFromContact(contactId) {

    let data = JSON.stringify({
        "tags": [
            "lt-lead"
        ]
    });

    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Version': '2021-07-28',
            'Authorization': `Bearer ${TOKEN}`
        },
        data: data
    };
    try {
        const response = await axios.request(config);
        return response.data
    } catch (e) {
        console.log(headers)
    }
}

export async function readConversatation(contactId) {
    try {
        const response = await axios.get(`${ENDPOINT}/conversations/search?locationId=${LOCATIONID}&contactId=${contactId}`, { headers });
        return response.data
    } catch (e) {
        console.log(e)
    }
}

export async function deleteFromWrokflow(contactId) {
    try {
        const data = JSON.stringify({
            eventStartTime: new Date()
        })

        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${ENDPOINT}/contacts/${contactId}/workflow/bc59cb56-1c66-4cec-9bdc-a1f44d3aef63`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Version': '2021-07-28',
                'Authorization': `Bearer ${TOKEN}`
            },
            data: data
        };
        const response = await axios.request(config);
        return response.data
    } catch (e) {
        console.log(e)
    }
}
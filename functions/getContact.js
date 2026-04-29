import fs from 'fs'
import { getContacts } from '../helper/api.js'
import { wait } from '../helper/helper.js'

async function main() {
    try {

        let totalRecord = 500
        let searchAfter = []
        const csvHeader = "Email,Notes,Tag Added"
        let csvData = ''
        let loop = 1

        const allContacts = []

        do {
            const { contacts = [], total = 0 } = await getContacts(searchAfter);
            totalRecord = total;

            if (!contacts.length) {
                console.log('No more contacts returned, stopping loop.');
                break;
            }
            if(loop === 1) {
                console.log('total loops to run ---- ', (totalRecord/500))
            }

            allContacts.push(...contacts)
            const last = contacts[contacts.length - 1];
            searchAfter = last?.searchAfter || [];
            loop++
            console.log('wait before next loop no ', loop)
            await wait(200)


        } while (allContacts.length < totalRecord)


        fs.writeFile('contact.json', JSON.stringify(allContacts, null, 2), (err) => {
            if (err) throw err;
            console.log('JSON file saved!');
        });

    } catch (e) {
        console.log(e)
    }
}

main();
const { Elarian } = require('elarian')
const axios = require('axios')

const client = new Elarian({
    orgId: 'el_org_eu_0D9oSz',
    appId: 'el_app_RHxMCG',
    apiKey: 'el_k_test_201a8b4f6b9421b938381cdd45563dc46fdd2307ec535836b0c67a8603229201'
});

const whatsAppChannel = {
    number: '+254707926812',
    channel: 'whatsapp'
}

const smsChannel = {
    number: '75922',
    channel: 'sms'
}

const paymentChannel = {
    number: '+254707926812',
    channel: 'whatsapp'
}


async function onConnected() {
    // Ready to interact with customers
    console.log('connected...')
    let customer = new client.Customer({
        number: '+254707926812',
        provider: 'cellular'
    })

    const resp = customer.sendMessage(smsChannel, {
        body: {
            text: `You have been connected...`
        }
    })
    console.log('Sent connected message...')

}

async function handleUssd(notification, customer, appData, callback) {
    console.log(notification)

    customer = new client.Customer({
        number: '+254707926812',
        provider: 'cellular'
    })

    const input = notification.input.text

    const menu = {
        text: '',
        isTerminal: false
    }

    if (input === '') {
        menu.text = 'Do you wish to get your 2FA code?\n'
        menu.text += '1. Yes!\n2. No!\n'

        callback(menu, appData)

    } else if (parseInt(input) === 1) {
        let response = await axios.get('http://localhost:8000/send')


        const resp = customer.sendMessage(smsChannel, {
            body: {
                text: `Your 2FA code is ${response.data}. Do not share it with anyone.`
            }
        })
        menu.text = 'You will receive your code shortly...'
        console.log('Sent connected message...')
        menu.isTerminal = true

        callback(menu, appData)
    } else if (parseInt(input) === 2) {
        menu.text = 'Request cancelled. Thank you.'
        menu.isTerminal = true

        callback(menu, appData)
    }
}

client
    .on('error', (err) => console.error(err))
    .on('connected', onConnected)
    .on('ussdSession', handleUssd)
    .connect();
const amqp = require('amqplib')
 
amqp.connect('amqp://localhost')
    .then(conn => {
        return conn.createChannel().then(ch => {
            const ok = ch.assertQueue('Orderan', { durable: false })
            console.log('Mencari Orderan Masuk!')
            ok.then(() => {
                return ch.consume('Orderan', msg => console.log('Orderan Masuk : ', msg.content.toString()), { noAck: true })
                
            })
        })
    }).catch(console.warn)
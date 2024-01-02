const amqp = require('amqplib');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function handleOrderInput() {
    rl.question('Masukan Orderan (atau ketik "exit" untuk keluar): ', (pesanan) => {
        if (pesanan.toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        console.log('Orderan Terkirim : ' + pesanan + '|');

        amqp.connect('amqp://localhost')
            .then(conn => {
                return conn.createChannel().then(ch => {
                    const q = 'Orderan';
                    const msg = pesanan;
                    const ok = ch.assertQueue(q, { durable: false });
                    return ok.then(() => {
                        ch.sendToQueue(q, Buffer.from(msg));
                        return ch.close();
                    }).finally(() => conn.close());
                }).catch(console.warn).finally(() => {
                    handleOrderInput(); // Panggil kembali fungsi untuk input berikutnya setelah pengiriman pesan selesai
                });
            });
    });
}

console.log(' Pilihan ');
console.log('1. Masukan Data ');
console.log('2. Exit ');

rl.question('Masukan Pilihan : ', (pilihan) => {
    
    if (pilihan === '1') {
        handleOrderInput();
    } else if (pilihan === '2') {
        rl.close();
    } else {
        console.log('Pilihan tidak valid');
        rl.close();
    }
});

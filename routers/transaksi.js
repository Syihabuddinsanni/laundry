/*
 $$$$$$\   $$$$$$\   $$$$$$\   $$$$$$\  
$$  __$$\ $$  __$$\ $$  __$$\ $$  __$$\ 
$$ /  $$ |\__/  $$ |\__/  $$ |\__/  $$ |
 $$$$$$  | $$$$$$  | $$$$$$  | $$$$$$  |
$$  __$$< $$  ____/ $$  ____/ $$  ____/ 
$$ /  $$ |$$ |      $$ |      $$ |      
\$$$$$$  |$$$$$$$$\ $$$$$$$$\ $$$$$$$$\ 
 \______/ \________|\________|\________|                                
*/

const express = require("express")
const app = express()
app.use(express.json())

// call model
const models = require("../models/index")
const transaksi = models.transaksi


// panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
app.use(auth)

const detail_transaksi = models.detail_transaksi


// endpoint get data transaksi / detail transaksi
app.get("/", async(request, response) => {
    let dataTransaksi = await transaksi.findAll()
    return response.json(dataTransaksi) 
})


// endpoint new transaksi
app.post("/", (request,response) => {
    let newTransaksi = {
        id_member: request.body.id_member,
        tgl: request.body.tgl,
        batas_waktu: request.body.batas_waktu,
        tgl_bayar: request.body.tgl_bayar,
        status: 1,
        dibayar: request.body.dibayar,
        id_user: request.body.id_user
    }

    transaksi.create(newTransaksi)
    .then(result => {
        /* jika insert transaksi berhasil, lanjut
        insert data detail transaksi */
        let newIDTransaksi = result.id_transaksi

        let detail = request.body.detail_transaksi
        for (let i = 0; i < detail.length; i++) {
       
            /* nilai detail[i] hanya punya key id_paket
             dan qty*/ 
            detail[i].id_transaksi = newIDTransaksi
        }

        // proses insert detail_transaksi
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `Data transaksi berhasil ditambahkan`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})
app.put("/:id_transaksi", async (request, response) => {
    //tampung data utk update 
    let dataTransaksi = {
        id_member: request.body.id_member,
        tgl: request.body.tgl,
        batas_waktu: request.body.batas_waktu,
        tgl_bayar: request.body.tgl_bayar,
        status: request.body.status,
        dibayar: request.body.dibayar,
        id_user: request.body.id_user
    }
    //tampung parameter id_transaksi
    let parameter ={
        id_transaksi : request.params.id_transaksi
    }
    transaksi.update(dataTransaksi, {where: parameter})
    .then(async (result) =>  {
        //hapus data transaksi yang lama
        await detail_transaksi.destroy({where: parameter})

        //masukan data detail yang baru
        let detail = request.body.detail_transaksi
        for (let i = 0; i < detail.length; i++) {
       
            /* nilai detail[i] hanya punya key id_paket
             dan qty*/ 
            detail[i].id_transaksi = request.params.id_transaksi
        }

        // proses insert detail_transaksi
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `Data transaksi berhasil diubah`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

// endpoit untk mengubah status transaksi
app.post("/status/:id_transaksi", (request, response) => {
    // kita tampung nilai status
    let data = {
        status : request.body.status
    }

    // kita tampung parameter
    let parameter = {
        id_transaksi : request.params.id_transaksi
    }

    // proses update status transaksi
    transaksi.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data status berhasil diubah`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })

})
// endpoint untuk mengubah status pembayaran
app.get("/bayar/:id_transaksi", (request, response) => {
    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    let data = {
        // mendapatkan tanggal yan saat ini berjalan
        tgl_bayar: new Date().toISOString().split("T")[0],
        dibayar: true
    }

    // proses ubah transaksi
    transaksi.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Transaksi telah dibayar`
        })
    })
    .catch(result => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app
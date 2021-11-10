/*
 $$$$$$\    $$\     $$\     $$\   
$$  __$$\ $$$$ |  $$$$ |  $$$$ |  
$$ /  $$ |\_$$ |  \_$$ |  \_$$ |  
 $$$$$$  |  $$ |    $$ |    $$ |  
$$  __$$<   $$ |    $$ |    $$ |  
$$ /  $$ |  $$ |    $$ |    $$ |  
\$$$$$$  |$$$$$$\ $$$$$$\ $$$$$$\ 
 \______/ \______|\______|\______|                        
*/
const { response, request } = require("express")
const express = require("express")
const app = express() 

// membaca request dari body dengan tipe json
app.use(express.json())

// panggil models
const models = require("../models/index")


// panggil model "paket"
const paket = models.paket

// panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
app.use(auth)

// endpoit for get all paket
app.get("/", async (request, response) => {
    let dataPaket = await paket.findAll()

    return response.json(dataPaket)
})

// endpoint add new paket
app.post("/", (request, response) => {
    let newPaket = {
        jenis_paket: request.body.jenis_paket,
        harga: request.body.harga
    }

    paket.create(newPaket)
    .then(result => {
        response.json({
            message: `Data berhasil ditambahkan`
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})
// endpoint update data paket
app.put("/:id_paket", (request, response) => {

    // tampung data yang mau di update
    let data = {
        jenis_paket: request.body.jenis_paket,
        harga: request.body.harga
    }
    
    let parameter = {
        id_paket: request.params.id_paket
    }

    //proses update
    paket.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data berhasil diubah`,
            data: result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

// endpoint hapus data paket
app.delete("/:id_paket", (request, response) => {
    //tampung data yang akan dihapus
    let parameter = {
        id_paket: request.params.id_paket
    }

    //proses hapus
    paket.destroy({where: parameter})
    .then(result => {
        return response.json({
            message: `Data berhasil dihapus`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})
module.exports = app
const express = require("express")
const app = express()

// panggil router member
const member = require("./routers/member")
const paket = require("./routers/paket")
const users = require("./routers/users")
const transaksi = require("./routers/transaksi")
const { login } = require("./routers/login")

app.use("/member",member)
app.use("/paket",paket)
app.use("/users",users)
app.use("/transaksi",transaksi)
app.use("/auth", login)

app.listen(1337,() => {
    console.log(`Server run on port 1337`);
})

// split
/* const express = require("express")
const app = express()

// panggil router member
const member = require("./routers/member")
const paket = require("./routers/paket")
const users = require("./routers/users")
const transaksi = require("./routers/transaksi")
const login = require("./routers/login")

app.use("/member",member)
app.listen(8000,() => {
    console.log(`Server run on port 8000`)
})

app.use("/paket",paket)
app.listen(8111,() => {
    console.log(`Server run on port 8111`)
})

app.use("/users",users)
app.listen(1337,() => {
    console.log(`Server run on port 1337`)
})

app.use("/transaksi",transaksi)
app.listen(8222,() => {
    console.log(`Server run on port 8222`)
})


*/


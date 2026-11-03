require("dotenv").config()
const express = require("express")
const dbcon = require("../src/config/dbcon")

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");          
dns.setServers(["1.1.1.1", "8.8.8.8", "9.9.9.9", "8.8.4.4"]);
const app = express()
dbcon()



app.use(express.json())
app.use(express.urlencoded({extended:true}))


const authRoute = require("./router/userRoute")
app.use("/api",authRoute)

//movie api
const movie = require("./router/movieRoute")
app.use("/api", movie)
//theater api
const theaterRoutes = require("./router/theaterRoute");

app.use("/api/theaters", theaterRoutes);

//show api
const showRoutes = require("./router/showRoute");

app.use("/api/shows", showRoutes);

//booking api
const bookingRoutes = require("./router/bookingsRoutes");

app.use("/api/bookings", bookingRoutes);



const port = process.env.PORT || 3009
app.listen(port,()=>{
    console.log(`server running on port http://localhost:${port}` )
})

module.exports = app
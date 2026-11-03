const mongoose=require("mongoose")

const connect = async()=>{
        const response = await mongoose.connect(process.env.MONGO_URL)
        if(response){
            console.log("mongo database is connected sucessfully")
        }else{
            console.log("mongo database connection is failed")
        }
}

module.exports = connect
function response(sts, msg, aftrows, data = null){
    return{
        status: sts,
        message: mgs,
        affected_rows: aftrows,
        timestamp: new Date().getTime()


    }
}

module.exports ={
    response
}
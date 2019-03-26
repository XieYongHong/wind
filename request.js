const request = require('request')
const {userData} = require('./config.js')

const opt = {
    host:'http://www.gps165.com',
    method: 'get',
    path: '/MobileApi/MobileService.ashx?method=loginSystem&userName=DFDQFDYXGS&pwd=123123123123&customType=1',
    headers: {
        "Content-Type": 'application/json',
    }
}

const login = () => {
    request(opt.host+opt.path, (error, response, body) => {
        try {
            if(body){
                var data = JSON.parse(body)
                if(data.Success){
                    userData.customID = data.CustomID
                    userData.servceKey = data.ServiceKey
                    userData.UserName = data.UserName
                    userData.WebServer = data.WebServer
                }
            }
        } catch (error) {
            console.log(error);
        }
    })
}

const requestData = url => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            try {
                if(error){
                    login()
                    resolve({data:null})
                }else{
                    if(body){
                        var data = JSON.parse(body)
                        if(data){
                            resolve(data)
                        }
                    }else {
                        resolve({data:null})
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })
    })
}


module.exports = {
    login,
    requestData
}
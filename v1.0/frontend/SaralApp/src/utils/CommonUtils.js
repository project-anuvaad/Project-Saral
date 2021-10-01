import moment from 'moment'

export const validateToken = (expireTime) => {
    let expireArr = expireTime.replace(/-/g, '/').split('/')    
    let formattedExpireTime = expireArr[1]+'/'+expireArr[0]+'/'+expireArr[2]
    
    let tokenExpireTime = moment(new Date(Date.parse(formattedExpireTime)))
    let currentTime = moment()
    if(currentTime > tokenExpireTime) {
        return false
    }
    else {
        return true
    }
}

export const cryptoText = (text) => {
    let strTempChar = ''
    let encText = ''
    for(let i = 0; i<text.length; i++) {
        let char = text.charAt(i)
        if(char.charCodeAt(0) < 128) {
            strTempChar = char.charCodeAt(0) + 128
        }
        else if(char.charCodeAt(0) > 128) {
            strTempChar = char.charCodeAt(0) - 128
        }
        encText += String.fromCharCode(strTempChar)
    }
    return encText
}

export const SCAN_TYPES = {
    SAT_TYPE: 'sat',
    PAT_TYPE: 'pat'
}

export const TABLE_HEADER =[
    "Sr No","Max Marks","Obtanied Marks"
]

export const neglectData = ["ROLLNUMBER","STUDENTID","MARKS_OBTAINED","MAX_MARKS"];


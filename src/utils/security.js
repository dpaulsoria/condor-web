import CryptoJs from 'crypto-js';

export const encryptValue = (value, key="") => {    
    try {
        return CryptoJs.AES.encrypt(value, key).toString()
    } catch (error) {
        return null
    }      
}


export const decrypt = (value="", key="") => {   
    try {
        return CryptoJs.AES.decrypt(value, key).toString(CryptoJs.enc.Utf8) 
    } catch (error) {
        return null
    }      
}

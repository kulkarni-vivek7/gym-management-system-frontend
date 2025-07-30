import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY as string;

export const encryptJWT = (jwt: string): string => {
    const ciphertext = CryptoJS.AES.encrypt(jwt, SECRET_KEY).toString();
    return ciphertext;
}

export const decryptJWT = (ciphertext: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } 
    catch (error) {
        console.error('Decryption Failed', error);
        return '';    
    }
}
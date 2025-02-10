import CryptoJS from 'crypto-js';

function handleLoginResponse(response) {
    if (response.status === "Success") {
        const userData = response.result.user;

        // Encrypt user data
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(userData),
            'secret-key'  // Use a secret key for encryption
        ).toString();

        // Store the encrypted data in localStorage
        localStorage.setItem('userData', encryptedData);
    }
}
export default CryptoJS; 
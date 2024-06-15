    import jwt from 'jsonwebtoken';
    import crypto from 'crypto'
    import KeyTokenService from '../services/keyToken.service.js';


    const generateTokenAndSetCookie = async (userId, res) => {

        try {
            //created privateKey, publicKey
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1', //pkcs8 //Public key CryptoGraphy Standards
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            })
        
            //accessToken
            const accessToken = jwt.sign({ userId }, privateKey, {
                algorithm: "RS256",
                expiresIn: '2 days'
                // expiresIn:'30s'


            });

            //refreshToken
            const refreshToken = jwt.sign({ userId }, privateKey, {
                algorithm: "RS256",
                expiresIn: '7 days'
            });

            const keyStore = await KeyTokenService.createKeyToken({
                userId: userId,
                publicKey,
                refreshToken
            })

            if (!keyStore) {
                res.status(500).json({ error: "Can not save keystore in database" });
                return; 
            }

            // Set accessToken cookie
            res.cookie('accessToken', accessToken, {
                httpOnly: true, //more secure
                maxAge: 2 * 24 * 60 * 60 * 1000,
                // maxAge: 30*1000,
                sameSite: "strict" //CSRF 
            }); // 2 days

            // Set refreshToken cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, //more secure
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "strict" //CSRF 
            }); // 7 days

            // Return the tokens
            return { accessToken, refreshToken };
        } catch (error) {
            console.error('Error creating token pair:', error);
            throw error;
        }
    }

    export default generateTokenAndSetCookie
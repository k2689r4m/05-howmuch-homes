const validateReview = require('../Validator/Review');
const express = require('express');
const getConnection = require('../DB/DB');
const uniqid = require('uniqid');
const router = express.Router();
const jwt = require('jsonwebtoken');
const e = require('express');
const getUserId = require('../Lib/jwt');
const { config, msg } = require('coolsms-node-sdk');
const axios = require('axios');
const qs = require('qs');
const path = require('path');
const request = require('request');
const { redirect } = require('express/lib/response');

const bodyParser = require('body-parser');
const AppleAuth = require('apple-auth');
const fs = require('fs');
const appleConfig = require('../Cert/Apple_Config.json');

let appleAuth = new AppleAuth(appleConfig, fs.readFileSync(path.join(__dirname, '../Cert/AuthKey_4BK8XQCYJ7.p8')).toString(), 'text');

config.init({
    apiKey: 'NCSUIR36KLNALV2Q',
    apiSecret: 'KI1C28TXEU7LZAF4FELJHJQZHLKXX25V'
});

const nConfig = {
    headers: {
        'X-NCP-APIGW-API-KEY-ID': 'salgni0xx3',
        'X-NCP-APIGW-API-KEY': 'M2kdH1fLvPfOWj52yuQCwMwoa0VrmXQKd2POwQ0P'
    }
}

async function send (params = {}) {
    try {
        const result = await msg.send(params)
        // console.log('RESULT:', result)
    } catch (e) {
        console.log('statusCode:', e.statusCode)
        console.log('errorCode:', e.error.errorCode)
        console.log('errorMessage:', e.error.errorMessage)
    }
}
 
//getUserId(res, JWT_KEY)

const JWT_KEY = 'testKey';
const CONNECTION_KEY = 'testConnectionKey_p';
const AUTH_WHITE_LIST = [
    '/',
    '/auth',
    '/install'
]

const NAVER_AUTH = {
    client_id: 'sL_PqBcVtXCSXgvxcVm8',
    client_secret: 'CesGojBZSO',
};

const KAKAO_AUTH = {
    rest_api: '8dc1676bafa4304396b9dd0486c9b674',
    secret: '8dc1676bafa4304396b9dd0486c9b674',
    redirect_uri: 'https://hmhomes.kr/home/login/kakao',
}

// router.use('/.well-known/pki-validation/E1754354AEE3A727CC26062556172328.txt', (req, res, next) => {
//     res.sendFile(path.join(__dirname, `../E1754354AEE3A727CC26062556172328.txt`));
// })

//vue route
// router.get('/', async (req, res, next) => {
//     res.sendFile(path.join(__dirname, '../Views/App/index.html'));
// });

// router.use('/myHome', (req, res, next) => {
//     res.sendFile(path.join(__dirname, '../Views/App/index.html'));
// })

// router.use('/review', (req, res, next) => {
//     res.sendFile(path.join(__dirname, '../Views/App/index.html'));
// })

// router.use('/setting', (req, res, next) => {
//     res.sendFile(path.join(__dirname, '../Views/App/index.html'));
// })
//vue route end

//social login
router.get('/login/naver', (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code || !state) return redirect('https://hmhomes.kr/login?error=1');
        let api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_AUTH.client_id}&client_secret=${NAVER_AUTH.client_secret}&code=${code}&state=${state}`;
        let options = {
            url: api_url,
            headers: {'X-Naver-Client-Id': NAVER_AUTH.client_id, 'X-Naver-Client-Secret': NAVER_AUTH.client_secret}
        };

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const body1 = JSON.parse(body);

                const { access_token, refresh_token } = body1;

                api_url = 'https://openapi.naver.com/v1/nid/me';
                let header = "Bearer " + access_token; // Bearer 다음에 공백 추가
                options = {
                    url: api_url,
                    headers: {'Authorization': header}
                };

                request.get(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        const body2 = JSON.parse(body);
                        const id = body2.response?.id;

                        getConnection().then((conn) => {
                            try {
                                conn.query(`CALL Social_Login(?,?);`, [
                                    id,
                                    'NAVER'
                                ]).then((values) => {
                                    conn.release();
                                    const token = jwt.sign({ i: values[0][0].Id }, JWT_KEY, { algorithm: 'HS512', expiresIn: 30 * 60 });
                                    res.cookie('jwt', token, { overwrite: true });
                                    return res.redirect('https://hmhomes.kr/home');
                                });
                            }
                            catch (err) {
                                conn.release();
                                console.log(err);
                                return res.status(401).json({ code: 401, message: 'auth fail' });
                            }
                        });
                    } else {
                        console.log('error');
                        if(response != null) {
                            console.log('error = ' + response.statusCode);
                            return res.status(401).json({ code: 401, message: 'auth fail' });
                        }
                    }
                });
            } else {
                console.log('error = ' + response.statusCode);
                return res.status(401).json({ code: 401, message: 'auth fail' });
            }
        });
    } catch {
        return res.status(401).json({ code: 401, message: 'auth fail' });
    };
})

router.get('/login/kakao', async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code || !state) return redirect('https://hmhomes.kr/login?error=1');
        const token = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers:{
                'content-type':'application/x-www-form-urlencoded'
            },
            data:qs.stringify({
                grant_type: 'authorization_code',
                client_id: KAKAO_AUTH.rest_api,
                client_secret: KAKAO_AUTH.secret,
                redirectUri: KAKAO_AUTH.redirect_uri,
                code,
            })
        })

        const { access_token } = token?.data;

        if (!access_token) {
            return redirect('https://hmhomes.kr/login?error=1');
        }

        const user = await axios({
            method:'GET',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token.data.access_token}`
            }
        })

        const { id } = user?.data;

        if (!id) {
            return redirect('https://hmhomes.kr/login?error=1');
        }

        const conn = await getConnection();

        if (conn) {
            try {
                const values = await conn.query(`CALL Social_Login(?,?);`, [
                    id.toString(),
                    'KAKAO'
                ]);
    
                conn.release();
                const token = jwt.sign({ i: values[0][0].Id }, JWT_KEY, { algorithm: 'HS512', expiresIn: 30 * 60 });
                res.cookie('jwt', token, { overwrite: true });
                return res.redirect('https://hmhomes.kr/home');      
            }
            catch (err) {
                console.log(err);
            }
            finally {
                conn.release();
            }
        }
    } catch (e) {
        console.log(e)
    };

    return redirect('https://hmhomes.kr/login?error=1');
})

router.post('/login/apple', bodyParser(), async (req, res) => {
    try {
        const response = await appleAuth.accessToken(req.body.code);
        const idToken = jwt.decode(response.id_token);

        const user = {};
        user.id = idToken.sub;

        const conn = await getConnection();

        if (conn) {
            try {
                const values = await conn.query(`CALL Social_Login(?,?);`, [
                    user.id,
                    'APPLE'
                ]);
    
                conn.release();
                const token = jwt.sign({ i: values[0][0].Id }, JWT_KEY, { algorithm: 'HS512', expiresIn: 30 * 60 });
                res.cookie('jwt', token, { overwrite: true });
                return res.redirect('https://hmhomes.kr/home');      
            }
            catch (err) {
                console.log(err);
            }
            finally {
                conn.release();
            }
        }
    }
    catch (e) {
        console.log(e);
    }

    return redirect('https://hmhomes.kr/login?error=1');
})

//app install page start
router.get('/install', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../Views/User/install.html'));
});
//app install page end

//user auth middleware
router.use(async (req, res, next) => {
    let ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(':');
    ip = ip[ip.length - 1];

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Try_Access(?);`, ip);
            if (values[0][0]?.IsBlocked === true || values[0][0]?.IsBlocked === 1) {
                res.status(401).json({ code: 401, message: 'auth fail' });
                conn.release();
                return;
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }

    //user middleware
    if (!AUTH_WHITE_LIST.includes(req.path)) {
        try {
            const decoded = jwt.verify(req.headers.jwt, JWT_KEY);

            const token = jwt.sign({ i: decoded.i }, JWT_KEY, { algorithm: 'HS512', expiresIn: 30 * 60 });
            res.header('jwt', token)
        }
        catch (err) {
            if (err.message === 'jwt must be provided') {
                res.status(401).json({ code: 401, message: 'jwt must be provided' });
            }
            else if (err.message === 'jwt expired') {
                res.status(418).json({ code: 418, message: 'jwt expired' });
            }
            else {
                res.status(401).json({ code: 401, message: 'auth fail' });
            }
            
            return;
        }
    }

    next();
})

// router.get('/', async (req, res, next) => {
//     const conn = await getConnection();
//     if (conn) {
//         try {
//             const values = await conn.query(`CALL Get_User(?);`, 1);
//             res.json(values);
//             return;
//         }
//         catch (err) {
//             console.log(err);
//         }
//         finally {
//             conn.release();
//         }
//     }
  
//     res.json({err: 'err'});
// });

router.post('/auth', async (req, res) => {
    const UUID = req.body.UUID;
    let GuestId = req.body.GuestId ?? uniqid()+uniqid.process();
    //if (GuestId.length !== 27) GuestId =  uniqid()+uniqid.process();

    console.log(`UUID: ${UUID}, GuestId: ${GuestId}`)

    if (UUID && GuestId) {
        //login
        const conn = await getConnection();
        if (conn) {
            try {
                const values = await conn.query(`CALL Post_Login(?,?);`, [UUID, GuestId]);
                //if (values[3][0].LoginResult === 0) {
                if (values[0][0].LoginResult === 0) {
                    //login fail
                    res.status(401).json({ code: 401, message: 'fail to auth' });
                }
                else {
                    //login success
                    //const token = jwt.sign({ i: values[3][0].Id }, JWT_KEY, { algorithm: 'HS512', expiresIn: 30 * 60 });
                    const token = jwt.sign({ i: values[0][0].Id }, JWT_KEY, { algorithm: 'HS512', expiresIn: 30 * 60 });
                    // const token2 = jwt.sign({ i: values[0][0].Id }, CONNECTION_KEY, { algorithm: 'HS512', expiresIn: 24 * 60 * 60 });

                    // try {
                    //     await conn.query(`CALL Set_Connection_Key(?,?);`, [values[0][0].Id, token2]);
                    // } catch {}

                    res.header('jwt', token)
                    // res.header('jst', token2)
                    //res.status(200).json({ code: 200, guestId: GuestId, Id: values[3][0].Id });
                    res.status(200).json({ code: 200, GuestId: GuestId, Id: values[0][0].Id });
                }
                conn.release();
                return;
            }
            catch (err) {
                console.log(err);
            }
            finally {
                conn.release();
            }
        }
    }
    else {
        res.status(401).json({ code: 401, message: 'auth fail' });
    }
});

router.post('/ft', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    //Token
    const token = req.body.Token ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Post_Firebase_Token(?,?);`, [
                tokenUserId, 
                token
            ]);

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    // res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
    res.status(200).json({ code: 200 });
});

router.get('/agree', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_User_Agree(?);`, [
                tokenUserId
            ]);

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/agree', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Post_User_Agree(?);`, [
                tokenUserId
            ]);

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.use(async (req, res, next) => { 
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_User_Agree(?);`, [
                tokenUserId
            ]);

            conn.release();
            if (values[0][0].Agree === 1) {
                next();
                return;
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }

    res.status(400).json({ code: 400, message: '약관 동의를 해주세요.' });
})

router.get('/myPage/myInfo', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_MyPage(?);`, [
                tokenUserId
            ]);

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myPage/mInfo', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_M_My_Home(?);`, [
                tokenUserId
            ]);

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myPage/secession', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Post_Secession(?);`, [
                tokenUserId
            ]);

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});



router.post('/myPage/noti', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    
    let IsNoti = req.body.IsNoti;
    if (IsNoti === '1' || IsNoti === 1 || IsNoti === 'true' || IsNoti === true) IsNoti = true;
    else IsNoti = false;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_User_Noti(?,?);`, [
                tokenUserId,
                IsNoti
            ]);

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

////////////////////////////////all
router.get('/cities', async (req, res) => {
    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Cities();`);

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/dvsns', async (req, res) => {
    let cityId = parseInt(req.query.CityId);

    if (isNaN(cityId)) {
        res.status(400).json({ code: 400, message: '도시 아이디 에러' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Dvsns(?);`, [
                cityId
            ]);

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/search/region', async (req, res) => {
    if (!req.query.name || req.query.name.length === 0) {
        res.status(400).json({ code: 400, message: '검색어를 입력해 주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Search_Region(?);`, 
                [
                    req.query.name, 
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno === 11083) {
                res.status(200).json({ code: 200, message: err.text, d: {} });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/search/history', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Histories(?);`, 
                [
                    tokenUserId, 
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/search/history', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const regionId = req.body.RegionId;
    const cityName = req.body.CityName;
    const dvsnName = req.body.DvsnName;
    const secName = req.body.SecName;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Save_Histories(?,?,?,?,?);`, 
                [
                    regionId,
                    tokenUserId, 
                    cityName,
                    dvsnName,
                    secName
                ]
            );

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/delete/history', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const regionId = req.body.RegionId;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Delete_Histories(?,?);`, 
                [
                    regionId,
                    tokenUserId, 
                ]
            );

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/favorite', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const apartmentId = req.body.ApartmentId;
    let type = req.body.Type;
    if (type === '1' || type === 1 || type === 'true' || type === true) type = true;
    else if (type === '0' || type === 0 || type === 'false' || type === false) type = false;
    else {
        res.status(400).json({ code: 400, message: '타입 에러' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Post_Favorite(?,?,?);`, 
                [
                    apartmentId,
                    tokenUserId, 
                    type,
                ]
            );

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/favorite', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Favorites(?);`, 
                [
                    tokenUserId, 
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

////////////////////////////////myhome
router.post('/myhome/contact', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            await conn.query(`CALL Set_Contact(?,?);`, [
                tokenUserId,
                req.body.Contact
            ]);

            let otp = ((Math.random() * 100000000000000000).toString()).substring(0, 6);
            if (req.body.Contact === '010-0000-0000') {
                otp = '000000';
            }

            const values = await conn.query(`CALL Set_VerifyKey(?,?);`, [
                tokenUserId,
                otp
            ]);

            if (req.body.Contact !== '010-0000-0000') {
                const Contact = values[0][0].Contact.replaceAll('-','');

                send({
                    messages: [
                      {
                        to: Contact,
                        from: '15772996',
                        text: `[homes] OTP: ${otp}`
                      }
                    ]
                })
            }

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }

    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myhome/reverify', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const otp = ((Math.random() * 100000000000000000).toString()).substring(0, 6);

            const values = await conn.query(`CALL Set_VerifyKey(?,?);`, [
                tokenUserId,
                otp
            ]);

            const Contact = values[0][0].Contact.replaceAll('-','');

            send({
                messages: [ 
                  {
                    to: Contact,
                    from: '15772996',
                    text: `[homes] OTP: ${otp}`
                  }
                ]
            })

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }

    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/verify', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let key = req.body.Key;
    if (key.length > 10) {
        key = 'wrongkey';
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Verifying(?,?);`, [
                tokenUserId,
                key
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/transaction', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_TransactionType(?,?);`, [
                tokenUserId,
                req.body.TransactionType
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/ownership', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_HouseOwnership(?,?);`, [
                tokenUserId,
                req.body.HouseOwnership
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/available', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_AvailableAmount(?,?);`, [
                tokenUserId,
                req.body.AvailableAmount
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/loan', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_LoanRate(?,?);`, [
                tokenUserId,
                req.body.LoanRate
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

// router.post('/myhome/credit', async (req, res) => {
//     const tokenUserId = getUserId(res, JWT_KEY);
//     if (tokenUserId === 0) {
//         res.status(401).json({ code: 401, message: 'auth fail' });
//         return;
//     }

//     const conn = await getConnection();
//     if (conn) {
//         try {
//             const values = await conn.query(`CALL Set_CreditScore(?,?);`, [
//                 tokenUserId,
//                 req.body.CreditScore
//             ]);
//             res.status(200).json({ code: 200 });
//             conn.release();
//             return;
//         }
//         catch (err) {
//             if ((err.errno / 10) | 0 === 1108) {
//                 res.status(400).json({ code: 400, message: err.text });
//                 conn.release();
//                 return;
//             }
//             console.log(err);
//         }
//         finally {
//             conn.release();
//         }
//     }
  
//     res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
// });

router.post('/myhome/property', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_PropertyType(?,?);`, [
                tokenUserId,
                req.body.PropertyType
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/city', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let cityId = parseInt(req.body.CityId);
    if (isNaN(cityId) || cityId < 1) {
        res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
        return;
    }
    let countyId = parseInt(req.body.CountyId);
    if (isNaN(countyId) || countyId < 1) {
        res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_CityCounty(?,?,?);`, [
                tokenUserId,
                cityId, 
                countyId
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myhome/select', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Origin(?);`, [
                tokenUserId,
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myhome/home', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Get_MyHome(?);`, [
                tokenUserId,
            ]);
            res.status(200).json({ code: 200, d: values[0][0] ?? { Step: 0 } });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/additional', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let cityId = parseInt(req.body.CityId);
    if (isNaN(cityId) || cityId < 1) {
        res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
        return;
    }
    let countyId = parseInt(req.body.CountyId);
    if (isNaN(countyId) || countyId < 1) {
        res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Additional_MyHome(?,?,?,?,?,?,?,?);`, [
                tokenUserId,
                req.body.HouseOwnership,
                req.body.AvailableAmount,
                req.body.LoanRate,
                req.body.TransactionType,
                req.body.PropertyType,
                cityId, 
                countyId
            ]);

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/myhome/delete', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let myHomeId = parseInt(req.body.MyHomeId);
    if (isNaN(myHomeId) || myHomeId < 1) {
        res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Delete_MyHome(?,?);`, [
                tokenUserId,
                myHomeId
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/setting/homes', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Settings(?);`, [
                tokenUserId,
            ]);
            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/setting/home', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let myHomeId = parseInt(req.body.MyHomeId);
    if (isNaN(myHomeId) || myHomeId < 1) {
        res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
        return;
    }
    // let isUse = req.body.IsUse;
    // if (isUse === '1' || isUse === 1 || isUse === 'true' || isUse === true) isUse = true;
    // else if (isUse === '0' || isUse === 0 || isUse === 'false' || isUse === false) isUse = false;
    // else {
    //     res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
    //     return;
    // }

    const conn = await getConnection();
    if (conn) {
        try {
            const values = await conn.query(`CALL Select_Setting(?,?);`, [
                tokenUserId,
                myHomeId,
                // isUse,
            ]);
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1062 && (err.errno / 10) | 0 === 1062) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});




////////////////////////////////review
router.get('/review/count', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_ReviewCount(?);`, [
                tokenUserId
            ]);

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/review', async (req, res) => {
    const validator = validateReview(req.body);
    if (validator !== true) {
        res.status(400).json({ code: 400, message: validator });
        return;
    }

    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Add_Review(?,?,?,?,?);`, 
                [
                    tokenUserId, 
                    req.body.ApartmentId, 
                    req.body.OwnAmount, 
                    req.body.TransactionAmount, 
                    req.body.Content
                ]
            );
            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.text.startsWith('Incorrect string value:')) {
                conn.release();
                return res.status(400).json({ code: 400, message: '이모지를 사용할 수 없습니다.' });
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/search/apt', async (req, res) => {
    if (!req.query.name || req.query.name.length === 0) {
        res.status(400).json({ code: 400, message: '검색어를 입력해 주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Search_Apartments(?);`, 
                [
                    req.query.name, 
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/like', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let reviewId = parseInt(req.body.ReviewId);
    let type = req.body.Type;

    if (isNaN(reviewId) || reviewId < 1) {
        res.status(400).json({ code: 400, message: '리뷰 아이디 에러' });
        return;
    }

    if (type === '1' || type === 1 || type === 'true' || type === true) type = true;
    else if (type === '0' || type === 0 || type === 'false' || type === false) type = false;
    else {
        res.status(400).json({ code: 400, message: '타입 에러' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Like(?,?,?);`, 
                [
                    tokenUserId, 
                    reviewId,
                    type,
                ]
            );

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/report', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let reviewId = parseInt(req.body.ReviewId);

    if (isNaN(reviewId) || reviewId < 1) {
        res.status(400).json({ code: 400, message: '리뷰 아이디 에러' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Post_Report(?,?);`, 
                [
                    tokenUserId, 
                    reviewId,
                ]
            );

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/reviews', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);
    let method = parseInt(req.query.method);
    if (isNaN(page)) page = 1;
    if (isNaN(method)) method = 1;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Reviews(?,?,?);`, 
                [
                    page, 
                    //1: 최신순, 2: 좋아요순
                    method,
                    tokenUserId,
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myPage/like/reviews', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);
    let method = parseInt(req.query.method);
    if (isNaN(page)) page = 1;
    if (isNaN(method)) method = 1;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Like_Reviews(?,?,?);`, 
                [
                    tokenUserId,
                    page, 
                    method
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myPage/like/reviews/count', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Like_ReviewCount(?);`, 
                [
                    tokenUserId,
                ]
            );

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myPage/reviews', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);
    let method = parseInt(req.query.method);
    if (isNaN(page)) page = 1;
    if (isNaN(method)) method = 1;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_My_Reviews(?,?,?);`, 
                [
                    tokenUserId,
                    page, 
                    method
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/myPage/reviews/count', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_My_ReviewCount(?);`, 
                [
                    tokenUserId,
                ]
            );

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/review', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let reviewId = parseInt(req.query.reviewId);
    if (isNaN(reviewId)) {
        res.status(400).json({ code: 400, message: '삭제되거나 존재하지 않는 리뷰입니다.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Review(?,?);`, 
                [
                    tokenUserId,
                    reviewId,
                ]
            );

            if (values[0].length <= 0) {
                res.status(400).json({ code: 400, message: '삭제되거나 존재하지 않는 리뷰입니다.' });
                conn.release();
                return;
            }

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});





////////////////////////////////notice FAQ
router.get('/notices', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);
    if (isNaN(page)) page = 1;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Notices(?,?);`, 
                [
                    tokenUserId, 
                    page,
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/notice', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let noticeId = parseInt(req.query.noticeId);
    if (isNaN(noticeId) || noticeId < 1) {
        res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Notice(?,?);`, 
                [
                    tokenUserId, 
                    noticeId,
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/faqs', async (req, res) => {
    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_FAQs();`);

            res.status(200).json({ code: 200, d: { serv: values[0], cons: values[1] } });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/qnas', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);
    if (isNaN(page)) page = 1;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_QNAs_User(?,?);`, 
                [
                    page,
                    tokenUserId
                ]
            );

            res.status(200).json({ code: 200, d: values[1], info: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/qna', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_QNA_User(?,?);`, 
                [
                    tokenUserId,
                    req.query.qnaid ?? null
                ]
            );

            res.status(200).json({ code: 200, d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/qna', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Post_QNAs(?,?,?,?,?,?);`, 
                [
                    tokenUserId,
                    req.body.Title ?? null,
                    req.body.UserName ?? null,
                    req.body.Contact ?? null,
                    req.body.Type ?? null,
                    req.body.AvailableAmount ?? null,
                ]
            );

            res.status(200).json({ code: 200 });
            conn.release();
            return;
        }
        catch (err) {
            if (err.text.startsWith('Incorrect string value:')) {
                conn.release();
                return res.status(400).json({ code: 400, message: '이모지를 사용할 수 없습니다.' });
            }
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});




////////////////////////////////map
router.get('/map/info', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Map_Get_Info(?);`, 
                [
                    tokenUserId, 
                ]
            );

            let data = {...values[0][0]};
            // delete data.CountyId;

            const length = values.length;
            if (length - 2 >= 0) {
                const itemCount = values[length - 2][0].ItemCount;

                if ((length - 2) - itemCount >= 0) {
                    for (let i = 1;i <= itemCount;i++) {
                        // delete(values[(length - 2) - i][0].Val);
                        // delete(values[(length - 2) - i][0].Val);
                        data = { ...data, [values[(length - 2) - i][0].Cortartp]: values[(length - 2) - i][0] }
                    }
                    res.status(200).json({ code: 200, d: data });
                    conn.release();
                    return;
                }
            }

            res.status(200).json({ code: 200, d: data });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                // res.status(400).json({ code: 400, message: err.text });
                res.status(400).json({ code: 400 });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/map/region', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let regionId = parseInt(req.query.regionId);
    if (req.query.regionId === null || req.query.regionId === undefined) regionId = null;
    else if (isNaN(regionId)) {
        res.status(400).json({ code: 400, message: '지역 아이디는 숫자만 입력가능합니다.' });
        return;
    }
    else if (regionId < 0) {
        res.status(400).json({ code: 400, message: '지역 아이디를 잘못 입력했습니다.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Map_Get_Region(?,?);`, 
                [
                    tokenUserId, 
                    regionId,
                ]
            );

            const length = values.length;
            if (length - 2 >= 0) {
                const itemCount = values[length - 2][0].ItemCount;

                if ((length - 2) - itemCount >= 0) {
                    let data = {};
                    for (let i = 1;i <= itemCount;i++) {
                        delete(values[(length - 2) - i][0].Val);
                        delete(values[(length - 2) - i][0].Val);
                        data = { ...data, [values[(length - 2) - i][0].Cortartp]: values[(length - 2) - i][0] }
                    }
                    res.status(200).json({ code: 200, d: data });
                    conn.release();
                    return;
                }
            }
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/map/apartment', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let l = parseFloat(req.query.l);
    let r = parseFloat(req.query.r);
    let b = parseFloat(req.query.b);
    let t = parseFloat(req.query.t);
    let loan = parseFloat(req.query.loan);
    let availableAmount = parseInt(req.query.availableAmount);
    if (isNaN(l) || isNaN(r) || isNaN(b) || isNaN(t)) {
        res.status(400).json({ code: 400, message: '필수 파라미터가 누락되었습니다.' });
        return;
    }

    if (isNaN(loan)) {
        loan = null;
    }

    if (isNaN(availableAmount)) {
        availableAmount = null;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Map_Get_Apartments(?,?,?,?,?,?,?);`, 
                [
                    tokenUserId, 
                    loan,
                    availableAmount,
                    l,
                    r,
                    t,
                    b
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/map/apartment/detail', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let apartmentId = parseFloat(req.query.apartmentId);
    let loan = parseFloat(req.query.loan);
    let availableAmount = parseInt(req.query.availableAmount);
    if (isNaN(apartmentId)) {
        res.status(400).json({ code: 400, message: '필수 파라미터가 누락되었습니다.' });
        return;
    }

    if (isNaN(loan)) {
        loan = null;
    }

    if (isNaN(availableAmount)) {
        availableAmount = null;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Map_Get_Apartment_Detail(?,?,?,?);`, 
                [
                    tokenUserId, 
                    apartmentId,
                    loan,
                    availableAmount
                ]
            );

            res.status(200).json({ code: 200, d: values[1], IsConsult: values[0][0].IsConsult, IsFavorite: values[0][0].IsFavorite });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/map/apartment/detail/size', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let apartmentId = parseFloat(req.query.apartmentId);
    let loan = parseFloat(req.query.loan);
    let availableAmount = parseInt(req.query.availableAmount);
    let size = parseInt(req.query.size);
    if (isNaN(apartmentId)) {
        res.status(400).json({ code: 400, message: '필수 파라미터가 누락되었습니다.' });
        return;
    }

    if (isNaN(loan)) {
        loan = null;
    }

    if (isNaN(availableAmount)) {
        availableAmount = null;
    }

    if (isNaN(size) || size < 0) {
        res.status(400).json({ code: 400, message: '평수를 선택해주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Map_Get_Apartment_Detail_Size(?,?,?,?,?);`, 
                [
                    tokenUserId, 
                    apartmentId,
                    loan,
                    availableAmount,
                    size
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/map/addr', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let coords = req.query.coords;

    try {
        const result = await axios.get(`https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${coords}&sourcecrs=epsg:4326&output=json&orders=legalcode`, nConfig);

        const regions = result.data.results[0].region;
        const code = result.data.results[0].code.id.substr(0,5);

        const conn = await getConnection();

        if (conn) {
            try {
                const values = await conn.query(`CALL Map_Get_Review_Count(?);`, 
                    [
                        code,
                    ]
                );

                res.status(200).json({ code: 200, d: { Name: `${regions.area1.name} ${regions.area2.name}`, ReviewCount: values[0][0].ReviewCount, Code: code } });
                conn.release();
                return;
            }
            catch (err) {
                if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                    res.status(200).json({ code: 200, d: { Name: "대한민국", Code: null, ReviewCount: 0 } })
                    // res.status(400).json({ code: 400, message: err.text });
                    conn.release();
                    return;
                }
                console.log(err);
            }
            finally {
                conn.release();
            }
        }
    }
    catch(e) {
        console.log(e);
    }
  
    res.status(200).json({ code: 200, d: { Name: "대한민국", Code: null, ReviewCount: 0 } })

    // res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/map/reviews', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let code = req.query.code;
    let page = parseInt(req.query.page);
    let method = parseInt(req.query.method);

    if (isNaN(page) || isNaN(method)) {
        page = 1;
        method = 1;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Map_Get_Reviews(?,?,?,?);`, 
                [
                    code,
                    page,
                    method,
                    tokenUserId, 
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});






////////////////////////////////consult
router.get('/consults', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_User_Consults(?);`, 
                [
                    tokenUserId, 
                ]
            );

            res.status(200).json({ code: 200, d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1108 && (err.errno / 10) | 0 === 1108) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/consult', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let apartmentId = parseInt(req.body.ApartmentId);
    let apartmentSaleId = parseInt(req.body.ApartmentSaleId);
    let loan = parseInt(req.body.Loan);
    let availableAmount = parseInt(req.body.AvailableAmount);
    let home = parseInt(req.body.Home);

    // if (isNaN(apartmentId)) {
    //     apartmentId = null;
    // }
    apartmentId = null;

    if (isNaN(apartmentSaleId)) {
        apartmentSaleId = null;
    }

    if (isNaN(loan)) {
        loan = null;
    }

    if (isNaN(availableAmount)) {
        availableAmount = null;
    }

    if (isNaN(home) || home !== 1) {
        home = null;
    }

    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(':');

    const conn = await getConnection();

    if (conn) {
        try {
            await conn.query(`CALL Post_Consult(?,?,?,?,?,?,?);`, 
                [
                    tokenUserId,
                    apartmentId, 
                    ip[ip.length - 1],
                    apartmentSaleId,
                    availableAmount,
                    loan,
                    home
                ]
            );

            res.status(200).json({ code: 200 });

            try {
                const contacts = await conn.query(`CALL Get_Admin_Contacts();`);

                //console.log(contacts[0][0].Contact.filter((value, key) => key !== 'meta' ).replaceAll('-',''));
                console.log(contacts[0].length);
                if (contacts[0].length > 0) {
                    const messages = contacts[0].map((value) => { 
                        return { to: value.Contact.replaceAll('-',''), from: '15772996', text: `[Homes]\n새로운 상담신청이 등록되었습니다.` } 
                    });
    
                    send({ messages });
                }
            } catch { }

            conn.release();
            return;
        }
        catch (err) {
            if (err.errno != 1062 && (err.errno / 10) | 0 === 1062) {
                res.status(400).json({ code: 400, message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.use((req, res) => {
    res.redirect("https://hmhomes.kr/home");
    return;
});

module.exports = router;
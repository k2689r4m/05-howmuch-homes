const express = require('express');
const path = require('path');
const router = express.Router();

const jwt = require('jsonwebtoken');
const getConnection = require('../DB/DB');
const sha512 = require('js-sha512');
const getUserId = require('../Lib/jwt');
const { token } = require('morgan');
const { isUint32Array } = require('util/types');
const { start } = require('repl');
const { end } = require('../Log/Logger');

const excelDownload = require('../Lib/excel');

const validateReview = require('../Validator/Review');

const axios = require('axios');

/////////////////// firebase
const firebaseAdmin = require('firebase-admin');

const serviceAccount = require('../Firebase/homesnotification-firebase-adminsdk-tuddy-64ddf968f9.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});
///////////////////

const { config, msg } = require('coolsms-node-sdk');

config.init({
    apiKey: 'NCSUIR36KLNALV2Q',
    apiSecret: 'KI1C28TXEU7LZAF4FELJHJQZHLKXX25V'
});

const { ip } = require('../AdminPermittedIPList.json');

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

const JWT_KEY = 'adminTestKey';
const HMAC_KEY = 'testKey2';
const AUTH_WHITE_LIST = [
    '/auth',
]

router.use((req, res, next) => {
    const tip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(':');

    if(ip.includes(tip[tip.length - 1])){
        next();
    }
    else{
        return;
    }
})
 
// router.get('/', function(req, res, next) {
//     res.sendFile(path.join(__dirname, '../Views/Admin/Main/index.html'));
// });

// router.get('/test5', async (req, res) => {
//     const result = await axios.post(`https://plushdev.com/admin/test4`, {
//         Text: 
// `HowMuchHomes
// 관리자 메세지 테스트`
//     });
  
//     res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
// })

// router.post('/test4', async (req, res) => {
//     let text = req.body.Text;

//     if (!text || text === '') {
//         res.status(400).json({ code: 400, message: '내용을 입력해주세요.' });
//         return;
//     }

//     const conn = await getConnection();

//     if (conn) {
//         try {
//             const values = await conn.query(`CALL Get_Contacts(?);`, 
//                 [
//                     1,
//                 ]
//             );

//             const messages = values[1].filter(({ Contact }) => {
//                 return Contact != '010-3268-5874';
//             }).map(({ Contact }) => {
//                 return {
//                     to: Contact.replaceAll('-',''),
//                     from: '01056462338',
//                     text
//                 };
//             });

//             // console.log(values[1]);

//             send({
//                 messages
//             })

//             res.status(200).json({  });
//             conn.release();
//             return;
//         }
//         catch (err) {
//             if ((err.errno / 10) | 0 === 1108) {
//                 res.status(401).json({ message: err.text });
//                 conn.release();
//                 return;
//             }
//             console.log(err);
//         }
//         finally {
//             conn.release();
//         }
//     }
  
//     res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
// })

// router.get('/login', function(req, res, next) {
//     res.status(200).json({ code: 200, d: 'test' });
//     return;
// });

// router.get('/test3', async (req, res) => {
//     for (let i = 0;i < 500;i++) {
//         try {
//             const result = await axios.get(`https://plushdev.com/admin/test2`);
//         }
//         catch {

//         }
//     }
  
//     res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
// })

router.get('/test2', async (req, res) => {
    const result = await axios.get(`https://nickname.hwanmoo.kr/?format=json&count=100`);

    let words = result.data.words;

    const conn = await getConnection();

    if (conn) {
        try {
            for (const word in words) {
                const values = await conn.query(`CALL Post_Nickname(?);`, 
                    [
                        words[word]
                    ]
                );
            }

            res.status(200).json({  });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
})

// router.get('/test', async (req, res) => {
//     let searchType = req.query.searchType;
//     let search = req.query.search;
//     let minAmount = req.query.minAmount;
//     let maxAmount = req.query.maxAmount;
//     let creditScore = req.query.creditScore;
//     let startDate = req.query.startDate;
//     let endDate = req.query.endDate;
//     let transactionType = req.query.transactionType;
//     let houseOwnership = req.query.houseOwnership;
//     let propertyType = req.query.propertyType;

//     if (searchType === 'null' || searchType === undefined) searchType = null;
//     if (search === 'null' || search === undefined) search = null;
//     if (minAmount === 'null' || minAmount === undefined) minAmount = null;
//     if (maxAmount === 'null' || maxAmount === undefined) maxAmount = null;
//     if (creditScore === 'null' || creditScore === undefined) creditScore = null;
//     if (startDate === 'null' || startDate === undefined) startDate = null;
//     if (endDate === 'null' || endDate === undefined) endDate = null;
//     if (transactionType === 'null' || transactionType === undefined) transactionType = null;
//     if (houseOwnership === 'null' || houseOwnership === undefined) houseOwnership = null;
//     if (propertyType === 'null' || propertyType === undefined) propertyType = null;

//     const conn = await getConnection();

//     if (conn) {
//         try {
//             const values = await conn.query(`CALL Get_Consults_Search_Excel(?,?,?,?,?,?,?,?,?,?,?,?);`, 
//                 [
//                     searchType,
//                     search,
//                     minAmount,
//                     maxAmount,
//                     creditScore,
//                     startDate,
//                     endDate,
//                     transactionType,
//                     houseOwnership,
//                     propertyType,
//                     1,
//                     false
//                 ]
//             );

//             // res.attachment('문의 내역.xlsx');
//             // res.send(excelDownload(values[0]));
//             const length = values[0].length;
//             const test = values[0].map((element, index) => {

//                 return { 
//                     ...element, 
//                     No: length - index, 
//                     LoanRate: `${element.LoanRate ?? 0}%`, 
//                     LoanAmount: `${element.AvailableAmount * (1 + (element.LoanRate / 100))}`, 
//                     FavoriteApartmentData: `${element.FavoriteApartmentName}(${element.FavoriteCount})`, 
//                     AvailableAmount: `${element.AvailableAmount}` ,
//                     CreatedAt: `${element.CreatedAt.getFullYear()}-${element.CreatedAt.getMonth() + 1}-${element.CreatedAt.getDate()} ${element.CreatedAt.getHours()}:${element.CreatedAt.getMinutes()}:${element.CreatedAt.getSeconds()}`
//                 };
//             });

//             res.attachment('문의 내역.xlsx');
//             res.send(excelDownload(test));

//             // res.status(200).json({ d: test });
//             conn.release();
//             return;
//         }
//         catch (err) {
//             if ((err.errno / 10) | 0 === 1108) {
//                 res.status(400).json({ message: err.text });
//                 conn.release();
//                 return;
//             }
//             console.log(err);
//         }
//         finally {
//             conn.release();
//         }
//     }
  
//     res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
// })

router.post('/auth', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // var hash = sha512.hmac.create(HMAC_KEY);
    // hash.update('Message to hash');
    // console.log(hash.hex());

    if (username && password) {
        //login
        //const passwordKey = sha512.hmac(HMAC_KEY, password);

        const conn = await getConnection();
        if (conn) {
            try {
                // const values = await conn.query(`CALL Post_Admin_Login(?,?);`, [username, passwordKey]);
                const values = await conn.query(`CALL Post_Admin_Login(?,?);`, [username, password]);

                const token = jwt.sign({ i: values[0][0].Id, l: values[0][0].Level }, JWT_KEY, { algorithm: 'HS512' });//, expiresIn: 60 * 60 });
                res.header('jwt', token)
                res.status(200).json({  });
                conn.release();
                return;
            }
            catch (err) {
                if ((err.errno / 10) | 0 === 1002) {
                    res.status(401).json({ message: err.text });
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
    else {
        res.status(401).json({ message: 'auth fail' });
    }
});

//admin auth middleware
router.use((req, res, next) => {
    //admin middleware
    if (!AUTH_WHITE_LIST.includes(req.path)) {
        try {
            const decoded = jwt.verify(req.headers.jwt, JWT_KEY);

            const token = jwt.sign({ i: decoded.i, l: decoded.l }, JWT_KEY, { algorithm: 'HS512' });//, expiresIn: 60 * 60 });
            res.header('jwt', token)
        }
        catch (err) {
            if (err.message === 'jwt must be provided') {
                res.status(401).json({ message: 'jwt must be provided' });
            }
            else if (err.message === 'jwt expired') {
                res.status(418).json({ message: 'jwt expired' });
            }
            else {
                res.status(401).json({ message: 'auth fail' });
            }
            
            return;
        }
    }

    next();
})

router.post('/consult/match', async (req, res, next) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }

    let userId = parseInt(req.body.UserId);

    if (isNaN(userId)) {
        res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_User_Token(?);`, 
                [
                    userId, 
                ]
            );

            const fcm_target_token = values[0][0].FirebaseToken ?? null;

            if (fcm_target_token) {
                const fcm_message = {
                    "token": fcm_target_token,
                    "data": {
                        "title": "상담사가 배정되었습니다",
                        "message": "상담사가 내용 확인 후 등록된 번호로 연락드리겠습니다."
                    }
                }
    
                firebaseAdmin
                .messaging()
                .send(fcm_message)
                .then(function (response) {
                    console.log('Successfully sent message: : ', response)
                })
                .catch(function (err) {
                    console.log('Error Sending message!!! : ', err)
                })
            }

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
    return;
})

router.get('/consults', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);

    if (isNaN(page)) {
        page = 1;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Consults(?);`, 
                [
                    tokenUserId, 
                ]
            );

            res.status(200).json({ d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/consults/search', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);

    if (isNaN(page)) {
        page = 1;
    }

    let searchType = req.query.searchType;
    let search = req.query.search;
    let minAmount = req.query.minAmount;
    let maxAmount = req.query.maxAmount;
    // let creditScore = req.query.creditScore;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let transactionType = req.query.transactionType;
    let houseOwnership = req.query.houseOwnership;
    let propertyType = req.query.propertyType;

    if (searchType === 'null' || searchType === undefined) searchType = null;
    if (search === 'null' || search === undefined) search = null;
    if (minAmount === 'null' || minAmount === undefined) minAmount = null;
    if (maxAmount === 'null' || maxAmount === undefined) maxAmount = null;
    // if (creditScore === 'null' || creditScore === undefined) creditScore = null;
    if (startDate === 'null' || startDate === undefined) startDate = null;
    if (endDate === 'null' || endDate === undefined) endDate = null;
    if (transactionType === 'null' || transactionType === undefined) transactionType = null;
    if (houseOwnership === 'null' || houseOwnership === undefined) houseOwnership = null;
    if (propertyType === 'null' || propertyType === undefined) propertyType = null;

    let unassigned = req.query.Unassigned;
    if (unassigned === '1' || unassigned === 1 || unassigned === 'true' || unassigned === true) unassigned = true;
    else unassigned = false;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Consults_Search(?,?,?,?,?,?,?,?,?,?,?,?);`, 
                [
                    page,
                    searchType,
                    search,
                    minAmount,
                    maxAmount,
                    startDate,
                    endDate,
                    transactionType,
                    houseOwnership,
                    propertyType,
                    tokenUserId,
                    unassigned
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/consults/detail', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }

    let consultId = req.query.consultId ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Consult_Detail(?,?);`, 
                [
                    consultId,
                    tokenUserId,
                ]
            );

            res.status(200).json({ d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/consults/search/excel', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }

    let searchType = req.query.searchType;
    let search = req.query.search;
    let minAmount = req.query.minAmount;
    let maxAmount = req.query.maxAmount;
    // let creditScore = req.query.creditScore;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let transactionType = req.query.transactionType;
    let houseOwnership = req.query.houseOwnership;
    let propertyType = req.query.propertyType;

    if (searchType === 'null' || searchType === undefined) searchType = null;
    if (search === 'null' || search === undefined) search = null;
    if (minAmount === 'null' || minAmount === undefined) minAmount = null;
    if (maxAmount === 'null' || maxAmount === undefined) maxAmount = null;
    // if (creditScore === 'null' || creditScore === undefined) creditScore = null;
    if (startDate === 'null' || startDate === undefined) startDate = null;
    if (endDate === 'null' || endDate === undefined) endDate = null;
    if (transactionType === 'null' || transactionType === undefined) transactionType = null;
    if (houseOwnership === 'null' || houseOwnership === undefined) houseOwnership = null;
    if (propertyType === 'null' || propertyType === undefined) propertyType = null;

    let unassigned = req.query.Unassigned;
    if (unassigned === '1' || unassigned === 1 || unassigned === 'true' || unassigned === true) unassigned = true;
    else unassigned = false;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Consults_Search_Excel(?,?,?,?,?,?,?,?,?,?,?);`, 
                [
                    searchType,
                    search,
                    minAmount,
                    maxAmount,
                    startDate,
                    endDate,
                    transactionType,
                    houseOwnership,
                    propertyType,
                    tokenUserId,
                    unassigned
                ]
            );

            // res.attachment('문의 내역.xlsx');
            // res.send(excelDownload(values[0]));
            // const length = values[0].length;
            // const test = values[0].map((element, index) => {
            //     return { ...element, No: length - index, LoanRate: `${element.LoanRate ?? 0}%`, LoanAmount: element.AvailableAmount / (1 - (element.LoanRate / 100)), FavoriteApartmentData: `${element.FavoriteApartmentName}(${element.FavoriteCount})` };
            // });

            // res.attachment('문의 내역.xlsx');
            // res.send(excelDownload(test));

            res.status(200).json({ d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/admins', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }

    let tag = req.query.tag;
    let type = parseInt(req.query.type);

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Search_Admins(?,?,?);`, 
                [
                    tag, 
                    type,
                    tokenUserId
                ]
            );

            res.status(200).json({ d: values[0] });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/consults', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let ids = req.body.Ids;
    const type = parseInt(req.body.Type);
    const adminId = parseInt(req.body.AdminId);

    if (Array.isArray(ids)) {
        ids = ids.filter((id) => {
            return id > 0;
        }).join(',');
    }

    if (isNaN(type) || (type !== 1 && type !== 2) || isNaN(adminId) || adminId <= 0) {
        res.status(400).json({ message: '파라미터 오류.' });
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Consults(?,?,?,?);`, 
                [
                    tokenUserId, 
                    ids,
                    type,
                    adminId
                ]
            );

            if (values.length) {
                for (let i = 0;i < values[0].length; i++) {
                    const fcm_target_token = values[0][i].FirebaseToken ?? null;

                    if (fcm_target_token) {
                        const fcm_message = {
                            "token": fcm_target_token,
                            "data": {
                                "title": "상담사가 배정되었습니다",
                                "message": "상담사가 내용 확인 후 등록된 번호로 연락드리겠습니다."
                            }
                        }
            
                        firebaseAdmin
                        .messaging()
                        .send(fcm_message)
                        .then(function (response) {
                            console.log('Successfully sent message: : ', response)
                        })
                        .catch(function (err) {
                            console.log('Error Sending message!!! : ', err)
                        })
                    }
                }
            }
            

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            else if ((err.errno / 10) | 0 === 1227) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/consult/memo', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }

    const consultId = parseInt(req.body.ConsultId);
    const memo = req.body.Memo ?? null;

    if (isNaN(consultId)) {
        res.status(400).json({ message: '아이디를 확인해주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Consult_Detail(?,?,?);`, 
                [
                    consultId,
                    tokenUserId, 
                    memo,
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1227) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/access', async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Access_IPs(?);`, 
                [
                    page
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/block', async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Blocked_IPs(?);`, 
                [
                    page
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/isBlocked', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let id = parseInt(req.body.Id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Id를 확인해주세요.' });
        return;
    }
    let isBlocked = req.body.IsBlocked;
    if (isBlocked === true || isBlocked === 1 || isBlocked === '1') isBlocked = true;
    else if (isBlocked === false || isBlocked === 0 || isBlocked === '0') isBlocked = false;
    else {
        res.status(400).json({ message: '파라미터를 확인해주세요.' });
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_IsBlocked(?,?,?);`, 
                [
                    isBlocked,
                    id,
                    tokenUserId
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/notices', async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Notices_Admin(?);`, 
                [
                    page
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/notice', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let id = req.body.Id === undefined ? null : parseInt(req.body.Id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Id를 확인해주세요.' });
        return;
    }

    let title = req.body.Title;
    if (title === undefined || title === '') {
        res.status(400).json({ message: '제목을 입력해주세요.' });
        return;
    }

    let content = req.body.Content;
    if (content === undefined || content === '') {
        res.status(400).json({ message: '내용을 입력해주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Notices(?,?,?,?);`, 
                [
                    id,
                    title,
                    content,
                    tokenUserId
                ]
            );

            if (values[0][0]?.Id === undefined) {
                res.status(400).json({ message: 'Id를 확인해주세요.' });
                conn.release();
                return;
            }

            res.status(200).json({ d: values[0][0] });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/delete/notice', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let id = req.body.Id === undefined ? null : parseInt(req.body.Id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Id를 확인해주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Delete_Notices(?,?);`, 
                [
                    id,
                    tokenUserId
                ]
            );

            if (values[0][0]?.Id === undefined) {
                res.status(400).json({ message: 'Id를 확인해주세요.' });
                conn.release();
                return;
            }

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/qnas', async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_QNAs(?);`, 
                [
                    page
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/qnas/nc', async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_QNAs_Null_Content(?);`, 
                [
                    page
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/qna', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let id = req.body.Id === undefined ? null : parseInt(req.body.Id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Id를 확인해주세요.' });
        return;
    }

    let content = req.body.Content;
    if (content === undefined || content === '') {
        content = null;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_QNAs(?,?,?);`, 
                [
                    id,
                    content,
                    tokenUserId
                ]
            );

            if (values[0][0]?.Id === undefined) {
                res.status(400).json({ message: 'Id를 확인해주세요.' });
                conn.release();
                return;
            }

            if (values[1][0]?.FirebaseToken) {
                const fcm_target_token = values[1][0]?.FirebaseToken ?? null;

                    if (fcm_target_token) {
                        const fcm_message = {
                            "token": fcm_target_token,
                            "data": {
                                "title": "1:1 상담에 답변이 완료되었습니다",
                                "message": "1:1 상담에 답변이 완료되었습니다."
                            }
                        }
            
                        firebaseAdmin
                        .messaging()
                        .send(fcm_message)
                        .then(function (response) {
                            console.log('Successfully sent message: : ', response)
                        })
                        .catch(function (err) {
                            console.log('Error Sending message!!! : ', err)
                        })
                    }
            }

            res.status(200).json({ d: { Id: values[0][0].Id } });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(400).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/qna/delete', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ message: 'auth fail' });
        return;
    }
    let id = req.body.Id === undefined ? null : parseInt(req.body.Id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Id를 확인해주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Delete_QNAs(?,?);`, 
                [
                    id,
                    tokenUserId
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/apartments', async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    let searchType = req.query.searchType ?? null;
    let search = req.query.search ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Apartments(?,?,?);`, 
                [
                    searchType,
                    search,
                    page
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/reviews', async (req, res) => {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    let searchType = req.query.searchType ?? null;
    let search = req.query.search ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Reviews_Admin(?,?,?);`, 
                [
                    searchType,
                    search,
                    page
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/review/add', async (req, res) => {
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
            const values = await conn.query(`CALL Add_Review_Admin(?,?,?,?,?);`, 
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
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/review/edit', async (req, res) => {
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
            const values = await conn.query(`CALL Set_Review_Admin(?,?,?,?,?,?);`, 
                [
                    req.body.ReviewId, 
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
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ code: 400, message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/review/delete', async (req, res) => {
    let id = req.body.Id ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Delete_Reviews_Admin(?);`, 
                [
                    id
                ]
            );

            res.status(200).json({  });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/admins2', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    let searchType = req.query.searchType ?? null;
    let search = req.query.search ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Admins(?,?,?,?);`, 
                [
                    searchType,
                    search,
                    page,
                    tokenUserId
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/admins2/deactivate', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let id = req.body.Id ?? null;
    let isActive = req.body.IsActive;
    if (isActive === true || isActive === 1 || isActive === '1') isActive = true;
    else if (isActive === false || isActive === 0 || isActive === '0') isActive = false;
    else {
        res.status(400).json({ message: '파라미터를 확인해주세요.' });
    }

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Admin_IsActive(?,?,?);`, 
                [
                    tokenUserId,
                    id,
                    isActive
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/admins2/team', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
        page = 0;
    }

    let search = req.query.search ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_Admin_TeamLeaders(?,?,?);`, 
                [
                    search,
                    page,
                    tokenUserId
                ]
            );

            res.status(200).json({ d: values[1], info: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/admins2/teamleaders', async (req, res) => {
    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_TeamLeaders();`);

            res.status(200).json({ d: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/admins2/add', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let name = req.body.Name ?? null;
    let password = req.body.Password ?? null;
    let username = req.body.Username ?? null;
    let teamLeaderId = req.body.TeamLeaderId ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Add_Admin(?,?,?,?,?);`, 
                [
                    tokenUserId,
                    teamLeaderId,
                    username,
                    name,
                    password,
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/admins2/edit', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let id = req.body.Id ?? null;
    let name = req.body.Name ?? null;
    let password = req.body.Password ?? null;
    let username = req.body.Username ?? null;
    let teamLeaderId = req.body.TeamLeaderId ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_Admin(?,?,?,?,?,?);`, 
                [
                    tokenUserId,
                    id,
                    name,
                    password,
                    username,
                    teamLeaderId
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/teamleader/add', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let name = req.body.Name ?? null;
    let password = req.body.Password ?? null;
    let username = req.body.Username ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Add_TeamLeader(?,?,?,?);`, 
                [
                    tokenUserId,
                    username,
                    password,
                    name,
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/teamleader/edit', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let id = req.body.Id ?? null;
    let name = req.body.Name ?? null;
    let password = req.body.Password ?? null;
    let username = req.body.Username ?? null;

    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Set_TeamLeader(?,?,?,?,?);`, 
                [
                    tokenUserId,
                    id,
                    username,
                    password,
                    name,
                ]
            );

            res.status(200).json({  });
            conn.release();
            return;
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                res.status(401).json({ message: err.text });
                conn.release();
                return;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.get('/sms/users', async (req, res) => {
    const conn = await getConnection();

    if (conn) {
        try {
            const values = await conn.query(`CALL Get_User_Contacts();`);

            res.status(200).json({ d: values[0] });
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
  
    res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});

router.post('/sendsms', async (req, res) => {
    const tokenUserId = getUserId(res, JWT_KEY);
    if (tokenUserId === 0) {
        res.status(401).json({ code: 401, message: 'auth fail' });
        return;
    }

    let text = req.body.Text;
    let contacts = req.body.Contacts;

    if (!Array.isArray(contacts)) return res.status(400).json({ message: '전송 대상을 선택해주세요.' });

    if (!text || text === '') {
        res.status(400).json({ code: 400, message: '내용을 입력해주세요.' });
        return;
    }

    const conn = await getConnection();

    if (conn) {
        try {
            await conn.query(`CALL SMS_Permission_Check(?);`, 
                [
                    tokenUserId,
                ]
            );

            const uniqueContact = contacts.filter((element, index) => {
                return contacts.indexOf(element) === index;
            });

            const messages = uniqueContact.map((Contact) => {
                return {
                    to: Contact.replaceAll('-',''),
                    from: '15772996',
                    text: `[Homes]\n${text}`
                };
            });
        
            send({
                messages
            })
            
            conn.release();
            return res.status(200).json({ });
        }
        catch (err) {
            if ((err.errno / 10) | 0 === 1108) {
                conn.release();
                return res.status(401).json({ message: err.text });;
            }
            console.log(err);
        }
        finally {
            conn.release();
        }
    }

    // const conn = await getConnection();

    // if (conn) {
    //     try {
    //         const values = await conn.query(`CALL Get_Contacts(?,?);`, 
    //             [
    //                 tokenUserId,
    //                 null
    //             ]
    //         );

    //         // const messages = values[0].filter(({ Contact }) => {
    //         //     return Contact != '010-3268-5874';
    //         // }).map(({ Contact }) => {
    //         //     return {
    //         //         to: Contact.replaceAll('-',''),
    //         //         from: '01056462338',
    //         //         text
    //         //     };
    //         // });

    //         const messages = values[0].map(({ Contact }) => {
    //             return {
    //                 to: Contact.replaceAll('-',''),
    //                 from: '15772996',
    //                 text
    //             };
    //         });

    //         // console.log(values[1]);

    //         send({
    //             messages
    //         })

    //         res.status(200).json({  });
    //         conn.release();
    //         return;
    //     }
    //     catch (err) {
    //         if ((err.errno / 10) | 0 === 1108) {
    //             res.status(401).json({ message: err.text });
    //             conn.release();
    //             return;
    //         }
    //         console.log(err);
    //     }
    //     finally {
    //         conn.release();
    //     }
    // }
  
    // res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
    return res.status(400).json({ message: '잠시 후 다시 시도해 주세요.' });
});
 
module.exports = router;
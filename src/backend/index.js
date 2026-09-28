const express = require('express');
const cors = require('cors');

const adminRouter = require('./API/Admin');
const userRouter = require('./API/User');

const morgan = require('morgan')
const logger = require('./Log/Logger')

const https = require('https')
const fs = require('fs')
const path = require('path');

//http cert start
const options = {
    key: fs.readFileSync('/root/Homes/Cert/private.key'),
    cert: fs.readFileSync('/root/Homes/Cert/certificate.crt'),
    ca: fs.readFileSync('/root/Homes/Cert/ca_bundle.crt'),
};
//http cert end

const VUE_ROUTE_LIST = [
    '/myHome',
    '/review',
    '/about',
    '/notice',
    '/notice/detail',
    '/inquiry',
    '/inquiry/detail',
    '/faq',
    '/inquiry/create',
    '/bookmark',
    '/setting/myHome',
    '/setting',
    '/map',
    '/map/list',
    '/map/list/detail',
    '/map/list/detail/detail',
    '/map/review',
    '/login',
    '/mypage',
    '/join',
    '/join2',
    '/mypage/findMyHome',
    '/mypage/inquiryHistory',
    '/mypage/account',
    '/goodReview',
    '/myReview',
];

const VUE_ADMIN_ROUTE_LIST = [
    "/admin",
    "/admin/main2",
    "/admin/ip",
    "/admin/notice",
    "/admin/qna",
    "/admin/apartment",
    "/admin/review",
    "/admin/conman",
    "/admin/team",
    "/admin/sms",
    "/admin/kakao",
    "/login2",
];

//server setting start
const app = express();
app.use(cors({
    exposedHeaders: ['jwt'],
}));
app.disable('x-powered-by');
//server setting end

//server init start
app.use(express.json());
//server init end

//http error log start
app.use(
    morgan('combined', 
      {
        skip: function (req, res) { return res.statusCode < 400 },
        stream: logger.stream
      }
    )
);
//http error log end

app.use('/', (req, res, next) => {
    if(req.secure){
        next();
    }else{
        let to = "https://" + req.headers.host + req.url;

        res.redirect("https://" + req.headers.host + req.url);
        return;
    }
})

//connection console log start
app.use('/', (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(':');

    const today = new Date();

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    const hours = ('0' + today.getHours()).slice(-2); 
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2); 

    let dateString = year + '-' + month  + '-' + day + ' ' + hours + ':' + minutes  + ':' + seconds;

    let params = '';
    if (req.method === 'GET') {
        Object.keys(req.query).forEach((key, index) => {
            if (index === 0) params += `${key}: ${req.query[key]}`;
            else params += `, ${key}: ${req.query[key]}`;
        })
    }
    else if (req.method === 'POST') {
        Object.keys(req.body).forEach((key, index) => {
            if (index === 0) params += `${key}: ${req.body[key]}`;
            else params += `, ${key}: ${req.body[key]}`;
        })
    }
    else {
        console.log(`[${dateString}] ip: ${ip[ip.length - 1]}, route: ${req.originalUrl}, unexpected method: ${req.method}`);
        res.status(403).json({ code: 403, message: `unexpected method: ${req.method}` });
        return;
    }

    console.log(`[${dateString}] ip: ${ip[ip.length - 1]}, route: ${req.originalUrl}, method: ${req.method}, params: { ${params} }`);
    next();
});
//connection console log end

//private info start
app.get('/pi', (req, res) => {
    res.sendFile(path.join(__dirname, './Views/PI/PI.html'));
})
//private info end

//service page start
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Views/App2/info.html'));
})

app.get('/apple', (req, res) => {
    res.sendFile(path.join(__dirname, './Views/index.html'));
})

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, './Views/App2/faq2.html'));
})
//service page end

app.use((req, res, next) => {
    if (VUE_ADMIN_ROUTE_LIST.includes(req.path) && req.method === 'GET') {
        return res.sendFile(path.join(__dirname, './Views/Admin/Main/index.html'));
    }

    next();
})

// app.get('/admin', function(req, res, next) {
//     res.sendFile(path.join(__dirname, './Views/Admin/Main/index.html'));
// });

//vue user route start
app.get('/home', async (req, res, next) => {
    res.sendFile(path.join(__dirname, './Views/App/index.html'));
});

app.get('/login', async (req, res, next) => {
    res.sendFile(path.join(__dirname, './Views/App/index.html'));
});

app.get('/join2', async (req, res, next) => {
    res.sendFile(path.join(__dirname, './Views/App/index.html'));
});
//vue user route end

//static file route middleware start
app.use('/js', (req, res, next) => {
    res.sendFile(path.join(__dirname, `./Views/App/js${req.path}`));
})

app.use('/css', (req, res, next) => {
    res.sendFile(path.join(__dirname, `./Views/App/css${req.path}`));
})

app.use('/img', (req, res, next) => {
    res.sendFile(path.join(__dirname, `./Views/App/img${req.path}`));
})

app.use('/images', (req, res, next) => {
    res.sendFile(path.join(__dirname, `./Views/App/images${req.path}`));
})

app.use('/fonts', (req, res, next) => {
    res.sendFile(path.join(__dirname, `./Views/App/fonts${req.path}`));
})

app.get('/favicon.ico', (req, res, next) => {
    res.sendFile(path.join(__dirname, `./Views/App/favicon.ico`));
})

app.get('/homes.png', (req, res, next) => {
    res.sendFile(path.join(__dirname, `./Views/Icon/homes.png`));
})
//static file route middleware end

//admin route start
app.use('/admin', adminRouter);
//admin route end

//user route start
app.use('/home', userRouter);
//user route end

app.use(async (req, res, next) => {
    if (VUE_ROUTE_LIST.includes(req.path)) {
        res.redirect("https://hmhomes.kr/home");
        // res.redirect("https://plushdev.com/home");
        return;
    }

    next();
})

app.use((req, res) => {
    res.redirect("https://hmhomes.kr/home");
    return;
});

//port
const port = 443;

//https server open
https.createServer(options, app).listen(port, () => console.log(`listening port:${port}`));
//http server open
app.listen(80, () => console.log(`listening port:${80}`));
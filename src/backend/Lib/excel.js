const excel = require('node-excel-export');

const styles = {
    headerDark: {
        fill: {
            fgColor: {
                rgb: 'FF000000'
            }
        },
        font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
        }
    },
    cellWhite: {
        fill: {
            fgColor: {
                rgb: 'FFFFFFFF'
            }
        }
    },
    cellGreen: {
        fill: {
            fgColor: {
                rgb: 'FF00FF00'
            }
        }
    }
};

// const heading = [
//     [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}]
// ];

const heading = [
    [
        {value: 'No', style: styles.headerDark}, 
        {value: 'ID', style: styles.headerDark}, 
        {value: '조회일', style: styles.headerDark},
        {value: '가용 금액', style: styles.headerDark},
        {value: '대출비율', style: styles.headerDark},
        {value: '대출금액', style: styles.headerDark},
        {value: '신용점수', style: styles.headerDark},
        {value: '주택보유', style: styles.headerDark},
        {value: '광역지역', style: styles.headerDark},
        {value: '시/군/구', style: styles.headerDark},
        {value: '거래유형', style: styles.headerDark},
        {value: '매물유형', style: styles.headerDark},
        {value: '관심 아파트', style: styles.headerDark},
        {value: 'IP', style: styles.headerDark},
        {value: '담당 직원', style: styles.headerDark},
    ]
];

const merges = [
    { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
    { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
    { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
];

// const specification = {
//     customer_name: { // <- the key should match the actual data key
//         displayName: 'Customer', // <- Here you specify the column header
//         headerStyle: styles.headerDark, // <- Header style
//         cellStyle: function(value, row) { // <- style renderer function
//         // if the status is 1 then color in green else color in red
//         // Notice how we use another cell value to style the current one
//         return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
//         },
//         width: 120 // <- width in pixels
//     },
//     status_id: {
//         displayName: 'Status',
//         headerStyle: styles.headerDark,
//         cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
//             return (value == 1) ? 'Active' : 'Inactive';
//         },
//         width: '10' // <- width in chars (when the number is passed as string)
//     },
//     note: {
//         displayName: 'Description',
//         headerStyle: styles.headerDark,
//         cellStyle: styles.cellPink, // <- Cell style
//         width: 220 // <- width in pixels
//     }
// }

const specification = {
    No: { // <- the key should match the actual data key
        displayName: 'No', // <- Here you specify the column header
        headerStyle: styles.headerDark, // <- Header style
        //cellStyle: styles.cellWhite,
        // function(value, row) { // <- style renderer function
        // // if the status is 1 then color in green else color in red
        // // Notice how we use another cell value to style the current one
        // return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible 
        // },
        width: 120 // <- width in pixels
    },
    Contact: {
        displayName: 'ID',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
        //     return (value == 1) ? 'Active' : 'Inactive';
        // },
        // width: '10' // <- width in chars (when the number is passed as string)
        width: 120
    },
    CreatedAt: {
        displayName: '조회일',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    AvailableAmount: {
        displayName: '가용 금액',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    LoanRate: {
        displayName: '대출비율',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    LoanAmount: {
        displayName: '대출금액',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    CreditScore: {
        displayName: '신용점수',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    HouseOwnership: {
        displayName: '주택보유',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    CityName: {
        displayName: '광역지역',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    CountyName: {
        displayName: '시/군/구',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    TransactionType: {
        displayName: '거래유형',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    PropertyType: {
        displayName: '매물유형',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    FavoriteApartmentData: {
        displayName: '관심 아파트',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    IP: {
        displayName: 'IP',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 120 // <- width in pixels
    },
    AdminName: {
        displayName: '담당 직원',
        headerStyle: styles.headerDark,
        //cellStyle: styles.cellWhite, // <- Cell style
        width: 100 // <- width in pixels
    }
};

// const dataset = [
//     {no: '3', id: 3, date: '2021-12-15', availableAmount: '5억', loanRate: '50%', LoanAmount: '2.5억', creditScore: '700점 이상', houseOwnership: '무주택', city: '서울시', dvsn: '강서구', transactionType: '매매', propertyType: '아파트', favorites: 'a아파트(10)', ip: '0.0.0.0', admin: '가나다'},
//     {no: '2', id: 2, date: '2021-12-15', availableAmount: '5억', loanRate: '50%', LoanAmount: '2.5억', creditScore: '700점 이상', houseOwnership: '무주택', city: '서울시', dvsn: '강서구', transactionType: '매매', propertyType: '아파트', favorites: 'a아파트(10)', ip: '0.0.0.0', admin: '가나다'},
//     {no: '1', id: 1, date: '2021-12-15', availableAmount: '5억', loanRate: '50%', LoanAmount: '2.5억', creditScore: '700점 이상', houseOwnership: '무주택', city: '서울시', dvsn: '강서구', transactionType: '매매', propertyType: '아파트', favorites: 'a아파트(10)', ip: '0.0.0.0', admin: '가나다'},
// ];

const excelDownload = (data) => {
    const report = excel.buildExport(
        [
            {
                name: '문의 내역',
                //heading,
                //merges,
                specification,
                data,
            }
        ]
    )

    return report;
};

module.exports = excelDownload;
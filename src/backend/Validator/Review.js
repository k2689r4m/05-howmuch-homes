const checkId = (Id) => {
    return Id > 0;
};

const amountList = [
    '2억 이하',
    '2억-4억',
    '4억-6억',
    '6억-8억',
    '8억-10억',
    '10억 이상',
];

const checkAmount = (Amount) => {
    return amountList.includes(Amount);
};

const checkContent = (Content) => {
    return Content.length > 0;
};

const validateReview = (body) => {
    try {
        // if (!body.UserId || !checkId(body.UserId)) {
        //     return '유저 인증 오류';
        // }
        if (!body.ApartmentId || !checkId(body.ApartmentId)) {
            return '아파트를 선택해 주세요.';
        }
        if (!body.OwnAmount || !checkAmount(body.OwnAmount)) {
            return '자기자본을 선택해 주세요.';
        }
        if (!body.TransactionAmount || !checkAmount(body.TransactionAmount)) {
            return '거래금액을 선택해 주세요.';
        }
        if (!body.Content || !checkContent(body.Content)) {
            return '리뷰 내용을 입력해 주세요.';
        }

        return true;
    }
    catch {
        return '';
    }
};


module.exports = validateReview;
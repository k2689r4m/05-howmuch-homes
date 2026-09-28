import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login";
import VueCookies from "vue-cookies";

import HowMain from "../components/HowMain";
import Agree from "../components/Agree";
import Join from "../components/Join";
import AgreeMain from "../components/AgreeMain";
import MyHomeMain from "../components/myHome/MyHomeMain";
import ReviewMain from "../components/reviewView/ReviewMain";
import CreateRevew from "../components/reviewView/CreateRevew";
import GoodReviewMain from "../components/reviewView/GoodReviewMain2";
import MyReviewMain from "../components/reviewView/MyReviewMain";

import Notice from "../components/questionMenu/Notice";
import NoticeDetail from "../components/questionMenu/NoticeDetail";
import Inquiry from "../components/questionMenu/Inquiry";
import InquiryDetail from "../components/questionMenu/InquiryDetail";
import Faq from "../components/questionMenu/Faq";
import CreateInquiry from "../components/questionMenu/CreateInquiry";
import Bookmark from "../components/questionMenu/Bookmark";
// import SetMyHome from "../components/questionMenu/SetMyHome";
import SetMyHome from "../components/myHome/MySet";
import Setting from "../components/Setting";
import MapMain from "../components/myHome/MapMain";
import MapList from "../components/myHome/MapList";
import MapListDetail from "../components/myHome/MapListDetail";
import MapListDetail2 from "../components/myHome/MapListDetail2";
import MapReview from "../components/myHome/MapReview";

import MyPage from "../components/MyPage";
import Account from "../components/Account";
import InquiryHistory from "../components/InquiryHistory";
import FindMyHome from "../components/FindMyHome";

import Callback from "../components/Callback";

Vue.use(VueRouter);

const routes = [
  {
    path: "/callback",
    component: Callback,
    name: "Callback",
    props: true,
    meta: { unauthorized: true },
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
    props: true,
    meta: { unauthorized: true },
  },
  {
    path: "/join2",
    component: Join,
    name: "Join",
    props: true,
    meta: { unauthorized: true },
  },
  {
    path: "/home",
    component: HowMain,
    name: "HowMain",
    props: true,
  },
  {
    path: "/agree",
    component: Agree,
    name: "Agree",
    props: true,
  },
  {
    path: "/agreeMain",
    component: AgreeMain,
    name: "AgreeMain",
    props: true,
  },
  {
    path: "/myHome",
    component: MyHomeMain,
    name: "MyHomeMain",
    props: true,
  },
  {
    path: "/review",
    component: ReviewMain,
    name: "ReviewMain",
    props: true,
  },
  {
    path: "/goodReview",
    component: GoodReviewMain,
    name: "GoodReviewMain",
    props: true,
  },
  {
    path: "/myReview",
    component: MyReviewMain,
    name: "MyReviewMain",
    props: true,
  },
  {
    path: "/about",
    component: CreateRevew,
    name: "CreateReview",
    props: true,
  },

  {
    path: "/notice",
    component: Notice,
    name: "Notice",
    props: true,
  },
  {
    path: "/notice/detail",
    component: NoticeDetail,
    name: "NoticeDetail",
    props: true,
  },
  {
    path: "/inquiry",
    component: Inquiry,
    name: "Inquiry",
    props: true,
  },
  {
    path: "/faq",
    component: Faq,
    name: "Faq",
    props: true,
  },
  {
    path: "/inquiry/detail",
    component: InquiryDetail,
    name: "InquiryDetail",
    props: true,
  },
  {
    path: "/inquiry/create",
    component: CreateInquiry,
    name: "CreateInquiry",
    props: true,
  },
  {
    path: "/bookmark",
    component: Bookmark,
    name: "Bookmark",
    props: true,
  },
  {
    path: "/setting/myHome",
    component: SetMyHome,
    name: "SetMyHome",
    props: true,
  },
  {
    path: "/setting",
    component: Setting,
    name: "Setting",
    props: true,
  },
  {
    path: "/map",
    component: MapMain,
    name: "MapMain",
    props: true,
  },
  {
    path: "/map/list",
    component: MapList,
    name: "MapList",
    props: true,
  },
  {
    path: "/map/list/detail",
    component: MapListDetail,
    name: "MapListDetail",
    props: true,
  },
  {
    path: "/map/list/detail/detail",
    component: MapListDetail2,
    name: "MapListDetail2",
    props: true,
  },
  {
    path: "/map/review",
    component: MapReview,
    name: "MapReview",
    props: true,
  },
  {
    path: "/mypage",
    component: MyPage,
    name: "MyPage",
    props: true,
  },
  {
    path: "/mypage/account",
    component: Account,
    name: "Account",
    props: true,
  },
  {
    path: "/mypage/inquiryHistory",
    component: InquiryHistory,
    name: "InquiryHistory",
    props: true,
  },
  {
    path: "/mypage/findMyHome",
    component: FindMyHome,
    name: "FindMyHome",
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  historyApiFallback: true,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (
    to.matched.some(
      (record) => record.meta.unauthorized && VueCookies.get("jwt")
    )
  ) {
    return next("/home");
  } else if (
    to.matched.some((record) => record.meta.unauthorized) ||
    VueCookies.get("jwt")
  ) {
    return next();
  }

  return next("/login");
});

export default router;

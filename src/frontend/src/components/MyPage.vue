<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">마이페이지</h2>
    </header>
    <div class="content p-t--0">
      <div class="box-line border-none"></div>
      <ul class="mymenu-list">
        <li class="mymenu-list--item">
          <label class="label">나의메뉴</label>
        </li>
        <li class="mymenu-list--item">
          <button type="button" class="btn type1" @click="goPage('Account')">
            계정관리
          </button>
        </li>
        <li class="mymenu-list--item">
          <button
            type="button"
            class="btn type2"
            @click="goPage('InquiryHistory')"
          >
            상담신청내역 확인
          </button>
        </li>
        <li class="mymenu-list--item">
          <button type="button" class="btn type3" @click="goPage('Inquiry')">
            1:1문의 확인
          </button>
        </li>
        <li class="mymenu-list--item">
          <button type="button" class="btn type4" @click="goPage('Bookmark')">
            즐겨찾기 매물보기
          </button>
        </li>
        <li class="mymenu-list--item">
          <button
            type="button"
            class="btn type5"
            @click="goPage('MyReviewMain')"
          >
            내 후기 보기
          </button>
        </li>
      </ul>
      <div class="box-line border-none"></div>
      <ul class="mymenu-list">
        <li class="mymenu-list--item">
          <label class="label">내 집 마련</label>
        </li>
        <li class="mymenu-list--item">
          <button type="button" class="btn type6" @click="backReturn">
            주택담보대출 알아보기
          </button>
        </li>
        <li class="mymenu-list--item">
          <button
            type="button"
            class="btn type7"
            @click="goPage2('MyHomeMain')"
          >
            전세퇴거자금 알아보기
          </button>
        </li>
      </ul>
      <div class="box-line border-none"></div>
      <ul class="mymenu-list">
        <li class="mymenu-list--item">
          <label class="label">게시판</label>
        </li>
        <li class="mymenu-list--item">
          <button type="button" class="btn type8" @click="goPage('Notice')">
            공지사항
          </button>
        </li>
        <!-- <li class="mymenu-list--item">
          <button type="button" class="btn type3" @click="goPage('Inquiry')">
            1:1문의
          </button>
        </li> -->
        <li class="mymenu-list--item">
          <button type="button" class="btn type9" @click="goPage('Faq')">
            자주묻는 질문
          </button>
        </li>
      </ul>
      <div class="box-line border-none"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyPage",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return { st: false };
  },
  created() {},
  mounted() {
    this.init();
    this.$nextTick(() => {
      if (this.$getAppCheck() == "android") {
        window.Android.SetWebViewVisible();
      }
    });

    if (this.$route.query.id != undefined) {
      this.$store.state.rId = this.$route.query.id;

      this.$router.push({
        name: "ReviewMain",
      });
    }
  },
  methods: {
    // ozit_timer_test() {
    //   window.Android.SetWebViewVisible();
    // },
    init() {
      this.$store.commit("init");
      this.$apiGET("/map/info").then(({ data }) => {
        if (data.code === 200) {
          this.$store.state.AvailableAmount = data.d.AvailableAmount;
          this.$store.state.LoanRate = data.d.LoanRate;
          this.st = true;
        } else {
          this.st = false;
        }
      });
    },
    //라우터 코드로 이동
    // clickList() {
    //   this.$router.push({
    //     name: "CreateReview",
    //     query: { name: "Query 프로그래밍 방식", age: 2 },
    //   });
    // },
    // clickParams() {
    //   this.$router.push({
    //     name: "CreateReview",
    //     params: { name: "Params 프로그래밍 방식", age: 2 },
    //   });
    // },
    backReturn() {
      this.$store.state.reback = true;
      this.$router.push({
        name: "MyHomeMain",
        query: { state2: true },
      });
    },
    goPage(dest) {
      if (dest == "Bookmark" && this.st == false) {
        alert("홈즈조회 정보를 입력해 주세요.");
        return;
      }

      this.$router.push({
        name: dest,
      });
    },
    goPage2(dest) {
      this.$router.push({
        name: dest,
        query: { state: true },
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

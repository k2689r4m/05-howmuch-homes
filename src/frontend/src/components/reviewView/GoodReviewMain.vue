<template>
  <div class="wrap">
    <template v-if="reviewCreate">
      <CreateRevew @setReviewState="setReviewState"></CreateRevew>
    </template>
    <template v-else>
      <header class="header">
        <button
          type="button"
          class="btn btn-question"
          @click="qBtnState = true"
        ></button>
        <h2 class="header-tit">좋아요한 글 보기</h2>
        <!-- <router-link
          :to="{ name: 'Setting' }"
          tag="button"
          class="btn btn-menu"
        >
        </router-link> -->
      </header>
      <QuestionBtn
        :btnState="qBtnState"
        :menuState="false"
        @setState="btnQuestion"
      ></QuestionBtn>
      <div class="content bg bottom-exist">
        <div class="review-top">
          <div class="count">
            <strong>{{ reviewCount }}개</strong>의<br />
            좋아요한 글이 있습니다.
          </div>
          <!-- <button
            type="button"
            class="btn btn-write"
            @click="reviewCreate = true"
          >
            <img src="../../../public/images/icon/write.svg" />
            후기작성
          </button> -->
          <select class="select" @change="refreshItems">
            <option value="1">최근순</option>
            <option value="2">2억 이상만 보기</option>
            <option value="3">2억 이하만 보기</option>
          </select>
        </div>
        <ul class="review-list">
          <li
            v-for="item in items"
            v-bind:key="item.id"
            class="review-list--item"
          >
            <ListItem v-bind:item="item" @reItem="getReviewItem"></ListItem>
          </li>
          <template v-if="rId == null">
            <infinite-loading
              @infinite="infiniteHandler"
              force-use-infinite-wrapper="true"
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </template>
          <template v-else>
            <button
              type="button"
              class="btn btn-md btn-gradient btn-up"
              style="margin: auto"
              @click="refreshItems"
            >
              전체 리뷰 보기
            </button>
          </template>
        </ul>
      </div>
    </template>
    <!-- <template v-else> -->
    <!-- <MyHomeMain :rProgress="progress"></MyHomeMain> -->
    <!-- </template> -->
  </div>
</template>

<script>
import ListItem from "./ListItem.vue";
import CreateRevew from "./CreateRevew.vue";
import QuestionBtn from "../QuestionBtn.vue";
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "GoodReviewMain",
  props: {
    isHome: Boolean,
  },
  components: {
    ListItem,
    QuestionBtn,
    CreateRevew,
    InfiniteLoading,
  },
  mounted() {
    this.init();
    this.getUserData();
    this.getReviewCount();
    this.isHome_ = this.isHome;
  },
  data() {
    return {
      level: 0,
      reviewCount: 0,
      qBtnState: false,
      page: 1,
      isHome_: false,
      progress: 1,
      items: [],
      sortType: 1,
      reviewCreate: false,
      rId: null,
      userData: {
        Contact: "", //휴대폰번호
        VerifyKey: "", //인증번호
        HouseOwnership: "", //주택 보유 여부 string
        AvailableAmount: "", //가용금액 string
        LoanRate: 50, //대출 비율
        CreditScore: "", //신용점수
        TransactionType: "", //거래유형
        PropertyType: "", //매매유형
        City: "-1", //시/도
        County: "-1", //구/군
      },
    };
  },
  methods: {
    init() {
      this.$store.commit("init");
    },
    getReviewCount() {
      this.$apiGET("/myPage/like/reviews/count").then(({ data }) => {
        if (data.code === 200) {
          this.reviewCount = data.d.ReviewCount;
        }
      });
    },
    refreshItems(e) {
      this.rId = null;
      this.sortType = e.target.value;
      this.page = 1;
      this.items = [];
      this.getReviewItem(1);
      this.getReviewCount();
    },
    btnQuestion(st) {
      this.qBtnState = st;
    },
    infiniteHandler($state) {
      console.log("--");
      this.$apiGET(
        "/myPage/like/reviews?page=" + this.page + "&method=" + this.sortType
      ).then(({ data }) => {
        if (data.code === 200) {
          if (data.d.length) {
            for (let i = 0; i < data.d.length; i++) {
              let st = false;
              for (let ii = 0; ii < this.items.length; ii++) {
                if (data.d[i].Id == this.items[ii].Id) {
                  st = true;
                  break;
                }
              }

              if (st) {
                continue;
              }

              this.items.push(data.d[i]);
            }
            this.page++;
            $state.loaded();
          } else {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      });
    },
    getUserData() {
      this.$apiGET("/myhome/home").then(({ data }) => {
        if (data.code === 200) {
          if (data.d.Step != null) {
            this.progress = data.d.Step + 1;
          }

          if (data.d.AvailableAmount != null) {
            this.userData.AvailableAmount = data.d.AvailableAmount;
          }

          if (data.d.City != null) {
            this.userData.City = data.d.City;
          }

          if (data.d.County != null) {
            this.userData.County = data.d.County;
          }

          if (data.d.Contact != null) {
            this.userData.Contact = data.d.Contact;
          }

          if (data.d.CreditScore != null) {
            this.userData.CreditScore = data.d.CreditScore;
          }

          if (data.d.HouseOwnership != null) {
            this.userData.HouseOwnership = data.d.HouseOwnership;
          }

          if (data.d.LoanRate != null) {
            this.userData.LoanRate = data.d.LoanRate;
          }

          if (data.d.PropertyType != null) {
            this.userData.PropertyType = data.d.PropertyType;
          }

          if (data.d.TransactionType != null) {
            this.userData.TransactionType = data.d.TransactionType;
          }
        }

        if (this.userData.TransactionType == "전세퇴거") {
          this.level = Math.ceil((this.progress / 7) * 100);
        } else {
          this.level = Math.ceil((this.progress / 9) * 100);
        }
      });
    },
    getReviewItem(page) {
      this.$apiGET(
        "/myPage/like/reviews?page=" + page + "&method=" + this.sortType
      ).then(({ data }) => {
        if (data.code === 200) {
          this.items = data.d;
        }
      });
    },
    goToMyHome() {
      this.$router.push({
        name: "MyHomeMain",
        params: { name: "MyHomeMain" },
      });
    },
    setReviewState(st) {
      this.rId = null;
      this.reviewCreate = st;
      this.page = 1;
      this.items = [];
      this.getReviewItem(1);
      this.getReviewCount();
    },
  },
};
</script>

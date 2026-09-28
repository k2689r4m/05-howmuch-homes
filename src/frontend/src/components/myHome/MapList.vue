<template>
  <div class="wrap">
    <header class="header">
      <button
        type="button"
        class="btn btn-question"
        @click="qBtnState = true"
      ></button>
      <button type="button" class="btn btn-search text">
        {{ address }}
      </button>
      <!-- <button type="button" class="btn btn-menu"></button> -->
      <!-- <router-link :to="{ name: 'Setting' }" tag="button" class="btn btn-menu">
      </router-link> -->
    </header>
    <QuestionBtn
      :btnState="qBtnState"
      :menuState="false"
      @setState="btnQuestion"
    ></QuestionBtn>

    <div class="content">
      <!-- <div class="map-top">
        <div class="info">
          <div>
            <strong>{{ numberToKorean(AvailableAmount) }}</strong>
            <div>
              <span>자기자본</span>
              <button
                type="button"
                class="btn modi"
                @click="amount = true"
              ></button>
            </div>
          </div>
          <div>
            <strong>
              {{
                loan > 0
                  ? numberToKorean(
                      Math.ceil(AvailableAmount / (1 - loan * 0.01)) -
                        AvailableAmount
                    )
                  : "0원"
              }}
            </strong>
            <span>대출 금액</span>
          </div>
          <div>
            <strong>
              {{
                numberToKorean(Math.ceil(AvailableAmount / (1 - loan * 0.01)))
              }}
            </strong>
            <span>거래 가능 금액</span>
          </div>
        </div>
        <div class="status-wrap">
          <span class="mark mark-0"></span>
          <span class="mark mark-1"></span>
          <span class="mark mark-2"></span>
          <span class="mark mark-3"></span>
          <span class="mark mark-4"></span>
          <span class="mark mark-5"></span>
          <span class="mark mark-6"></span>
          <span class="mark mark-7"></span>
          <span class="mark mark-8"></span>
          <span class="mark mark-9"></span>
          <Slider
            v-model="loan"
            :step="1"
            @change="slideChange"
            :max="90"
            :min="0"
            :tooltipPosition="'bottom'"
            :format="format"
          />
          <div class="tooltip">
            <button
              type="button"
              class="btn btn-info"
              @click="tooltip = true"
              v-bind:class="{ active: tooltip }"
            ></button>
            <div class="con">
              대출 비율을 조정하며 사용할 수 있어요
              <button
                type="button"
                class="btn btn-close"
                @click="tooltip = false"
              ></button>
            </div>
          </div>
        </div>
        <span
          class="check"
          @click="btnOption(1)"
          v-bind:class="{ grey: !option1 }"
        >
          <img src="../../../public/images/icon/check.svg" alt="" />
          거래 가능
        </span>
        <span
          class="check orange"
          @click="btnOption(2)"
          v-bind:class="{ grey: !option2 }"
        >
          <img src="../../../public/images/icon/check.svg" alt="" />
          대출 상향 시 거래 가능
        </span>
        <span class="check re" @click="backReturn">
          <img src="../../../public/images/icon/re.svg" alt="" />
          재설정
        </span>
      </div> -->
      <div class="status-top type2">
        <p class="text-height--3 font-weight--3">
          <strong
            >총
            {{ this.$store.state.availCount + this.$store.state.loanCount }}개의
            매물</strong
          >
          <span class="font-color--primary"
            >거래가능매물 {{ this.$store.state.availCount }}개</span
          ><span class="font-color--orange m-l--10"
            >대출상향시 거래가능매물 {{ this.$store.state.loanCount }}개</span
          >
        </p>
        <button class="btn btn-list" @click="setState">
          <img src="../../../public/images/icon/map.svg" alt="" /> 지도
        </button>
        <select class="select">
          <option>매매가순</option>
        </select>
      </div>
      <div class="box-line"></div>
      <div v-if="itemList.length == 0" class="no-list">
        <img src="../../../public/images/no_list.svg" alt="" />
        거래 가능한 매물이 없습니다.
      </div>
      <ul v-else class="bookmark-list m-t--0">
        <template v-for="(item, idx) in itemList">
          <li
            v-if="item.AvailCount != 0 && option1"
            class="bookmark-list--item"
            @click="goDetail(item.Id, item.IsFavorite)"
            :key="'l_i_1_' + item.Id"
          >
            <div class="left">
              <strong class="tit">{{ item.Name }}</strong>
              <span class="price"
                >{{ item.PriceType }}
                {{ $numberToKorean2(item.MaxPrice) }}</span
              >
            </div>
            <div class="right">
              <button type="button" class="btn btn-house">
                {{ item.AvailCount }}
              </button>
              <button type="button" class="btn btn-house orange">
                {{ item.LoanCount }}
              </button>
              <button
                type="button"
                class="btn btn-star"
                v-bind:class="{ active: item.IsFavorite }"
                @click.stop
                @click="btnFavorite(idx)"
              ></button>
            </div>
          </li>
          <li
            v-else-if="item.LoanCount != 0 && option2"
            class="bookmark-list--item"
            @click="goDetail(item.Id, item.IsFavorite)"
            :key="'l_i_2_' + item.Id"
          >
            <div class="left">
              <strong class="tit">{{ item.Name }}</strong>
              <span class="price"
                >{{ item.PriceType }}
                {{ $numberToKorean2(item.MaxPrice) }}</span
              >
            </div>
            <div class="right">
              <button type="button" class="btn btn-house">
                {{ item.AvailCount }}
              </button>
              <button type="button" class="btn btn-house orange">
                {{ item.LoanCount }}
              </button>
              <button
                type="button"
                class="btn btn-star"
                v-bind:class="{ active: item.IsFavorite }"
                @click.stop
                @click="btnFavorite(idx)"
              ></button>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <!-- <button type="button" class="btn btn-map" @click="setState">
      <img src="../../../public/images/icon/map.svg" alt="" />
      지도
    </button> -->
  </div>
</template>

<script>
import QuestionBtn from "../QuestionBtn.vue";
// import Slider from "@vueform/slider/dist/slider.vue2.js";
export default {
  name: "MapList",
  props: {},
  components: { QuestionBtn },
  data() {
    return {
      amount: false,
      amount2: false,
      AvailableAmount_: "",
      tooltip: false,
      qBtnState: false,
      itemList: [],
      option1: true,
      option2: true,
      AvailableAmount: "",
      loan: 0,
      address: "",
    };
  },
  mounted() {
    // this.itemList = this.$store.state._itemList;
    this.loan = this.$store.state.LoanRate;
    this.AvailableAmount = this.$store.state.AvailableAmount;
    this.getItems();
    this.address = this.$store.state._address.Name.replace(" ", " > ");
  },
  methods: {
    btnModiCap() {
      this.AvailableAmount_ = this.AvailableAmount;
      this.amount2 = true;
    },
    btnSaveCap() {
      if (this.AvailableAmount_.length > 0) {
        this.AvailableAmount = Number(this.AvailableAmount_) * 10000;
        this.$store.state.LoanRate = this.loan;
        this.getItems();
        this.amount = false;
        this.amount2 = false;
      } else {
        this.amount = false;
        this.amount2 = false;
      }
    },
    backReturn() {
      this.$store.state.reback = true;
      this.$router.push({
        name: "MyHomeMain",
      });
    },
    btnFavorite(idx) {
      this.$apiPOST("/favorite", {
        ApartmentId: this.itemList[idx].Id,
        Type: !this.itemList[idx].IsFavorite,
      }).then(({ data }) => {
        if (data.code === 200) {
          this.itemList[idx].IsFavorite = !this.itemList[idx].IsFavorite;
        }
      });
    },
    getItems() {
      this.itemList_ = this.itemList;
      this.markerState = false;
      const l = this.$store.state.l;
      const r = this.$store.state.r;
      const t = this.$store.state.t;
      const b = this.$store.state.b;
      this.$apiGET(
        "/map/apartment?l=" +
          l +
          "&r=" +
          r +
          "&t=" +
          t +
          "&b=" +
          b +
          "&loan=" +
          this.loan * 0.01 +
          "&availableAmount=" +
          this.AvailableAmount
      ).then(({ data }) => {
        if (data.code === 200) {
          this.itemList = data.d;
          this.$store.state.AvailableAmount = this.AvailableAmount;
          this.$store.state.LoanRate = this.loan;
        }
      });
    },
    slideChange() {
      this.getItems();
      this.$store.state.LoanRate = this.loan;
    },
    btnOption(type) {
      if (type === 1) {
        this.option1 = !this.option1;
      } else {
        this.option2 = !this.option2;
      }
    },
    btnQuestion(st) {
      this.qBtnState = st;
    },
    //라우터 코드로 이동
    clickList() {
      this.$router.push({
        name: "CreateReview",
        query: { name: "Query 프로그래밍 방식", age: 2 },
      });
    },
    goDetail(id, isFavorite) {
      this.$router.push({
        name: "MapListDetail",
        query: {
          apartmentId: id,
          loan: this.$store.state.LoanRate * 0.01,
          isFavorite: isFavorite,
        },
      });
    },
    setState() {
      // console.log(this.$router.getRoutes());
      this.$router.go(-1);

      // this.$emit("setState", false);
    },

    format(value) {
      return `${parseInt(value)}%`;
    },
  },
};
</script>

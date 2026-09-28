<template>
  <div>
    <header class="header">
      <button type="button" class="btn btn-back" @click="setState"></button>
      <h2 class="header-tit">{{ aName }} - {{ size }}평</h2>
      <!-- <button
        type="button"
        class="btn btn-star"
        v-bind:class="{ active: isFavo }"
        @click="btnFavorite"
      ></button> -->
    </header>
    <div class="popup alert" v-bind:class="{ active: amount }">
      <div class="popup-dim"></div>
      <div class="popup-wrap">
        <div class="popup-con">
          <div class="modi-capital">
            <div class="text-left">
              자기 자본 수정
              <span class="font-color--l-grey float-right">
                {{ $numberToKorean(AvailableAmount_) }}
              </span>
            </div>
            <!-- <div class="box" > -->
            <div class="box">
              <!-- <div>
                  {{ $numberToKorean(AvailableAmount) }}
                </div> -->
              <input type="tel" class="num" @keyup="setMount" ref="textNum" />
              <span class="m-l--5">만원</span>
            </div>
          </div>
        </div>
        <div class="popup-btn">
          <button
            type="button"
            class="btn left"
            @click="(amount = false), (amount2 = false)"
          >
            취소
          </button>
          <button type="button" class="btn right" @click="btnSaveCap">
            적용
          </button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="map-top">
        <!-- <div class="price">
          <strong>{{ numberToKorean($store.state.AvailableAmount) }}</strong>
        </div> -->
        <div class="info">
          <div>
            <strong>{{
              $numberToKorean(Number(AvailableAmount) / 10000)
            }}</strong>
            <div>
              <span>자기자본</span>
              <button type="button" class="btn modi" @click="btnPopup"></button>
            </div>
          </div>
          <div>
            <strong>
              {{
                loan > 0
                  ? $numberToKorean(
                      Math.ceil(
                        Number(AvailableAmount) / 10000 / (1 - loan * 0.01)
                      ) -
                        Number(AvailableAmount) / 10000
                    )
                  : "0원"
              }}
            </strong>
            <span>대출 금액</span>
          </div>
          <div>
            <strong>
              {{
                $numberToKorean(
                  Math.ceil(Number(AvailableAmount) / 10000 / (1 - loan * 0.01))
                )
              }}
            </strong>
            <span>거래 가능 금액</span>
          </div>
        </div>
        <div class="status-wrap left">
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
          <!-- <div class="status-bar">
            <div
              class="fill"
              :style="{ width: this.$store.state.LoanRate + '%' }"
            >
              <span class="percent">{{ this.$store.state.LoanRate }}%</span>
            </div>
          </div> -->
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
      </div>
      <div class="box-line"></div>
      <ul class="detail-list">
        <template v-for="(item, idx) in itemList">
          <li
            v-if="item.IsAvailCount != 0 && option1"
            :key="'ii_4_' + item.ApartmentSaleId + '_' + idx"
            class="detail-list--item"
            v-bind:class="{ active: item.state }"
            @click="selectItem(idx)"
          >
            <div class="left">
              <img src="../../../public/images/icon/cm.svg" alt="" />
              {{ Math.floor(item.Size) }}평
            </div>
            <div class="right">
              <strong>거래 가능합니다.</strong>
              {{ item.Level }} | {{ $numberToKorean2(item.Price) }}
            </div>
            {{ item.UploadDate }}
          </li>
          <li
            v-else-if="item.IsLoanCount != 0 && option2"
            :key="'ii_5_' + item.ApartmentSaleId + '_' + idx"
            class="detail-list--item orange"
            v-bind:class="{ active: item.state }"
            @click="selectItem(idx)"
          >
            <div class="left">
              <img src="../../../public/images/icon/cm.svg" alt="" />
              {{ Math.floor(item.Size) }}평
            </div>
            <div class="right">
              <strong>대출 비율 조정시 거래 가능합니다.</strong>
              {{ item.Level }} | {{ $numberToKorean2(item.Price) }}
            </div>
            {{ item.UploadDate }}
          </li>
        </template>

        <!-- <template v-for="(item, idx) in itemList"> </template> -->

        <!-- detail-list--item에 active추가하면 파란색 진한선이랑 그림자(0102추가) -->
        <!-- <template v-for="(item, idx) in itemList">
          <li
            v-if="item.AvailCount == 0 && item.LoanCount != 0 && option2"
            :key="'ii_1_' + item.ApartmentSaleId + '_' + idx"
            class="detail-list--item orange"
            v-bind:class="{ active: item.state }"
            @click="selectItem(idx)"
          >
            <div class="left">
              <img src="../../../public/images/icon/cm.svg" alt="" />
              {{ Math.floor(item.Size) }}평
            </div>
            <div class="right">
              <strong>대출 비율 조정시 거래 가능합니다.</strong>
              <div class="low">
                평형 최저가
                <span class="price">
                  {{ numberToKorean(item.MinPrice) }}
                </span>
              </div>
              <div class="high">
                평형 최고가
                <span class="price">
                  {{ numberToKorean(item.MaxPrice) }}
                </span>
              </div>
            </div>
            <div class="count">
              <div class="num">{{ item.AvailCount + item.LoanCount }}</div>
              매물 수
            </div>
          </li>
        </template> -->

        <!-- 
        <template v-for="(item, idx) in itemList">
          <li
            v-if="item.AvailCount == 0 && item.LoanCount == 0"
            :key="'ii_2_' + item.Id + '_' + idx"
            class="detail-list--item grey"
          >
            <div class="left">
              <img src="../../../public/images/icon/cm.svg" alt="" />
              {{ Math.floor(item.Size) }}평
            </div>
            <div class="right"></div>
          </li>
        </template> -->
      </ul>
    </div>
    <button
      type="button"
      class="btn btn-full btn-gradient btn-fix"
      @click="sendConsult"
      :disabled="!state"
    >
      상담신청
    </button>
  </div>
</template>

<script>
import Slider from "@vueform/slider/dist/slider.vue2.js";
export default {
  name: "MapListDetail2",
  props: {},
  components: { Slider },
  data() {
    return {
      state: false,
      apartmentId: null,
      size: null,
      amount: false,
      amount2: false,
      AvailableAmount_: "",
      AvailableAmount: "",
      tooltip: false,
      itemList: [],
      option1: true,
      option2: true,
      aName: "",
      aMinPrice: "",
      isFavo: false,
      loan: 0,
    };
  },
  mounted() {
    this.apartmentId = this.$route.query.apartmentId;
    this.size = this.$route.query.size;
    this.aName = this.$route.query.aName;
    this.loan = this.$store.state.LoanRate;
    this.AvailableAmount = this.$store.state.AvailableAmount;
    this.getItemList();
  },
  methods: {
    btnPopup() {
      this.amount = true;
      this.AvailableAmount_ = Number(this.AvailableAmount) / 10000;

      let value = this.AvailableAmount_;
      this.$nextTick(() => {
        const formatValue = value.toLocaleString("ko-KR");
        this.$refs.textNum.value = formatValue;
      });
    },
    setMount(e) {
      let value = e.target.value;
      value = Number(value.replaceAll(",", ""));
      if (isNaN(value)) {
        //NaN인지 판별
        e.target.value = 0;
        this.AvailableAmount_ = 0;
      } else {
        //NaN이 아닌 경우
        const formatValue = value.toLocaleString("ko-KR");
        e.target.value = formatValue;
        this.AvailableAmount_ = Number(e.target.value.replaceAll(",", ""));
      }
    },
    selectItem(idx) {
      for (let i = 0; i < this.itemList.length; i++) {
        this.itemList[i].state = false;
      }
      this.itemList[idx].state = true;

      this.state = true;

      this.itemList.push("1");
      this.itemList.pop();
    },
    btnModiCap() {
      this.AvailableAmount_ = this.AvailableAmount;
      this.amount2 = true;
    },
    btnSaveCap() {
      if (this.AvailableAmount_ != null) {
        this.AvailableAmount = Number(this.AvailableAmount_) * 10000;
        this.$store.state.LoanRate = this.loan;
        this.getItemList();
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
    slideChange() {
      // this.getItems();
      this.getItemList();
      this.$store.state.LoanRate = this.loan;
      this.state = false;
    },
    sendConsult() {
      if (this.itemList.length > 0) {
        let tData = null;
        for (let i = 0; i < this.itemList.length; i++) {
          if (this.itemList[i].state) {
            tData = this.itemList[i];
            break;
          }
        }

        if (tData != null) {
          this.$apiPOST("/consult", {
            ApartmentSaleId: tData.ApartmentSaleId,
            Loan: this.loan,
            AvailableAmount: this.AvailableAmount,
          }).then(({ data }) => {
            if (data.code === 200) {
              alert(
                "상담 신청이 완료 되었습니다.\n상담사 배정 후 상담 안내\n드리겠습니다."
              );
              this.$router.push({
                name: "HowMain",
              });
            }
          });
        }
      }
    },
    btnOption(type) {
      if (type === 1) {
        this.option1 = !this.option1;
      } else {
        this.option2 = !this.option2;
      }

      for (let i = 0; i < this.itemList.length; i++) {
        this.itemList[i].state = false;
      }
      this.state = false;
    },
    getItemList() {
      this.$apiGET(
        "/map/apartment/detail/size?apartmentId=" +
          this.apartmentId +
          "&loan=" +
          this.loan * 0.01 +
          "&availableAmount=" +
          this.AvailableAmount +
          "&size=" +
          this.size
      ).then(({ data }) => {
        if (data.code === 200) {
          this.itemList = data.d;

          for (let i = 0; i < this.itemList.length; i++) {
            this.itemList[i].state = false;
          }

          if (this.itemList.length > 0) {
            // this.aName = this.itemList[0].Name;
            this.aMinPrice = this.$numberToKorean2(this.itemList[0].MinPrice);
            this.$store.state.AvailableAmount = this.AvailableAmount;
            this.$store.state.LoanRate = this.loan;
          }
        }
      });
    },
    //라우터 코드로 이동
    clickList() {
      this.$router.push({
        name: "CreateReview",
        query: { name: "Query 프로그래밍 방식", age: 2 },
      });
    },
    clickParams() {
      this.$router.push({
        name: "CreateReview",
        params: { name: "Params 프로그래밍 방식", age: 2 },
      });
    },
    setState() {
      this.$router.go(-1);
    },

    btnFavorite() {
      this.$apiPOST("/favorite", {
        ApartmentId: this.$route.query.apartmentId,
        Type: !this.isFavo,
      }).then(({ data }) => {
        if (data.code === 200) {
          this.isFavo = !this.isFavo;
          for (let i = 0; i < this.$store.state._itemList.length; i++) {
            if (
              this.$store.state._itemList[i].Id == this.$route.query.apartmentId
            ) {
              this.$store.state._itemList[i].IsFavorite = this.isFavo;
              break;
            }
          }
        }
      });
    },
    format(value) {
      return `${parseInt(value)}%`;
    },
  },
};
</script>

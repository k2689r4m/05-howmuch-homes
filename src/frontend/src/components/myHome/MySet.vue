<template>
  <div class="wrap" ref="msg3" id="zx1">
    <div class="con-bottom top">
      <div class="status-top">
        <button type="button" class="btn btn-close" @click="btnExit"></button>
      </div>
    </div>
    <div
      class="content bg top-exist"
      v-bind:class="{ 'keypad-exist': keyState }"
      ref="msg2"
    >
      <ul class="chat-list" ref="msg">
        <!-- 거래유형 매물/전세 퇴거..-->
        <li class="chat-list--item left" v-if="progress_ >= 3" id="li_3">
          <div class="chat-wrap">
            <div class="top">
              <strong>원하는 거래 유형을 선택하세요.</strong>
            </div>
            <div class="bottom" v-if="progress_ === 3">
              <div class="check-list">
                <label class="check-wrap">
                  <input
                    type="radio"
                    id="ttype_1"
                    value="매매"
                    v-model="userData.TransactionType"
                    @click="btnSend('매매')"
                  />
                  <span class="text">매매</span>
                </label>
                <label class="check-wrap">
                  <input
                    type="radio"
                    id="ttype_2"
                    value="전세퇴거"
                    v-model="userData.TransactionType"
                    disabled
                  />
                  <span class="text">전세 퇴거</span>
                </label>
              </div>
            </div>
            <div class="bottom" v-else>
              <button type="button" class="btn" @click="btnGoToback(3)">
                재입력
                <img src="../../../public/images/icon/arrow.svg" />
              </button>
            </div>
          </div>
        </li>
        <li class="chat-list--item right" v-if="progress_ >= 4">
          <div class="chat-wrap">
            <div class="top">{{ userData.TransactionType }}</div>
          </div>
        </li>

        <template v-if="progress_ >= 4 && userData.TransactionType == '매매'">
          <!-- 주택 보유 여부 -->
          <li class="chat-list--item left" v-if="progress_ >= 4" id="li_4">
            <div class="chat-wrap">
              <div class="top">
                <strong>주택 보유를 하고 있나요?</strong>
              </div>
              <div class="bottom" v-if="progress_ === 4">
                <div class="check-list">
                  <label class="check-wrap">
                    <input
                      type="radio"
                      id="capital"
                      value="1주택 이상 보유"
                      v-model="userData.HouseOwnership"
                      @click="btnSend('1주택 이상 보유')"
                    />
                    <span class="text">1주택 이상 보유</span>
                  </label>
                  <label class="check-wrap">
                    <input
                      type="radio"
                      name="capital"
                      value="무주택"
                      v-model="userData.HouseOwnership"
                      @click="btnSend('무주택')"
                    />
                    <span class="text">무주택</span>
                  </label>
                </div>
              </div>
              <div class="bottom" v-else>
                <button type="button" class="btn" @click="btnGoToback(4)">
                  재입력
                  <img src="../../../public/images/icon/arrow.svg" />
                </button>
              </div>
            </div>
          </li>
          <li
            class="chat-list--item right"
            v-if="userData.HouseOwnership != '' && progress_ >= 5"
          >
            <div class="chat-wrap">
              <div class="top">{{ userData.HouseOwnership }}</div>
            </div>
          </li>

          <!-- 가용 금액 -->
          <li class="chat-list--item left" v-if="progress_ >= 5" id="li_5">
            <div class="chat-wrap">
              <div class="top">
                <strong>가용 가능한 금액을 입력해주세요.</strong>
              </div>
              <div class="bottom" v-if="progress_ == 5">
                <div class="input">{{ userData.AvailableAmount | comma }}</div>
                <span class="guide">{{ assets_ }}</span>
              </div>
              <div class="bottom" v-else>
                <button type="button" class="btn" @click="btnGoToback(5)">
                  재입력
                  <img src="../../../public/images/icon/arrow.svg" />
                </button>
              </div>
            </div>
          </li>
          <li
            class="chat-list--item right"
            v-if="assets_ != '' && progress_ >= 6"
          >
            <div class="chat-wrap">
              <div class="top">{{ assets_ }}</div>
            </div>
          </li>

          <!-- 대출 비율 -->
          <li
            class="chat-list--item left wd-100"
            v-if="progress_ >= 6"
            id="li_6"
          >
            <div class="chat-wrap">
              <div class="top">
                <strong>원하는 대출 비율을 선택하세요.</strong>
              </div>

              <div class="bottom" v-if="progress_ == 6">
                <div class="map-top">
                  <div class="info">
                    <div>
                      <strong>{{
                        $numberToKorean(userData.AvailableAmount)
                      }}</strong>
                      <div>
                        <span>자기 자본</span>
                      </div>
                    </div>
                    <div>
                      <strong>{{
                        userData.LoanRate > 0
                          ? $numberToKorean(
                              Math.ceil(
                                userData.AvailableAmount /
                                  (1 - userData.LoanRate * 0.01)
                              ) - userData.AvailableAmount
                            )
                          : "0원"
                      }}</strong>
                      <span>대출 금액</span>
                    </div>
                    <div>
                      <strong>{{
                        $numberToKorean(
                          Math.ceil(
                            userData.AvailableAmount /
                              (1 - userData.LoanRate * 0.01)
                          )
                        )
                      }}</strong>
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
                      v-model="userData.LoanRate"
                      :step="1"
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
                </div>
                <!-- <div class="range-wrap">
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
                  <strong
                    ><span class="num">{{ userData.LoanRate }}</span
                    >%</strong
                  >
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value="50"
                    class="styled-slider slider-progress"
                    step="1"
                    :style="{
                      '--min': 0,
                      '--max': 90,
                      '--value': userData.LoanRate,
                    }"
                    v-model="userData.LoanRate"
                  />
                </div> -->
                <button
                  type="button"
                  class="btn btn-full btn-gradient"
                  @click="btnSend(null)"
                >
                  입력
                </button>
              </div>
              <div class="bottom" v-else>
                <button type="button" class="btn" @click="btnGoToback(6)">
                  재입력
                  <img src="../../../public/images/icon/arrow.svg" />
                </button>
              </div>
            </div>
          </li>
          <li
            class="chat-list--item right"
            v-if="assets_ != '' && progress_ >= 7"
          >
            <div class="chat-wrap">
              <div class="top">{{ userData.LoanRate }}%</div>
            </div>
          </li>

          <!-- 매물유형 아파트/오피스텔...-->
          <li class="chat-list--item left" v-if="progress_ >= 7" id="li_7">
            <div class="chat-wrap">
              <div class="top">
                <strong>원하는 매물 유형을 선택하세요.</strong>
              </div>
              <div class="bottom" v-if="progress_ === 7">
                <div class="check-list">
                  <label class="check-wrap">
                    <input
                      type="radio"
                      id="sale_1"
                      value="아파트"
                      v-model="userData.PropertyType"
                      @click="btnSend('아파트')"
                    />
                    <span class="text">아파트</span>
                  </label>
                  <label class="check-wrap">
                    <input
                      type="radio"
                      id="sale_2"
                      value="오피스텔"
                      v-model="userData.PropertyType"
                      @click="btnSend('오피스텔')"
                    />
                    <span class="text">오피스텔</span>
                  </label>
                  <label class="check-wrap">
                    <input
                      type="radio"
                      id="sale_3"
                      value="기타"
                      v-model="userData.PropertyType"
                      @click="btnSend('기타')"
                    />
                    <span class="text">기타</span>
                  </label>
                </div>
              </div>
              <div class="bottom" v-else>
                <button type="button" class="btn" @click="btnGoToback(7)">
                  재입력
                  <img src="../../../public/images/icon/arrow.svg" />
                </button>
              </div>
            </div>
          </li>
          <li
            class="chat-list--item right"
            v-if="userData.HouseOwnership != '' && progress_ >= 8"
          >
            <div class="chat-wrap">
              <div class="top">{{ userData.PropertyType }}</div>
            </div>
          </li>

          <!-- 지역 -->
          <li class="chat-list--item left" v-if="progress_ >= 8" id="li_8">
            <div class="chat-wrap">
              <div class="top">
                <strong>원하는 지역을 선택하세요.</strong>
              </div>
              <div class="bottom" v-if="progress_ === 8">
                <VuePicker
                  v-model="userData.City"
                  key="City_pick"
                  class="m-b--10"
                  @open="pickDown"
                >
                  <vue-picker-option
                    @click="btnSend('-1')"
                    value="-1"
                    key="city_"
                  >
                    지역
                  </vue-picker-option>
                  <template v-for="c in cities">
                    <div @click="getDvsns(c.Id)" :key="'city_' + c.Id">
                      <vue-picker-option :value="c.Id + ''">
                        {{ c.Name }}
                      </vue-picker-option>
                    </div>
                  </template>
                </VuePicker>
                <VuePicker
                  v-model="userData.County"
                  key="County_pick"
                  :disabled="userData.City == '-1'"
                  @open="pickDown"
                >
                  <vue-picker-option value="-1" key="dvsns_" :isDisabled="true">
                    도시
                  </vue-picker-option>
                  <template v-for="c in dvsns">
                    <div
                      :key="'dvsns_' + c.Id"
                      v-if="userData.City != '-1'"
                      @click="btnSend(null)"
                    >
                      <vue-picker-option :value="c.Id + ''">
                        {{ c.Name }}
                      </vue-picker-option>
                    </div>
                  </template>
                </VuePicker>
              </div>
              <div class="bottom" v-else>
                <button type="button" class="btn" @click="btnGoToback(8)">
                  재입력
                  <img src="../../../public/images/icon/arrow.svg" />
                </button>
              </div>
            </div>
          </li>
          <li
            class="chat-list--item right"
            v-if="userData.HouseOwnership != '' && progress_ >= 9"
          >
            <div class="chat-wrap">
              <div class="top">
                {{ getCityName(userData.City) }}/
                {{ getDvsnName(userData.County) }}
              </div>
            </div>
          </li>

          <!-- 마지막 -->
          <li class="chat-list--item left" v-if="progress_ >= 9" id="li_9">
            <div class="chat-wrap">
              <div class="top">
                <ul class="input-list">
                  <li class="input-list--item">
                    <label>가용 금액</label>
                    <span>{{ assets_ }}</span>
                  </li>
                  <li class="input-list--item">
                    <label>대출 비율</label>
                    <span>{{ userData.LoanRate }}%</span>
                  </li>
                  <!-- <li class="input-list--item">
                    <label>신용 점수</label>
                    <span>{{ userData.CreditScore }}</span>
                  </li> -->
                  <li class="input-list--item">
                    <label>거래 유형</label>
                    <span>{{ userData.TransactionType }}</span>
                  </li>
                  <li class="input-list--item">
                    <label>매물 유형</label>
                    <span>{{ userData.PropertyType }}</span>
                  </li>
                  <li class="input-list--item">
                    <label>관심 지역</label>
                    <span>
                      {{ getCityName(userData.City) }}
                      ({{ getDvsnName(userData.County) }})
                    </span>
                  </li>
                </ul>
                <button class="btn btn-full btn-gradient" @click="saveMyHome">
                  입력
                </button>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>

    <div class="key-pad" v-if="keyState">
      <ul class="key-list">
        <li class="key-list--item" @click="iNumber('1')">1</li>
        <li class="key-list--item" @click="iNumber('2')">2</li>
        <li class="key-list--item" @click="iNumber('3')">3</li>
        <li class="key-list--item" @click="iNumber('4')">4</li>
        <li class="key-list--item" @click="iNumber('5')">5</li>
        <li class="key-list--item" @click="iNumber('6')">6</li>
        <li class="key-list--item" @click="iNumber('7')">7</li>
        <li class="key-list--item" @click="iNumber('8')">8</li>
        <li class="key-list--item" @click="iNumber('9')">9</li>

        <li
          v-if="progress_ == 1"
          class="key-list--item"
          @click="iNumber('010')"
        >
          010
        </li>
        <li v-else class="key-list--item"></li>

        <li class="key-list--item" @click="iNumber('0')">0</li>
        <li class="key-list--item" @click="iNumber('back')">
          <img src="../../../public/images/icon/delete.svg" />
        </li>
      </ul>
      <button
        type="button"
        class="btn btn-full btn-gradient"
        @click="btnSend(null)"
      >
        입력
      </button>
    </div>
  </div>
</template>

<script>
import Slider from "@vueform/slider/dist/slider.vue2.js";
export default {
  name: "MyHomeMain",
  props: {
    // rProgress: {
    //   type: Number,
    //   default: 1,
    // },
  },
  components: { Slider },
  mounted() {
    this.getCities();
    this.init();
  },
  updated() {
    // console.log(this.keyState[this.progress_]);
    console.log(this.progress_);
  },
  filters: {
    comma(val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  watch: {
    progress_() {
      // 화면에 추가된 후 동작하도록
      this.$nextTick(() => {
        this.downScroll();
      });
    },
  },
  data() {
    return {
      level: 0,
      keyState: false,
      rBtnState: false,

      progress_: 3,
      phoneNumber_: "",
      VerifyKey: "001234",
      assets_: "",
      cities: [],
      dvsns: [],
      cityData: {
        AAA: ["A1", "A2", "A3"],
        BBB: ["B1", "B2", "B3"],
        CCC: ["C1", "C2", "C3"],
      },
      userData: {
        Contact: "", //휴대폰번호
        VerifyKey: "", //인증번호
        HouseOwnership: "", //주택 보유 여부 string
        AvailableAmount: "", //가용금액 string
        LoanRate: 50, //대출 비율
        CreditScore: "", //신용점수
        TransactionType: "매매", //거래유형
        PropertyType: "", //매매유형
        City: "-1", //시/도
        County: "-1", //구/군
      },

      tooltip: false,
    };
  },
  methods: {
    init() {
      // this.userData = this.rUserData;
      // this.progress_ = this.rProgress;
      // this.$store.state._itemList = [];
      // this.$store.state.lat = null;
      // this.$store.state.lng = null;
      // console.log("state" in this.$route.query);
      // this.$store.commit("init");
      // this.getUserData();
    },
    pickDown() {
      this.$nextTick(() => {
        this.downScroll();
      });
    },
    downScroll() {
      this.$refs.msg.scrollTo({
        top: this.$refs.msg.scrollHeight,
        behavior: "smooth",
      });

      this.$refs.msg2.scrollTo({
        top: this.$refs.msg2.scrollHeight,
        behavior: "smooth",
      });

      this.$refs.msg3.scrollTo({
        top: this.$refs.msg3.scrollHeight,
        behavior: "smooth",
      });

      // window.scrollY = document.body.clientHeight;
      if (this.progress_ != 1) {
        // document.body.scrollTop = document.body.scrollHeight;

        const location = document.querySelector(
          "#li_" + this.progress_
        ).offsetTop;

        document.body.scrollTo({
          top: location,
          behavior: "smooth",
        });
      }
    },
    backLevel() {
      if (this.progress_ == 1) {
        this.$router.push({
          name: "HowMain",
        });
      } else if (this.progress_ == 3) {
        this.progress_ = 1;
      } else {
        // if (this.progress_ >= 4 && this.userData.TransactionType == "매매") {

        // }
        this.progress_--;
        this.keySet();
      }
    },
    goMap() {
      this.$store.state.AvailableAmount = this.userData.AvailableAmount;
      this.$store.state.LoanRate = this.userData.LoanRate;
      this.$router.replace({
        name: "MapMain",
      });
    },
    getCityName(id) {
      for (let i = 0; i < this.cities.length; i++) {
        if (Number(this.cities[i].Id) == Number(id)) {
          return this.cities[i].Name;
        }
      }
      return "none";
    },
    getDvsnName(id) {
      for (let i = 0; i < this.dvsns.length; i++) {
        if (Number(this.dvsns[i].Id) == Number(id)) {
          return this.dvsns[i].Name;
        }
      }
      return "none";
    },
    getCities() {
      this.$apiGET("/cities").then(({ data }) => {
        this.cities = data.d;
      });
    },
    _getDvsns(id, countyId) {
      this.$apiGET("/dvsns?CityId=" + id).then(({ data }) => {
        this.dvsns = data.d;
        this.userData.County = countyId;
      });
    },
    getDvsns(id) {
      this.$apiGET("/dvsns?CityId=" + id).then(({ data }) => {
        this.dvsns = data.d;
        this.userData.County = "-1";
      });
    },

    keySet() {
      if (this.progress_ === 1) {
        this.keyState = true;
      } else if (this.progress_ === 2) {
        this.keyState = true;
      } else if (this.progress_ === 3) {
        this.keyState = false;
      } else if (this.progress_ >= 4) {
        if (this.userData.TransactionType == "매매") {
          if (this.progress_ === 4) {
            this.keyState = false;
          } else if (this.progress_ === 5) {
            this.userData.AvailableAmount = "";
            this.assets_ = "";
            this.keyState = true;
          } else if (this.progress_ === 6) {
            this.userData.LoanRate = 50;
            this.keyState = false;
          } else if (this.progress_ === 7) {
            this.userData.PropertyType = "";
            this.keyState = false;
          } else if (this.progress_ === 8) {
            this.userData.City = "-1";
            this.userData.County = "-1";
            this.keyState = false;
          } else if (this.progress_ === 9) {
            this.keyState = false;
          }
        } else if (this.userData.TransactionType == "전세퇴거") {
          if (this.progress_ === 4) {
            this.userData.AvailableAmount = "";
            this.assets_ = "";
            this.keyState = true;
          } else if (this.progress_ === 5) {
            this.userData.LoanRate = 50;
            this.keyState = false;
          } else if (this.progress_ === 6) {
            this.userData.City = "-1";
            this.userData.County = "-1";
            this.keyState = false;
          } else if (this.progress_ === 7) {
            this.keyState = false;
          }
        }
      }

      if (this.userData.TransactionType == "전세퇴거") {
        this.level = Math.ceil((this.progress_ / 7) * 100);
      } else {
        this.level = Math.ceil((this.progress_ / 9) * 100);
      }
    },
    iNumber(num) {
      if (this.progress_ === 1) {
        if (num === "back") {
          this.phoneNumber_ = this.phoneNumber_.slice(0, -1);
          this.userData.Contact = this.getMask(this.phoneNumber_);
        } else if (this.phoneNumber_.length < 11) {
          if (num === "010") {
            if (this.phoneNumber_.length === 0) {
              this.phoneNumber_ += num;
              this.userData.Contact = this.getMask(this.phoneNumber_);
            }
          } else {
            this.phoneNumber_ += num;
            this.userData.Contact = this.getMask(this.phoneNumber_);
          }
        }
      } else if (this.progress_ === 2) {
        if (num === "back") {
          this.userData.VerifyKey = this.userData.VerifyKey.slice(0, -1);
        } else if (this.userData.VerifyKey.length < 11) {
          if (num === "010") {
            if (this.userData.VerifyKey.length === 0) {
              this.userData.VerifyKey += num;
            }
          } else {
            this.userData.VerifyKey += num;
          }
        }
      } else if (
        this.userData.TransactionType == "전세퇴거" &&
        this.progress_ === 4
      ) {
        if (num === "back") {
          this.userData.AvailableAmount = this.userData.AvailableAmount.slice(
            0,
            -1
          );
          this.assets_ = this.$numberToKorean(this.userData.AvailableAmount);
        } else if (this.userData.AvailableAmount.length < 11) {
          if (num === "010") {
            if (this.userData.AvailableAmount.length === 0) {
              this.userData.AvailableAmount += num;
              this.assets_ = this.$numberToKorean(
                this.userData.AvailableAmount
              );
            }
          } else {
            this.userData.AvailableAmount += num;
            this.assets_ = this.$numberToKorean(this.userData.AvailableAmount);
          }
        }
        if (this.assets_.charAt(this.assets_.length - 1) === " ") {
          this.assets_ = this.assets_.slice(0, -1);
        }
      } else if (
        this.userData.TransactionType == "매매" &&
        this.progress_ === 5
      ) {
        if (num === "back") {
          this.userData.AvailableAmount = this.userData.AvailableAmount.slice(
            0,
            -1
          );
          this.assets_ = this.$numberToKorean(this.userData.AvailableAmount);
        } else if (this.userData.AvailableAmount.length < 11) {
          if (num === "010") {
            if (this.userData.AvailableAmount.length === 0) {
              this.userData.AvailableAmount += num;
              this.assets_ = this.$numberToKorean(
                this.userData.AvailableAmount
              );
            }
          } else {
            this.userData.AvailableAmount += num;
            this.assets_ = this.$numberToKorean(this.userData.AvailableAmount);
          }
        }
        if (this.assets_.charAt(this.assets_.length - 1) === " ") {
          this.assets_ = this.assets_.slice(0, -1);
        }
      }

      this.$nextTick(() => {
        this.downScroll();
      });
    },
    btnSend(param) {
      if (this.progress_ === 1) {
        //전화번호
        this.progress_++;
        this.keySet();
      } else if (this.progress_ === 2) {
        //인증번호
        this.progress_++;
        this.keySet();
      } else if (this.progress_ === 3) {
        //거래유형
        this.userData.TransactionType = param;
        this.progress_++;
        this.keySet();
      } else if (this.progress_ >= 4) {
        if (this.userData.TransactionType == "매매") {
          if (this.progress_ === 4) {
            //주택 보유 여부
            this.userData.HouseOwnership = param;
            this.progress_++;
            this.keySet();
          } else if (this.progress_ === 5) {
            //가용가능한 금액
            if (Number(this.userData.AvailableAmount) * 10000 >= 10000000) {
              this.progress_++;
              this.keySet();
            } else {
              alert("천만원 이상 입력 가능합니다.");
            }
          } else if (this.progress_ === 6) {
            //대출비율
            this.progress_++;
            this.keySet();
          } else if (this.progress_ === 7) {
            //매물유형
            this.userData.PropertyType = param;
            this.progress_++;
            this.keySet();
          } else if (this.progress_ === 8) {
            //지역
            this.progress_++;
            this.keySet();
          } else if (this.progress_ === 9) {
            this.progress_++;
            this.keySet();
          }
        }
      }

      this.$nextTick(() => {
        this.downScroll();
      });
    },
    saveMyHome() {
      this.$apiPOST("/myhome/additional", {
        HouseOwnership: this.userData.HouseOwnership,
        AvailableAmount: Number(this.userData.AvailableAmount) * 10000,
        LoanRate: Number(this.userData.LoanRate),
        CreditScore: this.userData.CreditScore,
        TransactionType: this.userData.TransactionType,
        PropertyType: this.userData.PropertyType,
        CityId: Number(this.userData.City),
        CountyId: Number(this.userData.County),
      }).then((re) => {
        if (re.data.code === 200) {
          if (this.$route.query.st == 1) {
            this.$apiPOST("/setting/home", {
              MyHomeId: re.data.d.Id,
            }).then(({ data }) => {
              if (data.code == 200) {
                this.$router.replace({
                  name: "MapMain",
                });
              }
            });
          } else {
            this.$router.go(-1);
          }
        } else {
          console.log("에러 ", re.code + " ");
        }
      });
    },
    reCertNumber() {
      if (this.progress_ === 2) {
        // this.VerifyKey = this.generateRandomCode();
        this.$apiGET("/myhome/reverify").then(() => {});
      }
    },

    btnGoToback(prg) {
      this.progress_ = prg;
      this.keySet();
    },
    getMask(phoneNumber) {
      if (!phoneNumber) return phoneNumber;
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

      let res = "";
      if (phoneNumber.length < 3) {
        res = phoneNumber;
      } else {
        if (phoneNumber.substr(0, 2) == "02") {
          if (phoneNumber.length <= 5) {
            //02-123-5678
            res = phoneNumber.substr(0, 2) + "-" + phoneNumber.substr(2, 3);
          } else if (phoneNumber.length > 5 && phoneNumber.length <= 9) {
            //02-123-5678
            res =
              phoneNumber.substr(0, 2) +
              "-" +
              phoneNumber.substr(2, 3) +
              "-" +
              phoneNumber.substr(5);
          } else if (phoneNumber.length > 9) {
            //02-1234-5678
            res =
              phoneNumber.substr(0, 2) +
              "-" +
              phoneNumber.substr(2, 4) +
              "-" +
              phoneNumber.substr(6);
          }
        } else {
          if (phoneNumber.length < 8) {
            res = phoneNumber;
          } else if (phoneNumber.length == 8) {
            res = phoneNumber.substr(0, 4) + "-" + phoneNumber.substr(4);
          } else if (phoneNumber.length == 9) {
            res =
              phoneNumber.substr(0, 3) +
              "-" +
              phoneNumber.substr(3, 3) +
              "-" +
              phoneNumber.substr(6);
          } else if (phoneNumber.length == 10) {
            res =
              phoneNumber.substr(0, 3) +
              "-" +
              phoneNumber.substr(3, 3) +
              "-" +
              phoneNumber.substr(6);
          } else if (phoneNumber.length > 10) {
            //010-1234-5678
            res =
              phoneNumber.substr(0, 3) +
              "-" +
              phoneNumber.substr(3, 4) +
              "-" +
              phoneNumber.substr(7);
          }
        }
      }

      return res;
    },
    btnExit() {
      this.$router.go(-1);
      // this.$emit("setState", false, this.userData, this.progress_);
    },
    format(value) {
      return `${parseInt(value)}%`;
    },
  },
};
</script>

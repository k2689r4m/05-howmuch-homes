<template>
  <div>
    <!-- loading 0108추가 -->
    <!-- <div class="loader-wrap">
      <div class="loader">Loading...</div>
    </div> -->
    <div class="wrap" v-show="!mBtnState">
      <!-- 약관 동의 진입 0108추가 -->
      <!-- <div class="agree-info">
        <div class="top">
          <img src="../../../public/images/icon/check_lg.svg" />
          앱 약관 동의
        </div>
        <div class="box">
          앱 서비스 이용을 위해<br />
          다음과 같은 권한이 필요합니다.
        </div>
        <ul class="list">
          <li class="list-item">
            <div class="icon-wrap">
              <img src="../../../public/images/icon/call2.svg" />
            </div>
            <div class="right">
              <strong>전화 권한</strong>
              <p>사용자 식별을 위한 기기 정보 획득</p>
            </div>
          </li>
          <li class="list-item">
            <div class="icon-wrap">
              <img src="../../../public/images/icon/write2.svg" />
            </div>
            <div class="right">
              <strong>콘텐츠 권한</strong>
              <p>콘텐츠 확인 및 작성</p>
            </div>
          </li>
        </ul>
        <div class="agree">
          약관 및 개인정보 취급 방침
          <button type="button" class="btn">전문 보기</button>
        </div>
      </div> -->
      <!-- 약관 동의 메인 0108추가 -->
      <!-- <div class="agree-main">
        <header class="header">
          <button type="button" class="btn btn-close right"></button>
          <h2 class="header-tit">약관 및 개인정보 취급 방침</h2>
        </header>
        <ul class="tab-menu">
          <li class="tab-menu--item active">약관 전문</li>
          <li class="tab-menu--item">개인정보취급 방침</li>
        </ul>
        <div class="agree-con">약관내용</div>
      </div> -->
      <header class="header">
        <button
          type="button"
          class="btn btn-question"
          @click="qBtnState = true"
        ></button>
        <button type="button" class="btn btn-search" @click="mBtnState = true">
          <img src="../../../public/images/icon/search.svg" alt="" />
          찾고 있는 지역이 있으신가요?
        </button>
        <!-- 
        <router-link
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
      <!-- popup 에 active 추가해서 display none/block (0102추가) -->
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
        <!-- 맵상단 가격정보 (0102추가) -->
        <div class="map-top">
          <div class="info">
            <div>
              <strong>{{
                $numberToKorean(Number(AvailableAmount) / 10000)
              }}</strong>
              <div>
                <span>자기자본</span>
                <button
                  type="button"
                  class="btn modi"
                  @click="btnPopup"
                ></button>
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
                    Math.ceil(
                      Number(AvailableAmount) / 10000 / (1 - loan * 0.01)
                    )
                  )
                }}
              </strong>
              <span>거래 가능 금액</span>
            </div>
          </div>
          <!-- <div class="price">
            <strong>{{ numberToKorean(AvailableAmount) }}</strong>
          </div> -->
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
              <button
                type="button"
                class="btn"
                :style="{ left: 'calc(' + loan + '% - 8px)' }"
              ></button>
              <div class="fill" :style="{ width: loan + '%' }">
                <span class="percent">{{ loan }}%</span>
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
          <!-- <router-link
            :to="{
              name: 'MyHomeMain',
            }"
            tag="span"
            class="check re"
          >
            <img src="../../../public/images/icon/re.svg" alt="" />
            재설정
          </router-link> -->
        </div>
        <div class="map-wrap" ref="mapWrap">
          <naver-maps
            v-if="mapState"
            :height="height"
            :width="width"
            :mapOptions="mapOptions"
            :initLayers="initLayers"
            @zoom_changed="zoomChanged"
            @load="onLoad"
            @dragstart="dragstart"
            @dragend="dragend"
            @idle="idle"
          >
            <template v-if="zoomLevel >= maxMarker">
              <template v-for="item in itemList">
                <naver-marker
                  v-if="item.AvailCount != 0 && option1"
                  v-bind:key="'m_1_' + item.Id"
                  :lat="item.Lat"
                  :lng="item.Lng"
                  @load="onMarkerLoaded($event, item)"
                >
                </naver-marker>
                <naver-marker
                  v-else-if="item.LoanCount != 0 && option2"
                  v-bind:key="'m_2_' + item.Id"
                  :lat="item.Lat"
                  :lng="item.Lng"
                  @load="onMarkerLoaded2($event, item)"
                >
                </naver-marker>
              </template>
            </template>
          </naver-maps>
        </div>
      </div>
      <button
        class="btn btn-list"
        @click="goMapList"
        v-bind:class="{ active: listSelect != null }"
      >
        <img src="../../../public/images/icon/home_menu.svg" alt="" />
        목록
      </button>
      <div class="con-bottom" @click="goDetail(listSelect)">
        <div class="status-top" v-show="listSelect == null">
          <p class="font-size--14 text-height--3 font-weight--3">
            <template v-if="itemList.length > 0">
              <strong>{{ address.Name }}</strong>
              <br />
              <span class="font-color--primary">
                거래가능매물 {{ availCount }}개
              </span>
              <span class="font-color--orange m-l--10">
                대출상향 시 거래가능매물 {{ loanCount }}개
              </span>
            </template>
            <template v-else>
              <!-- 매물없을때 -->
              <strong>
                매물이 없으신가요?<br />조건을 변경해서 검색하세요.
              </strong>
            </template>
          </p>

          <button
            v-if="itemList.length > 0"
            class="btn btn-list"
            @click="goMapList"
            v-bind:class="{ active: listSelect != null }"
          >
            <img src="../../../public/images/icon/home_menu.svg" alt="" />
            목록
          </button>
          <button
            v-else
            type="button"
            class="btn btn-md btn-gradient btn-up"
            @click="backReturn"
          >
            조건변경하기
          </button>
        </div>
        <!-- 매물정보(0102추가) -->
        <div class="sale-info" v-if="listSelect != null">
          <div class="img-wrap">
            <!-- <img src="../../../public/images/sample/a0.jpg" /> -->
            <img
              :src="
                require('../../../public/images/sample/a' +
                  String(listSelect.Id)[String(listSelect.Id).length - 1] +
                  '.jpg')
              "
            />
          </div>
          <div class="info">
            <strong class="tit">{{ listSelect.Name }}</strong>
            <div class="price-wrap">
              <div class="low">
                최저<span class="price">{{
                  $numberToKorean2(listSelect.MinPrice)
                }}</span>
              </div>
              <div class="high">
                최고<span class="price">{{
                  $numberToKorean2(listSelect.MaxPrice)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MapSearch
      v-show="mBtnState"
      @setState="btnMapSearch"
      @searchReturn="searchReturn"
    ></MapSearch>
  </div>
</template>

<script>
import QuestionBtn from "../QuestionBtn.vue";
import MapSearch from "./MapSearch.vue";
// import MapList from "./MapList.vue";
import Slider from "@vueform/slider/dist/slider.vue2.js";

export default {
  name: "MapMain",
  props: {},
  //   MapSearch, MapList
  components: {
    QuestionBtn,
    MapSearch,
    Slider,
  },
  data() {
    return {
      amount: false,
      amount2: false,
      AvailableAmount_: "",
      markers: [],
      dragState: false,
      listSelect: null,
      tooltip: false,
      maxMarker: 14,
      address: "",
      loan: 0,
      qBtnState: false,
      mBtnState: false,
      mapState: false,
      markerState: false,
      option1: true,
      option2: true,
      AvailableAmount: "",
      itemList: [],
      itemList_: [],
      zoomLevel: 14,
      width: 0,
      height: 0,
      // width: window.innerWidth,
      // height: window.innerHeight - 100,
      info: false,
      marker: null,
      count: 1,
      map: null,
      isCTT: false,
      mapOptions: {
        minZoom: 8,
        maxZoom: 19,
        lat: 37,
        lng: 127,
        zoom: 14,
        scaleControl: false,
        // scaleControlOptions: {
        //   position: "TOP_CENTER",
        // },
        mapDataControl: false,
        // mapDataControlOptions: {
        //   position: "TOP_CENTER",
        // },
        mapTypeControl: false,
        zoomControl: false,
        // zoomControlOptions: { position: "TOPRIGHT" },
        logoControl: true,
        logoControlOptions: { position: "TOP_RIGHT" },
      },
      initLayers: [
        "BACKGROUND",
        "BACKGROUND_DETAIL",
        "POI_KOREAN",
        "TRANSIT",
        "ENGLISH",
        "CHINESE",
        "JAPANESE",
      ],
      availCount: 0,
      loanCount: 0,
    };
  },
  created() {
    this.getUserData();

    window.listSelect = this.setListSelect;
    setTimeout(() => {
      console.log('Works!');
}, 1000);
   
  },
  updated() {
    // console.log(this.$refs);
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$refs.mapWrap.offsetHeight;
      this.width = this.$refs.mapWrap.offsetWidth;
      let st = false;
      if (this.$store.state.lat != null && this.$store.state.lng != null) {
        st = true;
      }
      this.getPoint(st);
    });
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
    btnModiCap() {
      this.AvailableAmount_ = this.AvailableAmount;
      this.amount2 = true;
    },
    btnSaveCap() {
      if (this.AvailableAmount_ != null) {
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
    setListSelect(item) {
      this.listSelect =
        this.itemList.filter((i) => {
          return i.Id == item;
        })[0] ?? null;
    },
    removeLogo() {
      var naverMap = document.getElementById("vue-naver-maps");
      var naverMapA = null;
      if (naverMap.getElementsByTagName("a").length > 0) {
        naverMapA = naverMap.getElementsByTagName("a")[0];
        naverMapA.parentElement.parentElement.remove();
      }
    },
    backReturn() {
      this.$store.state.reback = true;
      this.$router.push({
        name: "MyHomeMain",
        query: { state2: true },
      });
    },
    slideChange() {
      this.getItems();
      this.$store.state.LoanRate = this.loan;
    },
    goDetail(item) {
      if (item != null) {
        const id = item.Id;
        this.saveInfo();
        this.$router.push({
          name: "MapListDetail",
          query: { apartmentId: id, loan: this.loan * 0.01 },
        });
      }
    },
    getAddress(lng, lat) {
      this.$apiGET("/map/addr?coords=" + lng + "," + lat).then(({ data }) => {
        if (data.code === 200) {
          this.address = data.d;
          this.$store.state._address = this.address;
        }
      });
    },
    getUserData() {
      if (this.$store.state.lat != null) {
        this.mapOptions.lat = this.$store.state.lat;
        this.mapOptions.lng = this.$store.state.lng;
        this.AvailableAmount = this.$store.state.AvailableAmount;
        this.loan = this.$store.state.LoanRate;
      } else {
        this.$apiGET("/map/info").then(({ data }) => {
          if (data.code === 200) {
            console.log(data.d.AvailableAmount);
            this.$store.state.AvailableAmount = data.d.AvailableAmount;
            this.$store.state.LoanRate = data.d.LoanRate;
            this.$store.state.lat = data.d.dvsn.Lat;
            this.$store.state.lng = data.d.dvsn.Lng;

            this.mapOptions.lat = this.$store.state.lat;
            this.mapOptions.lng = this.$store.state.lng;
            this.AvailableAmount = this.$store.state.AvailableAmount;
            this.loan = this.$store.state.LoanRate;
          }
        });
      }
    },
    getPoint(st) {
      if (st == true) {
        this.mapOptions.lat = this.$store.state.lat;
        this.mapOptions.lng = this.$store.state.lng;
        this.mapState = true;
        // this.getAddress(this.mapOptions.lng, this.mapOptions.lat);
      } else {
        this.$apiGET("/map/region").then(({ data }) => {
          // console.log(data.d.city);
          // console.log(data.d.dvsn);
          this.mapOptions.lat = data.d.dvsn.Lat;
          this.mapOptions.lng = data.d.dvsn.Lng;
          this.mapState = true;
          // this.getAddress(this.mapOptions.lng, this.mapOptions.lat);
        });
      }
    },
    saveInfo() {
      this.$store.state.AvailableAmount = this.AvailableAmount;
      this.$store.state._itemList = this.itemList;
      this.$store.state.lat = this.map.map.center._lat;
      this.$store.state.lng = this.map.map.center._lng;
      this.$store.state._zoomLevel = this.zoomLevel;
      this.$store.state.availCount = this.availCount;
      this.$store.state.loanCount = this.loanCount;
      this.savePostion();
    },
    savePostion() {
      if (this.zoomLevel >= this.maxMarker) {
        const po = this.map.getBounds();
        this.$store.state.l = po._sw._lng;
        this.$store.state.r = po._ne._lng;
        this.$store.state.t = po._ne._lat;
        this.$store.state.b = po._sw._lat;
      }
    },
    goReview() {
      this.saveInfo();
      this.$router.push({
        name: "MapReview",
      });
    },
    goMapList() {
      this.saveInfo();
      this.$router.push({
        name: "MapList",
      });
    },
    searchReturn(re) {
      this.map.setCenter(re.Lat, re.Lng);
      this.zoomLevel = 14;
      this.map.setZoom(this.zoomLevel);
      this.getItems();

      // console.log(this.map.setCenter(re.Lat, re.Lng));
    },
    btnOption(type) {
      if (type === 1) {
        this.option1 = !this.option1;
      } else {
        this.option2 = !this.option2;
      }
    },
    getItems() {
      if (this.zoomLevel >= this.maxMarker) {
        this.itemList_ = this.itemList;
        this.markerState = false;
        const po = this.map.getBounds();
        const l = po._sw._lng;
        const r = po._ne._lng;
        const t = po._ne._lat;
        const b = po._sw._lat;
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
            this.markerState = true;
            this.savePostion();

            this.dragState = false;

            this.updateCount();
          }
        });
      }
      this.getAddress(this.map.map.center._lng, this.map.map.center._lat);
    },
    idle() {},
    dragstart() {
      this.dragState = true;
    },
    dragend() {
      this.listSelect = null;
      this.getItems();
      this.saveInfo();
    },
    zoomChanged(zoom) {
      this.listSelect = null;
      this.zoomLevel = zoom;
      this.getItems();
      this.saveInfo();
      // this.itemList = [];
      // this.itemList = [{ id: 1, lat: 37.565829, lng: 127.054617 }];
    },
    zoomController() {
      this.map.setZoom(this.zoomLevel);
    },
    onLoad(vue) {
      this.map = vue;

      this.map.setOptions({
        logoControlOptions: {
          position: 3,
        },
      });
      this.getItems();
    },
    onWindowLoad() {},
    onMarkerClicked() {
      this.info = !this.info;
    },
    onMarkerLoaded(vue, item) {
      vue.marker.setIcon({
        content: `<div  class="count sm"
        style="left: 20px; top: 20px"
        onClick="window.listSelect('${item.Id}')">${item.AvailCount}</div>`,
      });
      // this.markers.push(vue.marker);

      // this.markerUpdate(vue.marker, item);
    },
    onMarkerLoaded2(vue, item) {
      vue.marker.setIcon({
        content: `<div  class="count orange sm"
        style="left: 20px; top: 20px"
        onClick="window.listSelect('${item.Id}')">${item.LoanCount}</div>`,
      });

      // this.markerUpdate(vue.marker, item);
    },
    markerUpdate(marker, item) {
      marker.setIcon({
        content: `<div  class="count sm"
        style="left: 20px; top: 20px"
        onClick="window.listSelect('${item.Id}')">${item.AvailCount}</div>`,
      });
    },
    btnQuestion(st) {
      this.qBtnState = st;
    },
    btnMapSearch(st) {
      this.mBtnState = st;
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
      this.$emit("setState", false);
    },
    format(value) {
      return `${parseInt(value)}%`;
    },
    updateCount() {
      this.availCount = 0;
      this.loanCount = 0;

      for (let i = 0; i < this.itemList.length; i++) {
        if (this.itemList[i].LoanCount != 0) {
          this.loanCount += this.itemList[i].LoanCount;
        }
        if (this.itemList[i].AvailCount != 0) {
          this.availCount += this.itemList[i].AvailCount;
        }
      }
    },
  },
};
</script>
<style src="@vueform/slider/themes/default.css"></style>

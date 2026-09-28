import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    _itemList: [],
    lat: null,
    lng: null,
    AvailableAmount: "",
    LoanRate: 0,
    _address: "",
    _zoomLevel: 13,
    rId: null,
    reback: false,
    l: null,
    r: null,
    t: null,
    b: null,
    availCount: 0,
    loanCount: 0,
  },
  mutations: {
    init() {
      this.state._itemList = [];
      this.state.lat = null;
      this.state.lng = null;
      this.state.AvailableAmount = "";
      this.state.LoanRate = 0;
      this.state._address = "";
      this.state._zoomLevel = 13;
      this.state.rId = null;
      this.state.l = null;
      this.state.r = null;
      this.state.t = null;
      this.state.b = null;
      this.state.availCount = 0;
      this.state.loanCount = 0;
    },
  },
});

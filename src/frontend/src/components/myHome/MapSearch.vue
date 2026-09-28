<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="setState"></button>
      <input
        v-model="search"
        @input="searchChange"
        type="text"
        class="input"
        placeholder="검색어를 입력하세요."
        @keyup.enter="btnSearch"
      />
      <button type="button" class="btn search" @click="btnSearch"></button>
    </header>
    <div class="content p-t--0">
      <div class="box-line"></div>
      <ul v-if="searchState" class="search-list">
        <li
          v-for="item in searchItems"
          class="search-list--item"
          :key="'s_' + item.Id"
          @click="saveHistory(item)"
        >
          {{ item.CityName }} {{ item.DvsnName }} {{ item.SecName }}
        </li>
      </ul>
      <ul v-else class="search-list">
        <li
          v-for="(item, idx) in historyItems"
          class="search-list--item"
          :key="'h_' + item.RegionId"
          @click="goMap(item)"
        >
          {{ item.CityName }} {{ item.DvsnName }} {{ item.SecName }}
          <button
            type="button"
            class="btn btn-delete"
            @click="btnHistoryDelete(item, idx)"
          >
            <img src="../../../public/images/icon/close.svg" alt="" />
          </button>
        </li>
      </ul>
    </div>
    <button type="button" class="btn btn-map" @click="setState">
      <img src="../../../public/images/icon/map.svg" alt="" />
      지도
    </button>
  </div>
</template>

<script>
export default {
  name: "MapSearch",
  props: {},
  components: {},
  data() {
    return {
      search: "",
      searchState: false,
      historyItems: [],
      searchItems: [],
    };
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    goMap(item) {
      this.$emit("searchReturn", item);
      this.setState();
    },
    searchChange(e) {
      if (e.target.value == "") {
        this.searchState = false;
      }
    },
    btnHistoryDelete(item, idx) {
      this.$apiPOST("/delete/history", {
        RegionId: item.RegionId,
      }).then(({ data }) => {
        if (data.code === 200) {
          this.historyItems.splice(idx, 1);
        }
      });
    },
    getHistory() {
      this.$apiGET("/search/history").then(({ data }) => {
        if (data.code === 200) {
          this.historyItems = data.d;
        }
      });
    },
    btnSearch() {
      this.$apiGET("/search/region?name=" + this.search).then(({ data }) => {
        if (data.code === 200) {
          this.searchItems = data.d;
          this.searchState = true;
        }
      });
    },
    saveHistory(item) {
      this.$apiPOST("/search/history", {
        RegionId: item.Id,
        CityName: item.CityName,
        DvsnName: item.DvsnName,
        SecName: item.SecName,
      }).then(({ data }) => {
        if (data.code == 200) {
          this.getHistory();
          this.goMap(item);
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
      this.$emit("setState", false);
    },
  },
};
</script>

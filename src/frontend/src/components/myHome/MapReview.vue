<template>
  <div class="wrap">
    <template v-if="reviewCreate">
      <CreateRevew @setReviewState="setReviewState"></CreateRevew>
    </template>
    <template v-else>
      <div class="con-bottom top p-b--0">
        <div class="status-top">
          <button type="button" class="btn btn-close" @click="goBack"></button>
          <h2 class="header-tit">
            [{{ $store.state._address.Name }}] 내 집 마련 후기
          </h2>
        </div>
        <div class="review-top">
          <button
            type="button"
            class="btn btn-write"
            @click="reviewCreate = true"
          >
            <img src="../../../public/images/icon/write.svg" alt="" />
            후기작성
          </button>
          <select class="select" @change="refreshItems">
            <option value="1">최근순</option>
            <option value="2">좋아요순</option>
          </select>
        </div>
      </div>
      <div class="content bg top-exist">
        <ul class="review-list">
          <li
            v-for="item in items"
            v-bind:key="item.id"
            class="review-list--item"
          >
            <ListItem v-bind:item="item" @reItem="getReviewItem"></ListItem>
          </li>
          <infinite-loading
            @infinite="infiniteHandler"
            force-use-infinite-wrapper="true"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import CreateRevew from "../reviewView/CreateRevew.vue";
import InfiniteLoading from "vue-infinite-loading";
import ListItem from "../reviewView/ListItem.vue";

export default {
  name: "MapReview",
  props: {},
  components: { CreateRevew, InfiniteLoading, ListItem },
  data() {
    return { reviewCreate: false, page: 1, items: [], sortType: 1 };
  },
  mounted() {
    console.log(this.$store.state._address.Name);
  },
  methods: {
    refreshItems(e) {
      this.sortType = e.target.value;
      this.page = 1;
      this.items = [];
      this.getReviewItem(1);
    },
    getReviewItem(page) {
      this.$apiGET(
        "/map/reviews?page=" +
          page +
          "&method=" +
          this.sortType +
          "&code=" +
          this.$store.state._address.Code
      ).then(({ data }) => {
        if (data.code === 200) {
          this.items = data.d;
        }
      });
    },
    infiniteHandler($state) {
      this.$apiGET(
        "/map/reviews?page=" +
          this.page +
          "&method=" +
          this.sortType +
          "&code=" +
          this.$store.state._address.Code
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
    setReviewState(st) {
      this.reviewCreate = st;
      this.page = 1;
      this.items = [];
      this.getReviewItem(1);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

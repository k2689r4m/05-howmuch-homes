<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">1:1 문의</h2>
      <div class="right">
        <router-link
          :to="{ name: 'CreateInquiry' }"
          tag="button"
          class="btn inline btn-inquiry"
        >
          <img src="../../../public/images/icon/write.svg" />
          문의하기
        </router-link>
      </div>
    </header>
    <div class="content p-t--0">
      <ul class="text-list accordion border m-t--0">
        <li
          class="text-list--item"
          v-for="item in items"
          v-bind:key="'qna_' + item.Id"
          @click="goDetail(item.Id)"
        >
          <button
            type="button"
            class="btn btn-tit"
            v-bind:class="{ active: item.isFlag, com: item.IsAnswered == 1 }"
            @click="item.isFlag = !item.isFlag"
          >
            <strong class="tit">{{ item.Title }}</strong>
            <div>
              <span class="date">
                {{ $date(item.CreatedAt).format("YYYY") }}년
                {{ $date(item.CreatedAt).format("MM") }}월
                {{ $date(item.CreatedAt).format("DD") }}일
              </span>

              <span v-if="item.IsAnswered == 1" class="state">답변완료</span>
              <span v-else class="state">답변대기</span>
            </div>
          </button>
          <div
            v-if="item.Content != null"
            v-html="item.Content.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            class="con"
          ></div>
        </li>
        <infinite-loading
          @infinite="infiniteHandler"
          force-use-infinite-wrapper="true"
        >
          <div slot="no-more"></div>
          <span slot="no-results"></span>
        </infinite-loading>
      </ul>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
export default {
  name: "Inquiry",
  props: {},
  components: { InfiniteLoading },
  data() {
    return {
      page: 1,
      items: [],
    };
  },
  methods: {
    toggleActive(idx) {
      this.btnList[idx] = !this.btnList[idx];
      this.btnList.push(false);
      this.btnList.pop();
    },
    infiniteHandler($state) {
      console.log("itemcount:" + this.itemCount);
      console.log("page:" + this.page * 10);
      this.$apiGET("/qnas?page=" + this.page).then(({ data }) => {
        if (data.code === 200) {
          if (data.d.length) {
            this.page++;
            for (let i = 0; i < data.d.length; i++) {
              data.d[0].isFlag = false;
            }
            this.items.push(...data.d);
            $state.loaded();
          } else {
            $state.complete();
          }

          // if (this.itemCount < this.page * 10) {
          //   console.log("true");
          //   $state.loaded();
          // } else {
          //   console.log("false");
          //   $state.complete();
          // }
        } else {
          $state.complete();
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    goDetail(id) {
      this.$router.push({
        name: "InquiryDetail",
        query: { id: id },
      });
    },
  },
};
</script>

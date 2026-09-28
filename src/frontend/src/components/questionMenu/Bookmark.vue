<template>
  <div class="wrap">
    <header class="header">
      <button type="button" class="btn btn-back" @click="goBack"></button>
      <h2 class="header-tit">즐겨찾기</h2>
    </header>
    <div class="content">
      <ul class="bookmark-list">
        <li
          v-for="(item, idx) in itemList"
          class="bookmark-list--item"
          :key="'book_' + item.Id"
          @click="goDetail(item.Id, item.IsFavorite)"
        >
          <div class="left">
            <strong class="tit">{{ item.Name }}</strong>
            <span class="price"
              >{{ item.PriceType }} {{ $numberToKorean2(item.MaxPrice) }}</span
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
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bookmark",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return { itemList: [] };
  },
  created() {
    this.$apiGET("/favorite").then(({ data }) => {
      if (data.code === 200) {
        this.itemList = data.d;
      }
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
  },
};
</script>

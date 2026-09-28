<template>
  <div class="wrap">
    <header class="header">
      <!-- <router-link
        :to="{ name: 'ReviewMain' }"
        tag="button"
        class="btn btn-back"
      >
      </router-link> -->
      <button class="btn btn-back" @click="btnBack"></button>
      <h2 class="header-tit">후기작성</h2>
    </header>
    <div class="content">
      <div class="form-wrap">
        <label class="label">물건지 검색</label>
        <input
          type="text"
          class="input-text search"
          v-model="reviewItem.ApartmentName"
          @change="reviewItem.ApartmentId = null"
          placeholder="물건지를 검색해보세요."
        />
        <button
          type="button"
          class="btn btn-search"
          @click="btnSearchApartment"
          @click.stop
        >
          <img src="../../../public/images/icon/search.svg" />
        </button>
        <ul
          class="text-list"
          v-if="apartmentSelect && apartmentList.length"
          v-click-outside="onClickOutside"
        >
          <!-- <li
            class="text-list--item"
            v-for="item in reList"
            v-bind:key="item.Id + 'ap'"
            @click="btnApartment(item.Id, item.Name)"
          >
            {{ item.Name }}
          </li> -->
          <template v-if="s1 == '' && s2 == '' && s3 == ''">
            <li
              class="text-list--item"
              v-for="(value, name, idx) in reList"
              v-bind:key="name + 'ap1' + idx"
              @click="s1 = name"
            >
              {{ name }}
            </li>
          </template>
          <template v-else-if="s1 != '' && s2 == '' && s3 == ''">
            <li
              class="text-list--item"
              v-for="(value, name, idx) in reList[s1]"
              v-bind:key="name + 'ap2' + idx"
              @click="s2 = name"
            >
              {{ name }}
            </li>
          </template>
          <template v-else-if="s1 != '' && s2 != '' && s3 == ''">
            <li
              class="text-list--item"
              v-for="(value, name, idx) in reList[s1][s2]"
              v-bind:key="name + 'ap3' + idx"
              @click="s3 = name"
            >
              {{ name }}
            </li>
          </template>
          <template v-else-if="s1 != '' && s2 != '' && s3 != ''">
            <li
              class="text-list--item"
              v-for="(item, idx) in reList[s1][s2][s3]"
              v-bind:key="item + 'ap3' + idx"
              @click="btnApartment(item.Id, item.Name)"
            >
              {{ item.Name }}
            </li>
          </template>
        </ul>
        <ul
          class="text-list"
          v-else-if="apartmentSelect && !apartmentList.length"
          v-click-outside="onClickOutside"
        >
          <li class="text-list--item" v-bind:key="'none ap'">검색 결과 없음</li>
        </ul>
      </div>
      <div class="form-wrap">
        <label class="label">자기자본을 선택해주세요.</label>
        <div class="check-list">
          <label class="check-wrap">
            <input
              type="radio"
              id="capital"
              value="2억 이하"
              v-model="reviewItem.OwnAmount"
            />
            <span class="text">2억 이하</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="capital"
              value="2억-4억"
              v-model="reviewItem.OwnAmount"
            />
            <span class="text">2억-4억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="capital"
              value="4억-6억"
              v-model="reviewItem.OwnAmount"
            />
            <span class="text">4억-6억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="capital"
              value="6억-8억"
              v-model="reviewItem.OwnAmount"
            />
            <span class="text">6억-8억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="capital"
              value="8억-10억"
              v-model="reviewItem.OwnAmount"
            />
            <span class="text">8억-10억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="capital"
              value="10억 이상"
              v-model="reviewItem.OwnAmount"
            />
            <span class="text">10억 이상</span>
          </label>
        </div>
      </div>
      <div class="form-wrap">
        <label class="label">거래금액을 선택해주세요.</label>
        <div class="check-list">
          <label class="check-wrap">
            <input
              type="radio"
              name="trade"
              value="2억 이하"
              v-model="reviewItem.TransactionAmount"
            />
            <span class="text">2억 이하</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="trade"
              value="2억-4억"
              v-model="reviewItem.TransactionAmount"
            />
            <span class="text">2억-4억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="trade"
              value="4억-6억"
              v-model="reviewItem.TransactionAmount"
            />
            <span class="text">4억-6억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="trade"
              value="6억-8억"
              v-model="reviewItem.TransactionAmount"
            />
            <span class="text">6억-8억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="trade"
              value="8억-10억"
              v-model="reviewItem.TransactionAmount"
            />
            <span class="text">8억-10억</span>
          </label>
          <label class="check-wrap">
            <input
              type="radio"
              name="trade"
              value="10억 이상"
              v-model="reviewItem.TransactionAmount"
            />
            <span class="text">10억 이상</span>
          </label>
        </div>
      </div>
      <div class="form-wrap">
        <label class="label">후기</label>
        <textarea
          placeholder="후기를 작성해주세요."
          rows="10"
          class="textarea"
          v-model="reviewItem.Content"
        ></textarea>
      </div>
      <!-- <router-link
        :to="{ name: 'ReviewMain' }"
        tag="button"
        class="btn btn-full btn-gradient"
      >
        등록
      </router-link> -->
      <button
        class="btn btn-full btn-gradient"
        @click="btnSend"
        :disabled="
          !(
            reviewItem.ApartmentId &&
            reviewItem.OwnAmount.length &&
            reviewItem.TransactionAmount.length &&
            reviewItem.Content.length
          )
        "
      >
        등록
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateReview",
  created() {
    // console.log(this.$props.name);
    // console.log(this.$props.age);
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      apartmentList: [],
      apartmentSelect: false,
      reviewItem: {
        id: 1, //아이디   int not null
        UserId: 1, //유저 아이디    int not nul
        ApartmentId: null, //매물 아이디   int not null
        OwnAmount: "", //자신 자금 varchar(15) not null
        TransactionAmount: "", //거래 금액 varchar(15) not null
        Content: "", // varchar(1024) not null
        UserNickname: "선우가짱",
        ApartmentName: "",
      },
      reList: {},
      s1: "",
      s2: "",
      s3: "",
    };
  },

  methods: {
    onClickOutside() {
      this.apartmentSelect = false;
      this.s1 = "";
      this.s2 = "";
      this.s3 = "";
    },
    btnApartment(aptId, aptName) {
      this.apartmentSelect = false;
      this.s1 = "";
      this.s2 = "";
      this.s3 = "";
      this.reviewItem.ApartmentId = aptId;
      this.reviewItem.ApartmentName = aptName;
    },
    btnSearchApartment() {
      this.reviewItem.ApartmentId = null;
      if (this.reviewItem.ApartmentName.length) {
        this.$axios
          .get(
            this.$apiHost + "/search/apt?name=" + this.reviewItem.ApartmentName
          )
          .then(({ data }) => {
            if (data.d.length) {
              this.apartmentList = data.d;
              this.apartmentSelect = true;
              const d1 = this.groupBy(this.apartmentList, "CityName");
              for (var key in d1) {
                this.reList[key] = {};
                var d2 = this.groupBy(d1[key], "DvsnName");
                for (var key2 in d2) {
                  this.reList[key][key2] = {};
                  var d3 = this.groupBy(d2[key2], "SecName");
                  for (var key3 in d3) {
                    this.reList[key][key2][key3] = [...d3[key3]];
                  }
                }
              }
              // console.log(this.reList);
              // this.reList.push("1");
              // this.reList.pop();
            }
          });
      }
    },
    btnBack() {
      this.$emit("setReviewState", false);
    },
    btnSend() {
      console.log({
        UserId: this.reviewItem.UserId,
        ApartmentId: this.reviewItem.ApartmentId,
        OwnAmount: this.reviewItem.OwnAmount,
        TransactionAmount: this.reviewItem.TransactionAmount,
        Content: this.reviewItem.Content,
      });

      this.$apiPOST("/review", {
        UserId: this.reviewItem.UserId,
        ApartmentId: this.reviewItem.ApartmentId,
        OwnAmount: this.reviewItem.OwnAmount,
        TransactionAmount: this.reviewItem.TransactionAmount,
        Content: this.reviewItem.Content,
      }).then((re) => {
        if (re.data.code === 200) {
          // this.$router.push({
          //   name: "ReviewMain",
          // });
          this.btnBack();
        } else {
          console.log("에러 ", re.code + " ");
        }
      });
    },
    groupBy(data, key) {
      return data.reduce(function (carry, el) {
        var group = el[key];

        if (carry[group] === undefined) {
          carry[group] = [];
        }

        carry[group].push(el);
        return carry;
      }, {});
    },
  },
};
</script>

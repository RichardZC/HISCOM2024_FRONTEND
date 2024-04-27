<template lang="pug">
v-card.card-base.py-2.px-6(
  ref="vCard",
  :class="{ 'mx-4': !isResponsive, 'card-base__small': !renderIcon }"
)
  .card-decoration.primary(v-if="renderIcon")
    .card-decoration--icon
      v-icon(color="white", size="36") {{ icon }}

  div(v-if="isSmall")
    .card-header(:class="{ 'card-header__small': !renderIcon }")
      slot(name="header-title", :isSmall="isSmall")
        .card-header--title {{ title }}
      slot(name="header-end", :isSmall="isSmall")
        div
    .mb-4
      slot(name="header-center", :isSmall="isSmall")
  .card-header(v-else)
    slot(name="header-title", :isSmall="isSmall")
      .card-header--title {{ title }}
    slot(name="header-center", :isSmall="isSmall")
      div
    slot(name="header-end", :isSmall="isSmall")
      div
  slot
</template>

<script>
import { VCard } from "vuetify/lib";

export default {
  name: "Card",
  extends: VCard,
  props: {
    title: {
      type: String,
      default: "Card Title",
    },
    icon: {
      type: String,
      default: "mdi-clipboard-text",
    },
    noTitle: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return { innerWidth: 0 };
  },

  computed: {
    isSmall() {
      return this.innerWidth < 700;
    },
    renderIcon() {
      return this.innerWidth > 500;
    },
    isResponsive() {
      return this.$vuetify.breakpoint.name === "xs";
    },
  },

  mounted() {
    this.innerWidth = this.$refs.vCard.$el.offsetWidth;
    window.addEventListener(
      "resize",
      () => {
        this.innerWidth = this.$refs.vCard?.$el.offsetWidth ?? 0;
      },
      true,
    );
  },
};
</script>

<style>
.card-base {
  position: relative;
  margin-top: 40px;
}
.card-base__small {
  margin-top: 0;
}
.card-base__small + .card-base__small {
  margin-top: 20px;
}

.card-base:not(.card-base__small) + .card-base:not(.card-base__small) {
  margin-top: 50px;
}
.card-header__small {
  padding-left: 0 !important;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  margin-bottom: 16px;
  padding-left: 106px;
}
.card-header--title {
  font-size: 1.25rem;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 16px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.card-decoration {
  position: absolute;
  height: 90px;
  width: 90px;
  border-radius: 4px;
  z-index: 69;
  top: -30px;
}
.card-decoration--icon {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -18px 0 0 -18px;
  height: 36px;
  width: 36px;
}
</style>

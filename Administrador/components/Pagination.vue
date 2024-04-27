<template lang="pug">
card(:title="title")
  template(v-if="!noSearch", v-slot:header-center="{ isSmall }")
    v-text-field(
      v-model="search",
      :class="{ 'mx-6': !isSmall }",
      :disabled="loading",
      @click:append="_search",
      @click:clear="search = ''; _search()",
      @keyup.enter="_search",
      append-icon="mdi-magnify",
      clearable,
      dense,
      hide-details,
      label="Búsqueda",
      outlined,
      single-line
    )
  template(v-slot:header-end="{ isSmall }")
    .card-actions(v-if="!noAction")
      v-btn(
        v-if="!isSmall",
        :to="`${modelRoute}/new`",
        color="primary",
        nuxt,
        outlined
      ) 
        v-icon(left) mdi-plus
        | Crear
      v-tooltip(v-else, top)
        template(v-slot:activator="{ on, attrs }")
          v-btn(
            v-bind="attrs",
            v-on="on",
            :to="`${modelRoute}/new`",
            color="primary",
            icon,
            nuxt
          ) 
            v-icon mdi-plus
        span Crear
    .card-actions(v-if="$scopedSlots['header-end']")
      slot(:pagination="pagination", name="header-end")
  v-data-table(
    ref="dataTable",
    v-bind="$attrs",
    :footer-props=`{ 
      itemsPerPageOptions: [8,15,30], 
      pagination: {
        itemsLength:pagination.totalItems, 
        page:pagination.currentPage, 
        itemsPerPage:pagination.itemsPerPage, 
        pageCount:pagination.totalPages, 
        pageStart: (pagination.currentPage-1)*pagination.itemsPerPage, 
        pageStop:(pagination.currentPage-1)*pagination.itemsPerPage+pagination.items.length,
      },
      options: {
        itemsPerPage:pagination.itemsPerPage,
        page: pagination.currentPage
      }
    }`,
    :headers="headers",
    :items="pagination.items",
    :items-per-page="pagination.itemsPerPage",
    :loading="loading",
    :page="pagination.currentPage",
    :server-items-length="pagination.totalItems",
    @update:options="_getPage"
  )
    template(v-for="(_, name) in $scopedSlots", v-slot:[name]="slotData")
      slot(v-bind="slotData", :name="name")
    template(v-slot:item.actions="args")
      slot(v-bind="args", name="actions")
        v-icon.mr-2(@click="_editItem(args.item)", small) mdi-pencil
        v-icon(small) mdi-delete
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";
import { defaultPagination, Pagination } from "~/types";

const PaginationOptions = Vue.extend({
  name: "Pagination",
  props: {
    title: {
      type: String,
      default: "Paginación",
    },
    after: {
      type: Function,
      default: undefined,
    },
    headers: {
      type: Array,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    nullables: {
      type: Array,
      default: () => [],
    },
    noAction: {
      type: Boolean,
      default: false,
    },
    noSearch: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
});

@Component
export default class PaginationComponent extends PaginationOptions {
  loading = true;
  pagination: Pagination<any> = defaultPagination();
  search = "";

  page: number = 1;
  itemsPerPage: number = 5;

  @Watch("model")
  onModelChange() {
    this._getPage({ page: 1 });
  }

  get modelRoute() {
    const slices = this.$props.model.split("/");
    if (slices.length === 1) {
      return slices[0];
    } else {
      return slices[slices.length - 1];
    }
  }

  async _getPage(options?: any) {
    this.loading = true;

    if (options.page) {
      this.page = options.page;
    }
    if (options.itemsPerPage) {
      this.itemsPerPage = options.itemsPerPage;
    }

    await this.$axios.buildResponse({
      request: {
        url: `/api/${this.model}`,
        params: {
          page: this.page,
          itemsPerPage: this.itemsPerPage,
          search: this.search ? this.search : "",
          ...this.$props.params,
        },
      },
      ifOk: ({ payload }) => {
        if (this.after) {
          payload.items.forEach(this.after);
        }
        this.pagination = payload;
      },
    });

    this.loading = false;
  }

  async _search() {
    this.loading = true;
    const { data }: any = await this.$axios.get(`/api/${this.model}`, {
      params: {
        itemsPerPage: this.itemsPerPage,
        search: this.search ?? "",
        ...this.$props.params,
      },
    });
    if (this.after) {
      data.items.forEach(this.after);
    }
    this.pagination = data;
    this.loading = false;
  }

  _editItem(item: any) {
    this.$router.push(`/${this.modelRoute}/edit/${item.id}`);
  }
}
</script>
<style>
.card-actions + .card-actions {
  margin-left: 12px;
}
</style>

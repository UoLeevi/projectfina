<template>
  <v-card v-resize="responsive && resize">
    <v-card-title primary-title>
      <slot name="title"></slot>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
        spellcheck="false"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :search="search"
      :headers="columns
        .filter(column => column.show)
        .concat([actionColumn])
        .map(column => column.header)"
      :items="items"
      :loading="loading"
      :expand="expand"
      :pagination.sync="pagination || defaults.pagination"
      :no-data-text="noDataText"
      :item-key="itemKey"
      class="elevation-1"
    >
      <template #headers="props">
        <tr>
          <component
            v-for="(header, index) in columns
              .filter(column => column.show)
              .concat([actionColumn])
              .map(column => column.header)"
            :key="header.text"
            :is="header.component && header.component.name || 'UDataTableHeaderDefault'"
            :header="header"
            :class="[
              Array.isArray(header.class) ? header.class.join(' ') : header.class || '',
              (pagination || defaults.pagination).descending ? 'desc' : 'asc', 
              (pagination || defaults.pagination).sortBy === header.value ? 'active' : ''
            ]"
            @click.native="header.sortable && changeSort(header.value)"
            v-bind="(header.component 
              ? typeof header.component.props === 'function' 
                ? header.component.props() 
                : header.component.props
              : null)">
            {{ header.text }} <v-btn v-if="!header.fixed" flat fab small dark @click="removeColumn(index)"><v-icon>close</v-icon></v-btn>
          </component>
        </tr>
      </template>
      <template #items="props">
        <tr>
          <component
            v-for="column in columns.filter(column => column.show)"
            :key="column.header.text"
            :is="column.field.component && column.field.component.name || 'UDataTableFieldDefault'"
            :field="column.field"
            :class="typeof column.field.class === 'function' ? column.field.class(props.item[column.header.value]) : column.field.class || ''" 
            @click.native="props.expanded = !props.expanded"
            v-bind="(column.field.component 
              ? typeof column.field.component.props === 'function' 
                ? column.field.component.props() 
                : column.field.component.props
              : null)">
            {{ column.field.format ? column.field.format(props.item[column.header.value]) : props.item[column.header.value] }}
          </component>
          <slot name="action" v-bind="props">
            <td scope="row" :class="[`text-xs-${actionColumn.field.align}`]"></td>
          </slot>
        </tr>
      </template>
      <template #expand="props">
        <slot name="expand" v-bind="props"/>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import UDataTableHeaderDefault from '@/components/UDataTableHeaderDefault';
import UDataTableHeaderMenu from '@/components/UDataTableHeaderMenu';
import UDataTableFieldDefault from '@/components/UDataTableFieldDefault';

export default {
  name: 'u-data-table',
  components: {
    UDataTableHeaderDefault,
    UDataTableFieldDefault,
    UDataTableHeaderMenu,
    UDataTableFieldFunction: {
      render(createElement) {
        return createElement(
          'td'
        )
      },
      props: {
        header: {
          text: String,
          align: String,
          sortable: Boolean,
          value: String,
          width: String
        },
        item: Object
      }
    }
  },
  props: {
    columns: Array,
    items: Array,
    itemKey: String,
    loading: Boolean,
    expand: Boolean,
    noDataText: String,
    pagination: {
      type: Object,
      default() {
        return {
          descending: false,
          page: 1,
          rowsPerPage: -1, // -1 for All
          sortBy: this.itemKey,
          totalItems: this.items ? this.items.length : 0
        };
      }
    }
  },
  methods: {
    showColumn(index) {
      const [column] = this.otherColumns.splice(index, 1);
      this.columns.splice(this.columns.length, 0, column);
      this.responsiveColumns = false;
    },
    hideColumn(index) {
      const [column] = this.columns.splice(index, 1);
      this.otherColumns.splice(this.otherColumns.length, 0, column);
      this.responsiveColumns = false;
    },
    changeSort(value) {
      const pagination = this.pagination || this.defaults.pagination;
      if (pagination.sortBy === value) {
        pagination.descending = !pagination.descending
      } else {
        pagination.sortBy = value
        pagination.descending = false
      }
    },
    resize() {
      this.columns
        .filter(column => 'media' in column)
        .forEach(column => column.show = this.$vuetify.breakpoint[column.media] === true);
    }
  },
  data() {
    return {
      search: '',
      actionColumn: {
        header: {
          text: 'Actions',
          align: 'right',
          sortable: false,
          value: this.itemKey,
          fixed: true,
          component: {
            name: 'UDataTableHeaderMenu',
            props: () => ({
              items: this.columns
                .filter(column => !column.show)
                .map(column => column.header.text),
              selectCb: this.addColumn
            })
          }
        },
        field: {
          align: 'right',
          component: {
            name: 'UDataTableFieldFunction'
          }
        }
      },
      responsive: true
    };
  }
}
</script>

<style>

</style>

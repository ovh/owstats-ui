<template>
  <div class="datetimepicker">
    <b-alert
      v-model="visible"
      class="position-fixed fixed-top m-0 rounded-0"
      style="z-index: 2000;"
      variant="success"
    >
      {{ $t('calendar.warningRobots') }}
    </b-alert>
    <div class="oui-field__header">
      <label class="oui-field__label">{{ `${$t('calendar.selectPeriod')} (${$t('calendar.timezone')} ${timezone})` }}</label>
    </div>
    <div
      class="text-nowrap"
    >
      <div class="components-container flex flex-wrap">
        <div class="component">
          <CtkDateTimePicker
            :id="picker.options.id"
            v-model="picker.value"
            :only-date="picker.options.onlyDate"
            :only-time="picker.options.onlyTime"
            :range="picker.options.range"
            :format="picker.options.format"
            :formatted="picker.options.formatted"
            :output-format="picker.options.outputFormat"
            :inline="picker.options.inline"
            :color="picker.options.color"
            :button-color="picker.options.buttonColor"
            :no-header="picker.options.noHeader"
            :label="picker.options.label"
            :no-label="picker.options.noLabel"
            :auto-close="picker.options.autoClose"
            :error="picker.options.error"
            :hint="picker.options.hint"
            :open="picker.options.open"
            :dark="picker.options.dark"
            :overlay="picker.options.overlay"
            :position="picker.options.position"
            :disabled="picker.options.disabled"
            :disabled-dates="picker.options.disabledDates"
            :disabled-hours="picker.options.disabledHours"
            :enabled-dates="picker.options.enabledDates"
            :minute-interval="picker.options.minuteInterval"
            :first-day-of-week="picker.options.firstDayOfWeek"
            :min-date="picker.options.minDate"
            :max-date="picker.options.maxDate"
            :no-weekends-days="picker.options.noWeekendDays"
            :no-shortcuts="picker.options.noShortcuts"
            :no-button="picker.options.noButton"
            :button-now-translation="picker.options.buttonNowTranslation"
            :no-button-now="picker.options.noButtonNow"
            :locale="picker.options.locale"
            :input-size="picker.options.inputSize"
            :custom-shortcuts="picker.options.customShortcuts"
            :persistent="picker.options.persistent"
            :no-keyboard="picker.options.noKeyboard"
            :no-value-to-custom-elem="picker.options.noValueToCustomElem"
            :disabled-weekly="picker.options.disabledWeekly"
            :right="picker.options.right"
            :no-clear-button="picker.options.noClearButton"
            @validate="updateDate"
            @input="displayWarning"
            @is-hidden="onHide"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  name: 'Datetimepicker',
  components: {
    CtkDateTimePicker
  },
  data () {
    return {
      picker: {
        id: '1',
        initial: {
          start: '2018-04-05',
          end: '2018-04-20'
        },
        value: {
          start: this.$store.state.app.startDate,
          end: this.$store.state.app.endDate
        },
        options: {
          slot: {
            type: 'button'
          },
          range: true,
          formatted: 'll',
          format: 'YYYY-MM-DD',
          label: this.$t('calendar.selectPeriod'),
          id: 'RangeDatePicker',
          customShortcuts: [
            { key: 'thisWeek', label: this.$t('calendar.thisWeek'), value: 'isoWeek' },
            { key: 'lastWeek', label: this.$t('calendar.lastWeek'), value: '-isoWeek' },
            { key: 'last7Days', label: this.$t('calendar.last7Days'), value: 7 },
            { key: 'last30Days', label: this.$t('calendar.last30Days'), value: 30 },
            { key: 'thisMonth', label: this.$t('calendar.thisMonth'), value: 'month' },
            { key: 'lastMonth', label: this.$t('calendar.lastMonth'), value: '-month' },
            { key: 'thisYear', label: this.$t('calendar.thisYear'), value: 'year' },
            { key: 'lastYear', label: this.$t('calendar.lastYear'), value: '-year' }
          ],
          noClearButton: true
        }
      },
      robotsSeparationDate: '2022-04-01',
      timezone: this.$store.state.app.timezone
    }
  },
  computed: {
    queryUpdated () {
      return this.$route.query
    },
    visible () {
      return this.$store.state.app.displayWarning
    }
  },
  watch: {
    queryUpdated () {
      this.syncDate(false)
    }
  },
  methods: {
    displayWarning () {
      if (this.$data.picker.value.start < this.robotsSeparationDate && this.$store.state.app.startDate !== this.$data.picker.value.start) {
        this.$store.commit('setDisplayWarning', true)
      } else {
        this.$store.commit('setDisplayWarning', false)
      }
    },
    onHide () {
      this.$store.commit('setDisplayWarning', false)
    },
    updateDate () {
      if (this.$store.state.app.startDate !== this.$data.picker.value.start ||
          this.$store.state.app.endDate !== this.$data.picker.value.end) {
        this.$store.commit('setStartDate', this.$data.picker.value.start)
        this.$store.commit('setEndDate', this.$data.picker.value.end)
        this.$store.commit('toggleDateChanged')
      }
    },
    syncDate (booting) {
      const start = this.$route.query.start_date
      let end = this.$route.query.end_date
      if (!end) {
        end = start
      }

      const curStart = this.$store.state.app.startDate
      let curEnd = this.$store.state.app.endDate
      if (!curEnd) {
        curEnd = this.$store.state.app.startDate
      }

      let updated = false

      if ((start !== curStart) || (end !== curEnd)) {
        updated = true
      }

      if ((start && updated) || booting) {
        this.$store.commit('setStartDate', start)
        this.$store.commit('setEndDate', end)
        this.$data.picker.value = {
          start: start,
          end: end
        }
        if (!booting) {
          this.$store.commit('toggleDateChanged')
        }
      }
    }
  }
}
</script>

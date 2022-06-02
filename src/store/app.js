import moment from 'moment-timezone'
import axios from 'axios'
import utils from '../services/utils.js'

const state = {
  sidebar: {
    opened: false
  },
  mainDomain: '',
  dataSource: '',
  startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  displayWarning: false,
  dateChanged: false,
  domainChanged: false,
  domains: [''],
  cdnDomains: [],
  domainSelected: '',
  data: {
    browserData: {},
    hourHitsData: {},
    hourValidhitsData: {},
    hourErrorhitsData: {},
    hourPagesData: {},
    hourValidpagesData: {},
    hourErrorpagesData: {},
    hourVisitsData: {},
    hourAvgsessiontimeData: {},
    domainValidpagesData: {},
    domainErrorpagesData: {},
    statusPagesData: {},
    statusPagesPreviousData: {},
    statuspagesErrorhitsData: {},
    robotspagesHitsData: {},
    robotsValidhitsData: {},
    initialpathVisitsData: {},
    requestformValidhitsData: {},
    requestorigfilepathValidhitsData: {},
    geolocalizationVisitsData: {}
  }
}

const mutations = {
  setMainDomain (state, domain) {
    state.mainDomain = domain
  },
  setDataSource (state, dataSource) {
    state.dataSource = dataSource
  },
  setStartDate (state, date) {
    state.startDate = date
  },
  setEndDate (state, date) {
    state.endDate = date
  },
  setDomainSelected (state, domain) {
    state.domainSelected = domain
  },
  updateDomains (state, domains) {
    state.domains = domains
  },
  updateCdnDomains (state, cdnDomains) {
    state.cdnDomains = cdnDomains
  },
  setBrowserData (state, browserData) {
    state.data.browserData = browserData
  },
  setHourHitsData (state, hourHitsData) {
    state.data.hourHitsData = hourHitsData
  },
  setHourValidhitsData (state, hourValidhitsData) {
    state.data.hourValidhitsData = hourValidhitsData
  },
  setHourErrorhitsData (state, hourErrorhitsData) {
    state.data.hourErrorhitsData = hourErrorhitsData
  },
  setHourPagesData (state, hourPagesData) {
    state.data.hourPagesData = hourPagesData
  },
  setHourValidpagesData (state, hourValidPagesData) {
    state.data.hourValidPagesData = hourValidPagesData
  },
  setHourErrorpagesData (state, hourErrorpagesData) {
    state.data.hourErrorpagesData = hourErrorpagesData
  },
  setHourVisitsData (state, hourVisitsData) {
    state.data.hourVisitsData = hourVisitsData
  },
  setHourAvgsessiontimeData (state, hourAvgsessiontimeData) {
    state.data.hourAvgsessiontimeData = hourAvgsessiontimeData
  },
  setDomainErrorpagesData (state, domainErrorpagesData) {
    state.data.domainErrorpagesData = domainErrorpagesData
  },
  setDomainValidpagesData (state, domainValidpagesData) {
    state.data.domainValidpagesData = domainValidpagesData
  },
  setStatusPagesData (state, statusPagesData) {
    state.data.statusPagesData = statusPagesData
  },
  setStatusPagesPreviousData (state, statusPagesPreviousData) {
    state.data.statusPagesPreviousData = statusPagesPreviousData
  },
  setStatuspagesErrorhitsData (state, statuspagesErrorhitsData) {
    state.data.statuspagesErrorhitsData = statuspagesErrorhitsData
  },
  setRobotspagesHitsData (state, robotspagesHitsData) {
    state.data.robotspagesHitsData = robotspagesHitsData
  },
  setRobotsValidhitsData (state, robotsValidhitsData) {
    state.data.robotsValidhitsData = robotsValidhitsData
  },
  setInitialpathVisitsData (state, initialpathVisitsData) {
    state.data.initialpathVisitsData = initialpathVisitsData
  },
  setRequestformValidhitsData (state, requestformValidhitsData) {
    state.data.requestformValidhitsData = requestformValidhitsData
  },
  setRequestorigfilepathValidhitsData (state, requestorigfilepathValidhitsData) {
    state.data.requestorigfilepathValidhitsData = requestorigfilepathValidhitsData
  },
  setGeolocalizationVisitsData (state, geolocalizationVisitsData) {
    state.data.geolocalizationVisitsData = geolocalizationVisitsData
  },
  setDisplayWarning (state, displayWarning) {
    state.displayWarning = displayWarning
  },
  toggleDateChanged (state) {
    state.dateChanged = !state.dateChanged
  },
  toggleDomainChanged (state) {
    state.domainChanged = !state.domainChanged
  },
  toggleSidebar (state) {
    state.sidebar.opened = !state.sidebar.opened
  }
}

const actions = {
  async fetchData (context, payload) {
    const clientAuthNeeded = process.env.VUE_APP_TARGET_REMOTE_API
    const baseUrl = process.env.VUE_APP_API_BASE_URL || process.env.BASE_URL
    const mainDomain = payload.mainDomain || context.state.mainDomain
    const startDate = payload.startDate || context.state.startDate
    const endDate = payload.endDate || context.state.endDate || context.state.startDate
    const endpoint = payload.endpoint
    const mutation = payload.mutation
    const domainSelected = payload.domainSelected || context.state.domainSelected
    const domainInParamaters = payload.domainInParamaters
    const cluster = baseUrl.split('.')[1]
    const isCdn = payload.isCdn || false

    const cdnEndpoint = 'shared_cdn'
    const params = {
      start_date: startDate,
      end_date: endDate
    }

    let url
    if (isCdn) {
      url = `${baseUrl}${mainDomain}/v1/${cdnEndpoint}/${endpoint}`
      params.cluster = cluster
    } else {
      url = `${baseUrl}${mainDomain}/v1/${endpoint}`
    }

    if (domainInParamaters && domainSelected !== 'all') {
      params.subdomain = domainSelected
    }
    // add Authorization header in developper mode (in order to target remote API in local) : else authentication is done on server side
    let headers = {}

    if (clientAuthNeeded) {
      const token = utils.getTokenFromCookie()
      headers = { Authorization: `Bearer ${token}` }
    }

    return axios.get(url,
      {
        headers,
        params
      }).then(response => {
      const records = response.data.records
      context.commit(mutation, records)
    }
    ).catch(error => console.log(error))
  }
}

export default {
  state,
  mutations,
  actions
}

describe('Dashboard page filtering', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/hour/visits?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/hour_visits_20180801.json'
    }).as('hour_visits_one_day')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/hour_pages_20180801.json'
    }).as('hour_pages_one_day')

    cy.intercept('/test.com/v1/hour/avgsessiontime?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/hour_avgsessiontime_20180801.json'
    }).as('hour_avgsessiontime_one_day')

    cy.intercept('/test.com/v1/domains/validpages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/domains_validpages_20180801.json'
    }).as('domains_validpages_one_day')

    cy.intercept('/test.com/v1/domains/errorpages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/domains_errorpages_20180801.json'
    }).as('domains_errorpages_one_day')

    cy.intercept('/test.com/v1/hour/visits?start_date=2018-08-01&end_date=2018-08-11', {
      fixture: 'webhosting/hour_visits_20180801_20180811.json'
    }).as('hour_visits_10_days')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2018-08-11', {
      fixture: 'webhosting/hour_pages_20180801_20180811.json'
    }).as('hour_pages_10_days')

    cy.intercept('/test.com/v1/hour/avgsessiontime?start_date=2018-08-01&end_date=2018-08-11', {
      fixture: 'webhosting/hour_avgsessiontime_20180801_20180811.json'
    }).as('hour_avgsessiontime_10_days')

    cy.intercept('/test.com/v1/domains/validpages?start_date=2018-08-01&end_date=2018-08-11', {
      fixture: 'webhosting/domains_validpages_20180801_20180811.json'
    }).as('domains_validpages_10_days')

    cy.intercept('/test.com/v1/domains/errorpages?start_date=2018-08-01&end_date=2018-08-11', {
      fixture: 'webhosting/domains_errorpages_20180801_20180811.json'
    }).as('domains_errorpages_10_days')

    cy.intercept('/test.com/v1/hour/visits?start_date=2018-08-01&end_date=2018-08-01&subdomain=shop.test.com', {
      fixture: 'webhosting/hour_visits_20180801_shop.json'
    }).as('hour_visits_shop')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2018-08-01&subdomain=shop.test.com', {
      fixture: 'webhosting/hour_pages_20180801_shop.json'
    }).as('hour_pages_shop')

    cy.intercept('/test.com/v1/hour/avgsessiontime?start_date=2018-08-01&end_date=2018-08-01&subdomain=shop.test.com', {
      fixture: 'webhosting/hour_avgsessiontime_20180801_shop.json'
    }).as('hour_avgsessiontime_shop')

    cy.visit('/test.com/owstats#/dashboard?start_date=2018-08-01&end_date=2018-08-01&domain=all')

    cy.wait('@domains')
    cy.wait('@hour_visits_one_day')
    cy.wait('@hour_pages_one_day')
    cy.wait('@hour_avgsessiontime_one_day')
    cy.wait('@domains_validpages_one_day')
    cy.wait('@domains_errorpages_one_day')

    // top domain is present and all values are correct
    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-valid-pages"]')
      .filter(':contains("62")')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-error-pages"]')
      .filter(':contains("22")')

    // domain info is present and all values are correct
    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Pages vues"), :contains("Pages viewed")')
      .find('.widget-numbers')
      .filter(':contains("119")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Pages en erreur"), :contains("Error pages")')
      .find('.widget-numbers')
      .filter(':contains("22")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Nombre de sessions"), :contains("Number of sessions")')
      .find('.widget-numbers')
      .filter(':contains("16")')
  })

  it('displays dashboard page and filters on date', () => {
    // change filters
    cy.get('#RangeDatePicker-input').click()
    cy.get('.datepicker-day-text').contains('1').click()
    cy.get('.datepicker-day-text').contains('11').click()
    cy.get('.datepicker-button.validate').click()

    // apis with new dates are triggered
    cy.wait('@hour_visits_10_days')
    cy.wait('@hour_pages_10_days')
    cy.wait('@hour_avgsessiontime_10_days')
    cy.wait('@domains_validpages_10_days')
    cy.wait('@domains_errorpages_10_days')

    // domain info is present and all values are correct
    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 682 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 242 ')
  })

  it('displays dashboard page and filters on subdomain', () => {
    // change filters
    cy.get('.domain-selection').click()
    cy.get('.domain-selection').contains('shop.test.com').click()

    // apis with new dates are triggered
    cy.wait('@hour_visits_shop')
    cy.wait('@hour_pages_shop')
    cy.wait('@hour_avgsessiontime_shop')
    cy.wait('@domains_validpages_one_day')
    cy.wait('@domains_errorpages_one_day')

    // domain info is present and all values are correct
    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Pages vues"), :contains("Pages viewed")')
      .find('.widget-numbers')
      .filter(':contains("29")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Pages en erreur"), :contains("Error Pages")')
      .find('.widget-numbers')
      .filter(':contains("0")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Nombre de sessions"), :contains("Number of sessions")')
      .find('.widget-numbers')
      .filter(':contains("8")')
  })

  it('keeps the filters when changing page', () => {
    // change filters
    cy.get('.domain-selection').click()
    cy.get('.domain-selection').contains('shop.test.com').click()

    cy.get('#RangeDatePicker-input').click()
    cy.get('.datepicker-day-text').contains('1').click()
    cy.get('.datepicker-day-text').contains('11').click()
    cy.get('.datepicker-button.validate').click()

    // navigate to browser
    cy.get('a[href*="#/browser"]').click()

    // check url contains filter data
    cy.url().should('eq', 'http://localhost:8090/test.com/owstats#/browser?start_date=2018-08-01&end_date=2018-08-11&domain=shop.test.com&dataSource=webhosting')
    cy.get('.domain-selection').contains('shop.test.com')
    cy.get('.header-picker-range').filter(':contains("1 août 2018 - 11 août 2018"), :contains("Aug 1, 2018 - Aug 11, 2018")').should('exist')
  })
})

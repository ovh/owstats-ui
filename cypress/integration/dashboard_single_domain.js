describe('Display Dashboard page when there is no subdomain', () => {
  it('displays dashboard page: one day period', () => {
    // intercept all api calls to get data from fixture
    cy.intercept('/test.com/v1/domains**', {
      records: [
        'www.test.com'
      ]
    }).as('domains')

    cy.intercept('/test.com/v1/hour/visits?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/hour_visits_20180801.json'
    }).as('hour_visits')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/hour_pages_20180801.json'
    }).as('hour_pages')

    cy.intercept('/test.com/v1/hour/avgsessiontime?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/hour_avgsessiontime_20180801.json'
    }).as('hour_avgsessiontime')

    cy.intercept('/test.com/v1/domains/validpages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/domains_validpages_20180801_single_domain.json'
    }).as('domains_validpages')

    cy.intercept('/test.com/v1/domains/errorpages?start_date=2018-08-01&end_date=2018-08-01', {
      fixture: 'webhosting/domains_errorpages_20180801_single_domain.json'
    }).as('domains_errorpages')

    cy.visit('/test.com/owstats#/dashboard?start_date=2018-08-01&end_date=2018-08-01&domain=all')

    cy.wait('@domains')
    cy.wait('@hour_visits')
    cy.wait('@hour_pages')
    cy.wait('@hour_avgsessiontime')
    cy.wait('@domains_validpages')
    cy.wait('@domains_errorpages')

    // filter on period is present and set to correct date
    cy.get('#RangeDatePicker-input')
    cy.get('.domain-selection').should('not.exist')
    // filter on domain is present and set to all

    // domain info is present and all values are correct
    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 62 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 22 ')
  })
})

describe('Display Dashboard page: 1000 days period', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/hour/visits?start_date=2018-08-01&end_date=2021-08-01', {
      fixture: 'hour_visits_20180801_20210801.json'
    }).as('hour_visits')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2021-08-01', {
      fixture: 'hour_pages_20180801_20210801.json'
    }).as('hour_pages')

    cy.intercept('/test.com/v1/hour/avgsessiontime?start_date=2018-08-01&end_date=2021-08-01', {
      fixture: 'hour_avgsessiontime_20180801_20210801.json'
    }).as('hour_avgsessiontime')

    cy.intercept('/test.com/v1/domains/validpages?start_date=2018-08-01&end_date=2021-08-01', {
      fixture: 'domains_validpages_20180801_20210801.json'
    }).as('domains_validpages')

    cy.intercept('/test.com/v1/domains/errorpages?start_date=2018-08-01&end_date=2021-08-01', {
      fixture: 'domains_errorpages_20180801_20210801.json'
    }).as('domains_errorpages')

    cy.visit('/test.com/owstats#/dashboard?start_date=2018-08-01&end_date=2021-08-01&domain=all')

    cy.wait('@domains')
    cy.wait('@hour_visits')
    cy.wait('@hour_pages')
    cy.wait('@hour_avgsessiontime')
    cy.wait('@domains_validpages')
    cy.wait('@domains_errorpages')
  })

  it('displays top domain info', () => {
    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 28768 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 10208 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("shop.test.com")')
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 13456 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("shop.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 0 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("api.test.com")')
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 12992 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("api.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 0 ')
  })

  it('displays traffic info', () => {
    cy.get('#traffic').click(55, 100)
    cy.get('.apexcharts-tooltip').find('.apexcharts-tooltip-title').should('have.text', '07 2018')

    // verifying tooltip values
    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-y-group')
      .filter(':contains("Pages vues et en erreur"), :contains("View and error pages")')
      .find('.apexcharts-tooltip-text-y-value').should('have.text', '4371')

    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-y-group')
      .filter(':contains("Nombre de sessions"), :contains("Number of sessions")')
      .find('.apexcharts-tooltip-text-y-value').should('have.text', '496')
  })

  it('displays domain info', () => {
    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Pages vues et en erreur"), :contains("View and error pages")')
      .find('.widget-numbers')
      .filter(':contains("65424")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Nombre de sessions"), :contains("Number of sessions")')
      .find('.widget-numbers')
      .filter(':contains("7424")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Average session duration"), :contains("Temps moyen d\'une session")')
      .find('.widget-numbers')
      .filter(':contains("5min 52sec")')
  })
})

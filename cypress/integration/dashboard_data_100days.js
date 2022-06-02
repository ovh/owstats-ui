describe('Display Dashboard page: 100 days period', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/hour/visits?start_date=2018-08-01&end_date=2018-11-11', {
      fixture: 'webhosting/hour_visits_20180801_20181111.json'
    }).as('hour_visits')

    cy.intercept('/test.com/v1/hour/pages?start_date=2018-08-01&end_date=2018-11-11', {
      fixture: 'webhosting/hour_pages_20180801_20181111.json'
    }).as('hour_pages')

    cy.intercept('/test.com/v1/hour/avgsessiontime?start_date=2018-08-01&end_date=2018-11-11', {
      fixture: 'webhosting/hour_avgsessiontime_20180801_20181111.json'
    }).as('hour_avgsessiontime')

    cy.intercept('/test.com/v1/domains/validpages?start_date=2018-08-01&end_date=2018-11-11', {
      fixture: 'webhosting/domains_validpages_20180801_20181111.json'
    }).as('domains_validpages')

    cy.intercept('/test.com/v1/domains/errorpages?start_date=2018-08-01&end_date=2018-11-11', {
      fixture: 'webhosting/domains_errorpages_20180801_20181111.json'
    }).as('domains_errorpages')

    cy.visit('/test.com/owstats#/dashboard?start_date=2018-08-01&end_date=2018-11-11&domain=all')

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
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 6386 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("www.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 2266 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("shop.test.com")')
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 2987 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("shop.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 0 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("api.test.com")')
      .find('[data-cy="top-domain-valid-pages"]').should('have.text', ' 2884 ')

    cy.get('[data-cy="top-domain-card"]')
      .filter(':contains("api.test.com")')
      .find('[data-cy="top-domain-error-pages"]').should('have.text', ' 0 ')
  })

  it('displays traffic info', () => {
  // simulate hovering on spline chart
    cy.get('#traffic').click(600, 100)

    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-title')
      .filter(':contains("10/31/2018"), :contains("31/10/2018")')
      .should('exist')

    // verifying tooltip values
    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-y-group')
      .filter(':contains("Pages vues et en erreur"), :contains("View and error pages")')
      .filter(':contains("141")')

    cy.get('.apexcharts-tooltip')
      .find('.apexcharts-tooltip-y-group')
      .filter(':contains("Nombre de sessions"), :contains("Number of sessions")')
      .filter(':contains("16")')
  })

  it('displays domain info', () => {
    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Pages vues et en erreur"), :contains("View and error pages")')
      .find('.widget-numbers')
      .filter(':contains("14523")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Nombre de sessions"), :contains("Number of sessions")')
      .find('.widget-numbers')
      .filter(':contains("1648")')

    cy.get('#domain-info')
      .find('.widget-chart')
      .filter(':contains("Average session duration"), :contains("Temps moyen d\'une session")')
      .find('.widget-numbers')
      .filter(':contains("6min 5sec")')
  })
})

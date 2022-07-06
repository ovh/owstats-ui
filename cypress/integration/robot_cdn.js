describe('Display cdn robot data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/robots/validhits?start_date=2018-01-01&end_date=2021-01-01', {
      fixture: 'webhosting/robots_validhits_20180101_20210101.json'
    }).as('robots_validhits')

    cy.intercept('/test.com/v1/robots_pages/hits?start_date=2018-01-01&end_date=2021-01-01', {
      fixture: 'webhosting/robots_pages_hits_20180101_20210101.json'
    }).as('robots_pages_hits')

    cy.intercept('/test.com/v1/shared_cdn/cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/shared_cdn/robots/validhits?start_date=2018-01-01&end_date=2021-01-01&subdomain=api.test.com ', {
      fixture: 'cdn/robots_validhits_20180101_20210101.json'
    }).as('cdn_robots_validhits')

    cy.intercept('/test.com/v1/shared_cdn/robots_pages/hits?start_date=2018-01-01&end_date=2021-01-01&subdomain=api.test.com ', {
      fixture: 'cdn/robots_pages_hits_20180101_20210101.json'
    }).as('cdn_robots_pages_hits')

    cy.visit('/test.com/owstats#/robot?start_date=2018-01-01&end_date=2021-01-01')
    cy.wait('@domains')
    cy.wait('@robots_validhits')
    cy.wait('@robots_pages_hits')
  })

  it('displays cdn data', () => {
    cy.get('#top-robot').find('.apexcharts-legend-text').should('have.length', 1)
    cy.get('#top-robot').find('.apexcharts-legend-text').contains('Go-http-client/1.1').should('exist')

    // check table contains correct values
    cy.get('#top-robot').find('tr').should('have.length', 2)

    cy.get('#top-robot').find('tr').filter(':contains("Go-http-client/1.1")').contains('511')
    cy.get('#top-robot').find('tr').filter(':contains("Go-http-client/1.1")').contains('100.0')

    // switch to cdn
    cy.get('#data-source-cdn').click()
    cy.wait('@cdn_domains')
    cy.wait('@cdn_robots_validhits')
    cy.wait('@cdn_robots_pages_hits')

    cy.get('#top-robot').find('.apexcharts-legend-text').contains('Go-http-client/1.1').should('exist')

    // check table contains correct values
    cy.get('#top-robot').find('tr').should('have.length', 2)

    cy.get('#top-robot').find('tr').filter(':contains("Go-http-client/1.1")').contains('319')
    cy.get('#top-robot').find('tr').filter(':contains("Go-http-client/1.1")').contains('100.0')
  })
})

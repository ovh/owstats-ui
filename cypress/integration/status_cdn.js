describe('Display status data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/shared_cdn/status_pages/errorhits**', {
      fixture: 'cdn/errorhits.json'
    }).as('errorhits')

    cy.visit('/test.com/owstats#/status?start_date=2022-07-01&end_date=2022-07-01&domain=cdn.test.com&dataSource=cdn')
  })

  it('displays trend components with correct values', () => {
  })
})

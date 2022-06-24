describe('Display cdn ratelimit data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/cdn/waf?start_date=2022-06-23&end_date=2022-06-23&subdomain=api.test.com', {
      fixture: 'cdn/waf.json'
    }).as('waf')

    cy.intercept('/test.com/v1/cdn/https_redirect?start_date=2022-06-23&end_date=2022-06-23&subdomain=api.test.com', {
      fixture: 'cdn/https_redirect.json'
    }).as('https_redirect')

    cy.intercept('/test.com/v1/cdn/bytes?start_date=2022-06-23&end_date=2022-06-23&subdomain=api.test.com', {
      fixture: 'cdn/bytes.json'
    }).as('bytes')

    cy.visit('/test.com/owstats#/cdn_security?start_date=2022-06-23&end_date=2022-06-23&domain=api.test.com&dataSource=cdn')
    cy.wait('@domains')
    cy.wait('@cdn_domains')
    cy.wait('@waf')
    cy.wait('@https_redirect')
  })

  it('displays cdn data', () => {
  })
})

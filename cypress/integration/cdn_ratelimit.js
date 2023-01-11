describe('Display cdn ratelimit data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/ratelimit?start_date=2022-06-22&end_date=2022-06-22&subdomain=api.test.com', {
      fixture: 'cdn/ratelimit.json'
    }).as('ratelimit')

    cy.intercept('/test.com/v1/shared_cdn/cdn/bytes?start_date=2022-06-22&end_date=2022-06-22&subdomain=api.test.com', {
      fixture: 'cdn/bytes.json'
    }).as('bytes')

    cy.visit('/test.com/owstats#/cdn_ratelimit?start_date=2022-06-22&end_date=2022-06-22&domain=api.test.com&dataSource=cdn')
    cy.wait('@domains')
    cy.wait('@cdn_domains')
    cy.wait('@ratelimit')
  })

  it('displays cdn data', () => {
  })
})

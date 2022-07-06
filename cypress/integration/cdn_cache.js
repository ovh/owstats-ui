describe('Display cdn data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/shared_cdn/cdn/cache?start_date=2022-02-05&end_date=2022-02-06&subdomain=api.test.com', {
      fixture: 'cdn/cache.json'
    }).as('cache')

    cy.intercept('/test.com/v1/shared_cdn/cdn/bytes?start_date=2022-02-05&end_date=2022-02-06&subdomain=api.test.com', {
      fixture: 'cdn/bytes.json'
    }).as('bytes')

    cy.visit('/test.com/owstats#/cdn_cache?start_date=2022-02-05&end_date=2022-02-06&domain=api.test.com&dataSource=cdn')
    cy.wait('@domains')
    cy.wait('@cdn_domains')
    cy.wait('@cache')
    cy.wait('@bytes')
  })

  it('displays cdn data', () => {
  })
})

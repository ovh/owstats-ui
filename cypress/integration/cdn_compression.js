describe('Display cdn compression data', () => {
  beforeEach(() => {
    cy.intercept('/test.com/v1/domains**', {
      fixture: 'webhosting/domains.json'
    }).as('domains')

    cy.intercept('/test.com/v1/shared_cdn/domains**', {
      fixture: 'cdn/domains.json'
    }).as('cdn_domains')

    cy.intercept('/test.com/v1/cdn/encoding?start_date=2022-05-15&end_date=2022-05-15&subdomain=api.test.com', {
      fixture: 'cdn/compression.json'
    }).as('compression')

    cy.intercept('/test.com/v1/cdn/bytes?start_date=2022-05-15&end_date=2022-05-15&subdomain=api.test.com', {
      fixture: 'cdn/bytes.json'
    }).as('bytes')

    cy.visit('/test.com/owstats#/cdn_compression?start_date=2022-05-15&end_date=2022-05-15&domain=api.test.com&dataSource=cdn')
    cy.wait('@domains')
    cy.wait('@cdn_domains')
    cy.wait('@compression')
  })

  it('displays cdn data', () => {
  })
})

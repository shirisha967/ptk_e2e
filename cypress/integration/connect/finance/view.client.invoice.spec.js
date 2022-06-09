/// <reference types="Cypress" />

describe("View client invoice", () => {
    it("Clicks on the view invoice button on a test invoice", () => {
        const connectUrl = Cypress.env("connectUrl");

        // Log in to PTK Connect
        cy.beforeConnect();

        cy.visit(`${connectUrl}/finance/`);
        cy.get(".side-menu > .nav > :nth-child(6) > a").click();

        // Do we have a client invoice? If so then make some checks otherwise just log out.
        cy.get("body").then(($body) => {
            if ($body.find("#property-invoices-table > tbody > tr > td:nth-child(5) > button").length > 0) {
                //evaluates as true
                cy.get("#property-invoices-table > tbody > tr > td:nth-child(5) > button")
                    .should("have.attr", "onclick")
                    .and("contains", "/finance/invoice/property");
            }
        });

        cy.logoutOfConnect();
    });
});

export class NavigationHelper {
    navigateToPortalInvoices() {
        cy.visit(Cypress.env("portalUrl") + "/invoices");
        cy.get("ul.sidenav li.listOpt a.active").should("have.text", "Invoices");
    }
}

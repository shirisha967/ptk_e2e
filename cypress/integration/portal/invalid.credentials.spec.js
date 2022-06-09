/// <reference types="Cypress" />

describe("Invalid credentials message shown on Client Portal", () => {
    it("Log in error message shown", () => {
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.visit(Cypress.env("portalUrl"));

        // Try to log in with invalid details
        cy.get(".mb-0").type("InvalidUser@example.com");
        cy.get(":nth-child(2) > input").type("InvalidPassword");
        cy.get("#loginBtn").click();

        // Check error message
        cy.get("#error").should("be.visible").contains("Incorrect credentials");
    });
});

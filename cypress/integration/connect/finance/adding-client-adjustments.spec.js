/// <reference types="Cypress" />

import format from "date-fns/format";
import addYears from "date-fns/addYears";

describe("Create client adjustments", () => {
    const testPropertyName = Cypress.env("e2e_test_property_name");

    it("Add a new client adjustment", () => {
        const connectUrl = Cypress.env("connectUrl");

        // Creates a date that is 200 years in the future, so the item is always at the top of the table when added
        const date = addYears(new Date(), 200);

        // Log in to PTK Connect
        cy.beforeConnect();

        cy.visit(`${connectUrl}/finance/adjustment/create/`);

        cy.get("#div_id_client > .controls > .btn-group > .btn").click();
        cy.waitFor("#div_id_client > .controls > .btn-group > .open");
        cy.get("#div_id_client > .controls > .btn-group > .open > .bs-searchbox > .form-control").type("e2e");
        cy.get(".dropdown-menu > .active > a").click();

        cy.get("#div_id_property > .controls > .btn-group > .btn").click();
        cy.waitFor("#div_id_property > .controls > .btn-group > .open");

        // Check to see if we have an E2E property otherwise use test property
        cy.get("#div_id_property > .controls > .btn-group > .open > .bs-searchbox > .form-control").type(
            testPropertyName
        );

        cy.get("#div_id_property > .controls > .btn-group > .open > .dropdown-menu > .active > a").click();

        cy.get("#id_date").type(format(date, "dd/MM/yyyy"));

        cy.get("#div_id_type > .controls > .btn-group > .btn").click();
        cy.waitFor("#div_id_type > .controls > .btn-group > .open");
        cy.get(
            '#div_id_type > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="2"] > a'
        ).click();
        cy.get("#id_amount").type("50");
        cy.get("#id_notes").type("This is a test note from Cypress");
        cy.get("#submit-save").click();

        cy.get("#adjustments_table > tbody > :nth-child(1) > :nth-child(2)").should("contain", "Client");
        cy.get("#adjustments_table > tbody > :nth-child(1) > :nth-child(3)").should("contain", "Property");
        cy.get("#adjustments_table > tbody > :nth-child(1) > :nth-child(4)").should(
            "contain",
            "This is a test note from Cypress"
        );
        cy.get("#adjustments_table > tbody > :nth-child(1) > :nth-child(6)").should("contain", "Positive");
        cy.get("#adjustments_table > tbody > :nth-child(1) > :nth-child(7)").should("contain", "£50.00");

        cy.get(":nth-child(1) > :nth-child(8) > .btn").click();
        cy.get("#submit-delete").click();

        cy.logoutOfConnect();
    });
});

/// <reference types="Cypress" />

import format from "date-fns/format";

describe("Create provider adjustments", () => {
    before("Has prerequisites", function () {
        cy.loginToAdmin().ensureThereIsAProvider();
    });

    it("Add a new provider adjustment", () => {
        const connectUrl = Cypress.env("connectUrl");

        // Log in to PTK Connect
        cy.beforeConnect();

        cy.visit(`${connectUrl}/finance/charge/create/`);

        cy.get("#div_id_provider > .controls > .btn-group > .btn").click();
        cy.get("#div_id_provider > .controls > .btn-group > .open > .bs-searchbox > .form-control").type(
            "e2eTestProvider{enter}"
        );

        cy.get("#div_id_location > .controls > .btn-group > .btn").click();
        cy.get("#div_id_location > .controls > .btn-group > .open > .bs-searchbox > .form-control").type(
            "Edinburgh{enter}"
        );

        cy.get("#div_id_category > .controls > .btn-group > .btn").click();
        cy.waitFor("#div_id_category > .controls > .btn-group > .open");
        cy.get(
            '#div_id_category > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a'
        ).click();

        cy.get("#id_date").click().type(format(new Date(), "dd/MM/yyyy"));

        cy.get("#div_id_type > .controls > .btn-group > .btn").click();
        cy.waitFor("#div_id_type > .controls > .btn-group > .open");
        cy.get(
            '#div_id_type > .controls > .btn-group > .open > .dropdown-menu > [data-original-index="1"] > a'
        ).click();

        cy.get("#id_amount").type("50");
        cy.get("#id_notes").type("This is a test note from Cypress");

        cy.get("#submit-save").click();

        cy.get("#charges_table > tbody > :nth-child(1) > :nth-child(2)").should("contain", "E2E Provider");
        cy.get("#charges_table > tbody > :nth-child(1) > :nth-child(3)").should("contain", "Cleaning");
        cy.get("#charges_table > tbody > :nth-child(1) > :nth-child(6)").should("contain", "£50.00");

        cy.get("#charges_table > tbody > :nth-child(1) > :nth-child(7) > .btn").click();

        cy.get("#submit-delete").click();

        cy.logoutOfConnect();
    });
});

/// <reference types="Cypress" />

describe("property to onboarding and validation checks", () => {
    before("Log into Connect", () => {
        // Log out of Connect
        cy.beforeConnect();
    });

    after("Log out", () => {
        // Log out of Connect
        cy.logoutOfConnect();
    });

    const testPropertyName = Cypress.env("e2e_test_property_name");
    it("Visit a property", () => {
        /* A simple script to go to an onbaording property and then click through to
           the relevant onboarding section. */

        // visit and old property - Bridge Wharf
        cy.visit("https://ptkdev.com/properties/" + Cypress.env("testPropertyId"));
        Cypress.on("uncaught:exception", (err, runnable) => {
            return false;
        });
        cy.url().should("include", "properties/" + Cypress.env("testPropertyId"));

        // Click Onboarding link
        cy.get(".orange").contains("ONBOARDING").click();
        cy.url().should("include", "onboarding");

        // We should now be on the onboarding page so let's do some changes to test the page's functionality

        // Change property name
        cy.get("#id_property_name").focus().clear().type(`${testPropertyName} `);

        // Change management charge to 0 to show error
        cy.get("#id_management_charge").focus().clear().type("{enter}");

        cy.get("#id_deposit").focus();
        cy.get(".alertBoxForInput").should("contain", "This field is required");

        // Change management charge to 150 to show error
        cy.get("#id_management_charge").focus().clear().type("150{enter}");
        cy.get("#id_deposit").focus();
        cy.get(".alertBoxForInput").should(
            "contain",
            "Management charge cannot be less than 0% or greater than 99.99%"
        );

        // Change management charge to 150
        cy.get("#id_management_charge").focus().clear().type("20{enter}");
        cy.get("#id_deposit").focus();

        // Add short address
        cy.get("#id_short_address").focus().clear().type("St Andrews House, 2 Regent Rd, Edinburgh, EH1 3DG{enter}");

        // Change Airbnb deposit to 100
        cy.get("#id_deposit").focus().clear().type("100{enter}");

        // Change Cleaning fee to 5
        cy.get("#id_cleaning_fee").focus().clear().type("5{enter}");

        // Change Cleaning time to 60
        cy.get("#id_cleaning_time").focus().clear().type("60{enter}");

        // Change Account Number to 6 digits so we can test the error messages
        cy.get("#id_account_number").click().clear().type("123456{enter}");
        cy.get(".alertBoxForInput").should(
            "contain",
            "Account number must be a minimum of 7 digits and a maximum of 8"
        );

        // Change Account Number to 7 digits so we can test the error messages
        cy.get("#id_account_number").click().clear().type("1234567{enter}");

        // Change sort code so we can test the error messages
        cy.get("#id_sort_code").click().clear().type("12345678{enter}");
        cy.get(".alertBoxForInput").should(
            "contain",
            "This is not a valid sort code. Valid formats: 123456 or 12-34-56"
        );

        // Change Sort Code so we can test the error messages
        cy.get("#id_sort_code").click().clear().type("12-34-56{enter}");
    });
});

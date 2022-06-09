/// <reference types="Cypress" />

// Setup global variables to be used in all tests
let contactId, dealIds, registrationFormOne, registrationFormTwo, registrationFormThree;

const email = `regflowtst+${Date.now()}@example.com`;
const firstName = "Fred";
const lastName = "Bloggs";
const phoneNumber = "01234 56789";
const dealOne = {
    property_address: "Flat 3, 123 Fake Street",
    post_code: "F0 0BA",
    mgmt_fee_inc_vat_: 20,
    onboarding_fee: "100.50",
    property_city: "Brighton",
    dealstage: "73c3d87c-cdb7-4ba8-ba36-f7b528fed909",
};
const dealTwo = {
    property_address: "Flat 4, 456 Nowhere Avenue",
    post_code: "BA2 8AZ",
    mgmt_fee_inc_vat_: 18,
    onboarding_fee: "200.40",
    property_city: "Oxford",
    dealstage: "048b680e-eaa9-4d0f-8fab-f2f63165a63c",
};
const dealThree = {
    property_address: "Flat 3, 123 Fake Street",
    post_code: "F0 0BA",
    mgmt_fee_inc_vat_: 20,
    onboarding_fee: "100.50",
    property_city: "Bristol",
    dealstage: "73c3d87c-cdb7-4ba8-ba36-f7b528fed909",
};
const dealFour = {
    property_address: "Flat 4, 123 Fake Street",
    post_code: "F0 0BA",
    mgmt_fee_inc_vat_: 20,
    onboarding_fee: "100.40",
    property_city: "Bristol",
    dealstage: "73c3d87c-cdb7-4ba8-ba36-f7b528fed909",
};

context("Registration page", () => {
    before(() => {
        // Log into Marketing
        cy.beforeMarketing();

        // Create contact and deals
        const body = {
            contact: {
                firstname: firstName,
                lastname: lastName,
                email: email,
                phone: phoneNumber,
            },
            deals: [dealOne, dealTwo, dealThree, dealFour],
        };

        cy.request("POST", "https://www.ptkdev.co.uk/api/create_for_e2e/", body).then((response) => {
            // Set variables for use within the tests
            contactId = response.body.contact_id;
            dealIds = response.body.deal_ids;
            registrationFormOne = Cypress.env("marketingUrl") + "/registration/" + contactId + "/brighton/";
            registrationFormTwo = Cypress.env("marketingUrl") + "/registration/" + contactId + "/oxford/";
            registrationFormThree = Cypress.env("marketingUrl") + "/registration/" + contactId + "/bristol/";

            // Wait for 2 seconds to give the deal bulk update time to work. If we don't the tests fail due to the data
            // not being ready.
            cy.wait(2000);
        });
    });

    it("Test registration form saves updated data", () => {
        cy.beforeMarketing();
        cy.visit(registrationFormOne);

        // Check the URL contains the contact ID and brighton
        cy.url().should("include", contactId);
        cy.url().should("include", dealOne.property_city.toLowerCase());

        // Make sure the form is visible
        cy.get("#first_name").should("be.visible");

        // Let's check the form contains the values we expect
        cy.get("#first_name").should("have.value", firstName);
        cy.get("#last_name").should("have.value", lastName);
        cy.get("#email").should("have.value", email);
        cy.get("#phone").should("have.value", phoneNumber);

        // Check the number of deals and addresses
        cy.get(".input-number").contains("1");
        cy.get(".property-address").contains(dealOne.property_address);

        // Let's update the details to make sure the form saves new details
        cy.log("Change first and last name values to test saving works as expected");
        cy.get("#first_name").clear().type("Bob");
        cy.get("#last_name").clear().type("Bloggs II");

        // Click 'I Understand'
        cy.get(".registration__details > .registration__button").click();

        // Leave the page and then come back to check the values have saved correctly
        // TODO: we could potentially use cy.reload(true) to do this, but I'm not convinced it is working as expected
        cy.log("Visit home page and then return to the form to check the new values have saved");
        cy.visit(Cypress.env("marketingUrl"));
        cy.visit(registrationFormOne);
        cy.get("#first_name").should("have.value", "Bob");
        cy.get("#last_name").should("have.value", "Bloggs II");

        // Put values back to what they were in case of a retry
        cy.get("#first_name").clear().type(firstName);
        cy.get("#last_name").clear().type(lastName);

        // Make sure T&Cs are viewable
        // Click the T&Cs link and check the T&Cs title is visible
        cy.get(":nth-child(5) > a").click();
        cy.get(".registration__terms-title").should("be.visible").contains("Terms and Conditions of Service");
        // Click back button
        cy.get(".registration__terms-bar > .container > a").click();

        // Move onto the payment screen by clicking 'I Understand'
        cy.get(".registration__details > .registration__button").click();

        // Make sure the payment form is visible
        cy.get("#cardholder_name").should("be.visible");

        // Check total on payment page is matches the deal onboarding fee
        cy.get('[data-js="calc-total"]').contains(dealOne.onboarding_fee);

        // Test to make sure there is an error message when no card details are entered
        cy.get("#button_payment").click();
        cy.get("#payment-error-message").should("be.visible").contains("Error: Cardholder name or email is missing");

        // Enter incorrect card details to get an error message
        cy.get("#cardholder_name")
            .click()
            .clear()
            .type(firstName + " " + lastName);

        // Fill in stripe form
        cy.getWithinIframe('[name="cardnumber"]').type("4000000000009995");
        cy.getWithinIframe('[name="exp-date"]').type("1232");
        cy.getWithinIframe('[name="cvc"]').type("987");
        cy.getWithinIframe('[name="postal"]').type("12345");

        // Click pay button
        cy.get("#button_payment").click();

        // Check error message has appeared
        cy.get("#payment-error-message").should("be.visible").contains("Error: Your card has insufficient funds.");

        // Fill in stripe form with a valid working credit card
        cy.getWithinIframe(".CardField-input-wrapper").eq(0).click();
        cy.getWithinIframe('[name="cardnumber"]').type("{selectall}4000008260000000");
        cy.getWithinIframe('[name="exp-date"]').type("{selectall}1232");
        cy.getWithinIframe('[name="cvc"]').type("{selectall}987");
        cy.getWithinIframe('[name="postal"]').type("{selectall}12345");

        // Click pay button
        cy.get("#button_payment").click();

        // We should now be on the client portal
        cy.url().should("include", "portal");
    });

    it("Test deal form is not available yet because Hubspot stage is set to viewing", () => {
        cy.beforeMarketing();
        cy.visit(registrationFormTwo);
        cy.url().should("include", contactId);
        cy.url().should("include", dealTwo.property_city.toLowerCase());

        // Make sure the form is not visible by looking for the first name input
        cy.get("#first_name").should("not.be.visible");

        cy.get(".registration__error > p").contains(
            "Sorry we don't have any properties ready for you to complete registration."
        );
    });

    it("Test multi-deal registration shows correct fees totals", () => {
        cy.beforeMarketing();
        cy.visit(registrationFormThree);

        // Check the URL contains the contact ID and bristol
        cy.url().should("include", contactId);
        cy.url().should("include", dealThree.property_city.toLowerCase());

        // Click 'I Understand'
        cy.get(".registration__details > .registration__button").click();

        // Check total on payment page is matches the deal onboarding fee
        cy.get('[data-js="calc-total"]').contains("200.90");

        // Check the breakdown line
        // This is done with 3 tests due to sometimes the numbers can move position in the string
        // ie 100.50 can sometimes be before 100.40 and sometimes afterwards.
        cy.get('[data-js="calc-breakdown"]').contains("1 @ £100.50");
        cy.get('[data-js="calc-breakdown"]').contains("+");
        cy.get('[data-js="calc-breakdown"]').contains("1 @ £100.40");

        // Test to make sure there is an error message when no card details are entered
        cy.get("#button_payment").contains("Pay £200.90");
    });
});

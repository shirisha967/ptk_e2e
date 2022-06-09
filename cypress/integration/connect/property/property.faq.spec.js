/// <reference types="Cypress" />

import { Property } from "../../pages/property";

const property = new Property();
var label;
var description = "Testing Purpose";
var link = "https://ptkdev.com/";
var propertyId = " ";

describe("Property FAQ", () => {
    before(() => {
        cy.loginToAdmin();
        cy.ensureTestProperty().then((testPropertyId) => {
            cy.log(testPropertyId);
            propertyId = testPropertyId;
        });
    });
    beforeEach(() => {
        cy.beforeConnect();
        //Navigate to property details page
        property.navigateToThePropertyDetailsPage(propertyId);
        property.verifyFaq();
    });

    it("Property FAQ(Access Info)", () => {
        label = "Access Info";

        property.verifyToolbarOptionBold(label, description);
        property.clickOnEditButton();

        property.verifyToolbarOptionItalic(label, description);
        property.clickOnEditButton();

        property.verifyInsertHyperlink(label, description, link);
        property.clickOnEditButton();
        property.verifyRemoveHyperlink(label, description, link);
    });

    it("Property FAQ(Supermarkets)", () => {
        label = "Supermarkets";

        property.verifyToolbarOptionBold(label, description);
        property.clickOnEditButton();

        property.verifyToolbarOptionItalic(label, description);
        property.clickOnEditButton();

        property.verifyInsertHyperlink(label, description, link);
        property.clickOnEditButton();
        property.verifyRemoveHyperlink(label, description, link);
    });

    it("Property FAQ(Local Attractions)", () => {
        label = "Local Attractions";

        property.verifyToolbarOptionBold(label, description);
        property.clickOnEditButton();

        property.verifyToolbarOptionItalic(label, description);
        property.clickOnEditButton();

        property.verifyInsertHyperlink(label, description, link);
        property.clickOnEditButton();
        property.verifyRemoveHyperlink(label, description, link);
    });

    it("Property FAQ(Additional Amenities)", () => {
        label = "Additional Amenities";

        property.verifyToolbarOptionBold(label, description);
        property.clickOnEditButton();

        property.verifyToolbarOptionItalic(label, description);
        property.clickOnEditButton();

        property.verifyInsertHyperlink(label, description, link);
        property.clickOnEditButton();
        property.verifyRemoveHyperlink(label, description, link);
    });
});

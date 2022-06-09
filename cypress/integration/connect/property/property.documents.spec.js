/// <reference types="Cypress" />
import { Property } from "../../pages/property";

const property = new Property();
var propertyId = " ";

describe("Property - View Documents", () => {
    before(() => {
        cy.loginToAdmin();
        cy.ensureTestProperty().then((testPropertyId) => {
            cy.log(testPropertyId);
            propertyId = testPropertyId;
        });
        cy.logoutFromAdmin();
    });

    beforeEach(() => {
        cy.beforeConnect();
        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnDocumentsTab();
    });

    after(() => {
        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnPhotos();
        property.deleteThePhotosUploaded();
    });

    it("Guest manual - Photos Select & upload, Generate Documnets, View Documents, Edit and Upload Documents", () => {
        //Click on photos button
        property.clickOnPhotosButton(1);
        //Select and Upload photo for Boiler
        property.uploadImageAndVerify(1);
        property.selectImageaAndVerify(1);
        //Upload Image for Thermostat
        property.uploadImageAndVerify(2);
        //Upload image for Fuse Box
        property.uploadImageAndVerify(3);
        //Upload image for WiFi Route
        property.uploadImageAndVerify(4);
        //Click Return button
        property.clickReturnButton();
        property.clickOnDocumentsTab();
        //Click Generate Button
        property.clickOnGenerateButton(1);
        //verify document generated
        var status = "Live";
        var type = "Generated";
        var name = "Guest Manual";
        property.verifyStatus(name, status);
        property.verifyType(name, type);
        //click view and verify
        property.clickViewButtonAndverify(1, propertyId);
        //navigate to property details page
        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnDocumentsTab();
        //Click Edit button and edit the document
        property.clickDocumentEditButton(1);
        const fileName = "test_pdf_file.pdf";
        property.editDocumentAndSave(fileName);
        //upload the document
        property.clickOnDocumentsTab();
        property.clickDocumentEditButton(1);
        const fileStatus = "Uploaded";
        property.clickOnFileStatusDropdownAndSelectOption(fileStatus);
        property.clickSaveButton();
        property.verifyType(name, fileStatus);
    });

    it("Key Instructions - Photos Select & upload, Generate Documnets, View Documents, Edit and Upload Documents", () => {
        //Click on photos bitton(Key Instructions )
        property.clickOnPhotosButton(2);
        //Select and Upload photo for Keys Up Close
        property.uploadImageAndVerify(1);
        property.selectImageaAndVerify(1);
        //Upload Image for Keys From Afar
        property.uploadImageAndVerify(2);
        //Upload image for Keys From Street
        property.uploadImageAndVerify(3);
        //Click Return button
        property.clickReturnButton();
        property.clickOnDocumentsTab();
        //Click Generate Button
        property.clickOnGenerateButton(2);
        //verify document generated
        var status = "Live";
        var type2 = "Generated";
        var docName = "Key Instructions";
        property.verifyStatus(docName, status);
        property.verifyType(docName, type2);
        //click view and verify
        property.clickViewButtonAndverify(1, propertyId);
        //navigate to property details page
        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnDocumentsTab();
        //Click Edit button and edit the document
        property.clickDocumentEditButton(2);
        const fileName = "test_pdf_file.pdf";
        property.editDocumentAndSave(fileName);
        //upload the document
        property.clickOnDocumentsTab();
        property.clickDocumentEditButton(2);
        const fileStatus = "Uploaded";
        property.clickOnFileStatusDropdownAndSelectOption(fileStatus);
        property.clickSaveButton();
        property.verifyType(docName, fileStatus);
    });
});

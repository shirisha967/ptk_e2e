import property from "../selectors/property";
import format from "date-fns/format";

const connectUrl = Cypress.env("connectUrl");

export class Property {
    navigateToThePropertyDetailsPage(propertyID) {
        cy.visit(connectUrl + "/properties/" + propertyID + "/");
    }

    clickOnPhotos() {
        cy.get(property.photosTab).click();
    }

    verifyUncategorizedPhotosCount(count) {
        cy.get(property.uncategorizedPhotosCount).invoke("text").then(parseFloat).should("be.gte", count);
    }

    deleteThePhotosUploaded() {
        cy.get(property.uncategorizedPhotosCount)
            .invoke("text")
            .then((count) => {
                for (var i = 1; i <= count; i++) {
                    //given 1 second wait to delete photo issue
                    cy.wait(1000);
                    cy.get(property.deleteButton).should("be.visible").click({ force: true });
                    cy.get(property.photosTab).click({ force: true });
                }
            });
    }

    selectImageResolution(option) {
        cy.get(property.photoSelectOption).select(option);
    }

    clickDownloadButton() {
        cy.get(property.downloadButton).should("be.visible").click();
    }

    clickOnSuperBlockTab() {
        cy.get(property.superBlocksTab).click();
        cy.get(property.addNewSuperBlockButton).should("be.visible");
    }

    clickOnAddSuperBlockButton() {
        cy.get(property.addNewSuperBlockButton).click();
    }

    enterStartDate(startDate) {
        cy.get(property.startDateField).clear().type(format(startDate, "dd/MM/yyyy"));
    }

    enterEndDate(endDate) {
        cy.get(property.enddateField).clear().type(format(endDate, "dd/MM/yyyy"));
    }

    enterNotes(note) {
        cy.get(property.notesTextField).clear().type(note);
    }

    clickSaveButton() {
        cy.get(property.saveButton).click();
    }

    enterSuperBlockInfo(startDate, endDate, note) {
        this.enterStartDate(startDate);
        this.enterEndDate(endDate);
        this.enterNotes(note);
        this.clickSaveButton();
    }

    verifySuperBlockInfo(startDate, endDate, note) {
        this.clickOnSuperBlockTab();
        cy.xpath('(//*[@id="super-blocks"]//table//thead//following::tbody//tr//td)[1]').should("contain", startDate);
        cy.xpath('(//*[@id="super-blocks"]//table//thead//following::tbody//tr//td)[2]').should("contain", endDate);
        cy.xpath('(//*[@id="super-blocks"]//table//thead//following::tbody//tr//td)[3]').should("contain", note);
    }

    clickEditButton() {
        cy.get(property.editButton).should("be.visible").click();
    }

    clickSuperBlockDeleteButton() {
        cy.get(property.superBlockDeleteButton).should("be.visible").click();
    }

    deleteExistingSuperblocks() {
        cy.document().then(($document) => {
            const documentResult = $document.querySelectorAll(
                '[id="super-blocks"] [class="btn btn-info btn-xs btn-block"]'
            );
            const count = documentResult.length;
            if (count > 0) {
                for (let i = 1; i <= count; i++) {
                    cy.xpath(
                        '(//div[@id="super-blocks"]//tr//td//a[@class="btn btn-info btn-xs btn-block"])[1]'
                    ).click();
                    this.clickSuperBlockDeleteButton();
                    this.clickOnSuperBlockTab();
                }
            }
        });
    }

    clickOnDocumentsTab() {
        cy.get(property.documentsTab).should("be.visible").click();
    }

    clickOnPhotosButton(index) {
        cy.xpath(property.photosButton.replace("index", index)).should("be.visible").click();
    }

    clickOnSelectButton(index) {
        cy.xpath('(//div[@class="c-button select"])[index]'.replace("index", index)).should("be.visible").click();
    }

    clickUploadButton(index) {
        cy.xpath('(//div[@class="c-button upload"])[index]'.replace("index", index))
            .should("be.visible")
            .click({ force: true });
    }

    clickOnSelectImageButton() {
        cy.xpath(property.selectImageButton).should("be.visible").click();
    }

    verifyImageSelected(src) {
        cy.get('[class="document-image"] img').should("have.attr", "src", src).should("be.visible");
    }

    selectImageaAndVerify(index) {
        this.clickOnSelectButton(index);
        cy.waitFor('[class="select-image"]');
        cy.xpath('(//div[@class="select-image"]/img)[1]')
            .invoke("attr", "src")
            .then((image) => {
                this.clickOnSelectImageButton();
                cy.wait(1000);
                this.verifyImageSelected(image);
            });
    }

    uploadImageAndVerify(index) {
        this.clickUploadButton(index);
        cy.waitFor('[name="file"]');
        cy.uploadFile("home.png", '[name="file"]');
        cy.get('[value="Upload"]').click();
        cy.wait(5000);
        cy.get('[class="document-image"] img').should("have.attr", "src");
    }

    clickReturnButton() {
        cy.xpath(property.returnButton).click();
    }

    clickOnGenerateButton(index) {
        cy.xpath('(//span[@class="glyphicon glyphicon-flash"]//parent::button)[index]'.replace("index", index)).click();
    }

    verifyStatus(name, status) {
        cy.xpath('(//tr//td[text()="name"]/following-sibling::td)[1]'.replace("name", name)).should(
            "have.text",
            status
        );
    }

    verifyType(name, type) {
        cy.xpath('(//tr//td[text()="name"]/following-sibling::td)[2]'.replace("name", name)).should("have.text", type);
    }

    clickViewButtonAndverify(index, propertyID) {
        cy.xpath('(//span[@class="glyphicon glyphicon-share-alt"])[index]'.replace("index", index)).click();
        cy.waitFor('[type="application/pdf"]');
        //  cy.get('[aria-controls="documents"]').should('not.be.visible');
    }

    clickDocumentEditButton(index) {
        cy.xpath(
            '(//div[@id="documents"]//tr//td//a//span[@class="glyphicon glyphicon-edit"])[index]'.replace(
                "index",
                index
            )
        ).click();
    }

    editDocumentAndSave(fileName) {
        cy.uploadFile(fileName, '[name="file"]');
        this.clickSaveButton();
    }

    clickOnFileStatusDropdownAndSelectOption(option) {
        cy.get(property.fileStatusDropdown).select(option, { force: true });
    }

    clickOnPropertyCalendarTab() {
        cy.get(property.propertyCalendarTab).should("be.visible").click();
    }

    openBookingOnPropertyCalendar(bookingName) {
        cy.xpath('//span[text()[normalize-space()="bookingName"]]'.replace("bookingName", bookingName)).click();
        cy.url().should("contain", "/bookings");
    }

    clickAddByoBookingButton() {
        cy.xpath(property.addByoBookingButton).should("be.visible").click();
    }

    verifyFaq() {
        cy.get('[href="#faq"]').click();
        cy.xpath(property.faqButton).click();
    }

    clickOnEditButton() {
        cy.xpath(property.faqButton).click();
    }

    verifyResultsOfProperty() {
        cy.xpath(property.property).invoke("removeAttr", "target").click();
    }

    clickOnSave() {
        cy.get(property.saveButton).click();
    }

    verifySaveChangesBold(label, text) {
        cy.xpath(property.updatedDescription.replace("label", label))
            .should("have.text", text)
            .should("have.descendants", "strong");
    }

    verifySaveChangesItalic(label, text) {
        cy.xpath(property.updatedDescription.replace("label", label))
            .should("have.text", text)
            .should("have.descendants", "em");
    }

    verifySaveChangesLink(label, text, link) {
        cy.xpath(property.updatedDescription.replace("label", label))
            .find("a")
            .contains(text)
            .should("have.attr", "href")
            .should("eq", link);
    }

    verifyToolbarOptionBold(label, text) {
        cy.xpath(property.textAreaLabel.replace("name", label))
            .parent()
            .within(() => {
                cy.get(".trumbowyg-editor")
                    .click()
                    .type("{movetoend}{selectall}{backspace}")
                    .type(text)
                    .type("{selectall}");
                cy.get(property.bold).click();
                cy.contains(text).should("have.prop", "tagName").should("eq", "STRONG"); // tagName is uppercase
            });
        this.clickOnSave();
        this.verifySaveChangesBold(label, text);
    }

    verifyToolbarOptionItalic(label, text) {
        cy.xpath(property.textAreaLabel.replace("name", label))
            .parent()
            .within(() => {
                cy.get(".trumbowyg-editor")
                    .click()
                    .type("{movetoend}{selectall}{backspace}")
                    .type(text)
                    .type("{selectall}");
                cy.get(property.italic).click();
                cy.contains(text).should("have.prop", "tagName").should("eq", "EM");
            });
        this.clickOnSave();
        this.verifySaveChangesItalic(label, text);
    }

    verifyInsertHyperlink(labelName, text, link) {
        cy.xpath(property.textAreaLabel.replace("name", labelName))
            .parent()
            .then((label) => {
                cy.wrap(label).find(".trumbowyg-editor").click().type("{movetoend}{selectall}{backspace}");
                cy.wrap(label).find(property.hyperlink).click();
                cy.wrap(label).find("div button").contains("Insert link").click({ force: true });
                cy.get(property.insertlinkModelBox)
                    .should("be.visible")
                    .within(() => {
                        cy.get(property.url).type(link);
                        cy.get(property.textField).type(text);
                        cy.get(property.confirmButton).click();
                        cy.xpath("//a").contains(text).should("have.attr", "href").should("eq", link);
                    });
                this.clickOnSave();
                this.verifySaveChangesLink(labelName, text, link);
            });
    }

    verifyRemoveHyperlink(labelName, text, link) {
        cy.xpath(property.textAreaLabel.replace("name", labelName))
            .parent()
            .then((label) => {
                cy.contains(text).type("{selectall}", { force: true });
                cy.wrap(label).find(property.hyperlink).click();
                cy.wrap(label).find("div button").contains("Remove link").click({ force: true });
                cy.xpath("//p").contains(text).should("not.have.descendants", "a");
                this.clickOnSave();
                cy.xpath(property.updatedDescription.replace("label", labelName))
                    .should("have.text", text)
                    .should("not.have.descendants", "a");
            });
    }
}

import header from "../selectors/header";
import selectors from "../selectors/services";
import format from "date-fns/format";
const testdata = require("../../fixtures/data.json");

export class Services {
    naviagteToServicesTab() {
        cy.get(header.servicesTab).click();
        cy.url().should("contain", "/services");
    }

    clickOnAddJobButton() {
        cy.get(selectors.addJobBtn).click();
    }

    enterJobDetails(propertyName, service, date, startTime, endTime, notes, provider, absorbCost, statusName) {
        this.selectTheProperty(propertyName);
        this.selectTheServices(service);
        this.selectTheDate(date);
        this.enterStartTime(startTime);
        this.enterEndTime(endTime);
        this.selectTheProvider(provider);
        this.enterNotes(notes);
        this.selectTheStatus(statusName);
    }

    verifyJobDetails(rowIndex, propertyName, service, startTime, endTime, notes) {
        cy.get(
            selectors.tableCell
                .replace("rowIndex", rowIndex)
                .replace("coloumnIndex", testdata.tableIndexes.jobs.Property)
        ).should("have.text", propertyName);
        cy.get(
            selectors.tableCell
                .replace("rowIndex", rowIndex)
                .replace("coloumnIndex", testdata.tableIndexes.jobs.Services)
        ).should("have.text", service[0]);
        cy.get(
            selectors.tableCell.replace("rowIndex", rowIndex).replace("coloumnIndex", testdata.tableIndexes.jobs.Start)
        ).should("have.text", startTime);
        cy.get(
            selectors.tableCell.replace("rowIndex", rowIndex).replace("coloumnIndex", testdata.tableIndexes.jobs.End)
        ).should("have.text", endTime);
        cy.get(
            selectors.tableCell.replace("rowIndex", rowIndex).replace("coloumnIndex", testdata.tableIndexes.jobs.Detail)
        ).should("contain", notes);
    }

    selectTheProperty(propertyName) {
        cy.get(selectors.propertyDropDown).click();
        cy.get(selectors.propertySearchBox).type(propertyName);
        cy.xpath(selectors.propertyOption.replace("propertyName", propertyName)).click();
        // cy.get(selectors.propertyDropDown).should('have.a.property', 'title', propertyName);
    }

    selectTheServices(service) {
        cy.get(selectors.servicesDropDown).click();
        for (let i = 0; i < service.length; i++) {
            cy.xpath(selectors.servicesOption.replace("service", service[i])).click();
        }
        cy.get(selectors.servicesDropDown).click();
    }

    selectTheDate(date) {
        cy.get(selectors.dateField).click().type(format(date, "dd/MM/yyyy"));
    }

    enterStartTime(time) {
        cy.get(selectors.startTime).type(time);
    }

    enterEndTime(time) {
        cy.get(selectors.endTime).type(time);
    }

    enterNotes(notes) {
        cy.get(selectors.notes).type(notes);
    }

    selectTheProvider(providerName) {
        cy.get(selectors.providerDropDown).click();
        cy.get(selectors.providerSearchBox).type(providerName);
        cy.xpath(selectors.providerOption.replace("providerName", providerName)).click();
        // cy.get(selectors.providerDropDown).should('have.a.property', 'title', providerName);
    }

    selectTheStatus(statusName) {
        cy.get(selectors.statusDropDown).click();
        cy.xpath(selectors.statusOption.replace("statusName", statusName)).click();
    }

    clickOnSaveButton() {
        cy.get(selectors.saveBtn).click();
    }

    getJobsTablesRowsCount() {
        return cy.get('[id="jobs_table"] tbody tr[role="row"]').its("length");
    }

    navigateToUploadPhotosLinkOfJob(rowIndex) {
        this.getJobsTablesRowsCount().then((rowCount) => {
            for (var i = 1; i <= rowCount; i++) {
                cy.get(
                    selectors.tableCell
                        .replace("rowIndex", i)
                        .replace("coloumnIndex", testdata.tableIndexes.jobs.Detail)
                ).then(($details) => {
                    if ($details.find("a").is(":visible")) {
                        cy.visit($details.find(" a").text(), { failOnStatusCode: false });
                    }
                });
            }
        });
    }

    uploadPhotos(fileName, count) {
        cy.get('[name="filepond"]').then(($uploader) => {
            for (var i = 1; i <= count; i++) {
                cy.uploadFile(fileName, $uploader);
                // Given 1 second wait for uploading a file to avoid one upload issue
                cy.wait(1000);
            }
        });
    }

    clickOnSubmit() {
        cy.get(selectors.submitPhotos).click({ timeout: 60000 });
    }

    clickOnConfirm() {
        cy.get(selectors.confirmPhotos).click();
    }

    verifyPhotosUploadConfirmationMessage() {
        cy.get(".photos-upload-message-container.active h5.title", { timeout: 60000 }).should(
            "have.text",
            "Thank you for submitting your photos"
        );
        cy.get(".photos-upload-message-container.active p.description").should(
            "have.text",
            "Your photos have now been submitted and will be reviewed by a member of staff shortly."
        );
    }
}

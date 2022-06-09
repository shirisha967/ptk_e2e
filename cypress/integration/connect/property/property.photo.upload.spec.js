/// <reference types="Cypress" />
import { Login } from "../../pages/login";
import { Services } from "../../pages/services";
import { Property } from "../../pages/property";
import addMonths from "date-fns/addMonths";
import { Header } from "../../pages/header";

const login = new Login();
const service = new Services();
const header = new Header();
const property = new Property();
var propertyId = " ";

describe("Services test cases", () => {
    before(() => {
        cy.loginToAdmin();
        cy.ensureThereIsAProvider();
        cy.ensureTestProperty().then((testPropertyId) => {
            cy.log(testPropertyId);
            propertyId = testPropertyId;
        });
        cy.logoutFromAdmin();
    });

    beforeEach(() => {
        cy.cleanUpOrphanedJobs();
        cy.beforeConnect();
        header.clickOnServices();
    });

    it("Create a photography job to test photography service", () => {
        const propertyName = Cypress.env("e2e_test_property_name");
        const provider = "e2eTestProviderPhotography";
        const date = addMonths(new Date(), 1);
        const startTime = "10:20";
        const endTime = "11:20";
        const services = ["Photography"];
        const notes = "This is job is created to test the job creation flow";
        const absorbCost = "True";
        const statusName = "Accepted";
        const fileName = "home.png";
        const option = "original";

        service.clickOnAddJobButton();
        service.enterJobDetails(
            propertyName,
            services,
            date,
            startTime,
            endTime,
            notes,
            provider,
            absorbCost,
            statusName
        );
        service.clickOnSaveButton();

        service.verifyJobDetails(1, propertyName, services, startTime, endTime, notes);

        service.navigateToUploadPhotosLinkOfJob(1);
        service.uploadPhotos(fileName, 8);
        service.clickOnSubmit();
        service.clickOnConfirm();

        service.verifyPhotosUploadConfirmationMessage();

        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnPhotos();
        property.verifyUncategorizedPhotosCount(8);
        //Download photos and verify
        property.selectImageResolution(option);
        property.clickDownloadButton();
        cy.verifyFileDownload(option + ".zip");
        //Delete the photos uploaded
        property.deleteThePhotosUploaded();
    });
});

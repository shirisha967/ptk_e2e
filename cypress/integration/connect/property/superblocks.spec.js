import addMonths from "date-fns/addMonths";
import { Property } from "../../pages/property";
import { Login } from "../../pages/login";
import format from "date-fns/format";

const property = new Property();
const login = new Login();
var propertyId = " ";

describe("Services test cases", () => {
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
    });

    it("Create , Edit and Delete the Super block", () => {
        let startDate = addMonths(new Date(), 1);
        let endDate = addMonths(new Date(), 2);
        let note = "This is created for testing purpose";
        //Click on super block tab
        property.clickOnSuperBlockTab();
        //Delete existing superblocks if any present
        property.deleteExistingSuperblocks();
        //click on add superr block button and fill the details
        property.clickOnAddSuperBlockButton();
        property.enterSuperBlockInfo(startDate, endDate, note);
        //verify syper block information
        property.verifySuperBlockInfo(format(startDate, "d MMM yyyy"), format(endDate, "d MMM yyyy"), note);
        //click on Edit option and edit the details
        property.clickEditButton();
        property.enterSuperBlockInfo(startDate, endDate, note);
        property.clickOnSuperBlockTab();
        property.verifySuperBlockInfo(format(startDate, "d MMM yyyy"), format(endDate, "d MMM yyyy"), note);
        //Delete the super block
        property.clickEditButton();
        property.clickSuperBlockDeleteButton();
    });
});

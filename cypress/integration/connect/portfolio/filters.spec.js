import { Portfolio } from "../../pages/portfolio";
const portfolio = new Portfolio();
describe("Filters", () => {
    beforeEach(() => {
        cy.beforeConnect();
        portfolio.navigateToPortfolioTab();
    });

    it("Filter based on Availability(Part Time)", () => {
        let availability = "Part Time";
        portfolio.clickOnAvailabilityDropdown();
        portfolio.selectOptionFromDropdown(availability);
        portfolio.verifyResults(availability);
    });

    it("Filter based on Availability(Full Time)", () => {
        let availability = "Full Time";
        portfolio.clickOnAvailabilityDropdown();
        portfolio.selectOptionFromDropdown(availability);
        portfolio.verifyResults(availability);
    });

    it("Filter based on Availability Window(Unavailable by default)", () => {
        let availabilityWindow = "Unavailable By Default";
        portfolio.clickOnAvailabilityWindowDropdown();
        portfolio.selectOptionFromDropdown(availabilityWindow);
        portfolio.verifyResultsWhenFilterByAvailabilityWindow(availabilityWindow);
    });

    it("Filter based on Availability Window(Available For Next 3 Months)", () => {
        let availabilityWindow = "Available For Next 3 Months";
        portfolio.clickOnAvailabilityWindowDropdown();
        portfolio.selectOptionFromDropdown(availabilityWindow);
        portfolio.verifyResultsWhenFilterByAvailabilityWindow(availabilityWindow);
    });

    it("Filter based on Account manager", () => {
        let accountManager = "Ian Brooks";
        portfolio.clickOnAccountManagerDropdown();
        portfolio.selectOptionFromDropdown(accountManager);
        portfolio.verifyResultsWhenFilterByAccountManager("Ian");
    });

    it("Filter based on Price Source", () => {
        let priceSource = "Airbnb (PriceLabs)";
        portfolio.clickOnPriceSourceDropdown();
        portfolio.selectOptionFromDropdown(priceSource);
        portfolio.verifyResultsWhenFilterByPriceSource("(Prices managed by PriceLabs)");
    });
});

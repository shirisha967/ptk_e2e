export default {
    addJobBtn: '[data-test="services-add-job"]',
    propertyDropDown: '[data-id="id_property"]',
    propertySearchBox: "#div_id_property > .controls > .btn-group > .open > .bs-searchbox > .form-control",
    propertyOption: '//span[text()[normalize-space()="propertyName"]]',
    servicesDropDown: '[data-id="id_services"]',
    servicesOption: '//span[text()[normalize-space()="service"]]',
    dateField: "#id_date",
    startTime: "#id_start_time",
    endTime: "#id_end_time",
    providerDropDown: '[data-id="id_provider"]',
    providerSearchBox: "#div_id_provider .controls  .btn-group  .open  .bs-searchbox  .form-control",
    providerOption: '//span[contains(text(), "providerName")]',
    notes: "#id_notes",
    statusDropDown: '[data-id="id_status"]',
    statusOption: '//span[text()="statusName"]',
    saveBtn: "#submit-save",
    services: '[for="id_services"]',
    photoUploadLink: '//a[contains(text(), "photos/upload/")]',
    fileUpload: "#filepond",
    tableCell: "tbody tr:nth-child(rowIndex) td:nth-child(coloumnIndex)",
    submitPhotos: ".submit-card button.submit-button",
    confirmPhotos: "#confirmModal #submit-button",
};

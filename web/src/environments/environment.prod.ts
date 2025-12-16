export const environment = {
  production: true,
  features: {
    onPush: {
      // По умолчанию выключено: включать постепенно после проверки в dev/stage.
      menu: false,
      projectLi: false,
      pagination: false,
      filter: false,
      loginoff: false,
      dialogs: false,
      modal: false,
      progress: false,
      fileEditor: false,
      documentUploader: false,
      dropdown: false,
      selectCatalog: false,
      dateInput: false,
      datePeriod: false,
      checkbox: false,
      documentList: false,
      pdfViewer: false,
      timeInput: false,
      numberRange: false,
      passwordInput: false
    }
  }
};

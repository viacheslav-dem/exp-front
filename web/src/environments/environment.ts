// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  features: {
    onPush: {
      // Включаем в dev для обкатки. Для безопасного rollout в prod держим false (см. environment.prod.ts).
      menu: true,
      projectLi: true,
      pagination: true,
      filter: true,
      loginoff: true,
      dialogs: true,
      modal: true,
      progress: true,
      fileEditor: true,
      documentUploader: true,
      dropdown: true,
      selectCatalog: true,
      dateInput: true,
      datePeriod: true,
      checkbox: true,
      documentList: true,
      pdfViewer: true,
      timeInput: true,
      numberRange: true,
      passwordInput: true
    }
  }
};

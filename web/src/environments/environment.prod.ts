export const environment = {
  production: true,
  features: {
    onPush: {
      // Prod по умолчанию: выключено. Включать постепенно по группам и пересобирать WAR.
      enabled: true,
      groups: {
        coreShell: false,
        dialogs: false,
        listsAndFilters: false,
        commonControls: false,
        fileAndPdf: false,
        catalogsAdmin: false,
        projectFlow: false,
        listsAndInfo: false,
        projectDetail: false,
        meetings: false,
        search: false,
        dataManagement: false,
        stats: false,
        settings: false,
        history: false
      }
    }
  }
};

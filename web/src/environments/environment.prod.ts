export const environment = {
  production: true,
  features: {
    onPush: {
      // Prod по умолчанию: выключено. Включать постепенно по группам и пересобирать WAR.
      enabled: true,
      groups: {
        coreShell: true,
        dialogs: true,
        listsAndFilters: true,
        commonControls: true,
        fileAndPdf: true,
        catalogsAdmin: true,
        projectFlow: true,
        listsAndInfo: true,
        projectDetail: true,
        meetings: true,
        search: true,
        dataManagement: true,
        stats: true,
        settings: true,
        history: true
      }
    }
  }
};

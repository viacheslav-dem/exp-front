// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  features: {
    onPush: {
      // Групповые флаги: не раздуваем environment 200+ ключами.
      // Dev: включено для обкатки. Prod: включать постепенно по группам (см. environment.prod.ts).
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

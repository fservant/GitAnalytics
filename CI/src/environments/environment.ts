// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDtPErxE8ob3bR0k3E2iJF1aNVfpnq9Skk",
    authDomain: "continuous-integration-a9f3c.firebaseapp.com",
    databaseURL: "https://continuous-integration-a9f3c.firebaseio.com",
    projectId: "continuous-integration-a9f3c",
    storageBucket: "continuous-integration-a9f3c.appspot.com",
    messagingSenderId: "821526453812"
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
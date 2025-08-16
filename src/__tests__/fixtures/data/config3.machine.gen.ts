


  /**
   * 
   * ### Author
   * 
   * chlbri (bri_lvi@icloud.com)
   * 
   * [My GitHub](https://github.com/chlbri?tab=repositories)
   * 
   * <br/>
   * 
   * ### Documentation
   *
   * Link to machine lib [here](https://www.npmjs.com/package/@bemedev/app-ts).
   * 
   * Link to this lib [here](https://www.npmjs.com/package/@bemedev/app-cli)
   *
   * 
   * This file is auto-generated. Do not edit manually.
   */
  export const __tsSchemas = {} as {
  "config3": {
    "initial": [
      "idle",
      "authenticating",
      "authenticated",
      "loggedOut"
    ],
    "targets": [
      "/idle",
      "/authenticating",
      "/authenticating/credentials",
      "/authenticating/credentials/gathering",
      "/authenticating/credentials/validating",
      "/authenticating/credentials/validating/pending",
      "/authenticating/credentials/validating/success",
      "/authenticating/credentials/validating/failure",
      "/authenticating/session",
      "/authenticated",
      "/authenticated/active",
      "/authenticated/idle",
      "/loggedOut"
    ],
    "states": {
      "idle": {
        "targets": [
          "/",
          "/authenticating",
          "/authenticating/credentials",
          "/authenticating/credentials/gathering",
          "/authenticating/credentials/validating",
          "/authenticating/credentials/validating/pending",
          "/authenticating/credentials/validating/success",
          "/authenticating/credentials/validating/failure",
          "/authenticating/session",
          "/authenticated",
          "/authenticated/active",
          "/authenticated/idle",
          "/loggedOut"
        ]
      },
      "authenticating": {
        "targets": [
          "/",
          "/idle",
          "/authenticating/credentials",
          "/authenticating/credentials/gathering",
          "/authenticating/credentials/validating",
          "/authenticating/credentials/validating/pending",
          "/authenticating/credentials/validating/success",
          "/authenticating/credentials/validating/failure",
          "/authenticating/session",
          "/authenticated",
          "/authenticated/active",
          "/authenticated/idle",
          "/loggedOut"
        ],
        "states": {
          "credentials": {
            "initial": [
              "gathering",
              "validating"
            ],
            "targets": [
              "/",
              "/idle",
              "/authenticating",
              "/authenticating/credentials/gathering",
              "/authenticating/credentials/validating",
              "/authenticating/credentials/validating/pending",
              "/authenticating/credentials/validating/success",
              "/authenticating/credentials/validating/failure",
              "/authenticating/session",
              "/authenticated",
              "/authenticated/active",
              "/authenticated/idle",
              "/loggedOut"
            ],
            "states": {
              "gathering": {
                "targets": [
                  "/",
                  "/idle",
                  "/authenticating",
                  "/authenticating/credentials",
                  "/authenticating/credentials/validating",
                  "/authenticating/credentials/validating/pending",
                  "/authenticating/credentials/validating/success",
                  "/authenticating/credentials/validating/failure",
                  "/authenticating/session",
                  "/authenticated",
                  "/authenticated/active",
                  "/authenticated/idle",
                  "/loggedOut"
                ]
              },
              "validating": {
                "initial": [
                  "pending",
                  "success",
                  "failure"
                ],
                "targets": [
                  "/",
                  "/idle",
                  "/authenticating",
                  "/authenticating/credentials",
                  "/authenticating/credentials/gathering",
                  "/authenticating/credentials/validating/pending",
                  "/authenticating/credentials/validating/success",
                  "/authenticating/credentials/validating/failure",
                  "/authenticating/session",
                  "/authenticated",
                  "/authenticated/active",
                  "/authenticated/idle",
                  "/loggedOut"
                ],
                "states": {
                  "pending": {
                    "targets": [
                      "/",
                      "/idle",
                      "/authenticating",
                      "/authenticating/credentials",
                      "/authenticating/credentials/gathering",
                      "/authenticating/credentials/validating",
                      "/authenticating/credentials/validating/success",
                      "/authenticating/credentials/validating/failure",
                      "/authenticating/session",
                      "/authenticated",
                      "/authenticated/active",
                      "/authenticated/idle",
                      "/loggedOut"
                    ]
                  },
                  "success": {
                    "targets": [
                      "/",
                      "/idle",
                      "/authenticating",
                      "/authenticating/credentials",
                      "/authenticating/credentials/gathering",
                      "/authenticating/credentials/validating",
                      "/authenticating/credentials/validating/pending",
                      "/authenticating/credentials/validating/failure",
                      "/authenticating/session",
                      "/authenticated",
                      "/authenticated/active",
                      "/authenticated/idle",
                      "/loggedOut"
                    ]
                  },
                  "failure": {
                    "targets": [
                      "/",
                      "/idle",
                      "/authenticating",
                      "/authenticating/credentials",
                      "/authenticating/credentials/gathering",
                      "/authenticating/credentials/validating",
                      "/authenticating/credentials/validating/pending",
                      "/authenticating/credentials/validating/success",
                      "/authenticating/session",
                      "/authenticated",
                      "/authenticated/active",
                      "/authenticated/idle",
                      "/loggedOut"
                    ]
                  }
                }
              }
            }
          },
          "session": {
            "targets": [
              "/",
              "/idle",
              "/authenticating",
              "/authenticating/credentials",
              "/authenticating/credentials/gathering",
              "/authenticating/credentials/validating",
              "/authenticating/credentials/validating/pending",
              "/authenticating/credentials/validating/success",
              "/authenticating/credentials/validating/failure",
              "/authenticated",
              "/authenticated/active",
              "/authenticated/idle",
              "/loggedOut"
            ]
          }
        }
      },
      "authenticated": {
        "initial": [
          "active",
          "idle"
        ],
        "targets": [
          "/",
          "/idle",
          "/authenticating",
          "/authenticating/credentials",
          "/authenticating/credentials/gathering",
          "/authenticating/credentials/validating",
          "/authenticating/credentials/validating/pending",
          "/authenticating/credentials/validating/success",
          "/authenticating/credentials/validating/failure",
          "/authenticating/session",
          "/authenticated/active",
          "/authenticated/idle",
          "/loggedOut"
        ],
        "states": {
          "active": {
            "targets": [
              "/",
              "/idle",
              "/authenticating",
              "/authenticating/credentials",
              "/authenticating/credentials/gathering",
              "/authenticating/credentials/validating",
              "/authenticating/credentials/validating/pending",
              "/authenticating/credentials/validating/success",
              "/authenticating/credentials/validating/failure",
              "/authenticating/session",
              "/authenticated",
              "/authenticated/idle",
              "/loggedOut"
            ]
          },
          "idle": {
            "targets": [
              "/",
              "/idle",
              "/authenticating",
              "/authenticating/credentials",
              "/authenticating/credentials/gathering",
              "/authenticating/credentials/validating",
              "/authenticating/credentials/validating/pending",
              "/authenticating/credentials/validating/success",
              "/authenticating/credentials/validating/failure",
              "/authenticating/session",
              "/authenticated",
              "/authenticated/active",
              "/loggedOut"
            ]
          }
        }
      },
      "loggedOut": {
        "targets": [
          "/",
          "/idle",
          "/authenticating",
          "/authenticating/credentials",
          "/authenticating/credentials/gathering",
          "/authenticating/credentials/validating",
          "/authenticating/credentials/validating/pending",
          "/authenticating/credentials/validating/success",
          "/authenticating/credentials/validating/failure",
          "/authenticating/session",
          "/authenticated",
          "/authenticated/active",
          "/authenticated/idle"
        ]
      }
    }
  }
};
  
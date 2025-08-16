


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
  "config1": {
    "initial": [
      "idle",
      "didi",
      "working",
      "final"
    ],
    "targets": [
      "/idle",
      "/didi",
      "/working",
      "/working/fetch",
      "/working/fetch/idle",
      "/working/fetch/fetch",
      "/working/ui",
      "/working/ui/idle",
      "/working/ui/input",
      "/working/ui/input/data",
      "/working/ui/final",
      "/final"
    ],
    "states": {
      "idle": {
        "targets": [
          "/",
          "/didi",
          "/working",
          "/working/fetch",
          "/working/fetch/idle",
          "/working/fetch/fetch",
          "/working/ui",
          "/working/ui/idle",
          "/working/ui/input",
          "/working/ui/input/data",
          "/working/ui/final",
          "/final"
        ]
      },
      "didi": {
        "targets": [
          "/",
          "/idle",
          "/working",
          "/working/fetch",
          "/working/fetch/idle",
          "/working/fetch/fetch",
          "/working/ui",
          "/working/ui/idle",
          "/working/ui/input",
          "/working/ui/input/data",
          "/working/ui/final",
          "/final"
        ]
      },
      "working": {
        "targets": [
          "/",
          "/idle",
          "/didi",
          "/working/fetch",
          "/working/fetch/idle",
          "/working/fetch/fetch",
          "/working/ui",
          "/working/ui/idle",
          "/working/ui/input",
          "/working/ui/input/data",
          "/working/ui/final",
          "/final"
        ],
        "states": {
          "fetch": {
            "initial": [
              "idle",
              "fetch"
            ],
            "targets": [
              "/",
              "/idle",
              "/didi",
              "/working",
              "/working/fetch/idle",
              "/working/fetch/fetch",
              "/working/ui",
              "/working/ui/idle",
              "/working/ui/input",
              "/working/ui/input/data",
              "/working/ui/final",
              "/final"
            ],
            "states": {
              "idle": {
                "targets": [
                  "/",
                  "/idle",
                  "/didi",
                  "/working",
                  "/working/fetch",
                  "/working/fetch/fetch",
                  "/working/ui",
                  "/working/ui/idle",
                  "/working/ui/input",
                  "/working/ui/input/data",
                  "/working/ui/final",
                  "/final"
                ]
              },
              "fetch": {
                "targets": [
                  "/",
                  "/idle",
                  "/didi",
                  "/working",
                  "/working/fetch",
                  "/working/fetch/idle",
                  "/working/ui",
                  "/working/ui/idle",
                  "/working/ui/input",
                  "/working/ui/input/data",
                  "/working/ui/final",
                  "/final"
                ]
              }
            }
          },
          "ui": {
            "initial": [
              "idle",
              "input",
              "final"
            ],
            "targets": [
              "/",
              "/idle",
              "/didi",
              "/working",
              "/working/fetch",
              "/working/fetch/idle",
              "/working/fetch/fetch",
              "/working/ui/idle",
              "/working/ui/input",
              "/working/ui/input/data",
              "/working/ui/final",
              "/final"
            ],
            "states": {
              "idle": {
                "targets": [
                  "/",
                  "/idle",
                  "/didi",
                  "/working",
                  "/working/fetch",
                  "/working/fetch/idle",
                  "/working/fetch/fetch",
                  "/working/ui",
                  "/working/ui/input",
                  "/working/ui/input/data",
                  "/working/ui/final",
                  "/final"
                ]
              },
              "input": {
                "initial": [
                  "data"
                ],
                "targets": [
                  "/",
                  "/idle",
                  "/didi",
                  "/working",
                  "/working/fetch",
                  "/working/fetch/idle",
                  "/working/fetch/fetch",
                  "/working/ui",
                  "/working/ui/idle",
                  "/working/ui/input/data",
                  "/working/ui/final",
                  "/final"
                ],
                "states": {
                  "data": {
                    "targets": [
                      "/",
                      "/idle",
                      "/didi",
                      "/working",
                      "/working/fetch",
                      "/working/fetch/idle",
                      "/working/fetch/fetch",
                      "/working/ui",
                      "/working/ui/idle",
                      "/working/ui/input",
                      "/working/ui/final",
                      "/final"
                    ]
                  }
                }
              },
              "final": {
                "targets": [
                  "/",
                  "/idle",
                  "/didi",
                  "/working",
                  "/working/fetch",
                  "/working/fetch/idle",
                  "/working/fetch/fetch",
                  "/working/ui",
                  "/working/ui/idle",
                  "/working/ui/input",
                  "/working/ui/input/data",
                  "/final"
                ]
              }
            }
          }
        }
      },
      "final": {
        "targets": [
          "/",
          "/idle",
          "/didi",
          "/working",
          "/working/fetch",
          "/working/fetch/idle",
          "/working/fetch/fetch",
          "/working/ui",
          "/working/ui/idle",
          "/working/ui/input",
          "/working/ui/input/data",
          "/working/ui/final"
        ]
      }
    }
  }
};
  
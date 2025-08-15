
  /**
   * This file is auto-generated. Do not edit manually.
   */

  export const __tsSchemas = {
  "config2": {
    "initial": [
      "red",
      "yellow",
      "green",
      "maintenance"
    ],
    "targets": [
      "/red",
      "/yellow",
      "/green",
      "/green/walk",
      "/green/noWalk",
      "/maintenance",
      "/maintenance/diagnostics",
      "/maintenance/diagnostics/lightTest",
      "/maintenance/diagnostics/sensorTest",
      "/maintenance/logging"
    ],
    "states": {
      "red": {
        "targets": [
          "/",
          "/yellow",
          "/green",
          "/green/walk",
          "/green/noWalk",
          "/maintenance",
          "/maintenance/diagnostics",
          "/maintenance/diagnostics/lightTest",
          "/maintenance/diagnostics/sensorTest",
          "/maintenance/logging"
        ]
      },
      "yellow": {
        "targets": [
          "/",
          "/red",
          "/green",
          "/green/walk",
          "/green/noWalk",
          "/maintenance",
          "/maintenance/diagnostics",
          "/maintenance/diagnostics/lightTest",
          "/maintenance/diagnostics/sensorTest",
          "/maintenance/logging"
        ]
      },
      "green": {
        "initial": [
          "walk",
          "noWalk"
        ],
        "targets": [
          "/",
          "/red",
          "/yellow",
          "/green/walk",
          "/green/noWalk",
          "/maintenance",
          "/maintenance/diagnostics",
          "/maintenance/diagnostics/lightTest",
          "/maintenance/diagnostics/sensorTest",
          "/maintenance/logging"
        ],
        "states": {
          "walk": {
            "targets": [
              "/",
              "/red",
              "/yellow",
              "/green",
              "/green/noWalk",
              "/maintenance",
              "/maintenance/diagnostics",
              "/maintenance/diagnostics/lightTest",
              "/maintenance/diagnostics/sensorTest",
              "/maintenance/logging"
            ]
          },
          "noWalk": {
            "targets": [
              "/",
              "/red",
              "/yellow",
              "/green",
              "/green/walk",
              "/maintenance",
              "/maintenance/diagnostics",
              "/maintenance/diagnostics/lightTest",
              "/maintenance/diagnostics/sensorTest",
              "/maintenance/logging"
            ]
          }
        }
      },
      "maintenance": {
        "targets": [
          "/",
          "/red",
          "/yellow",
          "/green",
          "/green/walk",
          "/green/noWalk",
          "/maintenance/diagnostics",
          "/maintenance/diagnostics/lightTest",
          "/maintenance/diagnostics/sensorTest",
          "/maintenance/logging"
        ],
        "states": {
          "diagnostics": {
            "initial": [
              "lightTest",
              "sensorTest"
            ],
            "targets": [
              "/",
              "/red",
              "/yellow",
              "/green",
              "/green/walk",
              "/green/noWalk",
              "/maintenance",
              "/maintenance/diagnostics/lightTest",
              "/maintenance/diagnostics/sensorTest",
              "/maintenance/logging"
            ],
            "states": {
              "lightTest": {
                "targets": [
                  "/",
                  "/red",
                  "/yellow",
                  "/green",
                  "/green/walk",
                  "/green/noWalk",
                  "/maintenance",
                  "/maintenance/diagnostics",
                  "/maintenance/diagnostics/sensorTest",
                  "/maintenance/logging"
                ]
              },
              "sensorTest": {
                "targets": [
                  "/",
                  "/red",
                  "/yellow",
                  "/green",
                  "/green/walk",
                  "/green/noWalk",
                  "/maintenance",
                  "/maintenance/diagnostics",
                  "/maintenance/diagnostics/lightTest",
                  "/maintenance/logging"
                ]
              }
            }
          },
          "logging": {
            "targets": [
              "/",
              "/red",
              "/yellow",
              "/green",
              "/green/walk",
              "/green/noWalk",
              "/maintenance",
              "/maintenance/diagnostics",
              "/maintenance/diagnostics/lightTest",
              "/maintenance/diagnostics/sensorTest"
            ]
          }
        }
      }
    }
  }
} as const;
  
import config from "@config/test-config.json";

export const waits = config.WAITS;

export const timeouts = {
  test: waits.SMALL + waits.MEDIUM + waits.LARGE,
  expect: waits.MEDIUM,
  action: waits.MEDIUM,
  navigation: waits.LARGE,
  apiServerStartup: waits.MAXIMUM,
  uiServerStartup: waits.MAXIMUM + waits.LARGE * 2,
} as const;

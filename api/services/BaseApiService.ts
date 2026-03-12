import type { APIRequestContext } from "@playwright/test";

import { logger, type Logger } from "@utils/common/Logger";

export class BaseApiService {
  public static readonly routes = {
    health: "/health",
    token: "/token",
    folders: "/folders",
    folder: (folderId: string) => `/folders/${folderId}`,
  } as const;

  protected readonly logger: Logger;
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.logger = logger.withScope(`api.${this.constructor.name}`);
  }
}

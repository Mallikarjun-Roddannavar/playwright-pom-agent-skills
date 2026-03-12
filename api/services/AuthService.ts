import type { APIResponse } from "@playwright/test";

import { BaseApiService } from "@api/services/BaseApiService";

export class AuthService extends BaseApiService {
  async getAccessToken(username: string, password: string): Promise<APIResponse> {
    this.logger.info("Requesting access token", { username });

    const response = await this.request.post(AuthService.routes.token, {
      form: {
        username,
        password,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    this.logger.info("Access token response received", {
      username,
      status: response.status(),
      ok: response.ok(),
    });

    return response;
  }
}

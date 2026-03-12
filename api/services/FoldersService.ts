import type { APIResponse } from "@playwright/test";

import { BaseApiService } from "@api/services/BaseApiService";

export type FolderResponse = {
  id: string;
  name: string;
  owner: string;
  createdAt: string;
  files: Array<{
    id: string;
    name: string;
  }>;
};

export class FoldersService extends BaseApiService {
  async list(): Promise<APIResponse> {
    this.logger.info("Listing folders");
    const response = await this.request.get(FoldersService.routes.folders);
    this.logger.info("List folders response received", {
      status: response.status(),
      ok: response.ok(),
    });
    return response;
  }

  async create(name: string): Promise<APIResponse> {
    this.logger.info("Creating folder", { name });
    const response = await this.request.post(FoldersService.routes.folders, {
      data: { name },
    });
    this.logger.info("Create folder response received", {
      name,
      status: response.status(),
      ok: response.ok(),
    });
    return response;
  }

  async remove(folderId: string): Promise<APIResponse> {
    this.logger.info("Deleting folder", { folderId });
    const response = await this.request.delete(FoldersService.routes.folder(folderId));
    this.logger.info("Delete folder response received", {
      folderId,
      status: response.status(),
      ok: response.ok(),
    });
    return response;
  }
}

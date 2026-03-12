import path from "node:path";

import { FoldersService } from "@api/services/FoldersService";
import { HomePage } from "@pages/HomePage";
import { folderName } from "@utils/common/CommonUtils";
import { test, expect, type Cleanup } from "@utils/fixtures/TestFixtures";
import type { APIRequestContext, Page } from "@playwright/test";

type CreatedFolderResponse = {
  id: string;
};

type UploadScenario = {
  roleName: "admin" | "editor";
  page: Page;
  createRequest: APIRequestContext;
  cleanupRequest: APIRequestContext;
  cleanup: Cleanup;
};

const uploadFilePath = path.resolve(process.cwd(), "ui", "test-data", "ui-fil-02-upload.txt");
const uploadedFileDisplayName = path.parse(uploadFilePath).name;

async function expectRoleCanUploadFile({
  roleName,
  page,
  createRequest,
  cleanupRequest,
  cleanup,
}: UploadScenario): Promise<void> {
  const name = folderName(`ui-fil-02-${roleName}`);
  const createFoldersService = new FoldersService(createRequest);
  const cleanupFoldersService = new FoldersService(cleanupRequest);

  const createResponse = await createFoldersService.create(name);
  expect(createResponse.ok()).toBeTruthy();
  const createdFolder = (await createResponse.json()) as CreatedFolderResponse;

  cleanup.add(async () => {
    const deleteResponse = await cleanupFoldersService.remove(createdFolder.id);
    expect(deleteResponse.ok()).toBeTruthy();
  });

  const homePage = new HomePage(page);
  await homePage.goto();
  const foldersPage = await homePage.openFolders();
  await expect(foldersPage.folderName(name)).toBeVisible();

  const folderFilesPage = await foldersPage.openFolder(createdFolder.id);
  await folderFilesPage.uploadFile(uploadFilePath);

  await expect(folderFilesPage.uploadSuccessToast).toBeVisible();
  await expect(folderFilesPage.uploadedFileName(uploadedFileDisplayName)).toBeVisible();
}

test.describe("Files", () => {
  test("editor can upload a file to a folder", async ({
    editorPage,
    editorRequest,
    adminRequest,
    cleanup,
  }) => {
    await expectRoleCanUploadFile({
      roleName: "editor",
      page: editorPage,
      createRequest: editorRequest,
      cleanupRequest: adminRequest,
      cleanup,
    });
  });

  test("admin can upload a file to a folder", async ({
    adminPage,
    adminRequest,
    cleanup,
  }) => {
    await expectRoleCanUploadFile({
      roleName: "admin",
      page: adminPage,
      createRequest: adminRequest,
      cleanupRequest: adminRequest,
      cleanup,
    });
  });
});

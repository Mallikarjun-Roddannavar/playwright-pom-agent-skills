import { FoldersService, type FolderResponse } from "@api/services/FoldersService";
import { HomePage } from "@pages/HomePage";
import { folderName } from "@utils/common/CommonUtils";
import { test, expect } from "@utils/fixtures/TestFixtures";

test("admin creates folder and viewer can see it after refresh", async ({
  adminPage,
  viewerPage,
  adminRequest,
  cleanup,
}) => {
  const name = folderName("ui-multi-role");
  const adminHomePage = new HomePage(adminPage);
  const viewerHomePage = new HomePage(viewerPage);

  await adminHomePage.goto();
  const adminFoldersPage = await adminHomePage.openFolders();
  await adminFoldersPage.createFolder(name);

  const adminFoldersService = new FoldersService(adminRequest);
  const listResponse = await adminFoldersService.list();

  if (!listResponse.ok()) {
    throw new Error(`Test setup failed: could not list folders`);
  }

  const folders = (await listResponse.json()) as FolderResponse[];
  const createdFolderId = folders.find((folder) => folder.name === name)?.id;

  if (!createdFolderId) {
    throw new Error(`Test setup failed: could not find created folder ${name}`);
  }

  cleanup.add(async () => {
    await adminFoldersService.remove(createdFolderId);
  });

  await viewerHomePage.goto();
  const viewerFoldersPage = await viewerHomePage.openFolders();
  await viewerFoldersPage.refreshButton.click();
  await expect(viewerFoldersPage.folderName(name)).toBeVisible();
});

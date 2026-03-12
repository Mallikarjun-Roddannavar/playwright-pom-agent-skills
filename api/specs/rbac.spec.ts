import { FoldersService } from "@api/services/FoldersService";
import { folderName } from "@utils/common/CommonUtils";
import { test, expect } from "@utils/fixtures/TestFixtures";

test("viewer cannot create folder, editor can create, admin can delete", async ({
  viewerRequest,
  editorRequest,
  adminRequest,
  cleanup,
}) => {
  const name = folderName("api-rbac");
  const viewerFoldersService = new FoldersService(viewerRequest);
  const editorFoldersService = new FoldersService(editorRequest);
  const adminFoldersService = new FoldersService(adminRequest);

  const viewerCreate = await viewerFoldersService.create(name);
  expect(viewerCreate.status()).toBe(403);

  const editorCreate = await editorFoldersService.create(name);
  expect(editorCreate.ok()).toBeTruthy();
  const created = (await editorCreate.json()) as { id: string };

  cleanup.add(async () => {
    const adminDelete = await adminFoldersService.remove(created.id);
    expect(adminDelete.ok()).toBeTruthy();
  });
});

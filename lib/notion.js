import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (databaseId) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    // page_size: 100, // 最大100のページを取得します。
  });

  // 各ページの詳細を取得
  const enrichedData = await Promise.all(
    response.results.map(async (page) => {
      const pageDetails = await notion.pages.retrieve({ page_id: page.id });
      return pageDetails;
    })
  );

  return enrichedData;
};

export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId) => {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};

export const getHomeData = async () => {
  return await getDatabase(process.env.NOTION_HOME_DB_ID);
};

export const getMembersData = async () => {
  return await getDatabase(process.env.NOTION_MEMBERS_DB_ID);
};

export const getProjectsData = async () => {
  return await getDatabase(process.env.NOTION_PROJECTS_DB_ID);
};

import Head from "next/head";
import Link from "next/link";
import { getProjectsData } from "../../lib/notion"; // ここを変更
import { Text } from "./[id].js";
import styles from "../index.module.css"; // 必要に応じてスタイルを調整

export const databaseId = process.env.NOTION_PROJECTS_DB_ID; // ここを変更

export default function Projects({ posts }) {
  console.log(posts.map((post) => post.properties));
  return (
    <div>
      <Head>
        <title>Notion Next.js Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          {/* ロゴなどのコードは省略 */}
          <h1 className="text-purple-500">
            Next.js + Notion API Projects page
          </h1>
          <p>Projectの情報をNotionと連携して表示します。</p>
          <Link href="/">
            <a className="text-lg text-green-500"> Go to home</a>
          </Link>
        </header>

        <h2 className={styles.heading}>All Projects</h2>
        <ol className={styles.posts}>
          {posts.map((post) => {
            const date = new Date(post.last_edited_time).toLocaleString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            );
            const memberDate = post.properties.Date.date.start; // 日付を取得
            return (
              <li key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/members/${post.id}`}>
                    <a>
                      <Text text={post.properties.Name.title} />
                    </a>
                  </Link>
                </h3>
                <p>Project Date: {memberDate}</p> {/* 日付を表示 */}
                <p>thumbnail</p>
                {/* <img src="https://picsum.photos/200" alt="" /> */}
                {post.properties.Thumbnail &&
                  post.properties.Thumbnail.files &&
                  post.properties.Thumbnail.files[0] && (
                    <img
                      src={post.properties.Thumbnail.files[0].file.url}
                      alt={post.properties.Name.title[0].plain_text}
                      className={styles.thumbnailImage}
                    />
                  )}
                <p className={styles.postDescription}>{date}</p>
                <Link href={`/members/${post.id}`}>
                  <a> Read more →</a>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getProjectsData(databaseId); // ここを変更

  // 日付の順番にソート
  const sortedPosts = database.sort((a, b) => {
    const dateA = new Date(a.properties.Date.date.start);
    const dateB = new Date(b.properties.Date.date.start);
    return dateB - dateA; // 降順（最新の日付から）。昇順にしたい場合は dateA - dateB とします。
  });

  return {
    props: {
      posts: database,
    },
    revalidate: 1000,
  };
};

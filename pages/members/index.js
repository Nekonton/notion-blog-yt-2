import Head from "next/head";
import Link from "next/link";
import { getMembersData } from "../../lib/notion"; // ここを変更
import { Text } from "../[id].js";
import styles from "../index.module.css"; // 必要に応じてスタイルを調整

export const databaseId = process.env.NOTION_MEMBERS_DB_ID; // ここを変更

export default function Members({ posts }) {
  return (
    <div>
      <Head>
        <title>Notion Next.js Members</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          {/* ロゴなどのコードは省略 */}
          <h1>Next.js + Notion API メンバー</h1>
          <p>
           メンバーの情報をNotionと連携して表示します。
          </p>
        </header>

        <h2 className={styles.heading}>All Members</h2>
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
            return (
              <li key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/members/${post.id}`}>
                    <a>
                      <Text text={post.properties.Name.title} />
                    </a>
                  </Link>
                </h3>

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
  const database = await getMembersData(databaseId); // ここを変更

  return {
    props: {
      posts: database,
    },
    revalidate: 100,
  };
};

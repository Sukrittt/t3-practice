import { type NextPage } from "next";
import Head from "next/head";

import { Pagelayout } from "~/components/layout";

const PostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <Pagelayout>
        <div>post id</div>
      </Pagelayout>
    </>
  );
};

export default PostPage;

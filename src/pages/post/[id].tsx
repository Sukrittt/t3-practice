import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { Pagelayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";
import { api } from "~/utils/api";

const IndividualPostView: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;

  if (typeof id !== "string") return null;

  const { data, isLoading } = api.posts.getById.useQuery({ id });

  if (isLoading && !data) return <LoadingPage />;

  if (!data) return <div>404 - User not found</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <Pagelayout>
        <PostView {...data} />
      </Pagelayout>
    </>
  );
};

export default IndividualPostView;

import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-x-3">
      <Image
        src={user.profileImageUrl}
        alt="profile image"
        className="rounded-full"
        height={56}
        width={56}
      />
      <input
        placeholder="Type some emogis!"
        className="grow rounded-md bg-transparent px-2 transition focus:outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div className="flex items-center gap-x-2 border-b border-slate-400 px-4 py-8">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className="rounded-full"
        height={56}
        width={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-x-2 text-slate-300 ">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{`· ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>

        <span className="">{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (!data && !isLoading) {
    return <div>No posts yet.</div>;
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl ">
          <div className="border-b border-slate-400 p-4">
            {user.isSignedIn ? (
              <CreatePostWizard />
            ) : (
              <Link
                href="sign-in"
                className="rounded-md bg-black p-2 text-white"
              >
                Sign in
              </Link>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="mt-2 text-center text-5xl font-extrabold">Posts</h1>
            <div className="flex flex-col ">
              {!data && isLoading ? (
                <p>Loading...</p>
              ) : (
                data?.map((fullPost) => (
                  <PostView key={fullPost.post.id} {...fullPost} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

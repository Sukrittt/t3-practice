import { type NextPage } from "next";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import LoadingSpinner, { LoadingPage } from "~/components/loading";
import { Pagelayout } from "~/components/layout";

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full items-center gap-x-3">
      <Image
        src={user.profileImageUrl}
        alt="profile image"
        className="rounded-full"
        height={56}
        width={56}
      />
      <input
        placeholder="Type some emogis!"
        className="disabled:bg-opacity/70 grow rounded-md bg-transparent px-2 transition focus:outline-none disabled:cursor-not-allowed"
        value={input}
        type="text"
        disabled={isPosting}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => mutate({ content: input })}
          className="transition hover:text-slate-300"
        >
          Post
        </button>
      )}

      {isPosting && <LoadingSpinner size={20} />}
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
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`· ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>

        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  if (postLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="space-y-4">
      <h1 className="mt-2 text-center text-5xl font-extrabold">Posts</h1>
      <div className="flex flex-col ">
        {data.map((fullPost) => (
          <PostView key={fullPost.post.id} {...fullPost} />
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //Start fetching asap and use cached data hereafter
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Pagelayout>
        <div className="border-b border-slate-400 p-4">
          {isSignedIn ? (
            <CreatePostWizard />
          ) : (
            <Link href="sign-in" className="rounded-md bg-black p-2 text-white">
              Sign in
            </Link>
          )}
        </div>

        <Feed />
      </Pagelayout>
    </>
  );
};

export default Home;

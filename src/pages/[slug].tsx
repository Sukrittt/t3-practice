import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { Pagelayout } from "~/components/layout";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.slug;

  if (typeof slug !== "string") return null;

  const username = slug.replace("@", "");

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (isLoading && !data) return <div>Loading...</div>;

  if (!data) return <div>404 - User not found</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <Pagelayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`@${data.username ?? ""}'s profile picture`}
            className="absolute bottom-0 left-0 -mb-[60px] ml-6 rounded-full border-[3px] border-black bg-black"
            height={120}
            width={120}
          />
        </div>
        <div className="h-[60px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400" />
      </Pagelayout>
    </>
  );
};

export default ProfilePage;

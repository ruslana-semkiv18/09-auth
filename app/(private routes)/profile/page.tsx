import Link from "next/link";
import Image from "next/image";
import { getMeServer } from "@/lib/api/serverApi";
import type { Metadata } from "next";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "User Profile | NoteHub",
  description: "User Profile in NoteHub",
  openGraph: {
    title: "User Profile | NoteHub",
    description: "User Profile in NoteHub",
    url: "https://09-auth-sandy-two.vercel.app/profile",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

export default async function Profile() {
  const user = await getMeServer();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}

"use client";

import { Bell, LogOut, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/components/AuthProvider";

interface UserData {
  username?: string;
  role?: string;
}

export default function Navbar() {
  const router = useRouter();

  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        }
      } catch (error) {
        console.error("Gagal ambil user:", error);
      }
    };

    fetchUser();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const avatarLabel = userData?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="border-b border-[#E5E5E5] bg-white">
      <div className="flex flex-col gap-5 px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-[#111111]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Monitor and manage across all your devices</p>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotif((prev) => !prev);
                setShowUserMenu(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[#111111] transition-colors hover:bg-[#FAFAFA]"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
            </button>

            {showNotif && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-[#E5E5E5] bg-white p-4 shadow-[0_16px_40px_rgba(17,17,17,0.08)]">
                <p className="text-sm font-semibold text-[#111111]">Notifications</p>
                <div className="mt-3 space-y-3 text-sm text-[#6B7280]">
                  <p>System health score remains stable.</p>
                  <p>Two devices refreshed within the last minute.</p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowNotif(false);
              }}
              className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white px-2 py-2 transition-colors hover:bg-[#FAFAFA]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white">
                {avatarLabel}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold text-[#111111]">{userData?.username || user?.email || "User"}</span>
                <span className="block text-xs text-[#6B7280]">{userData?.role || "Operator"}</span>
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-14 z-50 w-44 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white shadow-[0_16px_40px_rgba(17,17,17,0.08)]">
                <button className="flex w-full items-center gap-2 px-4 py-3 text-sm text-[#111111] hover:bg-[#FAFAFA]">
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 border-t border-[#E5E5E5] px-4 py-3 text-sm text-[#111111] hover:bg-[#FAFAFA]"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

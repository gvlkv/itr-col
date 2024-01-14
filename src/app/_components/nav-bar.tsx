import config from "~/util/config";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import Image from "next/image";

export default async function NavBar() {
  const session = await getServerAuthSession();
  return (
    <div className="navbar bg-base-200 sticky top-0 z-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{config.appLongName}</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        {session ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  width={40}
                  height={40}
                  alt={session?.user.name ?? ""}
                  src={session?.user.image ?? ""}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <Link href="/api/auth/signout">Sign out</Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex-1">
            <Link className="btn btn-ghost text-xl" href="/api/auth/signin">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
